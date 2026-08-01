import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[42vw] max-h-[440px] w-[42vw] max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.14] blur-[110px]"
      />

      <div className="relative z-10 flex flex-col items-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          404 — Error
        </p>
        <h1 className="mt-6 font-display text-[clamp(4rem,15vw,10rem)] font-bold uppercase leading-[0.9] tracking-tightest text-foreground">
          Lost in space
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
          The page you&apos;re looking for drifted off course. Let&apos;s get
          you back to familiar ground.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            data-cursor="hover"
            className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-medium text-white transition-colors duration-300 hover:bg-accent-dim"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            data-cursor="hover"
            className="inline-flex items-center justify-center rounded-full border border-foreground/25 px-8 py-4 text-base font-medium text-foreground transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </main>
  );
}
