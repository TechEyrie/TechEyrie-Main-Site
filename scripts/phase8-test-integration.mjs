/**
 * Phase 8 — structure + remount-leak unit checks (no browser).
 * Run: node scripts/phase8-test-integration.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    passed += 1;
    console.log("PASS:", label);
  } else {
    failed += 1;
    console.error("FAIL:", label);
  }
}

const files = [
  "components/native-eagle/NativeEagleHero.js",
  "components/native-eagle/NativeEagleCompareDev.js",
  "components/native-eagle/NativeEagleCompareDev.css",
  "src/app/native-eagle/page.js",
  "src/app/native-eagle/NativeEagleClientPage.js",
  "src/app/native-eagle-dev/page.js",
  "src/app/native-eagle-dev/NativeEagleDevClientPage.js",
];

for (const rel of files) {
  assert(`file exists: ${rel}`, fs.existsSync(path.join(root, rel)));
}

const heroSrc = fs.readFileSync(path.join(root, "components/native-eagle/NativeEagleHero.js"), "utf8");
assert("hero is client component", heroSrc.includes('"use client"'));
assert("hero cleans up dispose", heroSrc.includes("api?.dispose()") && heroSrc.includes("ac.abort()"));
assert("hero passes AbortSignal", heroSrc.includes("signal: ac.signal"));
assert("hero has loading state", heroSrc.includes('setStatus("loading")'));
assert("hero has error state", heroSrc.includes('setStatus("error")'));
assert("hero respects reduced motion", heroSrc.includes("prefers-reduced-motion"));
assert("hero exposes onReady", heroSrc.includes("onReady"));
assert("hero supports fillParent", heroSrc.includes("fillParent"));
assert("hero uses stable onReady ref", heroSrc.includes("onReadyRef"));

const clientSrc = fs.readFileSync(
  path.join(root, "src/app/native-eagle/NativeEagleClientPage.js"),
  "utf8",
);
assert("native page uses dynamic ssr:false", clientSrc.includes("ssr: false"));

const compareSrc = fs.readFileSync(
  path.join(root, "components/native-eagle/NativeEagleCompareDev.js"),
  "utf8",
);
assert("compare has remount button path", compareSrc.includes("Remount native"));
assert(
  "compare uses iframe reference",
  compareSrc.includes("EAGLE_PROJECT_2_REFERENCE_SRC") ||
    compareSrc.includes("/eagle-project-2/") ||
    compareSrc.includes("/eagle-project/"),
);
assert("compare has split slider", compareSrc.includes('type="range"'));
assert("compare tracks mount count", compareSrc.includes("mountCount"));
assert("compare uses fillParent", compareSrc.includes("fillParent"));
assert("compare exposes data-mount-count", compareSrc.includes("data-mount-count"));
assert("compare can disable reference iframe", compareSrc.includes("showReference"));

const devClient = fs.readFileSync(
  path.join(root, "src/app/native-eagle-dev/NativeEagleDevClientPage.js"),
  "utf8",
);
assert("dev page ssr:false", devClient.includes("ssr: false"));

const indexSrc = fs.readFileSync(path.join(root, "components/native-eagle/index.js"), "utf8");
assert("index exports NativeEagleCompareDev", indexSrc.includes("NativeEagleCompareDev"));

console.log(`\nUnit tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
