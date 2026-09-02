/**
 * Phase 4 — full validation: glass unit tests + browser gates + regressions.
 * Run: node scripts/phase4-validate.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const docsDir = path.join(root, "docs/native-eagle");

function run(label, cmd, args) {
  console.log(`\n=== ${label} ===`);
  const r = spawnSync(cmd, args, { cwd: root, encoding: "utf8", shell: cmd !== process.execPath });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  return { label, ok: r.status === 0, status: r.status, stdout: r.stdout };
}

const requiredFiles = [
  "components/native-eagle/glassBackShaders.js",
  "components/native-eagle/createGlassBackMaterial.js",
  "components/native-eagle/createGlassPipeline.js",
  "components/native-eagle/loadGlassTextures.js",
  "components/native-eagle/shaders/glass-back-vertex.glsl",
  "components/native-eagle/shaders/glass-back-fragment-dispersion.glsl",
  "components/native-eagle/shaders/glass-back-fragment-simple.glsl",
  "public/eagle-project/textures/icen.jpg",
  "public/eagle-project/textures/LDR_RG01_0.png",
  "public/eagle-project/textures/noises.jpg",
  "scripts/generate-glass-back-shaders.mjs",
];

const fileChecks = requiredFiles.map((rel) => ({
  file: rel,
  exists: fs.existsSync(path.join(root, rel)),
}));

const steps = [
  run("Glass unit tests", process.execPath, ["scripts/phase4-test-glass.mjs"]),
  run("Phase 1 tangent regression", process.execPath, ["scripts/phase1-test-tangent.mjs"]),
  run("Phase 3 env unit regression", process.execPath, ["scripts/phase3-test-env.mjs"]),
  run("Phase 4 browser glass gates", process.execPath, ["scripts/phase4-test-browser.mjs"]),
];

let browserResult = null;
try {
  const raw = steps[3].stdout || "";
  const start = raw.indexOf('{\n  "baseUrl"');
  browserResult = start >= 0 ? JSON.parse(raw.slice(start)) : {};
} catch {
  browserResult = { gates: {}, error: "parse failed" };
}

const gates = [
  {
    id: "phase4-files",
    pass: fileChecks.every((f) => f.exists),
    detail: `${fileChecks.filter((f) => f.exists).length}/${fileChecks.length} files`,
  },
  {
    id: "glass-unit-tests",
    pass: steps[0].ok,
    detail: steps[0].ok ? "shader + material factory pass" : "unit fail",
  },
  {
    id: "phase1-regression",
    pass: steps[1].ok,
    detail: steps[1].ok ? "tangent tests pass" : "regression failed",
  },
  {
    id: "phase3-env-regression",
    pass: steps[2].ok,
    detail: steps[2].ok ? "env constants pass" : "regression failed",
  },
  ...Object.entries(browserResult.gates || {}).map(([id, pass]) => ({
    id: `browser-${id}`,
    pass: Boolean(pass),
    detail: String(pass),
  })),
];

if (browserResult.error) {
  gates.push({ id: "browser-error", pass: false, detail: browserResult.error });
}

const validation = {
  generatedAt: new Date().toISOString(),
  phase: 4,
  fileChecks,
  steps: steps.map((s) => ({ label: s.label, ok: s.ok })),
  browserDebug: browserResult.debug ?? null,
  cameraGate0: browserResult.cameraGate0 ?? null,
  assetStatus: browserResult.assetStatus ?? null,
  webglErrors: browserResult.webglErrors ?? [],
  gates,
  overallPass: gates.every((g) => g.pass),
};

fs.writeFileSync(path.join(docsDir, "PHASE-4-VALIDATION.json"), JSON.stringify(validation, null, 2));

console.log("\n=== GATE SUMMARY ===");
for (const g of gates) {
  console.log(`${g.pass ? "PASS" : "FAIL"} — ${g.id}: ${g.detail}`);
}
console.log(`\nOverall Phase 4: ${validation.overallPass ? "PASS" : "FAIL"}`);
process.exit(validation.overallPass ? 0 : 1);
