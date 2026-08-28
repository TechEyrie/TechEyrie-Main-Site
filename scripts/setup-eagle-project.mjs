/**
 * Copies the scraped Noomo storytelling site into public/eagle-project.
 * Asset URLs stay at their original absolute roots (/_nuxt, /models, …);
 * next.config.mjs rewrites those roots → /eagle-project/...
 * Only Nuxt baseURL is patched so the SPA router lives under /eagle-project.
 *
 * Re-run: npm run setup:eagle-project
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.join(
  root,
  "eagle-project",
  "storytelling.noomoagency.com - Copy",
);
const dest = path.join(root, "public", "eagle-project");

function rimraf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function warnTinyAssets(dir) {
  const suspects = [];
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (![".ttf", ".otf", ".woff", ".woff2", ".mp3", ".wav"].includes(ext)) {
        continue;
      }
      const size = fs.statSync(full).size;
      if (size < 500) suspects.push({ file: path.relative(dest, full), size });
    }
  };
  walk(dir);
  if (suspects.length) {
    console.warn(
      "Warning: tiny font/audio files (likely scrape stubs). Re-download if needed:",
    );
    for (const s of suspects) console.warn(`  - ${s.file} (${s.size}b)`);
  }
}

if (!fs.existsSync(src)) {
  console.error("Missing source:", src);
  process.exit(1);
}

console.log("Copying eagle-project → public/eagle-project …");
rimraf(dest);
copyDir(src, dest);

const indexPath = path.join(dest, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
html = html.replace(/baseURL:\s*"\/"/, 'baseURL: "/eagle-project/"');
// Keep buildAssetsDir as "/_nuxt/" — Next rewrites /_nuxt → /eagle-project/_nuxt
fs.writeFileSync(indexPath, html, "utf8");

warnTinyAssets(dest);
console.log("Patched Nuxt baseURL → /eagle-project/");

// Apply teal/turquoise default glass look
const patch = spawnSync(
  process.execPath,
  [path.join(__dirname, "patch-eagle-teal.mjs")],
  { cwd: root, stdio: "inherit" },
);
if (patch.status !== 0) {
  console.warn("Teal patch reported issues — check patch-eagle-teal.mjs");
}

console.log("Done:", dest);
