"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Dark7V49ScrollTrigger,
  getDark7V49ScrollTop,
  refreshDark7V49ScrollTriggers,
  notifyHeroPinReady,
  DARK7_V49_HERO_PIN_ID,
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
  // -- ZOOM / FRAMING (hero wing) -------------------------------------
  // scale: larger = wing fills more of the screen (zoom in)
  // camera Z is set near createScrollAnimation ? camera.position.set(..., z)
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
 * v47 Noomo-style glass wing — NEW approach
 * Top/upper leaves: deep forest / emerald
 * Bottom/outer tips: pale sage / mint / lime glow
 * Reference: https://storytelling.noomoagency.com/
 */
const HERO_TOP_PALETTE = [
  {
    hue: 0.34,
    color: "#0A2418",
    shadow: "#04120C",
    highlight: "#5CB878",
    emissive: "#0C3020",
    tip: "#A8E0B8",
    root: "#020A06",
    stripe: "#143828",
    vane: "#2A7850",
    alt: "#0E2C1C",
    cool: "#48A878",
  },
  {
    hue: 0.32,
    color: "#0C2814",
    shadow: "#06140A",
    highlight: "#68C070",
    emissive: "#0E3418",
    tip: "#B0E8A8",
    root: "#040C06",
    stripe: "#183C1C",
    vane: "#348048",
    alt: "#123018",
    cool: "#52B068",
  },
  {
    hue: 0.34,
    color: "#0A2818",
    shadow: "#04140C",
    highlight: "#50C080",
    emissive: "#0C3420",
    tip: "#A0E8B8",
    root: "#020C06",
    stripe: "#143C24",
    vane: "#288050",
    alt: "#0E301C",
    cool: "#40B070",
  },
  {
    hue: 0.30,
    color: "#122414",
    shadow: "#081208",
    highlight: "#78C060",
    emissive: "#163018",
    tip: "#C0E8A0",
    root: "#060A04",
    stripe: "#1C3820",
    vane: "#3C8040",
    alt: "#162C18",
    cool: "#60B050",
  },
  {
    hue: 0.36,
    color: "#0C2620",
    shadow: "#061410",
    highlight: "#58C088",
    emissive: "#103228",
    tip: "#A8E8C0",
    root: "#040C08",
    stripe: "#163A2C",
    vane: "#2C8060",
    alt: "#102E24",
    cool: "#48B080",
  },
  {
    hue: 0.33,
    color: "#0E2618",
    shadow: "#06140C",
    highlight: "#60BC78",
    emissive: "#123220",
    tip: "#B0E4B0",
    root: "#040C06",
    stripe: "#183A24",
    vane: "#307C50",
    alt: "#122E1C",
    cool: "#50B070",
  },
];

