"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Dark7V46ScrollTrigger,
  getDark7V46ScrollTop,
  refreshDark7V46ScrollTriggers,
  notifyHeroPinReady,
  DARK7_V46_HERO_PIN_ID,
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
 * Hero leaf families — ink-black greens + max crystal punch accents
 */
const HERO_TOP_PALETTE = [
  {
    hue: 0.34,
    color: "#041008",
    shadow: "#010302",
    highlight: "#3A9A48",
    emissive: "#030C06",
    tip: "#68B870",
    root: "#000201",
    stripe: "#081810",
    vane: "#144828",
    alt: "#06140C",
    cool: "#227840",
  },
  {
    hue: 0.28,
    color: "#0A1006",
    shadow: "#030402",
    highlight: "#58A830",
    emissive: "#080C04",
    tip: "#88C048",
    root: "#010201",
    stripe: "#101808",
    vane: "#225828",
    alt: "#0C1408",
    cool: "#3A8830",
  },
  {
    hue: 0.38,
    color: "#041210",
    shadow: "#010504",
    highlight: "#28A878",
    emissive: "#030C0A",
    tip: "#58C098",
    root: "#000201",
    stripe: "#081A16",
    vane: "#145848",
    alt: "#061612",
    cool: "#228870",
  },
  {
    hue: 0.32,
    color: "#06100A",
    shadow: "#020402",
    highlight: "#48A050",
    emissive: "#040C08",
    tip: "#78B878",
    root: "#010201",
    stripe: "#0C1810",
    vane: "#1A5038",
    alt: "#08140E",
    cool: "#2E8048",
  },
  {
    hue: 0.26,
    color: "#0E1006",
    shadow: "#040402",
    highlight: "#70A828",
    emissive: "#0A0C04",
    tip: "#A0C040",
    root: "#020201",
    stripe: "#141808",
    vane: "#2E5020",
    alt: "#10140A",
    cool: "#4A8828",
  },
  {
    hue: 0.36,
    color: "#03100C",
    shadow: "#010403",
    highlight: "#30A068",
    emissive: "#020C08",
    tip: "#60B888",
    root: "#000201",
    stripe: "#061812",
    vane: "#125040",
    alt: "#04140E",
    cool: "#228068",
  },
];

