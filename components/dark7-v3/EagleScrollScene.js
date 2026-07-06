"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  dark7V3ScrollTrigger,
  getDark7V3ScrollTop,
  refreshDark7V3ScrollTriggers,
  notifyHeroPinReady,
  DARK7_V3_HERO_PIN_ID,
} from "./lenisScrollTrigger";
import "./EagleScrollScene.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BIRD_MESH = "/models/v20.glb";
const HDR_ENV = "/models/wooden_studio_19_1k.hdr";
const ICE_MAP = "/images/ice.jpg";
const ICE_NORMAL = "/images/icen.jpg";
const ICE_ROUGHNESS = "/images/iced.jpg";
const DRACO_DECODER_PATH = "/draco/gltf/";

// Per-mesh wing palette — emerald, teal, lime, gold-green iridescence
const WING_PALETTE = [
  {
    hue: 0.36,
    color: "#0b9a68",
    emissive: "#5fe08d",
    sheen: "#74f5a1",
    attenuation: "#3bc972",
  },
  {
    hue: 0.48,
    color: "#0a8f82",
    emissive: "#5fe0d8",
    sheen: "#9efcff",
    attenuation: "#2aa8b8",
  },
  {
    hue: 0.42,
    color: "#1a9f4a",
    emissive: "#b8ff94",
    sheen: "#d4fc7a",
    attenuation: "#74f5a1",
  },
  {
    hue: 0.52,
    color: "#3d8a42",
    emissive: "#ffe078",
    sheen: "#fff0b0",
    attenuation: "#c4b878",
  },
];

// Soft matte sage on outer ~35% of each wing feather (not glass/crystal)
const WING_TIP_SOFT_COLOR = "#6db589";
const WING_TIP_ZONE_START = 0.62; // smoothstep begins here → full soft at 100% along feather
const WING_TIP_BLEND_STRENGTH = 0.97;

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

