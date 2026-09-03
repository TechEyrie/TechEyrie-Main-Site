/** GlassConfig timeline bindings — from PHASE-0-INVENTORY.json */
export const GLASS_UNIFORM_DEFAULTS = {
  resetDistances: 0,
  distancesFactor: 1,
  iorStart: 1.2,
  iorDelta: 0.3,
  uvShiftFactor: 1,
  envReflection: 1,
  envRefraction: 0,
  reflectionIridescence: 0,
  refractionIridescence: 0,
  convexityFactor: 1,
  concavityFactor: 1,
  peaksFactor: 1,
  fringeCurve: 5,
  fringeMix: 1,
  colorBoost: 1,
  colorFactor: 1,
  colorCurve: 1,
  colorCurveR: 1,
  colorCurveG: 1,
  colorCurveB: 1,
  maxColorValue: 25,
  decayFactor: 20,
  useTransmittance: 1,
};

/**
 * Phase 10 — eagle-project-2 glass parity (reference bundle + dev timeline).
 */
export const EAGLE2_GLASS_UNIFORM_OVERRIDES = {
  iorStart: 1.15,
  envReflection: 0.28,
  colorFactor: 1.45,
  decayFactor: 9,
  maxColorValue: 18,
};

/**
 * Reference eagle-project-2 crystalHovers[0] — the exact hero glass state.
 * Extracted from the reference bundle (CbdjwYMp.js crystalHovers array).
 * Used by eagle-extract-test3 for ditto-copy parity.
 */
export const EAGLE2_CRYSTAL_HOVER_0_OVERRIDES = {
  resetDistances: 0.33,
  distancesFactor: 22.22,
  iorStart: 1.3,
  iorDelta: 0.33,
  uvShiftFactor: 1.8,
  envReflection: 0.22,
  envRefraction: 0.72,
  reflectionIridescence: 0.16,
  refractionIridescence: 0.95,
  convexityFactor: 0.72,
  concavityFactor: 0.52,
  peaksFactor: 0.84,
  fringeCurve: 3.23,
  fringeMix: 0.83,
  colorBoost: 0.04,
  colorFactor: 2.58,
  colorCurve: 1.37,
  colorCurveR: 1,
  colorCurveG: 1.11,
  colorCurveB: 1.11,
  maxColorValue: 50,
  decayFactor: 250,
};

/**
 * eagle-extract-test3 — keep hero timeline geometry, lift luminance to match
 * the reference embed's bright teal glass without crystal-hover distances.
 */
export const TEST3_GLASS_OVERRIDES = {
  colorFactor: 1.55,
  colorBoost: 1.15,
  envRefraction: 0.88,
  uvShiftFactor: 1.85,
  refractionIridescence: 0.45,
  colorCurve: 0.92,
  colorCurveG: 0.9,
  colorCurveB: 0.88,
};

export const GLASS_FRINGE_COLOR_HEX = "#047857";

/**
 * Maps glass uniform name → cam.glb dummy node path (`Node.position.{xyz}`).
 */
export const GLASS_TIMELINE_BINDINGS = [
  { uniform: "resetDistances", node: "Glass_distResetX", axis: "x", fallback: 0 },
  { uniform: "distancesFactor", node: "Glass_distResetX", axis: "y", fallback: 1 },
  { uniform: "iorStart", node: "Glass_iorVDeltaXshift", axis: "x", fallback: 1.2 },
  { uniform: "iorDelta", node: "Glass_iorVDeltaXshift", axis: "y", fallback: 0.3 },
  { uniform: "uvShiftFactor", node: "Glass_iorVDeltaXshift", axis: "z", fallback: 1 },
  { uniform: "envReflection", node: "Glass_reflectionVIri", axis: "x", fallback: 1 },
  { uniform: "envRefraction", node: "Glass_refractionVIri", axis: "x", fallback: 0 },
  { uniform: "reflectionIridescence", node: "Glass_reflectionVIri", axis: "y", fallback: 0 },
  { uniform: "refractionIridescence", node: "Glass_refractionVIri", axis: "y", fallback: 0 },
  { uniform: "convexityFactor", node: "Glass_convexConcavePeaks", axis: "x", fallback: 1 },
  { uniform: "concavityFactor", node: "Glass_convexConcavePeaks", axis: "y", fallback: 1 },
  { uniform: "peaksFactor", node: "Glass_convexConcavePeaks", axis: "z", fallback: 1 },
  { uniform: "fringeCurve", node: "Glass_fringeCurveMix", axis: "x", fallback: 5 },
  { uniform: "fringeMix", node: "Glass_fringeCurveMix", axis: "y", fallback: 1 },
  { uniform: "colorBoost", node: "Glass_colorBoostFactorCurve", axis: "x", fallback: 1 },
  { uniform: "colorFactor", node: "Glass_colorBoostFactorCurve", axis: "y", fallback: 1 },
  { uniform: "colorCurve", node: "Glass_colorBoostFactorCurve", axis: "z", fallback: 1 },
  { uniform: "colorCurveR", node: "Glass_colorCurveRGB", axis: "x", fallback: 1 },
  { uniform: "colorCurveG", node: "Glass_colorCurveRGB", axis: "y", fallback: 1 },
  { uniform: "colorCurveB", node: "Glass_colorCurveRGB", axis: "z", fallback: 1 },
  { uniform: "maxColorValue", node: "Glass_colorMaxvalDecayUsetransmittance", axis: "x", fallback: 25 },
  { uniform: "decayFactor", node: "Glass_colorMaxvalDecayUsetransmittance", axis: "y", fallback: 20 },
  { uniform: "useTransmittance", node: "Glass_colorMaxvalDecayUsetransmittance", axis: "z", fallback: 1 },
];
