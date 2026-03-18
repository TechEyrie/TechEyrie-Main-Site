// // components/DemandSection.jsx
// "use client";

// import {
//   useLayoutEffect,
//   useRef,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const DEMAND_BLOCKS = [
//   {
//     id: "demand-gen",
//     label: "Demand Gen",
//     tagline: "Become famous in your niche and build demand",
//     intro:
//       "B2B buyers do not move in a straight, linear funnel. You cannot force a need into existence, but the moment a need appears you want to be the very first brand they recall.",
//     body: [
//       'That is why your brand has to sit top‑of‑mind in your niche category. When a problem shows up, the ideal customer should immediately think of you – what Dapper calls becoming "niche famous".',
//       "You get there by showing up in front of the right accounts with content that clearly proves you are the best‑equipped company to solve their problems.",
//       "That means creative that is impossible to ignore and distribution strategies that keep you visible everywhere your ideal clients spend time.",
//     ],
//     results: [
//       "Growing pipeline",
//       "Shorter sales cycles",
//       "Better ICP‑fit inbound leads",
//       "Compounding brand building",
//     ],
//     href: "https://www.dapper.agency/expertise/b2b-saas",
//   },
//   {
//     id: "demand-capture",
//     label: "Demand Capture",
//     tagline: "Turn active demand into pipeline",
//     intro:
//       "When buyers are ready to purchase, they research solutions on their own. At that point you must appear in the right places with the right offer, or the opportunity goes to someone else.",
//     body: [
//       "Capturing demand starts with understanding how prospects search, which touchpoints they trust, and what information convinces them to choose you over an alternative.",
//       "Search, review sites, landing pages, and pricing experiences are all tuned to turn existing demand into qualified opportunities at the lowest possible acquisition cost.",
//     ],
//     results: [
//       "More inbound pipeline",
//       "Lower acquisition costs",
//       "Higher conversion rates",
//       "Better ICP‑fit inbound leads",
//     ],
//     href: "#",
//   },
// ];

// export default function DemandSection({ theme = "light" }) {
//   const sectionRef = useRef(null);
//   const phoneWrapperRef = useRef(null);
//   const phoneRef = useRef(null);

//   // Triangle animation effects
//   const [triangles, setTriangles] = useState([]);
//   const triangleIdRef = useRef(0);

//   // Background styles based on theme
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
//       repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
//       repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
//       repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px)
//     `,
//   };

//   const createTriangle = useCallback((x, y) => {
//     const id = triangleIdRef.current++;
//     const size = Math.random() * 12 + 20;
//     const rotation = Math.random() * 360;
//     const greenShades = ["#74F5A1", "#5FE08D", "#4DD97F", "#3BC972"];
//     const color = greenShades[Math.floor(Math.random() * greenShades.length)];

//     const newTriangle = {
//       id,
//       x,
//       y,
//       size,
//       rotation,
//       color,
//     };

//     setTriangles((prev) => [...prev, newTriangle]);

//     setTimeout(() => {
//       setTriangles((prev) => prev.filter((t) => t.id !== id));
//     }, 1050);
//   }, []);

//   useEffect(() => {
//     const section = sectionRef.current;
//     if (!section) return;

//     let lastTime = 0;
//     const throttleDelay = 100;

//     const handleMouseMove = (e) => {
//       const currentTime = Date.now();
//       if (currentTime - lastTime < throttleDelay) return;
//       lastTime = currentTime;

//       const rect = section.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       createTriangle(x, y);
//     };

//     section.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       section.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, [createTriangle]);

//   useLayoutEffect(() => {
//     if (typeof window === "undefined") return;

//     const section = sectionRef.current;
//     const wrapper = phoneWrapperRef.current;
//     const phone = phoneRef.current;
//     if (!section || !wrapper || !phone) return;

//     const mq = window.matchMedia("(min-width: 1024px)");
//     let st = null;

//     const init = () => {
//       // Clean up any existing ScrollTrigger
//       if (st) {
//         st.kill();
//         st = null;
//       }

