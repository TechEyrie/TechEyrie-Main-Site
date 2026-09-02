/**
 * Phase 3 — unit tests for mountains geometry + reflector constants (no WebGL).
 * Run: node scripts/phase3-test-env.mjs
 */
import * as THREE from "three";
import {
  ENV_BACKGROUND,
  MOUNTAINS_GEOMETRY,
  REFLECTOR_SIZE,
  REFLECTOR_Y,
} from "../components/native-eagle/constants.js";
import { createMountainsMesh } from "../components/native-eagle/createEnvironment.js";

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

assert("reflectorY is -2.35", REFLECTOR_Y === -2.35);
assert("reflector size 200x200", REFLECTOR_SIZE[0] === 200 && REFLECTOR_SIZE[1] === 200);
assert("env background #E5DEF9", ENV_BACKGROUND === 15064825);
assert("mountains radius 100", MOUNTAINS_GEOMETRY.radiusTop === 100);
assert("mountains height 12.5", MOUNTAINS_GEOMETRY.height === 12.5);
assert("mountains thetaLength π", Math.abs(MOUNTAINS_GEOMETRY.thetaLength - Math.PI) < 1e-9);
assert("mountains openEnded", MOUNTAINS_GEOMETRY.openEnded === true);

const map = new THREE.Texture();
const mountains = createMountainsMesh(map);
assert("mountains name", mountains.name === "Mountains");
assert("mountains BackSide", mountains.material.side === THREE.BackSide);
assert("mountains frustumCulled off", mountains.frustumCulled === false);

const pos = mountains.geometry.attributes.position;
const box = new THREE.Box3().setFromBufferAttribute(pos);
assert("mountains base near y=0 after translate", Math.abs(box.min.y) < 0.01);
assert("mountains top near y=12.5", Math.abs(box.max.y - 12.5) < 0.01);

console.log(`\nUnit tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
