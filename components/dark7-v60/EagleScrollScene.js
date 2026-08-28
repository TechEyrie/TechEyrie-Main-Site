"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Dark7V60ScrollTrigger,
  getDark7V60ScrollTop,
  refreshDark7V60ScrollTriggers,
  notifyHeroPinReady,
  DARK7_V60_HERO_PIN_ID,
} from "./lenisScrollTrigger";
import "./EagleScrollScene.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const BIRD_MESH = "/models/v20.glb";
export const HDR_ENV = "/models/wooden_studio_19_1k.hdr";
export const FEATHER_NORMAL = "/images/icen.jpg";
export const DRACO_DECODER_PATH = "/draco/gltf/";

const REST_BIRD = {
  // ── ZOOM / FRAMING (hero wing) ─────────────────────────────────────
  // scale: larger = wing fills more of the screen (zoom in)
  // camera Z is set near createScrollAnimation → camera.position.set(..., z)
  //   higher camera Z = zoom out | lower camera Z = zoom in
  // x / y: move wing left-right / up-down
  x: -0.6,
  y: 0.25,
  z: -0.3,
  scale: 1,
  rotZ: -0.2,
  rotY: 0,
  rotX: 0,
};

const SCROLL_END_BIRD = {
  x: -1,
  y: 2.5,
  z: -2.8,
  scale: 2.8,
  rotZ: 0,
  rotY: 0,
  rotX: 0,
};

/**
 * Default non-hero wing palette
 */
const WING_PALETTE = [
  {
    hue: 0.33,
    color: "#2BA542",
    shadow: "#12361D",
    highlight: "#5BC767",
    emissive: "#071008",
    tip: "#86D288",
    root: "#0D2916",
    stripe: "#1D6A30",
    vane: "#3AAE50",
    alt: "#225C34",
    cool: "#4E8E67",
  },
  {
    hue: 0.32,
    color: "#349F46",
    shadow: "#15371F",
    highlight: "#63C86F",
    emissive: "#071009",
    tip: "#8FD38F",
    root: "#102C19",
    stripe: "#216C33",
    vane: "#43AD54",
    alt: "#265E38",
    cool: "#558F6C",
  },
  {
    hue: 0.30,
    color: "#568F43",
    shadow: "#22391E",
    highlight: "#7CBD70",
    emissive: "#0A1109",
    tip: "#A0D493",
    root: "#1A2D17",
    stripe: "#375E2D",
    vane: "#619E4E",
    alt: "#2F5330",
    cool: "#678567",
  },
  {
    hue: 0.34,
    color: "#2F9B4B",
    shadow: "#143521",
    highlight: "#61C978",
    emissive: "#07100A",
    tip: "#8DD59A",
    root: "#102918",
    stripe: "#1D6A37",
    vane: "#3AAA5A",
    alt: "#235B39",
    cool: "#518B6E",
  },
];

/**
 * Hero leaf families — green transitions (forest → moss → sage → medium)
 * Site range #162d24 → #8EAC85 with olive / bottle / leaf variety.
 */
const HERO_TOP_PALETTE = [
  {
    hue: 0.34,
    color: "#163D28",
    shadow: "#0A2216",
    highlight: "#6AAB70",
    emissive: "#102C20",
    tip: "#96C490",
    root: "#06140E",
    stripe: "#1E4A30",
    vane: "#368048",
    alt: "#184230",
    cool: "#528A5C",
  },
  {
    hue: 0.30,
    color: "#2A4A28",
    shadow: "#142614",
    highlight: "#7AB868",
    emissive: "#1C3420",
    tip: "#A4D098",
    root: "#0C1A0C",
    stripe: "#325830",
    vane: "#4A8C40",
    alt: "#284828",
    cool: "#5E9A58",
  },
  {
    hue: 0.36,
    color: "#1A4838",
    shadow: "#0C281E",
    highlight: "#68B888",
    emissive: "#123428",
    tip: "#92D0A8",
    root: "#081810",
    stripe: "#225840",
    vane: "#3A9070",
    alt: "#1C4A38",
    cool: "#549A78",
  },
  {
    hue: 0.28,
    color: "#324A24",
    shadow: "#1A2610",
    highlight: "#88B858",
    emissive: "#223418",
    tip: "#B0D088",
    root: "#101808",
    stripe: "#3C5828",
    vane: "#5A8C38",
    alt: "#304820",
    cool: "#6E9A48",
  },
  {
    hue: 0.33,
    color: "#1E422C",
    shadow: "#0E2418",
    highlight: "#72B078",
    emissive: "#143024",
    tip: "#9CC89A",
    root: "#081610",
    stripe: "#265034",
    vane: "#408A50",
    alt: "#204630",
    cool: "#5A9A68",
  },
  {
    hue: 0.38,
    color: "#184440",
    shadow: "#0A2624",
    highlight: "#60B098",
    emissive: "#103230",
    tip: "#8CCCB8",
    root: "#061816",
    stripe: "#205248",
    vane: "#348A78",
    alt: "#1A463E",
    cool: "#4E9A88",
  },
];

/** Outer tips — lighter green transitions toward #8EAC85 / sage / olive */
const HERO_BOTTOM_PALETTE = [
  {
    hue: 0.34,
    color: "#3A7A48",
    shadow: "#1A4024",
    highlight: "#8EAC85",
    emissive: "#2A5A34",
    tip: "#B8D4A4",
    root: "#102816",
    stripe: "#4A8A54",
    vane: "#5EA066",
    alt: "#346840",
    cool: "#7AAA74",
  },
  {
    hue: 0.30,
    color: "#4A8040",
    shadow: "#244420",
    highlight: "#9AB878",
    emissive: "#345E30",
    tip: "#C4D8A0",
    root: "#142A12",
    stripe: "#5A9050",
    vane: "#6EA658",
    alt: "#446C38",
    cool: "#86B070",
  },
  {
    hue: 0.36,
    color: "#3A8060",
    shadow: "#1A4434",
    highlight: "#88BCA0",
    emissive: "#2A5E48",
    tip: "#B0DCC0",
    root: "#102A20",
    stripe: "#4A9070",
    vane: "#5EA888",
    alt: "#346C54",
    cool: "#7AB498",
  },
  {
    hue: 0.28,
    color: "#527838",
    shadow: "#2A401C",
    highlight: "#A4BC70",
    emissive: "#3A5828",
    tip: "#CCD890",
    root: "#182610",
    stripe: "#628848",
    vane: "#769E50",
    alt: "#4A6430",
    cool: "#8EB068",
  },
  {
    hue: 0.33,
    color: "#3E7E50",
    shadow: "#1C442A",
    highlight: "#92B48C",
    emissive: "#2C5E3A",
    tip: "#BCD8AC",
    root: "#122A1A",
    stripe: "#4E905C",
    vane: "#62A66E",
    alt: "#386C48",
    cool: "#7EB07C",
  },
  {
    hue: 0.37,
    color: "#387A68",
    shadow: "#184038",
    highlight: "#84B8A8",
    emissive: "#285A4C",
    tip: "#AAD8C8",
    root: "#0E2820",
    stripe: "#468A78",
    vane: "#5AA290",
    alt: "#326858",
    cool: "#76B0A0",
  },
];

const FEATHER_PAINT_STRENGTH = 1.0;
const WING_TIP_ZONE_START = 0.16;
const WING_TIP_BLEND_STRENGTH = 0.98;

function isBodyOnlyMesh(mesh) {
  const name = (mesh.name || "").toLowerCase();
  return /^b_body|^b_head|^b_neck|^bone/i.test(name);
}

