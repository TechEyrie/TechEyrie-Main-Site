import * as THREE from "three";
import { GLASS_TIMELINE_BINDINGS } from "./glassConfig.js";
import { retargetClip } from "./retargetAnimation.js";

/** dev.glb @ t=0 — reference glass uniform driver positions. */
export const DEV_GLASS_HERO_POSITIONS = {
  Glass_distResetX: [0, 1, 0],
  Glass_iorVDeltaXshift: [1.3, 3, 1],
  Glass_reflectionVIri: [1, 0.2, 0],
  Glass_refractionVIri: [0.6, 0.15, 0],
  Glass_convexConcavePeaks: [0.5, 0.5, 3],
  Glass_fringeCurveMix: [4, 0.55, 0],
  Glass_colorBoostFactorCurve: [1.55, 1, 0.95],
  Glass_colorCurveRGB: [1.15, 1.2, 1.1],
  Glass_colorMaxvalDecayUsetransmittance: [50, 20, 1],
};

const DEV_GLASS_CLIP_NAMES = [
  "EmptyAction",
  "Glass_edgesPowerMixAction",
  "Glass_convexConcavePeaksAction",
  "Glass_reflectionVIriAction",
  "Glass_refractionVIriAction",
  "Glass_distXResetAction",
  "Glass_colorCurveAction",
  "Glass_colorMaxvalAction",
  "colorBoostFactorPowerAction",
];

/**
 * Ensure Glass_* dummy nodes exist on camRoot (Noomo timelinePath targets).
 */
export function ensureGlassTimelineNodes(camRoot, devScene = null) {
  const unique = [...new Set(GLASS_TIMELINE_BINDINGS.map((b) => b.node))];
  let created = 0;
  for (const name of unique) {
    let node = camRoot.getObjectByName(name);
    if (!node) {
      node = new THREE.Object3D();
      node.name = name;
      camRoot.add(node);
      created += 1;
    }
    const src = devScene?.getObjectByName?.(name);
    if (src) {
      node.position.copy(src.position);
    } else {
      const fallback = DEV_GLASS_HERO_POSITIONS[name];
      if (fallback) node.position.set(fallback[0], fallback[1], fallback[2]);
    }
  }
  return { created, total: unique.length };
}

/**
 * Retarget dev.glb glass timeline clips onto camRoot Glass nodes.
 */
export function createGlassTimelineMixers(devGltf, camRoot) {
  ensureGlassTimelineNodes(camRoot, devGltf.scene);
  const mixers = [];

  for (const clipName of DEV_GLASS_CLIP_NAMES) {
    const clip = devGltf.animations.find((c) => c.name === clipName);
    if (!clip) continue;
    const retargeted = retargetClip(clip, devGltf.scene, camRoot);
    if (!retargeted) continue;
    const mixer = new THREE.AnimationMixer(camRoot);
    const action = mixer.clipAction(retargeted);
    action.play();
    action.paused = true;
    mixers.push({ mixer, action, clipName });
  }

  return mixers;
}

export function scrubGlassTimelineMixers(mixers, time) {
  for (const { mixer, action } of mixers) {
    action.time = THREE.MathUtils.clamp(time, 0, action.getClip().duration);
    mixer.update(0);
  }
}

export function disposeGlassTimelineMixers(mixers) {
  for (const { mixer, action } of mixers) {
    action.stop();
    mixer.stopAllAction();
    mixer.uncacheRoot(mixer.getRoot());
  }
}
