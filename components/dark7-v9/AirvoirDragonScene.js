"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import {
  V20_DRAGON_MESH,
  V20_HDR_ENV,
  V20_FEATHER_NORMAL,
  V20_DRACO_DECODER_PATH,
  DRAGON_EPIC_PALETTE,
  applyDragonMaterial,
  setupDragonAnimations,
  updateDragonFeatherUniforms,
} from "./v20DragonMaterial";
import "./AirvoirDragonScene.css";

/**
 * Airvoir bird tuning — edit these values, then hard-refresh `/dark7-v9`.
 * File: components/dark7-v9/AirvoirDragonScene.js
 *
 * FLIGHT_START = pose at the beginning of the scroll flight
 * FLIGHT_END   = pose at the end of the scroll flight
 * (Everything between start/end lerps as you scroll.)
 *
 * Units are in 3D scene space (not px). Positive directions noted per axis.
 */
const FLIGHT_START = {
  // Position — left / right on screen (negative = left, positive = right)
  x: -4.6,
  // Position — up / down (positive = higher, negative = lower)
  y: -0.08,
  // Position — toward / away from camera (positive = closer to you, negative = farther)
  z: 0.35,
  // Overall size of the bird (1 = model default; higher = bigger)
  scale: 1.18,
  // Yaw — turn left / right around vertical axis (radians). π*0.5 ≈ side view; higher ≈ more “from the right”
  rotY: Math.PI * 0.72,
  // Roll — tilt / bank wings (negative = tip one way, positive = the other)
  rotZ: 1.5,
  // Pitch — nose up / down (positive = nose up / more top of bird facing camera)
  rotX: 0.18,
};

const FLIGHT_END = {
  // Position — left / right on screen (negative = left, positive = right)
  x: 5.8,
  // Position — up / down (positive = higher, negative = lower)
  y: 0.06,
  // Position — toward / away from camera (positive = closer to you, negative = farther)
  z: 0.15,
  // Overall size of the bird at end of flight (higher = bigger)
  scale: 1.18,
  // Yaw — turn left / right (radians). Match or shift from start for a turning arc
  rotY: Math.PI * 0.68,
  // Roll — bank / wing tilt at end
  rotZ: 1.5,
  // Pitch — nose up / down at end
  rotX: 0.08,
};

/** Camera — where you look FROM (separate from bird pose above) */
const CAMERA = {
  // Lens zoom feel (lower = zoomed in / less wide; higher = wider FOV)
  fov: 28,
  // Camera position X — negative = stand left of scene, positive = stand right
  x: 1.4,
  // Camera position Y — higher = more bird’s-eye / looking down
  y: 0.85,
  // Camera position Z — higher = farther back from the bird
  z: 6.6,
  // Point the camera looks at (world coords)
  lookAtX: 0.3,
  lookAtY: 0.05,
  lookAtZ: 0,
};

