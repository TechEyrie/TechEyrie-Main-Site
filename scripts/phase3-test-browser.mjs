/**
 * Phase 3 — browser validation for HDR / mountains / reflector (requires dev server).
 * Run: node scripts/phase3-test-browser.mjs
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
  const result = { baseUrl, gates: {}, cameraGate0: null, error: null, debug: null };

  try {
    await page.goto(baseUrl + '/native-eagle', { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForFunction(
      () => window.__NATIVE_EAGLE_DEBUG__?.loaded === true && window.__NATIVE_EAGLE_DEBUG__?.envLoaded === true,
      null,
      { timeout: 90000 },
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
        hasSceneEnvironment: d.hasSceneEnvironment,
        cameraFov: d.cameraFov,
        birdActionName: d.birdActionName,
        camActionName: d.camActionName,
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
      sceneLoaded: d.loaded === true,
      envLoaded: d.envLoaded === true,
      hasSceneEnvironment: d.hasSceneEnvironment === true,
      mountainsPresent: d.mountainsPresent === true,
      reflectorPresent: d.reflectorPresent === true,
      reflectorY: Math.abs(d.reflectorY - (-2.35)) < 0.001,
      backgroundHex: d.backgroundHex === 15064825,
      glassEnvMapped: d.glassEnvMapped >= 17,
      cameraFov25: d.cameraFov === 25,
      cameraGate0: cmp0.pass,
      hdrAsset: assetStatus['/models/wooden_studio_19_1k.hdr'] === true,
      mountainsAsset: assetStatus['/eagle-project/textures/mountains.png'] === true,
      wavesAsset: assetStatus['/eagle-project/textures/waves.jpg'] === true,
      canvasPresent: await page.evaluate(() => !!document.querySelector('.native-eagle-canvas-host canvas')),
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

const tmpScript = path.join(outDir, "_phase3-browser.cjs");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(tmpScript, probeScript);

spawnSync("npm", ["install", "--no-save", "playwright@1.49.1"], { cwd: root, shell: true, stdio: "pipe" });

const run = spawnSync(process.execPath, [tmpScript, BASE_URL], {
  cwd: root,
  encoding: "utf8",
  timeout: 180000,
});

if (run.stdout) process.stdout.write(run.stdout);
if (run.stderr) process.stderr.write(run.stderr);

try {
  fs.unlinkSync(tmpScript);
} catch {
  /* ignore */
}

process.exit(run.status ?? 1);
