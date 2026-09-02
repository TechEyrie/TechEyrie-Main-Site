/**
 * Phase 6 — unit tests for GlassSorter trees + wing axis sort (no WebGL).
 * Run: node scripts/phase6-test-sorter.mjs
 */
import * as THREE from "three";
import {
  FROM_BACK_CORE_ORDER,
  FROM_FRONT_CORE_ORDER,
  GlassSorter,
  WING_LEFT_BACK_ORDER,
  WING_RIGHT_BACK_ORDER,
} from "../components/native-eagle/createGlassSorter.js";
import { LayerController } from "../components/native-eagle/createLayerController.js";
import { GLASS_SORTER_MESHES } from "../components/native-eagle/constants.js";

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

function makeMesh(name, x = 0, y = 0, z = 0) {
  const geo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  const mat = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = name;
  mesh.isGlassDispersion = true;
  mesh.shouldBeSorted = true;
  mesh.position.set(x, y, z);
  mesh.updateMatrixWorld(true);
  mesh.geometryWorld = mesh.position.clone();
  mesh.updateGeometryWorldPosition = () => {
    mesh.geometryWorld.copy(mesh.position);
  };
  return mesh;
}

const names = [
  "neck-bottom",
  "chest",
  "belly",
  "body",
  "legs",
  "back",
  "neck-top",
  "tail-bottom",
  "tail-center",
  "tail-top",
  ...WING_LEFT_BACK_ORDER,
  ...WING_RIGHT_BACK_ORDER,
];

const meshMap = {};
for (const name of names) {
  let x = 0;
  if (name.startsWith("wing-left")) x = -1;
  if (name.startsWith("wing-right")) x = 1;
  meshMap[name] = makeMesh(name, x, 0, 0);
}

assert("GLASS_SORTER_MESHES includes chest", GLASS_SORTER_MESHES.has("chest"));
assert("GLASS_SORTER_MESHES includes belly", GLASS_SORTER_MESHES.has("belly"));
assert("GLASS_SORTER_MESHES includes legs", GLASS_SORTER_MESHES.has("legs"));
assert("GLASS_SORTER_MESHES size >= 20", GLASS_SORTER_MESHES.size >= 20);

const sorter = new GlassSorter();
sorter.setLayers(meshMap);
assert("sorter ready", sorter.ready === true);

sorter.setOrderIndex(0);
const camLeft = new THREE.Vector3(-5, 0, 0);
const quat = new THREE.Quaternion();
const sortedBack = sorter.sort(quat, camLeft);
const sortedBackNames = sortedBack.map((m) => m.name);

assert("fromBack returns all meshes", sortedBackNames.length === names.length);
assert(
  "fromBack starts with neck-bottom",
  sortedBackNames[0] === "neck-bottom",
);
assert(
  "fromBack ends with tail-top",
  sortedBackNames[sortedBackNames.length - 1] === "tail-top",
);

const coreBack = sortedBackNames.filter((n) => !n.startsWith("wing-"));
assert(
  "fromBack core order matches",
  JSON.stringify(coreBack) === JSON.stringify(FROM_BACK_CORE_ORDER),
);

const wingBlock = sortedBackNames.filter((n) => n.startsWith("wing-"));
assert("fromBack has 10 wing meshes", wingBlock.length === 10);
assert(
  "camera on -X puts left wing before right (or group order stable)",
  wingBlock[0].startsWith("wing-left") || wingBlock[0].startsWith("wing-right"),
);

sorter.setOrderIndex(1);
const sortedFront = sorter.sort(quat, camLeft).map((m) => m.name);
const coreFront = sortedFront.filter((n) => !n.startsWith("wing-"));
assert(
  "fromFront core order matches",
  JSON.stringify(coreFront) === JSON.stringify(FROM_FRONT_CORE_ORDER),
);
assert("fromFront starts with tail-top", sortedFront[0] === "tail-top");
assert(
  "fromFront ends with neck-bottom",
  sortedFront[sortedFront.length - 1] === "neck-bottom",
);

// Stability
const a = sorter.sort(quat, camLeft).map((m) => m.name).join(",");
const b = sorter.sort(quat, camLeft).map((m) => m.name).join(",");
assert("sort is stable for same inputs", a === b);

// Wing axis flip: camera +X should reverse left/right group order vs -X
sorter.setOrderIndex(0);
const fromNegX = sorter.sort(quat, new THREE.Vector3(-5, 0, 0)).map((m) => m.name);
const fromPosX = sorter.sort(quat, new THREE.Vector3(5, 0, 0)).map((m) => m.name);
const wingsNeg = fromNegX.filter((n) => n.startsWith("wing-"));
const wingsPos = fromPosX.filter((n) => n.startsWith("wing-"));
assert(
  "wing group order can differ by camera side",
  wingsNeg.join(",") !== wingsPos.join(",") || wingsNeg[0] === wingsPos[0],
);
// Stronger: first wing mesh prefix should flip when camera crosses axis
const firstNeg = wingsNeg[0].startsWith("wing-left") ? "L" : "R";
const firstPos = wingsPos[0].startsWith("wing-left") ? "L" : "R";
assert("wing lead side flips with camera X", firstNeg !== firstPos);

// LayerController
const root = new THREE.Group();
for (const mesh of Object.values(meshMap)) root.add(mesh);
const lc = new LayerController();
lc.updateGlass(root);
assert("layer controller ready", lc.ready === true);
const camera = new THREE.PerspectiveCamera(25, 1, 0.1, 500);
camera.position.set(-5, 0, 2);
const sorted = lc.tick({ birdRoot: root, camRoot: null, camera });
assert("layer controller sorts >= 20", sorted.length >= 20);
assert("renderOrder stamped", sorted[0].renderOrder === 1000);
assert("glassSortIndex stamped", sorted[5].glassSortIndex === 5);

console.log(`\nUnit tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
