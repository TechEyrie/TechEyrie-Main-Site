// components/RealProblemSection.jsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function RealProblemSection({ theme = "light", sharedBackground = false }) {
  const containerRef = useRef(null);
  const titleContainerRef = useRef(null);
  const hasAnimatedInViewport = useRef(false);

  // Triangle animation effects - COMMENTED OUT
  // const [triangles, setTriangles] = useState([]);
  // const triangleIdRef = useRef(0);

  // Color Palettes
  const lightColors = {
    primary: "#013825",
    secondary: "#9E8F72",
    tertiary: "#CEC8B0",
    background: "#F9F7F0",
  };

  // Background styles based on theme
  // NOTE: original dark background kept for easy revert:
  // {
  //   background:
  //     "radial-gradient(ellipse at 15% 20%, #0a2e32 0%, #1b4732 45%, #162d24 100%)",
  // }
  const bgStyle = {
    backgroundColor: "#eceae6",
  };

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px)
    `,
  };

  // --- ELECTRIC ANIMATION LOGIC (ONCE PER VIEWPORT ENTRY) ---

  const triggerElectricalAnimation = useCallback(() => {
    const titleLines = document.querySelectorAll(".real-problem-title-line");

    // Keep heading animation strictly black (no white/green flashes)
    const originalColor = "#000000";
    const electricColor = "#000000";
    const brightElectricColor = "#000000";

    const tl = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
      },
    });

    titleLines.forEach((line, lineIndex) => {
      // ✅ Check if THIS LINE already has char elements
      if (!line.querySelector(".char")) {
        const text = line.textContent;
        const chars = text
          .split("")
          .map(
            (char, i) =>
              `<span class="char" style="display: inline-block; position: relative; color: #000000;" data-index="${i}">${
                char === " " ? "&nbsp;" : char
              }</span>`
          )
          .join("");
        line.innerHTML = chars;
      }
    });

    // Now animate the chars
    titleLines.forEach((line, lineIndex) => {
      const chars = line.querySelectorAll(".char");
      chars.forEach((char, charIndex) => {
        const baseDelay = lineIndex * 0.5 + charIndex * 0.06;
        const randomDelay = Math.random() * 0.1;
        const totalDelay = baseDelay + randomDelay;

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

    // Keep inline color locked to black.
  }, [theme]);

  // --- INTERSECTION OBSERVER FOR VIEWPORT DETECTION ---
  useEffect(() => {
    const titleContainer = titleContainerRef.current;
    if (!titleContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedInViewport.current) {
            // ✅ Trigger animation only once
            setTimeout(() => {
              triggerElectricalAnimation();
            }, 300);
            hasAnimatedInViewport.current = true;
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

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      /* ✅ REMOVED: subtle-glitch animation that was causing shivering */
      .char {
        transition: color 0.15s ease, transform 0.15s ease;
        will-change: color, transform;
        /* NO animation property - chars stay still after electrical effect */
      }
      .word { white-space: nowrap; display: inline-block; }

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

  // TRIANGLE CREATION FUNCTION - COMMENTED OUT
  // const createTriangle = useCallback((x, y) => {
  //   const id = triangleIdRef.current++;
  //   const size = Math.random() * 12 + 20;
  //   const rotation = Math.random() * 360;
  //   const greenShades = ["#c8c4bc", "#b0bab4", "#c8c4bc", "#2a5c48"];
  //   const color = greenShades[Math.floor(Math.random() * greenShades.length)];

  //   const newTriangle = {
  //     id,
  //     x,
  //     y,
  //     size,
  //     rotation,
  //     color,
  //   };

  //   setTriangles((prev) => [...prev, newTriangle]);

  //   setTimeout(() => {
  //     setTriangles((prev) => prev.filter((t) => t.id !== id));
  //   }, 1050);
  // }, []);

  // MOUSE MOVE EFFECT - COMMENTED OUT
  // useEffect(() => {
  //   const section = containerRef.current?.closest("section");
  //   if (!section) return;

  //   let lastTime = 0;
  //   const throttleDelay = 100;

  //   const handleMouseMove = (e) => {
  //     const currentTime = Date.now();
  //     if (currentTime - lastTime < throttleDelay) return;
  //     lastTime = currentTime;

  //     const rect = section.getBoundingClientRect();
  //     const x = e.clientX - rect.left;
  //     const y = e.clientY - rect.top;

  //     createTriangle(x, y);
  //   };

  //   section.addEventListener("mousemove", handleMouseMove);

  //   return () => {
  //     section.removeEventListener("mousemove", handleMouseMove);
  //   };
  // }, [createTriangle]);

  return (
    <>
      {/* TRIANGLE ANIMATION STYLES - COMMENTED OUT */}
      {/* <style jsx>{`
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
      `}</style> */}

      <section
        ref={containerRef}
        className="real-problem-section relative overflow-hidden py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-24 bg-transition"
        style={sharedBackground ? { background: "transparent", backgroundColor: "transparent" } : bgStyle}
      >
        {/* Noise texture overlay */}
        {theme === "dark" && !sharedBackground && (
          <>
            <div
              className="absolute inset-0 pointer-events-none z-[1]"
              style={noiseOverlayStyle}
            />
            {/* Soft top/bottom teal gradients removed as requested.
                Original top gradient:
                <div className="absolute inset-x-0 top-0 h-32 sm:h-40 md:h-48 pointer-events-none z-[2]" style={{
                  background: "linear-gradient(to bottom, rgba(10,46,50,0.9) 0%, rgba(10,46,50,0) 100%)",
                }} />
                Original bottom gradient:
                <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-48 pointer-events-none z-[2]" style={{
                  background: "linear-gradient(to top, rgba(10,46,50,0.9) 0%, rgba(10,46,50,0) 100%)",
                }} /> */}
          </>
        )}

        {/* CURSOR TRAIL TRIANGLES - COMMENTED OUT */}
        {/* {triangles.map((triangle) => (
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
        ))} */}

        <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col justify-center min-h-full">
          {/* Label above everything */}
          <div className="mb-6 sm:mb-7 md:mb-8 lg:mb-10 flex items-center gap-2 sm:gap-3">
            <span className="dark7-luxury-gem inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-sm" />
            <span className="font-merriweather text-[11px] sm:text-[12px] md:text-[13px] lg:text-[16px] font-semibold tracking-[0.16em] text-black" style={{ color: "#000000" }}>
              The real problem is
            </span>
          </div>

          {/* Heading left, copy/CTA right */}
          <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <div ref={titleContainerRef}>
              <h2 className="leading-[1.02] tracking-[0.01em] text-black" style={{ color: "#000000" }}>
                <span className="real-problem-title-line block font-italiana font-light tracking-[0.01em] text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] 2xl:text-[82px]">
                  Most businesses don&apos;t
                </span>
                <span className="real-problem-title-line block font-italiana font-light tracking-[0.01em] text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] 2xl:text-[82px]">
                  have a tool problem,
                </span>
                <span className="real-problem-title-line block font-playfair font-semibold italic text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] 2xl:text-[82px]">
                  they have a systems
                </span>
                <span className="real-problem-title-line block font-playfair font-semibold italic text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] 2xl:text-[82px]">
                  problem
                </span>
              </h2>
            </div>

            <div className="flex flex-col gap-5 sm:gap-6 md:gap-7 lg:max-w-[600px] mt-4 sm:mt-6 md:mt-8 lg:mt-16">
              <p className="font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-normal leading-relaxed text-black" style={{ color: "#000000" }}>
              Growth is a story told with intention, executed through systems, and valued by results. We craft frameworks and workflows that elevate your tech stack(low competition) into Precision Growth Engine. Every action drives impact, every campaign fuels the pipeline, every decision shapes your trajectory.


              </p>

              <p className="font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-normal leading-relaxed text-black" style={{ color: "#000000" }}>
              Building framework, processes and workflows that will unlock your tech stack into a high-performing marketing engine ready for growth. Strategy leads, tools follow. 

              </p>

              <Link
                href="/services"
                className="dark7-luxury-pill-cta contact-submit group inline-flex items-center justify-center self-start rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px] mt-2 sm:mt-3"
              >
                <span className="font-merriweather text-[13px] sm:text-[14px] md:text-[15px] font-semibold tracking-wide">
                  Our services
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
