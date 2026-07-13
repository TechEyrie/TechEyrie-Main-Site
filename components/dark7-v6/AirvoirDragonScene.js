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
  WING_PALETTE,
  applyDragonMaterial,
  setupDragonAnimations,
  updateDragonFeatherUniforms,
} from "./v20DragonMaterial";
import "./AirvoirDragonScene.css";

const FLIGHT_START = {
  x: -5.2,
  y: -0.05,
  z: 0,
  scale: 0.52,
  rotY: Math.PI * 0.5,
  rotZ: -0.08,
  rotX: 0.04,
};

const FLIGHT_END = {
  x: 5.2,
  y: 0.02,
  z: 0,
  scale: 0.72,
  rotY: Math.PI * 0.5,
  rotZ: 0.06,
  rotX: -0.02,
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
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0.15, 7.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x000000, 0);

    scene.add(new THREE.AmbientLight(0xb8dcc8, 1.4));

    const keyLight = new THREE.DirectionalLight(0xd8f0e4, 2.8);
    keyLight.position.set(2.2, 6, 4.5);
    scene.add(keyLight);

    const greenLight = new THREE.PointLight(0x00c878, 6, 60);
    greenLight.position.set(4, 2, 4);
    scene.add(greenLight);

    const fillLight = new THREE.HemisphereLight(0x3a8060, 0x021008, 0.95);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x88c8a0, 2.2, 48);
    rimLight.position.set(5.8, 2.4, 4.2);
    scene.add(rimLight);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(V20_DRACO_DECODER_PATH);

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const featherNormal = new THREE.TextureLoader().load(V20_FEATHER_NORMAL);
    texturesToDispose.push(featherNormal);
    featherNormal.wrapS = THREE.RepeatWrapping;
    featherNormal.wrapT = THREE.RepeatWrapping;
    featherNormal.repeat.set(2.4, 2.4);

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
      renderer.toneMappingExposure = THREE.MathUtils.lerp(1.0, 1.16, bloom);
      keyLight.intensity = THREE.MathUtils.lerp(2.4, 3.2, bloom);

      dragonMaterials.forEach((mat, index) => {
        const swatch = mat.userData.swatch ?? WING_PALETTE[index % WING_PALETTE.length];
        const baseHue = mat.userData.baseHue ?? swatch.hue;
        const hueDrift = bloom * 0.03 * (index % 2 === 0 ? 1 : -1);

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
        mat.emissiveIntensity = THREE.MathUtils.lerp(0.06, 0.2, bloom);

        const featherUniforms = mat.userData.featherUniforms;
        if (featherUniforms) {
          featherUniforms.uIriStrength.value = THREE.MathUtils.lerp(0.3, 0.52, bloom);
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
        dragonMaterials = applyDragonMaterial(dragonObject, { featherNormal }, false);

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
