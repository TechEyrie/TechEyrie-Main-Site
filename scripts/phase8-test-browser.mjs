/**
 * Phase 8 — browser: compare route, remount leak gate, native ready.
 * Run: node scripts/phase8-test-browser.mjs
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
  const result = {
    baseUrl,
    gates: {},
    remount: null,
    cameraGate0: null,
    phaseRegression: {},
    error: null,
    debug: null,
  };

  try {
    // --- /native-eagle ---
    await page.goto(baseUrl + '/native-eagle', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(
      () => window.__NATIVE_EAGLE_DEBUG__?.loaded === true,
      null,
      { timeout: 180000, polling: 500 },
    );

    result.debug = await page.evaluate(() => {
      const d = window.__NATIVE_EAGLE_DEBUG__;
      return {
        loaded: d.loaded,
        postComposerActive: d.postComposerActive,
        glassSorterReady: d.glassSorterReady,
        glassMeshCount: d.glassMeshCount,
        glassBackShaderCount: d.glassBackShaderCount,
        glassFrontShaderCount: d.glassFrontShaderCount,
        envLoaded: d.envLoaded,
        mountainsPresent: d.mountainsPresent,
        reflectorPresent: d.reflectorPresent,
        backgroundHex: d.backgroundHex,
        cameraFov: d.cameraFov,
        error: d.error,
      };
    });

    const sampled0 = await page.evaluate(() => window.__NATIVE_EAGLE_DEBUG__.sampleAtTime(0));
    result.cameraGate0 = {
      ...comparePose(sampled0, reference.checkpoints[0], reference.tolerance),
      actual: sampled0,
    };

    const d = result.debug;
    result.phaseRegression = {
      phase1_loaded: d.loaded === true && !d.error,
      phase2_camera: result.cameraGate0.pass === true && d.cameraFov === 25,
      phase3_env: d.envLoaded === true && d.mountainsPresent === true && d.reflectorPresent === true,
      phase4_5_glass: d.glassBackShaderCount >= 20 && d.glassFrontShaderCount >= 20,
      phase6_sorter: d.glassSorterReady === true && d.glassMeshCount >= 20,
      phase7_post: d.postComposerActive === true && d.backgroundHex === 15064825,
    };

    // --- /native-eagle-dev compare + remount (ref=0 skips iframe WebGL contention) ---
    await page.goto(baseUrl + '/native-eagle-dev?ref=0', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForSelector('[data-testid="native-status"]', { timeout: 60000 });
    await page.waitForFunction(
      () => document.querySelector('[data-testid="native-status"]')?.dataset?.ready === '1'
        && window.__NATIVE_EAGLE_DEBUG__?.loaded === true,
      null,
      { timeout: 180000, polling: 500 },
    );

    const iframeCount = await page.locator('iframe.native-eagle-compare__iframe').count();
    const slider = page.locator('input[type="range"][aria-label="Compare split"]');
    await slider.fill('35');
    const splitValue = await slider.inputValue();

    // Remount 5 times — require status ready after mount increment (avoid stale debug)
    let remountOk = true;
    let lastMount = 1;
    for (let i = 0; i < 5; i++) {
      const expectedMount = lastMount + 1;
      await page.evaluate(() => {
        const btn = document.querySelector('.native-eagle-compare__btn');
        if (!btn) throw new Error('Remount button missing');
        btn.click();
      });
      await page.waitForFunction(
        (expected) => {
          const mount = Number(
            document.querySelector('[data-mount-count]')?.getAttribute('data-mount-count') || 0,
          );
          if (mount < expected) return false;
          const ready =
            document.querySelector('[data-testid="native-status"]')?.dataset?.ready === '1';
          const pageStatus = document.querySelector('[data-status]')?.getAttribute('data-status');
          const d = window.__NATIVE_EAGLE_DEBUG__;
          return (
            ready &&
            pageStatus === 'ready' &&
            Boolean(d?.loaded && !d?.error)
          );
        },
        expectedMount,
        { timeout: 120000, polling: 400 },
      );
      const mountAttr = await page.locator('[data-mount-count]').getAttribute('data-mount-count');
      const n = Number(mountAttr || 0);
      if (!(n > lastMount)) remountOk = false;
      lastMount = n;
      const canvases = await page.locator('.native-eagle-canvas-host canvas').count();
      if (canvases !== 1) remountOk = false;
    }

    result.remount = { remountOk, lastMount, iframeCount, splitValue };

    result.gates = {
      nativeRouteLoaded: result.phaseRegression.phase1_loaded,
      phase2_camera: result.phaseRegression.phase2_camera,
      phase3_env: result.phaseRegression.phase3_env,
      phase4_5_glass: result.phaseRegression.phase4_5_glass,
      phase6_sorter: result.phaseRegression.phase6_sorter,
      phase7_post: result.phaseRegression.phase7_post,
      compareRefSkipped: iframeCount === 0,
      compareSliderWorks: splitValue === '35',
      remountFiveTimes: remountOk === true && lastMount >= 6,
      singleCanvasAfterRemount: remountOk === true,
      canvasPresent: await page.locator('.native-eagle-canvas-host canvas').count().then((c) => c === 1),
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

const tmpScript = path.join(outDir, "_phase8-browser.cjs");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(tmpScript, probeScript);

spawnSync("npm", ["install", "--no-save", "playwright@1.49.1"], { cwd: root, shell: true, stdio: "pipe" });

const run = spawnSync(process.execPath, [tmpScript, BASE_URL], {
  cwd: root,
  encoding: "utf8",
  timeout: 600000,
});

if (run.stdout) process.stdout.write(run.stdout);
if (run.stderr) process.stderr.write(run.stderr);

try {
  fs.unlinkSync(tmpScript);
} catch {
  /* ignore */
}

process.exit(run.status ?? 1);
