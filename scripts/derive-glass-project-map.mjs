/**
 * Derive cam.glb project* → Glass_* mapping by correlating with dev.glb at t=0.
 * Run: node scripts/derive-glass-project-map.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const GLASS_NODES = [
  "Glass_distResetX",
  "Glass_iorVDeltaXshift",
  "Glass_reflectionVIri",
  "Glass_refractionVIri",
  "Glass_convexConcavePeaks",
  "Glass_fringeCurveMix",
  "Glass_colorBoostFactorCurve",
  "Glass_colorCurveRGB",
  "Glass_colorMaxvalDecayUsetransmittance",
];

function loadGlb(relativePath) {
  const buf = fs.readFileSync(path.join(root, relativePath));
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), "", resolve, reject);
  });
}

function sampleClip(gltf, clipName, time) {
  const mixer = new THREE.AnimationMixer(gltf.scene);
  const clip = gltf.animations.find((c) => c.name === clipName);
  if (!clip) return;
  const action = mixer.clipAction(clip);
  action.play();
  action.paused = true;
  action.time = time;
  mixer.update(0);
  gltf.scene.updateWorldMatrix(true, true);
}

async function main() {
  const [camGltf, devGltf] = await Promise.all([
    loadGlb("public/eagle-extract/assets/timelines/cam.glb"),
    loadGlb("public/eagle-project/timelines/dev.glb"),
  ]);

  const devGlassActions = [
    ["EmptyAction", "Glass_iorVDeltaXshift"],
    ["Glass_edgesPowerMixAction", "Glass_fringeCurveMix"],
    ["Glass_convexConcavePeaksAction", "Glass_convexConcavePeaks"],
    ["Glass_reflectionVIriAction", "Glass_reflectionVIri"],
    ["Glass_refractionVIriAction", "Glass_refractionVIri"],
    ["Glass_distXResetAction", "Glass_distResetX"],
    ["Glass_colorCurveAction", "Glass_colorCurveRGB"],
    ["Glass_colorMaxvalAction", "Glass_colorMaxvalDecayUsetransmittance"],
    ["colorBoostFactorPowerAction", "Glass_colorBoostFactorCurve"],
  ];

  const devPositions = {};
  for (const [clip, glassName] of devGlassActions) {
    sampleClip(devGltf, clip, 0);
    const node = devGltf.scene.getObjectByName(glassName);
    if (node) devPositions[glassName] = node.position.toArray().map((v) => +v.toFixed(4));
  }

  const camEmptyClips = [
    "EmptyAction",
    "EmptyAction.002",
    "EmptyAction.003",
    "EmptyAction.004",
    "EmptyAction.005",
    "EmptyAction.006",
    "EmptyAction.007",
  ];

  console.log("dev glass @ t=0:");
  for (const [k, v] of Object.entries(devPositions)) console.log(" ", k, v);

  console.log("\ncam projects per EmptyAction @ t=0:");
  const projectSamples = {};
  for (const clipName of camEmptyClips) {
    // Reload fresh scene state by re-parsing cam (cheap enough)
    const cam = await loadGlb("public/eagle-extract/assets/timelines/cam.glb");
    sampleClip(cam, clipName, 0);
    const projects = [];
    cam.scene.traverse((o) => {
      if (/^project\d+$/.test(o.name)) projects.push(o);
    });
    projects.sort((a, b) => a.name.localeCompare(b.name));
    console.log(`\n${clipName}:`);
    for (const p of projects) {
      const pos = p.position.toArray().map((v) => +v.toFixed(4));
      const rot = p.quaternion.toArray().map((v) => +v.toFixed(4));
      console.log(" ", p.name, "pos", pos, "rot", rot);
      projectSamples[`${clipName}:${p.name}`] = { pos, rot };
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
