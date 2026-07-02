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
  bird.traverse((child) => {
    if (!child.isMesh) return;
    child.frustumCulled = lightweight;

    if (lightweight) {
      child.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#009d73"),
        transparent: true,
        opacity: 0.82,
        roughness: 0.22,
        metalness: 0.12,
        normalMap: iceNormal,
        normalScale: new THREE.Vector2(0.02, 0.02),
        side: THREE.FrontSide,
      });
      return;
    }

    child.frustumCulled = false;

    child.material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#009d73"),
      transparent: true,
      opacity: 0.78,
      roughness: 0.18,
      metalness: 0.05,
      transmission: 0.25,
      thickness: 0.4,
      ior: 1.35,
      normalMap: iceNormal,
      normalScale: new THREE.Vector2(0.025, 0.025),
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 0.8,
      iridescenceIOR: 1.25,
      iridescenceThicknessRange: [80, 320],
      envMapIntensity: 3.2,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  });
}

export default function EagleScrollScene({
  backgroundOnly = false,
  pinTargetRef = null,
  onScrollProgress = null,
  embeddedScrollId = "dark7-three4-eagle-hero",
  embeddedScrollEnd = "+=1200",
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
    let scrollActions = [];
    let scrollProgress = 0;
    // ── EAGLE POSITION (dark7-three4) ─────────────────────────────────────────
    // X = left/right. Y = up/down — increase end Y to fly further upward on scroll.
    let baseBird = {
      x: -0.5,
      y: 0.05,
      z: 0,
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
      const fillLight = new THREE.HemisphereLight(0xeaf8ff, 0x1a3d2e, 0.9);
      scene.add(fillLight);
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

      new RGBELoader().load(HDR_ENV, (hdr) => {
        if (disposed) {
          hdr.dispose();
          return;
        }
        hdr.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = hdr;
        texturesToDispose.push(hdr);
      });
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
      // Fly upward and out of frame; wing speed ramps with scroll below.
      baseBird = {
        x: THREE.MathUtils.lerp(-0.5, -1.2, scrollProgress),
        y: THREE.MathUtils.lerp(0.05, 5.2, scrollProgress),
        z: THREE.MathUtils.lerp(0, 0.6, scrollProgress),
        scale: THREE.MathUtils.lerp(1, 2.4, scrollProgress),
        rotZ: THREE.MathUtils.lerp(0, -0.18, scrollProgress),
      };

      if (wingAction) {
        wingAction.timeScale = 0.5 + scrollProgress * 1.75;
      }

      applyBirdTransform();
      onScrollProgressRef.current?.(scrollProgress);

      if (embeddedScroll && canvas) {
        const fadeStart = 0.82;
        const eagleOpacity =
          scrollProgress < fadeStart
            ? 1
            : 1 - (scrollProgress - fadeStart) / (1 - fadeStart);
        canvas.style.opacity = String(Math.max(0, eagleOpacity));
        canvas.style.visibility = scrollProgress >= 0.98 ? "hidden" : "visible";
      }
    }

    function createScrollAnimation(triggerEl) {
      if (disposed || scrollReady || !triggerEl) return;
      scrollReady = true;

      // Initial camera for embedded hero (dark7-three2). First value = camera X.
      // More negative → eagle appears more to the RIGHT; less negative → more LEFT.
      camera.position.set(-0.35, 0.85, 1.15); // ← camera X , Y , Z
      camera.lookAt(0.15, 0.15, 0); // ← lookAt X affects horizontal framing

      ScrollTrigger.getById(embeddedScrollId)?.kill();

      gsapCtx?.revert();
      gsapCtx = gsap.context(() => {
        const state = { progress: 0 };

        scrollTween = gsap.to(state, {
          progress: 1,
          ease: "none",
          scrollTrigger: {
            id: embeddedScroll ? embeddedScrollId : "eagle-scroll-scene",
            trigger: triggerEl,
            ...(embeddedScroll ? { scroller: document.documentElement } : {}),
            start: "top top",
            end: embeddedScroll ? embeddedScrollEnd : "+=8000",
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
        applyBirdMaterial(birdObject, iceNormal, backgroundOnly);
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
  }, [backgroundOnly, pinTargetRef, embeddedScrollId, embeddedScrollEnd]);

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
