"use client";

import { usePathname } from "next/navigation";

export default function GrainOverlay() {
  // The grain is a cinematic flourish for the home page; workspaces and
  // legal pages don't need the constant full-viewport blend cost.
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80] opacity-[0.035] mix-blend-overlay"
    >
      <div className="animate-grain h-[300%] w-[300%] -translate-x-1/4 -translate-y-1/4 bg-grain bg-[length:200px]" />
    </div>
  );
}
