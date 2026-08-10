// components/AirvoirSection.jsx
"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Dark7V38ScrollTrigger, subscribeAfterScrollLayout } from "./lenisScrollTrigger";
import {
  DARK7_GRADIENTS,
  DARK7_GRADIENT_NOISE_STYLE,
} from "./dark7PageGradients";
import AirvoirDragonScene from "./AirvoirDragonScene";

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
  return {
    textPrimary: "text-[#162D24]",
    divider: "border-black/10",
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
      className={`hero-cta-btn inline-flex cursor-pointer items-center justify-center px-5 py-2.5 font-merriweather text-[16px] font-light tracking-[0.06em] transition-colors duration-300 md:px-6 md:py-3 md:text-[18px] ${className} ${
        ctaHovered ? "text-[#F7F3F0]" : "text-[#162D24]"
      }`}
      style={{
        backgroundColor: ctaHovered ? "#162D24" : "#EFECEA",
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
    <div className="relative w-full max-w-full min-w-0 overflow-x-clip -mt-px">
      <section
        className="dark7-v38-airvoir relative overflow-hidden transition-colors duration-500"
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
  const firstHeadingRef = useRef(null);
  const secondHeadingRef = useRef(null);
  const dragonProgressRef = useRef(0);

  const bgStyle = getBgStyle(theme);
  const { textPrimary } = getSurfaceClasses(theme);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const firstHeading = firstHeadingRef.current;
    const secondHeading = secondHeadingRef.current;

    if (!section || !firstHeading || !secondHeading) return;

    let unsubLayout = () => {};
    let built = false;

    const ctx = gsap.context(() => {
      const build = () => {
        // Build once — re-killing the pin mid-scroll is what ejects you permanently.
        if (built) return;
        built = true;

        gsap.set(firstHeading, { opacity: 1 });
        gsap.set(secondHeading, { opacity: 0 });

        ScrollTrigger.getById("dark7-v38-airvoir")?.kill();

        const mainTl = gsap.timeline({
          scrollTrigger: Dark7V38ScrollTrigger({
            id: "dark7-v38-airvoir",
            trigger: section,
            start: "top top",
            end: "+=140%",
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
            pinType: "transform",
            anticipatePin: 1,
            // Keep measured start/end — hard remeasure mid-pause dumps the pin.
            invalidateOnRefresh: false,
            refreshPriority: -1,
            onUpdate: (self) => {
              dragonProgressRef.current = self.progress;
            },
            onRefresh: (self) => {
              dragonProgressRef.current = self.progress;
              mainTl.progress(self.progress);
            },
          }),
        });

        // Timeline only drives headings; dragon uses ScrollTrigger.progress above.
        mainTl
          .to(
            firstHeading,
            {
              opacity: 0,
              duration: 0.2,
              ease: "power2.in",
            },
            0.4,
          )
          .to(
            secondHeading,
            {
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
            },
            0.45,
          )
          .to({}, { duration: 0.25 }, 0.75);
      };

      unsubLayout = subscribeAfterScrollLayout(build);
    }, section);

    return () => {
      unsubLayout();
      built = false;
      ctx.revert();
    };
  }, [theme]);

  return (
    <section
      ref={sectionRef}
      className="dark7-v38-airvoir relative -mt-px overflow-hidden transition-colors duration-500 min-h-screen"
      style={bgStyle}
    >
      <SectionOverlays />

      <div className="relative z-10 w-full h-screen flex items-center justify-center">
        {/* Text sits under the eagle; CTA still clickable via pointer-events-none on the 3D layer */}
        <div
          ref={firstHeadingRef}
          className="absolute inset-0 flex items-center justify-center z-[10] px-4 sm:px-6 md:px-8"
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
          className="absolute inset-0 flex items-center justify-center z-[10] px-4 sm:px-6 md:px-8 lg:px-12"
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

        <div className="pointer-events-none absolute inset-0 z-[120] w-full h-full">
          <AirvoirDragonScene progressRef={dragonProgressRef} className="w-full h-full" />
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
