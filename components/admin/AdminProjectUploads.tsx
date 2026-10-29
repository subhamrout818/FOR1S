"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowDownToLine, ChevronDown, Eye, ImagePlus, Images, Loader2, RefreshCw, Trash2, X } from "lucide-react";

type UploadFile = {
  id: string;
  name: string;
  mimeType: string | null;
  size: number | null;
  kind: string;
  createdAt: string;
  uploader: { name: string; email: string };
};

type FilePayload = { success?: boolean; message?: string; files?: UploadFile[] };

function formatBytes(size: number | null) {
  if (size === null || !Number.isFinite(size)) return "Unknown size";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export default function AdminProjectUploads({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [preview, setPreview] = useState<UploadFile | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/projects/${encodeURIComponent(projectId)}/files`, { cache: "no-store" });
      const payload = await response.json() as FilePayload;
      if (!response.ok || !payload.success || !Array.isArray(payload.files)) {
        throw new Error(payload.message || "Could not load client uploads.");
      }
      setFiles(payload.files);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load client uploads.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) void loadFiles();
  }, [open, loadFiles, refreshKey]);

  async function deleteFile(file: UploadFile) {
    setDeletingId(file.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/projects/${encodeURIComponent(projectId)}/files`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: file.id }),
      });
      const payload = await response.json() as { success?: boolean; message?: string };
      if (!response.ok || !payload.success) throw new Error(payload.message || "Could not delete this image.");
      setFiles((current) => current.filter((item) => item.id !== file.id));
      setConfirmId(null);
      if (preview?.id === file.id) setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete this image.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="group/uploads inline-flex items-center gap-2 rounded-full border border-hairline bg-white/[0.025] px-3 py-1.5 text-[11px] font-medium text-foreground/75 transition-all duration-300 hover:border-accent/50 hover:bg-accent/[0.07] hover:text-foreground"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent"><Images size={12} /></span>
        Client uploads
        {files.length > 0 && <span className="rounded-full bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] text-accent">{files.length}</span>}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown size={13} /></motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.055] via-background/80 to-background/50"
            aria-label={`Client uploads for ${projectName}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent"><ImagePlus size={15} /></div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Client asset drop</p>
                  <p className="text-[10px] text-muted">Private uploads · {files.length} {files.length === 1 ? "image" : "images"}</p>
                </div>
              </div>
              <button type="button" onClick={() => setRefreshKey((key) => key + 1)} className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-2.5 py-1.5 text-[10px] text-muted transition-colors hover:border-accent/40 hover:text-foreground" aria-label="Refresh uploads">
                <RefreshCw size={11} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>

            {error && <p role="alert" className="mx-4 mt-3 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-2 text-xs text-red-300">{error}</p>}

            {loading && files.length === 0 ? (
              <div className="flex min-h-36 items-center justify-center gap-2 text-xs text-muted"><Loader2 size={16} className="animate-spin text-accent" /> Gathering uploads…</div>
            ) : files.length === 0 && !error ? (
              <div className="flex min-h-36 flex-col items-center justify-center px-5 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-hairline bg-white/[0.02] text-muted"><ImagePlus size={20} /></div>
                <p className="text-sm font-medium text-foreground">Nothing dropped here yet</p>
                <p className="mt-1 max-w-xs text-xs text-muted">When the client uploads images, they’ll show up here automatically.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3">
                {files.map((file, index) => (
                  <motion.article
                    key={file.id}
                    initial={{ opacity: 0, y: 12, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: Math.min(index * 0.045, 0.2), duration: 0.25 }}
                    className="group overflow-hidden rounded-xl border border-hairline/80 bg-[#0b0b0d]/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-[0_12px_36px_rgba(0,0,0,0.22)]"
                  >
                    <button type="button" onClick={() => setPreview(file)} className="relative block aspect-[4/3] w-full overflow-hidden bg-white/[0.025] text-left" aria-label={`Preview ${file.name}`}>
                      {/* Authenticated endpoint keeps the private R2 object out of public URLs. */}
                      <Image src={`/api/admin/files/${encodeURIComponent(file.id)}`} alt={file.name} width={640} height={480} unoptimized className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100"><Eye size={20} /></span>
                    </button>
                    <div className="p-3">
                      <p className="truncate text-xs font-medium text-foreground" title={file.name}>{file.name}</p>
                      <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-muted">
                        <span>{formatBytes(file.size)}</span><span>{formatDate(file.createdAt)}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                        <span className="truncate pr-2 text-[10px] text-muted" title={file.uploader.email}>by {file.uploader.name}</span>
                        <div className="flex shrink-0 items-center gap-1">
                          <a href={`/api/admin/files/${encodeURIComponent(file.id)}?download=1`} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/[0.07] hover:text-foreground" aria-label={`Download ${file.name}`} title="Download original"><ArrowDownToLine size={13} /></a>
                          <button type="button" onClick={() => setConfirmId(file.id)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-500/10 hover:text-red-300" aria-label={`Delete ${file.name}`} title="Delete image"><Trash2 size={13} /></button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {confirmId === file.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2 overflow-hidden rounded-lg border border-red-500/20 bg-red-500/[0.06] p-2.5">
                            <p className="flex items-center gap-1.5 text-[10px] font-medium text-red-200"><AlertTriangle size={12} /> Delete this image permanently?</p>
                            <div className="mt-2 flex gap-2">
                              <button type="button" onClick={() => void deleteFile(file)} disabled={deletingId === file.id} className="inline-flex items-center gap-1 rounded-md bg-red-500/15 px-2.5 py-1.5 text-[10px] font-medium text-red-200 transition-colors hover:bg-red-500/25 disabled:opacity-50">{deletingId === file.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />} Delete</button>
                              <button type="button" onClick={() => setConfirmId(null)} className="rounded-md px-2.5 py-1.5 text-[10px] text-muted hover:text-foreground">Keep it</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {preview && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setPreview(null); }}>
            <motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} transition={{ duration: 0.24 }} className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101012] shadow-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="min-w-0"><p className="truncate text-sm font-medium text-white">{preview.name}</p><p className="text-[10px] text-white/45">{formatBytes(preview.size)} · uploaded {formatDate(preview.createdAt)}</p></div>
                <div className="flex shrink-0 items-center gap-2">
                  <a href={`/api/admin/files/${encodeURIComponent(preview.id)}?download=1`} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-xs text-white/80 transition-colors hover:bg-white/10"><ArrowDownToLine size={13} /> Download</a>
                  <button type="button" onClick={() => setPreview(null)} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close preview"><X size={15} /></button>
                </div>
              </div>
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-3 sm:p-6">
                <Image src={`/api/admin/files/${encodeURIComponent(preview.id)}`} alt={preview.name} width={1600} height={1200} unoptimized className="max-h-[72vh] max-w-full rounded-lg object-contain" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
