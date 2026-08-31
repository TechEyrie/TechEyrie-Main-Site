/**
 * eagle-project-4 — full Noomo storytelling hero at /eagle-project-4/
 * Same render pipeline as public/eagle-project/ (glass shaders, scroll, UI).
 * Re-run: npm run setup:eagle-project-4
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.join(root, "public/eagle-project");
const dest = path.join(root, "public/eagle-project-4");

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

if (!fs.existsSync(src)) {
  console.error("Missing public/eagle-project — run setup:eagle-project first");
  process.exit(1);
}

console.log("Creating eagle-project-4 from eagle-project …");
rimraf(dest);
fs.mkdirSync(dest, { recursive: true });

copyDir(path.join(src, "_nuxt"), path.join(dest, "_nuxt"));
fs.copyFileSync(path.join(src, "index.html"), path.join(dest, "index.html"));
if (fs.existsSync(path.join(src, "fav.png"))) {
  fs.copyFileSync(path.join(src, "fav.png"), path.join(dest, "fav.png"));
}

let html = fs.readFileSync(path.join(dest, "index.html"), "utf8");
html = html.replace(/\/eagle-project\//g, "/eagle-project-4/");
html = html.replace(
  'baseURL: "/eagle-project/"',
  'baseURL: "/eagle-project-4/"',
);
html = html.replace('"enabled": true', '"enabled": false');

fs.writeFileSync(path.join(dest, "index.html"), html);

const patchTeal = spawnSync(
  process.execPath,
  [
    path.join(__dirname, "patch-eagle-teal.mjs"),
    "--target",
    "eagle-project-4",
  ],
  { cwd: root, stdio: "inherit" },
);

if (patchTeal.status !== 0) {
  console.warn("Teal patch reported issues");
}

console.log("Done:", dest);
console.log("Open: /eagle-project-4/");
