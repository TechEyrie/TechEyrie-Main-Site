// components/AirvoirSection.jsx
"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Dark7V6ScrollTrigger, subscribeAfterScrollLayout } from "./lenisScrollTrigger";
import {
  DARK7_GRADIENTS,
  DARK7_GRADIENT_NOISE_STYLE,
} from "./dark7PageGradients";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const lightColors = { background: "#F9F7F0" };

function getBgStyle(theme) {
  return theme === "dark"
    ? { background: DARK7_GRADIENTS.lightBridge }
    : { backgroundColor: lightColors.background };
}

function getSurfaceClasses(theme) {
  const onLightSurface = theme === "dark";
  return {
    textPrimary: onLightSurface ? "text-[#111111]" : "text-[#111111]",
    divider: onLightSurface ? "border-black/10" : "border-black/10",
  };
}

function SectionOverlays() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1]"
      style={DARK7_GRADIENT_NOISE_STYLE}
      aria-hidden="true"
    />
  );
}

function AirvoirCtaButton({ label = "Explore Our Expertise", className = "" }) {
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <button
      type="button"
      className={`hero-cta-btn inline-flex cursor-pointer items-center justify-center px-5 py-2.5 font-merriweather text-[16px] font-light tracking-tight transition-colors duration-300 md:px-6 md:py-3 md:text-[18px] ${className} ${
        ctaHovered ? "text-[#F7F3F0]" : "text-[#162D24]"
      }`}
      style={{
        backgroundColor: ctaHovered ? "#162D24" : "#162D2433",
        borderRadius: "12px",
      }}
      onMouseEnter={() => setCtaHovered(true)}
      onMouseLeave={() => setCtaHovered(false)}
    >
      {label}
    </button>
  );
}

