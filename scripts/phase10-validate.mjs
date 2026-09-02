/**
 * Phase 10 — full validation orchestrator.
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
  const r = spawnSync(cmd, args, {
    cwd: root,
    encoding: "utf8",
    shell: cmd !== process.execPath,
  });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  return { label, ok: r.status === 0, stdout: r.stdout };
}

const requiredFiles = [
  "components/native-eagle/glassConfig.js",
  "scripts/phase10-test-glass.mjs",
  "scripts/phase10-test-browser.mjs",
];

const fileChecks = requiredFiles.map((rel) => ({
  file: rel,
  exists: fs.existsSync(path.join(root, rel)),
}));

const steps = [
  run("Phase 10 glass unit tests", process.execPath, ["scripts/phase10-test-glass.mjs"]),
  run("Phase 9 integration regression", process.execPath, ["scripts/phase9-test-integration.mjs"]),
  run("Post/timeline regression", process.execPath, ["scripts/phase7-test-post.mjs"]),
  run("Phase 10 browser + regressions", process.execPath, ["scripts/phase10-test-browser.mjs"]),
];

let browserResult = {};
try {
  const raw = steps[3].stdout || "";
  const start = raw.indexOf('{\n  "baseUrl"');
  browserResult = start >= 0 ? JSON.parse(raw.slice(start)) : {};
} catch {
  browserResult = { gates: {}, error: "parse failed" };
}

const gates = [
  {
    id: "phase10-files",
    pass: fileChecks.every((f) => f.exists),
    detail: `${fileChecks.filter((f) => f.exists).length}/${fileChecks.length}`,
  },
  { id: "glass-unit", pass: steps[0].ok, detail: steps[0].ok ? "pass" : "fail" },
  { id: "phase9-integration", pass: steps[1].ok, detail: steps[1].ok ? "pass" : "fail" },
  { id: "post-regression", pass: steps[2].ok, detail: steps[2].ok ? "pass" : "fail" },
  { id: "browser-step", pass: steps[3].ok, detail: steps[3].ok ? "pass" : "fail" },
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
  gates.push({ id: "browser-gates-parsed", pass: false, detail: "no gates" });
}

const validation = {
  generatedAt: new Date().toISOString(),
  phase: 10,
  fileChecks,
  steps: steps.map((s) => ({ label: s.label, ok: s.ok })),
  browserDebug: browserResult.debug ?? null,
  compare: browserResult.compare ?? null,
  cameraGate0: browserResult.cameraGate0 ?? null,
  phaseRegression: browserResult.phaseRegression ?? null,
  gates,
  overallPass: gates.every((g) => g.pass),
};

fs.writeFileSync(path.join(docsDir, "PHASE-10-VALIDATION.json"), JSON.stringify(validation, null, 2));
console.log("\n=== GATE SUMMARY ===");
for (const g of gates) console.log(`${g.pass ? "PASS" : "FAIL"} — ${g.id}: ${g.detail}`);
console.log(`\nOverall Phase 10: ${validation.overallPass ? "PASS" : "FAIL"}`);
process.exit(validation.overallPass ? 0 : 1);
