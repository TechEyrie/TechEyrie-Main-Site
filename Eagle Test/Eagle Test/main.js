import * as THREE from "https://esm.sh/three@0.179.1";
import { GLTFLoader } from "https://esm.sh/three@0.179.1/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "https://esm.sh/three@0.179.1/examples/jsm/loaders/RGBELoader.js";
import { DRACOLoader } from "https://esm.sh/three@0.179.1/examples/jsm/loaders/DRACOLoader.js";
import gsap from "https://esm.sh/gsap@3.13.0";
import { ScrollTrigger } from "https://esm.sh/gsap@3.13.0/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector("#eagle-canvas");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);

camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

scene.add(new THREE.AmbientLight(0xffffff, 2));

const keyLight = new THREE.DirectionalLight(0xffffff, 4);
keyLight.position.set(3, 5, 6);
scene.add(keyLight);

// const blueLight = new THREE.PointLight(0xbfd8ff, 5, 50);
// blueLight.position.set(4, 2, 4);
// scene.add(blueLight);

const greenLight = new THREE.PointLight(0x00c878, 6, 60);
greenLight.position.set(4, 2, 4);
scene.add(greenLight);

const pinkLight = new THREE.PointLight(0xff66cc, 5, 60);
pinkLight.position.set(-4, -2, 4);
scene.add(pinkLight);

const blueShadow = new THREE.PointLight(0x3366ff, 3, 80);
blueShadow.position.set(-4, 1, 5);
scene.add(blueShadow);

greenLight.intensity = 9;
pinkLight.intensity = 8;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
);

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

let birdObject = null;
let birdMixer = null;
let birdDuration = 0;

let cameraMixer = null;
let cameraDuration = 0;
let cameraTimelineRoot = null;
let cameraTimelineCameraObject = null;
let cameraTimelineTargetObject = null;
let pointerInfluenceObject = null;

let idleTime = 0;

new RGBELoader().load("/public/models/wooden_studio_19_1k.hdr", (hdr) => {
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = hdr;
});

const textureLoader = new THREE.TextureLoader();

const iceMap = textureLoader.load("/public/images/ice.jpg");
const iceNormal = textureLoader.load("/public/images/icen.jpg");
const iceRoughness = textureLoader.load("/public/images/iced.jpg");

[iceMap, iceNormal, iceRoughness].forEach((tex) => {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
});

loader.load("/public/models/v20.glb", (gltf) => {
  birdObject = gltf.scene;
  scene.add(birdObject);

  birdObject.traverse((child) => {
    if (child.material) {
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
      }
  });

  if (gltf.animations.length) {
    birdMixer = new THREE.AnimationMixer(birdObject);

    gltf.animations.forEach((clip) => {
      const action = birdMixer.clipAction(clip);
      action.play();
      action.paused = true;
      birdDuration = Math.max(birdDuration, clip.duration);
    });
  }

  loadCameraTimeline();
});

function loadCameraTimeline() {
    camera.position.set(-0.35, 0.85, 1.15);
    camera.lookAt(0.15, 0.15, 0);
  
    createScrollAnimation();
  }


  function createScrollAnimation() {
    const state = { progress: 0 };
  
    gsap.to(state, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".eagle-hero",
        start: "top top",
        end: "+=2000", // two-screen feel
        scrub: true,
        pin: true,
      },
      onUpdate: () => {
        const p = state.progress;
  
        // Keep camera almost fixed so the current opening look stays nice
        camera.position.x = THREE.MathUtils.lerp(-0.3, -0.15, p);
        camera.position.y = THREE.MathUtils.lerp(0.5, 0.35, p);
        camera.position.z = THREE.MathUtils.lerp(-1.25, -1.8, p);
  
        camera.lookAt(0.15, 0.15, 0);
  
        if (birdObject) {
          // Scroll movement: zoom bigger + move up/right/out
          birdObject.position.x = THREE.MathUtils.lerp(-0.5, -6, p);
          birdObject.position.y = THREE.MathUtils.lerp(0.05, 3.5, p);
          birdObject.position.z = THREE.MathUtils.lerp(0, 0.8, p);
  
          // This makes the feather zoom larger before leaving
          const scale = THREE.MathUtils.lerp(1, 2.8, p);
          birdObject.scale.setScalar(scale);
  
          // Optional slight turn while leaving
          birdObject.rotation.z = THREE.MathUtils.lerp(0, -0.25, p);
        }
  
        if (birdMixer && birdDuration) {
          birdMixer.setTime(p * birdDuration);
        }
      },
    });
  }

//   function createScrollAnimation() {
//     const state = { progress: 0 };
  
//     gsap.to(state, {
//       progress: 1,
//       ease: "none",
//       scrollTrigger: {
//         trigger: ".eagle-hero",
//         start: "top top",
//         end: "+=2000",
//         scrub: true,
//         pin: true,
//       },
//       onUpdate: () => {
//         const p = state.progress;
//         const fly = Math.max(0, (p - 0.35) / 0.65);
  
//         // Camera starts close to left/back feathers, then pulls out
//         camera.position.x = THREE.MathUtils.lerp(-0.3, 0.4, p);
//         camera.position.y = THREE.MathUtils.lerp(0.50, -0.2, p);
//         camera.position.z = THREE.MathUtils.lerp(-1.25, 10, p);
  
//         camera.lookAt(
//           THREE.MathUtils.lerp(0.15, 0, p),
//           THREE.MathUtils.lerp(0.15, 0.1, p),
//           0
//         );
  
//         if (birdObject) {
//           birdObject.position.x = THREE.MathUtils.lerp(-0.5, 3.8, fly);
//           birdObject.position.y = THREE.MathUtils.lerp(0.05, 0.2, fly);
//           birdObject.position.z = THREE.MathUtils.lerp(0, -3.8, fly);
  
//           const scale = THREE.MathUtils.lerp(1, 0.02, fly);
//           birdObject.scale.setScalar(scale);
//         }
  
//         if (birdMixer && birdDuration) {
//           birdMixer.setTime(p * birdDuration);
//         }
//       },
//     });
//   }

function animate() {
  requestAnimationFrame(animate);

  idleTime += 0.01;

 

//   if (birdObject) {
//     birdObject.rotation.x += Math.sin(idleTime * 1.2) * 0.00008;
//     birdObject.rotation.y += Math.sin(idleTime * 0.8) * 0.0001;
//     birdObject.position.y += Math.sin(idleTime * 1.1) * 0.00012;
//   }

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});