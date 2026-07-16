"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Dark7V10ScrollTrigger,
  getDark7V10ScrollTop,
  refreshDark7V10ScrollTriggers,
  notifyHeroPinReady,
  DARK7_V10_HERO_PIN_ID,
} from "./lenisScrollTrigger";
import "./EagleScrollScene.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BIRD_MESH = "/models/v20.glb";
const HDR_ENV = "/models/wooden_studio_19_1k.hdr";
const FEATHER_NORMAL = "/images/icen.jpg";
const DRACO_DECODER_PATH = "/draco/gltf/";

// ── Eagle at rest (scroll = 0) — edit these to move / rotate / scale ─────
// x: more negative = left on screen, more positive = right
// y: up/down | z: depth | scale: size
// rotZ: roll (tilt) | rotY: turn left/right | rotX: pitch up/down (radians)
const REST_BIRD = {
  x: -0.6,
  y: 0.25,
  z: -0.3,
  scale: 1,
  rotZ: -0.2,
  rotY: 0,
  rotX: 0,
};

// Eagle pose at full scroll (fly-out animation end)
const SCROLL_END_BIRD = {
  x: -1,
  y: 2.5,
  z: -2.8,
  scale: 2.8,
  rotZ: 0,
  rotY: 0,
  rotX: 0,
};

// Noomo glass — darker overall emerald body, lit ridges still catch light
const WING_PALETTE = [
  {
    hue: 0.36,
    color: "#069448",
    shadow: "#022818",
    deepForest: "#011810",
    highlight: "#4ad878",
    mint: "#2eb888",
    emissive: "#0a7840",
    tip: "#88c8d8",
    iriPink: "#68c8b8",
    iriPurple: "#289888",
    iriGold: "#c87828",
  },
  {
    hue: 0.4,
    color: "#068858",
    shadow: "#022420",
    deepForest: "#011614",
    highlight: "#3cc8a0",
    mint: "#38b8a0",
    emissive: "#0a7050",
    tip: "#90d0e0",
    iriPink: "#58c0b8",
    iriPurple: "#208880",
    iriGold: "#c06820",
  },
  {
    hue: 0.32,
    color: "#0a9840",
    shadow: "#032814",
    deepForest: "#01180c",
    highlight: "#58d068",
    mint: "#38b070",
    emissive: "#0e7838",
    tip: "#98d0d8",
    iriPink: "#70c8a0",
    iriPurple: "#308868",
    iriGold: "#c88828",
  },
  {
    hue: 0.38,
    color: "#068c50",
    shadow: "#022818",
    deepForest: "#011610",
    highlight: "#48c888",
    mint: "#30b090",
    emissive: "#0c7450",
    tip: "#80c0d0",
    iriPink: "#60c0b0",
    iriPurple: "#248878",
    iriGold: "#c87820",
  },
];

