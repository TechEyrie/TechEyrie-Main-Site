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
    let bird = null;
    let feather = null;
    let crystals = [];
    let frameId;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );

    // Starts very close to the bird/feathers
    camera.position.set(0, 0.25, 1.2);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene.add(new THREE.AmbientLight(0xffffff, 2.2));

    const light1 = new THREE.DirectionalLight(0xffffff, 3);
    light1.position.set(4, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xbfd8ff, 5, 40);
    light2.position.set(4, 2, 4);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xffc8ff, 4, 40);
    light3.position.set(-4, -2, 3);
    scene.add(light3);

    const loader = new GLTFLoader();

    loader.load("/models/v20.glb", (gltf) => {
      bird = gltf.scene;

      bird.scale.set(2.5, 2.5, 2.5);
      bird.position.set(0, -0.35, 0);
      bird.rotation.set(0.15, -0.4, 0);

      scene.add(bird);
      setupScroll();
    });

    loader.load("/models/feather.glb", (gltf) => {
      feather = gltf.scene;

      feather.scale.set(1.2, 1.2, 1.2);
      feather.position.set(-1.2, 0.2, 0.6);
      feather.rotation.set(0.2, 0.6, -0.3);

      scene.add(feather);
    });

    const crystalFiles = [
      "crystal0.glb",
      "crystal1.glb",
      "crystal2.glb",
      "crystal3.glb",
      "crystal4.glb",
      "crystal5.glb",
      "crystal6.glb",
    ];

    crystalFiles.forEach((file, index) => {
      loader.load(`/models/${file}`, (gltf) => {
        const crystal = gltf.scene;

        crystal.scale.set(0.55, 0.55, 0.55);

        crystal.position.set(
          index % 2 === 0 ? -2.6 : 2.6,
          -5 - index * 0.65,
          -1.2
        );

        crystal.rotation.set(
          Math.random() * 0.5,
          Math.random() * 1,
          Math.random() * 0.5
        );

        crystal.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            child.material.opacity = 0.78;
            child.material.roughness = 0.06;
            child.material.metalness = 0.15;
            child.material.envMapIntensity = 2.5;
          }
        });

        scene.add(crystal);
        crystals.push(crystal);
      });
    });

    function setupScroll() {
      if (!bird) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".eagle-hero",
          start: "top top",
          end: "+=4200",
          scrub: true,
          pin: true,
        },
      });

      // Zoom out from feathers
      tl.to(camera.position, {
        z: 6,
        y: 0.6,
        duration: 1.2,
        ease: "none",
      });

      tl.to(
        bird.rotation,
        {
          x: 0,
          y: 0.25,
          z: 0,
          duration: 1.2,
          ease: "none",
        },
        "<"
      );

      // Bird flies away once
      tl.to(bird.position, {
        x: 5.5,
        y: 3.2,
        z: -5,
        duration: 1.4,
        ease: "power1.in",
      });

      tl.to(
        bird.rotation,
        {
          x: -0.45,
          y: 1.25,
          z: -0.25,
          duration: 1.4,
          ease: "none",
        },
        "<"
      );

      tl.to(
        bird.scale,
        {
          x: 0.25,
          y: 0.25,
          z: 0.25,
          duration: 1.4,
          ease: "none",
        },
        "<"
      );

      // Hide feather after bird reveal
      if (feather) {
        tl.to(
          feather.scale,
          {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: "none",
          },
          0.7
        );
      }

      // Bring crystals upward after bird leaves
      crystals.forEach((crystal, index) => {
        tl.to(
          crystal.position,
          {
            y: 0.8 - index * 0.15,
            duration: 1,
            ease: "none",
          },
          2.2 + index * 0.08
        );
      });
    }

    function animate() {
      frameId = requestAnimationFrame(animate);

      crystals.forEach((crystal, index) => {
        crystal.rotation.y += 0.004 + index * 0.0004;
        crystal.rotation.x += 0.001;
      });

      if (feather) {
        feather.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    }

    animate();

    function resize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
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