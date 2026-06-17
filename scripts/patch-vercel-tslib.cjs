#!/usr/bin/env node
/**
 * Post-build patch for Vercel serverless deployment.
 *
 * Problem: Nitro SSR chunks (_ssr/*.mjs) contain `import "tslib"` as a bare
 * module specifier. On Vercel Lambda there is no node_modules directory, so
 * Node.js cannot resolve this bare import and crashes with ERR_MODULE_NOT_FOUND.
 *
 * Fix A: Replace every `import "tslib"` in _ssr chunks with a relative import
 *        pointing to the already-bundled _libs/tslib.mjs placeholder.
 * Fix B (fallback): Create a minimal node_modules/tslib stub inside the function
 *        directory so Node.js module resolution finds it at runtime.
 */

const fs = require("fs");
const path = require("path");

// Support both CWD-relative and absolute paths
const CWD = process.cwd();
console.log(`[patch-tslib] CWD: ${CWD}`);

const FUNC_DIR = path.resolve(CWD, ".vercel", "output", "functions", "__server.func");
console.log(`[patch-tslib] FUNC_DIR: ${FUNC_DIR}`);
console.log(`[patch-tslib] FUNC_DIR exists: ${fs.existsSync(FUNC_DIR)}`);

if (!fs.existsSync(FUNC_DIR)) {
  console.log("[patch-tslib] Function directory not found – skipping.");
  process.exit(0);
}

const SSR_DIR = path.join(FUNC_DIR, "_ssr");
const libsDir = path.join(FUNC_DIR, "_libs");

// ── Fix A: Patch _ssr/*.mjs files ────────────────────────────────────────────
if (fs.existsSync(SSR_DIR)) {
  // Ensure the _libs/tslib.mjs placeholder exists
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
    const updated = original
      .replace(/^import "tslib";$/gm, 'import "../_libs/tslib.mjs";')
      .replace(/^import 'tslib';$/gm, "import '../_libs/tslib.mjs';");
    if (updated !== original) {
      fs.writeFileSync(fp, updated);
      console.log(`[patch-tslib] Fix A patched: ${file}`);
      patched++;
    }
  }
  console.log(`[patch-tslib] Fix A: ${patched}/${files.length} files patched.`);
} else {
  console.log("[patch-tslib] No _ssr directory – skipping Fix A.");
}

// ── Fix B: Create node_modules/tslib stub ────────────────────────────────────
const tslibNodeModules = path.join(FUNC_DIR, "node_modules", "tslib");
if (!fs.existsSync(tslibNodeModules)) {
  fs.mkdirSync(tslibNodeModules, { recursive: true });

  fs.writeFileSync(
    path.join(tslibNodeModules, "package.json"),
    JSON.stringify(
      {
        name: "tslib",
        version: "2.0.0",
        type: "module",
        exports: {
          ".": "./index.mjs",
          "./tslib.js": "./index.mjs",
          "./tslib.es6.js": "./index.mjs",
          "./tslib.es6.mjs": "./index.mjs",
        },
        main: "index.mjs",
        module: "index.mjs",
      },
      null,
      2
    )
  );

  fs.writeFileSync(
    path.join(tslibNodeModules, "index.mjs"),
    "// tslib runtime stub – helpers are inlined by TypeScript compiler\nexport {};\n"
  );

  console.log("[patch-tslib] Fix B: Created node_modules/tslib stub.");
} else {
  console.log("[patch-tslib] Fix B: node_modules/tslib already exists.");
}

console.log("[patch-tslib] Done.");