const FEATHER_PAINT_STRENGTH = 0.78;
const FEATHER_IRI_STRENGTH = 0.48;
const WING_TIP_ZONE_START = 0.42;
const WING_TIP_BLEND_STRENGTH = 0.65;

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
  const softStart = isDedicatedTip ? 0.42 : WING_TIP_ZONE_START;

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
) {
  const axis = isWing ? computeFeatherTipAxis(mesh, birdOrigin) : null;

    const uniforms = {
    uBaseColor: { value: new THREE.Color(swatch.color) },
    uShadowColor: { value: new THREE.Color(swatch.shadow) },
    uDeepForest: { value: new THREE.Color(swatch.deepForest) },
    uHighlightColor: { value: new THREE.Color(swatch.highlight) },
    uMintColor: { value: new THREE.Color(swatch.mint) },
    uTipColor: { value: new THREE.Color(swatch.tip) },
    uIriPink: { value: new THREE.Color(swatch.iriPink) },
    uIriPurple: { value: new THREE.Color(swatch.iriPurple) },
    uIriGold: { value: new THREE.Color(swatch.iriGold) },
    uBirdOrigin: { value: birdOrigin.clone() },
    uMeshSeed: { value: meshSeed },
    uPaintStrength: { value: FEATHER_PAINT_STRENGTH },
    uIriStrength: { value: FEATHER_IRI_STRENGTH },
    uTipBlendStrength: { value: axis ? WING_TIP_BLEND_STRENGTH : 0 },
    uWingRoot: { value: axis?.rootVal ?? 0 },
    uWingTip: { value: axis?.tipVal ?? 1 },
    uWingAxis: { value: axis?.axisIdx ?? 0 },
    uTipSoftStart: { value: axis?.softStart ?? 1 },
  };

  material.userData.featherUniforms = uniforms;
  material.customProgramCacheKey = () =>
    `feather-paint-noomo-detail-v5-${isWing ? 1 : 0}-${axis?.axisIdx ?? "b"}`;

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
varying vec3 vFeatherLocalPos;
varying vec3 vFeatherNormal;
varying vec2 vFeatherUv;
varying float vWingTipBlend;`,
      )
      .replace(
        "#include <beginnormal_vertex>",
        `#include <beginnormal_vertex>
vFeatherNormal = normalize(normalMatrix * objectNormal);`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
vFeatherLocalPos = transformed;
vFeatherUv = uv;
float wingPos = uWingAxis < 0.5 ? transformed.x : (uWingAxis < 1.5 ? transformed.y : transformed.z);
float wingSpan = uWingTip - uWingRoot;
float wingT = wingSpan == 0.0 ? 0.0 : clamp((wingPos - uWingRoot) / wingSpan, 0.0, 1.0);
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
uniform vec3 uDeepForest;
uniform vec3 uHighlightColor;
uniform vec3 uMintColor;
uniform vec3 uTipColor;
uniform vec3 uIriPink;
uniform vec3 uIriPurple;
uniform vec3 uIriGold;
uniform vec3 uBirdOrigin;
uniform float uMeshSeed;
uniform float uPaintStrength;
uniform float uIriStrength;
uniform float uTipBlendStrength;
varying vec3 vFeatherWorldPos;
varying vec3 vFeatherLocalPos;
varying vec3 vFeatherNormal;
varying vec2 vFeatherUv;
varying float vWingTipBlend;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise21(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}`,
      )
      .replace(
        "#include <tonemapping_fragment>",
        `{
  vec3 viewDir = normalize(cameraPosition - vFeatherWorldPos);
  vec3 n = normalize(vFeatherNormal);
  float facing = clamp(dot(n, viewDir), 0.0, 1.0);
  float fresnel = pow(1.0 - facing, 2.2);
  float cavity = pow(1.0 - facing, 1.55);

  vec3 lightDir = normalize(vec3(0.25, 1.05, 0.35));
  float ndl = clamp(dot(n, lightDir) * 0.5 + 0.5, 0.0, 1.0);
  // Hard crystal facets — keep shard edges readable
  float facet = floor(ndl * 6.0) / 6.0;

  float relHeight = clamp((vFeatherWorldPos.y - uBirdOrigin.y + 0.12) / 1.65, 0.0, 1.0);
  vec3 heightTint = mix(uDeepForest, uBaseColor, smoothstep(0.0, 0.35, relHeight));
  heightTint = mix(heightTint, mix(uBaseColor, uHighlightColor, 0.28), smoothstep(0.3, 0.75, relHeight));
  heightTint = mix(heightTint, uMintColor, smoothstep(0.7, 1.0, relHeight) * 0.18);

  vec3 feather = mix(heightTint, uShadowColor, cavity * 0.48);
  feather = mix(feather, uHighlightColor, facet * 0.38);

  // ── DETAIL: rachis + barb fibers along each feather shard (Noomo stroke texture)
  vec2 fiberUv = vFeatherLocalPos.xy * vec2(48.0, 14.0) + uMeshSeed * 3.1;
  fiberUv += vFeatherUv * vec2(22.0, 9.0);
  float rachis = abs(sin(fiberUv.x * 1.15 + noise21(fiberUv * 0.35) * 1.8));
  rachis = pow(1.0 - rachis, 4.2);
  float barbLines = abs(sin(fiberUv.y * 9.5 + fiberUv.x * 0.55 + uMeshSeed));
  barbLines = pow(1.0 - barbLines, 2.6);
  float crossBarb = abs(sin(fiberUv.x * 3.4 - fiberUv.y * 2.1));
  crossBarb = pow(1.0 - crossBarb, 3.0);

  // Fine hair / ice grain
  float micro = noise21(fiberUv * 6.5 + uMeshSeed);
  float micro2 = noise21(fiberUv * 18.0 - uMeshSeed * 2.0);
  float grain = mix(micro, micro2, 0.45);

  // Layered shard cells (overlapping glass plates)
  float cell = noise21(vFeatherLocalPos.xz * 11.0 + uMeshSeed);
  float cellEdge = smoothstep(0.42, 0.58, cell) * (1.0 - smoothstep(0.58, 0.74, cell));

  // Carve fibers into color — deeper dark-green grooves so lit ridges feel brighter
  feather = mix(feather, uDeepForest, rachis * 0.72);
  feather = mix(feather, uShadowColor, barbLines * 0.58);
  feather = mix(feather, uHighlightColor, crossBarb * 0.28 * (1.0 - cavity));
  feather = mix(feather, uMintColor, grain * 0.18);
  feather *= 0.78 + 0.32 * grain;
  feather = mix(feather, uDeepForest, cellEdge * 0.48);

  // Amber / gold only in fiber grooves (not flat glow wash)
  float amberMask = rachis * (0.4 + 0.6 * cavity) * smoothstep(0.35, 0.85, grain);
  amberMask += barbLines * 0.25 * cavity;
  feather = mix(feather, uIriGold, amberMask * 0.55);

  // Teal / cyan iridescence along ridges only
  float iriT = facing + sin(vFeatherWorldPos.y * 7.0 + vFeatherWorldPos.x * 4.8 + uMeshSeed) * 0.12;
  float iriW = smoothstep(0.35, 0.9, iriT) * (0.35 + 0.65 * crossBarb);
  vec3 iri = mix(uIriPurple, uIriPink, smoothstep(0.15, 0.8, sin(fiberUv.x + uMeshSeed)));
  iri = mix(iri, uIriGold, smoothstep(0.55, 1.0, iriT) * 0.3);
  feather = mix(feather, iri, iriW * uIriStrength * 0.85);

  // Glass rim keeps cyan catchlight but doesn't flatten body detail
  vec3 rimCol = mix(uTipColor, uMintColor, 0.4);
  feather = mix(feather, rimCol, fresnel * 0.42 * (0.5 + 0.5 * rachis));

  float tip = clamp(vWingTipBlend, 0.0, 1.0);
  vec3 tipGlass = mix(uMintColor, uTipColor, 0.55);
  tipGlass = mix(tipGlass, uHighlightColor, grain * 0.25);
  feather = mix(feather, tipGlass, tip * uTipBlendStrength * 0.7);

  // Keep lit normal-map detail from the base material (don't overwrite 100%)
  gl_FragColor.rgb = mix(gl_FragColor.rgb, feather, uPaintStrength);
}
#include <tonemapping_fragment>`,
      );
  };

  material.needsUpdate = true;
}

