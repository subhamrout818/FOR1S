"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, X } from "lucide-react";

/**
 * Full-screen capture modal backed by the device camera (getUserMedia).
 * Frames a square crop from the live video and returns a JPEG data URL.
 */
export default function CameraCapture({
  onCapture,
  onClose,
}: {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera is not supported on this device.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
        setReady(true);
      })
      .catch(() => setError("Camera unavailable or permission denied."));

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Center-crop the video to a square before capturing.
    const side = Math.min(video.videoWidth, video.videoHeight);
    ctx.drawImage(
      video,
      (video.videoWidth - side) / 2,
      (video.videoHeight - side) / 2,
      side,
      side,
      0,
      0,
      size,
      size
    );

    onCapture(canvas.toDataURL("image/jpeg", 0.9));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-background/95 px-6 backdrop-blur-sm"
      >
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <div className="flex w-full items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Take a photo
            </p>
            <button
              data-cursor="hover"
              onClick={onClose}
              aria-label="Close camera"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-foreground/70 transition-colors hover:border-accent/50 hover:text-accent"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-hairline bg-surface">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            {!ready && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Loader2 size={24} className="animate-spin text-muted" />
                <p className="text-xs uppercase tracking-widest text-muted">
                  Starting camera…
                </p>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
                <p className="text-sm text-red-300">{error}</p>
                <button
                  data-cursor="hover"
                  onClick={onClose}
                  className="rounded-full border border-foreground/25 px-6 py-3 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  Go back
                </button>
              </div>
            )}
          </div>

          <button
            data-cursor="hover"
            onClick={capture}
            disabled={!ready}
            className="flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-white transition-colors duration-300 hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Camera size={16} />
            Capture photo
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
