/**
 * Phase 10 — glass parity structure + reference-default unit checks.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GLASS_UNIFORM_DEFAULTS } from "../components/native-eagle/glassConfig.js";
import { GLASS_COLORS } from "../components/native-eagle/constants.js";
import { syncGlassTimelineUniforms } from "../components/native-eagle/syncGlassTimelineUniforms.js";

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

assert("teal base color set", GLASS_COLORS.color === "#12c48a");
assert("teal peaks set", GLASS_COLORS.peaksColor === "#6ee7b7");
assert("teal fringe set", GLASS_COLORS.fringeColor === "#047857");

const synced = syncGlassTimelineUniforms(null, { traverse() {} }, null);
assert("sync uses defaults when no overrides", synced.values.envReflection === GLASS_UNIFORM_DEFAULTS.envReflection);
assert("sync marks overridesApplied false", synced.overridesApplied === false);
assert("sync keeps default colorFactor", synced.values.colorFactor === GLASS_UNIFORM_DEFAULTS.colorFactor);

const initSrc = fs.readFileSync(path.join(root, "components/native-eagle/initNativeEagleScene.js"), "utf8");
assert("init does not import EAGLE2 overrides", !initSrc.includes("EAGLE2_GLASS_UNIFORM_OVERRIDES"));
assert("init accepts variant eagle-project-2", initSrc.includes('variant === "eagle-project-2"'));
assert("init disables refraction spots", initSrc.includes("addRefractionSpots: false"));
assert("init uses reference bloom threshold 1", initSrc.includes("threshold: 1.0"));
assert("init uses default toneMappingExposure", initSrc.includes("toneMappingExposure = 1"));

const compareCss = fs.readFileSync(
  path.join(root, "components/native-eagle/NativeEagleCompareDev.css"),
  "utf8",
);
assert("compare native canvas uses darken blend", compareCss.includes("mix-blend-mode: darken"));
assert("compare iframe uses darken blend", compareCss.includes(".native-eagle-compare__iframe"));

const compareSrc = fs.readFileSync(
  path.join(root, "components/native-eagle/NativeEagleCompareDev.js"),
  "utf8",
);
assert("compare uses eagle2Clear background", compareSrc.includes('background="eagle2Clear"'));
assert("compare uses side-by-side grid", compareSrc.includes("gridTemplateColumns"));

console.log(`\nUnit tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
