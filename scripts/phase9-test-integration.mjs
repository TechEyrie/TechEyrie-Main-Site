/**
 * Phase 9 — structure checks: eagle-project-2 reference lock + compare clip.
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

const compareSrc = fs.readFileSync(
  path.join(root, "components/native-eagle/NativeEagleCompareDev.js"),
  "utf8",
);
const heroSrc = fs.readFileSync(
  path.join(root, "components/native-eagle/NativeEagleHero.js"),
  "utf8",
);
const constantsSrc = fs.readFileSync(
  path.join(root, "components/native-eagle/constants.js"),
  "utf8",
);
const envSrc = fs.readFileSync(
  path.join(root, "components/native-eagle/createEnvironment.js"),
  "utf8",
);
const initSrc = fs.readFileSync(
  path.join(root, "components/native-eagle/initNativeEagleScene.js"),
  "utf8",
);

assert(
  "reference is eagle-project-2",
  compareSrc.includes("eagle-project-2") &&
    constantsSrc.includes('EAGLE_PROJECT_2_REFERENCE_SRC = "/eagle-project-2/"'),
);
assert("does not default to eagle-project/ (v1)", !compareSrc.includes('"/eagle-project/?embed=1"'));
assert(
  "compare uses side-by-side grid (native on right)",
  compareSrc.includes("gridTemplateColumns") && compareSrc.includes("native-eagle-compare__pane--native"),
);
assert("compare locks progress", compareSrc.includes("lockProgress"));
assert(
  "compare uses eagle2Clear background for native (darken blend on white stage)",
  compareSrc.includes('background="eagle2Clear"'),
);
assert("compare hides mountains", compareSrc.includes("hideMountains"));
assert("data-reference eagle-project-2", compareSrc.includes('data-reference="eagle-project-2"'));
assert("hero supports lockProgress", heroSrc.includes("lockProgress"));
assert("hero supports hideMountains", heroSrc.includes("hideMountains"));
assert("env supports hideMountains", envSrc.includes("hideMountains"));
assert("init accepts hideMountains", initSrc.includes("hideMountains"));
assert("init accepts backgroundHex", initSrc.includes("backgroundHex"));
assert(
  "public eagle-project-2 exists",
  fs.existsSync(path.join(root, "public/eagle-project-2/index.html")),
);

console.log(`\nUnit tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