function setupBirdAnimations(mixer, clips) {
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

function applyBirdMaterial(bird, textures, lightweight = false) {
  const { featherNormal } = textures;
  const materials = [];
  let meshIndex = 0;

  bird.updateWorldMatrix(true, true);
  const birdOrigin = new THREE.Vector3();
  bird.getWorldPosition(birdOrigin);

  bird.traverse((child) => {
    if (!child.isMesh) return;
    child.frustumCulled = lightweight;

    const swatch = WING_PALETTE[meshIndex % WING_PALETTE.length];
    const isWing = isWingFeatherMesh(child);
    meshIndex += 1;

    // Textured glass — strong normals + moderate roughness so fibers read (not flat glow)
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(swatch.color),
      emissive: new THREE.Color(swatch.emissive),
      emissiveIntensity: isWing ? 0.1 : 0.06,
      normalMap: featherNormal,
      normalScale: new THREE.Vector2(isWing ? 3.4 : 1.6, isWing ? 3.4 : 1.6),
      roughness: isWing ? 0.42 : 0.55,
      metalness: isWing ? 0.04 : 0.02,
      clearcoat: isWing ? 0.55 : 0.3,
      clearcoatRoughness: isWing ? 0.22 : 0.35,
      reflectivity: 0.7,
      sheen: 0.35,
      sheenRoughness: 0.45,
      sheenColor: new THREE.Color(swatch.mint),
      transparent: false,
      opacity: 1,
      transmission: 0,
      flatShading: true,
      envMapIntensity: isWing ? 1.15 : 0.7,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    material.userData.baseHue = swatch.hue;
    material.userData.swatch = swatch;
    child.material = material;
    materials.push(material);

    applyFeatherSurfaceShader(
      material,
      child,
      birdOrigin,
      swatch,
      lightweight,
      isWing,
      meshIndex * 0.173,
    );
  });

  return materials;
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
      powerPreference: backgroundOnly ? "high-performance" : "high-performance",
    });
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, backgroundOnly ? 1.75 : 2),
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = backgroundOnly ? 0.98 : 0.96;

    scene.add(new THREE.AmbientLight(0xa8dcc0, backgroundOnly ? 1.0 : 1.8));

    const keyLight = new THREE.DirectionalLight(0xe8f8f0, backgroundOnly ? 2.1 : 3.6);
    keyLight.position.set(2.2, 6, 4.5);
    scene.add(keyLight);

    let fillLight = null;
    let rimLight = null;
    let jadeLight = null;

    if (!backgroundOnly) {
      const greenLight = new THREE.PointLight(0x00c878, 9, 60);
      greenLight.position.set(4, 2, 4);
      scene.add(greenLight);

      const pinkLight = new THREE.PointLight(0xff66cc, 8, 60);
      pinkLight.position.set(-4, -2, 4);
      scene.add(pinkLight);

      const blueShadow = new THREE.PointLight(0x3366ff, 3, 80);
      blueShadow.position.set(-4, 1, 5);
      scene.add(blueShadow);
    } else {
      // Noomo glass wing lighting — electric lime + cyan rim + amber core
      fillLight = new THREE.HemisphereLight(0x70ffb0, 0x042010, 1.35);
      scene.add(fillLight);

      jadeLight = new THREE.PointLight(0x00ff78, 4.2, 56);
      jadeLight.position.set(4.2, 2.2, 4.2);
      scene.add(jadeLight);

      rimLight = new THREE.PointLight(0xb8ffff, 2.8, 52);
      rimLight.position.set(5.8, 2.8, 3.6);
      scene.add(rimLight);

      const cyanRim = new THREE.PointLight(0x40f0ff, 2.2, 46);
      cyanRim.position.set(-5.0, 1.4, 3.4);
      scene.add(cyanRim);

      const amberFill = new THREE.PointLight(0xff9020, 1.8, 40);
      amberFill.position.set(1.8, -1.2, 3.8);
      scene.add(amberFill);

      const mintTop = new THREE.DirectionalLight(0xa0ffd0, 1.0);
      mintTop.position.set(0.2, 9, 2);
      scene.add(mintTop);
    }

    let bottomLight = null;
    let topShadeLight = null;
    let tealAccent = null;
    let goldAccent = null;
    let limeAccent = null;

    if (backgroundOnly) {
      bottomLight = new THREE.DirectionalLight(0x78e8b0, 0.95);
      bottomLight.position.set(0.4, -7, 2.5);
      scene.add(bottomLight);

      topShadeLight = new THREE.DirectionalLight(0x041a10, 0.35);
      topShadeLight.position.set(-0.5, 8, 1.5);
      scene.add(topShadeLight);

      limeAccent = new THREE.PointLight(0x40ff80, 2.8, 48);
      limeAccent.position.set(0.2, 3.2, 2.2);
      scene.add(limeAccent);

      goldAccent = new THREE.PointLight(0xff9a20, 1.8, 38);
      goldAccent.position.set(2.4, -1.4, 4.1);
      scene.add(goldAccent);

      tealAccent = new THREE.PointLight(0x30f0e0, 2.2, 44);
      tealAccent.position.set(-4.2, 0.4, 3.2);
      scene.add(tealAccent);
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
    featherNormal.repeat.set(7.5, 7.5);
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
        refreshDark7V10ScrollTriggers();
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

    // ── SCROLL WING LOOK (Noomo crystalline glass bloom) ───
    function applyScrollMaterialEffects(t) {
      const bloom = Math.pow(THREE.MathUtils.clamp(t, 0, 1), 0.82);
      const heroGlass = backgroundOnly;

      renderer.toneMappingExposure = THREE.MathUtils.lerp(
        heroGlass ? 0.96 : 0.94,
        heroGlass ? 1.08 : 1.18,
        bloom,
      );
      keyLight.intensity = THREE.MathUtils.lerp(
        heroGlass ? 2.0 : 1.9,
        heroGlass ? 2.6 : 3.2,
        bloom,
      );

      if (fillLight) {
        fillLight.intensity = THREE.MathUtils.lerp(
          heroGlass ? 1.1 : 1.05,
          heroGlass ? 1.35 : 1.3,
          bloom,
        );
        fillLight.color.setHSL(
          0.38,
          THREE.MathUtils.lerp(0.62, 0.52, bloom),
          THREE.MathUtils.lerp(0.42, 0.5, bloom),
        );
        fillLight.groundColor.setHSL(
          0.36,
          THREE.MathUtils.lerp(0.55, 0.45, bloom),
          THREE.MathUtils.lerp(0.05, 0.08, bloom),
        );
      }

      if (jadeLight) {
        jadeLight.intensity = THREE.MathUtils.lerp(3.8, 5.5, bloom);
      }

      if (bottomLight) {
        bottomLight.intensity = THREE.MathUtils.lerp(
          heroGlass ? 0.9 : 0.85,
          heroGlass ? 1.35 : 1.4,
          bloom,
        );
      }

      if (topShadeLight) {
        topShadeLight.intensity = THREE.MathUtils.lerp(0.35, 0.22, bloom);
      }

      if (tealAccent) {
        tealAccent.intensity = THREE.MathUtils.lerp(2.2, 3.6, bloom);
      }

      if (goldAccent) {
        goldAccent.intensity = THREE.MathUtils.lerp(1.6, 2.8, bloom);
      }

      if (limeAccent) {
        limeAccent.intensity = THREE.MathUtils.lerp(2.8, 4.4, bloom);
      }

      if (rimLight) {
        rimLight.intensity = THREE.MathUtils.lerp(
          heroGlass ? 3.0 : 2.0,
          heroGlass ? 4.2 : 4.8,
          bloom,
        );
      }

      birdMaterials.forEach((mat, index) => {
        const swatch = mat.userData.swatch ?? WING_PALETTE[index % WING_PALETTE.length];
        const featherUniforms = mat.userData.featherUniforms;

        // Lock Noomo swatches — keep texture readable (low emissive, mid roughness)
        mat.color.set(swatch.color);
        mat.emissive.set(swatch.emissive);
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          heroGlass ? 0.09 : 0.08,
          heroGlass ? 0.16 : 0.14,
          bloom,
        );
        mat.roughness = THREE.MathUtils.lerp(0.44, 0.34, bloom);
        mat.metalness = THREE.MathUtils.lerp(0.03, 0.06, bloom);
        if ("clearcoat" in mat) {
          mat.clearcoat = THREE.MathUtils.lerp(0.5, 0.7, bloom);
          mat.clearcoatRoughness = THREE.MathUtils.lerp(0.24, 0.16, bloom);
          mat.envMapIntensity = THREE.MathUtils.lerp(1.05, 1.35, bloom);
          if ("sheen" in mat) {
            mat.sheen = THREE.MathUtils.lerp(0.3, 0.45, bloom);
            mat.sheenRoughness = THREE.MathUtils.lerp(0.48, 0.36, bloom);
            if (mat.sheenColor) mat.sheenColor.set(swatch.mint);
          }
        }

        if (featherUniforms) {
          if (featherUniforms.uBaseColor) featherUniforms.uBaseColor.value.set(swatch.color);
          if (featherUniforms.uHighlightColor) featherUniforms.uHighlightColor.value.set(swatch.highlight);
          if (featherUniforms.uMintColor) featherUniforms.uMintColor.value.set(swatch.mint);
          if (featherUniforms.uIriGold) featherUniforms.uIriGold.value.set(swatch.iriGold);
          featherUniforms.uIriStrength.value = THREE.MathUtils.lerp(0.42, 0.58, bloom);
          featherUniforms.uPaintStrength.value = 0.78;
        }
      });

      if (wingAction) {
        wingAction.timeScale = THREE.MathUtils.lerp(0.45, 1.4, bloom);
      }

      if (embeddedScroll && canvas) {
        const saturate = THREE.MathUtils.lerp(1.12, 1.2, bloom);
        const brightness = THREE.MathUtils.lerp(0.94, 0.98, bloom);
        const contrast = THREE.MathUtils.lerp(1.12, 1.18, bloom);
        canvas.style.filter = `saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`;
      }
    }

    function applyScrollProgress(p) {
      scrollProgress = THREE.MathUtils.clamp(p, 0, 1);

      // Camera X shifts framing left/right as you scroll (not the bird itself).
      // Increase both values → camera drifts right; decrease → drifts left.
      camera.position.x = THREE.MathUtils.lerp(-0.3, -0.15, scrollProgress);
      camera.position.y = THREE.MathUtils.lerp(0.5, 0.35, scrollProgress);
      camera.position.z = THREE.MathUtils.lerp(-1.25, -1.8, scrollProgress);
      // lookAt X: higher = camera looks more to the right (bird appears more left).
      camera.lookAt(0.20, 0.15, 0);

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

      // Initial camera for embedded hero (dark7-v10). First value = camera X.
      // More negative → eagle appears more to the RIGHT; less negative → more LEFT.
      camera.position.set(-0.35, 0.85, 1.15); // ← camera X , Y , Z
      camera.lookAt(0.15, 0.15, 0); // ← lookAt X affects horizontal framing

      ScrollTrigger.getById(DARK7_V10_HERO_PIN_ID)?.kill();

      gsapCtx?.revert();
      gsapCtx = gsap.context(() => {
        const state = { progress: 0 };

        scrollTween = gsap.to(state, {
          progress: 1,
          ease: "none",
          scrollTrigger: Dark7V10ScrollTrigger({
            id: embeddedScroll ? DARK7_V10_HERO_PIN_ID : "eagle-scroll-scene",
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
        refreshDark7V10ScrollTriggers();
        const progress =
          getDark7V10ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
        applyScrollProgress(progress);
        onScrollProgressRef.current?.(progress <= 0.001 ? 0 : progress);
      });

      window.setTimeout(() => {
        refreshDark7V10ScrollTriggers(true);
        const progress =
          getDark7V10ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
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
        birdMaterials = applyBirdMaterial(birdObject, birdTextures, backgroundOnly);

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