//       // Mobile → no sticky, no animation
//       if (!mq.matches) {
//         gsap.set(wrapper, { position: "relative", top: "auto" });
//         gsap.set(phone, { y: 0 });
//         return;
//       }

//       // Desktop: sticky at nice top offset
//       gsap.set(wrapper, {
//         position: "sticky",
//         top: "7rem",
//       });

//       // Calculate total travel distance
//       const sectionHeight = section.offsetHeight;
//       const wrapperHeight = wrapper.offsetHeight;
//       const offset = 200; // Early stop
//       const totalTravel = Math.max(0, sectionHeight - wrapperHeight - offset);

//       st = ScrollTrigger.create({
//         trigger: section,
//         start: "top top",
//         end: `bottom bottom-=${offset}`,
//         scrub: true,
//         invalidateOnRefresh: true,
//         onUpdate: (self) => {
//           const y = totalTravel * self.progress;
//           gsap.set(phone, { y });
//         },
//         onRefresh: () => {
//           // Recalculate on resize
//           const newSectionHeight = section.offsetHeight;
//           const newWrapperHeight = wrapper.offsetHeight;
//           const newTotalTravel = Math.max(
//             0,
//             newSectionHeight - newWrapperHeight - offset
//           );

//           // Update animation range
//           self.end = `bottom bottom-=${offset}`;
//         },
//       });

//       // Force refresh to ensure proper measurements
//       ScrollTrigger.refresh();
//     };

//     init();

//     const handleResize = () => {
//       // Debounce resize for performance
//       clearTimeout(window.resizeTimer);
//       window.resizeTimer = setTimeout(() => {
//         init();
//         ScrollTrigger.refresh();
//       }, 100);
//     };

//     mq.addEventListener("change", handleResize);
//     window.addEventListener("resize", handleResize);

//     return () => {
//       mq.removeEventListener("change", handleResize);
//       window.removeEventListener("resize", handleResize);
//       clearTimeout(window.resizeTimer);

//       if (st) st.kill();
//       gsap.set([wrapper, phone], { clearProps: "all" });
//     };
//   }, []);

//   return (
//     <>
//       <style jsx>{`
//         @keyframes triangle-fade {
//           0% {
//             opacity: 0.7;
//             transform: translate(-50%, -50%) scale(1);
//           }
//           100% {
//             opacity: 0;
//             transform: translate(-50%, -50%) scale(1.5);
//           }
//         }

//         .animate-triangle-fade {
//           animation: triangle-fade 1.05s ease-out forwards;
//         }
//       `}</style>

//       <section
//         ref={sectionRef}
//         className="relative overflow-hidden py-24"
//         style={bgStyle}
//       >
//         {/* Noise texture overlay */}
//         {theme === "dark" && (
//           <div
//             className="absolute inset-0 pointer-events-none z-[1]"
//             style={noiseOverlayStyle}
//           />
//         )}

//         {/* CURSOR TRAIL TRIANGLES */}
//         {triangles.map((triangle) => (
//           <div
//             key={triangle.id}
//             className="pointer-events-none absolute z-[5] animate-triangle-fade"
//             style={{
//               left: `${triangle.x}px`,
//               top: `${triangle.y}px`,
//               width: "0",
//               height: "0",
//               borderLeft: `${triangle.size / 2}px solid transparent`,
//               borderRight: `${triangle.size / 2}px solid transparent`,
//               borderBottom: `${triangle.size}px solid ${triangle.color}`,
//               transform: `translate(-50%, -50%) rotate(${triangle.rotation}deg)`,
//               opacity: 0.7,
//             }}
//           />
//         ))}