function MobileAirvoirSection({ theme }) {
  const bgStyle = getBgStyle(theme);
  const { textPrimary, divider } = getSurfaceClasses(theme);

  return (
    <div className="relative w-full max-w-full min-w-0 overflow-x-clip">
      <section
        className="dark7-v6-airvoir relative overflow-hidden transition-colors duration-500"
        style={bgStyle}
      >
        <SectionOverlays />

        <div className="relative z-10 w-full min-w-0">
          {/* Phase 1 */}
          <div className="mx-auto w-full min-w-0 max-w-5xl px-4 sm:px-6">
            <div className="py-14 sm:py-20 text-center">
              <div className="mb-3 sm:mb-4">
                <span
                  className={`airvoir-kicker font-merriweather italic font-semibold transition-colors duration-500 ${textPrimary}`}
                >
                  Welcome to Tech Eyrie
                </span>
              </div>
              <h1
                className={`real-problem-title-line font-italiana font-light leading-[1.05] tracking-[0.01em] transition-colors duration-500 mb-6 sm:mb-8 ${textPrimary}`}
              >
                Every interaction is a journey, resonating digital experiences
                into meaningful impact.
              </h1>
              <AirvoirCtaButton label="Explore Our Expertise" />
            </div>
          </div>

          <div className={`mx-4 sm:mx-6 border-t ${divider}`} />

          {/* Phase 2 */}
          <div className="mx-auto w-full min-w-0 max-w-5xl px-4 sm:px-6">
            <div className="py-14 sm:py-20 text-center">
              <h2
                className={`real-problem-title-line font-italiana font-light leading-[1.1] tracking-[0.01em] transition-colors duration-500 mb-6 sm:mb-8 ${textPrimary}`}
              >
                Every business needs clarity and understanding, At Tech Eyrie we
                carefully craft digital systems that would elevate your journey
                by turning complexity into remarkable journeys.
              </h2>
              <AirvoirCtaButton label="Explore Our Expertise" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DesktopAirvoirSection({ theme }) {
  const sectionRef = useRef(null);
  const eagleRef = useRef(null);
  const firstHeadingRef = useRef(null);
  const secondHeadingRef = useRef(null);

  const bgStyle = getBgStyle(theme);
  const { textPrimary } = getSurfaceClasses(theme);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const eagle = eagleRef.current;
    const firstHeading = firstHeadingRef.current;
    const secondHeading = secondHeadingRef.current;

    if (!section || !eagle || !firstHeading || !secondHeading) return;

    let unsubLayout = () => {};

    const ctx = gsap.context(() => {
      const build = () => {
        gsap.set(eagle, {
          x: () => -window.innerWidth / 2 - 900,
          y: 0,
          rotation: 0,
          scale: 1.1,
          opacity: 1,
        });

        gsap.set(firstHeading, { opacity: 1 });
        gsap.set(secondHeading, { opacity: 0 });

        ScrollTrigger.getById("dark7-v6-airvoir")?.kill();

        const mainTl = gsap.timeline({
          scrollTrigger: Dark7V6ScrollTrigger({
            id: "dark7-v6-airvoir",
            trigger: section,
            start: "top top",
            end: "+=100%",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            refreshPriority: -1,
          }),
        });

        const eagleDuration = 2.8;
        mainTl
          .to(
            eagle,
            {
              x: () => window.innerWidth / 2 + 1000,
              y: 0,
              scale: 1.5,
              rotation: 0,
              duration: eagleDuration,
              ease: "none",
            },
            0,
          )
          .to(
            firstHeading,
            {
              opacity: 0,
              duration: 0.2,
              ease: "power2.in",
            },
            eagleDuration * 0.4,
          )
          .to(
            secondHeading,
            {
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
            },
            eagleDuration * 0.45,
          );
      };

      unsubLayout = subscribeAfterScrollLayout(build);
    }, section);

    return () => {
      unsubLayout();
      ctx.revert();
    };
  }, [theme]);

  return (
    <section
      ref={sectionRef}
      className="dark7-v6-airvoir relative overflow-hidden transition-colors duration-500 min-h-screen"
      style={bgStyle}
    >
      <SectionOverlays />

      <div className="relative z-10 w-full h-screen flex items-center justify-center">
        <div
          ref={eagleRef}
          className="absolute w-[800px] h-[800px] md:w-[1000px] md:h-[1000px] lg:w-[1200px] lg:h-[1200px] z-[100]"
        >
          {/* Plane (top view) — commented for eagle test
          <Image
            src="https://cdn.prod.website-files.com/661fdce3e735db03332bf817/66223004372c7c1124c1b0d1_Top-view2x.webp"
            alt="Top view"
            fill
            className="object-contain"
            priority
          />
          */}
          <Image
            src="/eagle-pic-right2.png"
            alt="Eagle"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div
          ref={firstHeadingRef}
          className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6 md:px-8"
        >
          <div className="text-center max-w-5xl">
            <div className="mb-3 sm:mb-4">
              <span
                className={`airvoir-kicker font-merriweather italic font-semibold transition-colors duration-500 ${textPrimary}`}
              >
                Welcome to Tech Eyrie
              </span>
            </div>

            <h1
              className={`real-problem-title-line font-italiana font-light leading-[0.95] tracking-[0.01em] transition-colors duration-500 mb-6 sm:mb-8 ${textPrimary}`}
            >
              Every interaction is a journey, resonating digital experiences into
              meaningful impact.
            </h1>

            <AirvoirCtaButton label="Explore Our Expertise" />
          </div>
        </div>

        <div
          ref={secondHeadingRef}
          className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6 md:px-8 lg:px-12"
        >
          <div className="text-center max-w-5xl">
            <h2
              className={`real-problem-title-line font-italiana font-light leading-[1.1] tracking-[0.01em] transition-colors duration-500 mb-5 sm:mb-6 md:mb-8 ${textPrimary}`}
            >
              Every business needs clarity and understanding, At Tech Eyrie we
              carefully craft digital systems that would elevate your journey by
              turning complexity into remarkable journeys.
            </h2>

            <AirvoirCtaButton label="Explore Our Expertise" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AirvoirSection({ theme = "light" }) {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!isDesktop) {
    return <MobileAirvoirSection theme={theme} />;
  }

  return <DesktopAirvoirSection theme={theme} />;
}
