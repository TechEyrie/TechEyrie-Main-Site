"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Dark7V56ScrollTrigger,
  getDark7V56ScrollTop,
  refreshDark7V56ScrollTriggers,
  notifyHeroPinReady,
  DARK7_V56_HERO_PIN_ID,
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
  x: -0.4,
  y: 0.4,
  z: -0.8,
  scale: 0.4,
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
 * v56 — Noomo stained-glass (Beer-Lambert + faceted normals)
 * Noomo-like layered translucent crystals, dark-green top → mint bottom
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

/** Lower / tip leaves — visibly lighter than top (top→bottom read) */
const HERO_BOTTOM_PALETTE = [
  {
    hue: 0.34,
    color: "#1A4830",
    shadow: "#081C14",
    highlight: "#4A8A60",
    emissive: "#102818",
    tip: "#6A9A78",
    root: "#0A1C10",
    stripe: "#3E8058",
    vane: "#58A078",
    alt: "#1E4830",
    cool: "#78C898",
  },
  {
    hue: 0.32,
    color: "#1C4828",
    shadow: "#0A1C10",
    highlight: "#528A50",
    emissive: "#14281C",
    tip: "#6A9A68",
    root: "#0C1C0C",
    stripe: "#448050",
    vane: "#60A068",
    alt: "#244828",
    cool: "#80C880",
  },
  {
    hue: 0.33,
    color: "#1A4828",
    shadow: "#081C10",
    highlight: "#4A8A58",
    emissive: "#102818",
    tip: "#689A70",
    root: "#0A1C0C",
    stripe: "#3E8050",
    vane: "#58A068",
    alt: "#1E4828",
    cool: "#78C888",
  },
  {
    hue: 0.30,
    color: "#224828",
    shadow: "#0C1C10",
    highlight: "#5A8A48",
    emissive: "#182814",
    tip: "#729A58",
    root: "#0E1C0A",
    stripe: "#4A8048",
    vane: "#68A058",
    alt: "#284820",
    cool: "#88C870",
  },
  {
    hue: 0.35,
    color: "#1A4834",
    shadow: "#081C16",
    highlight: "#4A8A68",
    emissive: "#102820",
    tip: "#689A80",
    root: "#0C1C14",
    stripe: "#408068",
    vane: "#5AA088",
    alt: "#204838",
    cool: "#78C8A8",
  },
  {
    hue: 0.34,
    color: "#1C4830",
    shadow: "#0A1C14",
    highlight: "#4E8A60",
    emissive: "#12281C",
    tip: "#6A9A78",
    root: "#0C1C10",
    stripe: "#428058",
    vane: "#5EA078",
    alt: "#224830",
    cool: "#80C898",
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

  // Lower third + long tip leaves get lighter palette (clear top→bottom)
  const isBottom = relY < -0.02 || (relY < 0.12 && elongation > 4.8);
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
    `feather-stained-glass-volume-v56a-${isWing ? 1 : 0}-${heroWingLook ? 1 : 0}-${axis?.axisIdx ?? "b"}-${axis?.acrossIdx ?? "a"}`;

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
// ——— v56: Noomo stained-glass (Beer-Lambert + faceted normals) ———
// 3D value noise for gemstone inclusions / color patches
float sgHash3(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
}
float sgNoise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = sgHash3(i);
  float n100 = sgHash3(i + vec3(1.0, 0.0, 0.0));
  float n010 = sgHash3(i + vec3(0.0, 1.0, 0.0));
  float n110 = sgHash3(i + vec3(1.0, 1.0, 0.0));
  float n001 = sgHash3(i + vec3(0.0, 0.0, 1.0));
  float n101 = sgHash3(i + vec3(1.0, 0.0, 1.0));
  float n011 = sgHash3(i + vec3(0.0, 1.0, 1.0));
  float n111 = sgHash3(i + vec3(1.0, 1.0, 1.0));
  float x00 = mix(n000, n100, f.x);
  float x10 = mix(n010, n110, f.x);
  float x01 = mix(n001, n101, f.x);
  float x11 = mix(n011, n111, f.x);
  return mix(mix(x00, x10, f.y), mix(x01, x11, f.y), f.z);
}
float sgFbm3(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * sgNoise3(p);
    p = p * 2.13 + vec3(17.1, 9.3, 13.7);
    a *= 0.5;
  }
  return v;
}
// Elongated crystal cell: edge, id, offset.xy (for faceted normals)
vec4 sgCrystal(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float minD = 8.0;
  float midD = 8.0;
  vec2 minOff = vec2(0.0);
  vec2 minI = vec2(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = vec2(featherHash(i + g), featherHash(i + g + vec2(19.1, 7.3)));
      vec2 r = g + o - f;
      float d = length(r * vec2(0.58, 1.42));
      if (d < minD) { midD = minD; minD = d; minOff = r; minI = i + g; }
      else if (d < midD) { midD = d; }
    }
  }
  float edge = clamp((midD - minD) * 6.4, 0.0, 1.0);
  return vec4(edge, featherHash(minI), minOff.x, minOff.y);
}
// Anisotropic optical fibers (barbs) — density, not painted lines
float sgFiber(vec2 p, float freq, float ang) {
  float wob = featherFbm(p * 0.85) * 1.15;
  float ph = p.x * cos(ang) * freq + p.y * sin(ang) * freq + wob * 2.4;
  float s = 0.5 + 0.5 * cos(ph);
  float aa = max(0.08, fwidth(ph) * 1.6);
  return smoothstep(aa, 1.0, pow(s, 2.8));
}`
      )
      .replace(
        "#include <tonemapping_fragment>",
        `{
  vec3 n0 = normalize(vFeatherNormal);
  vec3 lightDir = normalize(vec3(0.22, 1.12, 0.38));
  float ndl0 = clamp(dot(n0, lightDir) * 0.5 + 0.5, 0.0, 1.0);

  float wingT = clamp(vWingAxisT, 0.0, 1.0);
  float tip = clamp(vWingTipBlend, 0.0, 1.0);

  float leafId = featherHash(vec2(uMeshSeed * 19.7, uMeshSeed * 7.3));
  float leafId2 = featherHash(vec2(uMeshSeed * 5.1, uMeshSeed * 13.9));
  float leafId3 = featherHash(vec2(uMeshSeed * 11.2, uMeshSeed * 3.4));

  if (uHeroWingLook > 0.5) {
    // v56 — Noomo cathedral facets: larger crystal plates, harder glass cuts
    float along = clamp(vWingAxisT, 0.0, 1.0);
    float acrossVal = uAcrossAxis < 0.5 ? vObjectPos.x : (uAcrossAxis < 1.5 ? vObjectPos.y : vObjectPos.z);
    float acrossN = (acrossVal - uAcrossCenter) / max(uLeafHalfWidth, 0.008);
    acrossN += (featherNoise(vec2(along * 2.0, uMeshSeed)) - 0.5) * 0.02;
    acrossN = clamp(acrossN, -1.4, 1.4);
    float away = abs(acrossN);
    float side = sign(acrossN + 1e-5);

    float relY = clamp((vFeatherWorldPos.y - uBirdOrigin.y + 0.72) / 2.3, 0.0, 1.0);
    float heightDark = pow(1.0 - relY, 0.86);
    float heightLite = pow(relY, 0.82);

    vec3 V = normalize(cameraPosition - vFeatherWorldPos);

    float thick = mix(1.22, 0.22, heightLite);
    thick *= mix(1.1, 0.42, tip);
    thick *= mix(1.06, 0.78, along);

    vec3 wp = vFeatherWorldPos * vec3(1.7, 1.2, 1.6) + vec3(uMeshSeed * 0.28);
    float inc = sgFbm3(wp);
    float inc2 = sgFbm3(wp * 1.85 + vec3(5.2, leafId * 3.2, 1.4));
    float inclAmt = smoothstep(0.3, 0.78, inc);
    float inclAmt2 = smoothstep(0.4, 0.86, inc2);
    thick *= mix(0.8, 1.32, inclAmt * (0.45 + heightDark * 0.55));
    thick = clamp(thick, 0.1, 2.05);

    vec2 cUV = vec2(
      along * mix(2.05, 3.15, leafId) + leafId2 * 0.8,
      acrossN * mix(1.45, 2.35, leafId3) + side * 0.28
    );
    cUV = mat2(1.04, 0.16, -0.12, 1.06) * cUV;
    vec4 cr1 = sgCrystal(cUV);
    vec4 cr2 = sgCrystal(cUV * 1.72 + vec2(leafId3 * 1.6, 0.9));
    vec4 cr3 = sgCrystal(cUV * 3.1 + vec2(1.6, along * 1.2));
    float cellAA = 1.0 - smoothstep(0.08, 0.32, fwidth(cUV.x) + fwidth(cUV.y));

    vec3 n = n0;
    n += vec3(cr1.z, cr1.w, 0.0) * 1.72 * cellAA;
    n += vec3(cr2.z, cr2.w, 0.0) * 1.05 * cellAA;
    n += vec3(cr3.z, cr3.w, 0.0) * 0.48 * cellAA;
    n = normalize(n);

    float ndl = clamp(dot(n, lightDir) * 0.5 + 0.5, 0.0, 1.0);
    float viewN = clamp(dot(n, V), 0.0, 1.0);
    float fresnel = pow(1.0 - viewN, 1.28);

    thick *= mix(0.78, 1.38, cr1.y * cellAA);

    vec2 fUV = vec2(along, acrossN);
    float fib1 = sgFiber(fUV, mix(16.0, 24.0, leafId), mix(0.9, 1.2, leafId2));
    float fibZone = smoothstep(0.05, 0.9, away);

    vec3 absDeep = vec3(1.72, 0.34, 1.05);
    vec3 absMid  = vec3(0.95, 0.18, 0.58);
    vec3 absThin = vec3(0.38, 0.08, 0.26);
    vec3 sigma = mix(absDeep, absMid, smoothstep(0.12, 0.55, heightLite));
    sigma = mix(sigma, absThin, smoothstep(0.5, 1.0, heightLite + tip * 0.35));
    vec3 trans = exp(-sigma * thick);

    vec3 gInk  = vec3(0.035, 0.11, 0.07);
    vec3 gGlow = vec3(0.7, 0.94, 0.8);
    vec3 feather = mix(gInk, trans, 0.9);

    vec3 islandDark = vec3(0.05, 0.2, 0.11);
    vec3 islandMid  = vec3(0.18, 0.52, 0.32);
    vec3 islandLite = vec3(0.46, 0.82, 0.58);
    vec3 island = mix(islandDark, islandMid, inclAmt);
    island = mix(island, islandLite, inclAmt2 * (0.4 + heightLite * 0.55));
    feather = mix(feather, island, 0.34 * mix(0.25, 0.72, inclAmt));

    vec3 faceA = mix(islandDark, islandLite, cr1.y);
    vec3 faceB = mix(islandMid, gGlow, cr2.y);
    feather = mix(feather, faceA, 0.42 * cellAA);
    feather = mix(feather, faceB, 0.2 * cellAA * (0.35 + heightLite));

    float faceLit = pow(ndl, 1.15);
    float faceShade = pow(1.0 - ndl, 1.05);
    feather *= mix(0.62, 1.32, faceLit);
    feather = mix(feather, gInk, faceShade * 0.32 * (0.4 + heightDark));

    float seam = pow(1.0 - cr1.x, 1.15) * cellAA;
    float cut = pow(smoothstep(0.18, 0.96, cr1.x), 1.25) * cellAA;
    feather = mix(feather, gInk, seam * 0.55 * (0.5 + heightDark));
    feather = mix(feather, mix(trans, gGlow, 0.62), cut * 0.62 * (0.32 + heightLite * 0.4 + fresnel * 0.28));
    feather = mix(feather, gGlow, pow(smoothstep(0.28, 0.98, cr2.x), 1.4) * cellAA * 0.26);
    feather = mix(feather, vec3(0.9, 0.98, 0.92), pow(smoothstep(0.6, 0.98, cr3.y) * cr3.x, 1.1) * cellAA * 0.22 * fresnel);

    feather = mix(feather, mix(trans, gGlow, 0.35), fib1 * fibZone * 0.12 * heightLite);

    float film = 0.5 + 0.5 * cos(thick * 11.0 + viewN * 6.0 + cr1.y * 8.0);
    feather = mix(feather, mix(vec3(0.16, 0.44, 0.28), gGlow, film), fresnel * 0.26 * (0.3 + heightLite));

    float rim = pow(max(smoothstep(0.4, 1.05, away), fresnel), 1.18);
    feather = mix(feather, mix(trans, gGlow, 0.65), rim * 0.36 * (0.35 + tip));
    feather = mix(feather, gInk, pow(1.0 - ndl0, 1.3) * 0.26 * heightDark);
    feather = mix(feather, gGlow, tip * uTipBlendStrength * 0.22);

    float luma = dot(feather, vec3(0.299, 0.587, 0.114));
    feather = mix(vec3(luma), feather, 1.28);
    feather *= mix(0.82, 1.12, 0.28 + heightLite * 0.45 + tip * 0.16);
    feather = clamp(feather, 0.0, 1.12);

    gl_FragColor.rgb = mix(gl_FragColor.rgb, feather, uPaintStrength);

    float od = 1.0 - exp(-thick * 1.5);
    float ghost = smoothstep(0.28, 0.76, relY);
    ghost = max(ghost, tip * 0.55 * smoothstep(0.18, 0.66, relY));
    float alpha = mix(0.94, 0.36, ghost) * mix(1.0, od, 0.4);
    alpha *= mix(1.0, 0.82, fresnel * 0.28);
    gl_FragColor.a *= clamp(alpha, 0.28, 1.0);
  } else {
    float relHeight = clamp((vFeatherWorldPos.y - uBirdOrigin.y + 0.1) / 1.7, 0.0, 1.0);
    float featherDepth = smoothstep(0.02, 0.55, wingT);
    vec3 feather = mix(uRootColor, uBaseColor, featherDepth);
    feather = mix(feather, uVaneColor, smoothstep(0.18, 0.82, relHeight) * 0.18);
    feather = mix(feather, uTipColor, tip * uTipBlendStrength);
    feather = mix(feather, uHighlightColor, ndl0 * 0.055);
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
      // Stained glass: all hero leaves transmit; bottom sheets more ghostly
      emissiveIntensity: useHeroWingLook ? (isBottom ? 0.14 : 0.06) : isWing ? 0.0 : 0.004,
      normalMap: useHeroWingLook ? featherNormal : featherNormal,
      normalScale: useHeroWingLook
        ? new THREE.Vector2(0.22, 0.22)
        : new THREE.Vector2(isWing ? 0.35 : 0.32, isWing ? 0.35 : 0.32),
      roughness: useHeroWingLook ? (isBottom ? 0.09 : 0.16) : isWing ? 0.97 : 0.92,
      metalness: useHeroWingLook ? 0.02 : 0.0,
      clearcoat: useHeroWingLook ? 1.0 : 0.0,
      clearcoatRoughness: useHeroWingLook ? (isBottom ? 0.05 : 0.11) : 1.0,
      reflectivity: useHeroWingLook ? 0.85 : 0.008,
      sheen: useHeroWingLook ? (isBottom ? 0.4 : 0.24) : 0.0,
      sheenRoughness: useHeroWingLook ? 0.2 : 1.0,
      sheenColor: new THREE.Color(swatch.cool ?? swatch.tip),
      specularIntensity: useHeroWingLook ? 1.35 : 0.12,
      transmission: useHeroWingLook ? (isBottom ? 0.38 : 0.16) : 0.0,
      thickness: useHeroWingLook ? (isBottom ? 0.4 : 0.7) : 0,
      ior: useHeroWingLook ? (isBottom ? 1.36 : 1.46) : 1.5,
      transparent: useHeroWingLook,
      opacity: useHeroWingLook ? (isBottom ? 0.7 : 0.92) : 1,
      flatShading: false,
      envMapIntensity: useHeroWingLook ? (isBottom ? 0.85 : 0.55) : isWing ? 0.02 : 0.015,
      side: THREE.DoubleSide,
      depthWrite: useHeroWingLook ? !isBottom : true,
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
    const isBottomFeather = Boolean(mat.userData.isBottomFeather);

    mat.color.set(swatch.color);
    mat.emissive.set(swatch.emissive);
    mat.emissiveIntensity = isHeroWingLook
      ? (isBottomFeather
        ? THREE.MathUtils.lerp(0.08, 0.12, t)
        : THREE.MathUtils.lerp(0.04, 0.06, t))
      : THREE.MathUtils.lerp(0.004, 0.008, t);
    mat.roughness = isHeroWingLook
      ? (isBottomFeather
        ? THREE.MathUtils.lerp(0.1, 0.08, t)
        : THREE.MathUtils.lerp(0.18, 0.14, t))
      : THREE.MathUtils.lerp(0.97, 0.94, t);
    mat.metalness = isHeroWingLook ? 0.02 : 0.0;

    if ("clearcoat" in mat) {
      mat.clearcoat = isHeroWingLook ? THREE.MathUtils.lerp(0.95, 1.0, t) : 0.0;
      mat.clearcoatRoughness = isHeroWingLook ? THREE.MathUtils.lerp(0.08, 0.05, t) : 1.0;
      mat.reflectivity = isHeroWingLook ? 0.78 : 0.008;
      mat.specularIntensity = isHeroWingLook ? 1.15 : 0.12;
      mat.envMapIntensity = isHeroWingLook
        ? THREE.MathUtils.lerp(isBottomFeather ? 1.05 : 0.7, isBottomFeather ? 1.25 : 0.9, t)
        : THREE.MathUtils.lerp(0.01, 0.025, t);

      if ("sheen" in mat) {
        mat.sheen = isHeroWingLook ? THREE.MathUtils.lerp(0.25, 0.35, t) : 0.0;
        mat.sheenRoughness = isHeroWingLook ? THREE.MathUtils.lerp(0.4, 0.35, t) : 1.0;
        if (mat.sheenColor) mat.sheenColor.set(swatch.cool ?? swatch.tip);
      }
    }
    if (isHeroWingLook && "transmission" in mat) {
      mat.transmission = isBottomFeather
        ? THREE.MathUtils.lerp(0.34, 0.4, t)
        : THREE.MathUtils.lerp(0.14, 0.18, t);
      mat.opacity = isBottomFeather
        ? THREE.MathUtils.lerp(0.66, 0.72, t)
        : THREE.MathUtils.lerp(0.88, 0.94, t);
      mat.thickness = isBottomFeather
        ? THREE.MathUtils.lerp(0.36, 0.42, t)
        : THREE.MathUtils.lerp(0.62, 0.72, t);
      mat.ior = isBottomFeather ? 1.36 : 1.46;
      mat.depthWrite = !isBottomFeather;
      mat.transparent = true;
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
    renderer.toneMappingExposure = backgroundOnly ? 1.08 : 0.96;

    scene.add(new THREE.AmbientLight(0xb8d0c0, backgroundOnly ? 0.82 : 1.7));

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
      fillLight = new THREE.HemisphereLight(0xc8ddd0, 0x1a2e24, 0.95);
      scene.add(fillLight);

      jadeLight = new THREE.PointLight(0x8ebfa0, 1.85, 58);
      jadeLight.position.set(-2.4, 1.6, 3.8);
      scene.add(jadeLight);

      rimLight = new THREE.PointLight(0xe8f0e4, 1.55, 62);
      rimLight.position.set(5.6, 3.2, -1.8);
      scene.add(rimLight);

      const topSoft = new THREE.DirectionalLight(0xdce8dc, 0.55);
      topSoft.position.set(0.2, 9, 2);
      scene.add(topSoft);
    }

    let bottomLight = null;
    let topShadeLight = null;
    let limeAccent = null;

    if (backgroundOnly) {
      bottomLight = new THREE.DirectionalLight(0x9ebc96, 0.85);
      bottomLight.position.set(0.4, -7, 2.5);
      scene.add(bottomLight);

      topShadeLight = new THREE.DirectionalLight(0x2a4034, 0.22);
      topShadeLight.position.set(-0.5, 8, 1.5);
      scene.add(topShadeLight);

      limeAccent = new THREE.PointLight(0xa8d4b4, 0.9, 48);
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
        refreshDark7V56ScrollTriggers();
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

      applyHeroBirdMaterialLook(birdMaterials, bloom);

      birdMaterials.forEach((mat, index) => {
        if (mat.userData.isHeroWingLook) return;
        const swatch = mat.userData.swatch ?? WING_PALETTE[index % WING_PALETTE.length];
        const featherUniforms = mat.userData.featherUniforms;
        mat.color.set(swatch.color);
        mat.emissive.set(swatch.emissive);
        mat.emissiveIntensity = THREE.MathUtils.lerp(0.004, 0.008, bloom);
        mat.roughness = THREE.MathUtils.lerp(0.97, 0.94, bloom);
        mat.metalness = 0.0;
        if (featherUniforms) {
          featherUniforms.uPaintStrength.value = 0.94;
        }
      });

      if (wingAction) {
        wingAction.timeScale = THREE.MathUtils.lerp(0.45, 1.05, bloom);
      }

      if (embeddedScroll && canvas) {
        const saturate = THREE.MathUtils.lerp(1.08, 1.16, bloom);
        const brightness = THREE.MathUtils.lerp(1.12, 1.18, bloom);
        const contrast = THREE.MathUtils.lerp(1.02, 1.06, bloom);
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

      // Initial camera for embedded hero (dark7-v56).
      // ZOOM: camera Z — higher = zoom out (see more wing), lower = zoom in
      //        also tweak REST_BIRD.scale above for size
      camera.position.set(-0.35, 0.85, 1.15); // ← X, Y, Z (Z = zoom)
      camera.lookAt(0.15, 0.15, 0);

      ScrollTrigger.getById(DARK7_V56_HERO_PIN_ID)?.kill();

      gsapCtx?.revert();
      gsapCtx = gsap.context(() => {
        const state = { progress: 0 };

        scrollTween = gsap.to(state, {
          progress: 1,
          ease: "none",
          scrollTrigger: Dark7V56ScrollTrigger({
            id: embeddedScroll ? DARK7_V56_HERO_PIN_ID : "eagle-scroll-scene",
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
        refreshDark7V56ScrollTriggers();
        const progress =
          getDark7V56ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
        applyScrollProgress(progress);
        onScrollProgressRef.current?.(progress <= 0.001 ? 0 : progress);
      });

      window.setTimeout(() => {
        refreshDark7V56ScrollTriggers(true);
        const progress =
          getDark7V56ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
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