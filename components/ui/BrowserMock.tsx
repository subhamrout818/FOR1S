/* Stylized browser mockup — stands in for a real screenshot until the
   actual builds are photographed/screenshotted. Gradient + monogram so it
   reads as a site preview without faking a specific page. */
export default function BrowserMock({
  name,
  monogram,
  hue,
  className = "",
}: {
  name: string;
  monogram: string;
  hue: [string, string];
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-t-2xl border border-b-0 border-hairline ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-hairline bg-background/60 px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
        <span className="ml-3 hidden truncate font-mono text-[10px] text-muted sm:block">
          {name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com
        </span>
      </div>
      <div
        className="flex h-40 items-center justify-center sm:h-48"
        style={{
          background: `radial-gradient(120% 120% at 50% 0%, ${hue[0]}33, ${hue[1]}22 55%, #101010 100%)`,
        }}
      >
        <span
          className="select-none font-display font-bold leading-none text-white/[0.14]"
          style={{ fontSize: "clamp(4rem, 10vw, 7rem)" }}
        >
          {monogram}
        </span>
      </div>
    </div>
  );
}
