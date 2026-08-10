"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Dark7V37ScrollTrigger,
  refreshDark7V37ScrollTriggers,
} from "./lenisScrollTrigger";
import {
  BIRD_MESH,
  HDR_ENV,
  FEATHER_NORMAL,
  DRACO_DECODER_PATH,
  applyBirdMaterial,
  applyHeroBirdMaterialLook,
  setupBirdAnimations,
} from "./EagleScrollScene";
import "./ServicesRightWingScene.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICES_WING_ID = "dark7-v37-services-right-wing";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVICES LEFT-WING TUNING (v12 — inverse of v11)
 * File: components/dark7-v37/ServicesRightWingScene.js
 * Page: /dark7-v37  →  New Services section (left side)
 *
 * Edit numbers below, save, then hard-refresh the page.
 *
 * REST  = how the wing sits when you first see the section
 * EXIT  = where it flies when you scroll past
 * CAMERA_REST / CAMERA_EXIT = where you look FROM (separate from bird pose)
 * SCROLL = when the exit starts / trigger range
 *
 * Units are 3D scene space (not px). Directions noted per axis.
 * Note: bird is NOT mirrored (scale.x > 0) so you see the LEFT wing.
 * Pitch is inverted vs v11 so the bird faces downward.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Bird pose while parked in the services section */
const REST = {
  // LEFT / RIGHT — smaller (or more negative) = further left; larger = further right
  x: -2.5,
  // UP / DOWN — larger = higher on screen; smaller / more negative = lower
  y: -1.5,
  // TOWARD / AWAY — larger = closer to camera; smaller = farther back
  z: -2.85,
  // SIZE — 1 = model default; higher = bigger wing
  scale: 1.15,
  // ROLL (bank) — tilt wings left/right (radians). Try ±0.1 steps
  // Inverted vs v11 (was +0.18) for the left-wing / downward pose
  rotZ: -0.8,
  // YAW (turn) — rotate left/right around vertical (radians)
  // Inverted vs v11 (was +0.3)
  rotY: +0.4,
  // PITCH (nose) — tip nose up/down (radians). Positive ≈ nose up
  // Inverted vs v11 (was -1.2 upward) → faces downward
  rotX: 1,
};

/** Bird pose at the end of the scroll exit (lerps from REST → EXIT) */
const EXIT = {
  // LEFT / RIGHT — smaller (or more negative) = further left; larger = further right
  x: -5,
  // UP / DOWN — larger = higher on screen; smaller / more negative = lower
  y: -1.4,
  // TOWARD / AWAY — larger = closer to camera; smaller = farther back
  z: -1.85,
  // SIZE — 1 = model default; higher = bigger wing
  scale: 1.15,
  // ROLL / YAW / PITCH — same meaning as REST (inverted vs v11)
  rotZ: -0.18,
  rotY: -0.3,
  rotX: 1.2,
};

/** Camera while the wing is parked (where you stand + what you look at) */
const CAMERA_REST = {
  // Lens — lower = more zoomed in; higher = wider view
  fov: 25,
  // Camera stand LEFT / RIGHT
  x: 0.35,
  // Camera stand UP / DOWN — lower = look more from below the wing
  y: 0.55,
  // Camera stand NEAR / FAR — higher = step back from the bird
  z: 1.2,
  // Point the camera looks at (world coords)
  lookAtX: -0.15,
  lookAtY: -0.05,
  lookAtZ: 0,
};

/** Camera at end of exit (lerps from CAMERA_REST → CAMERA_EXIT) */
const CAMERA_EXIT = {
  x: 0.1,
  y: 0.85,
  z: 1.55,
  lookAtX: -0.7,
  lookAtY: 0.35,
  lookAtZ: 0,
};

/**
 * Scroll timing for the exit animation
 * progress goes 0 → 1 as you scroll through the section
 */