//         <div className="relative z-10 mx-auto max-w-[1800px] px-4 md:px-8">
//           <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.7fr)]">
//             {/* LEFT – Sticky Phone */}
//             <div ref={phoneWrapperRef} className="relative lg:sticky lg:top-28">
//               <div
//                 ref={phoneRef}
//                 className="relative w-full max-w-[360px] lg:max-w-[380px] xl:max-w-[420px] mx-auto lg:mx-0"
//               >
//                 <div
//                   className={`relative overflow-hidden rounded-[32px] border ${
//                     theme === "dark"
//                       ? "border-white/[0.06] bg-[#2a2a2a]"
//                       : "border-black/[0.06] bg-white"
//                   } shadow-[0_24px_60px_rgba(0,0,0,0.20)]`}
//                 >
//                   <div className="relative h-[520px] sm:h-[560px] lg:h-[600px]">
//                     <Image
//                       src="https://cdn.prod.website-files.com/67b320fe114d5e148783d276/68947cf33c69a1ceddbdf83d_Dapper%20Flash%20Photos-04.avif"
//                       alt="Demand gen creative on mobile"
//                       fill
//                       sizes="(min-width: 1280px) 420px, (min-width: 1024px) 380px, 360px"
//                       className="object-cover"
//                       priority
//                     />
//                   </div>
//                 </div>

//                 <span className="pointer-events-none absolute -left-6 top-16 h-14 w-8 bg-[#74F5A1]" />
//                 <span className="pointer-events-none absolute left-16 -bottom-6 h-10 w-24 bg-[#74F5A1]" />
//               </div>
//             </div>

//             {/* RIGHT – Content blocks */}
//             <div className="space-y-12">
//               {DEMAND_BLOCKS.map((block) => (
//                 <article
//                   key={block.id}
//                   className={`rounded-2xl border ${
//                     theme === "dark"
//                       ? "border-white/[0.06] bg-[#2a2a2a]"
//                       : "border-black/[0.06] bg-white"
//                   } px-8 py-12 sm:px-16 sm:py-16 md:px-20 md:py-20 lg:px-24 lg:py-24 shadow-[0_18px_45px_rgba(0,0,0,0.10)]`}
//                 >
//                   <header className="mb-8 sm:mb-10 md:mb-12">
//                     <h2
//                       className={`font-[Helvetica Now Text,Arial,sans-serif] text-[32px] sm:text-[38px] md:text-[44px] lg:text-[60px] xl:text-[75px] font-semibold tracking-tight ${
//                         theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
//                       }`}
//                     >
//                       {block.label}
//                     </h2>
//                     <p
//                       className={`mt-3 sm:mt-4 font-ivy-presto italic text-[20px] sm:text-[22px] md:text-[26px] lg:text-[28px] xl:text-[32px] ${
//                         theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
//                       }`}
//                     >
//                       {block.tagline}
//                     </p>
//                   </header>

//                   <div className="max-w-[800px] space-y-4 md:space-y-5 font-[Helvetica Now Text,Arial,sans-serif]">
//                     <p
//                       className={`text-[17px] sm:text-[18px] md:text-[19px] lg:text-[20px] leading-relaxed font-semibold ${
//                         theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"
//                       }`}
//                     >
//                       {block.intro}
//                     </p>
//                     {block.body.map((p, i) => (
//                       <p
//                         key={i}
//                         className={`text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] xl:text-[20px] leading-relaxed ${
//                           theme === "dark" ? "text-[#a0a0a0]" : "text-[#555555]"
//                         }`}
//                       >
//                         {p}
//                       </p>
//                     ))}
//                   </div>

//                   <div className="mt-10 sm:mt-12 md:mt-14">
//                     <p
//                       className={`text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.18em] ${
//                         theme === "dark" ? "text-[#a0a0a0]" : "text-[#777777]"
//                       }`}
//                     >
//                       The result?
//                     </p>
//                     <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
//                       {block.results.map((item) => (
//                         <li key={item} className="flex items-start gap-3">
//                           <span className="mt-[3px] h-5 w-5 shrink-0 rounded-md bg-[#74F5A1]" />
//                           <span
//                             className={`text-[16px] sm:text-[17px] md:text-[18px] ${
//                               theme === "dark"
//                                 ? "text-[#f3f3f3]"
//                                 : "text-[#212121]"
//                             }`}
//                           >
//                             {item}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>

