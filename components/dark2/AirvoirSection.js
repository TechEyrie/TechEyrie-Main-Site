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
          background:
            "radial-gradient(ellipse at 15% 20%, #005160 0%, #1b4732 45%, #162d24 100%)",
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
      // Set initial states - start off-screen left, no rotation
      gsap.set(eagle, {
        x: () => -window.innerWidth / 2 - 900,
        y: 0,
        rotation: 0,
        scale: 1.1,
        opacity: 1,
      });
      
      // Keep the first heading visible as soon as the
      // user reaches this section to avoid an empty gap.
      gsap.set(firstHeading, { opacity: 1 });
      gsap.set(secondHeading, { opacity: 0 });

      // Main timeline with ScrollTrigger (shorter scroll = plane passes faster)
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Plane moves straight left → right, no rotation
      const eagleDuration = 2.8;
      mainTl
        .to(eagle, {
          x: () => window.innerWidth / 2 + 1000,
          y: 0,
          scale: 1.5,
          rotation: 0,
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
        
        {/* Top view image - on top of all section content */}
        <div 
          ref={eagleRef} 
          className="absolute w-[800px] h-[800px] md:w-[1000px] md:h-[1000px] lg:w-[1200px] lg:h-[1200px] z-[100]"
        >
          <Image
            src="https://cdn.prod.website-files.com/661fdce3e735db03332bf817/66223004372c7c1124c1b0d1_Top-view2x.webp"
            alt="Top view"
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
            <div className="mb-3 sm:mb-4">
              <span
                className={`font-merriweather italic font-semibold text-[14px] sm:text-[18px] md:text-[20px] lg:text-[24px] transition-colors duration-500 ${
                  theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                }`}
              >
                Welcome to Airvoir
              </span>
            </div>

            <h1
              className={`font-italiana font-light text-[24px] sm:text-[28px] md:text-[34px] lg:text-[40px] xl:text-[48px] 2xl:text-[56px] 3xl:text-[64px] leading-[0.95] tracking-[0.01em] transition-colors duration-500 mb-6 sm:mb-8 ${
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
              className={`font-italiana font-light text-[17px] sm:text-[19px] md:text-[22px] lg:text-[26px] xl:text-[30px] 2xl:text-[34px] 3xl:text-[38px] leading-[1.3] tracking-[0.01em] transition-colors duration-500 mb-5 sm:mb-6 md:mb-8 ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
              }`}
            >
              Discover corporate air travel redefined.
              <br />
              Experience personalized service, every step of the way.
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
