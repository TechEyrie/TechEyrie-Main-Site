import * as THREE from "three";



export function buildNameMap(root) {

  const map = new Map();

  root.traverse((obj) => {

    if (obj.name) map.set(obj.name, obj);

  });

  return map;

}



export function clipTargetsExist(clip, root) {

  if (!clip) return false;

  const names = buildNameMap(root);

  return clip.tracks.every((track) => {

    const dot = track.name.indexOf(".");

    if (dot < 0) return false;

    return names.has(track.name.slice(0, dot));

  });

}



/**

 * BirdAction drives the Phoenix root node — copy its transform onto the v20 bird rig.

 */

export function syncPhoenixTransform(sourceRoot, targetRoot) {

  const phoenix = sourceRoot.getObjectByName("Phoenix") || sourceRoot;

  phoenix.updateWorldMatrix(true, false);

  if (targetRoot.parent) {

    targetRoot.parent.updateWorldMatrix(true, false);

    const parentInv = new THREE.Matrix4().copy(targetRoot.parent.matrixWorld).invert();

    const world = phoenix.matrixWorld.clone().premultiply(parentInv);

    world.decompose(targetRoot.position, targetRoot.quaternion, targetRoot.scale);

  } else {

    targetRoot.position.copy(phoenix.position);

    targetRoot.quaternion.copy(phoenix.quaternion);

    targetRoot.scale.copy(phoenix.scale);

  }

  targetRoot.updateWorldMatrix(true, true);

}



/** @deprecated use syncPhoenixTransform — BirdAction animates Phoenix, not bones */

export const syncBoneTransforms = syncPhoenixTransform;



/**

 * Remap an AnimationClip from cam.glb onto v20.glb by matching node names.

 */

export function retargetClip(clip, sourceRoot, targetRoot) {

  if (!clip) return null;



  const sources = buildNameMap(sourceRoot);

  const targets = buildNameMap(targetRoot);

  const tracks = [];



  for (const track of clip.tracks) {

    const dot = track.name.indexOf(".");

    if (dot < 0) continue;



    const nodeName = track.name.slice(0, dot);

    const property = track.name.slice(dot + 1);

    if (!sources.get(nodeName) || !targets.get(nodeName)) continue;



    const TrackCtor = track.constructor;

    tracks.push(new TrackCtor(`${nodeName}.${property}`, track.times, track.values));

  }



  if (tracks.length === 0) return null;

  return new THREE.AnimationClip(clip.name, clip.duration, tracks);

}



/**

 * Standalone render camera — not parented to cam.glb (Noomo uses Camera + Target look-at rig).

 */

export function resolveTimelineCamera(camRoot, _camClip, aspect) {

  let embedded = null;

  camRoot.traverse((obj) => {

    if (!embedded && obj.isPerspectiveCamera) embedded = obj;

  });

  if (embedded) return { camera: embedded, rig: null, useLookAtRig: false };



  const camNode = camRoot.getObjectByName("Camera");

  const targetNode = camRoot.getObjectByName("Target");

  const camera = new THREE.PerspectiveCamera(25, aspect, 0.1, 500);



  return {
    camera,
    rig: camNode ?? null,
    target: targetNode ?? null,
    useLookAtRig: false,
  };

}



const _lookTargetScratch = new THREE.Vector3();
const _viewDirScratch = new THREE.Vector3();
const _rightScratch = new THREE.Vector3();

/**
 * Sync render camera from cam.glb — Camera position + lookAt Phoenix (reference path).
 * cam.glb Camera.quaternion stays identity at t=0; lookAt matches camera-reference.json.
 */
export function updateCameraFromRig({ camera, camRoot, panScreenRight = 0 }) {
  const camNode = camRoot?.getObjectByName?.("Camera") ?? null;
  const phoenix = camRoot?.getObjectByName?.("Phoenix") ?? null;
  if (!camNode || !phoenix || !camera) return false;

  camNode.getWorldPosition(camera.position);
  phoenix.getWorldPosition(_lookTargetScratch);
  camera.up.set(0, 1, 0);

  if (panScreenRight !== 0) {
    camera.lookAt(_lookTargetScratch);
    camera.updateMatrixWorld(true);
    camera.getWorldDirection(_viewDirScratch);
    _rightScratch.crossVectors(camera.up, _viewDirScratch).normalize();
    _lookTargetScratch.addScaledVector(_rightScratch, panScreenRight);
  }

  camera.lookAt(_lookTargetScratch);
  camera.updateMatrixWorld(true);
  return true;
}



/** @deprecated use resolveTimelineCamera */

export function findTimelineCamera(root) {

  let camera = null;

  root.traverse((obj) => {

    if (!camera && obj.isPerspectiveCamera) camera = obj;

  });

  return camera;

}


