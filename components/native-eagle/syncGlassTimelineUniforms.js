import { GLASS_TIMELINE_BINDINGS, GLASS_UNIFORM_DEFAULTS } from "./glassConfig.js";
import { GLASS_COLORS } from "./constants.js";
import * as THREE from "three";

const AXIS_INDEX = { x: 0, y: 1, z: 2 };

/**
 * Resolve glass uniform values from cam.glb timeline dummy nodes.
 * Missing nodes fall back to glassConfig defaults.
 */
export function sampleGlassTimelineUniforms(camRoot) {
  const values = { ...GLASS_UNIFORM_DEFAULTS };
  let boundCount = 0;

  for (const binding of GLASS_TIMELINE_BINDINGS) {
    const node = camRoot?.getObjectByName?.(binding.node);
    if (!node) {
      values[binding.uniform] = binding.fallback ?? GLASS_UNIFORM_DEFAULTS[binding.uniform];
      continue;
    }
    const axis = AXIS_INDEX[binding.axis] ?? 0;
    values[binding.uniform] = node.position.getComponent(axis);
    boundCount += 1;
  }

  return { values, boundCount, totalBindings: GLASS_TIMELINE_BINDINGS.length };
}

/**
 * Push sampled glass uniforms onto all GlassBack / GlassFront materials.
 */
export function applyGlassUniformsToMeshes(root, values) {
  let materialCount = 0;
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.isGlassDispersion) return;
    for (const mat of [obj.frontMaterial, obj.backMaterial]) {
      if (!mat?.uniforms) continue;
      for (const [key, value] of Object.entries(values)) {
        if (mat.uniforms[key]) mat.uniforms[key].value = value;
      }
      materialCount += 1;
    }
  });
  return materialCount;
}

/**
 * Phase 10 — push teal glass colors (base / peaks / fringe) onto materials.
 */
export function applyGlassColorUniforms(
  root,
  colors = GLASS_COLORS,
  fringeHex = GLASS_COLORS.fringeColor,
) {
  const base = new THREE.Color(colors.color);
  const peaks = new THREE.Color(colors.peaksColor);
  const fringe = new THREE.Color(fringeHex);
  let count = 0;
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.isGlassDispersion) return;
    for (const mat of [obj.frontMaterial, obj.backMaterial]) {
      if (!mat?.uniforms) continue;
      if (mat.uniforms.baseColor) mat.uniforms.baseColor.value.copy(base);
      if (mat.uniforms.peaksColor) mat.uniforms.peaksColor.value.copy(peaks);
      if (mat.uniforms.fringeColor) mat.uniforms.fringeColor.value.copy(fringe);
      count += 1;
    }
  });
  return count;
}

/**
 * Sample cam timeline glass nodes and apply to materials.
 * @param {object|null} overrides — Phase 10 eagle-2 uniform overrides (merged last)
 */
export function syncGlassTimelineUniforms(camRoot, birdRoot, overrides = null) {
  const sampled = sampleGlassTimelineUniforms(camRoot);
  const values = overrides ? { ...sampled.values, ...overrides } : sampled.values;
  const materialCount = applyGlassUniformsToMeshes(birdRoot, values);
  return { ...sampled, values, materialCount, overridesApplied: Boolean(overrides) };
}