const SCROLL = {
  // When exit motion begins (0–1). Higher = wing stays parked longer before leaving
  exitStartsAt: 0.38,
  // Soften the exit curve (1 = linear after start; <1 = hangs longer then accelerates)
  exitEasePower: 0.9,
  // GSAP ScrollTrigger pins relative to the section
  // start: when section top hits this viewport line (e.g. "top 80%")
  triggerStart: "top 80%",
  // end: when animation finishes (e.g. "bottom top" = section bottom hits viewport top)
  triggerEnd: "bottom top",
  // scrub lag — higher = smoother / slightly delayed follow
  scrub: 1.15,
};

export default function ServicesRightWingScene({ sectionRef, className = "" }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    let disposed = false;
    let frameId = 0;
    let gsapCtx = null;
    let birdObject = null;
    let birdMixer = null;
    let wingAction = null;
    let birdMaterials = [];
    let scrollActions = [];
    let scrollProgress = 0;
    let isInView = true;
    let isPageVisible = typeof document !== "undefined" ? !document.hidden : true;
    let lastRenderTime = 0;
    let sectionEl = sectionRef?.current ?? null;
    const texturesToDispose = [];
    const clock = new THREE.Clock();
    const baseBird = { ...REST };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAMERA_REST.fov, 1, 0.1, 100);
    camera.position.set(CAMERA_REST.x, CAMERA_REST.y, CAMERA_REST.z);
    camera.lookAt(CAMERA_REST.lookAtX, CAMERA_REST.lookAtY, CAMERA_REST.lookAtZ);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.98;
    renderer.setClearColor(0x000000, 0);
    canvas.style.opacity = "1";

    // Same Noomo glass lighting as hero EagleScrollScene (backgroundOnly)
    scene.add(new THREE.AmbientLight(0xa8dcc0, 1.0));
    const keyLight = new THREE.DirectionalLight(0xe8f8f0, 2.1);
    keyLight.position.set(-2.2, 6, 4.5);
    scene.add(keyLight);
    scene.add(new THREE.HemisphereLight(0x70ffb0, 0x042010, 1.35));
    const jadeLight = new THREE.PointLight(0x00ff78, 4.2, 56);
    jadeLight.position.set(-4.2, 2.2, 4.2);
    scene.add(jadeLight);
    const rimLight = new THREE.PointLight(0xb8ffff, 2.8, 52);
    rimLight.position.set(-5.8, 2.8, 3.6);
    scene.add(rimLight);
    const cyanRim = new THREE.PointLight(0x40f0ff, 2.2, 46);
    cyanRim.position.set(5.0, 1.4, 3.4);
    scene.add(cyanRim);
    const amberFill = new THREE.PointLight(0xff9020, 1.8, 40);
    amberFill.position.set(-1.8, -1.2, 3.8);
    scene.add(amberFill);
    const mintTop = new THREE.DirectionalLight(0xa0ffd0, 1.0);
    mintTop.position.set(-0.2, 9, 2);
    scene.add(mintTop);
    const bottomLight = new THREE.DirectionalLight(0x78e8b0, 0.95);
    bottomLight.position.set(-0.4, -7, 2.5);
    scene.add(bottomLight);
    const limeAccent = new THREE.PointLight(0x40ff80, 2.8, 48);
    limeAccent.position.set(-0.2, 3.2, 2.2);
    scene.add(limeAccent);
    const goldAccent = new THREE.PointLight(0xff9a20, 1.8, 38);
    goldAccent.position.set(-2.4, -1.4, 4.1);
    scene.add(goldAccent);
    const tealAccent = new THREE.PointLight(0x30f0e0, 2.2, 44);
    tealAccent.position.set(4.2, 0.4, 3.2);
    scene.add(tealAccent);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const featherNormal = new THREE.TextureLoader().load(FEATHER_NORMAL);
    texturesToDispose.push(featherNormal);
    featherNormal.wrapS = THREE.RepeatWrapping;
    featherNormal.wrapT = THREE.RepeatWrapping;
    featherNormal.repeat.set(7.5, 7.5);
    featherNormal.anisotropy = 16;

    new RGBELoader().load(HDR_ENV, (hdr) => {
      if (disposed) {
        hdr.dispose();
        return;
      }
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = hdr;
      texturesToDispose.push(hdr);
    });

    function resize() {
      const width = Math.max(stage.clientWidth, 1);
      const height = Math.max(stage.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();

    let intersectionObserver = null;
    function bindSection(section) {
      sectionEl = section;
      intersectionObserver?.disconnect();
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isInView = entry.isIntersecting;
        },
        { threshold: 0.01 },
      );
      intersectionObserver.observe(section);
      createScrollAnimation(section);
    }

    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    function updateFeatherUniforms() {
      if (!birdObject) return;
      const origin = new THREE.Vector3();
      birdObject.getWorldPosition(origin);
      birdMaterials.forEach((mat) => {
        const uniforms = mat.userData.featherUniforms;
        if (uniforms?.uBirdOrigin) uniforms.uBirdOrigin.value.copy(origin);
      });
    }

    function applyBirdPose() {
      if (!birdObject) return;
      // Positive X scale = LEFT wing facing camera (v11 used -scale for the right wing).
      birdObject.scale.set(Math.abs(baseBird.scale), baseBird.scale, baseBird.scale);
      birdObject.position.set(baseBird.x, baseBird.y, baseBird.z);
      birdObject.rotation.set(baseBird.rotX, baseBird.rotY, baseBird.rotZ);
      updateFeatherUniforms();
    }

    function applyScrollProgress(p) {
      scrollProgress = THREE.MathUtils.clamp(p, 0, 1);
      // Parked until SCROLL.exitStartsAt, then ease toward EXIT
      const t = Math.pow(
        THREE.MathUtils.smoothstep(scrollProgress, SCROLL.exitStartsAt, 1),
        SCROLL.exitEasePower,
      );

      baseBird.x = THREE.MathUtils.lerp(REST.x, EXIT.x, t);
      baseBird.y = THREE.MathUtils.lerp(REST.y, EXIT.y, t);
      baseBird.z = THREE.MathUtils.lerp(REST.z, EXIT.z, t);
      baseBird.scale = THREE.MathUtils.lerp(REST.scale, EXIT.scale, t);
      baseBird.rotZ = THREE.MathUtils.lerp(REST.rotZ, EXIT.rotZ, t);
      baseBird.rotY = THREE.MathUtils.lerp(REST.rotY, EXIT.rotY, t);
      baseBird.rotX = THREE.MathUtils.lerp(REST.rotX, EXIT.rotX, t);

      camera.position.x = THREE.MathUtils.lerp(CAMERA_REST.x, CAMERA_EXIT.x, t);
      camera.position.y = THREE.MathUtils.lerp(CAMERA_REST.y, CAMERA_EXIT.y, t);
      camera.position.z = THREE.MathUtils.lerp(CAMERA_REST.z, CAMERA_EXIT.z, t);
      camera.lookAt(
        THREE.MathUtils.lerp(CAMERA_REST.lookAtX, CAMERA_EXIT.lookAtX, t),
        THREE.MathUtils.lerp(CAMERA_REST.lookAtY, CAMERA_EXIT.lookAtY, t),
        THREE.MathUtils.lerp(CAMERA_REST.lookAtZ, CAMERA_EXIT.lookAtZ, t),
      );

      if (wingAction) {
        wingAction.timeScale = THREE.MathUtils.lerp(0.55, 1.1, t);
      }

      const bloom = Math.pow(t, 0.82);
      renderer.toneMappingExposure = THREE.MathUtils.lerp(0.96, 1.08, bloom);
      keyLight.intensity = THREE.MathUtils.lerp(2.0, 2.6, bloom);
      jadeLight.intensity = THREE.MathUtils.lerp(4.2, 5.0, bloom);
      rimLight.intensity = THREE.MathUtils.lerp(2.8, 4.2, bloom);
      limeAccent.intensity = THREE.MathUtils.lerp(2.8, 4.4, bloom);
      goldAccent.intensity = THREE.MathUtils.lerp(1.6, 2.8, bloom);
      tealAccent.intensity = THREE.MathUtils.lerp(2.2, 3.6, bloom);
      applyHeroBirdMaterialLook(birdMaterials, bloom);

      applyBirdPose();
    }

    function createScrollAnimation(section) {
      if (!section || disposed) return;
      ScrollTrigger.getById(SERVICES_WING_ID)?.kill();
      gsapCtx?.revert();

      gsapCtx = gsap.context(() => {
        const state = { progress: 0 };
        gsap.to(state, {
          progress: 1,
          ease: "none",
          scrollTrigger: Dark7V37ScrollTrigger({
            id: SERVICES_WING_ID,
            trigger: section,
            start: SCROLL.triggerStart,
            end: SCROLL.triggerEnd,
            scrub: SCROLL.scrub,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          }),
          onUpdate: () => applyScrollProgress(state.progress),
        });
        applyScrollProgress(0);
      }, section);

      requestAnimationFrame(() => refreshDark7V37ScrollTriggers());
      window.setTimeout(() => refreshDark7V37ScrollTriggers(true), 400);
    }

    gltfLoader.load(
      BIRD_MESH,
      (gltf) => {
        if (disposed) return;
        birdObject = gltf.scene;
        scene.add(birdObject);
        birdObject.traverse((child) => {
          if (child.isMesh) child.frustumCulled = false;
        });
        birdObject.updateWorldMatrix(true, true);
        // Same material path as hero (backgroundOnly = true)
        birdMaterials = applyBirdMaterial(birdObject, { featherNormal }, true);
        applyHeroBirdMaterialLook(birdMaterials, 0);

        if (gltf.animations.length) {
          birdMixer = new THREE.AnimationMixer(birdObject);
          const setup = setupBirdAnimations(birdMixer, gltf.animations);
          scrollActions = setup.scrollActions;
          wingAction = setup.wingAction;
          if (wingAction) wingAction.timeScale = 0.55;
        }

        applyBirdPose();

        const section = sectionRef?.current ?? sectionEl;
        if (section) {
          bindSection(section);
        } else {
          // Parent ref can lag one frame — retry briefly
          let tries = 0;
          const retry = () => {
            if (disposed) return;
            const next = sectionRef?.current;
            if (next) {
              bindSection(next);
              return;
            }
            if (tries++ < 20) window.setTimeout(retry, 50);
          };
          retry();
        }
      },
      undefined,
      (error) => console.error("[ServicesRightWingScene] v20.glb failed:", error),
    );

    const animate = (time) => {
      frameId = requestAnimationFrame(animate);
      if (!isPageVisible) return;
      if (!birdObject) return;
      if (!isInView && scrollProgress > 0.98) return;
      if (time - lastRenderTime < 1000 / 30) return;
      lastRenderTime = time;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (birdMixer) {
        scrollActions.forEach(({ action, duration }) => {
          action.time = scrollProgress * duration * 0.35;
        });
        birdMixer.update(delta);
      }

      applyBirdPose();
      if (birdObject) {
        birdObject.position.y += Math.sin(elapsed * 1.05) * 0.01;
      }

      renderer.render(scene, camera);
    };
    animate(0);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      gsapCtx?.revert();
      ScrollTrigger.getById(SERVICES_WING_ID)?.kill();
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      texturesToDispose.forEach((t) => t.dispose?.());
      birdMaterials.forEach((m) => m.dispose?.());
      dracoLoader.dispose();
      renderer.dispose();
    };
  }, [sectionRef]);

  return (
    <div
      ref={stageRef}
      className={`services-right-wing-stage ${className}`.trim()}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="services-right-wing-canvas" />
    </div>
  );
}
