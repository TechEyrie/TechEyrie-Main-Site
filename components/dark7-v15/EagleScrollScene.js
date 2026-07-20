"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Dark7V15ScrollTrigger,
  getDark7V15ScrollTop,
  refreshDark7V15ScrollTriggers,
  notifyHeroPinReady,
  DARK7_V15_HERO_PIN_ID,
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
 * Hero leaf families — v15 — moss / deep forest (Noomo paper grain)
 * root/shadow = dark base | tip/highlight = bright tip
 */
const HERO_TOP_PALETTE = [
  { hue: 0.32, color: "#1A5C28", shadow: "#0A2814", highlight: "#4AA848", emissive: "#06180C", tip: "#8BC85A", root: "#05140A", stripe: "#144820", vane: "#2E7A38", alt: "#163C20", cool: "#3E9050" },
  { hue: 0.30, color: "#2A5820", shadow: "#142810", highlight: "#6AB040", emissive: "#0C1808", tip: "#A8D050", root: "#0A1608", stripe: "#204818", vane: "#4A8830", alt: "#1C3C18", cool: "#5C9840" },
  { hue: 0.35, color: "#145830", shadow: "#082818", highlight: "#48A868", emissive: "#04180E", tip: "#78C888", root: "#03140A", stripe: "#104828", vane: "#287850", alt: "#0E3C28", cool: "#389868" },
  { hue: 0.28, color: "#3A5020", shadow: "#1C2810", highlight: "#7AB038", emissive: "#101808", tip: "#B8D048", root: "#0E1608", stripe: "#2C4018", vane: "#587828", alt: "#243818", cool: "#6C9040" },
  { hue: 0.33, color: "#185C28", shadow: "#0A2814", highlight: "#52A850", emissive: "#06180C", tip: "#90C860", root: "#04140A", stripe: "#124820", vane: "#327A3C", alt: "#143C20", cool: "#449058" },
  { hue: 0.31, color: "#245828", shadow: "#102814", highlight: "#5EAC48", emissive: "#08180C", tip: "#9CCC58", root: "#06140A", stripe: "#1A4820", vane: "#3E8038", alt: "#183C1C", cool: "#509850" },
];

/** Lower / stretched leaves */
const HERO_BOTTOM_PALETTE = [
  { hue: 0.31, color: "#2A7840", shadow: "#143820", highlight: "#68C858", emissive: "#0A2010", tip: "#A8E070", root: "#081C0E", stripe: "#1E6030", vane: "#48A050", alt: "#184C28", cool: "#5CB868" },
  { hue: 0.29, color: "#3A7030", shadow: "#1C3818", highlight: "#78C848", emissive: "#0E200C", tip: "#B8E060", root: "#0C1C0A", stripe: "#2A5824", vane: "#589840", alt: "#22481C", cool: "#6CB050" },
  { hue: 0.34, color: "#247848", shadow: "#103828", highlight: "#60C878", emissive: "#082018", tip: "#98E098", root: "#061C12", stripe: "#1A6038", vane: "#40A068", alt: "#144C30", cool: "#50B880" },
  { hue: 0.30, color: "#347038", shadow: "#18381C", highlight: "#70C850", emissive: "#0C2010", tip: "#B0E068", root: "#0A1C0C", stripe: "#245828", vane: "#509848", alt: "#1C4820", cool: "#64B058" },
  { hue: 0.27, color: "#446828", shadow: "#203814", highlight: "#88C840", emissive: "#12200A", tip: "#C8E058", root: "#0E1C08", stripe: "#305020", vane: "#689038", alt: "#28441C", cool: "#78A848" },
  { hue: 0.36, color: "#1C7850", shadow: "#0C3828", highlight: "#58C888", emissive: "#062018", tip: "#90E0A8", root: "#041C14", stripe: "#146040", vane: "#38A070", alt: "#104C34", cool: "#48B890" },
];

const FEATHER_PAINT_STRENGTH = 1.0;
const WING_TIP_ZONE_START = 0.18;
const WING_TIP_BLEND_STRENGTH = 0.95;

