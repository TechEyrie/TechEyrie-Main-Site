"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

function applyBirdMaterial(bird, iceNormal, lightweight = false) {
  const materials = [];

  bird.traverse((child) => {
    if (!child.isMesh) return;
    child.frustumCulled = lightweight;

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0b9a68"),
      emissive: new THREE.Color("#5fe08d"),
      emissiveIntensity: lightweight ? 0.1 : 0.14,
      transparent: true,
      opacity: lightweight ? 0.84 : 0.78,
      roughness: lightweight ? 0.14 : 0.18,
      metalness: lightweight ? 0.14 : 0.05,
      transmission: lightweight ? 0.36 : 0.25,
      thickness: lightweight ? 0.52 : 0.4,
      ior: 1.42,
      normalMap: iceNormal,
      normalScale: new THREE.Vector2(lightweight ? 0.028 : 0.025, lightweight ? 0.028 : 0.025),
      clearcoat: 1,
      clearcoatRoughness: lightweight ? 0.06 : 0.08,
      iridescence: 1,
      iridescenceIOR: 1.28,
      iridescenceThicknessRange: lightweight ? [140, 520] : [80, 320],
      envMapIntensity: lightweight ? 2.8 : 3.2,
      attenuationColor: new THREE.Color("#74f5a1"),
      attenuationDistance: 1.15,
      side: lightweight ? THREE.FrontSide : THREE.DoubleSide,
      depthWrite: false,
    });

    child.material = material;
    materials.push(material);
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
    // ── EAGLE POSITION (dark7-three2 / three3 / three4 hero) ──────────────────
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

    if (backgroundOnly) {
      bottomLight = new THREE.DirectionalLight(0xc9ffe2, 1.35);
      bottomLight.position.set(0.4, -7, 2.5);
      scene.add(bottomLight);

      topShadeLight = new THREE.DirectionalLight(0x062a1f, 0.55);
      topShadeLight.position.set(-0.5, 8, 1.5);
      scene.add(topShadeLight);
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

    new RGBELoader().load(HDR_ENV, (hdr) => {
      if (disposed) {
        hdr.dispose();
        return;
      }
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = hdr;
      texturesToDispose.push(hdr);
    });

    if (!backgroundOnly) {
      const iceMap = textureLoader.load(ICE_MAP);
      const iceRoughness = textureLoader.load(ICE_ROUGHNESS);
      texturesToDispose.push(iceMap, iceRoughness);
      iceMap.wrapS = THREE.RepeatWrapping;
      iceMap.wrapT = THREE.RepeatWrapping;
      iceRoughness.wrapS = THREE.RepeatWrapping;
      iceRoughness.wrapT = THREE.RepeatWrapping;
      iceMap.repeat.set(1, 1);
      iceRoughness.repeat.set(1, 1);
    }

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
        ScrollTrigger.refresh();
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

    // ── SCROLL WING LOOK (green crystalline / noomo-style) ───────────────────
    // Driven by scrollProgress 0→1. Increase end values for stronger bloom/saturation.
    function applyScrollMaterialEffects(t) {
      const bloom = Math.pow(THREE.MathUtils.clamp(t, 0, 1), 0.82);

      renderer.toneMappingExposure = THREE.MathUtils.lerp(1.22, 1.85, bloom);
      keyLight.intensity = THREE.MathUtils.lerp(2.8, 5.6, bloom);

      if (fillLight) {
        fillLight.intensity = THREE.MathUtils.lerp(1.1, 1.85, bloom);
        // Top hemisphere: darker forest green
        fillLight.color.setHSL(
          0.38,
          THREE.MathUtils.lerp(0.52, 0.45, bloom),
          THREE.MathUtils.lerp(0.16, 0.24, bloom),
        );
        // Bottom hemisphere: lighter mint / near-white green
        fillLight.groundColor.setHSL(
          0.44,
          THREE.MathUtils.lerp(0.32, 0.18, bloom),
          THREE.MathUtils.lerp(0.84, 0.97, bloom),
        );
      }

      if (bottomLight) {
        bottomLight.intensity = THREE.MathUtils.lerp(1.35, 2.6, bloom);
        bottomLight.color.setHSL(0.44, 0.28, THREE.MathUtils.lerp(0.88, 0.98, bloom));
      }

      if (topShadeLight) {
        topShadeLight.intensity = THREE.MathUtils.lerp(0.55, 0.28, bloom);
      }

      if (rimLight) {
        rimLight.intensity = THREE.MathUtils.lerp(2.8, 13, bloom);
        rimLight.color.setHSL(
          0.43,
          THREE.MathUtils.lerp(0.42, 0.1, bloom),
          THREE.MathUtils.lerp(0.72, 1, bloom),
        );
      }

      birdMaterials.forEach((mat) => {
        // Base feather tint: darker emerald overall, brighter as scroll blooms
        mat.color.setHSL(
          THREE.MathUtils.lerp(0.37, 0.44, bloom),
          THREE.MathUtils.lerp(0.72, 0.34, bloom),
          THREE.MathUtils.lerp(0.32, 0.72, bloom),
        );
        // Emissive biased lighter (bottom highlights / edge glow)
        mat.emissive.setHSL(
          0.44,
          THREE.MathUtils.lerp(0.48, 0.12, bloom),
          THREE.MathUtils.lerp(0.22, 0.96, bloom),
        );
        mat.emissiveIntensity = THREE.MathUtils.lerp(0.1, 1.2, bloom);
        mat.opacity = THREE.MathUtils.lerp(0.82, 0.95, bloom);
        mat.transmission = THREE.MathUtils.lerp(0.34, 0.7, bloom);
        mat.roughness = THREE.MathUtils.lerp(0.14, 0.025, bloom);
        mat.metalness = THREE.MathUtils.lerp(0.12, 0.4, bloom);
        mat.iridescence = THREE.MathUtils.lerp(0.85, 1, bloom);
        mat.iridescenceIOR = THREE.MathUtils.lerp(1.24, 1.58, bloom);
        mat.envMapIntensity = THREE.MathUtils.lerp(2.4, 6.8, bloom);
        mat.clearcoatRoughness = THREE.MathUtils.lerp(0.06, 0.012, bloom);
      });

      if (wingAction) {
        wingAction.timeScale = THREE.MathUtils.lerp(0.45, 1.4, bloom);
      }

      if (embeddedScroll && canvas) {
        const saturate = THREE.MathUtils.lerp(1, 1.28, bloom);
        const brightness = THREE.MathUtils.lerp(1, 1.2, bloom);
        const contrast = THREE.MathUtils.lerp(1, 1.06, bloom);
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
        x: THREE.MathUtils.lerp(-0.5, -1, scrollProgress), // ← start X , end X (fly-out)
        y: THREE.MathUtils.lerp(0.05, 2.5, scrollProgress),
        z: THREE.MathUtils.lerp(0, -2.8, scrollProgress),
        scale: THREE.MathUtils.lerp(1, 2.8, scrollProgress),
        rotZ: THREE.MathUtils.lerp(0, 0, scrollProgress),
      };

      applyBirdTransform();
      applyScrollMaterialEffects(scrollProgress);
      onScrollProgressRef.current?.(scrollProgress);

      if (embeddedScroll && canvas) {
        canvas.style.visibility = scrollProgress < 0.98 ? "visible" : "hidden";
      }
    }

    function createScrollAnimation(triggerEl) {
      if (disposed || scrollReady || !triggerEl) return;
      scrollReady = true;

      // Initial camera for embedded hero (dark7-three2). First value = camera X.
      // More negative → eagle appears more to the RIGHT; less negative → more LEFT.
      camera.position.set(-0.35, 0.85, 1.15); // ← camera X , Y , Z
      camera.lookAt(0.15, 0.15, 0); // ← lookAt X affects horizontal framing

      ScrollTrigger.getById("dark7-three2-eagle-hero")?.kill();

      gsapCtx?.revert();
      gsapCtx = gsap.context(() => {
        const state = { progress: 0 };

        scrollTween = gsap.to(state, {
          progress: 1,
          ease: "none",
          scrollTrigger: {
            id: embeddedScroll ? "dark7-three2-eagle-hero" : "eagle-scroll-scene",
            trigger: triggerEl,
            ...(embeddedScroll ? { scroller: document.documentElement } : {}),
            start: "top top",
            end: embeddedScroll ? "+=1200" : "+=8000",
            scrub: embeddedScroll ? 1.5 : 2.5,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            applyScrollProgress(state.progress);
          },
        });

        applyScrollProgress(0);
        onScrollProgressRef.current?.(0);
      }, triggerEl);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const progress =
          window.scrollY < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
        applyScrollProgress(progress);
        onScrollProgressRef.current?.(progress <= 0.001 ? 0 : progress);
      });

      window.setTimeout(() => {
        ScrollTrigger.refresh(true);
        const progress =
          window.scrollY < 8 ? 0 : (scrollTween?.scrollTrigger?.progress ?? 0);
        applyScrollProgress(progress);
        onScrollProgressRef.current?.(progress <= 0.001 ? 0 : progress);
      }, 400);
    }

    gltfLoader.load(
      BIRD_MESH,
      (gltf) => {
        if (disposed) return;

        birdObject = gltf.scene;
        birdMaterials = applyBirdMaterial(birdObject, iceNormal, backgroundOnly);
        scene.add(birdObject);

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
