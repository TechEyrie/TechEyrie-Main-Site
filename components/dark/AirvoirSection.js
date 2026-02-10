// components/AirvoirSection.jsx
"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AirvoirSection({ theme = "light" }) {
  const sectionRef = useRef(null);
  const eagleRef = useRef(null);
  const firstHeadingRef = useRef(null);
  const secondHeadingRef = useRef(null);

  const lightColors = {
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

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const eagle = eagleRef.current;
    const firstHeading = firstHeadingRef.current;
    const secondHeading = secondHeadingRef.current;

    if (!section || !eagle || !firstHeading || !secondHeading) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(eagle, {
        x: () => -window.innerWidth / 2 - 300,
        y: 0,
        scale: 0.8,
        opacity: 1,
      });
      
      // Keep the first heading visible as soon as the
      // user reaches this section to avoid an empty gap.
      gsap.set(firstHeading, { opacity: 1 });
      gsap.set(secondHeading, { opacity: 0 });

      // Main timeline with ScrollTrigger
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // One continuous eagle move: extreme left → extreme right (no stop at center)
      const eagleDuration = 2.8;
      mainTl
        .to(eagle, {
          x: () => window.innerWidth / 2 + 500,
          y: -50,
          scale: 1.2,
          rotation: 15,
          duration: eagleDuration,
          ease: "none",
        }, 0)
        // Content swap as eagle passes center (~halfway through scroll)
        .to(firstHeading, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        }, eagleDuration * 0.4)
        .to(secondHeading, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        }, eagleDuration * 0.45);
    }, section);

    return () => ctx.revert();
  }, [theme]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden transition-colors duration-500 min-h-screen"
      style={bgStyle}
    >
      {theme === "dark" && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={noiseOverlayStyle}
        />
      )}

      {/* Container for all content */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center">
        
        {/* Eagle Image - on top of all section content */}
        <div 
          ref={eagleRef} 
          className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px] z-[100]"
        >
          <Image
            src="/eagle-pic-right2.png"
            alt="Eagle"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* First Heading Content */}
        <div 
          ref={firstHeadingRef}
          className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6 md:px-8"
        >
          <div className="text-center max-w-5xl">
            <div className="mb-4 sm:mb-6">
              <span
                className={`font-merriweather italic font-semibold text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] transition-colors duration-500 ${
                  theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                }`}
              >
                Welcome to Airvoir
              </span>
            </div>

            <h1
              className={`font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] 3xl:text-[80px] leading-[0.95] tracking-[0.01em] transition-colors duration-500 mb-8 sm:mb-12 ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
              }`}
            >
              Where journeys become unforgettable
            </h1>

            <button
              type="button"
              className="group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px]"
              style={{ backgroundColor: '#12685b' }}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span className="font-merriweather text-[13px] sm:text-[14px] md:text-[15px] font-semibold tracking-wide text-white">
                Book your flight
              </span>
            </button>
          </div>
        </div>

        {/* Second Heading Content */}
        <div 
          ref={secondHeadingRef}
          className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6 md:px-8 lg:px-12"
        >
          <div className="text-center max-w-5xl">
            <h2
              className={`font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] 3xl:text-[80px] leading-[1.2] tracking-[0.01em] transition-colors duration-500 mb-6 sm:mb-8 md:mb-10 ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
              }`}
            >
              Discover corporate air travel redefined. Experience personalized service, every step of the way.
            </h2>

            <button
              type="button"
              className="group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px]"
              style={{ backgroundColor: '#12685b' }}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span className="font-merriweather text-[13px] sm:text-[14px] md:text-[15px] font-semibold tracking-wide text-white">
                Book a flight
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
