/**
 * Phase 4 — browser validation for GlassBack + pipeline (requires dev server).
 * Run: node scripts/phase4-test-browser.mjs
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
    if (/shader compile|invalid shader|three\.js.*shader/i.test(text)) result.webglErrors.push(text);
  });

  try {
    await page.goto(baseUrl + '/native-eagle', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(
      () => {
        const d = window.__NATIVE_EAGLE_DEBUG__;
        return d?.loaded === true && d?.glassBackShaderCount >= 17;
      },
      null,
      { timeout: 180000, polling: 500 },
    );

    result.debug = await page.evaluate(() => {
      const d = window.__NATIVE_EAGLE_DEBUG__;
      return {
        loaded: d.loaded,
        envLoaded: d.envLoaded,
        mountainsPresent: d.mountainsPresent,
        reflectorPresent: d.reflectorPresent,
        reflectorY: d.reflectorY,
        backgroundHex: d.backgroundHex,
        glassEnvMapped: d.glassEnvMapped,
        glassMeshCount: d.glassMeshCount,
        glassBackShaderCount: d.glassBackShaderCount,
        glassBackPlaceholderCount: d.glassBackPlaceholderCount,
        glassPipelineActive: d.glassPipelineActive,
        backRTReady: d.backRTReady,
        backRTWidth: d.backRTWidth,
        backRTHeight: d.backRTHeight,
        hasSceneEnvironment: d.hasSceneEnvironment,
        cameraFov: d.cameraFov,
        birdActionName: d.birdActionName,
        camActionName: d.camActionName,
        error: d.error,
      };
    });

    const sampled0 = await page.evaluate(() => window.__NATIVE_EAGLE_DEBUG__.sampleAtTime(0));
    const cmp0 = comparePose(sampled0, reference.checkpoints[0], reference.tolerance);
    result.cameraGate0 = { ...cmp0, actual: sampled0 };

    const assetStatus = await page.evaluate(async () => {
      const paths = [
        '/models/wooden_studio_19_1k.hdr',
        '/eagle-project/textures/mountains.png',
        '/eagle-project/textures/waves.jpg',
        '/eagle-project/textures/icen.jpg',
        '/eagle-project/textures/LDR_RG01_0.png',
        '/eagle-project/textures/noises.jpg',
      ];
      const out = {};
      for (const p of paths) {
        const res = await fetch(p, { method: 'HEAD' });
        out[p] = res.ok;
      }
      return out;
    });
    result.assetStatus = assetStatus;

    const d = result.debug;
    result.gates = {
      sceneLoaded: d.loaded === true && !d.error,
      envLoaded: d.envLoaded === true,
      glassPipelineActive: d.glassPipelineActive === true,
      backRTReady: d.backRTReady === true,
      backRTSized: d.backRTWidth >= 100 && d.backRTHeight >= 100,
      glassBackShaders: d.glassBackShaderCount >= 17,
      glassBackNoPlaceholder: d.glassBackPlaceholderCount === 0,
      hasSceneEnvironment: d.hasSceneEnvironment === true,
      mountainsPresent: d.mountainsPresent === true,
      reflectorPresent: d.reflectorPresent === true,
      reflectorY: Math.abs(d.reflectorY - (-2.35)) < 0.001,
      backgroundHex: d.backgroundHex === 15064825,
      glassEnvMapped: d.glassEnvMapped >= 17,
      cameraFov25: d.cameraFov === 25,
      cameraGate0: cmp0.pass,
      iceNormalAsset: assetStatus['/eagle-project/textures/icen.jpg'] === true,
      colorsMapAsset: assetStatus['/eagle-project/textures/LDR_RG01_0.png'] === true,
      noisesAsset: assetStatus['/eagle-project/textures/noises.jpg'] === true,
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

const tmpScript = path.join(outDir, "_phase4-browser.cjs");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(tmpScript, probeScript);

spawnSync("npm", ["install", "--no-save", "playwright@1.49.1"], { cwd: root, shell: true, stdio: "pipe" });

const run = spawnSync(process.execPath, [tmpScript, BASE_URL], {
  cwd: root,
  encoding: "utf8",
  timeout: 240000,
});

if (run.stdout) process.stdout.write(run.stdout);
if (run.stderr) process.stderr.write(run.stderr);

try {
  fs.unlinkSync(tmpScript);
} catch {
  /* ignore */
}

process.exit(run.status ?? 1);
