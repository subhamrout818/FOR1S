/**
 * Captures the Glow & Co. demo hero into public/demo/glow-and-co/hero.png
 * using an installed Chrome/Edge in headless mode. Zero dependencies.
 *
 * Deterministic by design:
 *  - `?no-loader` skips the preloader
 *  - `--force-prefers-reduced-motion` freezes all animations at their base state
 *  - fonts + images are self-hosted, so nothing waits on the network
 *
 * Usage: node scripts/capture-glow-demo.mjs
 * Fallback: run `npm run dev`, then re-run (uses localhost if file:// fails).
 */

import { spawn } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const page = path.join(root, "public", "demo", "glow-and-co", "index.html");
const out = path.join(root, "public", "demo", "glow-and-co", "hero.png");
const fileUrl = "file:///" + page.replace(/\\/g, "/") + "?no-loader";

const candidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

const browser = candidates.find((p) => existsSync(p));

if (!browser) {
  console.error("✗ Chrome/Edge not found. Set CHROME_PATH or run with `npm run dev` and use the localhost fallback.");
  process.exit(1);
}

const args = [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-prefers-reduced-motion",
  "--run-all-compositor-stages-before-draw",
  "--window-size=1440,760",
  "--virtual-time-budget=4000",
  `--screenshot=${out}`,
  fileUrl,
];

console.log("Capturing:", fileUrl);
console.log("Browser:  ", browser);
console.log("Output:   ", out);

const child = spawn(browser, args, { stdio: "inherit" });

child.on("error", (err) => {
  console.error("✗ Failed to launch browser:", err.message);
  process.exit(1);
});

child.on("exit", (code) => {
  const ok = code === 0 && existsSync(out) && statSync(out).size > 10000;
  if (ok) {
    console.log(`✓ Screenshot OK (${statSync(out).size} bytes) -> ${out}`);
    process.exit(0);
  }
  console.error(
    "✗ Capture failed. If `file://` is blocked, run `npm run dev`, then set `CHROME_PATH` or pass a URL via the CHROME_URL env var."
  );
  process.exit(1);
});
