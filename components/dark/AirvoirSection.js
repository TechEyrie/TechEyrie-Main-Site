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
  const textSectionRef = useRef(null);
  const eagleSectionRef = useRef(null);
  const eagleRef = useRef(null);
  const behindHeadingRef = useRef(null);
  const behindButtonRef = useRef(null);
  const welcomeTextRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaButtonsRef = useRef(null);

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
    const textSection = textSectionRef.current;
    const eagleSection = eagleSectionRef.current;
    const eagle = eagleRef.current;
    const behindHeading = behindHeadingRef.current;
    const behindButton = behindButtonRef.current;
    const welcomeText = welcomeTextRef.current;
    const tagline = taglineRef.current;
    const ctaButtons = ctaButtonsRef.current;

    if (!section || !textSection || !eagleSection || !eagle || !behindHeading || !behindButton || !welcomeText || !tagline || !ctaButtons) return;

    const ctx = gsap.context(() => {
      // Text entrance animations
      gsap.set([welcomeText, tagline, ctaButtons], { opacity: 0, y: 30 });

      const textEntranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: textSection,
          start: "top 70%",
          end: "top 30%",
          once: true,
        },
      });

      textEntranceTl
        .to(welcomeText, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        })
        .to(
          tagline,
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .to(
          ctaButtons,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        );

      // Eagle and behind heading entrance
      gsap.set([eagle, behindHeading, behindButton], { opacity: 0, scale: 0.8 });

      const eagleEntranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: eagleSection,
          start: "top 80%",
          end: "top 50%",
          once: true,
        },
      });

      eagleEntranceTl
        .to(behindHeading, {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
        })
        .to(behindButton, {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
        }, "-=1.3")
        .to(eagle, {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
        }, "-=1.2");

      // Pin eagle and fly it off screen
      const flyTl = gsap.timeline({
        scrollTrigger: {
          trigger: eagleSection,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      flyTl
        .to(eagle, {
          x: () => window.innerWidth + 600,
          y: -100,
          rotation: 15,
          scale: 1.3,
          duration: 0.85,
          ease: "power1.inOut",
        }, 0)
        .to(eagle, {
          opacity: 0,
          duration: 0.15,
          ease: "power2.out",
        }, 0.85);
    }, section);

    return () => ctx.revert();
  }, [theme]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden transition-colors duration-500"
      style={bgStyle}
    >
      {theme === "dark" && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={noiseOverlayStyle}
        />
      )}

      {/* TEXT SECTION - REDUCED HEIGHT */}
      <div
        ref={textSectionRef}
        className="relative z-10 min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center px-4 sm:px-6 md:px-8"
      >
        <div className="text-center">
          {/* Welcome Text */}
          <div ref={welcomeTextRef} className="mb-4 sm:mb-6">
            <span
              className={`font-merriweather italic font-semibold text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] transition-colors duration-500 ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
              }`}
            >
              Welcome to Airvoir
            </span>
          </div>

          {/* Main Tagline */}
          <div ref={taglineRef} className="mb-8 sm:mb-12">
            <h1
              className={`font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] 2xl:text-[82px] 3xl:text-[90px] leading-[0.95] tracking-tight transition-colors duration-500 max-w-5xl mx-auto ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
              }`}
            >
              Where journeys become unforgettable
            </h1>
          </div>

          {/* CTA Buttons */}
          <div ref={ctaButtonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                theme === "dark"
                  ? "bg-[#f3f3f3] text-[#111111] hover:bg-[#e0e0e0]"
                  : "bg-[#111111] text-[#f3f3f3] hover:bg-[#2b2b2b]"
              }`}
            >
              <svg
                className="w-5 h-5"
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
              Book your flight
            </button>
          </div>
        </div>

  
        
      </div>

      {/* EAGLE SECTION - NEGATIVE MARGIN TO REDUCE GAP */}
      <div
        ref={eagleSectionRef}
        className="relative z-10 min-h-[70vh] flex items-center justify-center overflow-hidden -mt-20 sm:-mt-32 md:-mt-40"
      >
        {/* Heading and Button Behind Eagle */}
        <div className="absolute inset-0 flex items-center justify-center z-5 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center">
            {/* Heading */}
            <h2
              ref={behindHeadingRef}
              className={`font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] leading-[1.2] tracking-tight transition-colors duration-500 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[70%] mx-auto mb-6 sm:mb-8 md:mb-10 ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
              }`}
            >
              Discover corporate air travel redefined. Experience personalized service, every step of the way.
            </h2>

            {/* Button */}
            <div ref={behindButtonRef}>
              <button
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  theme === "dark"
                    ? "bg-[#f3f3f3] text-[#111111] hover:bg-[#e0e0e0]"
                    : "bg-[#111111] text-[#f3f3f3] hover:bg-[#2b2b2b]"
                }`}
              >
                <svg
                  className="w-5 h-5"
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
                Book a flight
              </button>
            </div>
          </div>
        </div>

        {/* Eagle Image - Higher z-index to appear on top */}
        <div ref={eagleRef} className="relative z-10 w-[600px] h-[600px] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px]">
          <Image
            src="/eagle-pic-right2.png"
            alt="Eagle"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
