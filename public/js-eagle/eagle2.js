import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EagleHero.css";

gsap.registerPlugin(ScrollTrigger);

export default function EagleHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let frameId;
    let activeCamera;
    let sceneModel;
    let birdMixer;
    let cameraMixer;
    let birdDuration = 0;
    let cameraDuration = 0;
    const crystals = [];

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const fallbackCamera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );

    fallbackCamera.position.set(0, 0, 5);
    activeCamera = fallbackCamera;

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

    const loader = new GLTFLoader();

    loader.load("/models/v20.glb", (gltf) => {
      sceneModel = gltf.scene;
      scene.add(sceneModel);

      sceneModel.traverse((child) => {
        if (child.isMesh) {
          child.frustumCulled = false;

          if (child.material) {
            child.material.envMapIntensity = 2;
          }
        }
      });

      if (gltf.animations.length) {
        birdMixer = new THREE.AnimationMixer(sceneModel);

        gltf.animations.forEach((clip) => {
          const action = birdMixer.clipAction(clip);
          action.play();
          action.paused = true;
          birdDuration = Math.max(birdDuration, clip.duration);
        });
      }

      loadCamera();
    });

    function loadCamera() {
      const isMobile = window.innerWidth < 768;
      const cameraPath = isMobile ? "/models/cam-mob.glb" : "/models/cam.glb";

      loader.load(cameraPath, (gltf) => {
        scene.add(gltf.scene);

        const glbCamera = gltf.scene.getObjectByProperty("isCamera", true);

        if (glbCamera) {
          activeCamera = glbCamera;
          activeCamera.aspect = window.innerWidth / window.innerHeight;
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

        loadFeather();
        loadCrystals();
        createScrollTimeline();
      });
    }

    function loadFeather() {
      loader.load("/models/feather.glb", (gltf) => {
        const feather = gltf.scene;
        feather.name = "feather";
        feather.scale.set(1, 1, 1);
        scene.add(feather);
      });
    }

    function loadCrystals() {
      const files = [
        "crystal0.glb",
        "crystal1.glb",
        "crystal2.glb",
        "crystal3.glb",
        "crystal4.glb",
        "crystal5.glb",
        "crystal6.glb",
      ];

      files.forEach((file, index) => {
        loader.load(`/models/${file}`, (gltf) => {
          const crystal = gltf.scene;

          crystal.name = `crystal-${index}`;
          crystal.visible = true;

          crystal.traverse((child) => {
            if (child.isMesh) {
              child.frustumCulled = false;

              if (child.material) {
                child.material.transparent = true;
                child.material.opacity = 0.8;
                child.material.roughness = 0.03;
                child.material.metalness = 0.15;
                child.material.envMapIntensity = 3;
              }
            }
          });

          crystal.position.set(
            index % 2 === 0 ? -2.2 : 2.2,
            -5 - index * 0.6,
            -1
          );

          crystal.scale.set(0.6, 0.6, 0.6);

          scene.add(crystal);
          crystals.push(crystal);
        });
      });
    }

    function createScrollTimeline() {
      const state = { progress: 0 };

      gsap.to(state, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".eagle-hero",
          start: "top top",
          end: "+=4500",
          scrub: true,
          pin: true,
        },
        onUpdate: () => {
          const p = state.progress;

          if (cameraMixer && cameraDuration) {
            cameraMixer.setTime(p * cameraDuration);
          }

          if (birdMixer && birdDuration) {
            birdMixer.setTime(p * birdDuration);
          }

          crystals.forEach((crystal, index) => {
            crystal.position.y = THREE.MathUtils.lerp(
              -5 - index * 0.6,
              0.8 - index * 0.15,
              Math.max(0, Math.min(1, (p - 0.55) / 0.35))
            );
          });
        },
      });
    }

    function animate() {
      frameId = requestAnimationFrame(animate);

      crystals.forEach((crystal, index) => {
        crystal.rotation.y += 0.003 + index * 0.0004;
        crystal.rotation.x += 0.001;
      });

      renderer.render(scene, activeCamera);
    }

    animate();

    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      if (activeCamera) {
        activeCamera.aspect = window.innerWidth / window.innerHeight;
        activeCamera.updateProjectionMatrix();
      }
    }

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      renderer.dispose();
    };
  }, []);

  return (
    <section className="eagle-hero">
      <canvas ref={canvasRef} className="eagle-canvas" />

      <div className="hero-content">
        <h2>
          The power <br />
          <em>of</em> digital
        </h2>
        <h1>storytelling</h1>
      </div>
    </section>
  );
}