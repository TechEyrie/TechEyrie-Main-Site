/**
 * Phase 1 — unit tests for prepareGlassMesh tangent fix (no GLB / WebGL).
 * Run: node scripts/phase1-test-tangent.mjs
 */
import * as THREE from "three";
import { fixTangentAttribute, prepareGlassMesh } from "../components/native-eagle/prepareGlassMesh.js";

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

// vec4 tangents all w=1 → vec3
const geo = new THREE.BufferGeometry();
geo.setAttribute(
  "tangent",
  new THREE.BufferAttribute(new Float32Array([1, 0, 0, 1, 0, 1, 0, 1]), 4),
);
geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), 3));

const fixed = fixTangentAttribute(geo);
const tan = geo.getAttribute("tangent");
assert("fixTangent returns true for w=1 vec4", fixed === true);
assert("tangent becomes vec3", tan.itemSize === 3);
assert("tangent count preserved", tan.count === 2);

// already vec3 — no-op
const geo2 = new THREE.BufferGeometry();
geo2.setAttribute("tangent", new THREE.BufferAttribute(new Float32Array([1, 0, 0, 0, 1, 0]), 3));
assert("vec3 tangent unchanged", fixTangentAttribute(geo2) === false);

// prepareGlassMesh metadata
const geoForMesh = new THREE.BufferGeometry();
geoForMesh.setAttribute(
  "tangent",
  new THREE.BufferAttribute(new Float32Array([1, 0, 0, 1, 0, 1, 0, 1]), 4),
);
geoForMesh.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), 3),
);
const mesh = new THREE.Mesh(geoForMesh, new THREE.MeshBasicMaterial());
mesh.name = "wing-left-top";
const { mesh: prepared, tangentFixed, hasDist } = prepareGlassMesh(mesh);
assert("prepareGlassMesh sets isGlassDispersion", prepared.isGlassDispersion === true);
assert("prepareGlassMesh sets front/back materials", prepared.frontMaterial && prepared.backMaterial);
assert("prepareGlassMesh fixes tangents", tangentFixed === true);
assert("hasDist false without attr", hasDist === false);
assert("geometryCenter computed", prepared.geometryCenter instanceof THREE.Vector3);

console.log(`\nUnit tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
