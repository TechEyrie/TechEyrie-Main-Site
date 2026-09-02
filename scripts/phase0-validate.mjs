/**
 * Phase 0 — run all discovery/validation steps and emit PHASE-0-VALIDATION.json
 * Run: node scripts/phase0-validate.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const docsDir = path.join(root, "docs/native-eagle");
const baselineDir = path.join(docsDir, "baseline");

function run(label, cmd, args) {
  console.log(`\n=== ${label} ===`);
  const r = spawnSync(cmd, args, { cwd: root, encoding: "utf8", shell: true });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  return { label, ok: r.status === 0, status: r.status };
}

const steps = [
  run("Extract bundle", "node", ["scripts/phase0-extract-bundle.mjs"]),
  run("Inspect GLB", "node", ["scripts/phase0-inspect-glb.mjs"]),
];

const inventoryPath = path.join(docsDir, "PHASE-0-INVENTORY.json");
const glbPath = path.join(baselineDir, "glb-inspection.json");
const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
const glb = JSON.parse(fs.readFileSync(glbPath, "utf8"));

const requiredShaders = [
  "glass-back-vertex.glsl",
  "glass-back-fragment-dispersion.glsl",
  "glass-back-fragment-simple.glsl",
  "glass-front-vertex.glsl",
  "glass-front-fragment-dispersion.glsl",
  "glass-front-fragment-simple.glsl",
];

const shaderChecks = requiredShaders.map((f) => ({
  file: f,
  exists: fs.existsSync(path.join(docsDir, "shaders/original", f)),
  lines: inventory.extractedShaders[f] ?? 0,
}));

const assetChecks = inventory.heroAssets.critical.map((a) => ({
  key: a.key,
  path: a.path.replace(/^\//, "public/"),
  exists: fs.existsSync(path.join(root, a.path.replace(/^\//, "public/"))),
}));

const gates = [
  {
    id: "bundle-parsed",
    pass: inventory.assetsManagerKeys.length >= 10,
    detail: `${inventory.assetsManagerKeys.length} assetsManager keys`,
  },
  {
    id: "glass-uniforms",
    pass: inventory.glassUniforms.length >= 20,
    detail: `${inventory.glassUniforms.length} @Glass uniforms`,
  },
  {
    id: "glass-config",
    pass: inventory.glassConfig && Object.keys(inventory.glassConfig).length >= 20,
    detail: `${inventory.glassConfig ? Object.keys(inventory.glassConfig).length : 0} glassConfig params`,
  },
  {
    id: "all-shaders-extracted",
    pass: shaderChecks.every((s) => s.exists && s.lines > 10),
    detail: shaderChecks.map((s) => `${s.file}:${s.lines}L`).join(", "),
  },
  {
    id: "bird-meshes",
    pass: glb.bird.meshCount >= 18,
    detail: `${glb.bird.meshCount} meshes in v20.glb`,
  },
  {
    id: "glass-vertex-attrs",
    pass: glb.bird.glassAttributes.hasDist && glb.bird.glassAttributes.hasTangent,
    detail: JSON.stringify(glb.bird.glassAttributes),
  },
  {
    id: "sorter-mesh-coverage",
    pass: glb.validation.sorterMeshMissing.length === 0,
    detail: glb.validation.sorterMeshMissing.length
      ? `missing: ${glb.validation.sorterMeshMissing.join(", ")}`
      : "all 18 sorter meshes present",
  },
  {
    id: "cam-timeline",
    pass: glb.camera.animations.length >= 2,
    detail: glb.camera.animations.map((a) => `${a.name}@${a.duration}s`).join(", "),
  },
  {
    id: "critical-assets-on-disk",
    pass: assetChecks.every((a) => a.exists),
    detail: assetChecks.filter((a) => !a.exists).map((a) => a.path).join(", ") || "all present",
  },
];

const baselineCapture = path.join(baselineDir, "baseline-capture.json");
const baselineExists = fs.existsSync(baselineCapture);
gates.push({
  id: "baseline-screenshots",
  pass: baselineExists && fs.readdirSync(baselineDir).some((f) => f.endsWith(".png")),
  detail: baselineExists ? "capture json present" : "run phase0-baseline-capture.mjs (optional gate)",
  optional: true,
});

const validation = {
  generatedAt: new Date().toISOString(),
  steps,
  shaderChecks,
  assetChecks,
  gates,
  overallPass: gates.filter((g) => !g.optional).every((g) => g.pass),
  optionalBaselinePass: gates.find((g) => g.id === "baseline-screenshots")?.pass ?? false,
};

fs.writeFileSync(path.join(docsDir, "PHASE-0-VALIDATION.json"), JSON.stringify(validation, null, 2));
console.log("\n=== GATE SUMMARY ===");
for (const g of gates) {
  console.log(`${g.pass ? "PASS" : "FAIL"}${g.optional ? " (optional)" : ""} — ${g.id}: ${g.detail}`);
}
console.log(`\nOverall Phase 0 (core): ${validation.overallPass ? "PASS" : "FAIL"}`);
process.exit(validation.overallPass ? 0 : 1);
