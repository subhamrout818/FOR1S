"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Error
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        data-cursor="hover"
        onClick={reset}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-medium text-white transition-colors duration-300 hover:bg-accent-dim"
      >
        Try again
      </button>
    </div>
  );
}
