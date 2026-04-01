// components/NewServicesSection.jsx
"use client";

import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

const SERVICES = [
  {
    id: "automation",
    title: "Business Automation & AI Enablement",
    titleLine1: "Business Automation &",
    titleLine2: "AI Enablement",
    description: "Transforming critical business process through AI-enabled workflows and intelligent agents by delivering efficient work and reducing manual working so your team can focus on creativity, growth and strategy.",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: "data",
    title: "Data & Decision Intelligence",
    titleLine1: "Data & Decision",
    titleLine2: "Intelligence",
    description: "We build unified data and systems that bring everything into focus. No delays or uncertainty, just real-time Visibility into risk and opportunity, giving the leadership the confidence to lead. Every system transforms raw data into insights so your business doesn't just react, it predicts.",
    imageUrl: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: "platforms",
    title: "Custom Digital Platforms",
    titleLine1: "Custom Digital Platforms",
    titleLine2: null,
    description: "Every platform is tailored to your business aligned with workflow, data and long-term visions not by generic templates. Resulting in a foundation of robust, evolved and intelligent elevating your business with clarity, precision and control.",
    imageUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Slide Geometry
class SlideGeometry extends THREE.BufferGeometry {
  constructor(width, height, widthSegments, heightSegments) {
    super();
    
    const segmentsX = widthSegments;
    const segmentsY = heightSegments;
    
    const positions = [];
    const uvs = [];
    const indices = [];
    
    const gridX = segmentsX + 1;
    const gridY = segmentsY + 1;
    const segmentWidth = width / segmentsX;
    const segmentHeight = height / segmentsY;
    
    for (let iy = 0; iy < gridY; iy++) {
      const y = iy * segmentHeight - height / 2;
      for (let ix = 0; ix < gridX; ix++) {
        const x = ix * segmentWidth - width / 2;
        positions.push(x, -y, 0);
        uvs.push(ix / segmentsX, 1 - iy / segmentsY);
      }
    }
    
    for (let iy = 0; iy < segmentsY; iy++) {
      for (let ix = 0; ix < segmentsX; ix++) {
        const a = ix + gridX * iy;
        const b = ix + gridX * (iy + 1);
        const c = (ix + 1) + gridX * (iy + 1);
        const d = (ix + 1) + gridX * iy;
        
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }
    
    this.setIndex(indices);
    this.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    this.computeVertexNormals();
    
    this.faceCount = segmentsX * segmentsY * 2;
  }
  
  createAttribute(name, itemSize) {
    const buffer = new Float32Array(this.attributes.position.count * itemSize);
    const attribute = new THREE.BufferAttribute(buffer, itemSize);
    this.setAttribute(name, attribute);
    return attribute;
  }
}

// Slide Class
class Slide extends THREE.Mesh {
  constructor(width, height, animationPhase) {
    const segmentsX = Math.floor(width * 2);
    const segmentsY = Math.floor(height * 2);
    
    const geometry = new SlideGeometry(width, height, segmentsX, segmentsY);
    
    const aAnimation = geometry.createAttribute('aAnimation', 2);
    const aStartPosition = geometry.createAttribute('aStartPosition', 3);
    const aControl0 = geometry.createAttribute('aControl0', 3);
    const aControl1 = geometry.createAttribute('aControl1', 3);
    const aEndPosition = geometry.createAttribute('aEndPosition', 3);

    const minDuration = 1.0;
    const maxDuration = 1.5;
    const maxDelayX = 1.2;
    const maxDelayY = 0.2;
    const stretch = 0.15;

    const totalDuration = maxDuration + maxDelayX + maxDelayY + stretch;

    const positions = geometry.attributes.position.array;
    const count = geometry.attributes.position.count;
    
    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      const duration = minDuration + Math.random() * (maxDuration - minDuration);
      const delayX = ((x + width * 0.5) / width) * maxDelayX;
      const delayY = animationPhase === 'in' 
        ? (Math.abs(y) / (height * 0.5)) * maxDelayY
        : maxDelayY - (Math.abs(y) / (height * 0.5)) * maxDelayY;

      const delay = delayX + delayY + (Math.random() * stretch * duration);

      aAnimation.array[i * 2] = delay;
      aAnimation.array[i * 2 + 1] = duration;

      aStartPosition.array[i * 3] = x;
      aStartPosition.array[i * 3 + 1] = y;
      aStartPosition.array[i * 3 + 2] = z;

      aEndPosition.array[i * 3] = x;
      aEndPosition.array[i * 3 + 1] = y;
      aEndPosition.array[i * 3 + 2] = z;

      const signY = Math.sign(y) || 1;
      
      const c0x = (Math.random() * 0.2 + 0.1) * 40;
      const c0y = signY * (Math.random() * 0.2 + 0.1) * 60;
      const c0z = (Math.random() - 0.5) * 15;
      
      const c1x = (Math.random() * 0.3 + 0.3) * 40;
      const c1y = -signY * (Math.random() * 0.3 + 0.3) * 60;
      const c1z = (Math.random() - 0.5) * 15;

      if (animationPhase === 'in') {
        aControl0.array[i * 3] = x - c0x;
        aControl0.array[i * 3 + 1] = y - c0y;
        aControl0.array[i * 3 + 2] = z + c0z;

        aControl1.array[i * 3] = x - c1x;
        aControl1.array[i * 3 + 1] = y - c1y;
        aControl1.array[i * 3 + 2] = z + c1z;
      } else {
        aControl0.array[i * 3] = x + c0x;
        aControl0.array[i * 3 + 1] = y + c0y;
        aControl0.array[i * 3 + 2] = z + c0z;

        aControl1.array[i * 3] = x + c1x;
        aControl1.array[i * 3 + 1] = y + c1y;
        aControl1.array[i * 3 + 2] = z + c1z;
      }
    }

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: null }
      },
      vertexShader: `
        uniform float uTime;
        attribute vec2 aAnimation;
        attribute vec3 aStartPosition;
        attribute vec3 aControl0;
        attribute vec3 aControl1;
        attribute vec3 aEndPosition;
        
        varying vec2 vUv;
        varying float vProgress;
        
        vec3 cubicBezier(vec3 p0, vec3 c0, vec3 c1, vec3 p1, float t) {
          float tn = 1.0 - t;
          return tn * tn * tn * p0 + 3.0 * tn * tn * t * c0 + 3.0 * tn * t * t * c1 + t * t * t * p1;
        }
        
        float easeInOutCubic(float t) {
          return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
        }
        
        void main() {
          vUv = uv;
          
          float tDelay = aAnimation.x;
          float tDuration = aAnimation.y;
          float tTime = clamp(uTime - tDelay, 0.0, tDuration);
          float tProgress = easeInOutCubic(tTime / tDuration);
          
          vProgress = tProgress;
          
          vec3 newPosition = cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);
          
          ${animationPhase === 'in' 
            ? 'vec3 offset = position * tProgress;' 
            : 'vec3 offset = position * (1.0 - tProgress);'
          }
          
          newPosition += offset;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        varying float vProgress;
        
        void main() {
          vec4 texColor = texture2D(uTexture, vUv);
          ${animationPhase === 'in' 
            ? 'gl_FragColor = vec4(texColor.rgb, texColor.a * vProgress);' 
            : 'gl_FragColor = vec4(texColor.rgb, texColor.a * (1.0 - vProgress));'
          }
        }
      `,
      side: THREE.DoubleSide,
      transparent: true
    });

    super(geometry, material);
    
    this.totalDuration = totalDuration;
    this.frustumCulled = false;
    this.animationPhase = animationPhase;
  }

  setImage(texture) {
    this.material.uniforms.uTexture.value = texture;
    this.material.needsUpdate = true;
  }

  get time() {
    return this.material.uniforms.uTime.value;
  }

  set time(v) {
    this.material.uniforms.uTime.value = v;
  }
}

