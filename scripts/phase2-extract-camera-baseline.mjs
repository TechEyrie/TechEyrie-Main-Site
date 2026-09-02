/**
 * Extract reference camera poses from cam.glb at hero checkpoints (Node + Three.js).
 * Run: node scripts/phase2-extract-camera-baseline.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { resolveTimelineCamera, updateCameraFromRig } from "../components/native-eagle/retargetAnimation.js";
import { CAMERA_SETTINGS, TIMELINE_DURATION } from "../components/native-eagle/constants.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outFile = path.join(root, "docs/native-eagle/baseline/camera-reference.json");

const CHECKPOINTS = [
  { progress: 0, timelineTime: 0 },
  { progress: 0.05, timelineTime: 1 },
  { progress: 0.1, timelineTime: 2 },
];

const loader = new GLTFLoader();
const camPath = path.join(root, "public/models/cam.glb");

function samplePose(camRoot, camClip, camera, time) {
  const mixer = new THREE.AnimationMixer(camRoot);
  const action = mixer.clipAction(camClip);
  action.play();
  action.paused = true;
  action.time = time;
  mixer.update(0);
  camRoot.updateWorldMatrix(true, true);
  updateCameraFromRig({ camera, camRoot });
  camera.updateMatrixWorld(true);

  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  camera.getWorldPosition(pos);
  camera.getWorldQuaternion(quat);

  return {
    timelineTime: time,
    position: pos.toArray().map((v) => Number(v.toFixed(6))),
    quaternion: quat.toArray().map((v) => Number(v.toFixed(6))),
    fov: camera.fov,
  };
}

const buffer = fs.readFileSync(camPath);
const gltf = await new Promise((resolve, reject) => {
  loader.parse(
    buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
    pathToFileURL(path.dirname(camPath) + path.sep).href,
    resolve,
    reject,
  );
});

const camRoot = gltf.scene;
const camClip =
  gltf.animations.find((c) => c.name === "New CameraAction") ??
  gltf.animations.find((c) => /camera/i.test(c.name));

const trackSummary = camClip.tracks.map((t) => t.name);
const { camera, rig } = resolveTimelineCamera(camRoot, camClip, 1440 / 900);
camera.fov = CAMERA_SETTINGS.fov;
camera.updateProjectionMatrix();

const samples = CHECKPOINTS.map(({ progress, timelineTime }) => ({
  progress,
  ...samplePose(camRoot, camClip, camera, timelineTime),
}));

const output = {
  generatedAt: new Date().toISOString(),
  source: "public/models/cam.glb",
  clip: camClip.name,
  rigName: rig?.name ?? null,
  trackCount: camClip.tracks.length,
  trackSummary: trackSummary.slice(0, 12),
  timelineDuration: TIMELINE_DURATION,
  checkpoints: samples,
  tolerance: {
    positionMaxDelta: 0.05,
    quaternionMinDot: 0.9995,
  },
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
console.log("Wrote", outFile);
console.log(JSON.stringify(samples, null, 2));
