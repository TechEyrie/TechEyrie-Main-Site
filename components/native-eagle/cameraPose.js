import * as THREE from "three";

/**
 * Sample world-space camera pose after scrubbing cam.glb New CameraAction.
 */
export function sampleCameraWorldPose(camera) {
  camera.updateMatrixWorld(true);
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  camera.getWorldPosition(position);
  camera.getWorldQuaternion(quaternion);
  return {
    position: position.toArray(),
    quaternion: quaternion.toArray(),
    fov: camera.fov,
  };
}

export function compareCameraPose(actual, expected, { positionMaxDelta = 0.05, quaternionMinDot = 0.9995 } = {}) {
  const posDelta = Math.sqrt(
    actual.position.reduce((sum, v, i) => sum + (v - expected.position[i]) ** 2, 0),
  );

  const dot = Math.abs(
    actual.quaternion.reduce((sum, v, i) => sum + v * expected.quaternion[i], 0),
  );

  return {
    pass: posDelta <= positionMaxDelta && dot >= quaternionMinDot,
    positionDelta: posDelta,
    quaternionDot: dot,
  };
}

export function roundPose(pose) {
  return {
    position: pose.position.map((v) => Number(v.toFixed(6))),
    quaternion: pose.quaternion.map((v) => Number(v.toFixed(6))),
    fov: pose.fov,
  };
}

/**
 * Scrub cam.glb clip and return camera pose at timeline time.
 */
export function sampleTimelineCameraPose(camRoot, camClip, camera, time) {
  const mixer = new THREE.AnimationMixer(camRoot);
  const action = mixer.clipAction(camClip);
  action.play();
  action.paused = true;
  action.time = time;
  mixer.update(0);
  return sampleCameraWorldPose(camera);
}

/**
 * Compute hero scroll progress from a pinned section element.
 */
export function computeHeroScrollProgress(pinElement) {
  if (!pinElement) return 0;
  const pinTop = pinElement.offsetTop;
  const pinHeight = pinElement.offsetHeight;
  const viewH = window.innerHeight;
  const scrollRange = Math.max(pinHeight - viewH, 1);
  const scrolled = window.scrollY - pinTop;
  return THREE.MathUtils.clamp(scrolled / scrollRange, 0, 1);
}
