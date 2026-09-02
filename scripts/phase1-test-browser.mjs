/**
 * Phase 1 — browser validation against /native-eagle (requires dev server).
 * Run: node scripts/phase1-test-browser.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "docs/native-eagle");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const probeScript = `
const { chromium } = require('playwright');

(async () => {
  const baseUrl = process.argv[2];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const result = { baseUrl, gates: {}, debug: null, error: null };

  try {
    await page.goto(baseUrl + '/native-eagle', { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForFunction(() => window.__NATIVE_EAGLE_DEBUG__?.loaded === true, null, { timeout: 60000 });

    result.debug = await page.evaluate(() => window.__NATIVE_EAGLE_DEBUG__);

    await page.evaluate(() => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      window.scrollTo(0, max * 0.1);
      window.dispatchEvent(new Event("scroll"));
    });
    await page.waitForTimeout(800);

    const afterScroll = await page.evaluate(() => window.__NATIVE_EAGLE_DEBUG__);
    result.afterScroll = afterScroll;

    const d = result.debug;
    result.gates = {
      sceneLoaded: d.loaded === true && !d.error,
      meshCount: d.meshCount >= 18,
      glassMeshCount: d.glassMeshCount >= 17,
      tangentFixed: d.tangentFixedCount >= 10,
      wingClip: d.wingClipName == null || d.wingClipName === 'Wing_CloseUp',
      birdAction: d.birdActionName === 'BirdAction' && !!d.birdSyncMode,
      camAction: d.camActionName === 'New CameraAction',
      cameraFov: d.cameraFov === 25,
      acesToneMapping: d.toneMapping === 4,
      srgbOutput: d.outputColorSpace === 'srgb',
      scrollScrub: afterScroll.timelineTime > 0.5 && afterScroll.timelineTime < 3.5,
      canvasPresent: await page.evaluate(() => !!document.querySelector('.native-eagle-canvas-host canvas')),
    };
  } catch (e) {
    result.error = String(e.message || e);
  }

  await browser.close();
  console.log(JSON.stringify(result, null, 2));
  const allPass = Object.values(result.gates).every(Boolean);
  process.exit(allPass && !result.error ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
`;

const tmpScript = path.join(outDir, "_phase1-browser.cjs");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(tmpScript, probeScript);

spawnSync("npm", ["install", "--no-save", "playwright@1.49.1"], { cwd: root, shell: true, stdio: "pipe" });

const result = spawnSync(process.execPath, [tmpScript, BASE_URL], {
  cwd: root,
  encoding: "utf8",
  timeout: 120000,
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

try {
  fs.unlinkSync(tmpScript);
} catch {
  /* ignore */
}

process.exit(result.status ?? 1);