function applyWingTipSoftBlend(material, mesh, birdOrigin, lightweight) {
  const axis = computeFeatherTipAxis(mesh, birdOrigin);
  if (!axis) return;

  const uniforms = {
    uWingRoot: { value: axis.rootVal },
    uWingTip: { value: axis.tipVal },
    uWingAxis: { value: axis.axisIdx },
    uTipSoftStart: { value: axis.softStart },
    uSoftGreen: { value: new THREE.Color(WING_TIP_SOFT_COLOR) },
    uTipBlendStrength: { value: lightweight ? 0.92 : WING_TIP_BLEND_STRENGTH },
  };

  material.userData.wingTipUniforms = uniforms;
  material.customProgramCacheKey = () =>
    `wing-tip-${axis.axisIdx}-${axis.rootVal.toFixed(3)}-${axis.tipVal.toFixed(3)}`;

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
varying float vWingTipBlend;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
float wingPos = uWingAxis < 0.5 ? transformed.x : (uWingAxis < 1.5 ? transformed.y : transformed.z);
float wingSpan = uWingTip - uWingRoot;
float wingT = wingSpan == 0.0 ? 0.0 : clamp((wingPos - uWingRoot) / wingSpan, 0.0, 1.0);
vWingTipBlend = smoothstep(uTipSoftStart, 1.0, wingT);`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform vec3 uSoftGreen;
uniform float uTipBlendStrength;
varying float vWingTipBlend;`,
      )
      .replace(
        "#include <tonemapping_fragment>",
        `{
  float tip = clamp(vWingTipBlend, 0.0, 1.0);
  vec3 softFeather = uSoftGreen * (0.96 + 0.04 * tip);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, softFeather, tip * uTipBlendStrength);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, softFeather, tip * 0.72);
  gl_FragColor.a = mix(gl_FragColor.a, 0.99, tip * 0.85);
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
  const { iceNormal, iceMap, iceRoughness } = textures;
  const materials = [];
  let meshIndex = 0;

  bird.updateWorldMatrix(true, true);
  const birdOrigin = new THREE.Vector3();
  bird.getWorldPosition(birdOrigin);

  bird.traverse((child) => {
    if (!child.isMesh) return;
    child.frustumCulled = lightweight;

    const swatch = WING_PALETTE[meshIndex % WING_PALETTE.length];
    meshIndex += 1;

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(swatch.color),
      emissive: new THREE.Color(swatch.emissive),
      emissiveIntensity: lightweight ? 0.12 : 0.16,
      map: iceMap,
      roughnessMap: iceRoughness,
      normalMap: iceNormal,
      normalScale: new THREE.Vector2(0.032, 0.032),
      transparent: true,
      opacity: lightweight ? 0.86 : 0.8,
      roughness: lightweight ? 0.12 : 0.16,
      metalness: lightweight ? 0.16 : 0.08,
      transmission: lightweight ? 0.38 : 0.28,
      thickness: lightweight ? 0.55 : 0.42,
      ior: 1.44,
      clearcoat: 1,
      clearcoatRoughness: lightweight ? 0.05 : 0.07,
      iridescence: 1,
      iridescenceIOR: 1.32,
      iridescenceThicknessRange: lightweight ? [160, 560] : [120, 420],
      sheen: 0.72,
      sheenRoughness: 0.22,
      sheenColor: new THREE.Color(swatch.sheen),
      envMapIntensity: lightweight ? 3.1 : 3.4,
      attenuationColor: new THREE.Color(swatch.attenuation),
      attenuationDistance: 1.05,
      side: lightweight ? THREE.FrontSide : THREE.DoubleSide,
      depthWrite: false,
    });

    material.userData.baseHue = swatch.hue;
    child.material = material;
    materials.push(material);

    if (isWingFeatherMesh(child)) {
      applyWingTipSoftBlend(material, child, birdOrigin, lightweight);
    }
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
    // ── EAGLE POSITION (dark7-v3 / three3 / three4 hero) ──────────────────
    // X = left/right in the 3D scene. More negative → further LEFT on screen.
    // More positive → further RIGHT. Tweak `x` here for the resting pose at scroll 0.
    let baseBird = {
      x: -0.5, // ← MAIN left/right at page load (try -1.2 left, -0.2 right)
      y: 0.05, // up/down at rest
      z: 0, // depth (toward/away from camera)
      scale: 1,
      rotZ: 0,
    };
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
      antialias: !backgroundOnly,
      alpha: true,
      powerPreference: backgroundOnly ? "default" : "high-performance",
    });
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, backgroundOnly ? 1 : 2),
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    scene.add(new THREE.AmbientLight(0xffffff, backgroundOnly ? 1.6 : 2));

    const keyLight = new THREE.DirectionalLight(0xffffff, backgroundOnly ? 2.8 : 4);
    keyLight.position.set(3, 5, 6);
    scene.add(keyLight);

    let fillLight = null;
    let rimLight = null;

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
      // Sky (top) = darker green, ground (bottom) = lighter mint — like reference purple gradient.
      fillLight = new THREE.HemisphereLight(0x0a3d2e, 0xdafce9, 1.1);
      scene.add(fillLight);

      rimLight = new THREE.PointLight(0xb8ffd9, 3.5, 48);
      rimLight.position.set(5.8, 1.8, 4.2);
      scene.add(rimLight);
    }

    let bottomLight = null;
    let topShadeLight = null;
    let tealAccent = null;
    let goldAccent = null;
    let limeAccent = null;

    if (backgroundOnly) {
      bottomLight = new THREE.DirectionalLight(0xc9ffe2, 1.35);
      bottomLight.position.set(0.4, -7, 2.5);
      scene.add(bottomLight);

      topShadeLight = new THREE.DirectionalLight(0x062a1f, 0.55);
      topShadeLight.position.set(-0.5, 8, 1.5);
      scene.add(topShadeLight);

      tealAccent = new THREE.PointLight(0x5fe0d8, 2.2, 40);
      tealAccent.position.set(-4.2, 0.4, 3.2);
      scene.add(tealAccent);

      goldAccent = new THREE.PointLight(0xffe078, 1.7, 34);
      goldAccent.position.set(2.4, -1.4, 4.1);
      scene.add(goldAccent);

      limeAccent = new THREE.PointLight(0xd4fc7a, 1.9, 38);
      limeAccent.position.set(0.2, 2.6, 2.2);
      scene.add(limeAccent);
    }

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const textureLoader = new THREE.TextureLoader();
    const iceNormal = textureLoader.load(ICE_NORMAL);
    texturesToDispose.push(iceNormal);
    iceNormal.wrapS = THREE.RepeatWrapping;
    iceNormal.wrapT = THREE.RepeatWrapping;

    const iceMap = textureLoader.load(ICE_MAP);
    const iceRoughness = textureLoader.load(ICE_ROUGHNESS);
    texturesToDispose.push(iceMap, iceRoughness);
    iceMap.wrapS = THREE.RepeatWrapping;
    iceMap.wrapT = THREE.RepeatWrapping;
    iceRoughness.wrapS = THREE.RepeatWrapping;
    iceRoughness.wrapT = THREE.RepeatWrapping;
    iceMap.repeat.set(1.15, 1.15);
    iceRoughness.repeat.set(1.15, 1.15);

    const birdTextures = { iceNormal, iceMap, iceRoughness };

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
        refreshDark7V3ScrollTriggers();
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
      birdObject.rotation.y = mouse.x * 0.16 * hoverAmount;
      birdObject.rotation.x = -mouse.y * 0.1 * hoverAmount;
    }

    // ── SCROLL WING LOOK (multi-tone green / teal / gold crystalline) ─────────
    function applyScrollMaterialEffects(t) {
      const bloom = Math.pow(THREE.MathUtils.clamp(t, 0, 1), 0.82);

      renderer.toneMappingExposure = THREE.MathUtils.lerp(1.22, 1.92, bloom);
      keyLight.intensity = THREE.MathUtils.lerp(2.8, 5.8, bloom);

      if (fillLight) {
        fillLight.intensity = THREE.MathUtils.lerp(1.1, 1.9, bloom);
        fillLight.color.setHSL(
          0.38,
          THREE.MathUtils.lerp(0.52, 0.45, bloom),
          THREE.MathUtils.lerp(0.16, 0.24, bloom),
        );
        fillLight.groundColor.setHSL(
          0.44,
          THREE.MathUtils.lerp(0.32, 0.18, bloom),
          THREE.MathUtils.lerp(0.84, 0.97, bloom),
        );
      }

      if (bottomLight) {
        bottomLight.intensity = THREE.MathUtils.lerp(1.35, 2.7, bloom);
        bottomLight.color.setHSL(0.44, 0.28, THREE.MathUtils.lerp(0.88, 0.98, bloom));
      }

      if (topShadeLight) {
        topShadeLight.intensity = THREE.MathUtils.lerp(0.55, 0.26, bloom);
      }

      if (tealAccent) {
        tealAccent.intensity = THREE.MathUtils.lerp(1.8, 5.5, bloom);
      }

      if (goldAccent) {
        goldAccent.intensity = THREE.MathUtils.lerp(1.2, 4.2, bloom);
      }

      if (limeAccent) {
        limeAccent.intensity = THREE.MathUtils.lerp(1.4, 4.8, bloom);
      }

      if (rimLight) {
        rimLight.intensity = THREE.MathUtils.lerp(2.8, 14, bloom);
        rimLight.color.setHSL(
          0.43,
          THREE.MathUtils.lerp(0.42, 0.1, bloom),
          THREE.MathUtils.lerp(0.72, 1, bloom),
        );
      }

      birdMaterials.forEach((mat, index) => {
        const baseHue = mat.userData.baseHue ?? 0.4;
        const hueDrift = bloom * 0.07 * (index % 2 === 0 ? 1 : -1);

        mat.color.setHSL(
          baseHue + hueDrift,
          THREE.MathUtils.lerp(0.74, 0.36, bloom),
          THREE.MathUtils.lerp(0.3, 0.74, bloom),
        );
        mat.emissive.setHSL(
          baseHue + 0.04,
          THREE.MathUtils.lerp(0.52, 0.14, bloom),
          THREE.MathUtils.lerp(0.22, 0.96, bloom),
        );
        mat.sheenColor.setHSL(
          baseHue + 0.08,
          THREE.MathUtils.lerp(0.45, 0.12, bloom),
          THREE.MathUtils.lerp(0.55, 0.98, bloom),
        );
        mat.emissiveIntensity = THREE.MathUtils.lerp(0.12, 1.25, bloom);
        mat.opacity = THREE.MathUtils.lerp(0.84, 0.96, bloom);
        mat.transmission = THREE.MathUtils.lerp(0.36, 0.74, bloom);
        mat.roughness = THREE.MathUtils.lerp(0.12, 0.02, bloom);
        mat.metalness = THREE.MathUtils.lerp(0.14, 0.42, bloom);
        mat.iridescence = THREE.MathUtils.lerp(0.88, 1, bloom);
        mat.iridescenceIOR = THREE.MathUtils.lerp(1.28, 1.62, bloom);
        mat.envMapIntensity = THREE.MathUtils.lerp(2.6, 7.2, bloom);
        mat.clearcoatRoughness = THREE.MathUtils.lerp(0.05, 0.01, bloom);
        mat.sheen = THREE.MathUtils.lerp(0.68, 0.92, bloom);
      });

      if (wingAction) {
        wingAction.timeScale = THREE.MathUtils.lerp(0.45, 1.4, bloom);
      }

      if (embeddedScroll && canvas) {
        const saturate = THREE.MathUtils.lerp(1.05, 1.38, bloom);
        const brightness = THREE.MathUtils.lerp(1, 1.22, bloom);
        const contrast = THREE.MathUtils.lerp(1, 1.08, bloom);
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

      // Eagle path while scrolling. First number = start X, second = end X at full scroll.
      // Example: lerp(-0.2, -6, …) starts more to the RIGHT than lerp(-0.5, -6, …).
      baseBird = {
        x: THREE.MathUtils.lerp(-0.6, -1, scrollProgress), // ← start X , end X (fly-out)
        y: THREE.MathUtils.lerp(0.3, 2.5, scrollProgress),
        z: THREE.MathUtils.lerp(0, -2.8, scrollProgress),
        scale: THREE.MathUtils.lerp(1, 2.8, scrollProgress),
        rotZ: THREE.MathUtils.lerp(-0.3, 0, scrollProgress),
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

      // Initial camera for embedded hero (dark7-v3). First value = camera X.
      // More negative → eagle appears more to the RIGHT; less negative → more LEFT.
      camera.position.set(-0.35, 0.85, 1.15); // ← camera X , Y , Z
      camera.lookAt(0.15, 0.15, 0); // ← lookAt X affects horizontal framing

      ScrollTrigger.getById(DARK7_V3_HERO_PIN_ID)?.kill();

      gsapCtx?.revert();
      gsapCtx = gsap.context(() => {
        const state = { progress: 0 };

        scrollTween = gsap.to(state, {
          progress: 1,
          ease: "none",
          scrollTrigger: dark7V3ScrollTrigger({
            id: embeddedScroll ? DARK7_V3_HERO_PIN_ID : "eagle-scroll-scene",
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
        refreshDark7V3ScrollTriggers();
        const progress =
          getDark7V3ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
        applyScrollProgress(progress);
        onScrollProgressRef.current?.(progress <= 0.001 ? 0 : progress);
      });

      window.setTimeout(() => {
        refreshDark7V3ScrollTriggers(true);
        const progress =
          getDark7V3ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
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
