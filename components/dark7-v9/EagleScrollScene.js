"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Dark7V9ScrollTrigger,
  getDark7V9ScrollTop,
  refreshDark7V9ScrollTriggers,
  notifyHeroPinReady,
  DARK7_V9_HERO_PIN_ID,
} from "./lenisScrollTrigger";
import {
  V20_DRAGON_MESH,
  V20_HDR_ENV,
  V20_FEATHER_NORMAL,
  V20_DRACO_DECODER_PATH,
  WING_PALETTE,
  applyDragonMaterial,
  setupDragonAnimations,
  updateDragonFeatherUniforms,
} from "./v20DragonMaterial";
import "./EagleScrollScene.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
    let heroTipBones = [];
    let heroTipActions = [];
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
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, backgroundOnly ? 1.75 : 2),
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = backgroundOnly ? 1.02 : 0.96;
    renderer.setClearColor(0x000000, 0);

    let fillLight = null;
    let rimLight = null;
    let jadeLight = null;
    let bottomLight = null;
    let topShadeLight = null;
    let tealAccent = null;
    let goldAccent = null;
    let limeAccent = null;

    let keyLight;

    if (backgroundOnly) {
      // Exact Airvoir lighting — painted facet artwork needs this punch on dark hero
      scene.add(new THREE.AmbientLight(0xb8dcc8, 1.35));

      keyLight = new THREE.DirectionalLight(0xd8f0e4, 2.7);
      keyLight.position.set(2.2, 6, 4.5);
      scene.add(keyLight);

      jadeLight = new THREE.PointLight(0x1ab070, 4.2, 56);
      jadeLight.position.set(4, 2, 4);
      scene.add(jadeLight);

      fillLight = new THREE.HemisphereLight(0x3a8060, 0x021008, 1.0);
      scene.add(fillLight);

      rimLight = new THREE.PointLight(0x88c8a0, 2.4, 48);
      rimLight.position.set(5.8, 2.4, 4.2);
      scene.add(rimLight);

      bottomLight = null;
      tealAccent = null;
      limeAccent = null;
      goldAccent = null;
    } else {
      scene.add(new THREE.AmbientLight(0xb8dcc8, 1.8));

      keyLight = new THREE.DirectionalLight(0xd8f0e4, 3.6);
      keyLight.position.set(2.2, 6, 4.5);
      scene.add(keyLight);

      const greenLight = new THREE.PointLight(0x00c878, 9, 60);
      greenLight.position.set(4, 2, 4);
      scene.add(greenLight);

      const pinkLight = new THREE.PointLight(0xff66cc, 8, 60);
      pinkLight.position.set(-4, -2, 4);
      scene.add(pinkLight);

      const blueShadow = new THREE.PointLight(0x3366ff, 3, 80);
      blueShadow.position.set(-4, 1, 5);
      scene.add(blueShadow);
    }

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(V20_DRACO_DECODER_PATH);

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const textureLoader = new THREE.TextureLoader();
    const featherNormal = textureLoader.load(V20_FEATHER_NORMAL);
    texturesToDispose.push(featherNormal);
    featherNormal.wrapS = THREE.RepeatWrapping;
    featherNormal.wrapT = THREE.RepeatWrapping;
    // Match Airvoir feather grain so paint reads as artwork, not flat plastic
    featherNormal.repeat.set(2.4, 2.4);
    featherNormal.anisotropy = backgroundOnly ? 8 : 1;

    const birdTextures = { featherNormal };

    new RGBELoader().load(V20_HDR_ENV, (hdr) => {
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
        refreshDark7V9ScrollTriggers();
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
      birdObject.rotation.y = (baseBird.rotY ?? 0) + mouse.x * 0.16 * hoverAmount;
      birdObject.rotation.x = (baseBird.rotX ?? 0) - mouse.y * 0.1 * hoverAmount;
      updateDragonFeatherUniforms(birdObject, birdMaterials);
    }

    // ── SCROLL WING LOOK ───
    // Hero uses Airvoir painted-facet response (not epic glass — that went muddy flat)
    function applyScrollMaterialEffects(t) {
      const bloom = Math.pow(THREE.MathUtils.clamp(t, 0, 1), backgroundOnly ? 0.75 : 0.82);
      const heroLux = backgroundOnly;

      renderer.toneMappingExposure = THREE.MathUtils.lerp(
        heroLux ? 1.0 : 0.94,
        heroLux ? 1.16 : 1.18,
        bloom,
      );
      keyLight.intensity = THREE.MathUtils.lerp(
        heroLux ? 2.4 : 1.9,
        heroLux ? 3.2 : 3.2,
        bloom,
      );

      if (fillLight) {
        fillLight.intensity = THREE.MathUtils.lerp(
          heroLux ? 0.95 : 1.05,
          heroLux ? 1.15 : 1.3,
          bloom,
        );
        if (!heroLux) {
          fillLight.color.setHSL(
            0.4,
            THREE.MathUtils.lerp(0.48, 0.4, bloom),
            THREE.MathUtils.lerp(0.34, 0.42, bloom),
          );
          fillLight.groundColor.setHSL(
            0.38,
            THREE.MathUtils.lerp(0.58, 0.48, bloom),
            THREE.MathUtils.lerp(0.06, 0.1, bloom),
          );
        }
      }

      if (jadeLight) {
        jadeLight.intensity = THREE.MathUtils.lerp(
          heroLux ? 4.0 : 5.0,
          heroLux ? 5.4 : 6.6,
          bloom,
        );
      }

      if (bottomLight) {
        bottomLight.intensity = THREE.MathUtils.lerp(0.85, 1.4, bloom);
      }

      if (topShadeLight) {
        topShadeLight.intensity = THREE.MathUtils.lerp(0.62, 0.38, bloom);
      }

      if (tealAccent) {
        tealAccent.intensity = THREE.MathUtils.lerp(1.2, 2.8, bloom);
      }

      if (goldAccent) {
        goldAccent.intensity = THREE.MathUtils.lerp(0.9, 2.4, bloom);
      }

      if (limeAccent) {
        limeAccent.intensity = THREE.MathUtils.lerp(2.0, 3.6, bloom);
      }

      if (rimLight) {
        rimLight.intensity = THREE.MathUtils.lerp(
          heroLux ? 2.2 : 2.0,
          heroLux ? 3.0 : 4.8,
          bloom,
        );
      }

      birdMaterials.forEach((mat, index) => {
        const swatch =
          mat.userData.swatch ?? WING_PALETTE[index % WING_PALETTE.length];
        const baseHue = mat.userData.baseHue ?? swatch.hue;
        const featherUniforms = mat.userData.featherUniforms;
        const hueDrift = bloom * 0.03 * (index % 2 === 0 ? 1 : -1);

        if (heroLux) {
          // Airvoir facet paint response — keep saturation + lightness out of mud/neon
          mat.color.setHSL(
            baseHue + hueDrift,
            THREE.MathUtils.lerp(0.62, 0.54, bloom),
            THREE.MathUtils.lerp(0.24, 0.32, bloom),
          );
          mat.emissive.setHSL(
            baseHue + 0.03,
            THREE.MathUtils.lerp(0.42, 0.3, bloom),
            THREE.MathUtils.lerp(0.08, 0.18, bloom),
          );
          mat.emissiveIntensity = THREE.MathUtils.lerp(0.08, 0.2, bloom);
          if (featherUniforms) {
            featherUniforms.uIriStrength.value = THREE.MathUtils.lerp(0.3, 0.52, bloom);
            featherUniforms.uPaintStrength.value = 0.97;
          }
        } else {
          mat.color.setHSL(
            baseHue,
            THREE.MathUtils.lerp(0.6, 0.7, bloom),
            THREE.MathUtils.lerp(0.19, 0.26, bloom),
          );
          mat.emissive.setHSL(
            baseHue,
            THREE.MathUtils.lerp(0.48, 0.58, bloom),
            THREE.MathUtils.lerp(0.12, 0.18, bloom),
          );
          mat.emissiveIntensity = THREE.MathUtils.lerp(0.14, 0.28, bloom);
          mat.metalness = THREE.MathUtils.lerp(0.1, 0.2, bloom);
          mat.roughness = THREE.MathUtils.lerp(0.3, 0.18, bloom);
          if ("clearcoat" in mat) {
            mat.clearcoat = THREE.MathUtils.lerp(0.8, 0.98, bloom);
            mat.clearcoatRoughness = THREE.MathUtils.lerp(0.14, 0.07, bloom);
            mat.envMapIntensity = THREE.MathUtils.lerp(1.2, 1.85, bloom);
            if ("sheen" in mat) {
              mat.sheen = THREE.MathUtils.lerp(0.45, 0.65, bloom);
              mat.sheenRoughness = THREE.MathUtils.lerp(0.34, 0.22, bloom);
              if (mat.sheenColor) mat.sheenColor.set(swatch.mint);
            }
          }
          if (featherUniforms) {
            featherUniforms.uIriStrength.value = THREE.MathUtils.lerp(0.42, 0.56, bloom);
            featherUniforms.uPaintStrength.value = THREE.MathUtils.lerp(0.96, 0.99, bloom);
          }
        }
      });

      if (wingAction) {
        const wingRate = THREE.MathUtils.lerp(
          backgroundOnly ? 0.55 : 0.45,
          backgroundOnly ? 1.15 : 1.4,
          bloom,
        );
        wingAction.timeScale = wingRate;
        heroTipActions.forEach((action) => {
          action.timeScale = wingRate;
        });
      }

      if (embeddedScroll && canvas) {
        // Same soft grade as v8 hero embed
        const saturate = THREE.MathUtils.lerp(1.04, 1.16, bloom);
        const brightness = THREE.MathUtils.lerp(0.96, 1.04, bloom);
        const contrast = THREE.MathUtils.lerp(1.03, 1.1, bloom);
        canvas.style.filter = `saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`;
      }
    }

    function polishHeroDragonMaterials(materials) {
      // Lock Airvoir default swatches — flat shaded painted facets, not soft epic glass
      materials.forEach((mat, index) => {
        const swatch = WING_PALETTE[index % WING_PALETTE.length];
        mat.color.set(swatch.color);
        mat.emissive.set(swatch.emissive);
        mat.emissiveIntensity = 0.1;
        mat.metalness = 0.0;
        mat.roughness = 0.9;
        mat.flatShading = true;
        mat.envMapIntensity = 0.16;
        if (mat.normalScale) {
          mat.normalScale.set(0.028, 0.028);
        }

        mat.userData.baseHue = swatch.hue;
        mat.userData.swatch = swatch;

        const uniforms = mat.userData.featherUniforms;
        if (uniforms) {
          if (uniforms.uBaseColor) uniforms.uBaseColor.value.set(swatch.color);
          if (uniforms.uShadowColor) uniforms.uShadowColor.value.set(swatch.shadow);
          if (uniforms.uDeepForest) uniforms.uDeepForest.value.set(swatch.deepForest);
          if (uniforms.uHighlightColor) uniforms.uHighlightColor.value.set(swatch.highlight);
          if (uniforms.uMintColor) uniforms.uMintColor.value.set(swatch.mint);
          if (uniforms.uTipColor) uniforms.uTipColor.value.set(swatch.tip);
          if (uniforms.uIriPink) uniforms.uIriPink.value.set(swatch.iriPink);
          if (uniforms.uIriPurple) uniforms.uIriPurple.value.set(swatch.iriPurple);
          if (uniforms.uIriGold) uniforms.uIriGold.value.set(swatch.iriGold);
          if (uniforms.uIriStrength) uniforms.uIriStrength.value = 0.34;
          if (uniforms.uPaintStrength) uniforms.uPaintStrength.value = 0.97;
          if (uniforms.uEpicMode) uniforms.uEpicMode.value = 0.0;
        }
        mat.needsUpdate = true;
      });
    }

    function collectHeroWingTips(root) {
      heroTipBones = [];
      root.traverse((obj) => {
        if (!obj.isBone) return;
        const n = (obj.name || "").toLowerCase();
        if (!/tip|end|finger|primar|wing|feather|outer|wrist|hand/.test(n)) return;
        if (/body|spine|neck|head|root|pelvis|leg|tail/.test(n)) return;
        heroTipBones.push({ bone: obj });
      });
    }

    function setupHeroTipActions(mixer, clips) {
      heroTipActions = [];
      const wingClip = wingAction?.getClip?.() ?? null;
      clips.forEach((clip) => {
        if (!clip || clip === wingClip) return;
        const n = clip.name || "";
        if (!/tip|end|finger|feather|WingPulse|Float_Wing/i.test(n)) return;
        // Skip clips already reserved for scroll scrubbing
        if (scrollActions.some(({ action }) => action.getClip() === clip)) return;
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.timeScale = wingAction?.timeScale ?? 0.55;
        action.weight = 0.85;
        action.play();
        heroTipActions.push(action);
      });
    }

    function applyHeroTipFlex() {
      if (!wingAction || !heroTipBones.length) return;
      const clip = wingAction.getClip();
      const dur = Math.max(clip?.duration || 1, 0.001);
      const flap = Math.sin((wingAction.time / dur) * Math.PI * 2);
      // Stronger tip-end flex so outer feathers follow the flap
      heroTipBones.forEach((entry, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        const tipBias = /tip|end|finger|outer/i.test(entry.bone.name || "") ? 1.35 : 0.7;
        const amp = (0.09 + (i % 5) * 0.018) * tipBias;
        entry.bone.rotation.z += flap * amp * side;
        entry.bone.rotation.x += flap * amp * 0.55;
        entry.bone.rotation.y += flap * amp * 0.22 * side;
      });
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

      // Initial camera for embedded hero (dark7-v9). First value = camera X.
      // More negative → eagle appears more to the RIGHT; less negative → more LEFT.
      camera.position.set(-0.35, 0.85, 1.15); // ← camera X , Y , Z
      camera.lookAt(0.15, 0.15, 0); // ← lookAt X affects horizontal framing

      ScrollTrigger.getById(DARK7_V9_HERO_PIN_ID)?.kill();

      gsapCtx?.revert();
      gsapCtx = gsap.context(() => {
        const state = { progress: 0 };

        scrollTween = gsap.to(state, {
          progress: 1,
          ease: "none",
          scrollTrigger: Dark7V9ScrollTrigger({
            id: embeddedScroll ? DARK7_V9_HERO_PIN_ID : "eagle-scroll-scene",
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
        refreshDark7V9ScrollTriggers();
        const progress =
          getDark7V9ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
        applyScrollProgress(progress);
        onScrollProgressRef.current?.(progress <= 0.001 ? 0 : progress);
      });

      window.setTimeout(() => {
        refreshDark7V9ScrollTriggers(true);
        const progress =
          getDark7V9ScrollTop() < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
        applyScrollProgress(progress);
        onScrollProgressRef.current?.(progress <= 0.001 ? 0 : progress);
        if (embeddedScroll) {
          notifyHeroPinReady();
        }
      }, 400);
    }

    gltfLoader.load(
      V20_DRAGON_MESH,
      (gltf) => {
        if (disposed) return;

        birdObject = gltf.scene;
        scene.add(birdObject);
        birdObject.updateWorldMatrix(true, true);
        birdMaterials = applyDragonMaterial(birdObject, birdTextures, false);
        if (backgroundOnly) {
          polishHeroDragonMaterials(birdMaterials);
          applyScrollMaterialEffects(0);
        }

        if (gltf.animations.length) {
          birdMixer = new THREE.AnimationMixer(birdObject);
          const animationSetup = setupDragonAnimations(birdMixer, gltf.animations);
          scrollActions = animationSetup.scrollActions;
          wingAction = animationSetup.wingAction;
        }

        if (backgroundOnly) {
          collectHeroWingTips(birdObject);
          if (birdMixer && gltf.animations.length) {
            setupHeroTipActions(birdMixer, gltf.animations);
          }
          if (wingAction) {
            wingAction.timeScale = 0.62;
            wingAction.weight = 1;
          }
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

      if (backgroundOnly) {
        applyHeroTipFlex();
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