function isWingFeatherMesh(mesh) {
  const name = (mesh.name || "").toLowerCase();
  if (isBodyOnlyMesh(mesh)) return false;
  if (/wing|feather|cover|primar|second|tert|scap|alula|leaf/.test(name)) return true;

  if (!mesh.geometry) return false;
  mesh.geometry.computeBoundingBox();
  const bbox = mesh.geometry.boundingBox;
  if (!bbox) return false;

  const size = bbox.getSize(new THREE.Vector3());
  const minDim = Math.min(size.x, size.y, size.z);
  const maxDim = Math.max(size.x, size.y, size.z);
  // Catch top + bottom leaf meshes
  return maxDim / (minDim + 1e-5) > 1.45;
}

function pickHeroFeatherSwatch(mesh, birdOrigin, meshIndex) {
  mesh.geometry?.computeBoundingBox();
  const bbox = mesh.geometry?.boundingBox;
  if (!bbox) {
    return {
      swatch: HERO_TOP_PALETTE[meshIndex % HERO_TOP_PALETTE.length],
      isBottom: false,
    };
  }

  const localCenter = new THREE.Vector3();
  bbox.getCenter(localCenter);
  const worldCenter = localCenter.clone().applyMatrix4(mesh.matrixWorld);
  const relY = worldCenter.y - birdOrigin.y;

  const size = bbox.getSize(new THREE.Vector3());
  const minDim = Math.min(size.x, size.y, size.z) + 1e-5;
  const maxDim = Math.max(size.x, size.y, size.z);
  const elongation = maxDim / minDim;

  const isBottom = relY < 0.04 || elongation > 4.2;
  const palette = isBottom ? HERO_BOTTOM_PALETTE : HERO_TOP_PALETTE;

  return {
    swatch: palette[meshIndex % palette.length],
    isBottom,
  };
}

function computeFeatherTipAxis(mesh, birdOrigin) {
  mesh.geometry.computeBoundingBox();
  const bbox = mesh.geometry.boundingBox;
  if (!bbox) return null;

  const size = bbox.getSize(new THREE.Vector3());
  const dims = [size.x, size.y, size.z];
  const axisIdx = dims.indexOf(Math.max(...dims));
  const span = dims[axisIdx];
  if (span < 0.012) return null;

  // Across = second-longest axis (leaf width) for midrib / diagonal UV
  let acrossIdx = 0;
  let acrossSpan = -1;
  for (let i = 0; i < 3; i += 1) {
    if (i === axisIdx) continue;
    if (dims[i] > acrossSpan) {
      acrossSpan = dims[i];
      acrossIdx = i;
    }
  }

  const minVal = [bbox.min.x, bbox.min.y, bbox.min.z][axisIdx];
  const maxVal = [bbox.max.x, bbox.max.y, bbox.max.z][axisIdx];
  const center = new THREE.Vector3();
  bbox.getCenter(center);
  const acrossCenter = [center.x, center.y, center.z][acrossIdx];
  const halfWidth = Math.max(acrossSpan * 0.5, 0.035);

  const worldDistAt = (val) => {
    const local = center.clone();
    if (axisIdx === 0) local.x = val;
    else if (axisIdx === 1) local.y = val;
    else local.z = val;
    return local.applyMatrix4(mesh.matrixWorld).distanceToSquared(birdOrigin);
  };

  const tipIsMin = worldDistAt(minVal) > worldDistAt(maxVal);
  const name = (mesh.name || "").toLowerCase();
  const isDedicatedTip = /_end_|tip_end|feathers_tip/.test(name);
  const softStart = isDedicatedTip ? 0.36 : WING_TIP_ZONE_START;

  return {
    axisIdx,
    acrossIdx,
    acrossCenter,
    halfWidth,
    rootVal: tipIsMin ? maxVal : minVal,
    tipVal: tipIsMin ? minVal : maxVal,
    softStart,
  };
}

