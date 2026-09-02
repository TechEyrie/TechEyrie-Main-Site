/**
 * Phase 10 — browser: glass override gates + eagle-2 compare + prior regressions.
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
  const result = { baseUrl, gates: {}, error: null, debug: null, compare: null, cameraGate0: null, phaseRegression: {} };

  try {
    await page.goto(baseUrl + '/native-eagle', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(() => window.__NATIVE_EAGLE_DEBUG__?.loaded === true, null, { timeout: 180000 });
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
        glassOverridesActive: d.glassOverridesActive,
        error: d.error,
      };
    });
    const sampled0 = await page.evaluate(() => window.__NATIVE_EAGLE_DEBUG__.sampleAtTime(0));
    result.cameraGate0 = { ...comparePose(sampled0, reference.checkpoints[0], reference.tolerance), actual: sampled0 };
    const d = result.debug;
    result.phaseRegression = {
      phase1_loaded: d.loaded === true && !d.error,
      phase2_camera: result.cameraGate0.pass === true && d.cameraFov === 25,
      phase3_env: d.envLoaded === true && d.mountainsPresent === true && d.reflectorPresent === true,
      phase4_5_glass: d.glassBackShaderCount >= 20 && d.glassFrontShaderCount >= 20,
      phase6_sorter: d.glassSorterReady === true && d.glassMeshCount >= 20,
      phase7_post: d.postComposerActive === true,
      phase8_9_demo_no_eagle2_overrides: d.glassOverridesActive === false,
    };

    await page.goto(baseUrl + '/native-eagle-dev', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(
      () => document.querySelector('[data-testid="native-status"]')?.dataset?.ready === '1'
        && window.__NATIVE_EAGLE_DEBUG__?.loaded === true,
      null,
      { timeout: 180000 },
    );
    await page.waitForTimeout(2000);

    result.compare = await page.evaluate(() => {
      const d = window.__NATIVE_EAGLE_DEBUG__;
      const root = document.querySelector('.native-eagle-compare');
      const iframe = document.querySelector('[data-testid="reference-iframe"]');
      const canvas = document.querySelector('.native-eagle-canvas-host canvas');
      const iframeBlend = iframe ? getComputedStyle(iframe).mixBlendMode : null;
      const canvasBlend = canvas ? getComputedStyle(canvas).mixBlendMode : null;
      const nativePane = document.querySelector('[data-testid="native-pane"]');
      const paneRect = nativePane?.getBoundingClientRect();

      let nativeVisible = false;
      let nativePixelSample = null;
      if (canvas && paneRect) {
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (gl) {
          const w = canvas.width;
          const h = canvas.height;
          const sw = Math.max(1, Math.floor(w * 0.4));
          const sh = Math.max(1, Math.floor(h * 0.35));
          const x0 = Math.floor((w - sw) / 2);
          const y0 = Math.floor((h - sh) / 2);
          const pixels = new Uint8Array(sw * sh * 4);
          gl.readPixels(x0, y0, sw, sh, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          let sum = 0;
          let eagleLike = 0;
          let maxR = 0;
          let maxG = 0;
          let maxB = 0;
          const total = sw * sh;
          const bgR = 22;
          const bgG = 45;
          const bgB = 36;
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            sum += r + g + b;
            maxR = Math.max(maxR, r);
            maxG = Math.max(maxG, g);
            maxB = Math.max(maxB, b);
            if (g > 80 && g > r + 20 && g > b + 10) {
              eagleLike += 1;
            }
          }
          nativePixelSample = {
            total,
            eagleLike,
            eagleLikePct: total ? Number(((eagleLike / total) * 100).toFixed(1)) : 0,
            avgRgb: total ? Number((sum / (total * 3)).toFixed(1)) : 0,
            maxR,
            maxG,
            maxB,
          };
          nativeVisible = maxG > 80 && eagleLike > total * 0.05;
        }
      }

      return {
        reference: root?.getAttribute('data-reference'),
        split: Number(root?.dataset?.split || 50),
        iframeSrc: iframe?.getAttribute('src'),
        bg: d.backgroundHex,
        mountainsVisible: d.mountainsVisible,
        reflectorVisible: d.reflectorVisible,
        contactShadow: d.contactShadow,
        overrides: d.glassOverridesActive,
        ior: d.glassIorStart,
        envReflection: d.glassEnvReflection,
        colorFactor: d.glassColorFactor,
        variant: d.referenceVariant,
        progress: d.scrollProgress,
        iframeBlend,
        canvasBlend,
        glass: d.glassMeshCount,
        post: d.postComposerActive,
        nativeVisible,
        nativePixelSample,
      };
    });

    const c = result.compare;
    result.gates = {
      nativeRouteLoaded: result.phaseRegression.phase1_loaded,
      phase2_camera: result.phaseRegression.phase2_camera,
      phase3_env: result.phaseRegression.phase3_env,
      phase4_5_glass: result.phaseRegression.phase4_5_glass,
      phase6_sorter: result.phaseRegression.phase6_sorter,
      phase7_post: result.phaseRegression.phase7_post,
      demoKeepsDefaultGlass: result.phaseRegression.phase8_9_demo_no_eagle2_overrides,
      compareEagle2Ref: c.reference === 'eagle-project-2' && String(c.iframeSrc||'').includes('eagle-project-2'),
      compareEagle2ClearBg: c.bg === 1453348,
      compareMountainsHidden: c.mountainsVisible === false,
      compareReflectorVisible: c.reflectorVisible === true,
      compareOverridesInactive: c.overrides === false,
      compareDefaultIor: c.ior === 1.2,
      compareDefaultEnvReflection: c.envReflection === 1,
      compareDefaultColorFactor: c.colorFactor === 1,
      compareIframeDarkenBlend: c.iframeBlend === 'darken',
      compareNativeDarkenBlend: c.canvasBlend === 'darken',
      compareProgress0: c.progress === 0,
      compareGlassReady: c.glass >= 20,
      compareNativeVisible: c.nativeVisible === true,
      compareSplitDefault50: c.split === 50,
    };
  } catch (e) {
    result.error = String(e.message || e);
  }

  await browser.close();
  console.log(JSON.stringify(result, null, 2));
  process.exit(Object.values(result.gates).every(Boolean) && !result.error ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
`;

const tmp = path.join(outDir, "_phase10-browser.cjs");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(tmp, probeScript);
spawnSync("npm", ["install", "--no-save", "playwright@1.49.1"], { cwd: root, shell: true, stdio: "pipe" });
const run = spawnSync(process.execPath, [tmp, BASE_URL], { cwd: root, encoding: "utf8", timeout: 600000 });
if (run.stdout) process.stdout.write(run.stdout);
if (run.stderr) process.stderr.write(run.stderr);
try { fs.unlinkSync(tmp); } catch { /* ignore */ }
process.exit(run.status ?? 1);
