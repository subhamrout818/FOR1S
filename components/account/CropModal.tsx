"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Cropper, { type Area } from "react-easy-crop";
import { Check, Loader2, RotateCcw, RotateCw, X } from "lucide-react";
import { getCroppedImg } from "./cropImage";
import type Lenis from "lenis";

/**
 * Full-screen crop dialog for a gallery photo. The image can be dragged to
 * reposition, zoomed (slider or pinch), and rotated before applying. Produces
 * a square JPEG avatar. `onApply` resolves to whether the photo was saved —
 * when it fails, the dialog stays open so the user can retry without
 * re-cropping.
 */
export default function CropModal({
  imageSrc,
  onCancel,
  onApply,
}: {
  imageSrc: string;
  onCancel: () => void;
  onApply: (dataUrl: string) => Promise<boolean>;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelledRef = useRef(false);

  const onCropComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) => setPixels(croppedAreaPixels),
    []
  );

  // A pending apply must never fire after the user cancels / the dialog closes.
  // Reset on mount: Next dev runs effects twice (StrictMode), so the cleanup
  // below would otherwise leave the flag stuck at true and silently drop Apply.
  useEffect(() => {
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  // Focus management, Escape-to-close, Tab trap, and scroll lock.
  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialog?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = (window as typeof window & { __lenis?: Lenis }).__lenis;
    lenis?.stop();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelledRef.current = true;
        onCancel();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;

      // Trap focus within the dialog.
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      previouslyFocused?.focus?.();
    };
  }, [onCancel]);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    onCancel();
  }, [onCancel]);

  const apply = async () => {
    if (!pixels || busy) return;
    setBusy(true);
    setErr("");
    try {
      const dataUrl = await getCroppedImg(imageSrc, pixels, rotation);
      if (cancelledRef.current) return; // cancelled mid-crop — discard
      const ok = await onApply(dataUrl);
      if (!ok) setErr("Could not save your photo. Please try again.");
    } catch (e) {
      if (!cancelledRef.current) {
        setErr(e instanceof Error ? e.message : "Could not crop the image");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Crop your photo"
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-background/95 px-6 outline-none backdrop-blur-sm"
    >
      <div className="flex w-full max-w-md flex-col gap-5">
        {/* Header */}
        <div className="flex w-full items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Crop your photo
          </p>
          <button
            data-cursor="hover"
            onClick={cancel}
            aria-label="Close crop dialog"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-foreground/70 transition-colors hover:border-accent/50 hover:text-accent"
          >
            <X size={18} />
          </button>
        </div>

        {/* Crop area */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-hairline bg-surface">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Zoom
            </span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              aria-label="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1 w-full cursor-pointer accent-accent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                data-cursor="hover"
                onClick={() => setRotation((r) => r - 90)}
                aria-label="Rotate left"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-foreground/70 transition-colors hover:border-accent/50 hover:text-accent"
              >
                <RotateCcw size={17} />
              </button>
              <button
                data-cursor="hover"
                onClick={() => setRotation((r) => r + 90)}
                aria-label="Rotate right"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-foreground/70 transition-colors hover:border-accent/50 hover:text-accent"
              >
                <RotateCw size={17} />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                data-cursor="hover"
                onClick={cancel}
                className="rounded-full border border-foreground/25 px-6 py-3 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                Cancel
              </button>
              <button
                data-cursor="hover"
                onClick={apply}
                disabled={busy || !pixels}
                className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Apply
              </button>
            </div>
          </div>

          {err && (
            <p role="alert" className="text-sm text-red-400">
              {err}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
