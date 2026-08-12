"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import {
  BIRD_MESH,
  HDR_ENV,
  FEATHER_NORMAL,
  DRACO_DECODER_PATH,
  applyBirdMaterial,
  applyHeroBirdMaterialLook,
  setupBirdAnimations,
} from "./EagleScrollScene";
import "./AirvoirDragonScene.css";

/**
 * Airvoir bird tuning — edit these values, then hard-refresh `/dark7-v45`.
 * File: components/dark7-v45/AirvoirDragonScene.js
 *
 * Texture matches the hero eagle (EagleScrollScene applyBirdMaterial).
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.98;
    renderer.setClearColor(0x000000, 0);

    // Same Noomo glass lighting language as hero EagleScrollScene (backgroundOnly)
    scene.add(new THREE.AmbientLight(0xa8dcc0, 1.0));

    const keyLight = new THREE.DirectionalLight(0xe8f8f0, 2.1);
    keyLight.position.set(2.2, 6, 4.5);
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x70ffb0, 0x042010, 1.35);
    scene.add(fillLight);

    const jadeLight = new THREE.PointLight(0x00ff78, 4.2, 56);
    jadeLight.position.set(4.2, 2.2, 4.2);
    scene.add(jadeLight);

    const rimLight = new THREE.PointLight(0xb8ffff, 2.8, 52);
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

    const bottomLight = new THREE.DirectionalLight(0x78e8b0, 0.95);
    bottomLight.position.set(0.4, -7, 2.5);
    scene.add(bottomLight);

    const limeAccent = new THREE.PointLight(0x40ff80, 2.8, 48);
    limeAccent.position.set(0.2, 3.2, 2.2);
    scene.add(limeAccent);

    const goldAccent = new THREE.PointLight(0xff9a20, 1.8, 38);
    goldAccent.position.set(2.4, -1.4, 4.1);
    scene.add(goldAccent);

    const tealAccent = new THREE.PointLight(0x30f0e0, 2.2, 44);
    tealAccent.position.set(-4.2, 0.4, 3.2);
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

    function updateFeatherUniforms() {
      if (!dragonObject) return;
      const origin = new THREE.Vector3();
      dragonObject.getWorldPosition(origin);
      dragonMaterials.forEach((mat) => {
        const uniforms = mat.userData.featherUniforms;
        if (uniforms?.uBirdOrigin) uniforms.uBirdOrigin.value.copy(origin);
      });
    }

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

      updateFeatherUniforms();

      scrollActions.forEach(({ action, duration }) => {
        action.time = t * duration;
      });

      if (wingAction) {
        wingAction.timeScale = THREE.MathUtils.lerp(0.5, 1.1, t);
      }

      const bloom = Math.pow(t, 0.75);
      renderer.toneMappingExposure = THREE.MathUtils.lerp(0.96, 1.08, bloom);
      keyLight.intensity = THREE.MathUtils.lerp(2.0, 2.6, bloom);
      jadeLight.intensity = THREE.MathUtils.lerp(4.2, 5.0, bloom);
      rimLight.intensity = THREE.MathUtils.lerp(2.8, 4.2, bloom);
      limeAccent.intensity = THREE.MathUtils.lerp(2.8, 4.4, bloom);
      goldAccent.intensity = THREE.MathUtils.lerp(1.6, 2.8, bloom);
      tealAccent.intensity = THREE.MathUtils.lerp(2.2, 3.6, bloom);

      applyHeroBirdMaterialLook(dragonMaterials, bloom);

      const saturate = THREE.MathUtils.lerp(1.12, 1.2, bloom);
      const brightness = THREE.MathUtils.lerp(0.94, 0.98, bloom);
      const contrast = THREE.MathUtils.lerp(1.12, 1.18, bloom);
      canvas.style.filter = `saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`;
    }

    gltfLoader.load(
      BIRD_MESH,
      (gltf) => {
        if (disposed) return;

        dragonObject = gltf.scene;
        scene.add(dragonObject);
        dragonObject.updateWorldMatrix(true, true);
        // Same material path as hero (backgroundOnly = true)
        dragonMaterials = applyBirdMaterial(dragonObject, { featherNormal }, true);
        applyHeroBirdMaterialLook(dragonMaterials, 0);

        if (gltf.animations.length) {
          dragonMixer = new THREE.AnimationMixer(dragonObject);
          const animationSetup = setupBirdAnimations(dragonMixer, gltf.animations);
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
      dragonMaterials.forEach((m) => m.dispose?.());
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
