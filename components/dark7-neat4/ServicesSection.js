// // components/ServicesSection.jsx
// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// const SERVICES = [
//   {
//     id: "content",
//     title: "Content & Creative",
//     description: "We'll make your prospects stop scrolling.",
//   },
//   {
//     id: "paid",
//     title: "Paid Media & Performance",
//     description: "Build, optimize and scale your performance marketing.",
//   },
//   {
//     id: "data",
//     title: "Data & Measurement",
//     description: "We make the invisible visible.",
//   },
// ];

// export default function ServicesSection({ theme = "dark" }) {
//   const [activeId, setActiveId] = useState(null);

//   // Dark background exactly like HeroSection
//   const bgStyle =
//     theme === "dark"
//       ? {
//           backgroundColor: "#2b2b2b",
//           backgroundImage: `
//           url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
//           radial-gradient(ellipse at top left, rgba(60, 60, 60, 0.3), transparent 50%),
//           radial-gradient(ellipse at bottom right, rgba(50, 50, 50, 0.2), transparent 50%)
//         `,
//           backgroundBlendMode: "overlay, normal, normal",
//         }
//       : { backgroundColor: "#EFEFEF" };

//   const noiseOverlayStyle = {
//     backgroundImage: `
//       repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
//       repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
//       repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.015) 2px, rgba(0, 0, 0, 0.015) 4px)
//     `,
//   };

//   return (
//     <>
//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>

//       <section
//         className="relative overflow-hidden pt-32 pb-32 md:pt-40 md:pb-40"
//         style={bgStyle}
//       >
//         {/* Noise overlay — only in dark mode */}
//         {theme === "dark" && (
//           <div
//             className="absolute inset-0 pointer-events-none z-[1]"
//             style={noiseOverlayStyle}
//           />
//         )}

//         <div className="relative z-10 mx-auto max-w-[1800px] px-4 md:px-8">
//           {/* TOP ROW */}
//           <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] mb-20">
//             <div className="flex items-center gap-3">
//               <span className="inline-flex h-5 w-5 rounded-sm bg-[#74F5A1]" />
//               <span
//                 className={`font-[Helvetica_Now_Text,Arial,sans-serif] text-[13px] md:text-[14px] font-semibold tracking-[0.16em] uppercase ${
//                   theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"
//                 }`}
//               >
//                 Our services
//               </span>
//             </div>

//             <div className="max-w-[1100px]">
//               <h2
//                 className={`font-[Helvetica_Now_Text,Arial,sans-serif] leading-[1.02] tracking-tight ${
//                   theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
//                 }`}
//               >
//                 <span className="block text-[40px] sm:text-[56px] md:text-[70px] lg:text-[82px] xl:text-[90px] font-bold">
//                   Level up your marketing,
//                 </span>
//                 <span className="block text-[40px] sm:text-[56px] md:text-[70px] lg:text-[82px] xl:text-[90px] font-bold">
//                   improve{" "}
//                   <span className="font-ivy-presto italic font-normal">
//                     marketing ROI
//                   </span>
//                 </span>
//               </h2>

//               <p
//                 className={`mt-8 max-w-[640px] font-[Helvetica_Now_Text,Arial,sans-serif] text-[17px] md:text-[19px] lg:text-[22px] font-semibold leading-relaxed ${
//                   theme === "dark" ? "text-[#d0d0d0]" : "text-[#212121]"
//                 }`}
//               >
//                 Better marketing leads to better marketing ROI. At Dapper, we
//                 help you level up your complete marketing engine. From strategy
//                 to content, advertising, and measurement.
//               </p>
//             </div>
//           </div>

//           {/* Divider */}
//           <div
//             className={`h-px w-full ${
//               theme === "dark"
//                 ? "border-b border-white/10"
//                 : "border-b border-black/10"
//             } mb-20`}
//           />

