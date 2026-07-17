export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80] opacity-[0.035] mix-blend-overlay"
    >
      <div className="animate-grain h-[300%] w-[300%] -translate-x-1/4 -translate-y-1/4 bg-grain bg-[length:200px]" />
    </div>
  );
}