/** Lower / tip leaves — still mostly mid-forest; only tips go mint */
const HERO_BOTTOM_PALETTE = [
  {
    hue: 0.34,
    color: "#1A4830",
    shadow: "#081C14",
    highlight: "#78C898",
    emissive: "#143828",
    tip: "#C8F0D8",
    root: "#06140C",
    stripe: "#2A6048",
    vane: "#3A8060",
    alt: "#143828",
    cool: "#68B888",
  },
  {
    hue: 0.32,
    color: "#1E4828",
    shadow: "#0A1C10",
    highlight: "#80C880",
    emissive: "#183820",
    tip: "#D0F0C0",
    root: "#081408",
    stripe: "#2E6038",
    vane: "#428048",
    alt: "#183820",
    cool: "#70B870",
  },
  {
    hue: 0.33,
    color: "#1A4828",
    shadow: "#081C10",
    highlight: "#78C888",
    emissive: "#143820",
    tip: "#C8F0C8",
    root: "#061408",
    stripe: "#2A6038",
    vane: "#3A8050",
    alt: "#143820",
    cool: "#68B878",
  },
  {
    hue: 0.30,
    color: "#224820",
    shadow: "#0C1C0C",
    highlight: "#88C870",
    emissive: "#1A3818",
    tip: "#D8F0B0",
    root: "#0A1408",
    stripe: "#326030",
    vane: "#488040",
    alt: "#1A3818",
    cool: "#78B860",
  },
  {
    hue: 0.35,
    color: "#1C4834",
    shadow: "#0A1C16",
    highlight: "#78C8A0",
    emissive: "#163828",
    tip: "#C8F0D0",
    root: "#081410",
    stripe: "#2C6050",
    vane: "#3E8070",
    alt: "#163828",
    cool: "#6CB890",
  },
  {
    hue: 0.34,
    color: "#1E4830",
    shadow: "#0A1C14",
    highlight: "#80C898",
    emissive: "#183828",
    tip: "#D0F0D0",
    root: "#08140C",
    stripe: "#2E6048",
    vane: "#428060",
    alt: "#183828",
    cool: "#70B888",
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

  // Only truly lower leaves get the lighter palette (elongation alone was bleaching the whole wing)
  const isBottom = relY < -0.12 || (relY < 0.02 && elongation > 5.5);
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
    `feather-leaf-glass-mosaic-v47d-${isWing ? 1 : 0}-${heroWingLook ? 1 : 0}-${axis?.axisIdx ?? "b"}-${axis?.acrossIdx ?? "a"}`;

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
// ——— v47d: dark glass mosaic + hard crystalline facets ———
vec4 glassCell(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float minD = 8.0;
  float midD = 8.0;
  vec2 minI = vec2(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = vec2(featherHash(i + g), featherHash(i + g + vec2(31.7, 17.3)));
      o = mix(o, vec2(0.5), 0.12);
      vec2 r = g + o - f;
      float d = length(r * vec2(0.65, 1.35));
      if (d < minD) { midD = minD; minD = d; minI = i + g; }
      else if (d < midD) { midD = d; }
    }
  }
  float edge = clamp((midD - minD) * 6.2, 0.0, 1.0);
  float id = featherHash(minI);
  float shade = mix(0.35, 1.35, id);
  return vec4(edge, id, shade, minD);
}
// Diamond / shard facet field (crystalline patches)
float glassFacet(vec2 p) {
  vec2 q = p * vec2(1.0, 1.55);
  vec2 iq = floor(q);
  vec2 fq = fract(q) - 0.5;
  float id = featherHash(iq);
  float ang = id * 6.2831853;
  float ca = cos(ang); float sa = sin(ang);
  vec2 r = vec2(ca * fq.x - sa * fq.y, sa * fq.x + ca * fq.y);
  float d = max(abs(r.x) * 1.15 + abs(r.y) * 0.55, abs(r.y) * 1.25);
  float face = 1.0 - smoothstep(0.18, 0.48, d);
  float ridge = 1.0 - smoothstep(0.0, 0.07, abs(d - 0.32));
  float aa = 1.0 - smoothstep(0.08, 0.28, fwidth(q.x) + fwidth(q.y));
  return (face * mix(0.55, 1.2, id) + ridge * 1.4) * aa;
}
float glassBarb(float across, float along, float density) {
  float w = featherFbm(vec2(along * 2.8, across * 1.4)) * 0.55;
  float phase = across * density + along * 1.15 + w;
  float s = 0.5 + 0.5 * sin(phase * 6.2831853);
  float aa = max(0.1, fwidth(phase) * 2.0);
  return smoothstep(aa, 1.0, pow(s, 2.6));
}
float glassSparkle(vec2 p) {
  float n = featherFbm(p);
  float n2 = featherNoise(p * 3.4 + 11.0);
  float n3 = featherNoise(p * 7.1 + 3.7);
  return pow(smoothstep(0.55, 0.92, n) * smoothstep(0.5, 0.88, n2) * smoothstep(0.45, 0.85, n3), 1.15);
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
    // v47d — DARK mass + crystalline glass patches (Noomo structure, green)
    float along = clamp(vWingAxisT, 0.0, 1.0);
    float acrossVal = uAcrossAxis < 0.5 ? vObjectPos.x : (uAcrossAxis < 1.5 ? vObjectPos.y : vObjectPos.z);
    float acrossN = (acrossVal - uAcrossCenter) / max(uLeafHalfWidth, 0.008);
    acrossN += (featherNoise(vec2(along * 2.0, uMeshSeed)) - 0.5) * 0.03;
    acrossN = clamp(acrossN, -1.4, 1.4);
    float away = abs(acrossN);
    float side = sign(acrossN + 1e-5);

    float t = pow(along, mix(0.9, 1.35, leafId));
    t = clamp(t + (leafId2 - 0.5) * 0.03, 0.0, 1.0);

    // Strong top-dark bias (most of wing stays dark forest)
    float relY = clamp((vFeatherWorldPos.y - uBirdOrigin.y + 0.55) / 2.1, 0.0, 1.0);
    float heightDark = pow(1.0 - relY, 0.72);

    vec3 cDeep = mix(uRootColor, uShadowColor, 0.7 + leafId * 0.25);
    vec3 cMid = mix(uAltColor, uBaseColor, 0.25 + leafId2 * 0.35);
    vec3 cBody = mix(uBaseColor, uVaneColor, 0.25 + leafId3 * 0.35);
    vec3 cLite = mix(uHighlightColor, uCoolColor, 0.25 + leafId * 0.25);
    vec3 cTip = mix(uTipColor, uCoolColor, 0.15);

    // Dark-forward green family (ink forest ? emerald ? mint only at tips)
    vec3 gInk    = mix(cDeep, vec3(0.01, 0.06, 0.03), 0.55);
    vec3 gDeep   = mix(cDeep, vec3(0.03, 0.12, 0.07), 0.5);
    vec3 gForest = mix(cMid,  vec3(0.06, 0.22, 0.12), 0.45);
    vec3 gEmerald= mix(cBody, vec3(0.1, 0.38, 0.22), 0.4);
    vec3 gSage   = mix(cLite, vec3(0.28, 0.55, 0.38), 0.35);
    vec3 gMint   = mix(cTip,  vec3(0.48, 0.82, 0.62), 0.35);
    vec3 gGlow   = mix(cTip,  vec3(0.7, 0.95, 0.82), 0.4);

    // Wash stays LOW — light only near tip / lower fringe
    float wash = clamp(t * 0.22 + tip * 0.55 + (1.0 - heightDark) * 0.28, 0.0, 1.0);
    wash = pow(wash, 1.35);

    vec3 feather = mix(gInk, gDeep, smoothstep(0.0, 0.25, wash));
    feather = mix(feather, gForest, smoothstep(0.15, 0.5, wash));
    feather = mix(feather, gEmerald, smoothstep(0.45, 0.78, wash) * 0.85);
    feather = mix(feather, gSage, smoothstep(0.7, 0.95, wash) * tip);
    feather = mix(feather, mix(gMint, gGlow, tip), smoothstep(0.85, 1.0, wash) * tip);
    // Lock upper mass dark
    feather = mix(feather, gInk, heightDark * 0.55 * (1.0 - tip * 0.7));
    feather = mix(feather, gDeep, heightDark * 0.35 * (1.0 - wash));

    // --- Dense mosaic patches (visible color islands) ---
    vec2 mosaicUV = vec2(
      along * mix(4.0, 6.2, leafId) + leafId2 * 1.4,
      acrossN * mix(3.2, 5.0, leafId3) + side * 0.55 + uMeshSeed * 0.35
    );
    mosaicUV.x += away * 0.45;
    mosaicUV = mat2(1.08, 0.22, -0.16, 1.02) * mosaicUV;

    vec4 cell = glassCell(mosaicUV);
    float cellEdge = cell.x;
    float cellId = cell.y;
    float cellShade = cell.z;
    float cellFw = fwidth(mosaicUV.x) + fwidth(mosaicUV.y);
    float cellAA = 1.0 - smoothstep(0.1, 0.38, cellFw);

    vec3 patchA = mix(gInk, gDeep, 0.35);
    vec3 patchB = mix(gDeep, gForest, 0.55);
    vec3 patchC = mix(gForest, gEmerald, 0.6);
    vec3 patchD = mix(gEmerald, mix(gSage, gMint, tip), 0.45 + wash * 0.35);
    vec3 patchCol = mix(patchA, patchB, smoothstep(0.0, 0.35, cellId));
    patchCol = mix(patchCol, patchC, smoothstep(0.25, 0.65, cellId));
    patchCol = mix(patchCol, patchD, smoothstep(0.55, 1.0, cellId) * (0.25 + wash * 0.75));
    patchCol *= mix(0.55, 1.25, cellShade);
    patchCol = mix(patchCol, gInk, heightDark * 0.45 * (1.0 - cellId * 0.5));
    patchCol = mix(patchCol, gMint, (1.0 - heightDark) * 0.12 * cellId * tip);

    float mosaicMask = cellAA * smoothstep(0.0, 0.06, away + 0.04);
    feather = mix(feather, patchCol, mosaicMask * 0.92);

    // Harder glass seams + bright refractive cuts
    float seam = pow(1.0 - cellEdge, 1.35);
    feather = mix(feather, gInk, seam * mosaicMask * 0.55 * (0.55 + heightDark));
    float rimCut = pow(smoothstep(0.28, 0.98, cellEdge), 1.6) * (1.0 - seam);
    feather = mix(feather, mix(gEmerald, gMint, 0.35 + wash * 0.4), rimCut * mosaicMask * 0.7);

    // Mid + fine crystalline facet layers
    float facet1 = glassFacet(mosaicUV * 1.8 + vec2(leafId * 2.0, 0.7));
    float facet2 = glassFacet(mosaicUV * 3.6 + vec2(1.3, leafId2 * 3.0));
    float facet3 = glassFacet(mosaicUV * 6.4 + vec2(leafId3 * 4.0, along * 2.0));
    float facetMask = mosaicMask * (1.0 - smoothstep(0.12, 0.4, cellFw));
    feather = mix(feather, mix(gDeep, gEmerald, 0.55), facet1 * facetMask * 0.55);
    feather = mix(feather, mix(gInk, gForest, 0.4), (1.0 - facet1) * facetMask * 0.22);
    feather = mix(feather, mix(gEmerald, gSage, 0.5), facet2 * facetMask * 0.48 * (0.35 + wash));
    feather = mix(feather, mix(gMint, gGlow, 0.4), facet3 * facetMask * 0.38 * (0.25 + tip + wash * 0.5));

    vec4 cell2 = glassCell(mosaicUV * 2.8 + vec2(leafId3 * 2.2, 1.7));
    feather = mix(feather, mix(gEmerald, gSage, cell2.y), pow(cell2.x, 1.2) * facetMask * 0.32);
    feather = mix(feather, gInk, pow(1.0 - cell2.x, 2.0) * facetMask * 0.28 * heightDark);

    float spark = glassSparkle(mosaicUV * 4.5 + vec2(uMeshSeed, along * 3.0));
    float spark2 = glassSparkle(mosaicUV * 8.0 + vec2(2.1, leafId));
    feather = mix(feather, mix(gMint, gGlow, 0.55), spark * facetMask * 0.55);
    feather = mix(feather, gGlow, spark2 * facetMask * 0.28 * (0.3 + tip));

    // Dark / light blotch islands
    float blotch = featherFbm(vec2(along * 4.0, acrossN * 3.0 + uMeshSeed));
    float blotch2 = featherFbm(vec2(along * 7.0 + leafId, acrossN * 5.5));
    feather = mix(feather, gInk, blotch * 0.32 * heightDark * (1.0 - tip));
    feather = mix(feather, mix(gForest, gEmerald, blotch2), 0.22 * cellAA * (0.4 + wash));
    feather = mix(feather, mix(gSage, gMint, blotch2), 0.12 * wash * tip * cellAA);

    // Structure + barbs across more of the leaf
    float spine = 1.0 - smoothstep(0.0, 0.12, away);
    feather = mix(feather, gInk, spine * 0.35 * (1.0 - tip) * (0.5 + heightDark));

    float edgeZone = smoothstep(0.22, 0.92, away);
    float barb = glassBarb(acrossN, along, mix(26.0, 40.0, leafId));
    float barb2 = glassBarb(acrossN * 1.35, along * 1.25 + leafId2, mix(34.0, 52.0, leafId3));
    float barb3 = glassBarb(acrossN * 0.85, along * 0.9 + leafId3, mix(18.0, 28.0, leafId2));
    feather = mix(feather, mix(gForest, gSage, 0.4), barb * edgeZone * 0.42);
    feather = mix(feather, mix(gSage, gMint, 0.45), barb2 * edgeZone * 0.32 * (0.35 + wash));
    feather = mix(feather, gDeep, barb3 * (1.0 - edgeZone) * 0.18 * heightDark);
    feather = mix(feather, gInk, (1.0 - barb) * edgeZone * 0.14 * heightDark);

    float leafEdge = smoothstep(0.5, 1.05, away);
    feather = mix(feather, mix(gSage, gMint, 0.45), leafEdge * 0.28 * (0.25 + wash + tip * 0.5));
    feather = mix(feather, gInk, (1.0 - leafEdge) * 0.1 * heightDark);

    // Fresnel: darken flats, crystal rim on grazing angles (not full mint wash)
    float viewN = clamp(dot(n, normalize(cameraPosition - vFeatherWorldPos)), 0.0, 1.0);
    float fresnel = pow(1.0 - viewN, 1.55);
    feather = mix(feather, gInk, fresnel * 0.18 * heightDark);
    feather = mix(feather, mix(gEmerald, gMint, 0.35), fresnel * 0.28 * (0.2 + wash * 0.5 + tip * 0.4));
    feather = mix(feather, gGlow, fresnel * fresnel * 0.18 * tip);

    float sheen = smoothstep(0.45, 0.98, ndl);
    feather = mix(feather, mix(gEmerald, gSage, 0.4), sheen * 0.16 * (0.3 + wash));
    feather = mix(feather, gInk, (1.0 - ndl) * 0.22 * heightDark);

    // Tip mint only in the tip zone — don't bleach the whole leaf
    feather = mix(feather, mix(gSage, gMint, 0.55), tip * uTipBlendStrength * 0.42);
    feather = mix(feather, gGlow, tip * tip * 0.12);

    float luma = dot(feather, vec3(0.299, 0.587, 0.114));
    feather = mix(vec3(luma), feather, 1.22);
    // Pull midtones darker so forest reads
    feather *= mix(0.72, 1.0, 0.35 + wash * 0.4 + tip * 0.35);

    gl_FragColor.rgb = mix(gl_FragColor.rgb, feather, uPaintStrength);

    float tipFade = tip * 0.14;
    gl_FragColor.a *= mix(1.0, 0.88, tipFade);
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
      // Dark glass — enough transmission for crystal, not enough to bleach forest
      emissiveIntensity: useHeroWingLook ? (isBottom ? 0.16 : 0.1) : isWing ? 0.0 : 0.004,
      normalMap: useHeroWingLook ? featherNormal : featherNormal,
      normalScale: useHeroWingLook
        ? new THREE.Vector2(1.15, 1.15)
        : new THREE.Vector2(isWing ? 0.35 : 0.32, isWing ? 0.35 : 0.32),
      roughness: useHeroWingLook ? 0.28 : isWing ? 0.97 : 0.92,
      metalness: useHeroWingLook ? 0.0 : 0.0,
      clearcoat: useHeroWingLook ? 1.0 : 0.0,
      clearcoatRoughness: useHeroWingLook ? 0.14 : 1.0,
      reflectivity: useHeroWingLook ? 0.55 : 0.008,
      sheen: useHeroWingLook ? 0.55 : 0.0,
      sheenRoughness: useHeroWingLook ? 0.35 : 1.0,
      sheenColor: new THREE.Color(swatch.cool ?? swatch.tip),
      specularIntensity: useHeroWingLook ? 0.85 : 0.12,
      transmission: useHeroWingLook ? 0.14 : 0.0,
      thickness: useHeroWingLook ? 0.7 : 0,
      ior: useHeroWingLook ? 1.45 : 1.5,
      transparent: useHeroWingLook,
      opacity: useHeroWingLook ? 0.97 : 1,
      flatShading: false,
      envMapIntensity: useHeroWingLook ? 0.95 : isWing ? 0.02 : 0.015,
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
      ? THREE.MathUtils.lerp(0.08, 0.14, t)
      : THREE.MathUtils.lerp(0.004, 0.008, t);
    mat.roughness = isHeroWingLook
      ? THREE.MathUtils.lerp(0.32, 0.26, t)
      : THREE.MathUtils.lerp(0.97, 0.94, t);
    mat.metalness = isHeroWingLook ? 0.02 : 0.0;

    if ("clearcoat" in mat) {
      mat.clearcoat = isHeroWingLook ? THREE.MathUtils.lerp(0.95, 1.0, t) : 0.0;
      mat.clearcoatRoughness = isHeroWingLook ? THREE.MathUtils.lerp(0.18, 0.14, t) : 1.0;
      mat.reflectivity = isHeroWingLook ? 0.55 : 0.008;
      mat.specularIntensity = isHeroWingLook ? 0.85 : 0.12;
      mat.envMapIntensity = isHeroWingLook
        ? THREE.MathUtils.lerp(0.85, 0.95, t)
        : THREE.MathUtils.lerp(0.01, 0.025, t);

      if ("sheen" in mat) {
        mat.sheen = isHeroWingLook ? THREE.MathUtils.lerp(0.45, 0.55, t) : 0.0;
        mat.sheenRoughness = isHeroWingLook ? THREE.MathUtils.lerp(0.4, 0.35, t) : 1.0;
        if (mat.sheenColor) mat.sheenColor.set(swatch.cool ?? swatch.tip);
      }
    }
    if (isHeroWingLook && "transmission" in mat) {
      mat.transmission = THREE.MathUtils.lerp(0.1, 0.14, t);
      mat.opacity = THREE.MathUtils.lerp(0.96, 0.97, t);
      mat.thickness = THREE.MathUtils.lerp(0.55, 0.7, t);
      mat.ior = 1.45;
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
        refreshDark7V49ScrollTriggers();
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

      // Initial camera for embedded hero (dark7-v49).
      // ZOOM: camera Z — higher = zoom out (see more wing), lower = zoom in
      //        also tweak REST_BIRD.scale above for size
      camera.position.set(-0.35, 0.85, 1.15); // ? X, Y, Z (Z = zoom)
      camera.lookAt(0.15, 0.15, 0);

      ScrollTrigger.getById(DARK7_V49_HERO_PIN_ID)?.kill();

      gsapCtx?.revert();
      gsapCtx = gsap.context(() => {
        const state = { progress: 0 };

        scrollTween = gsap.to(state, {
          progress: 1,
          ease: "none",
          scrollTrigger: Dark7V49ScrollTrigger({
            id: embeddedScroll ? DARK7_V49_HERO_PIN_ID : "eagle-scroll-scene",
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
        refreshDark7V49ScrollTriggers();
        const progress =
          getDark7V49ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
        applyScrollProgress(progress);
        onScrollProgressRef.current?.(progress <= 0.001 ? 0 : progress);
      });

      window.setTimeout(() => {
        refreshDark7V49ScrollTriggers(true);
        const progress =
          getDARK7_V49ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
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