export default function NewServicesSection({ theme = "light", sharedBackground = false }) {
  const [activeId, setActiveId] = useState(null);
  const sectionRef = useRef(null);
  const titleContainerRef = useRef(null);
  
  const canvasContainerRef = useRef(null);
  const threeRootRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const currentSlideOutRef = useRef(null);
  const currentSlideInRef = useRef(null);
  const texturesRef = useRef({});
  const autoRotateTimeoutRef = useRef(null);
  const currentImageIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  const lightColors = {
    primary: "#013825",
    secondary: "#9E8F72",
    tertiary: "#CEC8B0",
    background: "#F9F7F0",
  };

  const bgStyle =
    theme === "dark"
      ? {
          // Start and end in the shared deep green so section edges
          // visually blend with neighboring sections on the dark page.
          background:
            "linear-gradient(to bottom, #162d24 0%, #162d24 18%, #1a5c6b 45%, #1b4732 70%, #162d24 100%)",
        }
      : { backgroundColor: lightColors.background };

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.015) 2px, rgba(0, 0, 0, 0.015) 4px)
    `,
  };

  // --- ELECTRIC ANIMATION (ONCE PER VIEWPORT ENTRY) ---

  const triggerElectricalAnimation = useCallback(() => {
    const titleLines = document.querySelectorAll(".new-services-title-line");

    const originalColor = theme === "dark" ? "#f3f3f3" : "#111111";
    const electricColor = theme === "dark" ? "#74F5A1" : "#3BC972";
    const brightElectricColor = theme === "dark" ? "#FFFFFF" : "#FFFFFF";

    const tl = gsap.timeline();

    titleLines.forEach((line, index) => {
      tl.to(line, {
        color: brightElectricColor,
        duration: 0.1,
        ease: "power2.out",
      }, index * 0.2)
      .to(line, {
        color: electricColor,
        duration: 0.15,
        ease: "sine.inOut",
      })
      .to(line, {
        color: originalColor,
        duration: 0.25,
        ease: "power2.in",
      });
    });
  }, [theme]);

  // --- INTERSECTION OBSERVER FOR VIEWPORT DETECTION ---
  useEffect(() => {
    const titleContainer = titleContainerRef.current;
    if (!titleContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              triggerElectricalAnimation();
            }, 300);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px",
      }
    );

    observer.observe(titleContainer);

    return () => {
      if (titleContainer) {
        observer.unobserve(titleContainer);
      }
    };
  }, [triggerElectricalAnimation]);

  // --- END ELECTRIC ANIMATION LOGIC ---

  const transitionToImage = useCallback((targetIndex) => {
    if (isTransitioningRef.current || !sceneRef.current || !rendererRef.current) return;
    if (currentImageIndexRef.current === targetIndex) return;

    isTransitioningRef.current = true;

    const scene = sceneRef.current;
    
    const slideWidth = 40;
    const slideHeight = 60;

    const slideOut = new Slide(slideWidth, slideHeight, 'out');
    const currentTexture = texturesRef.current[SERVICES[currentImageIndexRef.current].id];
    if (currentTexture) {
      slideOut.setImage(currentTexture);
    }
    scene.add(slideOut);

    const slideIn = new Slide(slideWidth, slideHeight, 'in');
    const targetTexture = texturesRef.current[SERVICES[targetIndex].id];
    if (targetTexture) {
      slideIn.setImage(targetTexture);
    }
    scene.add(slideIn);

    if (currentSlideOutRef.current) {
      scene.remove(currentSlideOutRef.current);
      currentSlideOutRef.current.geometry.dispose();
      currentSlideOutRef.current.material.dispose();
    }
    if (currentSlideInRef.current) {
      scene.remove(currentSlideInRef.current);
      currentSlideInRef.current.geometry.dispose();
      currentSlideInRef.current.material.dispose();
    }

    currentSlideOutRef.current = slideOut;
    currentSlideInRef.current = slideIn;

    const tl = gsap.timeline({
      onComplete: () => {
        currentImageIndexRef.current = targetIndex;
        isTransitioningRef.current = false;
      }
    });

    tl.fromTo(slideOut, 
      { time: 0 }, 
      { 
        time: slideOut.totalDuration, 
        duration: 3.5, 
        ease: 'power2.inOut' 
      },
      0
    );

    tl.fromTo(slideIn, 
      { time: 0 }, 
      { 
        time: slideIn.totalDuration, 
        duration: 3.5, 
        ease: 'power2.inOut' 
      },
      0
    );
  }, []);

  const startAutoRotate = useCallback(() => {
    if (autoRotateTimeoutRef.current) {
      clearTimeout(autoRotateTimeoutRef.current);
    }

    const rotateToNext = () => {
      if (!isTransitioningRef.current) {
        const nextIndex = (currentImageIndexRef.current + 1) % SERVICES.length;
        transitionToImage(nextIndex);
      }
      autoRotateTimeoutRef.current = setTimeout(rotateToNext, 6000);
    };

    autoRotateTimeoutRef.current = setTimeout(rotateToNext, 6000);
  }, [transitionToImage]);

  const handleCardHover = useCallback((serviceId) => {
    setActiveId(serviceId);
    
    if (autoRotateTimeoutRef.current) {
      clearTimeout(autoRotateTimeoutRef.current);
    }
    
    const index = SERVICES.findIndex(s => s.id === serviceId);
    if (index !== -1 && index !== currentImageIndexRef.current) {
      transitionToImage(index);
    }
  }, [transitionToImage]);

  const handleCardLeave = useCallback(() => {
    setActiveId(null);
    startAutoRotate();
  }, [startAutoRotate]);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false 
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
    camera.position.set(0, 0, 80);
    cameraRef.current = camera;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    let imagesLoaded = 0;
    const totalImages = SERVICES.length;

    SERVICES.forEach((service, index) => {
      textureLoader.load(
        service.imageUrl,
        (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.format = THREE.RGBAFormat;
          texturesRef.current[service.id] = texture;
          imagesLoaded++;
          
          if (imagesLoaded === totalImages) {
            const slideWidth = 40;
            const slideHeight = 60;
            const initialSlide = new Slide(slideWidth, slideHeight, 'in');
            initialSlide.setImage(texturesRef.current[SERVICES[0].id]);
            initialSlide.time = initialSlide.totalDuration;
            scene.add(initialSlide);
            currentSlideInRef.current = initialSlide;
            currentImageIndexRef.current = 0;
            
            startAutoRotate();
          }
        },
        undefined,
        (error) => {
          console.error(`Error loading image ${index}:`, error);
        }
      );
    });

    function animate() {
      threeRootRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      const newWidth = container.offsetWidth;
      const newHeight = container.offsetHeight;
      const newAspect = newWidth / newHeight;
      
      camera.aspect = newAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (threeRootRef.current) {
        cancelAnimationFrame(threeRootRef.current);
      }
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current);
      }
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
      Object.values(texturesRef.current).forEach(texture => texture.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [startAutoRotate]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .text-transition { transition: color 0.5s ease; }
      .bg-transition { transition: background-color 0.5s ease, border-color 0.5s ease; }

      .service-card {
        transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), 
                   box-shadow 0.7s cubic-bezier(0.34, 1.56, 0.64, 1),
                   background-color 0.5s ease,
                   border-color 0.5s ease;
      }

      .three-canvas-container {
        background: #000;
        overflow: hidden;
        width: 100%;
        height: 100%;
      }

      .three-canvas-container canvas {
        display: block;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden pt-20 sm:pt-24 md:pt-32 lg:pt-40 pb-20 sm:pb-24 md:pb-32 lg:pb-40 bg-transition"
        style={sharedBackground ? { background: "transparent", backgroundColor: "transparent" } : bgStyle}
      >
        {theme === "dark" && !sharedBackground && (
          <>
            <div
              className="absolute inset-0 pointer-events-none z-[1]"
              style={noiseOverlayStyle}
            />
            {/* Stronger edge blending with neighbors */}
            <div
              className="absolute inset-x-0 top-0 h-32 sm:h-40 md:h-48 pointer-events-none z-[2]"
              style={{
                // Seam match with RealProblemSection bottom
                background:
                  "linear-gradient(to bottom, rgba(0,81,96,0.9) 0%, rgba(0,81,96,0) 100%)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[2]"
              style={{
                background:
                  "linear-gradient(to top, #162d24 0%, rgba(22,45,36,0) 100%)",
              }}
            />
          </>
        )}

        <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8">
          {/* Label - Full Width */}
          <div className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
            <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-[#74F5A1]" />
            <span
              className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-semibold tracking-[0.16em] uppercase text-transition ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"
              }`}
            >
              Our services
            </span>
          </div>

          {/* Title - Right side only on desktop - MOVED UP */}
          <div className="grid lg:grid-cols-[25%_1fr] gap-8 lg:gap-40 mb-10 sm:mb-12 md:mb-14">
            <div className="hidden lg:block" />
            <div ref={titleContainerRef} className="mt-16 sm:-mt-0 md:mt-4 lg:-mt-16 xl:-mt-16 2xl:-mt-16">
              <h2 className="leading-[1.02] tracking-[0.01em]">
                <div
                  className={`new-services-title-line text-[28px] sm:text-[36px] md:text-[48px] lg:text-[60px] xl:text-[70px] 2xl:text-[82px] 3xl:text-[90px] text-transition ${
                    theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                  }`}
                >
                  <span className="font-italiana font-light tracking-[0.01em]">Business Systems Built</span>
                </div>
                <div
                  className={`new-services-title-line text-[28px] sm:text-[36px] md:text-[48px] lg:text-[60px] xl:text-[70px] 2xl:text-[82px] 3xl:text-[90px] text-transition ${
                    theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                  }`}
                >
                  <span className="font-merriweather font-light">for </span>
                  <span className="font-playfair italic font-semibold tracking-[0.01em]">
                    Clarity
                  </span>
                </div>
              </h2>
            </div>
          </div>

          {/* Grid with Image left | Description + Cards right - 30% MORE GAP */}
          <div className="grid lg:grid-cols-[25%_1fr] gap-8 lg:gap-40">
            {/* Image Container */}
            <div className="relative w-full h-full">
              <div className="sticky top-8 h-full">
                <div className="relative w-full service-card h-full">
                  <div 
                    ref={canvasContainerRef}
                    className="three-canvas-container relative h-[450px] sm:h-[550px] md:h-[600px] lg:h-[700px] xl:h-[750px] rounded-xl sm:rounded-2xl border border-transition shadow-2xl overflow-hidden"



                  />

                  <span className="pointer-events-none absolute left-3 top-3 sm:left-4 sm:top-4 md:left-6 md:top-6 h-8 w-6 sm:h-10 sm:w-7 md:h-12 md:w-8 bg-[#74F5A1] z-10" />
                  <span className="pointer-events-none absolute left-12 top-20 sm:left-16 sm:top-24 md:left-20 md:top-32 h-6 w-4 sm:h-8 sm:w-5 md:h-10 md:w-6 bg-[#74F5A1] z-10" />
                </div>
              </div>
            </div>

            {/* Right Content: Description + Cards - FULL WIDTH */}
            <div className="flex flex-col w-full">
              {/* Description */}
              <div className="mb-6 sm:mb-8 space-y-4 lg:max-w-[70%]">
                <p
                  className={`font-merriweather text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-normal leading-relaxed text-transition ${
                    theme === "dark" ? "text-[#d0d0d0]" : "text-[#212121]"
                  }`}
                >
                  {/* As businesses grow, tools multiply, processes become manual, and visibility is lost. What once felt manageable slowly turns into complexity. */}


                  Growth is thrilling until it meets complexity. Tools expand, processes slow down, and visibility slips. Once felt controllable turns into uncontrollable.
                </p>
                <p
                  className={`font-merriweather text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-normal leading-relaxed text-transition ${
                    theme === "dark" ? "text-[#d0d0d0]" : "text-[#212121]"
                  }`}
                >
                  {/* Tech Eyrie helps businesses regain clarity by designing connected systems that make work manageable, bring data into focus, and automate work into decisions — so operations run smoothly as the organization scales. */}

                  But Tech Eyrie brings back clarity, creating connected systems that make work viable, bringing data into focus, and automating decisions, turning operations into a high- performing engine for an impressive success.


                </p>
              </div>

              {/* Cards Grid - 30% LESS HEIGHT */}
              <div
                className="grid h-full gap-0.5 sm:gap-0.5 md:gap-1 transition-all duration-700 ease-out"
                style={{
                  gridTemplateColumns:
                    activeId === "automation"
                      ? "1.2fr 0.8fr"
                      : activeId === "data"
                      ? "0.8fr 1.2fr"
                      : "1fr 1fr",
                  gridTemplateRows:
                 
  activeId === "platforms" ? "0.45fr 0.55fr" : "0.5fr 0.5fr",

                }}
              >
                {SERVICES.map((service, index) => {
                  const isActive = activeId === service.id;

                  return (
                    <article
                      key={service.id}
                      onMouseEnter={() => handleCardHover(service.id)}
                      onMouseLeave={handleCardLeave}
                      className={`
                        service-card group relative flex flex-col justify-between 
                        rounded-xl sm:rounded-2xl border px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-4 lg:px-7 lg:py-5
                        transition-all duration-700 ease-out
                        ${
                          theme === "dark"
                            ? "bg-[#162d24] border-white/10"
                            : "bg-white border-black/6"
                        }
                        ${index === 2 ? "col-span-2" : ""}
                      `}
                    >
                      <h3
                        className={`font-merriweather text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] font-normal tracking-tight leading-snug text-transition ${
                          theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                        }`}
                      >
                        {service.titleLine2 ? (
                          <>
                            {service.titleLine1}
                            <br />
                            {service.titleLine2}
                          </>
                        ) : (
                          service.titleLine1
                        )}
                      </h3>

                      <div className="mt-2 sm:mt-3 flex items-end justify-between gap-3 sm:gap-4">
                        <p
                          className={`max-w-full sm:max-w-[350px] md:max-w-[450px] font-merriweather text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] font-normal leading-snug transition-all duration-500 ease-out text-transition ${
                            theme === "dark"
                              ? "text-[#aaaaaa]"
                              : "text-[#444444]"
                          } ${
                            isActive
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-4"
                          }`}
                        >
                          {service.description}
                        </p>

                        <Link
                          href={`/services/${service.id}`}
                          className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[6px] bg-[#74F5A1] transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 flex-shrink-0 ${
                            theme === "dark"
                              ? "group-hover:bg-white"
                              : "group-hover:bg-black"
                          }`}
                        >
                          <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:translate-x-3 group-hover:-translate-y-3 group-hover:opacity-0">
                            <svg width="12" height="12" className="sm:w-4 sm:h-4" viewBox="0 0 14 14">
                              <path
                                d="M1 13L13 1M13 1H5M13 1V9"
                                fill="none"
                                stroke={theme === "dark" ? "#212121" : "#212121"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>

                          <span className="absolute inset-0 flex items-center justify-center translate-x-[-12px] translate-y-[12px] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
                            <svg width="12" height="12" className="sm:w-4 sm:h-4" viewBox="0 0 14 14">
                              <path
                                d="M1 13L13 1M13 1H5M13 1V9"
                                fill="none"
                                stroke={theme === "dark" ? "#111111" : "#74F5A1"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
