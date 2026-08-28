"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EP4, HERO_TIMELINE_FRACTION } from "./assets";
import { applyNoomoBirdMaterials } from "./noomoGlassMaterial";
import "./EagleProject4Hero.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EagleProject4Hero() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    const heroEl = heroRef.current;
    const canvas = canvasRef.current;
    if (!heroEl || !canvas) return;

    let frameId = 0;
    let disposed = false;
    let activeCamera = null;
    let birdRoot = null;
    let birdMixer = null;
    let cameraMixer = null;
    let birdDuration = 0;
    let cameraDuration = 0;
    let scrollProgress = 0;
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const texturesToDispose = [];
    let envMap = null;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const fallbackCamera = new THREE.PerspectiveCamera(25, 1, 0.1, 500);
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
    renderer.toneMappingExposure = 1.05;

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(2.5, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8fff4, 0.65);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    const tealAccent = new THREE.PointLight(0x12c48a, 2.2, 48);
    tealAccent.position.set(3, 1.5, 3);
    scene.add(tealAccent);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(EP4.DRACO);

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const textureLoader = new THREE.TextureLoader();
    const normalMap = textureLoader.load(EP4.NORMAL);
    normalMap.colorSpace = THREE.NoColorSpace;
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    texturesToDispose.push(normalMap);

    const colorsMap = textureLoader.load(EP4.COLORS_MAP);
    colorsMap.colorSpace = THREE.SRGBColorSpace;
    texturesToDispose.push(colorsMap);

    new RGBELoader().load(EP4.HDR, (hdr) => {
      if (disposed) {
        hdr.dispose();
        return;
      }
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = hdr;
      envMap = hdr;
      texturesToDispose.push(hdr);
      applyMaterialsIfBirdReady();
    });

    function resize() {
      const width = Math.max(heroEl.clientWidth, 1);
      const height = Math.max(heroEl.clientHeight, 1);
      renderer.setSize(width, height, false);
      if (activeCamera?.isPerspectiveCamera) {
        activeCamera.aspect = width / height;
        activeCamera.updateProjectionMatrix();
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(heroEl);
    resize();

    function timelineTime() {
      return scrollProgress * HERO_TIMELINE_FRACTION * Math.max(cameraDuration, birdDuration, 1);
    }

    function syncMixers() {
      const t = timelineTime();
      if (cameraMixer && cameraDuration) cameraMixer.setTime(t);
      if (birdMixer && birdDuration) birdMixer.setTime(t);
    }

    function applyBirdParallax() {
      if (!birdRoot) return;
      birdRoot.rotation.y = mouse.x * 0.12;
      birdRoot.rotation.x = -mouse.y * 0.06;
    }

    function applyMaterialsIfBirdReady() {
      if (!birdRoot || !envMap) return;
      applyNoomoBirdMaterials(birdRoot, { normalMap, colorsMap, envMap });
    }

    function loadCameraTimeline() {
      const isMobile = window.innerWidth < 768;
      const cameraPath = isMobile ? EP4.CAMERA_MOBILE : EP4.CAMERA_DESKTOP;

      gltfLoader.load(cameraPath, (gltf) => {
        if (disposed) return;

        scene.add(gltf.scene);

        const glbCamera = gltf.scene.getObjectByProperty("isCamera", true);
        if (glbCamera) {
          activeCamera = glbCamera;
          activeCamera.aspect = heroEl.clientWidth / heroEl.clientHeight;
          activeCamera.updateProjectionMatrix();
        }

        if (gltf.animations.length) {
          cameraMixer = new THREE.AnimationMixer(gltf.scene);
          gltf.animations.forEach((clip) => {
            const action = cameraMixer.clipAction(clip);
            action.play();
            action.paused = true;
            cameraDuration = Math.max(cameraDuration, clip.duration);
          });
        }

        syncMixers();
        createScrollTimeline();
      });
    }

    function setupBirdAnimations(gltf, root) {
      if (!gltf.animations.length) return;

      birdMixer = new THREE.AnimationMixer(root);
      gltf.animations.forEach((clip) => {
        const action = birdMixer.clipAction(clip);
        action.play();
        action.paused = true;
        birdDuration = Math.max(birdDuration, clip.duration);
      });
    }

    gltfLoader.load(EP4.BIRD, (gltf) => {
      if (disposed) return;

      // Noomo uses gltf.scene.children[0] as Phoenix rig root
      birdRoot = gltf.scene.children[0] ?? gltf.scene;
      scene.add(gltf.scene);

      applyMaterialsIfBirdReady();
      setupBirdAnimations(gltf, birdRoot);
      loadCameraTimeline();
    });

    function createScrollTimeline() {
      const state = { progress: 0 };

      gsap.to(state, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: heroEl,
          start: "top top",
          end: "+=500",
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
          id: "ep4-hero-pin",
        },
        onUpdate: () => {
          scrollProgress = state.progress;
          syncMixers();
        },
      });

      scrollProgress = 0;
      syncMixers();
    }

    const onMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    canvas.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;
      applyBirdParallax();
      renderer.render(scene, activeCamera);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      canvas.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      ScrollTrigger.getById("ep4-hero-pin")?.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === heroEl) t.kill();
      });
      dracoLoader.dispose();
      renderer.dispose();
      texturesToDispose.forEach((t) => t.dispose?.());
    };
  }, []);

  return (
    <div className="ep4-page">
      <div className="ep4-badge">eagle-project-4 · native v20.glb</div>

      <section ref={heroRef} className="ep4-hero">
        <canvas ref={canvasRef} className="ep4-canvas" aria-hidden="true" />

        <div className="ep4-hero-copy">
          <h2>
            The power <em>of</em> digital
          </h2>
          <h1>storytelling</h1>
        </div>
      </section>

      <section className="ep4-spacer">
        <h3>Reverse-engineered hero (no iframe)</h3>
        <p>
          This page loads Noomo&apos;s <code>v20.glb</code> bird mesh and{" "}
          <code>timelines/cam.glb</code> camera path directly with Three.js — not their minified Nuxt bundle.
        </p>
        <p>
          Glass look ports default Noomo parameters (<code>#12c48a</code> glass color,{" "}
          <code>icen.jpg</code> normal, <code>LDR_RG01_0.png</code> iridescence, HDR env). Full dual-pass
          GlassFront/GlassBack dispersion is simplified to MeshPhysicalMaterial + shader mix.
        </p>
        <p>Scroll the hero to scrub the opening camera + wing animation beat.</p>
      </section>
    </div>
  );
}
