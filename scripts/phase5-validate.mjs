/**
 * Phase 5 — full validation: GlassFront unit tests + browser gates + regressions.
 * Run: node scripts/phase5-validate.mjs
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
  "components/native-eagle/glassFrontShaders.js",
  "components/native-eagle/createGlassFrontMaterial.js",
  "components/native-eagle/shaders/glass-front-vertex.glsl",
  "components/native-eagle/shaders/glass-front-fragment-dispersion.glsl",
  "components/native-eagle/shaders/glass-front-fragment-simple.glsl",
  "scripts/generate-glass-front-shaders.mjs",
  "scripts/phase5-test-glass.mjs",
  "scripts/phase5-test-browser.mjs",
];

const fileChecks = requiredFiles.map((rel) => ({
  file: rel,
  exists: fs.existsSync(path.join(root, rel)),
}));

const steps = [
  run("GlassFront unit tests", process.execPath, ["scripts/phase5-test-glass.mjs"]),
  run("GlassBack unit regression", process.execPath, ["scripts/phase4-test-glass.mjs"]),
  run("Phase 1 tangent regression", process.execPath, ["scripts/phase1-test-tangent.mjs"]),
  run("Phase 3 env unit regression", process.execPath, ["scripts/phase3-test-env.mjs"]),
  run("Phase 5 browser glass gates", process.execPath, ["scripts/phase5-test-browser.mjs"]),
];

let browserResult = null;
try {
  const raw = steps[4].stdout || "";
  const start = raw.indexOf('{\n  "baseUrl"');
  browserResult = start >= 0 ? JSON.parse(raw.slice(start)) : {};
} catch {
  browserResult = { gates: {}, error: "parse failed" };
}

const gates = [
  {
    id: "phase5-files",
    pass: fileChecks.every((f) => f.exists),
    detail: `${fileChecks.filter((f) => f.exists).length}/${fileChecks.length} files`,
  },
  {
    id: "glass-front-unit-tests",
    pass: steps[0].ok,
    detail: steps[0].ok ? "shader + material factory pass" : "unit fail",
  },
  {
    id: "glass-back-regression",
    pass: steps[1].ok,
    detail: steps[1].ok ? "phase4 glass tests pass" : "regression failed",
  },
  {
    id: "phase1-regression",
    pass: steps[2].ok,
    detail: steps[2].ok ? "tangent tests pass" : "regression failed",
  },
  {
    id: "phase3-env-regression",
    pass: steps[3].ok,
    detail: steps[3].ok ? "env constants pass" : "regression failed",
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
  phase: 5,
  fileChecks,
  steps: steps.map((s) => ({ label: s.label, ok: s.ok })),
  browserDebug: browserResult.debug ?? null,
  cameraGate0: browserResult.cameraGate0 ?? null,
  assetStatus: browserResult.assetStatus ?? null,
  webglErrors: browserResult.webglErrors ?? [],
  gates,
  overallPass: gates.every((g) => g.pass),
};

fs.writeFileSync(path.join(docsDir, "PHASE-5-VALIDATION.json"), JSON.stringify(validation, null, 2));

console.log("\n=== GATE SUMMARY ===");
for (const g of gates) {
  console.log(`${g.pass ? "PASS" : "FAIL"} — ${g.id}: ${g.detail}`);
}
console.log(`\nOverall Phase 5: ${validation.overallPass ? "PASS" : "FAIL"}`);
process.exit(validation.overallPass ? 0 : 1);
