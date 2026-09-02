import * as THREE from "three";
import {
  GLASS_FRONT_FRAGMENT_DISPERSION,
  GLASS_FRONT_FRAGMENT_SIMPLE,
  GLASS_FRONT_VERTEX,
} from "./glassFrontShaders.js";
import { GLASS_FRINGE_COLOR_HEX, GLASS_UNIFORM_DEFAULTS } from "./glassConfig.js";
import { GLASS_COLORS, LOW_FRONT_SAMPLES_COUNT } from "./constants.js";

function wrapVertex(source) {
  return `#include <common>\n${source}`;
}

function wrapFragment(source) {
  return `#include <common>\n${source}`;
}

/**
 * Noomo `tk` — GlassFront ShaderMaterial (dispersion or simple fragment).
 * Samples `@Post.backMap` via uniforms.map (backRT texture).
 */
export function createGlassFrontMaterial({
  hasSkinning = false,
  normalMap = null,
  dispersion = true,
  textures = {},
  tealLift = false,
  debugSolidColor = false,
} = {}) {
  const defines = {
    samplesCount: String(LOW_FRONT_SAMPLES_COUNT),
  };
  if (hasSkinning) defines.USE_SKINNING = "";
  if (normalMap) defines.USE_NORMAL_MAP = "";
  if (tealLift) defines.EAGLE2_TEAL_LIFT = "";
  if (debugSolidColor) defines.GLASS_DEBUG_SOLID = "";

  const fringeColor = new THREE.Color(GLASS_FRINGE_COLOR_HEX);
  const baseColor = new THREE.Color(GLASS_COLORS.color);
  const peaksColor = new THREE.Color(GLASS_COLORS.peaksColor);

  const uniforms = {
    map: { value: textures.map ?? null },
    noiseMap: { value: textures.blueNoise ?? null },
    envMap: { value: textures.envMap ?? null },
    colorsMap: { value: textures.colorsMap ?? null },
    normalMap: { value: normalMap },
    envReflection: { value: GLASS_UNIFORM_DEFAULTS.envReflection },
    colorFactor: { value: GLASS_UNIFORM_DEFAULTS.colorFactor },
    iorStart: { value: GLASS_UNIFORM_DEFAULTS.iorStart },
    iorDelta: { value: GLASS_UNIFORM_DEFAULTS.iorDelta },
    reflectionIridescence: { value: GLASS_UNIFORM_DEFAULTS.reflectionIridescence },
    colorBoost: { value: GLASS_UNIFORM_DEFAULTS.colorBoost },
    decayFactor: { value: GLASS_UNIFORM_DEFAULTS.decayFactor },
    maxColorValue: { value: GLASS_UNIFORM_DEFAULTS.maxColorValue },
    useTransmittance: { value: GLASS_UNIFORM_DEFAULTS.useTransmittance },
    fringeCurve: { value: GLASS_UNIFORM_DEFAULTS.fringeCurve },
    fringeMix: { value: GLASS_UNIFORM_DEFAULTS.fringeMix },
    fringeColor: { value: fringeColor },
    uvShiftFactor: { value: GLASS_UNIFORM_DEFAULTS.uvShiftFactor },
    seconds: { value: 0 },
    colorCurve: { value: GLASS_UNIFORM_DEFAULTS.colorCurve },
    colorCurveR: { value: GLASS_UNIFORM_DEFAULTS.colorCurveR },
    colorCurveG: { value: GLASS_UNIFORM_DEFAULTS.colorCurveG },
    colorCurveB: { value: GLASS_UNIFORM_DEFAULTS.colorCurveB },
    distancesFactor: { value: GLASS_UNIFORM_DEFAULTS.distancesFactor },
    resetDistances: { value: GLASS_UNIFORM_DEFAULTS.resetDistances },
    baseColor: { value: baseColor },
    peaksColor: { value: peaksColor },
    peaksFactor: { value: GLASS_UNIFORM_DEFAULTS.peaksFactor },
  };

  const fragmentSource = dispersion ? GLASS_FRONT_FRAGMENT_DISPERSION : GLASS_FRONT_FRAGMENT_SIMPLE;

  const material = new THREE.ShaderMaterial({
    name: "GlassFront",
    defines,
    uniforms,
    vertexShader: wrapVertex(GLASS_FRONT_VERTEX),
    fragmentShader: wrapFragment(fragmentSource),
    side: THREE.FrontSide,
    depthTest: true,
    depthWrite: false,
    transparent: true,
  });

  material.skinning = hasSkinning;
  material.isGlassFrontShader = true;
  material.glassFrontDispersion = dispersion;

  return material;
}

/**
 * Wire shared pipeline textures/uniforms onto all glass front materials.
 */
export function bindGlassFrontUniforms(root, { map, envMap, seconds }) {
  let count = 0;
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.frontMaterial?.isGlassFrontShader) return;
    if (map !== undefined) obj.frontMaterial.uniforms.map.value = map;
    if (envMap !== undefined) obj.frontMaterial.uniforms.envMap.value = envMap;
    if (seconds !== undefined) obj.frontMaterial.uniforms.seconds.value = seconds;
    count += 1;
  });
  return count;
}
