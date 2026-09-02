/**
 * Phase 2 — compare native camera poses against cam.glb reference at hero gates.
 * Run: node scripts/phase2-test-camera.mjs  (requires dev server)
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

  const result = { baseUrl, checkpoints: [], gates: {}, error: null };

  try {
    await page.goto(baseUrl + '/native-eagle', { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForFunction(() => window.__NATIVE_EAGLE_DEBUG__?.loaded === true, null, { timeout: 60000 });

    for (const cp of reference.checkpoints) {
      const sampled = await page.evaluate((time) => {
        const dbg = window.__NATIVE_EAGLE_DEBUG__;
        return dbg.sampleAtTime(time);
      }, cp.timelineTime);

      const cmp = comparePose(sampled, cp, reference.tolerance);
      result.checkpoints.push({
        progress: cp.progress,
        timelineTime: cp.timelineTime,
        expected: cp,
        actual: sampled,
        ...cmp,
      });
    }

    // Hero pin scroll → progress mapping (sequential scroll + wait for React handler)
    const pinScroll = { samples: [] };
    const pinMetrics = await page.evaluate(() => {
      const pin = document.querySelector(".native-eagle-hero-pin");
      return {
        pinHeight: pin.offsetHeight,
        scrollRange: Math.max(pin.offsetHeight - window.innerHeight, 1),
        viewH: window.innerHeight,
        pinTop: pin.offsetTop,
      };
    });
    pinScroll.pinHeight = pinMetrics.pinHeight;
    pinScroll.scrollRange = pinMetrics.scrollRange;
    pinScroll.viewH = pinMetrics.viewH;

    for (const progress of [0, 0.05, 0.1]) {
      await page.evaluate(
        ({ pinTop, scrollRange, progress }) => {
          window.scrollTo({ top: pinTop + progress * scrollRange, left: 0, behavior: "instant" });
          window.dispatchEvent(new Event("scroll"));
        },
        { pinTop: pinMetrics.pinTop, scrollRange: pinMetrics.scrollRange, progress },
      );
      await page.waitForTimeout(200);
      const sample = await page.evaluate(() => ({
        scrollProgress: window.__NATIVE_EAGLE_DEBUG__.scrollProgress,
        timelineTime: window.__NATIVE_EAGLE_DEBUG__.timelineTime,
        scrollY: window.scrollY,
      }));
      pinScroll.samples.push({ progress, ...sample });
    }

    result.pinScroll = pinScroll;

    result.gates = {
      allCheckpointsPass: result.checkpoints.every((c) => c.pass),
      checkpoint0: result.checkpoints[0]?.pass ?? false,
      checkpoint005: result.checkpoints[1]?.pass ?? false,
      checkpoint010: result.checkpoints[2]?.pass ?? false,
      heroPinPresent: pinScroll.pinHeight > pinScroll.viewH,
      scrollMapsProgress005: Math.abs(pinScroll.samples[1].scrollProgress - 0.05) < 0.02,
      scrollMapsProgress010: Math.abs(pinScroll.samples[2].scrollProgress - 0.1) < 0.02,
      scrollMapsTime010: Math.abs(pinScroll.samples[2].timelineTime - 2) < 0.15,
      noWingOverlay: await page.evaluate(() => window.__NATIVE_EAGLE_DEBUG__.wingClipName === "Wing_CloseUp"),
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

const tmpScript = path.join(outDir, "_phase2-camera.cjs");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(tmpScript, probeScript);

spawnSync("npm", ["install", "--no-save", "playwright@1.49.1"], { cwd: root, shell: true, stdio: "pipe" });

const run = spawnSync(process.execPath, [tmpScript, BASE_URL], {
  cwd: root,
  encoding: "utf8",
  timeout: 120000,
});

if (run.stdout) process.stdout.write(run.stdout);
if (run.stderr) process.stderr.write(run.stderr);

try {
  fs.unlinkSync(tmpScript);
} catch {
  /* ignore */
}

process.exit(run.status ?? 1);
