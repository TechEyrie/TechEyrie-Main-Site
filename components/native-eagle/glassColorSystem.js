import * as THREE from "three";
import { GLASS_COLORS } from "./constants.js";
import { DEV_GLASS_HERO_POSITIONS } from "./createGlassTimelineFromDev.js";

/** Patched eagle-project / eagle-project-2 teal triplet. */
export const REFERENCE_GLASS_COLORS = {
  color: "#12c48a",
  peaksColor: "#6ee7b7",
  fringeColor: "#047857",
};

/** Noomo bundle default (pre teal patch). */
export const NOOMO_GLASS_COLORS = {
  color: "#ffffff",
  peaksColor: "#ffffff",
  fringeColor: "#b0b0b0",
};

/** LCG — matches Noomo `xte` (seed 1111111114). */
export class SeededRandom {
  constructor(seed = 1111111114) {
    this.seed = seed >>> 0;
  }

  next() {
    this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0;
    return this.seed / 0x100000000;
  }

  range(min, max) {
    return min + this.next() * (max - min);
  }
}

/**
 * Green-teal HSL randomize — from patch-eagle-teal.mjs / reference `T0.randomize`.
 * Hue 0.38–0.46, saturation/lightness shaped like Noomo.
 */
export function randomizeGlassColorHSL() {
  const hue = 0.38 + Math.random() * 0.08;
  const t = Math.random() * 0.35;
  const saturation = 0.62 + 0.38 * (1 - t * t * t);
  const r = Math.random() * 0.45;
  const lightness = 0.38 + 0.4 * (1 - r * r);
  const color = new THREE.Color();
  color.setHSL(hue, saturation, lightness);
  return `#${color.getHexString()}`;
}

/** Independent HSL randomize for color / peaks / fringe (reference dev button). */
export function randomizeGlassColorTriplet() {
  return {
    color: randomizeGlassColorHSL(),
    peaksColor: randomizeGlassColorHSL(),
    fringeColor: randomizeGlassColorHSL(),
  };
}

/**
 * Cohesive teal shades from a base — peaks lighter, fringe darker (hero preset style).
 */
export function deriveTealShades(baseHex = REFERENCE_GLASS_COLORS.color) {
  const base = new THREE.Color(baseHex);
  const hsl = { h: 0, s: 0, l: 0 };
  base.getHSL(hsl);

  const peaks = new THREE.Color();
  peaks.setHSL(hsl.h, Math.min(1, hsl.s * 0.92), Math.min(1, hsl.l + 0.18));

  const fringe = new THREE.Color();
  fringe.setHSL(hsl.h, Math.min(1, hsl.s * 1.08), Math.max(0, hsl.l - 0.22));

  return {
    color: baseHex.startsWith("#") ? baseHex : `#${base.getHexString()}`,
    peaksColor: `#${peaks.getHexString()}`,
    fringeColor: `#${fringe.getHexString()}`,
  };
}

/** Named green families for parity sandbox — base hex; peaks/fringe derived. */
export const GREEN_SHADE_PRESETS = [
  { id: "reference", label: "Reference teal", base: "#12c48a" },
  { id: "mint", label: "Mint", base: "#5eead4" },
  { id: "emerald", label: "Emerald", base: "#10b981" },
  { id: "jade", label: "Jade", base: "#059669" },
  { id: "forest", label: "Forest", base: "#166534" },
  { id: "lime", label: "Lime", base: "#84cc16" },
  { id: "chartreuse", label: "Chartreuse", base: "#a3e635" },
  { id: "olive", label: "Olive", base: "#65a30d" },
  { id: "seafoam", label: "Seafoam", base: "#2dd4bf" },
  { id: "pine", label: "Pine", base: "#14532d" },
];

/**
 * Random cohesive green shade family (one hue, peaks lighter / fringe darker).
 * Wider green hue band than independent triplet randomize.
 */
