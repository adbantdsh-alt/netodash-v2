#!/usr/bin/env node
/**
 * Post-build patch for Vercel serverless deployment.
 *
 * Problem: Nitro SSR chunks (_ssr/*.mjs) contain `import "tslib"` as a bare
 * module specifier. On Vercel Lambda there is no node_modules directory, so
 * Node.js cannot resolve this bare import and crashes with ERR_MODULE_NOT_FOUND.
 *
 * Fix: Replace every occurrence of `import "tslib"` in _ssr chunks with a
 * relative import pointing to the already-bundled _libs/tslib.mjs placeholder.
 */

const fs = require("fs");
const path = require("path");

const FUNC_DIR = path.join(
  ".vercel",
  "output",
  "functions",
  "__server.func"
);
const SSR_DIR = path.join(FUNC_DIR, "_ssr");

if (!fs.existsSync(SSR_DIR)) {
  console.log("[patch-tslib] No _ssr directory – skipping.");
  process.exit(0);
}

// Ensure the _libs/tslib.mjs placeholder exists (create it if missing)
const libsDir = path.join(FUNC_DIR, "_libs");
const tslibLib = path.join(libsDir, "tslib.mjs");
if (!fs.existsSync(tslibLib)) {
  if (!fs.existsSync(libsDir)) fs.mkdirSync(libsDir, { recursive: true });
  fs.writeFileSync(tslibLib, "// tslib placeholder\n");
  console.log("[patch-tslib] Created _libs/tslib.mjs placeholder.");
}

const files = fs.readdirSync(SSR_DIR).filter((f) => f.endsWith(".mjs"));
let patched = 0;

for (const file of files) {
  const fp = path.join(SSR_DIR, file);
  const original = fs.readFileSync(fp, "utf8");
  // Replace bare tslib side-effect import with relative path
  const updated = original.replace(
    /^import "tslib";$/gm,
    'import "../_libs/tslib.mjs";'
  );
  if (updated !== original) {
    fs.writeFileSync(fp, updated);
    console.log(`[patch-tslib] Patched: ${file}`);
    patched++;
  }
}

console.log(`[patch-tslib] Done – ${patched}/${files.length} files patched.`);