function isWingFeatherMesh(mesh) {
  const name = (mesh.name || "").toLowerCase();
  if (/^b_body|^b_head|^b_neck|^bone/i.test(name)) return false;
  if (/wing|feather/.test(name)) return true;

  if (!mesh.geometry) return false;
  mesh.geometry.computeBoundingBox();
  const bbox = mesh.geometry.boundingBox;
  if (!bbox) return false;

  const size = bbox.getSize(new THREE.Vector3());
  const minDim = Math.min(size.x, size.y, size.z);
  const maxDim = Math.max(size.x, size.y, size.z);
  return maxDim / (minDim + 1e-5) > 2.2;
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

  const minVal = [bbox.min.x, bbox.min.y, bbox.min.z][axisIdx];
  const maxVal = [bbox.max.x, bbox.max.y, bbox.max.z][axisIdx];
  const center = new THREE.Vector3();
  bbox.getCenter(center);

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
    uTipSoftStart: { value: heroWingLook ? 0.12 : (axis?.softStart ?? 0.42) },
    uMeshSeed: { value: meshSeed },
    uHeroWingLook: { value: heroWingLook ? 1.0 : 0.0 },
  };

  material.userData.featherUniforms = uniforms;
  material.customProgramCacheKey = () =>
    `feather-leaf-moss-v15-${isWing ? 1 : 0}-${heroWingLook ? 1 : 0}-${axis?.axisIdx ?? "b"}`;

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
}`,
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

  // Soft continuous noise only — no floor/sin stripes (those caused the grid lines)
  float softGrain = featherNoise(vObjectPos.xy * 6.5 + vec2(uMeshSeed * 2.1, uMeshSeed));
  float softGrain2 = featherNoise(vObjectPos.yx * 3.2 - vec2(uMeshSeed, uMeshSeed * 1.7));

  if (uHeroWingLook > 0.5) {
    // Stronger multi-band gradient so each leaf reads as its own shape
    float gradPow = mix(0.7, 1.45, leafId);
    float t = pow(wingT, gradPow);
    t = clamp(t + (leafId2 - 0.5) * 0.16, 0.0, 1.0);

    float bandA = clamp(t + (leafId3 - 0.5) * 0.14, 0.0, 1.0);
    float bandB = clamp(t - (leafId - 0.5) * 0.1, 0.0, 1.0);

    // Per-leaf personality: push hue families apart so neighbors don't blend
    float family = floor(leafId * 5.99);
    vec3 accentWarm = vec3(0.55, 0.72, 0.22);
    vec3 accentCool = vec3(0.25, 0.55, 0.38);
    vec3 accentNeon = vec3(0.40, 0.78, 0.28);
    vec3 accentPick = family < 1.5 ? accentWarm : (family < 3.5 ? accentNeon : accentCool);

    vec3 cDeep = mix(uRootColor, uShadowColor, 0.25 + leafId * 0.7);
    cDeep *= mix(0.72, 1.0, leafId2); // some leaves start almost black-green
    vec3 cForest = mix(uAltColor, uStripeColor, leafId2);
    vec3 cMidDark = mix(uStripeColor, uBaseColor, 0.2 + leafId3 * 0.4);
    vec3 cMid = mix(uBaseColor, uVaneColor, 0.25 + leafId * 0.55);
    vec3 cLime = mix(uHighlightColor, uCoolColor, leafId2);
    cLime = mix(cLime, accentPick, 0.28 + leafId3 * 0.25);
    vec3 cTip = mix(uTipColor, accentPick, 0.35 + leafId * 0.4);
    vec3 cTipHot = mix(cTip, accentWarm, leafId2 * 0.45);

    // 6–7 visible green bands down the leaf
    vec3 feather = cDeep;
    feather = mix(feather, cForest, smoothstep(0.0, 0.16, bandA));
    feather = mix(feather, cMidDark, smoothstep(0.12, 0.34, t));
    feather = mix(feather, cMid, smoothstep(0.28, 0.52, bandB));
    feather = mix(feather, cLime, smoothstep(0.46, 0.72, t));
    feather = mix(feather, mix(cLime, cTip, 0.55), smoothstep(0.64, 0.86, bandA));
    feather = mix(feather, cTipHot, smoothstep(0.78, 1.0, t));

    // Soft width variation — different greens across the leaf, no stripe grid
    float across = featherNoise(vec2(vObjectPos.x * 1.8 + uMeshSeed * 2.0, wingT * 2.2));
    feather = mix(feather, cForest, (1.0 - t) * across * 0.28);
    feather = mix(feather, cTip, t * (1.0 - across) * 0.22);
    feather = mix(feather, cMidDark, abs(across - 0.5) * 0.16 * (1.0 - t));

    // Soft leaf separation (darken silhouette slightly — not hard lines)
    float rim = pow(1.0 - clamp(dot(n, normalize(cameraPosition - vFeatherWorldPos)), 0.0, 1.0), 2.4);
    feather = mix(feather, cDeep, rim * 0.28);

    // Soft flecks only
    feather = mix(feather, cDeep, (1.0 - softGrain) * 0.14 * (1.0 - t));
    feather = mix(feather, cTipHot, softGrain2 * 0.10 * t);

    feather = mix(feather, cTipHot, tip * uTipBlendStrength);
    feather = mix(feather, cLime, ndl * 0.07 * t);
    feather = mix(feather, cDeep, (1.0 - ndl) * 0.06 * (1.0 - t));

    // Boost saturation slightly so colors stay vivid against each other
    float luma = dot(feather, vec3(0.299, 0.587, 0.114));
    feather = mix(vec3(luma), feather, 1.10);

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

    const useHeroWingLook = isHeroSplit && isWing;

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(swatch.color),
      emissive: new THREE.Color(swatch.emissive),
      emissiveIntensity: isWing ? 0.0 : 0.004,
      normalMap: useHeroWingLook ? null : featherNormal,
      normalScale: useHeroWingLook
        ? new THREE.Vector2(0, 0)
        : new THREE.Vector2(isWing ? 0.35 : 0.32, isWing ? 0.35 : 0.32),
      roughness: useHeroWingLook ? 1.0 : isWing ? 0.97 : 0.92,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: useHeroWingLook ? 0.0 : 0.008,
      sheen: 0.0,
      sheenRoughness: 1.0,
      specularIntensity: useHeroWingLook ? 0.04 : 0.12,
      transmission: 0.0,
      transparent: false,
      opacity: 1,
      flatShading: false,
      envMapIntensity: useHeroWingLook ? 0.0 : isWing ? 0.02 : 0.015,
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
    mat.emissiveIntensity = isHeroWingLook ? 0.0 : THREE.MathUtils.lerp(0.004, 0.008, t);
    mat.roughness = isHeroWingLook
      ? THREE.MathUtils.lerp(1.0, 0.98, t)
      : THREE.MathUtils.lerp(0.97, 0.94, t);
    mat.metalness = 0.0;

    if ("clearcoat" in mat) {
      mat.clearcoat = 0.0;
      mat.clearcoatRoughness = 1.0;
      mat.reflectivity = isHeroWingLook ? 0.0 : 0.008;
      mat.specularIntensity = isHeroWingLook ? 0.04 : 0.12;
      mat.envMapIntensity = isHeroWingLook
        ? 0.0
        : THREE.MathUtils.lerp(0.01, 0.025, t);

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
    featherNormal.repeat.set(5.5, 5.5);
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
        refreshDark7V15ScrollTriggers();
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
        const saturate = THREE.MathUtils.lerp(1.2, 1.28, bloom);
        const brightness = THREE.MathUtils.lerp(1.0, 1.04, bloom);
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

      // Initial camera for embedded hero (dark7-v15).
      // ZOOM: camera Z — higher = zoom out (see more wing), lower = zoom in
      //        also tweak REST_BIRD.scale above for size
      camera.position.set(-0.35, 0.85, 1.15); // ← X, Y, Z (Z = zoom)
      camera.lookAt(0.15, 0.15, 0);

      ScrollTrigger.getById(DARK7_V15_HERO_PIN_ID)?.kill();

      gsapCtx?.revert();
      gsapCtx = gsap.context(() => {
        const state = { progress: 0 };

        scrollTween = gsap.to(state, {
          progress: 1,
          ease: "none",
          scrollTrigger: Dark7V15ScrollTrigger({
            id: embeddedScroll ? DARK7_V15_HERO_PIN_ID : "eagle-scroll-scene",
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
        refreshDark7V15ScrollTriggers();
        const progress =
          getDark7V15ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
        applyScrollProgress(progress);
        onScrollProgressRef.current?.(progress <= 0.001 ? 0 : progress);
      });

      window.setTimeout(() => {
        refreshDark7V15ScrollTriggers(true);
        const progress =
          getDARK7_V15ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
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