function applyFeatherSurfaceShader(
  material,
  mesh,
  birdOrigin,
  swatch,
  lightweight,
  isWing,
  meshSeed = 0,
  options = {},
) {
  const axis = isWing ? computeFeatherTipAxis(mesh, birdOrigin) : null;
  const heroWingLook = Boolean(options.heroWingLook);

  const uniforms = {
    uBaseColor: { value: new THREE.Color(swatch.color) },
    uShadowColor: { value: new THREE.Color(swatch.shadow) },
    uHighlightColor: { value: new THREE.Color(swatch.highlight) },
    uTipColor: { value: new THREE.Color(swatch.tip) },
    uRootColor: { value: new THREE.Color(swatch.root ?? swatch.shadow) },
    uStripeColor: { value: new THREE.Color(swatch.stripe ?? swatch.color) },
    uVaneColor: { value: new THREE.Color(swatch.vane ?? swatch.highlight) },
    uAltColor: { value: new THREE.Color(swatch.alt ?? swatch.color) },
    uCoolColor: { value: new THREE.Color(swatch.cool ?? swatch.tip) },
    uBirdOrigin: { value: birdOrigin.clone() },
    uPaintStrength: { value: heroWingLook ? 1.0 : FEATHER_PAINT_STRENGTH },
    uTipBlendStrength: { value: axis ? (heroWingLook ? 0.92 : WING_TIP_BLEND_STRENGTH) : 0.0 },
    uWingRoot: { value: axis?.rootVal ?? 0 },
    uWingTip: { value: axis?.tipVal ?? 1 },
    uWingAxis: { value: axis?.axisIdx ?? 0 },
    uAcrossAxis: { value: axis?.acrossIdx ?? 1 },
    uAcrossCenter: { value: axis?.acrossCenter ?? 0 },
    uLeafHalfWidth: { value: axis?.halfWidth ?? 0.1 },
    uTipSoftStart: { value: heroWingLook ? 0.12 : (axis?.softStart ?? 0.42) },
    uMeshSeed: { value: meshSeed },
    uHeroWingLook: { value: heroWingLook ? 1.0 : 0.0 },
  };

  material.userData.featherUniforms = uniforms;
  material.customProgramCacheKey = () =>
    `feather-leaf-green-crystal-v60b-${isWing ? 1 : 0}-${heroWingLook ? 1 : 0}-${axis?.axisIdx ?? "b"}-${axis?.acrossIdx ?? "a"}`;

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uWingRoot;
uniform float uWingTip;
uniform float uWingAxis;
uniform float uTipSoftStart;
varying vec3 vFeatherWorldPos;
varying vec3 vFeatherNormal;
varying vec3 vObjectPos;
varying float vWingTipBlend;
varying float vWingAxisT;`,
      )
      .replace(
        "#include <beginnormal_vertex>",
        `#include <beginnormal_vertex>
vFeatherNormal = normalize(normalMatrix * objectNormal);`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
vObjectPos = transformed;
float wingPos = uWingAxis < 0.5 ? transformed.x : (uWingAxis < 1.5 ? transformed.y : transformed.z);
float wingSpan = uWingTip - uWingRoot;
float wingT = wingSpan == 0.0 ? 0.0 : clamp((wingPos - uWingRoot) / wingSpan, 0.0, 1.0);
vWingAxisT = wingT;
vWingTipBlend = smoothstep(uTipSoftStart, 1.0, wingT);`,
      )
      .replace(
        "#include <worldpos_vertex>",
        `#include <worldpos_vertex>
vFeatherWorldPos = worldPosition.xyz;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform vec3 uBaseColor;
uniform vec3 uShadowColor;
uniform vec3 uHighlightColor;
uniform vec3 uTipColor;
uniform vec3 uRootColor;
uniform vec3 uStripeColor;
uniform vec3 uVaneColor;
uniform vec3 uAltColor;
uniform vec3 uCoolColor;
uniform vec3 uBirdOrigin;
uniform float uPaintStrength;
uniform float uTipBlendStrength;
uniform float uMeshSeed;
uniform float uHeroWingLook;
uniform float uWingAxis;
uniform float uAcrossAxis;
uniform float uAcrossCenter;
uniform float uLeafHalfWidth;
varying vec3 vFeatherWorldPos;
varying vec3 vFeatherNormal;
varying vec3 vObjectPos;
varying float vWingTipBlend;
varying float vWingAxisT;

float featherHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float featherNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = featherHash(i);
  float b = featherHash(i + vec2(1.0, 0.0));
  float c = featherHash(i + vec2(0.0, 1.0));
  float d = featherHash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float featherFbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * featherNoise(p);
    p = p * 2.07 + vec2(17.1, 9.3);
    a *= 0.5;
  }
  return v;
}
// Soft ridge with screen-space AA (kills moiré on distant / upper leaves)
float featherVeinRidge(float phase, float width) {
  float d = abs(fract(phase) - 0.5);
  float fw = fwidth(phase);
  float w = max(width, fw * 1.6);
  // Fade out when frequency exceeds what a pixel can resolve
  float fade = 1.0 - smoothstep(0.09, 0.32, fw);
  return (1.0 - smoothstep(0.0, w, d)) * fade;
}
// Soft longitudinal fiber (fills between diagonal veins)
float featherFiber(float across, float along, float density, float wobble) {
  float w = featherFbm(vec2(along * 1.8, across * 0.9)) * wobble;
  float phase = across * density + w;
  float s = 0.5 + 0.5 * sin(phase * 6.2831853);
  float aa = max(0.15, fwidth(phase) * 2.0);
  return smoothstep(aa, 1.0, pow(s, 2.4));
}
// Crystalline Voronoi — chunky gem faces (edge, cellId, shade)
vec3 crystalFacet(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float minD = 8.0;
  float midD = 8.0;
  vec2 minI = vec2(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = vec2(featherHash(i + g), featherHash(i + g + vec2(19.7, 7.3)));
      o = mix(o, step(0.5, o), 0.88);
      vec2 r = g + o - f;
      float dC = max(abs(r.x * 1.4), abs(r.y * 0.78));
      float dM = abs(r.x) * 1.25 + abs(r.y) * 0.85;
      float d = mix(dC, dM, 0.42);
      if (d < minD) { midD = minD; minD = d; minI = i + g; }
      else if (d < midD) { midD = d; }
    }
  }
  float edge = clamp((midD - minD) * 8.5, 0.0, 1.0);
  float cellId = featherHash(minI);
  float shade = mix(0.18, 1.55, step(0.5, cellId) * 0.7 + cellId * 0.3);
  return vec3(edge, cellId, shade);
}
float crystalDiamond(vec2 p) {
  vec2 q = abs(fract(p) - 0.5);
  float d = (q.x + q.y * 1.3) * 2.0;
  float fw = fwidth(d);
  float ridge = 1.0 - smoothstep(0.0, max(0.04, fw * 1.4), abs(d - 0.62));
  float face = smoothstep(1.0, 0.18, d);
  return ridge * 0.8 + face * 0.2;
}
float crystalHex(vec2 p) {
  vec2 q = abs(fract(p) - 0.5);
  float d = max(q.x * 1.25 + q.y * 0.42, q.y * 1.12);
  float fw = fwidth(d);
  return 1.0 - smoothstep(0.0, max(0.035, fw * 1.5), abs(d - 0.38));
}
float crystalTri(vec2 p) {
  vec2 q = fract(p) - 0.5;
  float d = abs(q.x) * 1.5 + abs(q.y + q.x * 0.4) * 0.95;
  float fw = fwidth(d);
  return 1.0 - smoothstep(0.0, max(0.035, fw * 1.5), abs(d - 0.52));
}`
      )
      .replace(
        "#include <tonemapping_fragment>",
        `{
  vec3 n = normalize(vFeatherNormal);
  vec3 lightDir = normalize(vec3(0.15, 1.05, 0.22));
  float ndl = clamp(dot(n, lightDir) * 0.5 + 0.5, 0.0, 1.0);

  float wingT = clamp(vWingAxisT, 0.0, 1.0);
  float tip = clamp(vWingTipBlend, 0.0, 1.0);

  float leafId = featherHash(vec2(uMeshSeed * 19.7, uMeshSeed * 7.3));
  float leafId2 = featherHash(vec2(uMeshSeed * 5.1, uMeshSeed * 13.9));
  float leafId3 = featherHash(vec2(uMeshSeed * 11.2, uMeshSeed * 3.4));

  if (uHeroWingLook > 0.5) {
    // 10/10 crystal: big gem faces + green transitions. Crystal owns the leaf.
    float along = clamp(vWingAxisT, 0.0, 1.0);
    float acrossVal = uAcrossAxis < 0.5 ? vObjectPos.x : (uAcrossAxis < 1.5 ? vObjectPos.y : vObjectPos.z);
    float acrossN = (acrossVal - uAcrossCenter) / max(uLeafHalfWidth, 0.008);
    acrossN += (featherNoise(vec2(along * 2.2, uMeshSeed)) - 0.5) * 0.03;
    acrossN = clamp(acrossN, -1.35, 1.35);
    float away = abs(acrossN);
    float side = sign(acrossN + 1e-5);

    float t = pow(along, mix(0.7, 1.15, leafId));
    t = clamp(t + (leafId2 - 0.5) * 0.04, 0.0, 1.0);

    vec3 cDeep = mix(uRootColor, uShadowColor, 0.55 + leafId * 0.35);
    vec3 cMid = mix(uAltColor, uBaseColor, 0.4 + leafId2 * 0.35);
    vec3 cBody = mix(uBaseColor, uVaneColor, 0.35 + leafId3 * 0.4);
    vec3 cLite = mix(uHighlightColor, uCoolColor, 0.35 + leafId * 0.3);
    vec3 cTip = mix(uTipColor, uCoolColor, 0.22);
    vec3 cVein = mix(cDeep, vec3(0.03, 0.12, 0.05), 0.5);

    vec3 gForest = mix(cDeep, vec3(0.07, 0.20, 0.10), 0.5);
    vec3 gMoss   = mix(cMid,  vec3(0.16, 0.36, 0.13), 0.55);
    vec3 gOlive  = mix(cBody, vec3(0.28, 0.35, 0.11), 0.5);
    vec3 gLeaf   = mix(cBody, vec3(0.18, 0.46, 0.20), 0.45);
    vec3 gSage   = mix(cLite, vec3(0.40, 0.56, 0.36), 0.45);
    vec3 gBottle = mix(cMid,  vec3(0.09, 0.30, 0.20), 0.5);
    vec3 gSap    = mix(cLite, vec3(0.38, 0.64, 0.24), 0.4);
    vec3 gLime   = mix(cTip,  vec3(0.50, 0.70, 0.30), 0.32);

    float gt = smoothstep(0.0, 1.0, t);
    vec3 greenA = mix(gForest, gBottle, smoothstep(0.0, 0.32, gt));
    greenA = mix(greenA, gMoss, smoothstep(0.18, 0.52, gt));
    greenA = mix(greenA, gLeaf, smoothstep(0.38, 0.72, gt));
    greenA = mix(greenA, mix(gSage, gLime, leafId), smoothstep(0.62, 1.0, gt));
    float gx = smoothstep(0.0, 1.0, away);
    vec3 greenTrans = mix(greenA, mix(gOlive, gSage, gx), 0.28);

    vec3 feather = mix(gForest, greenTrans, 0.9);

    float midrib = 1.0 - smoothstep(0.0, 0.06, away);
    float midribCore = 1.0 - smoothstep(0.0, 0.022, away);
    float midribHalo = 1.0 - smoothstep(0.0, 0.12, away);
    float midEdge = abs(away - 0.04);
    float midHighlight = (1.0 - smoothstep(0.0, max(0.016, fwidth(away) * 2.2), midEdge))
                       * smoothstep(0.01, 0.04, away)
                       * (1.0 - smoothstep(0.07, 0.12, away));

    float slant = mix(2.7, 3.8, leafId);
    float veinDensity = mix(8.5, 12.0, leafId2);
    float scatter = (featherNoise(vec2(along * 3.2 + uMeshSeed, side * 2.0)) - 0.5) * 0.28;

    float veinPhase = along * veinDensity - away * (slant + scatter) + uMeshSeed * 3.0 + side * 0.28;
    float veinLane = floor(veinPhase);
    float laneU = fract(veinPhase);
    float diag = featherVeinRidge(veinPhase, mix(0.08, 0.12, leafId3));
    diag *= smoothstep(0.012, 0.06, away) * (1.0 - smoothstep(0.8, 1.25, away));

    float diag2 = featherVeinRidge(along * veinDensity * 1.7 - away * slant * 1.15 + leafId2 * 4.0, 0.06);
    diag2 *= smoothstep(0.02, 0.08, away) * (1.0 - smoothstep(0.84, 1.28, away));

    float laneAA = 1.0 - smoothstep(0.07, 0.24, fwidth(veinPhase));
    float lanePick = mix(0.5, featherHash(vec2(veinLane, uMeshSeed * 2.5 + side)), laneAA);
    float lanePick2 = mix(0.5, featherHash(vec2(veinLane * 1.7, leafId * 7.0)), laneAA);

    vec3 patchCol = mix(gForest, gMoss, lanePick);
    patchCol = mix(patchCol, mix(gOlive, gLeaf, lanePick2), smoothstep(0.15, 0.55, t));
    patchCol = mix(patchCol, mix(gSage, gLime, t), smoothstep(0.5, 1.0, t));
    patchCol = mix(patchCol, greenTrans, 0.22);

    float belly = pow(1.0 - abs(laneU - 0.5) * 2.0, 0.8);
    patchCol = mix(mix(gForest, gBottle, 0.35), patchCol, 0.25 + belly * 0.75);

    float mott = featherFbm(vec2(along * 4.5, acrossN * 3.2 + uMeshSeed));
    patchCol = mix(patchCol, mix(gMoss, gOlive, mott), 0.22 * belly * laneAA);

    float panelMask = (1.0 - diag * 0.85) * (1.0 - midrib * 0.55);
    feather = mix(feather, patchCol, panelMask * 0.7);

    // —— CRYSTAL IS THE SURFACE (big readable gem faces) ——
    vec2 facetUV = vec2(
      along * mix(1.55, 2.45, leafId) + leafId2 * 0.9,
      acrossN * mix(1.35, 2.15, leafId3) + side * 0.35 + uMeshSeed * 0.2
    );
    facetUV.x += away * 0.45 + scatter * 0.25;
    facetUV = mat2(1.08, 0.32, -0.26, 0.94) * facetUV;

    vec3 facet = crystalFacet(facetUV);
    float facetEdge = facet.x;
    float facetId = facet.y;
    float facetShade = facet.z;
    float facetFw = fwidth(facetUV.x) + fwidth(facetUV.y);
    float facetAA = 1.0 - smoothstep(0.18, 0.55, facetFw);
    // Crystal covers almost the whole leaf — not just vein panels
    float facetMask = smoothstep(0.0, 0.04, away) * mix(0.72, 1.0, facetAA);

    // Hard posterized gem faces — different greens, high contrast
    vec3 face0 = mix(gForest, vec3(0.04, 0.12, 0.06), 0.45);
    vec3 face1 = mix(gBottle, gMoss, 0.4);
    vec3 face2 = mix(gOlive, gLeaf, 0.5);
    vec3 face3 = mix(gSage, gLime, 0.45 + t * 0.3);
    vec3 crystalCol = face0;
    crystalCol = mix(crystalCol, face1, step(0.25, facetId));
    crystalCol = mix(crystalCol, face2, step(0.5, facetId));
    crystalCol = mix(crystalCol, face3, step(0.75, facetId));
    crystalCol *= mix(0.42, 1.55, smoothstep(0.05, 0.95, facetShade));
    crystalCol = mix(crystalCol, greenTrans, 0.12);

    feather = mix(feather, crystalCol, facetMask * 0.98);

    // Thick dark gem seams — must read from a distance
    float seam = pow(1.0 - facetEdge, 0.85);
    feather = mix(feather, mix(vec3(0.02, 0.07, 0.03), gForest, 0.25), seam * facetMask * 1.0);

    // Bright cut rims
    float rimCut = pow(smoothstep(0.18, 1.0, facetEdge), 1.35) * (1.0 - seam);
    feather = mix(feather, mix(gSage, cTip, 0.55), rimCut * facetMask * 0.85 * (0.4 + t));

    float facetLit = pow(facetEdge, 0.7) * mix(0.55, 1.45, facetShade);
    feather = mix(feather, mix(gSap, gLime, 0.4), facetLit * facetMask * 0.72 * (0.45 + t));

    // Inner crystal subdivision (smaller gems inside each face)
    vec3 facet2 = crystalFacet(facetUV * 2.35 + vec2(leafId3 * 2.4, 1.6));
    float innerSeam = pow(1.0 - facet2.x, 1.05) * (1.0 - smoothstep(0.16, 0.48, facetFw));
    feather = mix(feather, mix(gForest, cVein, 0.4), innerSeam * facetMask * 0.7);
    feather = mix(feather, mix(gLeaf, gSage, facet2.y), pow(facet2.x, 0.9) * facetMask * 0.45 * t);

    // Diamond + hex + tri cut lines on top of gem faces
    vec2 diaUV = vec2(along * mix(3.2, 5.2, leafId2) - away * 1.6, acrossN * mix(2.6, 4.2, leafId) + side);
    diaUV = mat2(0.9, 0.42, -0.38, 1.08) * diaUV;
    float diamond = crystalDiamond(diaUV);
    float diaAA = 1.0 - smoothstep(0.14, 0.42, fwidth(diaUV.x) + fwidth(diaUV.y));
    feather = mix(feather, mix(gForest, cVein, 0.5), (1.0 - diamond) * facetMask * 0.55 * diaAA);
    feather = mix(feather, mix(gSage, cTip, 0.4), diamond * facetMask * 0.62 * t * diaAA);

    float hex = crystalHex(facetUV * 1.55 + vec2(leafId * 1.8, side * 0.6)) * diaAA;
    feather = mix(feather, mix(cVein, gForest, 0.35), hex * facetMask * 0.62);
    feather = mix(feather, mix(gLeaf, gSap, 0.35), (1.0 - hex) * facetMask * facetLit * 0.28 * t);

    float tri = crystalTri(facetUV * 1.85 + vec2(2.1, leafId3)) * diaAA;
    feather = mix(feather, mix(gOlive, gMoss, 0.45), tri * facetMask * 0.48);
    feather = mix(feather, mix(gSage, gLime, 0.35), (1.0 - tri) * facetMask * 0.22 * t);

    // Fine sparkle grain
    vec3 facet3 = crystalFacet(facetUV * 4.2 + vec2(2.2, leafId2 * 3.5));
    float nano = pow(facet3.x, 1.1) * (1.0 - smoothstep(0.18, 0.5, facetFw * 1.4));
    feather = mix(feather, mix(gSap, cTip, facet3.y), nano * facetMask * 0.38 * t);
    feather = mix(feather, gForest, pow(1.0 - facet3.x, 1.4) * facetMask * 0.28 * diaAA);

    vec2 facetUV2 = mat2(0.72, 0.68, -0.68, 0.72) * facetUV * 1.7;
    vec3 facet4 = crystalFacet(facetUV2 + vec2(leafId, 2.8));
    float crossCut = pow(1.0 - facet4.x, 1.15) * facetAA;
    feather = mix(feather, mix(gBottle, gOlive, facet4.y), crossCut * facetMask * 0.42);
    feather = mix(feather, mix(gSage, gLime, 0.45), pow(facet4.x, 1.05) * facetMask * 0.32 * t);

    // Veins as crystal-cut grooves (don't bury the gems)
    feather = mix(feather, mix(cVein, gForest, 0.35), midribHalo * 0.35);
    feather = mix(feather, gForest, midrib * 0.7);
    feather = mix(feather, mix(cDeep, vec3(0.02, 0.08, 0.04), 0.5), midribCore * 0.8);
    feather = mix(feather, mix(gSap, gSage, 0.4), midHighlight * 0.5 * (0.45 + t));

    feather = mix(feather, mix(gForest, cVein, 0.4), diag * 0.55);
    feather = mix(feather, mix(cVein, gOlive, 0.3), diag2 * 0.32);
    float diagEdge = abs(fract(veinPhase) - 0.5);
    float diagLit = (1.0 - smoothstep(0.0, max(0.035, fwidth(veinPhase) * 1.4), diagEdge)) * diag * 0.5;
    feather = mix(feather, mix(gSap, gLime, 0.4), diagLit * 0.28 * t);

    float edge = smoothstep(0.16, 0.9, away);
    feather = mix(feather, mix(gSage, cTip, 0.4), edge * 0.28 * t);
    feather = mix(feather, gForest, (1.0 - edge) * 0.1 * (1.0 - t));

    float viewN = clamp(dot(n, normalize(cameraPosition - vFeatherWorldPos)), 0.0, 1.0);
    float rim = pow(1.0 - viewN, 1.7);
    feather = mix(feather, gForest, rim * 0.08);
    feather = mix(feather, mix(gSage, cTip, 0.45), rim * 0.22 * t);
    feather = mix(feather, mix(gSap, cTip, 0.5), rim * rimCut * facetMask * 0.4 * t);

    float sheen = smoothstep(0.38, 0.98, ndl) * (0.28 + midrib * 0.2 + diag * 0.12 + facetLit * 0.75);
    feather = mix(feather, mix(gSage, cTip, 0.5), sheen * 0.28 * t);

    feather = mix(feather, cTip, tip * uTipBlendStrength * 0.62);
    feather = mix(feather, mix(cTip, gLime, 0.4), tip * 0.16);
    feather = mix(feather, gSap, ndl * 0.06 * t);
    feather = mix(feather, gForest, (1.0 - ndl) * 0.12 * (1.0 - t));

    float luma = dot(feather, vec3(0.299, 0.587, 0.114));
    feather = mix(vec3(luma), feather, 1.22);

    gl_FragColor.rgb = mix(gl_FragColor.rgb, feather, uPaintStrength);
  } else {
    float relHeight = clamp((vFeatherWorldPos.y - uBirdOrigin.y + 0.1) / 1.7, 0.0, 1.0);
    float featherDepth = smoothstep(0.02, 0.55, wingT);
    vec3 feather = mix(uRootColor, uBaseColor, featherDepth);
    feather = mix(feather, uVaneColor, smoothstep(0.18, 0.82, relHeight) * 0.18);
    feather = mix(feather, uTipColor, tip * uTipBlendStrength);
    feather = mix(feather, uHighlightColor, ndl * 0.055);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, feather, uPaintStrength);
  }
}
#include <tonemapping_fragment>`,
      );
  };

  material.needsUpdate = true;
}