//           {/* MAIN ROW: Image + Interactive Cards */}
//           <div className="flex flex-col gap-10 lg:flex-row">
//             {/* LEFT: Image */}
//             <div className="relative w-full overflow-hidden rounded-2xl lg:w-[28%]">
//               <div className="relative h-[520px] sm:h-[560px] lg:h-[640px] border border-white/8 shadow-2xl">
//                 <Image
//                   src="https://cdn.prod.website-files.com/67b320fe114d5e148783d276/68947cf33c69a1ceddbdf83d_Dapper%20Flash%20Photos-04.avif"
//                   alt="Dapper team"
//                   fill
//                   className="object-cover"
//                   sizes="(min-width: 1024px) 420px, 100vw"
//                   priority
//                 />
//               </div>

//               {/* Green accent blocks */}
//               <span className="pointer-events-none absolute left-6 top-6 h-12 w-8 bg-[#74F5A1]" />
//               <span className="pointer-events-none absolute left-20 top-32 h-10 w-6 bg-[#74F5A1]" />
//             </div>

//             {/* RIGHT: Interactive service cards */}
//             <div className="flex-1">
//               <div
//                 className="grid h-full gap-4 lg:gap-6 transition-all duration-700 ease-out"
//                 style={{
//                   gridTemplateColumns:
//                     activeId === "content"
//                       ? "1.2fr 0.8fr"
//                       : activeId === "paid"
//                       ? "0.8fr 1.2fr"
//                       : "1fr 1fr",
//                   gridTemplateRows:
//                     activeId === "data" ? "0.85fr 1.15fr" : "1fr 1fr",
//                 }}
//               >
//                 {SERVICES.map((service, index) => {
//                   const isActive = activeId === service.id;

//                   return (
//                     <article
//                       key={service.id}
//                       onMouseEnter={() => setActiveId(service.id)}
//                       onMouseLeave={() => setActiveId(null)}
//                       className={`
//                         group relative flex flex-col justify-between 
//                         rounded-2xl border px-10 py-9 
//                         transition-all duration-700 ease-out
//                         ${
//                           theme === "dark"
//                             ? "bg-[#2a2a2a] border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.7)]"
//                             : "bg-white border-black/6 shadow-[0_10px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
//                         }
//                         ${index === 2 ? "col-span-2" : ""}
//                       `}
//                     >
//                       <h3
//                         className={`font-[Helvetica_Now_Text,Arial,sans-serif] text-[26px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-bold tracking-tight ${
//                           theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
//                         }`}
//                       >
//                         {service.title}
//                       </h3>

//                       <div className="mt-6 flex items-end justify-between">
//                         <p
//                           className={`max-w-[400px] text-[15px] md:text-[16px] font-semibold leading-snug transition-all duration-500 ease-out ${
//                             theme === "dark"
//                               ? "text-[#aaaaaa]"
//                               : "text-[#444444]"
//                           } ${
//                             isActive
//                               ? "opacity-100 translate-y-0"
//                               : "opacity-0 translate-y-4"
//                           }`}
//                         >
//                           {service.description}
//                         </p>

//                         {/* Arrow Button */}
//                         <Link
//                           href={`/services/${service.id}`}
//                           className={`relative flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#74F5A1] transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 ${
//                             theme === "dark"
//                               ? "group-hover:bg-white"
//                               : "group-hover:bg-black"
//                           }`}
//                         >
//                           {/* Default arrow */}
//                           <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:translate-x-3 group-hover:-translate-y-3 group-hover:opacity-0">
//                             <svg width="16" height="16" viewBox="0 0 14 14">
//                               <path
//                                 d="M1 13L13 1M13 1H5M13 1V9"
//                                 fill="none"
//                                 stroke={
//                                   theme === "dark" ? "#212121" : "#212121"
//                                 }
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               />
//                             </svg>
//                           </span>

