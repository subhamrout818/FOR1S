import { cn } from "@/lib/utils";

interface SectionLabelProps {
  scene: string;
  title: string;
  className?: string;
  light?: boolean;
}

export default function SectionLabel({
  scene,
  title,
  className,
  light = false,
}: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="font-mono text-xs tracking-wideish text-accent">
        SC.{scene}
      </span>
      <span
        className={cn(
          "h-px w-8",
          light ? "bg-foreground/30" : "bg-hairline"
        )}
      />
      <span className="font-mono text-xs uppercase tracking-widest text-muted">
        {title}
      </span>
    </div>
  );
}
