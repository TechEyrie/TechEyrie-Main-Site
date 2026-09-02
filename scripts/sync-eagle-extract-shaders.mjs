/**
 * Publish canonical glass shaders → eagle-extract/ and regenerate native JS.
 * Source of truth: components/native-eagle/shaders/ (clean, single-main GLSL).
 * Do NOT copy raw bundle concatenations — they break Three.js (#include <common>).
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "components/native-eagle/shaders");
const destDir = path.join(root, "eagle-extract/shaders");

const files = [
  "glass-back-vertex.glsl",
  "glass-back-fragment-dispersion.glsl",
  "glass-back-fragment-simple.glsl",
  "glass-front-vertex.glsl",
  "glass-front-fragment-dispersion.glsl",
  "glass-front-fragment-simple.glsl",
];

let ok = true;
fs.mkdirSync(destDir, { recursive: true });
for (const file of files) {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  if (!fs.existsSync(src)) {
    console.error("Missing canonical shader", src);
    ok = false;
    continue;
  }
  const text = fs.readFileSync(src, "utf8");
  if ((text.match(/void main\s*\(/g) || []).length > 1) {
    console.error("Refusing to publish multi-main shader", file);
    ok = false;
    continue;
  }
  if (text.includes("#define saturate")) {
    console.error("Refusing to publish saturate redefine (Three.js common provides it)", file);
    ok = false;
    continue;
  }
  fs.copyFileSync(src, dest);
  console.log("published", file);
}

const run = spawnSync(process.execPath, [path.join(root, "scripts/sync-glass-shader-js.mjs")], {
  cwd: root,
  stdio: "inherit",
});

process.exit(ok && run.status === 0 ? 0 : 1);
