import { cn } from "@/lib/utils";
import type { StatusMeta } from "@/lib/portal-format";

/** Small status pill. Colour is always accompanied by the text label. */
export default function Badge({
  meta,
  className,
}: {
  meta: StatusMeta;
  className?: string;
}) {
  return (
    <span className={cn(meta.cls, className)}>
      {meta.label === "Due" || meta.label === "Overdue" ? (
        <span className="h-1 w-1 rounded-full bg-current" />
      ) : null}
      {meta.label}
    </span>
  );
}