//                     <div className="mt-8 sm:mt-10 flex justify-end">
//                       <Link
//                         href={block.href}
//                         className={`group inline-flex items-center gap-2 rounded-[10px] border ${
//                           theme === "dark"
//                             ? "border-white/10 bg-[#3a3a3a]"
//                             : "border-black/10 bg-white"
//                         } px-5 py-3 sm:px-6 sm:py-3 text-[14px] sm:text-[15px] md:text-[16px] font-semibold tracking-tight ${
//                           theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
//                         } shadow-sm transition-transform duration-300 ease-out hover:scale-[1.10] hover:-translate-y-[1px]`}
//                       >
//                         Discover more
//                         <span
//                           className={`relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-[4px] ${
//                             theme === "dark"
//                               ? "bg-[#74F5A1] group-hover:bg-white"
//                               : "bg-[#74F5A1] group-hover:bg-black"
//                           } transition-colors duration-500`}
//                         >
//                           <svg
//                             className="absolute transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0"
//                             width="12"
//                             height="12"
//                             viewBox="0 0 14 14"
//                             aria-hidden="true"
//                           >
//                             <path
//                               d="M1 13L13 1M13 1H5M13 1V9"
//                               fill="none"
//                               stroke={theme === "dark" ? "#111111" : "#212121"}
//                               strokeWidth="1.8"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                           <svg
//                             className="absolute translate-x-[-10px] translate-y-[10px] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
//                             width="12"
//                             height="12"
//                             viewBox="0 0 14 14"
//                             aria-hidden="true"
//                           >
//                             <path
//                               d="M1 13L13 1M13 1H5M13 1V9"
//                               fill="none"
//                               stroke={theme === "dark" ? "#111111" : "#74F5A1"}
//                               strokeWidth="1.8"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         </span>
//                       </Link>
//                     </div>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }


















































// components/DemandSection.jsx
// components/DemandSection.jsx
"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DEMAND_BLOCKS = [
  {
    id: "demand-gen",
    label: "Demand Gen",
    tagline: "Become famous in your niche and build demand",
    intro:
      "B2B buyers do not move in a straight, linear funnel. You cannot force a need into existence, but the moment a need appears you want to be the very first brand they recall.",
    body: [
      'That is why your brand has to sit top‑of‑mind in your niche category. When a problem shows up, the ideal customer should immediately think of you – what Dapper calls becoming "niche famous".',
      "You get there by showing up in front of the right accounts with content that clearly proves you are the best‑equipped company to solve their problems.",
      "That means creative that is impossible to ignore and distribution strategies that keep you visible everywhere your ideal clients spend time.",
    ],
    results: [
      "Growing pipeline",
      "Shorter sales cycles",
      "Better ICP‑fit inbound leads",
      "Compounding brand building",
    ],
    href: "https://www.dapper.agency/expertise/b2b-saas",
  },
  {
    id: "demand-capture",
    label: "Demand Capture",
    tagline: "Turn active demand into pipeline",
    intro:
      "When buyers are ready to purchase, they research solutions on their own. At that point you must appear in the right places with the right offer, or the opportunity goes to someone else.",
    body: [
      "Capturing demand starts with understanding how prospects search, which touchpoints they trust, and what information convinces them to choose you over an alternative.",
      "Search, review sites, landing pages, and pricing experiences are all tuned to turn existing demand into qualified opportunities at the lowest possible acquisition cost.",
    ],
    results: [
      "More inbound pipeline",
      "Lower acquisition costs",
      "Higher conversion rates",
      "Better ICP‑fit inbound leads",
    ],
    href: "#",
  },
];