export function setupBirdAnimations(mixer, clips) {
  const wingClip =
    clips.find((clip) => /Float_WingPulse|WingPulse/i.test(clip.name)) ||
    clips.find((clip) => /wing|float/i.test(clip.name)) ||
    null;

  const scrollActions = [];
  let maxDuration = 0;

  clips.forEach((clip) => {
    if (clip === wingClip) return;

    const action = mixer.clipAction(clip);
    action.play();
    action.paused = true;

    const duration = clip.duration || 20;
    scrollActions.push({ action, duration });
    maxDuration = Math.max(maxDuration, duration);
  });

  let wingAction = null;
  if (wingClip) {
    wingAction = mixer.clipAction(wingClip);
    wingAction.setLoop(THREE.LoopRepeat, Infinity);
    wingAction.timeScale = 0.45;
    wingAction.play();
  }

  return {
    scrollActions,
    wingAction,
    birdDuration: maxDuration || clips[0]?.duration || 20,
  };
}

export function applyBirdMaterial(bird, textures, lightweightOrOptions = false) {
  const options =
    typeof lightweightOrOptions === "boolean"
      ? { lightweight: lightweightOrOptions, look: "default" }
      : {
          lightweight: Boolean(lightweightOrOptions?.lightweight),
          look: lightweightOrOptions?.look ?? "default",
        };

  const { lightweight, look } = options;
  const isHeroSplit = look === "hero-split";
  const { featherNormal } = textures;
  const materials = [];
  let meshIndex = 0;

  bird.updateWorldMatrix(true, true);
  const birdOrigin = new THREE.Vector3();
  bird.getWorldPosition(birdOrigin);

  bird.traverse((child) => {
    if (!child.isMesh) return;
    child.frustumCulled = lightweight;

    const isWing = isWingFeatherMesh(child);
    let swatch = WING_PALETTE[meshIndex % WING_PALETTE.length];
    let isBottom = false;

    if (isHeroSplit && isWing) {
      const picked = pickHeroFeatherSwatch(child, birdOrigin, meshIndex);
      swatch = picked.swatch;
      isBottom = picked.isBottom;
    } else if (isHeroSplit && !isWing) {
      swatch = HERO_TOP_PALETTE[meshIndex % HERO_TOP_PALETTE.length];
    }

    meshIndex += 1;

    // Full leaf pattern on ALL wing leaves (top + bottom)
    const useHeroWingLook = isHeroSplit && isWing;

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(swatch.color),
      emissive: new THREE.Color(swatch.emissive),
      // Hard crystal glow
      emissiveIntensity: useHeroWingLook ? (isBottom ? 0.2 : 0.16) : isWing ? 0.0 : 0.004,
      normalMap: useHeroWingLook ? featherNormal : featherNormal,
      normalScale: useHeroWingLook
        ? new THREE.Vector2(1.85, 1.85)
        : new THREE.Vector2(isWing ? 0.35 : 0.32, isWing ? 0.35 : 0.32),
      roughness: useHeroWingLook ? 0.16 : isWing ? 0.97 : 0.92,
      metalness: useHeroWingLook ? 0.03 : 0.0,
      clearcoat: useHeroWingLook ? 1.0 : 0.0,
      clearcoatRoughness: useHeroWingLook ? 0.05 : 1.0,
      reflectivity: useHeroWingLook ? 0.38 : 0.008,
      sheen: useHeroWingLook ? 0.38 : 0.0,
      sheenRoughness: useHeroWingLook ? 0.35 : 1.0,
      sheenColor: new THREE.Color(swatch.cool ?? swatch.tip),
      specularIntensity: useHeroWingLook ? 0.78 : 0.12,
      transmission: useHeroWingLook ? 0.22 : 0.0,
      thickness: useHeroWingLook ? 0.4 : 0,
      ior: useHeroWingLook ? 1.42 : 1.5,
      transparent: useHeroWingLook,
      opacity: useHeroWingLook ? 0.98 : 1,
      flatShading: false,
      envMapIntensity: useHeroWingLook ? 1.15 : isWing ? 0.02 : 0.015,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    material.userData.baseHue = swatch.hue;
    material.userData.swatch = swatch;
    material.userData.look = look;
    material.userData.isBottomFeather = isBottom;
    material.userData.isHeroWingLook = useHeroWingLook;

    child.material = material;
    materials.push(material);

    applyFeatherSurfaceShader(
      material,
      child,
      birdOrigin,
      swatch,
      lightweight,
      isWing,
      meshIndex * 2.718 + (isBottom ? 17.3 : 0.0) + (child.id || 0) * 0.137,
      { heroWingLook: useHeroWingLook },
    );
  });

  return materials;
}

