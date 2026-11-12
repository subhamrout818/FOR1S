"use client";

import { useMemo, useState } from "react";
import { Download, FileArchive, FileImage, FileText, Loader2, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import PageHeader from "@/components/portal/PageHeader";
import type { FileItem } from "@/lib/portal-types";
import { formatBytes, formatDate } from "@/lib/portal-format";
import { safeHref } from "@/lib/utils";

interface AdminFile extends FileItem {
  project: { id: string; name: string; slug: string; client: { id: string; name: string; email: string } };
  folder: { id: string; name: string; kind: string } | null;
  uploader: { id: string; name: string; email: string };
}

interface AdminFilesResponse {
  success: boolean;
  files: AdminFile[];
}

function iconFor(file: AdminFile) {
  if (file.mimeType?.startsWith("image/")) return <FileImage size={16} className="text-violet-400" />;
  if (file.name.toLowerCase().endsWith(".zip") || file.name.toLowerCase().endsWith(".rar")) return <FileArchive size={16} className="text-amber-400" />;
  return <FileText size={16} className="text-muted" />;
}

export default function AdminFilesPage() {
  const { isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<AdminFilesResponse>("/api/admin/files");
  const [query, setQuery] = useState("");
  const files = data?.files ?? [];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return files;
    return files.filter((file) =>
      [file.name, file.project.name, file.project.client.name, file.project.client.email, file.folder?.name ?? ""]
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [files, query]);
  const totalBytes = files.reduce((total, file) => total + (file.size ?? 0), 0);

  if (isLoading) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Files"
        title="Project files"
        sub="A studio-wide view of files attached to client projects. Open a project workspace to manage private image uploads."
      />

      {data && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-hairline bg-background/60 p-5">
            <p className="text-[10px] uppercase tracking-widest text-muted">Stored records</p>
            <p className="mt-2 font-display text-2xl font-semibold text-foreground">{files.length}</p>
          </div>
          <div className="rounded-2xl border border-hairline bg-background/60 p-5">
            <p className="text-[10px] uppercase tracking-widest text-muted">Combined listed size</p>
            <p className="mt-2 font-display text-2xl font-semibold text-foreground">{formatBytes(totalBytes)}</p>
          </div>
          <div className="rounded-2xl border border-hairline bg-background/60 p-5">
            <p className="text-[10px] uppercase tracking-widest text-muted">Projects with files</p>
            <p className="mt-2 font-display text-2xl font-semibold text-foreground">{new Set(files.map((file) => file.project.id)).size}</p>
          </div>
        </div>
      )}

      <div className="mb-5 flex items-center gap-3 rounded-xl border border-hairline bg-background/60 px-4">
        <Search size={16} className="shrink-0 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search file, client, project or folder"
          aria-label="Search project files"
          className="min-h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
        />
      </div>

      {loading && !data && (
        <div className="flex min-h-[30vh] items-center justify-center gap-3 text-sm text-muted">
          <Loader2 size={20} className="animate-spin text-accent" /> Loading project files…
        </div>
      )}

      {error && !data && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6 text-center">
          <p className="text-sm text-red-300">{error}</p>
          <button onClick={() => void reload()} className="mt-3 text-xs text-foreground underline underline-offset-4">Retry</button>
        </div>
      )}

      {data && files.length === 0 && (
        <div className="rounded-2xl border border-dashed border-hairline bg-background/40 p-10 text-center">
          <FileArchive size={28} className="mx-auto text-muted" />
          <p className="mt-3 font-display text-lg text-foreground">No project files found</p>
          <p className="mt-1 text-sm text-muted">File records will appear here when attached to projects.</p>
        </div>
      )}

      {data && files.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-hairline text-[10px] uppercase tracking-widest text-muted">
                  <th className="px-5 py-4 font-medium">File</th>
                  <th className="px-5 py-4 font-medium">Client / Project</th>
                  <th className="px-5 py-4 font-medium">Folder</th>
                  <th className="px-5 py-4 font-medium">Uploaded by</th>
                  <th className="px-5 py-4 font-medium">Size / Date</th>
                  <th className="px-5 py-4 text-right font-medium">Open</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((file) => {
                  const href = file.url.startsWith("r2://")
                    ? `/api/admin/files/${encodeURIComponent(file.id)}?download=1`
                    : file.url === "#" ? null : safeHref(file.url);
                  return (
                    <tr key={file.id} className="border-b border-hairline/60 last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {iconFor(file)}
                          <div className="min-w-0">
                            <p className="max-w-[240px] truncate font-medium text-foreground" title={file.name}>{file.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-muted">{file.mimeType ?? file.kind}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{file.project.client.name}</p>
                        <p className="text-xs text-muted">{file.project.name}</p>
                        <p className="text-[10px] text-muted/70">{file.project.client.email}</p>
                      </td>
                      <td className="px-5 py-4 text-muted">{file.folder?.name ?? "Unfiled"}</td>
                      <td className="px-5 py-4">
                        <p className="text-foreground/80">{file.uploader.name}</p>
                        <p className="text-[10px] text-muted">{file.uploader.email}</p>
                      </td>
                      <td className="px-5 py-4 text-muted">
                        <p>{formatBytes(file.size)}</p>
                        <p className="text-xs">{formatDate(file.createdAt, { month: "short", day: "2-digit", year: "numeric" })}</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {href ? (
                          <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-xs text-foreground/80 hover:border-accent/40 hover:text-accent">
                            <Download size={12} /> Open
                          </a>
                        ) : (
                          <span className="text-[10px] uppercase tracking-widest text-muted">Reference only</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-muted">No files match this search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
