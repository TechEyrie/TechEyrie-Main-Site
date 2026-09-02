/**
 * Phase 1 — full validation (structure + unit + browser + build).
 * Run: node scripts/phase1-validate.mjs
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
  "components/native-eagle/constants.js",
  "components/native-eagle/createGltfLoader.js",
  "components/native-eagle/prepareGlassMesh.js",
  "components/native-eagle/retargetAnimation.js",
  "components/native-eagle/initNativeEagleScene.js",
  "components/native-eagle/NativeEagleHero.js",
  "components/native-eagle/index.js",
  "src/app/native-eagle/page.js",
];

const fileChecks = requiredFiles.map((rel) => ({
  file: rel,
  exists: fs.existsSync(path.join(root, rel)),
}));

const steps = [
  run("Tangent unit tests", process.execPath, ["scripts/phase1-test-tangent.mjs"]),
  run("Browser integration", process.execPath, ["scripts/phase1-test-browser.mjs"]),
];

let browserResult = null;
try {
  const raw = steps[1].stdout || "";
  const start = raw.indexOf('{\n  "baseUrl"');
  browserResult = start >= 0 ? JSON.parse(raw.slice(start)) : JSON.parse(raw);
} catch {
  browserResult = { gates: {}, error: "parse failed", raw: steps[1].stdout?.slice(-500) };
}

const gates = [
  {
    id: "module-scaffold",
    pass: fileChecks.every((f) => f.exists),
    detail: `${fileChecks.filter((f) => f.exists).length}/${fileChecks.length} files`,
  },
  {
    id: "no-glass-shaders-imported",
    pass: !fs
      .readFileSync(path.join(root, "components/native-eagle/initNativeEagleScene.js"), "utf8")
      .match(/glass-(front|back)-fragment|\.glsl|GlassFront|GlassBack/),
    detail: "Phase 1 uses placeholder MeshPhysicalMaterial only",
  },
  {
    id: "tangent-unit-tests",
    pass: steps[0].ok,
    detail: steps[0].ok ? "all unit tests pass" : "see output",
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
  phase: 1,
  fileChecks,
  steps: steps.map((s) => ({ label: s.label, ok: s.ok, status: s.status })),
  browserDebug: browserResult.debug ?? null,
  browserAfterScroll: browserResult.afterScroll ?? null,
  gates,
  overallPass: gates.every((g) => g.pass),
};

fs.writeFileSync(path.join(docsDir, "PHASE-1-VALIDATION.json"), JSON.stringify(validation, null, 2));

console.log("\n=== GATE SUMMARY ===");
for (const g of gates) {
  console.log(`${g.pass ? "PASS" : "FAIL"} — ${g.id}: ${g.detail}`);
}
console.log(`\nOverall Phase 1: ${validation.overallPass ? "PASS" : "FAIL"}`);
process.exit(validation.overallPass ? 0 : 1);
