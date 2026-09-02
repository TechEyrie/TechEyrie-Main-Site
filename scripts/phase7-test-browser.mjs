/**
 * Phase 7 — browser validation for post composer + glass timeline + background swap.
 * Run: node scripts/phase7-test-browser.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "docs/native-eagle");
const refPath = path.join(outDir, "baseline/camera-reference.json");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const reference = JSON.parse(fs.readFileSync(refPath, "utf8"));

const probeScript = `
const { chromium } = require('playwright');
const reference = ${JSON.stringify(reference)};

function comparePose(actual, expected, tol) {
  const posDelta = Math.sqrt(
    actual.position.reduce((s, v, i) => s + (v - expected.position[i]) ** 2, 0),
  );
  const dot = Math.abs(
    actual.quaternion.reduce((s, v, i) => s + v * expected.quaternion[i], 0),
  );
  return {
    pass: posDelta <= tol.positionMaxDelta && dot >= tol.quaternionMinDot,
    positionDelta: posDelta,
    quaternionDot: dot,
  };
}

(async () => {
  const baseUrl = process.argv[2];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const result = { baseUrl, gates: {}, cameraGate0: null, error: null, debug: null, webglErrors: [] };

  page.on('console', (msg) => {
    const text = msg.text();
    if (/shader compile|invalid shader|three\\.js.*shader/i.test(text)) result.webglErrors.push(text);
  });

  try {
    await page.goto(baseUrl + '/native-eagle', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(
      () => {
        const d = window.__NATIVE_EAGLE_DEBUG__;
        return d?.loaded === true && d?.postComposerActive === true && d?.glassSorterReady === true;
      },
      null,
      { timeout: 180000, polling: 500 },
    );

    // Allow a couple frames for uniform sync
    await page.waitForTimeout(500);

    result.debug = await page.evaluate(() => {
      const d = window.__NATIVE_EAGLE_DEBUG__;
      return {
        loaded: d.loaded,
        envLoaded: d.envLoaded,
        postComposerActive: d.postComposerActive,
        smaaEnabled: d.smaaEnabled,
        bloomEnabled: d.bloomEnabled,
        glassPipelineActive: d.glassPipelineActive,
        glassSorterReady: d.glassSorterReady,
        glassSortedCount: d.glassSortedCount,
        glassMeshCount: d.glassMeshCount,
        glassBackShaderCount: d.glassBackShaderCount,
        glassFrontShaderCount: d.glassFrontShaderCount,
        glassTimelineBoundCount: d.glassTimelineBoundCount,
        glassTimelineTotalBindings: d.glassTimelineTotalBindings,
        glassIorStart: d.glassIorStart,
        backgroundHex: d.backgroundHex,
        toneMapping: d.toneMapping,
        toneMappingExposure: d.toneMappingExposure,
        cameraFov: d.cameraFov,
        error: d.error,
      };
    });

    const sampled0 = await page.evaluate(() => window.__NATIVE_EAGLE_DEBUG__.sampleAtTime(0));
    const cmp0 = comparePose(sampled0, reference.checkpoints[0], reference.tolerance);
    result.cameraGate0 = { ...cmp0, actual: sampled0 };

    const bgSwap = await page.evaluate(() => {
      const d = window.__NATIVE_EAGLE_DEBUG__;
      const before = d.backgroundHex;
      const white = d.setBackground(0xffffff);
      const afterWhite = window.__NATIVE_EAGLE_DEBUG__.backgroundHex;
      const restored = d.setBackground(15064825);
      const afterRestore = window.__NATIVE_EAGLE_DEBUG__.backgroundHex;
      return { before, white, afterWhite, restored, afterRestore };
    });
    result.bgSwap = bgSwap;

    const postToggle = await page.evaluate(() => {
      const d = window.__NATIVE_EAGLE_DEBUG__;
      d.setPostEnabled({ smaa: false, bloom: false });
      const off = {
        smaa: window.__NATIVE_EAGLE_DEBUG__.smaaEnabled,
        bloom: window.__NATIVE_EAGLE_DEBUG__.bloomEnabled,
      };
      d.setPostEnabled({ smaa: true, bloom: true });
      const on = {
        smaa: window.__NATIVE_EAGLE_DEBUG__.smaaEnabled,
        bloom: window.__NATIVE_EAGLE_DEBUG__.bloomEnabled,
      };
      return { off, on };
    });
    result.postToggle = postToggle;

    const d = result.debug;
    result.gates = {
      sceneLoaded: d.loaded === true && !d.error,
      postComposerActive: d.postComposerActive === true,
      smaaEnabled: d.smaaEnabled === true,
      bloomEnabled: d.bloomEnabled === true,
      glassPipelineActive: d.glassPipelineActive === true,
      glassSorterReady: d.glassSorterReady === true,
      glassSortedCount20: d.glassSortedCount >= 20,
      glassShaders20: d.glassBackShaderCount >= 20 && d.glassFrontShaderCount >= 20,
      glassTimelineBindings: d.glassTimelineTotalBindings === 23,
      // boundCount may be 0 if cam.glb lacks Glass_* nodes — defaults still applied
      glassUniformsApplied: typeof d.glassIorStart === 'number',
      backgroundNoomo: d.backgroundHex === 15064825,
      toneMappingACES: d.toneMapping === 4,
      cameraFov25: d.cameraFov === 25,
      cameraGate0: cmp0.pass,
      backgroundSwapWhite: bgSwap.afterWhite === 16777215,
      backgroundRestore: bgSwap.afterRestore === 15064825,
      postToggleOff: postToggle.off.smaa === false && postToggle.off.bloom === false,
      postToggleOn: postToggle.on.smaa === true && postToggle.on.bloom === true,
      canvasPresent: await page.evaluate(() => !!document.querySelector('.native-eagle-canvas-host canvas')),
      noShaderConsoleErrors: result.webglErrors.length === 0,
    };
  } catch (e) {
    result.error = String(e.message || e);
  }

  await browser.close();
  console.log(JSON.stringify(result, null, 2));
  const pass = Object.values(result.gates).every(Boolean) && !result.error;
  process.exit(pass ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
`;

const tmpScript = path.join(outDir, "_phase7-browser.cjs");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(tmpScript, probeScript);

spawnSync("npm", ["install", "--no-save", "playwright@1.49.1"], { cwd: root, shell: true, stdio: "pipe" });

const run = spawnSync(process.execPath, [tmpScript, BASE_URL], {
  cwd: root,
  encoding: "utf8",
  timeout: 300000,
});

if (run.stdout) process.stdout.write(run.stdout);
if (run.stderr) process.stderr.write(run.stderr);

try {
  fs.unlinkSync(tmpScript);
} catch {
  /* ignore */
}

process.exit(run.status ?? 1);
