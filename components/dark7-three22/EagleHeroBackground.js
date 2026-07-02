"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import "./EagleHeroBackground.css";

const BIRD_MESH = "/models/v20.glb";
const HDR_ENV = "/models/wooden_studio_19_1k.hdr";
const ICE_NORMAL = "/images/icen.jpg";
const DRACO_DECODER_PATH = "/draco/gltf/";

function setupBirdAnimations(mixer, clips) {
  const wingClip =
    clips.find((clip) => /Float_WingPulse|WingPulse/i.test(clip.name)) ||
    clips.find((clip) => /wing|float/i.test(clip.name)) ||
    null;

  const scrollActions = [];

  clips.forEach((clip) => {
    if (clip === wingClip) return;

    const action = mixer.clipAction(clip);
    action.play();
    action.paused = true;
    scrollActions.push({ action, duration: clip.duration || 20 });
  });

  if (wingClip) {
    const wingAction = mixer.clipAction(wingClip);
    wingAction.setLoop(THREE.LoopRepeat, Infinity);
    wingAction.timeScale = 0.45;
    wingAction.play();
  }

  return { scrollActions };
}

function applyBirdMaterial(bird, iceNormal) {
  bird.traverse((child) => {
    if (!child.isMesh) return;
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

export default function EagleHeroBackground() {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    const section = stageRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let frameId = 0;
    let birdObject = null;
    let birdMixer = null;
    let scrollActions = [];
    let disposed = false;

    const baseBird = {
      x: -0.5,
      y: 0.05,
      z: 0,
      scale: 1,
      rotZ: 0,
    };
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, hover: false };
    const clock = new THREE.Clock();
    const texturesToDispose = [];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(25, 1, 0.1, 500);
    camera.position.set(-0.35, 0.85, 1.15);
    camera.lookAt(0.15, 0.15, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    scene.add(new THREE.AmbientLight(0xffffff, 2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 4);
    keyLight.position.set(3, 5, 6);
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

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const iceNormal = new THREE.TextureLoader().load(ICE_NORMAL);
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

    function resize() {
      const width = Math.max(section.clientWidth, 1);
      const height = Math.max(section.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);
    resize();

    canvas.style.pointerEvents = "auto";

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

    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("mousemove", onMouseMove);

    function applyBirdTransform() {
      if (!birdObject) return;

      const hoverAmount = mouse.hover ? 1 : 0;

      birdObject.position.set(
        baseBird.x + mouse.x * 0.14 * hoverAmount,
        baseBird.y + mouse.y * 0.1 * hoverAmount,
        baseBird.z + mouse.x * 0.04 * hoverAmount,
      );
      birdObject.scale.setScalar(baseBird.scale);
      birdObject.rotation.z = baseBird.rotZ + mouse.x * 0.04 * hoverAmount;
      birdObject.rotation.y = mouse.x * 0.16 * hoverAmount;
      birdObject.rotation.x = -mouse.y * 0.1 * hoverAmount;
    }

    gltfLoader.load(
      BIRD_MESH,
      (gltf) => {
        if (disposed) return;

        birdObject = gltf.scene;
        applyBirdMaterial(birdObject, iceNormal);
        scene.add(birdObject);
        applyBirdTransform();

        if (gltf.animations.length) {
          birdMixer = new THREE.AnimationMixer(birdObject);
          const animationSetup = setupBirdAnimations(birdMixer, gltf.animations);
          scrollActions = animationSetup.scrollActions;
        }
      },
      undefined,
      (error) => console.error("[EagleHeroBackground] v20.glb failed:", error),
    );

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      mouse.x += (mouse.targetX - mouse.x) * 0.055;
      mouse.y += (mouse.targetY - mouse.y) * 0.055;

      if (birdMixer) {
        scrollActions.forEach(({ action, duration }) => {
          action.time = 0;
        });
        birdMixer.update(delta);
      }

      applyBirdTransform();

      if (birdObject) {
        birdObject.position.y += Math.sin(elapsed * 1.05) * 0.012;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      texturesToDispose.forEach((texture) => texture.dispose?.());
      dracoLoader.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={stageRef} className="eagle-hero-stage" aria-hidden>
      <div className="eagle-hero-gradient" />
      <canvas ref={canvasRef} className="eagle-hero-canvas" />
    </div>
  );
}
