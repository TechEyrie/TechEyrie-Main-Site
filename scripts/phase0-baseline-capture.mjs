/**
 * Phase 0 — capture reference baseline from /eagle-project/ at scroll checkpoints.
 * Requires dev server on BASE_URL (default http://localhost:3000).
 * Run: node scripts/phase0-baseline-capture.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "docs/native-eagle/baseline");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const CHECKPOINTS = [0, 0.05, 0.1, 0.2, 0.5];

fs.mkdirSync(outDir, { recursive: true });

const probeScript = `
const { chromium } = require('playwright');

(async () => {
  const baseUrl = process.argv[2];
  const outDir = process.argv[3];
  const checkpoints = ${JSON.stringify(CHECKPOINTS)};

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const results = { baseUrl, capturedAt: new Date().toISOString(), checkpoints: [] };

  await page.goto(baseUrl + '/eagle-project/', { waitUntil: 'networkidle', timeout: 120000 });

  // Dismiss preloader if present
  await page.evaluate(() => {
    const pre = document.querySelector('.preloader, [class*="preloader"], #preloader');
    if (pre) pre.remove();
    document.body.style.overflow = 'auto';
  }).catch(() => {});

  await page.waitForTimeout(8000);

  const domReady = await page.evaluate(() => ({
    hasCanvas: !!document.querySelector('canvas'),
    canvasCount: document.querySelectorAll('canvas').length,
    title: document.title,
    hasNoomoHeader: !!document.querySelector('header'),
  }));
  results.domReady = domReady;

  for (const progress of checkpoints) {
    await page.evaluate((p) => {
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      window.scrollTo(0, p * maxScroll);
    }, progress);
    await page.waitForTimeout(1500);

    const state = await page.evaluate((p) => ({
      progress: p,
      scrollY: window.scrollY,
      maxScroll: Math.max(document.body.scrollHeight - window.innerHeight, 1),
      scrollFraction: window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1),
    }), progress);

    const fileName = 'scroll-' + String(Math.round(progress * 100)).padStart(3, '0') + '.png';
    await page.screenshot({ path: require('path').join(outDir, fileName), fullPage: false });
    results.checkpoints.push({ ...state, screenshot: fileName });
  }

  await browser.close();
  require('fs').writeFileSync(require('path').join(outDir, 'baseline-capture.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
`;

const tmpScript = path.join(outDir, "_capture-runner.cjs");
fs.writeFileSync(tmpScript, probeScript);

console.log("Installing playwright if needed...");
spawnSync("npm", ["install", "--no-save", "playwright@1.49.1"], { cwd: root, shell: true, stdio: "inherit" });
spawnSync("npx", ["playwright", "install", "chromium"], { cwd: root, shell: true, stdio: "inherit" });

console.log("Capturing baselines from", BASE_URL);
const result = spawnSync(process.execPath, [tmpScript, BASE_URL, outDir], {
  cwd: root,
  encoding: "utf8",
  timeout: 180000,
});

if (result.stdout) console.log(result.stdout);
if (result.stderr) console.error(result.stderr);

try { fs.unlinkSync(tmpScript); } catch { /* ignore */ }

process.exit(result.status ?? (result.error ? 1 : 0));
