// Node module-resolution hooks for the test runner:
//  - "@/..." path aliases (tsconfig "paths") -> repo files
//  - extension-less relative imports -> ".ts" files (TypeScript style)
//  - modules that need a server runtime or a real database -> fakes in tests/fakes
// Nothing here is used by the app or the production build.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const FAKES = {
  "@/lib/prisma": "tests/fakes/prisma.ts",
  "next/server": "tests/fakes/next-server.ts",
  "next/headers": "tests/fakes/next-headers.ts",
};

function withTs(base) {
  for (const candidate of [base, `${base}.ts`, path.join(base, "index.ts")]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  const [bare, query] = specifier.split("?");
  const suffix = query ? `?${query}` : "";

  if (FAKES[bare]) {
    return { url: pathToFileURL(path.join(root, FAKES[bare])).href, shortCircuit: true };
  }
  if (bare.startsWith("@/")) {
    const file = withTs(path.join(root, bare.slice(2)));
    if (file) return { url: pathToFileURL(file).href + suffix, shortCircuit: true };
  }
  if ((bare.startsWith("./") || bare.startsWith("../")) && context.parentURL?.startsWith("file:")) {
    const file = withTs(path.resolve(path.dirname(fileURLToPath(context.parentURL)), bare));
    if (file) return { url: pathToFileURL(file).href + suffix, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