//                           {/* Hover arrow */}
//                           <span className="absolute inset-0 flex items-center justify-center translate-x-[-12px] translate-y-[12px] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
//                             <svg width="16" height="16" viewBox="0 0 14 14">
//                               <path
//                                 d="M1 13L13 1M13 1H5M13 1V9"
//                                 fill="none"
//                                 stroke={
//                                   theme === "dark" ? "#111111" : "#74F5A1"
//                                 }
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               />
//                             </svg>
//                           </span>
//                         </Link>
//                       </div>
//                     </article>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

































// components/ServicesSection.jsx
"use client";

import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

const SERVICES = [
  {
    id: "content",
    title: "Content & Creative",
    description: "We'll make your prospects stop scrolling.",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: "paid",
    title: "Paid Media & Performance",
    description: "Build, optimize and scale your performance marketing.",
    imageUrl: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: "data",
    title: "Data & Measurement",
    description: "We make the invisible visible.",
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

export default function ServicesSection({ theme = "light" }) {
  const [activeId, setActiveId] = useState(null);
  const sectionRef = useRef(null);
  const titleContainerRef = useRef(null);
  const animationIntervalRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const [hasTriggeredAnimation, setHasTriggeredAnimation] = useState(false);
  
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
          backgroundColor: "#2b2b2b",
          backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
          radial-gradient(ellipse at top left, rgba(60, 60, 60, 0.3), transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(50, 50, 50, 0.2), transparent 50%)
        `,
          backgroundBlendMode: "overlay, normal, normal",
        }
      : { backgroundColor: lightColors.background };

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.015) 2px, rgba(0, 0, 0, 0.015) 4px)
    `,
  };

  // Transition to specific image with proper particle animation
  const transitionToImage = useCallback((targetIndex) => {
    if (isTransitioningRef.current || !sceneRef.current || !rendererRef.current) return;
    if (currentImageIndexRef.current === targetIndex) return;

    isTransitioningRef.current = true;

    const scene = sceneRef.current;
    
    // Portrait dimensions - height > width
    const slideWidth = 40;
    const slideHeight = 60;

    // Create slide OUT (current image disperses)
    const slideOut = new Slide(slideWidth, slideHeight, 'out');
    const currentTexture = texturesRef.current[SERVICES[currentImageIndexRef.current].id];
    if (currentTexture) {
      slideOut.setImage(currentTexture);
    }
    scene.add(slideOut);

    // Create slide IN (new image forms)
    const slideIn = new Slide(slideWidth, slideHeight, 'in');
    const targetTexture = texturesRef.current[SERVICES[targetIndex].id];
    if (targetTexture) {
      slideIn.setImage(targetTexture);
    }
    scene.add(slideIn);

    // Remove old slides
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

    // Animate both slides
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

  // Start auto-rotate
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

  // Handle card hover
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

  // Handle card leave
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

    // Portrait aspect ratio camera
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
    camera.position.set(0, 0, 80);
    cameraRef.current = camera;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Load all textures
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
          console.log(`Image ${index + 1} loaded:`, service.id);
          
          if (imagesLoaded === totalImages) {
            // Initialize with first image (portrait)
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

    // Render loop
    function animate() {
      threeRootRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
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

  const triggerElectricalAnimation = useCallback(() => {
    const titleLines = document.querySelectorAll(".hero-title-line");
    const originalColor = theme === "dark" ? "#f3f3f3" : "#111111";
    const electricColor = theme === "dark" ? "#74F5A1" : "#3BC972";
    const brightElectricColor = theme === "dark" ? "#FFFFFF" : "#FFFFFF";

    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });

    titleLines.forEach((line, lineIndex) => {
      const text = line.textContent;

      if (!line.querySelector(".char")) {
        const chars = text
          .split("")
          .map(
            (char, i) =>
              `<span class="char" style="color: ${originalColor}; display: inline-block; position: relative;" data-index="${i}">${
                char === " " ? "&nbsp;" : char
              }</span>`
          )
          .join("");
        line.innerHTML = chars;
      }

      const chars = line.querySelectorAll(".char");
      chars.forEach((char, charIndex) => {
        const baseDelay = lineIndex * 0.5 + charIndex * 0.06;
        const randomDelay = Math.random() * 0.1;
        const totalDelay = baseDelay + randomDelay;

        tl.to(char, { duration: 0.12, color: brightElectricColor, scale: 1.05, delay: totalDelay, ease: "power2.out" }, 0)
          .to(char, { duration: 0.18, color: electricColor, scale: 1.02, delay: totalDelay + 0.12, ease: "sine.inOut" }, 0)
          .to(char, { duration: 0.3, color: originalColor, scale: 1, delay: totalDelay + 0.3, ease: "power2.in" }, 0);
      });
    });
  }, [theme]);

  const startElectricalAnimation = useCallback(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    setTimeout(() => {
      triggerElectricalAnimation();
    }, 800);

    animationIntervalRef.current = setInterval(() => {
      triggerElectricalAnimation();
    }, 10000);
  }, [triggerElectricalAnimation]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const titleContainer = titleContainerRef.current;

    if (!section || !titleContainer) return;

    const ctx = gsap.context(() => {
      gsap.killTweensOf(".hero-title-line");
      gsap.set(".hero-title-line", { opacity: 1, y: 0 });

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: titleContainer,
          start: "top 60%",
          end: "top 30%",
          once: true,
          onEnter: () => {
            if (!hasTriggeredAnimation) {
              setHasTriggeredAnimation(true);
              hasAnimatedRef.current = true;
              setTimeout(() => {
                startElectricalAnimation();
              }, 1000);
            }
          },
          markers: false,
        },
      });

      revealTl.fromTo(
        ".hero-title-line",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.15 }
      );

      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      });

      cardTl.fromTo(
        ".service-card",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.2 }
      );
    }, section);

    return () => ctx.revert();
  }, [theme, startElectricalAnimation, hasTriggeredAnimation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAnimatedRef.current) {
        triggerElectricalAnimation();
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [triggerElectricalAnimation]);

  useEffect(() => {
    const chars = document.querySelectorAll(".hero-title-line .char");
    if (chars.length > 0) {
      const newColor = theme === "dark" ? "#f3f3f3" : "#111111";
      chars.forEach((char) => {
        gsap.set(char, { color: newColor });
      });
    }
  }, [theme]);

  return (
    <>
      <style jsx>{`
        @keyframes subtle-glitch {
          0%, 100% { transform: translateX(0); }
          94% { transform: translateX(0); }
          95% { transform: translateX(1px); }
          96% { transform: translateX(-1px); }
          97% { transform: translateX(0); }
        }

        .char {
          transition: color 0.15s ease, transform 0.15s ease;
          will-change: color, transform;
          animation: subtle-glitch 10s infinite;
        }

        .char:nth-child(3n) { animation-delay: 0.5s; }
        .char:nth-child(3n+1) { animation-delay: 1s; }
        .char:nth-child(3n+2) { animation-delay: 1.5s; }

        .font-fellix {
          font-family: 'Fellix', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

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
      `}</style>

      <section
        ref={sectionRef}
        className="relative overflow-hidden pt-20 sm:pt-24 md:pt-32 lg:pt-40 pb-20 sm:pb-24 md:pb-32 lg:pb-40 bg-transition"
        style={bgStyle}
      >
        {theme === "dark" && (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={noiseOverlayStyle}
          />
        )}

        <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8">
          <div className="grid items-start gap-6 sm:gap-8 md:gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] mb-12 sm:mb-16 md:mb-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-[#74F5A1]" />
              <span
                className={`font-[Helvetica_Now_Text,Arial,sans-serif] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-semibold tracking-[0.16em] uppercase text-transition ${
                  theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"
                }`}
              >
                Our services
              </span>
            </div>

            <div className="max-w-full lg:max-w-[1100px]" ref={titleContainerRef}>
              <h2 className="font-fellix leading-[1.02] tracking-tight">
                <div
                  className={`hero-title-line text-[28px] sm:text-[36px] md:text-[48px] lg:text-[60px] xl:text-[70px] 2xl:text-[82px] 3xl:text-[90px] text-transition ${
                    theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                  }`}
                >
                  <span className="font-normal">Level up your marketing,</span>
                </div>
                <div
                  className={`hero-title-line text-[28px] sm:text-[36px] md:text-[48px] lg:text-[60px] xl:text-[70px] 2xl:text-[82px] 3xl:text-[90px] text-transition ${
                    theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                  }`}
                >
                  <span className="font-normal">improve </span>
                  <span className="font-fellix italic font-normal tracking-[0.03em]">
                    marketing ROI
                  </span>
                </div>
              </h2>

              <p
                className={`mt-4 sm:mt-6 md:mt-8 max-w-full lg:max-w-[640px] font-[Helvetica_Now_Text,Arial,sans-serif] text-[14px] sm:text-[16px] md:text-[17px] lg:text-[19px] xl:text-[22px] font-semibold leading-relaxed text-transition ${
                  theme === "dark" ? "text-[#d0d0d0]" : "text-[#212121]"
                }`}
              >
                Better marketing leads to better marketing ROI. At Dapper, we
                help you level up your complete marketing engine. From strategy
                to content, advertising, and measurement.
              </p>
            </div>
          </div>

          <div
            className={`h-px w-full border-transition mb-12 sm:mb-16 md:mb-20 ${
              theme === "dark"
                ? "border-b border-white/10"
                : "border-b border-black/10"
            }`}
          />

          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:flex-row">
            {/* Portrait Container with New Images */}
            <div className="relative w-full lg:w-[28%] service-card">
              <div 
                ref={canvasContainerRef}
                className="three-canvas-container relative h-[450px] sm:h-[550px] md:h-[500px] lg:h-full lg:min-h-[580px] xl:min-h-[580px] rounded-xl sm:rounded-2xl border border-transition shadow-2xl overflow-hidden"
              />

              <span className="pointer-events-none absolute left-3 top-3 sm:left-4 sm:top-4 md:left-6 md:top-6 h-8 w-6 sm:h-10 sm:w-7 md:h-12 md:w-8 bg-[#74F5A1] z-10" />
              <span className="pointer-events-none absolute left-12 top-20 sm:left-16 sm:top-24 md:left-20 md:top-32 h-6 w-4 sm:h-8 sm:w-5 md:h-10 md:w-6 bg-[#74F5A1] z-10" />
            </div>

            <div className="flex-1">
              <div
                className="grid h-full gap-0.5 sm:gap-0.5 md:gap-1 transition-all duration-700 ease-out"
                style={{
                  gridTemplateColumns:
                    activeId === "content"
                      ? "1.2fr 0.8fr"
                      : activeId === "paid"
                      ? "0.8fr 1.2fr"
                      : "1fr 1fr",
                  gridTemplateRows:
                    activeId === "data" ? "0.85fr 1.15fr" : "1fr 1fr",
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
                        rounded-xl sm:rounded-2xl border px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-7 lg:px-10 lg:py-9
                        transition-all duration-700 ease-out
                        ${
                          theme === "dark"
                            ? "bg-[#2a2a2a] border-white/10"
                            : "bg-white border-black/6"
                        }
                        ${index === 2 ? "col-span-2" : ""}
                      `}
                    >
                      <h3
                        className={`font-[Helvetica_Now_Text,Arial,sans-serif] text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px] xl:text-[28px] 2xl:text-[32px] font-bold tracking-tight leading-snug text-transition ${
                          theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                        }`}
                      >
                        {service.id === "paid" ? (
                          <>
                            Paid Media &<br />
                            Performance
                          </>
                        ) : (
                          service.title
                        )}
                      </h3>

                      <div className="mt-4 sm:mt-6 flex items-end justify-between gap-3 sm:gap-4">
                        <p
                          className={`max-w-full sm:max-w-[300px] md:max-w-[400px] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold leading-snug transition-all duration-500 ease-out text-transition ${
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
                          className={`relative flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-[6px] bg-[#74F5A1] transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 flex-shrink-0 ${
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
