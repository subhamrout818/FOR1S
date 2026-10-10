"use client";

import { useRef, useState } from "react";
import { File, FileArchive, Film, Image as ImageIcon, Loader2, UploadCloud } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import Reveal from "@/components/portal/Reveal";
import PageHeader from "@/components/portal/PageHeader";
import {
  FOLDER_KIND_LABEL,
  formatBytes,
  formatDate,
} from "@/lib/portal-format";
import type { WorkspaceData, FileItem } from "@/lib/portal-types";
import { cn, safeHref } from "@/lib/utils";

function fileIcon(file: FileItem) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".mp4") || name.endsWith(".mov") || name.endsWith(".webm"))
    return <Film size={16} className="text-blue-400" />;
  if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".webp"))
    return <ImageIcon size={16} className="text-violet-400" />;
  if (name.endsWith(".zip") || name.endsWith(".rar"))
    return <FileArchive size={16} className="text-amber-400" />;
  return <File size={16} className="text-foreground/60" />;
}

export default function FilesPage() {
  const { isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<WorkspaceData>("/api/portal");
  const inputRef = useRef<HTMLInputElement>(null);
  const [projectId, setProjectId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ text: string; error: boolean } | null>(null);
  const selectedProjectId = projectId || data?.activeProject?.id || data?.projects[0]?.id || "";

  async function handleUpload(file?: globalThis.File) {
    if (!file || !data) return;
    const extension = file.name.toLowerCase().match(/\\.[^.]+$/)?.[0] ?? "";
    const types: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif" };
    const mimeType = types[extension];
    if (!mimeType || (file.type && file.type !== mimeType)) {
      setUploadMessage({ text: "Choose a JPEG, PNG, WebP or GIF image.", error: true });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size <= 0 || file.size > 10 * 1024 * 1024) {
      setUploadMessage({ text: "Images must be 10 MB or smaller.", error: true });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (!selectedProjectId) {
      setUploadMessage({ text: "You need a project before uploading.", error: true });
      return;
    }
    setUploading(true);
    setUploadMessage({ text: "Preparing secure upload…", error: false });
    try {
      const intentResponse = await fetch("/api/portal/files/upload-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId: selectedProjectId, name: file.name, mimeType, size: file.size }) });
      const intent = await intentResponse.json();
      if (!intentResponse.ok || !intent.success) throw new Error(intent.message || "Could not prepare upload.");
      setUploadMessage({ text: "Uploading image…", error: false });
      const putResponse = await fetch(intent.uploadUrl, { method: "PUT", headers: { "Content-Type": mimeType }, body: file });
      if (!putResponse.ok) throw new Error("R2 rejected the upload. Check the bucket CORS policy.");
      setUploadMessage({ text: "Verifying image…", error: false });
      const completeResponse = await fetch("/api/portal/files/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId: intent.projectId, folderId: intent.folderId, objectKey: intent.objectKey, name: intent.name, mimeType: intent.mimeType, size: intent.size }) });
      const complete = await completeResponse.json();
      if (!completeResponse.ok || !complete.success) throw new Error(complete.message || "Could not save the image.");
      setUploadMessage({ text: "Image uploaded successfully.", error: false });
      await reload();
    } catch (err) {
      setUploadMessage({ text: err instanceof Error ? err.message : "Upload failed. Try again.", error: true });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (isLoading) return null;

  const folders = data?.folders ?? [];
  const totalFiles = folders.reduce((acc, f) => acc + f.files.length, 0);
  const totalSize = folders.reduce(
    (acc, f) => acc + f.files.reduce((a, file) => a + (file.size ?? 0), 0),
    0
  );

  return (
    <div>
      <PageHeader
        eyebrow="Files"
        title="Asset library"
        sub={`Your permanent library — brand assets, raw footage, finals and documents. ${totalFiles} files across ${folders.length} folders.`}
      />

      <section className="mb-6 rounded-2xl border border-hairline bg-background/60 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex-1 text-xs uppercase tracking-widest text-muted">
            Upload to project
            <select value={selectedProjectId} onChange={(event) => setProjectId(event.target.value)} disabled={uploading || !data?.projects.length} className="mt-2 block w-full rounded-xl border border-hairline bg-background px-3 py-3 text-sm normal-case tracking-normal text-foreground outline-none focus:border-accent">
              {!data?.projects.length && <option value="">No projects available</option>}
              {data?.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </label>
          <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => void handleUpload(event.target.files?.[0])} />
          <button type="button" data-cursor="hover" onClick={() => inputRef.current?.click()} disabled={uploading || loading || !data?.projects.length} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            {uploading ? "Uploading…" : "Upload image"}
          </button>
        </div>
        <p className="mt-3 text-xs text-muted">JPEG, PNG, WebP or GIF · 10 MB maximum per image · private project storage.</p>
        {uploadMessage && <p role="status" aria-live="polite" className={cn("mt-3 text-sm", uploadMessage.error ? "text-red-300" : "text-emerald-300")}>{uploadMessage.text}</p>}
      </section>

      {loading && !data && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm text-muted">Loading files…</p>
        </div>
      )}

      {error && !data && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl border border-accent/30 bg-accent/10 p-8 text-center">
          <p className="text-sm text-red-300">{error}</p>
          <button
            data-cursor="hover"
            onClick={reload}
            className="text-xs uppercase tracking-widest text-foreground/70 underline underline-offset-2 hover:text-accent"
          >
            Retry
          </button>
        </div>
      )}

      {data && folders.length === 0 && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-background/40 text-center">
          <FileArchive size={28} className="text-muted" />
          <p className="font-display text-lg text-foreground">No files yet</p>
          <p className="max-w-sm text-sm text-muted">
            Choose a project above and upload an image. Your private upload folder will be created automatically.
          </p>
        </div>
      )}

      {data && folders.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {folders.map((folder, i) => (
            <Reveal key={folder.id} delay={(i % 4) * 0.05}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-background/60">
                <div className="flex items-center justify-between border-b border-hairline/60 px-6 py-4">
                  <div>
                    <p className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
                      {folder.name}
                    </p>
                    <p className="text-xs text-muted">
                      {FOLDER_KIND_LABEL[folder.kind] ?? folder.kind} ·{" "}
                      {folder.project?.name}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted">
                    {folder.files.length}
                  </span>
                </div>

                <div className="flex-1 divide-y divide-hairline/60">
                  {folder.files.length === 0 && (
                    <p className="px-6 py-5 text-sm text-muted">Empty folder.</p>
                  )}
                  {folder.files.map((file) => {
                    const href = file.url.startsWith("r2://") ? `/api/portal/files/${file.id}` : safeHref(file.url);
                    const downloadable = !!href;
                    return (
                      <a
                        key={file.id}
                        href={href}
                        target={downloadable ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        data-cursor={downloadable ? "hover" : undefined}
                        className={cn(
                          "flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-white/[0.02]",
                          !downloadable && "cursor-default opacity-70"
                        )}
                      >
                        {fileIcon(file)}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">
                            {file.name}
                          </span>
                          <span className="block text-xs text-muted">
                            {formatBytes(file.size)} · {formatDate(file.createdAt, { month: "short", day: "2-digit" })}
                          </span>
                        </span>
                        {!downloadable && (
                          <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-muted">
                            demo
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {data && folders.length > 0 && (
        <p className="mt-6 text-center text-xs text-muted">
          {totalFiles} files · {formatBytes(totalSize)} across your projects.
        </p>
      )}
    </div>
  );
}