/** Outer tips — dark with harder accent pop */
const HERO_BOTTOM_PALETTE = [
  {
    hue: 0.34,
    color: "#123820",
    shadow: "#041008",
    highlight: "#58A858",
    emissive: "#0A2818",
    tip: "#88C888",
    root: "#020604",
    stripe: "#1E4830",
    vane: "#2E6848",
    alt: "#0E3020",
    cool: "#489850",
  },
  {
    hue: 0.28,
    color: "#1E3814",
    shadow: "#081004",
    highlight: "#78B838",
    emissive: "#142810",
    tip: "#A8D060",
    root: "#040602",
    stripe: "#2A4820",
    vane: "#3A6840",
    alt: "#183018",
    cool: "#5AA838",
  },
  {
    hue: 0.38,
    color: "#103830",
    shadow: "#04100C",
    highlight: "#48B890",
    emissive: "#0A2824",
    tip: "#80D0B0",
    root: "#020604",
    stripe: "#1C4840",
    vane: "#2C6860",
    alt: "#0C302C",
    cool: "#38A888",
  },
  {
    hue: 0.32,
    color: "#143824",
    shadow: "#05100A",
    highlight: "#68AC60",
    emissive: "#0C2818",
    tip: "#98CC90",
    root: "#020604",
    stripe: "#204838",
    vane: "#326858",
    alt: "#10301E",
    cool: "#509C58",
  },
  {
    hue: 0.26,
    color: "#243814",
    shadow: "#0C1006",
    highlight: "#88B830",
    emissive: "#182810",
    tip: "#B8D058",
    root: "#060602",
    stripe: "#304820",
    vane: "#426838",
    alt: "#1C3018",
    cool: "#68A838",
  },
  {
    hue: 0.36,
    color: "#12382C",
    shadow: "#04100C",
    highlight: "#58B880",
    emissive: "#0A2820",
    tip: "#88D0A8",
    root: "#020604",
    stripe: "#1E4840",
    vane: "#2E6860",
    alt: "#0E3028",
    cool: "#48A878",
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
    `feather-leaf-green-crystal-v46a-${isWing ? 1 : 0}-${heroWingLook ? 1 : 0}-${axis?.axisIdx ?? "b"}-${axis?.acrossIdx ?? "a"}`;

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
// Crystalline Voronoi — absolute max gem cut (edge, cellId, shade)
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
      o = mix(o, step(0.5, o), 0.99);
      vec2 r = g + o - f;
      float dC = max(abs(r.x * 1.75), abs(r.y * 0.62));
      float dM = abs(r.x) * 1.5 + abs(r.y) * 0.65;
      float d = mix(dC, dM, 0.6);
      if (d < minD) { midD = minD; minD = d; minI = i + g; }
      else if (d < midD) { midD = d; }
    }
  }
  float edge = clamp((midD - minD) * 14.0, 0.0, 1.0);
  float cellId = featherHash(minI);
  float shade = mix(0.05, 2.0, step(0.2, cellId) * 0.25 + step(0.4, cellId) * 0.25 + step(0.6, cellId) * 0.25 + step(0.8, cellId) * 0.2 + cellId * 0.05);
  return vec3(edge, cellId, shade);
}
float crystalDiamond(vec2 p) {
  vec2 q = abs(fract(p) - 0.5);
  float d = (q.x + q.y * 1.45) * 2.0;
  float fw = fwidth(d);
  float ridge = 1.0 - smoothstep(0.0, max(0.02, fw), abs(d - 0.52));
  float face = smoothstep(1.0, 0.08, d);
  return ridge * 0.9 + face * 0.1;
}
float crystalHex(vec2 p) {
  vec2 q = abs(fract(p) - 0.5);
  float d = max(q.x * 1.4 + q.y * 0.5, q.y * 1.22);
  float fw = fwidth(d);
  return 1.0 - smoothstep(0.0, max(0.018, fw), abs(d - 0.32));
}
float crystalTri(vec2 p) {
  vec2 q = fract(p) - 0.5;
  float d = abs(q.x) * 1.65 + abs(q.y + q.x * 0.48) * 0.95;
  float fw = fwidth(d);
  return 1.0 - smoothstep(0.0, max(0.018, fw), abs(d - 0.46));
}
float crystalSlash(vec2 p) {
  float s1 = abs(fract(p.x * 1.45 + p.y * 0.95) - 0.5);
  float s2 = abs(fract(p.x * 0.8 - p.y * 1.5) - 0.5);
  float s3 = abs(fract(p.x * 2.1 + p.y * 0.4) - 0.5);
  float s4 = abs(fract(p.x * 0.45 + p.y * 2.0) - 0.5);
  float fw = fwidth(s1) + fwidth(s2);
  float r1 = 1.0 - smoothstep(0.0, max(0.02, fw), s1);
  float r2 = 1.0 - smoothstep(0.0, max(0.02, fw), s2);
  float r3 = 1.0 - smoothstep(0.0, max(0.02, fw), s3);
  float r4 = 1.0 - smoothstep(0.0, max(0.02, fw), s4);
  return max(max(r1, r2 * 0.92), max(r3 * 0.75, r4 * 0.65));
}
float crystalChip(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p) - 0.5;
  float h = featherHash(i);
  float ang = h * 6.2831853;
  float ca = cos(ang);
  float sa = sin(ang);
  vec2 r = vec2(f.x * ca - f.y * sa, f.x * sa + f.y * ca);
  float d = max(abs(r.x) * 1.5, abs(r.y) * 1.15);
  float fw = fwidth(d);
  float edge = 1.0 - smoothstep(0.0, max(0.025, fw * 1.2), abs(d - 0.4));
  float face = smoothstep(0.52, 0.12, d);
  return edge * 0.75 + face * 0.25 * h;
}
float crystalGrid(vec2 p) {
  vec2 g = abs(fract(p) - 0.5);
  float fw = fwidth(p.x) + fwidth(p.y);
  float vx = 1.0 - smoothstep(0.0, max(0.02, fw), g.x);
  float vy = 1.0 - smoothstep(0.0, max(0.02, fw), g.y);
  return max(vx, vy);
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
    // v46: MORE — ink void greens + overload crystal detail
    float along = clamp(vWingAxisT, 0.0, 1.0);
    float acrossVal = uAcrossAxis < 0.5 ? vObjectPos.x : (uAcrossAxis < 1.5 ? vObjectPos.y : vObjectPos.z);
    float acrossN = (acrossVal - uAcrossCenter) / max(uLeafHalfWidth, 0.008);
    acrossN += (featherNoise(vec2(along * 1.6, uMeshSeed)) - 0.5) * 0.018;
    acrossN = clamp(acrossN, -1.35, 1.35);
    float away = abs(acrossN);
    float side = sign(acrossN + 1e-5);

    float t = pow(along, mix(0.62, 1.08, leafId));
    t = clamp(t + (leafId2 - 0.5) * 0.03, 0.0, 1.0);

    vec3 cDeep = mix(uRootColor, uShadowColor, 0.82 + leafId * 0.15);
    vec3 cMid = mix(uAltColor, uBaseColor, 0.28 + leafId2 * 0.4);
    vec3 cBody = mix(uBaseColor, uVaneColor, 0.25 + leafId3 * 0.45);
    vec3 cLite = mix(uHighlightColor, uCoolColor, 0.25 + leafId * 0.35);
    vec3 cTip = mix(uTipColor, uCoolColor, 0.12);
    vec3 cVein = mix(cDeep, vec3(0.005, 0.02, 0.008), 0.85);

    vec3 gVoid    = mix(cDeep, vec3(0.004, 0.012, 0.006), 0.92);
    vec3 gInk     = mix(cDeep, vec3(0.008, 0.025, 0.01), 0.9);
    vec3 gPine    = mix(cDeep, vec3(0.015, 0.05, 0.02), 0.85);
    vec3 gForest  = mix(cDeep, vec3(0.025, 0.09, 0.04), 0.7);
    vec3 gBottle  = mix(cMid,  vec3(0.03, 0.14, 0.09), 0.7);
    vec3 gMoss    = mix(cMid,  vec3(0.07, 0.22, 0.05), 0.7);
    vec3 gOlive   = mix(cBody, vec3(0.14, 0.2, 0.04), 0.65);
    vec3 gEmerald = mix(cBody, vec3(0.04, 0.28, 0.15), 0.65);
    vec3 gLeaf    = mix(cBody, vec3(0.08, 0.32, 0.1), 0.6);
    vec3 gJade    = mix(cLite, vec3(0.1, 0.38, 0.24), 0.6);
    vec3 gSage    = mix(cLite, vec3(0.26, 0.44, 0.24), 0.55);
    vec3 gChart   = mix(cTip,  vec3(0.38, 0.58, 0.1), 0.5);
    vec3 gSap     = mix(cLite, vec3(0.24, 0.5, 0.14), 0.55);
    vec3 gLime    = mix(cTip,  vec3(0.38, 0.58, 0.16), 0.45);

    float gt = smoothstep(0.0, 1.0, t);
    vec3 greenA = mix(gVoid, gInk, smoothstep(0.0, 0.14, gt));
    greenA = mix(greenA, gPine, smoothstep(0.08, 0.28, gt));
    greenA = mix(greenA, gForest, smoothstep(0.18, 0.4, gt));
    greenA = mix(greenA, gBottle, smoothstep(0.3, 0.5, gt));
    greenA = mix(greenA, mix(gMoss, gOlive, leafId), smoothstep(0.4, 0.62, gt));
    greenA = mix(greenA, mix(gEmerald, gLeaf, leafId2), smoothstep(0.52, 0.75, gt));
    greenA = mix(greenA, mix(gJade, gSage, leafId3), smoothstep(0.65, 0.9, gt));
    greenA = mix(greenA, mix(gChart, gLime, leafId), smoothstep(0.82, 1.0, gt));
    float gx = smoothstep(0.0, 1.0, away);
    vec3 greenTrans = mix(greenA, mix(gOlive, gEmerald, gx), 0.25);

    vec3 feather = mix(gVoid, greenTrans, 0.85);

    float midrib = 1.0 - smoothstep(0.0, 0.045, away);
    float midribCore = 1.0 - smoothstep(0.0, 0.015, away);
    float midribHalo = 1.0 - smoothstep(0.0, 0.09, away);
    float midEdge = abs(away - 0.032);
    float midHighlight = (1.0 - smoothstep(0.0, max(0.01, fwidth(away) * 1.6), midEdge))
                       * smoothstep(0.005, 0.028, away)
                       * (1.0 - smoothstep(0.05, 0.09, away));

    float slant = mix(2.4, 4.1, leafId);
    float veinDensity = mix(10.0, 15.5, leafId2);
    float scatter = (featherNoise(vec2(along * 2.6 + uMeshSeed, side * 2.0)) - 0.5) * 0.26;

    float veinPhase = along * veinDensity - away * (slant + scatter) + uMeshSeed * 3.0 + side * 0.34;
    float veinLane = floor(veinPhase);
    float laneU = fract(veinPhase);
    float diag = featherVeinRidge(veinPhase, mix(0.065, 0.1, leafId3));
    diag *= smoothstep(0.006, 0.045, away) * (1.0 - smoothstep(0.74, 1.18, away));

    float diag2 = featherVeinRidge(along * veinDensity * 1.85 - away * slant * 1.25 + leafId2 * 4.0, 0.048);
    diag2 *= smoothstep(0.012, 0.065, away) * (1.0 - smoothstep(0.78, 1.22, away));

    float diag3 = featherVeinRidge(along * veinDensity * 2.8 - away * slant * 1.35 + leafId3 * 5.5, 0.038);
    diag3 *= smoothstep(0.018, 0.08, away) * (1.0 - smoothstep(0.82, 1.26, away));

    float diag4 = featherVeinRidge(along * veinDensity * 3.7 - away * slant * 1.42 + uMeshSeed * 4.0, 0.032);
    diag4 *= smoothstep(0.025, 0.095, away) * (1.0 - smoothstep(0.86, 1.3, away));

    float diag5 = featherVeinRidge(along * veinDensity * 4.6 - away * slant * 1.5 + leafId * 6.0, 0.028);
    diag5 *= smoothstep(0.035, 0.11, away) * (1.0 - smoothstep(0.9, 1.34, away));

    float laneAA = 1.0 - smoothstep(0.07, 0.24, fwidth(veinPhase));
    float lanePick = mix(0.5, featherHash(vec2(veinLane, uMeshSeed * 2.5 + side)), laneAA);
    float lanePick2 = mix(0.5, featherHash(vec2(veinLane * 1.7, leafId * 7.0)), laneAA);
    float lanePick3 = mix(0.5, featherHash(vec2(veinLane * 0.5 + side, leafId3 * 4.0)), laneAA);
    float lanePick4 = mix(0.5, featherHash(vec2(veinLane * 2.1, leafId2 * 5.0)), laneAA);

    vec3 patchCol = mix(gVoid, gInk, lanePick);
    patchCol = mix(patchCol, mix(gPine, gForest, lanePick2), smoothstep(0.05, 0.3, t));
    patchCol = mix(patchCol, mix(gBottle, gMoss, lanePick3), smoothstep(0.2, 0.48, t));
    patchCol = mix(patchCol, mix(gOlive, gEmerald, lanePick4), smoothstep(0.35, 0.65, t));
    patchCol = mix(patchCol, mix(gLeaf, gJade, lanePick), smoothstep(0.5, 0.8, t));
    patchCol = mix(patchCol, mix(gSage, mix(gChart, gLime, t), lanePick2), smoothstep(0.65, 1.0, t));
    patchCol = mix(patchCol, greenTrans, 0.1);

    float belly = pow(1.0 - abs(laneU - 0.5) * 2.0, 0.65);
    patchCol = mix(mix(gVoid, gInk, 0.5), patchCol, 0.08 + belly * 0.92);

    float mott = featherFbm(vec2(along * 6.5, acrossN * 5.0 + uMeshSeed));
    float mott2 = featherFbm(vec2(along * 13.0 + leafId, acrossN * 9.5));
    float mott3 = featherFbm(vec2(along * 22.0 + side, acrossN * 15.0 + leafId3));
    float mott4 = featherFbm(vec2(along * 32.0, acrossN * 20.0 - uMeshSeed));
    float mott5 = featherFbm(vec2(along * 42.0 + leafId2, acrossN * 26.0));
    patchCol = mix(patchCol, mix(gMoss, gEmerald, mott), 0.32 * belly * laneAA);
    patchCol = mix(patchCol, mix(gVoid, gOlive, mott2), 0.28 * (1.0 - belly) * laneAA);
    patchCol = mix(patchCol, mix(gChart, gSap, mott3), 0.2 * t * belly * laneAA);
    patchCol = mix(patchCol, mix(gInk, gForest, mott4), 0.16 * (1.0 - t) * laneAA);
    patchCol = mix(patchCol, mix(gLeaf, gJade, mott5), 0.12 * belly * t * laneAA);

    float subBand = smoothstep(0.08, 0.38, laneU) * (1.0 - smoothstep(0.62, 0.92, laneU));
    patchCol = mix(patchCol, mix(gLeaf, gJade, t), subBand * 0.48 * laneAA);
    patchCol = mix(patchCol, mix(gVoid, gMoss, 0.55), (1.0 - subBand) * 0.35 * (1.0 - t) * laneAA);

    float panelMask = (1.0 - diag * 0.7) * (1.0 - midrib * 0.4);
    feather = mix(feather, patchCol, panelMask * 0.8);

    // —— OVERLOAD CRYSTAL ——
    vec2 facetUV = vec2(
      along * mix(1.05, 1.85, leafId) + leafId2 * 0.65,
      acrossN * mix(0.95, 1.65, leafId3) + side * 0.25 + uMeshSeed * 0.12
    );
    facetUV.x += away * 0.6 + scatter * 0.32;
    facetUV = mat2(1.18, 0.42, -0.36, 0.88) * facetUV;

    vec3 facet = crystalFacet(facetUV);
    float facetEdge = facet.x;
    float facetId = facet.y;
    float facetShade = facet.z;
    float facetFw = fwidth(facetUV.x) + fwidth(facetUV.y);
    float facetAA = 1.0 - smoothstep(0.14, 0.45, facetFw);
    float facetMask = smoothstep(0.0, 0.02, away) * mix(0.88, 1.0, facetAA);

    // 10 posterized void→accent faces
    vec3 face0 = mix(gVoid, vec3(0.002, 0.008, 0.004), 0.7);
    vec3 face1 = mix(gInk, gPine, 0.35);
    vec3 face2 = mix(gPine, gForest, 0.4);
    vec3 face3 = mix(gForest, gBottle, 0.45);
    vec3 face4 = mix(gMoss, gOlive, 0.5);
    vec3 face5 = mix(gEmerald, gLeaf, 0.55);
    vec3 face6 = mix(gJade, gSage, 0.5);
    vec3 face7 = mix(gSap, gChart, 0.45);
    vec3 face8 = mix(gChart, gLime, 0.5);
    vec3 face9 = mix(gLime, cTip, 0.55 + t * 0.3);
    vec3 crystalCol = face0;
    crystalCol = mix(crystalCol, face1, step(0.1, facetId));
    crystalCol = mix(crystalCol, face2, step(0.2, facetId));
    crystalCol = mix(crystalCol, face3, step(0.3, facetId));
    crystalCol = mix(crystalCol, face4, step(0.4, facetId));
    crystalCol = mix(crystalCol, face5, step(0.5, facetId));
    crystalCol = mix(crystalCol, face6, step(0.6, facetId));
    crystalCol = mix(crystalCol, face7, step(0.7, facetId));
    crystalCol = mix(crystalCol, face8, step(0.8, facetId));
    crystalCol = mix(crystalCol, face9, step(0.9, facetId));
    crystalCol *= mix(0.15, 2.1, smoothstep(0.02, 0.98, facetShade));
    crystalCol = mix(crystalCol, greenTrans, 0.04);

    feather = mix(feather, crystalCol, facetMask * 0.999);

    float seam = pow(1.0 - facetEdge, 0.45);
    feather = mix(feather, mix(vec3(0.002, 0.008, 0.004), gVoid, 0.1), seam * facetMask * 1.0);

    float rimCut = pow(smoothstep(0.05, 1.0, facetEdge), 0.95) * (1.0 - seam);
    feather = mix(feather, mix(gSage, cTip, 0.7), rimCut * facetMask * 1.0 * (0.4 + t));

    float facetLit = pow(facetEdge, 0.38) * mix(0.4, 1.9, facetShade);
    feather = mix(feather, mix(gSap, gChart, 0.55), facetLit * facetMask * 1.0 * (0.45 + t));

    // 4 inner gem scales
    vec3 facet2 = crystalFacet(facetUV * 2.9 + vec2(leafId3 * 1.8, 1.3));
    feather = mix(feather, mix(gVoid, cVein, 0.25), pow(1.0 - facet2.x, 0.7) * facetMask * 1.0 * (1.0 - smoothstep(0.1, 0.4, facetFw)));
    feather = mix(feather, mix(gLeaf, gJade, facet2.y), pow(facet2.x, 0.65) * facetMask * 0.7 * t);

    vec3 facet2b = crystalFacet(facetUV * 4.0 + vec2(0.9, leafId * 2.6));
    feather = mix(feather, mix(gInk, gMoss, facet2b.y), pow(facet2b.x, 0.7) * facetMask * 0.55 * t);
    feather = mix(feather, gVoid, pow(1.0 - facet2b.x, 0.95) * facetMask * 0.62 * facetAA);

    vec3 facet2c = crystalFacet(facetUV * 5.2 + vec2(leafId2 * 1.6, 2.3));
    feather = mix(feather, mix(gForest, gEmerald, facet2c.y), pow(facet2c.x, 0.75) * facetMask * 0.45 * t);
    feather = mix(feather, gPine, pow(1.0 - facet2c.x, 1.0) * facetMask * 0.48 * facetAA);

    vec3 facet2d = crystalFacet(facetUV * 6.4 + vec2(2.0, leafId3 * 1.4));
    feather = mix(feather, mix(gOlive, gLeaf, facet2d.y), pow(facet2d.x, 0.8) * facetMask * 0.35 * t);
    feather = mix(feather, gInk, pow(1.0 - facet2d.x, 1.05) * facetMask * 0.38 * facetAA);

    // Cut lattices overload
    vec2 diaUV = vec2(along * mix(4.4, 7.5, leafId2) - away * 2.2, acrossN * mix(3.3, 5.5, leafId) + side);
    diaUV = mat2(0.82, 0.55, -0.48, 1.15) * diaUV;
    float diamond = crystalDiamond(diaUV);
    float diaAA = 1.0 - smoothstep(0.1, 0.36, fwidth(diaUV.x) + fwidth(diaUV.y));
    feather = mix(feather, mix(gVoid, cVein, 0.35), (1.0 - diamond) * facetMask * 0.8 * diaAA);
    feather = mix(feather, mix(gSage, cTip, 0.55), diamond * facetMask * 0.88 * t * diaAA);

    float hex = crystalHex(facetUV * 2.0 + vec2(leafId * 1.4, side * 0.45)) * diaAA;
    feather = mix(feather, mix(cVein, gVoid, 0.2), hex * facetMask * 0.88);
    feather = mix(feather, mix(gEmerald, gSap, 0.5), (1.0 - hex) * facetMask * facetLit * 0.45 * t);

    float tri = crystalTri(facetUV * 2.3 + vec2(1.8, leafId3)) * diaAA;
    feather = mix(feather, mix(gOlive, gMoss, 0.6), tri * facetMask * 0.72);
    feather = mix(feather, mix(gChart, gLime, 0.5), (1.0 - tri) * facetMask * 0.38 * t);

    float slash = crystalSlash(facetUV * 2.85 + vec2(leafId2 * 1.3, side)) * diaAA;
    feather = mix(feather, mix(gVoid, cVein, 0.3), slash * facetMask * 0.65);
    feather = mix(feather, mix(gJade, gSap, 0.45), (1.0 - slash) * facetMask * 0.3 * t);

    float chip = crystalChip(facetUV * 3.5 + vec2(leafId3 * 1.8, leafId)) * diaAA;
    feather = mix(feather, mix(gInk, gForest, 0.4), (1.0 - chip) * facetMask * 0.42);
    feather = mix(feather, mix(gLeaf, gChart, 0.45), chip * facetMask * 0.48 * t);

    float grid = crystalGrid(facetUV * 4.2 + vec2(leafId2, side * 0.7)) * diaAA;
    feather = mix(feather, mix(gVoid, cVein, 0.4), grid * facetMask * 0.4);
    feather = mix(feather, mix(gSage, gSap, 0.35), (1.0 - grid) * facetMask * 0.18 * t);

    // Nano dust cascade
    vec3 facet3 = crystalFacet(facetUV * 5.8 + vec2(2.6, leafId2 * 4.2));
    float nano = pow(facet3.x, 0.75) * (1.0 - smoothstep(0.12, 0.42, facetFw * 1.25));
    feather = mix(feather, mix(gSap, cTip, facet3.y), nano * facetMask * 0.62 * t);
    feather = mix(feather, gVoid, pow(1.0 - facet3.x, 1.05) * facetMask * 0.48 * diaAA);

    vec3 facet3b = crystalFacet(facetUV * 7.8 + vec2(leafId3 * 2.4, 4.5));
    float micro = pow(facet3b.x, 0.85) * (1.0 - smoothstep(0.16, 0.5, facetFw * 1.45));
    feather = mix(feather, mix(gChart, gLime, facet3b.y), micro * facetMask * 0.45 * t);

    vec3 facet3c = crystalFacet(facetUV * 10.0 + vec2(3.5, leafId * 2.2));
    float dust = pow(facet3c.x, 0.95) * (1.0 - smoothstep(0.2, 0.55, facetFw * 1.65));
    feather = mix(feather, mix(gSage, cTip, facet3c.y), dust * facetMask * 0.32 * t);

    vec3 facet3d = crystalFacet(facetUV * 12.5 + vec2(leafId2 * 1.5, 5.0));
    float grit = pow(facet3d.x, 1.0) * (1.0 - smoothstep(0.24, 0.6, facetFw * 1.85));
    feather = mix(feather, mix(gLeaf, gSap, facet3d.y), grit * facetMask * 0.22 * t);

    // 4 rotated shard layers
    vec2 facetUV2 = mat2(0.65, 0.75, -0.75, 0.65) * facetUV * 2.1;
    vec3 facet4 = crystalFacet(facetUV2 + vec2(leafId, 2.2));
    feather = mix(feather, mix(gBottle, gOlive, facet4.y), pow(1.0 - facet4.x, 0.85) * facetMask * 0.65 * facetAA);
    feather = mix(feather, mix(gJade, gChart, 0.6), pow(facet4.x, 0.8) * facetMask * 0.5 * t);

    vec2 facetUV3 = mat2(0.8, -0.58, 0.58, 0.8) * facetUV * 2.5;
    vec3 facet5 = crystalFacet(facetUV3 + vec2(2.9, leafId2));
    feather = mix(feather, mix(gVoid, gEmerald, facet5.y), pow(1.0 - facet5.x, 0.95) * facetMask * 0.52 * facetAA);
    feather = mix(feather, mix(gSage, gLime, 0.5), pow(facet5.x, 0.85) * facetMask * 0.38 * t);

    vec2 facetUV4 = mat2(0.48, 0.88, -0.88, 0.48) * facetUV * 2.9;
    vec3 facet6 = crystalFacet(facetUV4 + vec2(leafId3, 1.5));
    feather = mix(feather, mix(gInk, gMoss, facet6.y), pow(1.0 - facet6.x, 1.0) * facetMask * 0.42 * facetAA);
    feather = mix(feather, mix(gLeaf, gSap, 0.45), pow(facet6.x, 0.9) * facetMask * 0.32 * t);

    vec2 facetUV5 = mat2(0.9, 0.35, -0.35, 0.9) * facetUV * 3.3;
    vec3 facet7 = crystalFacet(facetUV5 + vec2(1.2, leafId * 1.7));
    feather = mix(feather, mix(gPine, gForest, facet7.y), pow(1.0 - facet7.x, 1.05) * facetMask * 0.35 * facetAA);
    feather = mix(feather, mix(gChart, cTip, 0.4), pow(facet7.x, 0.95) * facetMask * 0.28 * t);

    float altLane = step(0.5, fract(veinLane * 0.5));
    float altLane2 = step(0.5, fract(veinLane * 0.25));
    float altLane3 = step(0.5, fract(veinLane * 0.125));
    feather = mix(feather, gVoid, altLane * panelMask * 0.32 * (1.0 - t) * laneAA);
    feather = mix(feather, gOlive, altLane2 * panelMask * 0.2 * t * laneAA);
    feather = mix(feather, gEmerald, altLane3 * panelMask * 0.14 * belly * laneAA);

    feather = mix(feather, mix(cVein, gVoid, 0.2), midribHalo * 0.5);
    feather = mix(feather, gVoid, midrib * 0.9);
    feather = mix(feather, mix(cDeep, vec3(0.003, 0.012, 0.005), 0.8), midribCore * 0.95);
    feather = mix(feather, mix(gSap, gJade, 0.55), midHighlight * 0.72 * (0.45 + t));

    feather = mix(feather, mix(gVoid, cVein, 0.25), diag * 0.75);
    feather = mix(feather, mix(cVein, gOlive, 0.35), diag2 * 0.5);
    feather = mix(feather, mix(gMoss, gEmerald, 0.4), diag3 * 0.36 * (0.4 + t));
    feather = mix(feather, mix(gLeaf, gJade, 0.35), diag4 * 0.24 * t);
    feather = mix(feather, mix(gSap, gChart, 0.3), diag5 * 0.16 * t);
    float diagEdge = abs(fract(veinPhase) - 0.5);
    float diagLit = (1.0 - smoothstep(0.0, max(0.025, fwidth(veinPhase) * 1.1), diagEdge)) * diag * 0.65;
    feather = mix(feather, mix(gSap, gChart, 0.55), diagLit * 0.45 * t);

    float fiberAlong = along * mix(16.0, 26.0, leafId) - away * mix(6.5, 11.0, leafId2);
    float fiber = featherVeinRidge(fiberAlong + scatter * 0.28, 0.08);
    float fiber2 = featherVeinRidge(fiberAlong * 1.9 + leafId3, 0.07);
    float fiber3 = featherVeinRidge(fiberAlong * 2.8 + leafId2, 0.06);
    float fiberMask = panelMask * smoothstep(0.01, 0.055, away) * (1.0 - facetMask * 0.45);
    feather = mix(feather, mix(gLeaf, gJade, 0.5), fiber * 0.2 * t * fiberMask);
    feather = mix(feather, mix(gSap, gChart, 0.4), fiber2 * 0.14 * t * fiberMask);
    feather = mix(feather, mix(gSage, cTip, 0.35), fiber3 * 0.1 * t * fiberMask);

    float edge = smoothstep(0.1, 0.9, away);
    feather = mix(feather, mix(gSage, cTip, 0.55), edge * 0.4 * t);
    feather = mix(feather, gVoid, (1.0 - edge) * 0.22 * (1.0 - t));

    float viewN = clamp(dot(n, normalize(cameraPosition - vFeatherWorldPos)), 0.0, 1.0);
    float rim = pow(1.0 - viewN, 1.25);
    feather = mix(feather, gVoid, rim * 0.14);
    feather = mix(feather, mix(gSage, cTip, 0.6), rim * 0.38 * t);
    feather = mix(feather, mix(gSap, cTip, 0.65), rim * rimCut * facetMask * 0.65 * t);

    float sheen = smoothstep(0.22, 0.98, ndl) * (0.4 + midrib * 0.12 + diag * 0.08 + facetLit * 1.05);
    feather = mix(feather, mix(gJade, cTip, 0.65), sheen * 0.48 * t);

    feather = mix(feather, cTip, tip * uTipBlendStrength * 0.48);
    feather = mix(feather, mix(cTip, gChart, 0.55), tip * 0.26);
    feather = mix(feather, gSap, ndl * 0.09 * t);
    feather = mix(feather, gVoid, (1.0 - ndl) * 0.24 * (1.0 - t));

    float luma = dot(feather, vec3(0.299, 0.587, 0.114));
    feather = mix(vec3(luma), feather, 1.45);

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
      emissiveIntensity: useHeroWingLook ? (isBottom ? 0.18 : 0.12) : isWing ? 0.0 : 0.004,
      normalMap: useHeroWingLook ? featherNormal : featherNormal,
      normalScale: useHeroWingLook
        ? new THREE.Vector2(2.7, 2.7)
        : new THREE.Vector2(isWing ? 0.35 : 0.32, isWing ? 0.35 : 0.32),
      roughness: useHeroWingLook ? 0.08 : isWing ? 0.97 : 0.92,
      metalness: useHeroWingLook ? 0.03 : 0.0,
      clearcoat: useHeroWingLook ? 1.0 : 0.0,
      clearcoatRoughness: useHeroWingLook ? 0.02 : 1.0,
      reflectivity: useHeroWingLook ? 0.7 : 0.008,
      sheen: useHeroWingLook ? 0.7 : 0.0,
      sheenRoughness: useHeroWingLook ? 0.35 : 1.0,
      sheenColor: new THREE.Color(swatch.cool ?? swatch.tip),
      specularIntensity: useHeroWingLook ? 1.1 : 0.12,
      transmission: useHeroWingLook ? 0.18 : 0.0,
      thickness: useHeroWingLook ? 0.4 : 0,
      ior: useHeroWingLook ? 1.42 : 1.5,
      transparent: useHeroWingLook,
      opacity: useHeroWingLook ? 0.98 : 1,
      flatShading: false,
      envMapIntensity: useHeroWingLook ? 1.55 : isWing ? 0.02 : 0.015,
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
        refreshDark7V46ScrollTriggers();
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

      // Initial camera for embedded hero (dark7-v46).
      // ZOOM: camera Z — higher = zoom out (see more wing), lower = zoom in
      //        also tweak REST_BIRD.scale above for size
      camera.position.set(-0.35, 0.85, 1.15); // ← X, Y, Z (Z = zoom)
      camera.lookAt(0.15, 0.15, 0);

      ScrollTrigger.getById(DARK7_V46_HERO_PIN_ID)?.kill();

      gsapCtx?.revert();
      gsapCtx = gsap.context(() => {
        const state = { progress: 0 };

        scrollTween = gsap.to(state, {
          progress: 1,
          ease: "none",
          scrollTrigger: Dark7V46ScrollTrigger({
            id: embeddedScroll ? DARK7_V46_HERO_PIN_ID : "eagle-scroll-scene",
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
        refreshDark7V46ScrollTriggers();
        const progress =
          getDark7V46ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
        applyScrollProgress(progress);
        onScrollProgressRef.current?.(progress <= 0.001 ? 0 : progress);
      });

      window.setTimeout(() => {
        refreshDark7V46ScrollTriggers(true);
        const progress =
          getDARK7_V46ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
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