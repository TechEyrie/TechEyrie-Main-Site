/**
 * Phase 2 — full validation: reference baseline + camera gates + Phase 1 regression.
 * Run: node scripts/phase2-validate.mjs
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
  "components/native-eagle/cameraPose.js",
  "docs/native-eagle/baseline/camera-reference.json",
  "scripts/phase2-extract-camera-baseline.mjs",
  "scripts/phase2-test-camera.mjs",
];

const fileChecks = requiredFiles.map((rel) => ({
  file: rel,
  exists: fs.existsSync(path.join(root, rel)),
}));

const steps = [
  run("Extract camera reference", process.execPath, ["scripts/phase2-extract-camera-baseline.mjs"]),
  run("Phase 1 tangent regression", process.execPath, ["scripts/phase1-test-tangent.mjs"]),
  run("Phase 2 camera gates", process.execPath, ["scripts/phase2-test-camera.mjs"]),
];

let cameraResult = null;
try {
  const raw = steps[2].stdout || "";
  const start = raw.indexOf('{\n  "baseUrl"');
  cameraResult = start >= 0 ? JSON.parse(raw.slice(start)) : {};
} catch {
  cameraResult = { gates: {}, error: "parse failed" };
}

const ref = JSON.parse(
  fs.readFileSync(path.join(docsDir, "baseline/camera-reference.json"), "utf8"),
);

const gates = [
  {
    id: "phase2-files",
    pass: fileChecks.every((f) => f.exists),
    detail: `${fileChecks.filter((f) => f.exists).length}/${fileChecks.length} files`,
  },
  {
    id: "camera-reference",
    pass: ref.checkpoints?.length === 3,
    detail: `${ref.checkpoints?.length ?? 0} reference checkpoints`,
  },
  {
    id: "reference-extract",
    pass: steps[0].ok,
    detail: steps[0].ok ? "cam.glb baseline regenerated" : "extract failed",
  },
  {
    id: "phase1-regression",
    pass: steps[1].ok,
    detail: steps[1].ok ? "tangent tests pass" : "regression failed",
  },
  ...(cameraResult.checkpoints ?? []).map((cp, i) => ({
    id: `camera-gate-${cp.progress}`,
    pass: cp.pass,
    detail: `Δpos=${cp.positionDelta?.toFixed(4)} dot=${cp.quaternionDot?.toFixed(6)} @ t=${cp.timelineTime}s`,
  })),
  ...Object.entries(cameraResult.gates || {}).map(([id, pass]) => ({
    id: `browser-${id}`,
    pass: Boolean(pass),
    detail: String(pass),
  })),
];

if (cameraResult.error) {
  gates.push({ id: "browser-error", pass: false, detail: cameraResult.error });
}

const validation = {
  generatedAt: new Date().toISOString(),
  phase: 2,
  fileChecks,
  steps: steps.map((s) => ({ label: s.label, ok: s.ok })),
  cameraCheckpoints: cameraResult.checkpoints ?? [],
  pinScroll: cameraResult.pinScroll ?? null,
  gates,
  overallPass: gates.every((g) => g.pass),
};

fs.writeFileSync(path.join(docsDir, "PHASE-2-VALIDATION.json"), JSON.stringify(validation, null, 2));

console.log("\n=== GATE SUMMARY ===");
for (const g of gates) {
  console.log(`${g.pass ? "PASS" : "FAIL"} — ${g.id}: ${g.detail}`);
}
console.log(`\nOverall Phase 2: ${validation.overallPass ? "PASS" : "FAIL"}`);
process.exit(validation.overallPass ? 0 : 1);
