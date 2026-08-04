"use client";

import { File, FileArchive, Film, Image as ImageIcon, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
  const { token, isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<WorkspaceData>("/api/portal", token);

  if (isLoading || !token) return null;

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
            Uploaded assets and final exports will land here, organised per project.
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
                    const downloadable = file.url && file.url !== "#";
                    return (
                      <a
                        key={file.id}
                        href={downloadable ? file.url : undefined}
                        target={downloadable ? "_blank" : undefined}
                        rel="noreferrer"
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