export function applyHeroBirdMaterialLook(materials, bloom = 0) {
  const t = THREE.MathUtils.clamp(bloom, 0, 1);

  materials.forEach((mat, index) => {
    const swatch = mat.userData.swatch ?? WING_PALETTE[index % WING_PALETTE.length];
    const featherUniforms = mat.userData.featherUniforms;
    const isHeroWingLook = Boolean(mat.userData.isHeroWingLook);

    mat.color.set(swatch.color);
    mat.emissive.set(swatch.emissive);
    mat.emissiveIntensity = isHeroWingLook
      ? THREE.MathUtils.lerp(0.05, 0.1, t)
      : THREE.MathUtils.lerp(0.004, 0.008, t);
    mat.roughness = isHeroWingLook
      ? THREE.MathUtils.lerp(0.48, 0.4, t)
      : THREE.MathUtils.lerp(0.97, 0.94, t);
    mat.metalness = isHeroWingLook ? 0.02 : 0.0;

    if ("clearcoat" in mat) {
      mat.clearcoat = isHeroWingLook ? THREE.MathUtils.lerp(0.5, 0.65, t) : 0.0;
      mat.clearcoatRoughness = isHeroWingLook ? THREE.MathUtils.lerp(0.3, 0.22, t) : 1.0;
      mat.reflectivity = isHeroWingLook ? 0.35 : 0.008;
      mat.specularIntensity = isHeroWingLook ? 0.4 : 0.12;
      mat.envMapIntensity = isHeroWingLook
        ? THREE.MathUtils.lerp(0.75, 0.95, t)
        : THREE.MathUtils.lerp(0.01, 0.025, t);

      if ("sheen" in mat) {
        mat.sheen = isHeroWingLook ? 0.35 : 0.0;
        mat.sheenRoughness = isHeroWingLook ? 0.4 : 1.0;
        if (mat.sheenColor) mat.sheenColor.set(swatch.cool ?? swatch.tip);
      }
    }
    if (isHeroWingLook && "transmission" in mat) {
      mat.transmission = THREE.MathUtils.lerp(0.03, 0.06, t);
      mat.opacity = THREE.MathUtils.lerp(0.98, 0.96, t);
    }

    if (featherUniforms) {
      if (featherUniforms.uBaseColor) featherUniforms.uBaseColor.value.set(swatch.color);
      if (featherUniforms.uShadowColor) featherUniforms.uShadowColor.value.set(swatch.shadow);
      if (featherUniforms.uHighlightColor) featherUniforms.uHighlightColor.value.set(swatch.highlight);
      if (featherUniforms.uTipColor) featherUniforms.uTipColor.value.set(swatch.tip);
      if (featherUniforms.uRootColor) featherUniforms.uRootColor.value.set(swatch.root ?? swatch.shadow);
      if (featherUniforms.uStripeColor) featherUniforms.uStripeColor.value.set(swatch.stripe ?? swatch.color);
      if (featherUniforms.uVaneColor) featherUniforms.uVaneColor.value.set(swatch.vane ?? swatch.highlight);
      if (featherUniforms.uAltColor) featherUniforms.uAltColor.value.set(swatch.alt ?? swatch.color);
      if (featherUniforms.uCoolColor) featherUniforms.uCoolColor.value.set(swatch.cool ?? swatch.tip);

      featherUniforms.uPaintStrength.value = isHeroWingLook ? 1.0 : 0.94;
      featherUniforms.uTipBlendStrength.value = isHeroWingLook
        ? THREE.MathUtils.lerp(0.88, 0.98, t)
        : THREE.MathUtils.lerp(0.1, 0.14, t);
    }
  });
}

