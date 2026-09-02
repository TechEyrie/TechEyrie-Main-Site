/**
 * Phase 7 — unit tests for post composer defaults + glass timeline bindings.
 * Run: node scripts/phase7-test-post.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as THREE from "three";
import {
  GLASS_TIMELINE_BINDINGS,
  GLASS_UNIFORM_DEFAULTS,
} from "../components/native-eagle/glassConfig.js";
import {
  sampleGlassTimelineUniforms,
  applyGlassUniformsToMeshes,
} from "../components/native-eagle/syncGlassTimelineUniforms.js";
import { DEFAULT_BLOOM } from "../components/native-eagle/createPostComposer.js";
import { BACKGROUND_PRESETS, ENV_BACKGROUND } from "../components/native-eagle/constants.js";

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
  "components/native-eagle/createPostComposer.js",
  "components/native-eagle/syncGlassTimelineUniforms.js",
  "components/native-eagle/glassConfig.js",
];

for (const rel of files) {
  assert(`file exists: ${rel}`, fs.existsSync(path.join(root, rel)));
}

assert("timeline bindings count is 23", GLASS_TIMELINE_BINDINGS.length === 23);
assert("iorStart default 1.2", GLASS_UNIFORM_DEFAULTS.iorStart === 1.2);
assert("decayFactor default 20", GLASS_UNIFORM_DEFAULTS.decayFactor === 20);
assert("env background matches noomo preset", BACKGROUND_PRESETS.noomo === ENV_BACKGROUND);
assert("white preset is 0xffffff", BACKGROUND_PRESETS.white === 0xffffff);
assert("bloom strength in range", DEFAULT_BLOOM.strength > 0 && DEFAULT_BLOOM.strength < 1);
assert("bloom threshold high", DEFAULT_BLOOM.threshold >= 0.7);

// Timeline sampling with missing nodes → defaults
const empty = sampleGlassTimelineUniforms(null);
assert("empty cam uses defaults boundCount 0", empty.boundCount === 0);
assert("empty cam iorStart default", empty.values.iorStart === 1.2);
assert("empty cam totalBindings 23", empty.totalBindings === 23);

// Fake cam root with one glass node
const camRoot = new THREE.Group();
const iorNode = new THREE.Object3D();
iorNode.name = "Glass_iorVDeltaXshift";
iorNode.position.set(1.35, 0.4, 2);
camRoot.add(iorNode);

const sampled = sampleGlassTimelineUniforms(camRoot);
assert("bound at least ior node", sampled.boundCount >= 1);
assert("iorStart from timeline", sampled.values.iorStart === 1.35);
assert("iorDelta from timeline", sampled.values.iorDelta === 0.4);
assert("uvShiftFactor from timeline", sampled.values.uvShiftFactor === 2);

// Apply to fake glass materials
const bird = new THREE.Group();
const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
mesh.isGlassDispersion = true;
mesh.frontMaterial = {
  uniforms: {
    iorStart: { value: 0 },
    iorDelta: { value: 0 },
    colorFactor: { value: 0 },
  },
};
mesh.backMaterial = {
  uniforms: {
    iorStart: { value: 0 },
    envRefraction: { value: 0 },
  },
};
bird.add(mesh);

const applied = applyGlassUniformsToMeshes(bird, sampled.values);
assert("applied to 2 materials", applied === 2);
assert("front iorStart updated", mesh.frontMaterial.uniforms.iorStart.value === 1.35);
assert("back iorStart updated", mesh.backMaterial.uniforms.iorStart.value === 1.35);

// Binding path uniqueness sanity
const nodes = new Set(GLASS_TIMELINE_BINDINGS.map((b) => `${b.node}.${b.axis}`));
assert("all timeline paths unique", nodes.size === GLASS_TIMELINE_BINDINGS.length);

console.log(`\nUnit tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