export function randomizeGreenShadeFamily(seed = Date.now()) {
  const rng = new SeededRandom(seed);
  // Hue ~120°–170° in Three.js 0–1 space (true green → teal-green)
  const hue = 0.33 + rng.range(0, 0.14);
  const saturation = rng.range(0.55, 0.92);
  const lightness = rng.range(0.32, 0.58);
  const base = new THREE.Color();
  base.setHSL(hue, saturation, lightness);
  return deriveTealShades(`#${base.getHexString()}`);
}

export function glassColorsFromGreenPreset(presetOrBase) {
  const base =
    typeof presetOrBase === "string"
      ? presetOrBase
      : presetOrBase?.base ?? REFERENCE_GLASS_COLORS.color;
  return deriveTealShades(base);
}

/** Numeric uniform randomize rules — from eagle-extract/glass/config-from-bundle.json */
export const GLASS_NUMERIC_RANDOM_RULES = [
  { node: "Glass_iorVDeltaXshift", axis: 0, min: 1, max: 2 },
  { node: "Glass_iorVDeltaXshift", axis: 1, min: 0, max: 5 },
  { node: "Glass_iorVDeltaXshift", axis: 2, min: 1, max: 5 },
  { node: "Glass_reflectionVIri", axis: 0, min: 0, max: 1 },
  { node: "Glass_reflectionVIri", axis: 1, min: 0, max: 1 },
  { node: "Glass_refractionVIri", axis: 0, min: 0, max: 1 },
  { node: "Glass_refractionVIri", axis: 1, min: 0, max: 1 },
  { node: "Glass_convexConcavePeaks", axis: 0, min: 0, max: 1 },
  { node: "Glass_convexConcavePeaks", axis: 1, min: 0, max: 1 },
  { node: "Glass_convexConcavePeaks", axis: 2, min: 0, max: 3 },
  { node: "Glass_fringeCurveMix", axis: 0, min: 0, max: 5 },
  { node: "Glass_fringeCurveMix", axis: 1, min: 0, max: 1 },
  { node: "Glass_colorBoostFactorCurve", axis: 0, min: 1, max: 2 },
  { node: "Glass_colorBoostFactorCurve", axis: 1, min: 0.5, max: 1.5 },
  { node: "Glass_colorBoostFactorCurve", axis: 2, min: 0.9, max: 1.111 },
  { node: "Glass_colorCurveRGB", axis: 0, min: 0.9, max: 1.111 },
  { node: "Glass_colorCurveRGB", axis: 1, min: 0.9, max: 1.111 },
  { node: "Glass_colorCurveRGB", axis: 2, min: 0.9, max: 1.111 },
  { node: "Glass_colorMaxvalDecayUsetransmittance", axis: 0, min: 1, max: 100 },
  { node: "Glass_colorMaxvalDecayUsetransmittance", axis: 1, min: 0, max: 10000 },
];

/**
 * Randomize Glass_* timeline dummy nodes (reference `randomizeParametersEvent`).
 */
export function randomizeGlassTimelineNodes(camRoot, seed = Date.now()) {
  const rng = new SeededRandom(seed);
  let count = 0;
  for (const rule of GLASS_NUMERIC_RANDOM_RULES) {
    const node = camRoot?.getObjectByName?.(rule.node);
    if (!node) continue;
    node.position.setComponent(rule.axis, rng.range(rule.min, rule.max));
    count += 1;
  }
  return { seed: rng.seed, nodesTouched: count };
}

/** Restore dev.glb hero positions @ t=0 (reference default look). */
export function resetGlassTimelineToHero(camRoot) {
  let count = 0;
  for (const [name, pos] of Object.entries(DEV_GLASS_HERO_POSITIONS)) {
    const node = camRoot?.getObjectByName?.(name);
    if (!node || !pos) continue;
    node.position.set(pos[0], pos[1], pos[2]);
    count += 1;
  }
  return count;
}

export function normalizeGlassColors(input = GLASS_COLORS) {
  return {
    color: input?.color ?? REFERENCE_GLASS_COLORS.color,
    peaksColor: input?.peaksColor ?? REFERENCE_GLASS_COLORS.peaksColor,
    fringeColor: input?.fringeColor ?? REFERENCE_GLASS_COLORS.fringeColor,
  };
}