export default function AirvoirDragonScene({ progressRef, className = "" }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    let frameId = 0;
    let disposed = false;
    let dragonObject = null;
    let dragonMixer = null;
    let wingAction = null;
    let scrollActions = [];
    let dragonMaterials = [];
    const texturesToDispose = [];
    const clock = new THREE.Clock();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.1, 100);
    camera.position.set(CAMERA.x, CAMERA.y, CAMERA.z);
    camera.lookAt(CAMERA.lookAtX, CAMERA.lookAtY, CAMERA.lookAtZ);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);

    // Luxury emerald glass lighting
    scene.add(new THREE.AmbientLight(0x8eccb0, 0.75));

    const keyLight = new THREE.DirectionalLight(0xf0fff6, 2.8);
    keyLight.position.set(3.4, 5.5, 3.2);
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x6ab898, 0x0a2018, 1.05);
    scene.add(fillLight);

    const jadeLight = new THREE.PointLight(0x2cff9a, 4.2, 48);
    jadeLight.position.set(-2.2, 1.2, 3.6);
    scene.add(jadeLight);

    const rimLight = new THREE.PointLight(0xa8ffe0, 3.4, 52);
    rimLight.position.set(5.2, 2.8, -2.4);
    scene.add(rimLight);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(V20_DRACO_DECODER_PATH);

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const featherNormal = new THREE.TextureLoader().load(V20_FEATHER_NORMAL);
    texturesToDispose.push(featherNormal);
    featherNormal.wrapS = THREE.RepeatWrapping;
    featherNormal.wrapT = THREE.RepeatWrapping;
    featherNormal.repeat.set(7.5, 7.5);
    featherNormal.anisotropy = 8;

    new RGBELoader().load(V20_HDR_ENV, (hdr) => {
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

    function applyFlightProgress(progress) {
      const t = THREE.MathUtils.clamp(progress, 0, 1);

      if (!dragonObject) return;

      dragonObject.position.set(
        THREE.MathUtils.lerp(FLIGHT_START.x, FLIGHT_END.x, t),
        THREE.MathUtils.lerp(FLIGHT_START.y, FLIGHT_END.y, t),
        THREE.MathUtils.lerp(FLIGHT_START.z, FLIGHT_END.z, t),
      );

      const scale = THREE.MathUtils.lerp(FLIGHT_START.scale, FLIGHT_END.scale, t);
      dragonObject.scale.setScalar(scale);

      dragonObject.rotation.set(
        THREE.MathUtils.lerp(FLIGHT_START.rotX, FLIGHT_END.rotX, t),
        THREE.MathUtils.lerp(FLIGHT_START.rotY, FLIGHT_END.rotY, t),
        THREE.MathUtils.lerp(FLIGHT_START.rotZ, FLIGHT_END.rotZ, t),
      );

      updateDragonFeatherUniforms(dragonObject, dragonMaterials);

      scrollActions.forEach(({ action, duration }) => {
        action.time = t * duration;
      });

      if (wingAction) {
        wingAction.timeScale = THREE.MathUtils.lerp(0.5, 1.1, t);
      }

      const bloom = Math.pow(t, 0.75);
      renderer.toneMappingExposure = THREE.MathUtils.lerp(1.02, 1.18, bloom);
      keyLight.intensity = THREE.MathUtils.lerp(2.4, 3.2, bloom);
      jadeLight.intensity = THREE.MathUtils.lerp(3.4, 5.0, bloom);

      dragonMaterials.forEach((mat, index) => {
        const swatch =
          mat.userData.swatch ?? DRAGON_EPIC_PALETTE[index % DRAGON_EPIC_PALETTE.length];
        const baseHue = mat.userData.baseHue ?? swatch.hue;

        // Rich emerald glass — saturated green, never charcoal
        mat.color.setHSL(
          baseHue,
          THREE.MathUtils.lerp(0.62, 0.72, bloom),
          THREE.MathUtils.lerp(0.2, 0.28, bloom),
        );
        mat.emissive.setHSL(
          baseHue,
          THREE.MathUtils.lerp(0.5, 0.62, bloom),
          THREE.MathUtils.lerp(0.12, 0.2, bloom),
        );
        mat.emissiveIntensity = THREE.MathUtils.lerp(0.14, 0.28, bloom);
        mat.metalness = THREE.MathUtils.lerp(0.08, 0.2, bloom);
        mat.roughness = THREE.MathUtils.lerp(0.32, 0.16, bloom);
        if ("clearcoat" in mat) {
          mat.clearcoat = THREE.MathUtils.lerp(0.75, 1.0, bloom);
          mat.clearcoatRoughness = THREE.MathUtils.lerp(0.16, 0.06, bloom);
          mat.envMapIntensity = THREE.MathUtils.lerp(1.2, 1.85, bloom);
        }

        const featherUniforms = mat.userData.featherUniforms;
        if (featherUniforms) {
          featherUniforms.uIriStrength.value = THREE.MathUtils.lerp(0.38, 0.58, bloom);
        }
      });
    }

    gltfLoader.load(
      V20_DRAGON_MESH,
      (gltf) => {
        if (disposed) return;

        dragonObject = gltf.scene;
        scene.add(dragonObject);
        dragonObject.updateWorldMatrix(true, true);
        dragonMaterials = applyDragonMaterial(dragonObject, { featherNormal }, {
          look: "epic",
        });

        if (gltf.animations.length) {
          dragonMixer = new THREE.AnimationMixer(dragonObject);
          const animationSetup = setupDragonAnimations(dragonMixer, gltf.animations);
          scrollActions = animationSetup.scrollActions;
          wingAction = animationSetup.wingAction;
        }

        applyFlightProgress(progressRef?.current ?? 0);
      },
      undefined,
      (error) => console.error("[AirvoirDragonScene] v20.glb failed:", error),
    );

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (dragonMixer) {
        dragonMixer.update(delta);
      }

      applyFlightProgress(progressRef?.current ?? 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      texturesToDispose.forEach((texture) => texture.dispose?.());
      dracoLoader.dispose();
      renderer.dispose();
    };
  }, [progressRef]);

  return (
    <div ref={stageRef} className={`airvoir-dragon-stage ${className}`.trim()} aria-hidden="true">
      <canvas ref={canvasRef} className="airvoir-dragon-canvas" />
    </div>
  );
}