export default function DemandSection({ theme = "light" }) {
  const sectionRef = useRef(null);
  const phoneWrapperRef = useRef(null);
  const phoneRef = useRef(null);
  const animationIntervalRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Triangle animation effects
  const [triangles, setTriangles] = useState([]);
  const triangleIdRef = useRef(0);

  // Background styles based on theme (Matched to ServicesSection)
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
      : { backgroundColor: "#EFEFEF" };

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.015) 2px, rgba(0, 0, 0, 0.015) 4px)
    `,
  };

  // --- ELECTRIC ANIMATION LOGIC ---

  const triggerElectricalAnimation = useCallback(() => {
    const titleLines = document.querySelectorAll(".hero-title-line");

    // Define colors based on theme
    const originalColor = theme === "dark" ? "#f3f3f3" : "#111111";
    const electricColor = theme === "dark" ? "#74F5A1" : "#3BC972";
    const brightElectricColor = theme === "dark" ? "#FFFFFF" : "#FFFFFF";

    // Create a single timeline for all lines
    const tl = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
      },
    });

    // Animate each line with an electrical sweep effect
    titleLines.forEach((line, lineIndex) => {
      // Get the text content
      const text = line.textContent;

      // Split text into spans for character-by-character animation
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

      // Animate each character with electrical effect
      const chars = line.querySelectorAll(".char");
      chars.forEach((char, charIndex) => {
        // Randomize timing slightly for electrical feel
        const baseDelay = lineIndex * 0.5 + charIndex * 0.06;
        const randomDelay = Math.random() * 0.1;
        const totalDelay = baseDelay + randomDelay;

        // Electrical flicker effect
        tl.to(
          char,
          {
            duration: 0.12,
            color: brightElectricColor,
            scale: 1.05,
            delay: totalDelay,
            ease: "power2.out",
          },
          0
        )
          .to(
            char,
            {
              duration: 0.18,
              color: electricColor,
              scale: 1.02,
              delay: totalDelay + 0.12,
              ease: "sine.inOut",
            },
            0
          )
          .to(
            char,
            {
              duration: 0.3,
              color: originalColor,
              scale: 1,
              delay: totalDelay + 0.3,
              ease: "power2.in",
            },
            0
          );
      });
    });
  }, [theme]);

  const startElectricalAnimation = useCallback(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    // Trigger first animation
    setTimeout(() => {
      triggerElectricalAnimation();
    }, 800);

    // Repeat every 10 seconds
    animationIntervalRef.current = setInterval(() => {
      triggerElectricalAnimation();
    }, 10000);
  }, [triggerElectricalAnimation]);

  // Start animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        startElectricalAnimation();
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [startElectricalAnimation]);

  // Add CSS for electrical effects
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
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
      .word { white-space: nowrap; display: inline-block; }
      
      /* Smooth background transitions */
      .bg-transition {
        transition: background-color 0.5s ease, border-color 0.5s ease;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // --- END ELECTRIC ANIMATION LOGIC ---

  const createTriangle = useCallback((x, y) => {
    const id = triangleIdRef.current++;
    const size = Math.random() * 5 + 8;
    const rotation = Math.random() * 360;
    const greenShades = ["#74F5A1", "#5FE08D", "#4DD97F", "#3BC972"];
    const color = greenShades[Math.floor(Math.random() * greenShades.length)];

    const newTriangle = {
      id,
      x,
      y,
      size,
      rotation,
      color,
    };

    setTriangles((prev) => [...prev, newTriangle]);

    setTimeout(() => {
      setTriangles((prev) => prev.filter((t) => t.id !== id));
    }, 1050);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let lastTime = 0;
    const throttleDelay = 100;

    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastTime < throttleDelay) return;
      lastTime = currentTime;

      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      createTriangle(x, y);
    };

    section.addEventListener("mousemove", handleMouseMove);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
    };
  }, [createTriangle]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const section = sectionRef.current;
    const wrapper = phoneWrapperRef.current;
    const phone = phoneRef.current;

    if (!section || !wrapper || !phone) return;

    const mq = window.matchMedia("(min-width: 1024px)");
    let st = null;

    const init = () => {
      if (st) {
        st.kill();
        st = null;
      }

      if (!mq.matches) {
        gsap.set(wrapper, { position: "relative", top: "auto" });
        gsap.set(phone, { y: 0 });
        return;
      }

      gsap.set(wrapper, {
        position: "sticky",
        top: "7rem",
      });

      const sectionHeight = section.offsetHeight;
      const wrapperHeight = wrapper.offsetHeight;
      const offset = 200;
      const totalTravel = Math.max(0, sectionHeight - wrapperHeight - offset);

      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `bottom bottom-=${offset}`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const y = totalTravel * self.progress;
          gsap.set(phone, { y });
        },
        onRefresh: () => {
          const newSectionHeight = section.offsetHeight;
          const newWrapperHeight = wrapper.offsetHeight;
          // eslint-disable-next-line no-unused-vars
          const newTotalTravel = Math.max(
            0,
            newSectionHeight - newWrapperHeight - offset
          );
          self.end = `bottom bottom-=${offset}`;
        },
      });

      ScrollTrigger.refresh();
    };

    init();

    const handleResize = () => {
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(() => {
        init();
        ScrollTrigger.refresh();
      }, 100);
    };

    mq.addEventListener("change", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      mq.removeEventListener("change", handleResize);
      window.removeEventListener("resize", handleResize);
      clearTimeout(window.resizeTimer);
      if (st) st.kill();
      gsap.set([wrapper, phone], { clearProps: "all" });
    };
  }, [theme]);

  return (
    <>
      <style jsx>{`
        @keyframes triangle-fade {
          0% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }
        .animate-triangle-fade {
          animation: triangle-fade 1.05s ease-out forwards;
        }
      `}</style>
      <section
        ref={sectionRef}
        className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 bg-transition"
        style={bgStyle}
      >
        {/* Noise texture overlay - matched to ServicesSection */}
        {theme === "dark" && (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={noiseOverlayStyle}
          />
        )}

        {/* CURSOR TRAIL TRIANGLES */}
        {triangles.map((triangle) => (
          <div
            key={triangle.id}
            className="pointer-events-none absolute z-[5] animate-triangle-fade"
            style={{
              left: `${triangle.x}px`,
              top: `${triangle.y}px`,
              width: "0",
              height: "0",
              borderLeft: `${triangle.size / 2}px solid transparent`,
              borderRight: `${triangle.size / 2}px solid transparent`,
              borderBottom: `${triangle.size}px solid ${triangle.color}`,
              transform: `translate(-50%, -50%) rotate(${triangle.rotation}deg)`,
              opacity: 0.7,
            }}
          />
        ))}

        <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8">
          <div className="grid items-start gap-8 sm:gap-10 md:gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.7fr)]">
            {/* LEFT – Sticky Phone */}
            <div ref={phoneWrapperRef} className="relative lg:sticky lg:top-28 mb-8 lg:mb-0">
              <div
                ref={phoneRef}
                className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[380px] xl:max-w-[420px] mx-auto lg:mx-0"
              >
                <div
                  className={`relative overflow-hidden rounded-[24px] sm:rounded-[28px] md:rounded-[32px] border ${
                    theme === "dark"
                      ? "border-white/[0.06] bg-[#2a2a2a]"
                      : "border-black/[0.06] bg-white"
                  } shadow-[0_24px_60px_rgba(0,0,0,0.20)]`}
                >
                  <div className="relative h-[400px] sm:h-[480px] md:h-[520px] lg:h-[560px] xl:h-[600px]">
                    <Image
                      src="https://cdn.prod.website-files.com/67b320fe114d5e148783d276/68947cf33c69a1ceddbdf83d_Dapper%20Flash%20Photos-04.avif"
                      alt="Demand gen creative on mobile"
                      fill
                      sizes="(min-width: 1280px) 420px, (min-width: 1024px) 380px, 360px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <span className="pointer-events-none absolute -left-3 top-12 sm:-left-4 sm:top-14 md:-left-6 md:top-16 h-10 w-6 sm:h-12 sm:w-7 md:h-14 md:w-8 bg-[#74F5A1]" />
                <span className="pointer-events-none absolute left-10 -bottom-3 sm:left-12 sm:-bottom-4 md:left-16 md:-bottom-6 h-6 w-16 sm:h-8 sm:w-20 md:h-10 md:w-24 bg-[#74F5A1]" />
              </div>
            </div>

            {/* RIGHT – Content blocks */}
            <div className="space-y-8 sm:space-y-10 md:space-y-12">
              {DEMAND_BLOCKS.map((block) => (
                <article
                  key={block.id}
                  className={`rounded-xl sm:rounded-2xl border ${
                    theme === "dark"
                      ? "border-white/[0.06] bg-[#2a2a2a]"
                      : "border-black/[0.06] bg-white"
                  } px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-12 xl:px-20 xl:py-16 2xl:px-24 2xl:py-24 shadow-[0_18px_45px_rgba(0,0,0,0.10)]`}
                >
                  <header className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                    {/* Added demand-block-title class for electric animation */}
                    <h2
                      className={`hero-title-line font-[Helvetica Now Text,Arial,sans-serif] text-[24px] sm:text-[28px] md:text-[32px] lg:text-[44px] xl:text-[60px] 2xl:text-[75px] font-semibold tracking-tight ${
                        theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                      }`}
                    >
                      {block.label}
                    </h2>
                    <p
                      className={`mt-2 sm:mt-3 md:mt-4 font-ivy-presto italic text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[26px] 2xl:text-[28px] 3xl:text-[32px] ${
                        theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                      }`}
                    >
                      {block.tagline}
                    </p>
                  </header>
                  <div className="max-w-full lg:max-w-[800px] space-y-3 sm:space-y-4 md:space-y-5 font-[Helvetica Now Text,Arial,sans-serif]">
                    <p
                      className={`text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px] leading-relaxed font-semibold ${
                        theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"
                      }`}
                    >
                      {block.intro}
                    </p>
                    {block.body.map((p, i) => (
                      <p
                        key={i}
                        className={`text-[13px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] 2xl:text-[19px] 3xl:text-[20px] leading-relaxed ${
                          theme === "dark"
                            ? "text-[#a0a0a0]"
                            : "text-[#555555]"
                        }`}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                  <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-14">
                    <p
                      className={`text-[11px] sm:text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.18em] ${
                        theme === "dark" ? "text-[#a0a0a0]" : "text-[#777777]"
                      }`}
                    >
                      The result?
                    </p>
                    <ul className="mt-3 sm:mt-4 md:mt-6 space-y-2 sm:space-y-3 md:space-y-4">
                      {block.results.map((item) => (
                        <li key={item} className="flex items-start gap-2 sm:gap-3">
                          <span className="mt-[3px] h-4 w-4 sm:h-5 sm:w-5 shrink-0 rounded-md bg-[#74F5A1]" />
                          <span
                            className={`text-[13px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] ${
                              theme === "dark"
                                ? "text-[#f3f3f3]"
                                : "text-[#212121]"
                            }`}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 sm:mt-8 md:mt-10 flex justify-end">
                      <Link
                        href={block.href}
                        className={`group inline-flex items-center gap-2 rounded-[8px] sm:rounded-[10px] border ${
                          theme === "dark"
                            ? "border-white/10 bg-[#3a3a3a]"
                            : "border-black/10 bg-white"
                        } px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] font-semibold tracking-tight ${
                          theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                        } shadow-sm transition-transform duration-300 ease-out hover:scale-[1.10] hover:-translate-y-[1px]`}
                      >
                        Discover more
                        <span
                          className={`relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center overflow-hidden rounded-[4px] ${
                            theme === "dark"
                              ? "bg-[#74F5A1] group-hover:bg-white"
                              : "bg-[#74F5A1] group-hover:bg-black"
                          } transition-colors duration-500`}
                        >
                          <svg
                            className="absolute transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0"
                            width="10"
                            height="10"
                            className="sm:w-3 sm:h-3"
                            viewBox="0 0 14 14"
                            aria-hidden="true"
                          >
                            <path
                              d="M1 13L13 1M13 1H5M13 1V9"
                              fill="none"
                              stroke={theme === "dark" ? "#111111" : "#212121"}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <svg
                            className="absolute translate-x-[-10px] translate-y-[10px] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                            width="10"
                            height="10"
                            className="sm:w-3 sm:h-3"
                            viewBox="0 0 14 14"
                            aria-hidden="true"
                          >
                            <path
                              d="M1 13L13 1M13 1H5M13 1V9"
                              fill="none"
                              stroke={theme === "dark" ? "#111111" : "#74F5A1"}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}