export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-hairline border-t-accent" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
        Loading
      </span>
    </div>
  );
}
