"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DRACO_DECODER_PATH = "/draco/gltf/";
const BIRD_MODEL_PATH = "/models/v20.glb";

function getCameraModelPath(width) {
  return width < 768 ? "/models/cam-mob.glb" : "/models/cam.glb";
}

function prepareBirdMeshes(object) {
  object.traverse((child) => {
    if (!child.isMesh) return;
    child.frustumCulled = false;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;
      if ("envMapIntensity" in material) material.envMapIntensity = 2;
      material.needsUpdate = true;
    });
  });
}

function setupPausedClips(mixer, clips) {
  let maxDuration = 0;
  clips.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.play();
    action.paused = true;
    maxDuration = Math.max(maxDuration, clip.duration);
  });
  return maxDuration;
}

export default function FeatherThreeHeroBackground({ sectionRef }) {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const section = sectionRef?.current;
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!section || !mount || !canvas) return;

    let frameId = 0;
    let scrollTween = null;
    let birdMixer = null;
    let cameraMixer = null;
    let birdDuration = 0;
    let cameraDuration = 0;
    let activeCamera = null;
    let fallbackCamera = null;
    let birdModel = null;
    let cameraRig = null;
    let disposed = false;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x162d24);

    fallbackCamera = new THREE.PerspectiveCamera(35, 1, 0.1, 500);
    fallbackCamera.position.set(0, 0, 5);
    activeCamera = fallbackCamera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    scene.add(new THREE.AmbientLight(0xffffff, 2.2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(3, 5, 6);
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0xbdd8ff, 5, 60);
    blueLight.position.set(4, 2, 4);
    scene.add(blueLight);

    const pinkLight = new THREE.PointLight(0xffc7f4, 5, 60);
    pinkLight.position.set(-4, -2, 4);
    scene.add(pinkLight);

    const accentLight = new THREE.PointLight(0x74f5a1, 2.5, 40);
    accentLight.position.set(2, 3, 5);
    scene.add(accentLight);

    const resize = () => {
      const w = Math.max(mount.clientWidth, 1);
      const h = Math.max(mount.clientHeight, 1);
      renderer.setSize(w, h, false);

      if (activeCamera?.isPerspectiveCamera) {
        activeCamera.aspect = w / h;
        activeCamera.updateProjectionMatrix();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(mount);
    resize();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      BIRD_MODEL_PATH,
      (gltf) => {
        if (disposed) return;

        birdModel = gltf.scene;
        prepareBirdMeshes(birdModel);
        scene.add(birdModel);

        if (gltf.animations?.length) {
          birdMixer = new THREE.AnimationMixer(birdModel);
          birdDuration = setupPausedClips(birdMixer, gltf.animations);
        }

        loadCameraRig();
      },
      undefined,
      (error) => {
        console.error("[FeatherThreeHero] Failed to load v20.glb:", error);
      },
    );

    function loadCameraRig() {
      if (disposed) return;

      const cameraPath = getCameraModelPath(mount.clientWidth || window.innerWidth);

      gltfLoader.load(
        cameraPath,
        (gltf) => {
          if (disposed) return;

          cameraRig = gltf.scene;
          scene.add(cameraRig);

          const glbCamera = gltf.scene.getObjectByProperty("isCamera", true);
          if (glbCamera) {
            activeCamera = glbCamera;
            if (activeCamera.isPerspectiveCamera) {
              activeCamera.aspect = Math.max(mount.clientWidth, 1) / Math.max(mount.clientHeight, 1);
              activeCamera.updateProjectionMatrix();
            }
          }

          if (gltf.animations?.length) {
            cameraMixer = new THREE.AnimationMixer(gltf.scene);
            cameraDuration = setupPausedClips(cameraMixer, gltf.animations);
          }

          createScrollTimeline();
          ScrollTrigger.refresh();
        },
        undefined,
        (error) => {
          console.error("[FeatherThreeHero] Failed to load camera GLB:", error);
          createScrollTimeline();
          ScrollTrigger.refresh();
        },
      );
    }

    function createScrollTimeline() {
      if (disposed) return;

      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();

      const state = { progress: 0 };

      scrollTween = gsap.to(state, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=3800",
          scrub: 1,
        },
        onUpdate: () => {
          const p = state.progress;

          if (cameraMixer && cameraDuration > 0) {
            cameraMixer.setTime(p * cameraDuration);
          }

          if (birdMixer && birdDuration > 0) {
            birdMixer.setTime(p * birdDuration);
          }
        },
      });

      if (cameraMixer && cameraDuration > 0) cameraMixer.setTime(0);
      if (birdMixer && birdDuration > 0) birdMixer.setTime(0);
    }

    const renderLoop = () => {
      frameId = requestAnimationFrame(renderLoop);
      renderer.render(scene, activeCamera);
    };
    renderLoop();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();
      dracoLoader.dispose();

      birdModel?.traverse((child) => {
        if (!child.isMesh) return;
        child.geometry?.dispose();
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => material?.dispose());
      });

      cameraRig?.traverse((child) => {
        if (!child.isMesh) return;
        child.geometry?.dispose();
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => material?.dispose());
      });

      renderer.dispose();
    };
  }, [sectionRef]);

  return (
    <div ref={mountRef} className="feather-three-mount" aria-hidden>
      <canvas ref={canvasRef} className="feather-three-canvas" />
      <div className="feather-three-scrim" />
    </div>
  );
}
