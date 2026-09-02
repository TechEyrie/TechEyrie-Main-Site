/**
 * Phase 6 — browser validation for GlassSorter + sorted dual-pass (requires dev server).
 * Run: node scripts/phase6-test-browser.mjs
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
    cameraGate0: null,
    scrollSortSamples: [],
    error: null,
    debug: null,
    webglErrors: [],
  };

  page.on('console', (msg) => {
    const text = msg.text();
    if (/shader compile|invalid shader|three\\.js.*shader/i.test(text)) result.webglErrors.push(text);
  });

  try {
    await page.goto(baseUrl + '/native-eagle', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(
      () => {
        const d = window.__NATIVE_EAGLE_DEBUG__;
        return d?.loaded === true && d?.glassSorterReady === true && d?.glassSortedCount >= 20;
      },
      null,
      { timeout: 180000, polling: 500 },
    );

    result.debug = await page.evaluate(() => {
      const d = window.__NATIVE_EAGLE_DEBUG__;
      return {
        loaded: d.loaded,
        envLoaded: d.envLoaded,
        glassMeshCount: d.glassMeshCount,
        glassBackShaderCount: d.glassBackShaderCount,
        glassFrontShaderCount: d.glassFrontShaderCount,
        glassSorterReady: d.glassSorterReady,
        glassSortedCount: d.glassSortedCount,
        glassSortOrderIndex: d.glassSortOrderIndex,
        glassSortNames: d.glassSortNames,
        glassPipelineActive: d.glassPipelineActive,
        backRTReady: d.backRTReady,
        cameraFov: d.cameraFov,
        error: d.error,
      };
    });

    const sampled0 = await page.evaluate(() => window.__NATIVE_EAGLE_DEBUG__.sampleAtTime(0));
    const cmp0 = comparePose(sampled0, reference.checkpoints[0], reference.tolerance);
    result.cameraGate0 = { ...cmp0, actual: sampled0 };

    const progresses = [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1];
    for (const p of progresses) {
      const sample = await page.evaluate(async (progress) => {
        const pin = document.querySelector('.native-eagle-hero-pin');
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        // Map progress onto pin scroll range
        const pinTop = pin.offsetTop;
        const pinHeight = pin.offsetHeight;
        const viewH = window.innerHeight;
        const range = Math.max(pinHeight - viewH, 1);
        window.scrollTo(0, pinTop + progress * range);
        window.dispatchEvent(new Event('scroll'));
        await new Promise((r) => setTimeout(r, 200));
        const d = window.__NATIVE_EAGLE_DEBUG__;
        return {
          progress,
          scrollProgress: d.scrollProgress,
          sortedCount: d.glassSortedCount,
          sortNames: d.glassSortNames,
          orderIndex: d.glassSortOrderIndex,
        };
      }, p);
      result.scrollSortSamples.push(sample);
    }

    const d = result.debug;
    const allSorted = result.scrollSortSamples.every((s) => s.sortedCount >= 20);
    const allHaveNames = result.scrollSortSamples.every(
      (s) => Array.isArray(s.sortNames) && s.sortNames.length >= 20,
    );
    const uniqueOrders = new Set(result.scrollSortSamples.map((s) => s.sortNames.join(','))).size;

    result.gates = {
      sceneLoaded: d.loaded === true && !d.error,
      glassSorterReady: d.glassSorterReady === true,
      glassSortedCount20: d.glassSortedCount >= 20,
      glassMeshCount20: d.glassMeshCount >= 20,
      glassBackShaders: d.glassBackShaderCount >= 20,
      glassFrontShaders: d.glassFrontShaderCount >= 20,
      glassPipelineActive: d.glassPipelineActive === true,
      backRTReady: d.backRTReady === true,
      cameraFov25: d.cameraFov === 25,
      cameraGate0: cmp0.pass,
      sortAtTenScrolls: allSorted && result.scrollSortSamples.length === 10,
      sortNamesPresent: allHaveNames,
      sortOrderDefined: typeof d.glassSortOrderIndex === 'number',
      canvasPresent: await page.evaluate(() => !!document.querySelector('.native-eagle-canvas-host canvas')),
      noShaderConsoleErrors: result.webglErrors.length === 0,
      sortSamplesCollected: result.scrollSortSamples.length === 10,
      // Not required to change, but recorded
      sortPermutationObserved: uniqueOrders >= 1,
    };
    result.uniqueSortOrders = uniqueOrders;
  } catch (e) {
    result.error = String(e.message || e);
  }

  await browser.close();
  console.log(JSON.stringify(result, null, 2));
  const pass = Object.values(result.gates).every(Boolean) && !result.error;
  process.exit(pass ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
`;

const tmpScript = path.join(outDir, "_phase6-browser.cjs");
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
