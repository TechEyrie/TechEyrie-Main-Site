/**
 * Phase 6 — full validation: sorter unit tests + browser gates + regressions.
 * Run: node scripts/phase6-validate.mjs
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
  "components/native-eagle/createGlassSorter.js",
  "components/native-eagle/createLayerController.js",
  "components/native-eagle/createGlassPipeline.js",
  "scripts/phase6-test-sorter.mjs",
  "scripts/phase6-test-browser.mjs",
];

const fileChecks = requiredFiles.map((rel) => ({
  file: rel,
  exists: fs.existsSync(path.join(root, rel)),
}));

const steps = [
  run("GlassSorter unit tests", process.execPath, ["scripts/phase6-test-sorter.mjs"]),
  run("GlassFront unit regression", process.execPath, ["scripts/phase5-test-glass.mjs"]),
  run("GlassBack unit regression", process.execPath, ["scripts/phase4-test-glass.mjs"]),
  run("Phase 1 tangent regression", process.execPath, ["scripts/phase1-test-tangent.mjs"]),
  run("Phase 6 browser sorter gates", process.execPath, ["scripts/phase6-test-browser.mjs"]),
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
    id: "phase6-files",
    pass: fileChecks.every((f) => f.exists),
    detail: `${fileChecks.filter((f) => f.exists).length}/${fileChecks.length} files`,
  },
  {
    id: "sorter-unit-tests",
    pass: steps[0].ok,
    detail: steps[0].ok ? "GlassSorter trees + wing axis pass" : "unit fail",
  },
  {
    id: "glass-front-regression",
    pass: steps[1].ok,
    detail: steps[1].ok ? "phase5 glass tests pass" : "regression failed",
  },
  {
    id: "glass-back-regression",
    pass: steps[2].ok,
    detail: steps[2].ok ? "phase4 glass tests pass" : "regression failed",
  },
  {
    id: "phase1-regression",
    pass: steps[3].ok,
    detail: steps[3].ok ? "tangent tests pass" : "regression failed",
  },
  {
    id: "browser-step",
    pass: steps[4].ok,
    detail: steps[4].ok ? "browser script exit 0" : "browser script failed",
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

if (!browserResult.gates || Object.keys(browserResult.gates).length === 0) {
  gates.push({
    id: "browser-gates-parsed",
    pass: false,
    detail: "no browser gates JSON parsed",
  });
}

const validation = {
  generatedAt: new Date().toISOString(),
  phase: 6,
  fileChecks,
  steps: steps.map((s) => ({ label: s.label, ok: s.ok })),
  browserDebug: browserResult.debug ?? null,
  cameraGate0: browserResult.cameraGate0 ?? null,
  scrollSortSamples: browserResult.scrollSortSamples ?? [],
  uniqueSortOrders: browserResult.uniqueSortOrders ?? null,
  webglErrors: browserResult.webglErrors ?? [],
  gates,
  overallPass: gates.every((g) => g.pass),
};

fs.writeFileSync(path.join(docsDir, "PHASE-6-VALIDATION.json"), JSON.stringify(validation, null, 2));

console.log("\n=== GATE SUMMARY ===");
for (const g of gates) {
  console.log(`${g.pass ? "PASS" : "FAIL"} — ${g.id}: ${g.detail}`);
}
console.log(`\nOverall Phase 6: ${validation.overallPass ? "PASS" : "FAIL"}`);
process.exit(validation.overallPass ? 0 : 1);