export default function EagleScrollScene({
  backgroundOnly = false,
  pinTargetRef = null,
  onScrollProgress = null,
}) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const onScrollProgressRef = useRef(onScrollProgress);

  onScrollProgressRef.current = onScrollProgress;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const embeddedScroll = backgroundOnly && Boolean(pinTargetRef);
    const scrollEnabled = !backgroundOnly || embeddedScroll;

    if (embeddedScroll) {
      canvas.style.pointerEvents = "none";
    }

    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    let frameId = 0;
    let gsapCtx = null;
    let scrollTween = null;
    let birdObject = null;
    let birdMixer = null;
    let wingAction = null;
    let birdMaterials = [];
    let scrollActions = [];
    let scrollProgress = 0;
    let baseBird = { ...REST_BIRD };
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, hover: false };
    const clock = new THREE.Clock();
    let disposed = false;
    let scrollReady = false;
    let isInView = true;
    let isPageVisible = typeof document !== "undefined" ? !document.hidden : true;
    let lastRenderTime = 0;
    const targetFrameMs = backgroundOnly ? 1000 / 30 : 0;

    const texturesToDispose = [];
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(25, 1, 0.1, 500);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, backgroundOnly ? 1.75 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = backgroundOnly ? 0.95 : 0.96;

    scene.add(new THREE.AmbientLight(0xb8d9be, backgroundOnly ? 1.0 : 1.7));

    const keyLight = new THREE.DirectionalLight(0xf0f8ef, backgroundOnly ? 2.0 : 3.2);
    keyLight.position.set(2.2, 6, 4.5);
    scene.add(keyLight);

    let fillLight = null;
    let rimLight = null;
    let jadeLight = null;

    if (!backgroundOnly) {
      const greenLight = new THREE.PointLight(0x48c96e, 5.5, 60);
      greenLight.position.set(4, 2, 4);
      scene.add(greenLight);

      const softShadowLight = new THREE.PointLight(0x244032, 2.4, 80);
      softShadowLight.position.set(-4, 1, 5);
      scene.add(softShadowLight);
    } else {
      fillLight = new THREE.HemisphereLight(0xb8f0bf, 0x16301d, 1.05);
      scene.add(fillLight);

      jadeLight = new THREE.PointLight(0x5bd56e, 2.1, 52);
      jadeLight.position.set(4.2, 2.2, 4.2);
      scene.add(jadeLight);

      rimLight = new THREE.PointLight(0xe8ffe8, 1.0, 50);
      rimLight.position.set(5.4, 2.8, 3.6);
      scene.add(rimLight);

      const topSoft = new THREE.DirectionalLight(0xd7ffd8, 0.7);
      topSoft.position.set(0.2, 9, 2);
      scene.add(topSoft);
    }

    let bottomLight = null;
    let topShadeLight = null;
    let limeAccent = null;

    if (backgroundOnly) {
      bottomLight = new THREE.DirectionalLight(0x9ce39e, 0.55);
      bottomLight.position.set(0.4, -7, 2.5);
      scene.add(bottomLight);

      topShadeLight = new THREE.DirectionalLight(0x102317, 0.22);
      topShadeLight.position.set(-0.5, 8, 1.5);
      scene.add(topShadeLight);

      limeAccent = new THREE.PointLight(0x72e57b, 1.05, 44);
      limeAccent.position.set(0.2, 3.2, 2.2);
      scene.add(limeAccent);
    }

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const textureLoader = new THREE.TextureLoader();
    const featherNormal = textureLoader.load(FEATHER_NORMAL);
    texturesToDispose.push(featherNormal);
    featherNormal.wrapS = THREE.RepeatWrapping;
    featherNormal.wrapT = THREE.RepeatWrapping;
    featherNormal.repeat.set(22.0, 22.0);
    featherNormal.anisotropy = backgroundOnly ? 16 : 4;

    const birdTextures = { featherNormal };

    new RGBELoader().load(HDR_ENV, (hdr) => {
      if (disposed) {
        hdr.dispose();
        return;
      }
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = hdr;
      texturesToDispose.push(hdr);
    });

    function getLayoutTarget() {
      if (embeddedScroll && pinTargetRef?.current) {
        return pinTargetRef.current;
      }
      return section;
    }

    function resize() {
      const width = embeddedScroll
        ? Math.max(window.innerWidth, 1)
        : Math.max(getLayoutTarget().clientWidth, 1);
      const height = embeddedScroll
        ? Math.max(window.innerHeight, 1)
        : Math.max(getLayoutTarget().clientHeight, 1);

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (scrollEnabled) {
        refreshDark7V60ScrollTriggers();
      }
    });

    resizeObserver.observe(getLayoutTarget());
    resize();

    const onWindowResize = () => resize();
    window.addEventListener("resize", onWindowResize);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
      },
      { threshold: 0.01 },
    );
    intersectionObserver.observe(getLayoutTarget());

    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onMouseEnter = () => {
      mouse.hover = true;
    };

    const onMouseLeave = () => {
      mouse.hover = false;
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    const onMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    if (!backgroundOnly) {
      canvas.style.pointerEvents = "auto";
      canvas.addEventListener("mouseenter", onMouseEnter);
      canvas.addEventListener("mouseleave", onMouseLeave);
      canvas.addEventListener("mousemove", onMouseMove);
    }

    function updateFeatherUniforms() {
      if (!birdObject) return;
      const origin = new THREE.Vector3();
      birdObject.getWorldPosition(origin);

      birdMaterials.forEach((mat) => {
        const uniforms = mat.userData.featherUniforms;
        if (uniforms?.uBirdOrigin) {
          uniforms.uBirdOrigin.value.copy(origin);
        }
      });
    }

    function applyBirdTransform() {
      if (!birdObject) return;

      const hoverAmount = mouse.hover ? 1 : 0;

      birdObject.position.set(
        baseBird.x + mouse.x * 0.58 * hoverAmount,
        baseBird.y + mouse.y * 0.1 * hoverAmount,
        baseBird.z + mouse.x * 0.04 * hoverAmount,
      );

      birdObject.scale.setScalar(baseBird.scale);
      birdObject.rotation.z = baseBird.rotZ + mouse.x * 0.04 * hoverAmount;
      birdObject.rotation.y = (baseBird.rotY ?? 0) + mouse.x * 0.16 * hoverAmount;
      birdObject.rotation.x = (baseBird.rotX ?? 0) - mouse.y * 0.1 * hoverAmount;

      updateFeatherUniforms();
    }

    function applyScrollMaterialEffects(t) {
      const bloom = Math.pow(THREE.MathUtils.clamp(t, 0, 1), 0.82);

      renderer.toneMappingExposure = THREE.MathUtils.lerp(
        backgroundOnly ? 0.95 : 0.94,
        backgroundOnly ? 1.0 : 1.08,
        bloom,
      );

      keyLight.intensity = THREE.MathUtils.lerp(
        backgroundOnly ? 1.9 : 1.9,
        backgroundOnly ? 2.2 : 3.0,
        bloom,
      );

      if (fillLight) fillLight.intensity = THREE.MathUtils.lerp(1.0, 1.1, bloom);
      if (jadeLight) jadeLight.intensity = THREE.MathUtils.lerp(2.0, 2.6, bloom);
      if (bottomLight) bottomLight.intensity = THREE.MathUtils.lerp(0.5, 0.7, bloom);
      if (topShadeLight) topShadeLight.intensity = THREE.MathUtils.lerp(0.22, 0.18, bloom);
      if (limeAccent) limeAccent.intensity = THREE.MathUtils.lerp(0.95, 1.25, bloom);
      if (rimLight) rimLight.intensity = THREE.MathUtils.lerp(0.95, 1.2, bloom);

      birdMaterials.forEach((mat, index) => {
        const swatch = mat.userData.swatch ?? WING_PALETTE[index % WING_PALETTE.length];
        const featherUniforms = mat.userData.featherUniforms;
        const isHeroWingLook = Boolean(mat.userData.isHeroWingLook);

        mat.color.set(swatch.color);
        mat.emissive.set(swatch.emissive);
        mat.emissiveIntensity = isHeroWingLook ? 0.0 : THREE.MathUtils.lerp(0.004, 0.008, bloom);
        mat.roughness = isHeroWingLook
          ? THREE.MathUtils.lerp(1.0, 0.98, bloom)
          : THREE.MathUtils.lerp(0.97, 0.94, bloom);
        mat.metalness = 0.0;

        if ("clearcoat" in mat) {
          mat.clearcoat = 0.0;
          mat.clearcoatRoughness = 1.0;
          mat.reflectivity = isHeroWingLook ? 0.0 : 0.008;
          mat.specularIntensity = isHeroWingLook ? 0.04 : 0.12;
          mat.envMapIntensity = isHeroWingLook ? 0.0 : THREE.MathUtils.lerp(0.01, 0.025, bloom);

          if ("sheen" in mat) {
            mat.sheen = 0.0;
            mat.sheenRoughness = 1.0;
          }
        }

        if (featherUniforms) {
          if (featherUniforms.uBaseColor) featherUniforms.uBaseColor.value.set(swatch.color);
          if (featherUniforms.uShadowColor) featherUniforms.uShadowColor.value.set(swatch.shadow);
          if (featherUniforms.uHighlightColor) featherUniforms.uHighlightColor.value.set(swatch.highlight);
          if (featherUniforms.uTipColor) featherUniforms.uTipColor.value.set(swatch.tip);
          if (featherUniforms.uRootColor) featherUniforms.uRootColor.value.set(swatch.root ?? swatch.shadow);
          if (featherUniforms.uStripeColor) featherUniforms.uStripeColor.value.set(swatch.stripe ?? swatch.color);
          if (featherUniforms.uVaneColor) featherUniforms.uVaneColor.value.set(swatch.vane ?? swatch.highlight);
          if (featherUniforms.uAltColor) featherUniforms.uAltColor.value.set(swatch.alt ?? swatch.color);
          if (featherUniforms.uCoolColor) featherUniforms.uCoolColor.value.set(swatch.cool ?? swatch.tip);

          featherUniforms.uPaintStrength.value = isHeroWingLook ? 0.996 : 0.94;
          featherUniforms.uTipBlendStrength.value = isHeroWingLook
            ? THREE.MathUtils.lerp(0.22, 0.28, bloom)
            : THREE.MathUtils.lerp(0.1, 0.14, bloom);
        }
      });

      if (wingAction) {
        wingAction.timeScale = THREE.MathUtils.lerp(0.45, 1.05, bloom);
      }

      if (embeddedScroll && canvas) {
        const saturate = THREE.MathUtils.lerp(1.36, 1.48, bloom);
        const brightness = THREE.MathUtils.lerp(1.04, 1.1, bloom);
        const contrast = THREE.MathUtils.lerp(1.06, 1.12, bloom);
        canvas.style.filter = `saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`;
      }
    }

    function applyScrollProgress(p) {
      scrollProgress = THREE.MathUtils.clamp(p, 0, 1);

      camera.position.x = THREE.MathUtils.lerp(-0.3, -0.15, scrollProgress);
      camera.position.y = THREE.MathUtils.lerp(0.5, 0.35, scrollProgress);
      camera.position.z = THREE.MathUtils.lerp(-1.25, -1.8, scrollProgress);
      camera.lookAt(0.2, 0.15, 0);

      baseBird = {
        x: THREE.MathUtils.lerp(REST_BIRD.x, SCROLL_END_BIRD.x, scrollProgress),
        y: THREE.MathUtils.lerp(REST_BIRD.y, SCROLL_END_BIRD.y, scrollProgress),
        z: THREE.MathUtils.lerp(REST_BIRD.z, SCROLL_END_BIRD.z, scrollProgress),
        scale: THREE.MathUtils.lerp(REST_BIRD.scale, SCROLL_END_BIRD.scale, scrollProgress),
        rotZ: THREE.MathUtils.lerp(REST_BIRD.rotZ, SCROLL_END_BIRD.rotZ, scrollProgress),
        rotY: THREE.MathUtils.lerp(REST_BIRD.rotY, SCROLL_END_BIRD.rotY, scrollProgress),
        rotX: THREE.MathUtils.lerp(REST_BIRD.rotX, SCROLL_END_BIRD.rotX, scrollProgress),
      };

      applyBirdTransform();
      applyScrollMaterialEffects(scrollProgress);
      onScrollProgressRef.current?.(scrollProgress);

      if (embeddedScroll && canvas) {
        const visible = scrollProgress < 0.98;
        canvas.style.visibility = visible ? "visible" : "hidden";
        canvas.style.display = visible ? "block" : "none";
        canvas.style.pointerEvents = "none";
      }
    }

    function createScrollAnimation(triggerEl) {
      if (disposed || scrollReady || !triggerEl) return;
      scrollReady = true;

      // Initial camera for embedded hero (dark7-v60).
      // ZOOM: camera Z — higher = zoom out (see more wing), lower = zoom in
      //        also tweak REST_BIRD.scale above for size
      camera.position.set(-0.35, 0.85, 1.15); // ← X, Y, Z (Z = zoom)
      camera.lookAt(0.15, 0.15, 0);

      ScrollTrigger.getById(DARK7_V60_HERO_PIN_ID)?.kill();

      gsapCtx?.revert();
      gsapCtx = gsap.context(() => {
        const state = { progress: 0 };

        scrollTween = gsap.to(state, {
          progress: 1,
          ease: "none",
          scrollTrigger: Dark7V60ScrollTrigger({
            id: embeddedScroll ? DARK7_V60_HERO_PIN_ID : "eagle-scroll-scene",
            trigger: triggerEl,
            start: "top top",
            end: embeddedScroll ? "+=500" : "+=8000",
            scrub: embeddedScroll ? 0.8 : 2.5,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            refreshPriority: 3,
          }),
          onUpdate: () => {
            applyScrollProgress(state.progress);
          },
        });

        applyScrollProgress(0);
        onScrollProgressRef.current?.(0);
      }, triggerEl);

      requestAnimationFrame(() => {
        refreshDark7V60ScrollTriggers();
        const progress =
          getDark7V60ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
        applyScrollProgress(progress);
        onScrollProgressRef.current?.(progress <= 0.001 ? 0 : progress);
      });

      window.setTimeout(() => {
        refreshDark7V60ScrollTriggers(true);
        const progress =
          getDARK7_V60ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
        applyScrollProgress(progress);
        onScrollProgressRef.current?.(progress <= 0.001 ? 0 : progress);
        if (embeddedScroll) {
          notifyHeroPinReady();
        }
      }, 400);
    }

    gltfLoader.load(
      BIRD_MESH,
      (gltf) => {
        if (disposed) return;

        birdObject = gltf.scene;
        scene.add(birdObject);
        birdObject.updateWorldMatrix(true, true);

        birdMaterials = applyBirdMaterial(birdObject, birdTextures, {
          lightweight: backgroundOnly,
          look: backgroundOnly ? "hero-split" : "default",
        });

        if (gltf.animations.length) {
          birdMixer = new THREE.AnimationMixer(birdObject);
          const animationSetup = setupBirdAnimations(birdMixer, gltf.animations);
          scrollActions = animationSetup.scrollActions;
          wingAction = animationSetup.wingAction;
        }

        if (backgroundOnly) {
          const pinEl = pinTargetRef?.current;
          if (pinEl) {
            createScrollAnimation(pinEl);
          } else {
            camera.position.set(-0.35, 0.85, 1.15);
            camera.lookAt(0.15, 0.15, 0);
            applyScrollProgress(0);
          }
        } else {
          createScrollAnimation(section);
        }
      },
      undefined,
      (error) => console.error("[EagleScrollScene] v20.glb failed:", error),
    );

    const animate = (time) => {
      frameId = requestAnimationFrame(animate);

      if (!isPageVisible) return;

      const isPinned = Boolean(scrollTween?.scrollTrigger?.isActive);
      if (!isInView && !isPinned) return;

      if (backgroundOnly && time - lastRenderTime < targetFrameMs) return;
      lastRenderTime = time;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (!backgroundOnly) {
        mouse.x += (mouse.targetX - mouse.x) * 0.055;
        mouse.y += (mouse.targetY - mouse.y) * 0.055;
      }

      if (birdMixer) {
        scrollActions.forEach(({ action, duration }) => {
          action.time = scrollProgress * duration;
        });

        birdMixer.update(delta);
      }

      applyBirdTransform();

      if (birdObject) {
        birdObject.position.y += Math.sin(elapsed * 1.05) * 0.012;
      }

      renderer.render(scene, camera);
    };

    animate(0);

    if (!backgroundOnly) {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

    return () => {
      disposed = true;
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      cancelAnimationFrame(frameId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      intersectionObserver.disconnect();

      if (!backgroundOnly) {
        canvas.removeEventListener("mouseenter", onMouseEnter);
        canvas.removeEventListener("mouseleave", onMouseLeave);
        canvas.removeEventListener("mousemove", onMouseMove);
      }

      resizeObserver.disconnect();
      window.removeEventListener("resize", onWindowResize);
      gsapCtx?.revert();
      texturesToDispose.forEach((texture) => texture.dispose?.());
      dracoLoader.dispose();
      renderer.dispose();
    };
  }, [backgroundOnly, pinTargetRef]);

  if (backgroundOnly) {
    return (
      <section
        ref={sectionRef}
        className="eagle-scroll-scene eagle-scroll-scene--embed"
        style={{ background: "transparent" }}
      >
        <canvas
          ref={canvasRef}
          className="eagle-scroll-canvas eagle-scroll-canvas--embed"
        />
      </section>
    );
  }

  return (
    <>
      <section ref={sectionRef} className="eagle-scroll-scene">
        <canvas ref={canvasRef} className="eagle-scroll-canvas" />
      </section>
      <section className="eagle-scroll-next" aria-hidden="true" />
    </>
  );
}