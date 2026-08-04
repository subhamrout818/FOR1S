import { cn } from "@/lib/utils";

/**
 * Consistent page title block for portal pages.
 * `eyebrow` renders the mono kicker above the title.
 */
export default function PageHeader({
  eyebrow,
  title,
  sub,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div>
        {eyebrow && (
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs tracking-wideish text-accent">
              FOR1S
            </span>
            <span className="h-px w-8 bg-hairline" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="font-display text-3xl font-semibold tracking-tightest text-foreground md:text-4xl">
          {title}
        </h1>
        {sub && <p className="mt-2 max-w-xl text-sm text-muted">{sub}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
