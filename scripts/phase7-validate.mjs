/**
 * Phase 7 — full validation: post unit tests + browser gates + regressions.
 * Run: node scripts/phase7-validate.mjs
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
  "components/native-eagle/createPostComposer.js",
  "components/native-eagle/syncGlassTimelineUniforms.js",
  "scripts/phase7-test-post.mjs",
  "scripts/phase7-test-browser.mjs",
];

const fileChecks = requiredFiles.map((rel) => ({
  file: rel,
  exists: fs.existsSync(path.join(root, rel)),
}));

const steps = [
  run("Post / timeline unit tests", process.execPath, ["scripts/phase7-test-post.mjs"]),
  run("GlassSorter unit regression", process.execPath, ["scripts/phase6-test-sorter.mjs"]),
  run("GlassFront unit regression", process.execPath, ["scripts/phase5-test-glass.mjs"]),
  run("Phase 7 browser post gates", process.execPath, ["scripts/phase7-test-browser.mjs"]),
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
    id: "phase7-files",
    pass: fileChecks.every((f) => f.exists),
    detail: `${fileChecks.filter((f) => f.exists).length}/${fileChecks.length} files`,
  },
  {
    id: "post-unit-tests",
    pass: steps[0].ok,
    detail: steps[0].ok ? "timeline + bloom defaults pass" : "unit fail",
  },
  {
    id: "sorter-regression",
    pass: steps[1].ok,
    detail: steps[1].ok ? "phase6 sorter tests pass" : "regression failed",
  },
  {
    id: "glass-front-regression",
    pass: steps[2].ok,
    detail: steps[2].ok ? "phase5 glass tests pass" : "regression failed",
  },
  {
    id: "browser-step",
    pass: steps[3].ok,
    detail: steps[3].ok ? "browser script exit 0" : "browser script failed",
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
  phase: 7,
  fileChecks,
  steps: steps.map((s) => ({ label: s.label, ok: s.ok })),
  browserDebug: browserResult.debug ?? null,
  cameraGate0: browserResult.cameraGate0 ?? null,
  bgSwap: browserResult.bgSwap ?? null,
  postToggle: browserResult.postToggle ?? null,
  webglErrors: browserResult.webglErrors ?? [],
  gates,
  overallPass: gates.every((g) => g.pass),
};

fs.writeFileSync(path.join(docsDir, "PHASE-7-VALIDATION.json"), JSON.stringify(validation, null, 2));

console.log("\n=== GATE SUMMARY ===");
for (const g of gates) {
  console.log(`${g.pass ? "PASS" : "FAIL"} — ${g.id}: ${g.detail}`);
}
console.log(`\nOverall Phase 7: ${validation.overallPass ? "PASS" : "FAIL"}`);
process.exit(validation.overallPass ? 0 : 1);
