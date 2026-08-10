// components/RealProblemSection.jsx
"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import {
  DARK7_GRADIENTS,
  DARK7_GRADIENT_NOISE_STYLE,
} from "./dark7PageGradients";

export default function RealProblemSection({ theme = "light", sharedBackground = false }) {
  const containerRef = useRef(null);
  const titleContainerRef = useRef(null);
  const hasAnimatedInViewport = useRef(false);
  const [ctaHovered, setCtaHovered] = useState(false);

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
  //     "radial-gradient(ellipse at 15% 20%, #005160 0%, #1b4732 45%, #162d24 100%)",
  // }
  const bgStyle = {
    background: DARK7_GRADIENTS.realProblem,
  };

  const noiseOverlayStyle = DARK7_GRADIENT_NOISE_STYLE;

  const triggerFadeInAnimation = useCallback(() => {
    const targets = containerRef.current?.querySelectorAll(".real-problem-fade");
    if (!targets?.length) return;

    gsap.fromTo(
      targets,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      },
    );
  }, []);

  useLayoutEffect(() => {
    const targets = containerRef.current?.querySelectorAll(".real-problem-fade");
    if (!targets?.length) return;
    gsap.set(targets, { opacity: 0, y: 28 });
  }, []);

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedInViewport.current) {
            hasAnimatedInViewport.current = true;
            triggerFadeInAnimation();
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, [triggerFadeInAnimation]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .bg-transition {
        transition: background-color 0.5s ease, border-color 0.5s ease;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // TRIANGLE CREATION FUNCTION - COMMENTED OUT
  // const createTriangle = useCallback((x, y) => {
  //   const id = triangleIdRef.current++;
  //   const size = Math.random() * 12 + 20;
  //   const rotation = Math.random() * 360;
  //   const greenShades = ["#74F5A1", "#5FE08D", "#4DD97F", "#3BC972"];
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
        className="real-problem-section relative z-[1] overflow-hidden py-0 bg-transition"
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
                  background: "linear-gradient(to bottom, rgba(0,81,96,0.9) 0%, rgba(0,81,96,0) 100%)",
                }} />
                Original bottom gradient:
                <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-48 pointer-events-none z-[2]" style={{
                  background: "linear-gradient(to top, rgba(0,81,96,0.9) 0%, rgba(0,81,96,0) 100%)",
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
          <div className="real-problem-fade mb-6 flex items-center gap-2 sm:mb-7 sm:gap-3 md:mb-8 lg:mb-10">
            <Image
              src="/feather-heading.png"
              alt=""
              width={40}
              height={40}
              className="h-5 w-auto shrink-0 sm:h-6 md:h-7 lg:h-8"
              aria-hidden
            />
            <span
              className="dark7-v39-section-eyebrow font-playfair font-normal text-[#162D24]"
              style={{ color: "#162D24" }}
            >
              The real problem is
            </span>
          </div>

          {/* Heading left, copy/CTA right */}
          <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <div ref={titleContainerRef}>
              <h2 className="leading-[1.02] tracking-[0.01em] text-[#162D24]" style={{ color: "#162D24" }}>
                <span className="real-problem-fade real-problem-title-line block font-italiana font-light tracking-[0.01em]">
                  Most businesses don&apos;t
                </span>
                <span className="real-problem-fade real-problem-title-line block font-italiana font-light tracking-[0.01em]">
                  have a tool problem,
                </span>
                <span className="real-problem-fade real-problem-title-line block font-playfair font-light italic">
                  they have a systems
                </span>
                <span className="real-problem-fade real-problem-title-line block font-playfair font-light italic">
                  problem
                </span>
              </h2>
            </div>

            <div className="flex flex-col gap-5 sm:gap-6 md:gap-7 lg:max-w-[600px] mt-4 sm:mt-6 md:mt-8 lg:mt-16">
              <p className="real-problem-fade real-problem-description font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-light leading-relaxed text-[#162D24]" style={{ color: "#162D24" }}>
              Growth is a story told with intention, executed through systems, and valued by results. We craft frameworks and workflows that elevate your tech stack(low competition) into Precision Growth Engine. Every action drives impact, every campaign fuels the pipeline, every decision shapes your trajectory.


              </p>

              <p className="real-problem-fade real-problem-description font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-light leading-relaxed text-[#162D24]" style={{ color: "#162D24" }}>
              Building framework, processes and workflows that will unlock your tech stack into a high-performing marketing engine ready for growth. Strategy leads, tools follow. 

              </p>

              <Link
                href="/services"
                className={`real-problem-fade hero-cta-btn mt-2 inline-flex cursor-pointer items-center justify-center self-start px-5 py-2.5 font-merriweather text-[16px] font-light tracking-tight transition-colors duration-300 sm:mt-3 md:px-6 md:py-3 md:text-[18px] ${
                  ctaHovered
                    ? "text-[#F7F3F0]"
                    : theme === "dark"
                      ? "text-[#F7F3F0]"
                      : "text-[#162D24]"
                }`}
                style={{
                  backgroundColor: ctaHovered ? "#162D24" : "#EFECEA",
                  borderRadius: "12px",
                }}
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
