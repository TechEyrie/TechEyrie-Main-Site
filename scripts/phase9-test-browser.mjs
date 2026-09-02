/**
 * Phase 9 — browser: eagle-project-2 compare lock + phase 1–8 regressions.
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

function isEqualGridColumns(cols) {
  if (!cols || typeof cols !== 'string') return false;
  const parts = cols.trim().split(/\\s+/);
  if (parts.length !== 2) return false;
  if (parts[0].includes('%')) return parts[0] === parts[1];
  if (parts[0].endsWith('px') && parts[1].endsWith('px')) {
    return Math.abs(parseFloat(parts[0]) - parseFloat(parts[1])) < 1;
  }
  if (parts[0].includes('fr')) return parts[0] === parts[1];
  return false;
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
    compare: null,
    error: null,
    debug: null,
  };

  try {
    // --- /eagle-project-2 reference reachable (standalone — embed=1 fails to load scene) ---
    const refRes = await page.goto(baseUrl + '/eagle-project-2/', {
      waitUntil: 'domcontentloaded',
      timeout: 120000,
    });
    const refOk = Boolean(refRes && refRes.ok());
    await page.waitForTimeout(12000);
    const refMeta = await page.evaluate(() => {
      let sceneLoaded = false;
      const canvas = document.querySelector('canvas');
      try {
        const store = document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia?._s?.get('sceneId');
        sceneLoaded = Boolean(
          store?.sceneLoaded || (canvas && canvas.width > 64 && canvas.height > 64),
        );
      } catch { /* ignore */ }
      return {
        canvas: document.querySelectorAll('canvas').length,
        sceneLoaded,
        canvasSize: canvas ? [canvas.width, canvas.height] : null,
      };
    });
    const refCanvas = refMeta.canvas;

    // --- /native-eagle regressions ---
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
        mountainsVisible: d.mountainsVisible,
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
      phase7_post: d.postComposerActive === true,
    };

    // --- /native-eagle-dev compare vs eagle-project-2 ---
    await page.goto(baseUrl + '/native-eagle-dev', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForSelector('[data-testid="native-status"]', { timeout: 60000 });
    await page.waitForFunction(
      () => document.querySelector('[data-testid="native-status"]')?.dataset?.ready === '1'
        && window.__NATIVE_EAGLE_DEBUG__?.loaded === true,
      null,
      { timeout: 180000, polling: 500 },
    );

    const compareMeta = await page.evaluate(() => {
      const root = document.querySelector('.native-eagle-compare');
      const iframe = document.querySelector('[data-testid="reference-iframe"]');
      const nativePane = document.querySelector('[data-testid="native-pane"]');
      const stage = document.querySelector('.native-eagle-compare__stage');
      const stageCols = stage ? getComputedStyle(stage).gridTemplateColumns : null;
      const d = window.__NATIVE_EAGLE_DEBUG__;
      return {
        dataReference: root?.getAttribute('data-reference'),
        iframeSrc: iframe?.getAttribute('src') || null,
        lockProgress: root?.getAttribute('data-lock-progress'),
        stageGridColumns: stageCols,
        split: root?.getAttribute('data-split'),
        bg: d?.backgroundHex,
        mountainsVisible: d?.mountainsVisible,
        scrollProgress: d?.scrollProgress,
        postComposerActive: d?.postComposerActive,
        smaaEnabled: d?.smaaEnabled,
        bloomEnabled: d?.bloomEnabled,
        wingNdc: d?.getWingMeshNdc?.(),
        hideMountainsAttr: document.querySelector('[data-hide-mountains]')?.getAttribute('data-hide-mountains'),
      };
    });

    result.compare = {
      ...compareMeta,
      refOk,
      refCanvas,
      refSceneLoaded: refMeta.sceneLoaded,
    };

    // split 50 → side-by-side grid
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"][aria-label="Compare split"]');
      if (!slider) throw new Error('Compare split slider missing');
      slider.value = '50';
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(2000);

    const visual = await page.evaluate(() => {
      const canvas = document.querySelector('.native-eagle-canvas-host canvas');
      const d = window.__NATIVE_EAGLE_DEBUG__;
      if (!canvas) return { error: 'no canvas' };
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) return { error: 'no gl' };
      const w = canvas.width;
      const h = canvas.height;
      const wing = d?.getWingMeshNdc?.();
      const sw = Math.max(1, Math.floor(w * 0.28));
      const sh = Math.max(1, Math.floor(h * 0.28));
      let x0 = Math.floor((w - sw) / 2);
      let y0 = Math.floor((h - sh) / 2);
      if (wing?.ndc) {
        x0 = Math.max(0, Math.min(w - sw, Math.floor((wing.ndc[0] * 0.5 + 0.5) * w - sw / 2)));
        y0 = Math.max(0, Math.min(h - sh, Math.floor((-wing.ndc[1] * 0.5 + 0.5) * h - sh / 2)));
      }
      const px = new Uint8Array(sw * sh * 4);
      gl.readPixels(x0, y0, sw, sh, gl.RGBA, gl.UNSIGNED_BYTE, px);
      let maxG = 0;
      let teal = 0;
      const total = sw * sh;
      for (let i = 0; i < px.length; i += 4) {
        const r = px[i];
        const g = px[i + 1];
        const b = px[i + 2];
        maxG = Math.max(maxG, g);
        if (g > 80 && g > r + 15 && g > b + 10) teal += 1;
      }
      return {
        maxG,
        tealPct: total ? Number(((teal / total) * 100).toFixed(1)) : 0,
        wingInView: wing?.inView ?? null,
        bodyInView: d?.getBodyBoneNdc?.()?.inView ?? null,
        sampleOrigin: [x0, y0, sw, sh],
      };
    });
    result.compare.visual = visual;

    const stageGridAt50 = await page.evaluate(() => {
      const stage = document.querySelector('.native-eagle-compare__stage');
      return stage ? getComputedStyle(stage).gridTemplateColumns : null;
    });
    result.compare.stageGridAt50 = stageGridAt50;
    result.compare.split = await page.evaluate(
      () => document.querySelector('.native-eagle-compare')?.getAttribute('data-split'),
    );

    // Remount 3× (lighter than phase 8; iframe present)
    let remountOk = true;
    let lastMount = 1;
    for (let i = 0; i < 3; i++) {
      const expectedMount = lastMount + 1;
      await page.evaluate(() => document.querySelector('.native-eagle-compare__btn')?.click());
      await page.waitForFunction(
        (expected) => {
          const mount = Number(document.querySelector('[data-mount-count]')?.getAttribute('data-mount-count') || 0);
          if (mount < expected) return false;
          return (
            document.querySelector('[data-testid="native-status"]')?.dataset?.ready === '1' &&
            window.__NATIVE_EAGLE_DEBUG__?.loaded === true &&
            !window.__NATIVE_EAGLE_DEBUG__?.error
          );
        },
        expectedMount,
        { timeout: 120000, polling: 400 },
      );
      lastMount = Number(await page.locator('[data-mount-count]').getAttribute('data-mount-count'));
      const canvases = await page.locator('.native-eagle-canvas-host canvas').count();
      if (canvases !== 1) remountOk = false;
    }

    result.remount = { remountOk, lastMount };

    const gridSplit50 =
      result.compare.split === '50' &&
      (typeof stageGridAt50 === 'string' &&
        (/50%/.test(stageGridAt50) || isEqualGridColumns(stageGridAt50)));

    result.gates = {
      eagleProject2Reachable: refOk === true,
      eagleProject2HasCanvas: refCanvas >= 1,
      eagleProject2SceneLoaded: refMeta.sceneLoaded === true,
      nativeRouteLoaded: result.phaseRegression.phase1_loaded,
      phase2_camera: result.phaseRegression.phase2_camera,
      phase3_env: result.phaseRegression.phase3_env,
      phase4_5_glass: result.phaseRegression.phase4_5_glass,
      phase6_sorter: result.phaseRegression.phase6_sorter,
      phase7_post: result.phaseRegression.phase7_post,
      compareUsesEagleProject2:
        compareMeta.dataReference === 'eagle-project-2' &&
        String(compareMeta.iframeSrc || '').includes('eagle-project-2'),
      compareLockProgress0: compareMeta.lockProgress === '0',
      compareEagle2ClearBg: compareMeta.bg === 1453348,
      compareMountainsHidden: compareMeta.mountainsVisible === false,
      compareGridSplit50: gridSplit50,
      comparePostActive: compareMeta.postComposerActive === true,
      compareWingInView: visual.wingInView === true,
      compareNativeTealVisible: visual.maxG > 80 && visual.tealPct >= 3,
      remountThreeTimes: remountOk === true && lastMount >= 4,
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

const tmpScript = path.join(outDir, "_phase9-browser.cjs");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(tmpScript, probeScript);

spawnSync("npm", ["install", "--no-save", "playwright@1.49.1"], {
  cwd: root,
  shell: true,
  stdio: "pipe",
});

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
