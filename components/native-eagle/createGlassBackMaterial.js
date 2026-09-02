import * as THREE from "three";
import {
  GLASS_BACK_FRAGMENT_DISPERSION,
  GLASS_BACK_FRAGMENT_SIMPLE,
  GLASS_BACK_VERTEX,
} from "./glassBackShaders.js";
import { GLASS_FRINGE_COLOR_HEX, GLASS_UNIFORM_DEFAULTS } from "./glassConfig.js";
import { BACK_SAMPLES_COUNT } from "./constants.js";

function wrapVertex(source) {
  return `#include <common>\n${source}`;
}

function wrapFragment(source) {
  return `#include <common>\n${source}`;
}

/**
 * Noomo `ek` — GlassBack ShaderMaterial (dispersion or simple fragment).
 */
export function createGlassBackMaterial({
  hasSkinning = false,
  defaultDist = false,
  normalMap = null,
  dispersion = true,
  textures = {},
  tealLift = false,
} = {}) {
  const defines = {
    samplesCount: String(BACK_SAMPLES_COUNT),
  };
  if (hasSkinning) defines.USE_SKINNING = "";
  if (defaultDist) defines.USE_DEFAULT_DIST = "";
  if (normalMap) defines.USE_NORMAL_MAP = "";
  if (tealLift) defines.EAGLE2_TEAL_LIFT = "";

  const fringeColor = new THREE.Color(GLASS_FRINGE_COLOR_HEX);

  const uniforms = {
    map: { value: textures.map ?? null },
    noiseMap: { value: textures.blueNoise ?? null },
    envMap: { value: textures.envMap ?? null },
    colorsMap: { value: textures.colorsMap ?? null },
    normalMap: { value: normalMap },
    envRefraction: { value: GLASS_UNIFORM_DEFAULTS.envRefraction },
    iorStart: { value: GLASS_UNIFORM_DEFAULTS.iorStart },
    iorDelta: { value: GLASS_UNIFORM_DEFAULTS.iorDelta },
    refractionIridescence: { value: GLASS_UNIFORM_DEFAULTS.refractionIridescence },
    uvShiftFactor: { value: GLASS_UNIFORM_DEFAULTS.uvShiftFactor },
    fringeCurve: { value: GLASS_UNIFORM_DEFAULTS.fringeCurve },
    fringeMix: { value: GLASS_UNIFORM_DEFAULTS.fringeMix },
    fringeColor: { value: fringeColor },
    useTransmittance: { value: GLASS_UNIFORM_DEFAULTS.useTransmittance },
    seconds: { value: 0 },
    convexityFactor: { value: GLASS_UNIFORM_DEFAULTS.convexityFactor },
    concavityFactor: { value: GLASS_UNIFORM_DEFAULTS.concavityFactor },
    distancesFactor: { value: GLASS_UNIFORM_DEFAULTS.distancesFactor },
    resetDistances: { value: GLASS_UNIFORM_DEFAULTS.resetDistances },
  };

  const fragmentSource = dispersion ? GLASS_BACK_FRAGMENT_DISPERSION : GLASS_BACK_FRAGMENT_SIMPLE;

  const material = new THREE.ShaderMaterial({
    name: "GlassBack",
    defines,
    uniforms,
    vertexShader: wrapVertex(GLASS_BACK_VERTEX),
    fragmentShader: wrapFragment(fragmentSource),
    side: THREE.BackSide,
    depthTest: false,
    depthWrite: false,
    transparent: true,
  });

  material.skinning = hasSkinning;
  material.isGlassBackShader = true;
  material.glassBackDispersion = dispersion;

  return material;
}

/**
 * Wire shared pipeline textures/uniforms onto all glass back materials.
 */
export function bindGlassBackUniforms(root, { map, envMap, seconds }) {
  let count = 0;
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.backMaterial?.isGlassBackShader) return;
    if (map !== undefined) obj.backMaterial.uniforms.map.value = map;
    if (envMap !== undefined) obj.backMaterial.uniforms.envMap.value = envMap;
    if (seconds !== undefined) obj.backMaterial.uniforms.seconds.value = seconds;
    count += 1;
  });
  return count;
}
