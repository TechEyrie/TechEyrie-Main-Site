// components/AirvoirSection.jsx
"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const lightColors = { background: "#F9F7F0" };

function getBgStyle(theme) {
  return theme === "dark"
    ? {
        background:
          "radial-gradient(ellipse at 15% 20%, #0a2e32 0%, #1b4732 45%, #162d24 100%)",
      }
    : { backgroundColor: lightColors.background };
}

const noiseOverlayStyle = {
  backgroundImage: `
    repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
    repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
    repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.015) 2px, rgba(0, 0, 0, 0.015) 4px)
  `,
};

function SectionOverlays({ theme }) {
  if (theme !== "dark") return null;
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={noiseOverlayStyle}
      />
      <div
        className="absolute inset-x-0 top-0 h-28 sm:h-32 pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,46,50,0.45) 0%, rgba(10,46,50,0) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 sm:h-36 pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(to top, rgba(22,45,36,0.7) 0%, rgba(22,45,36,0) 100%)",
        }}
      />
    </>
  );
}

function BookFlightButton({ label = "Book your flight" }) {
  return (
    <button
      type="button"
      className="group inline-flex max-w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px]"
      style={{ backgroundColor: "#1e3d30" }}
    >
      <svg
        className="h-5 w-5 shrink-0 text-white"
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
      <span className="font-merriweather text-[13px] sm:text-[14px] font-semibold tracking-wide text-white">
        {label}
      </span>
    </button>
  );
}

function MobileAirvoirSection({ theme }) {
  const bgStyle = getBgStyle(theme);
  const textPrimary = theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]";
  const divider = theme === "dark" ? "border-white/10" : "border-black/10";

  return (
    <div className="relative w-full max-w-full min-w-0 overflow-x-clip">
      <section
        className="relative overflow-hidden transition-colors duration-500"
        style={bgStyle}
      >
        <SectionOverlays theme={theme} />

        <div className="relative z-10 w-full min-w-0">
          {/* Phase 1 */}
          <div className="mx-auto w-full min-w-0 max-w-5xl px-4 sm:px-6">
            <div className="py-14 sm:py-20 text-center">
              <div className="mb-3 sm:mb-4">
                <span
                  className={`font-merriweather italic font-semibold text-[14px] sm:text-[16px] transition-colors duration-500 ${textPrimary}`}
                >
                  Welcome to Tech Eyrie
                </span>
              </div>
              <h1
                className={`font-italiana font-light text-[26px] sm:text-[32px] leading-[1.05] tracking-[0.01em] transition-colors duration-500 mb-6 sm:mb-8 ${textPrimary}`}
              >
                Every interaction is a journey, resonating digital experiences
                into meaningful impact.
              </h1>
              <BookFlightButton label="Book your flight" />
            </div>
          </div>

          <div className={`mx-4 sm:mx-6 border-t ${divider}`} />

          {/* Phase 2 */}
          <div className="mx-auto w-full min-w-0 max-w-5xl px-4 sm:px-6">
            <div className="py-14 sm:py-20 text-center">
              <h2
                className={`font-italiana font-light text-[18px] sm:text-[22px] leading-[1.35] tracking-[0.01em] transition-colors duration-500 mb-6 sm:mb-8 ${textPrimary}`}
              >
                Every business needs clarity and understanding, At Tech Eyrie we
                carefully craft digital systems that would elevate your journey
                by turning complexity into remarkable journeys.
              </h2>
              <BookFlightButton label="Book a flight" />
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
  const textPrimary = theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]";

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const eagle = eagleRef.current;
    const firstHeading = firstHeadingRef.current;
    const secondHeading = secondHeadingRef.current;

    if (!section || !eagle || !firstHeading || !secondHeading) return;

    const ctx = gsap.context(() => {
      gsap.set(eagle, {
        x: () => -window.innerWidth / 2 - 900,
        y: 0,
        rotation: 0,
        scale: 1.1,
        opacity: 1,
      });

      gsap.set(firstHeading, { opacity: 1 });
      gsap.set(secondHeading, { opacity: 0 });

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
          0
        )
        .to(
          firstHeading,
          {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
          },
          eagleDuration * 0.4
        )
        .to(
          secondHeading,
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          eagleDuration * 0.45
        );
    }, section);

    return () => ctx.revert();
  }, [theme]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden transition-colors duration-500 min-h-screen"
      style={bgStyle}
    >
      <SectionOverlays theme={theme} />

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
                className={`font-merriweather italic font-semibold text-[20px] lg:text-[24px] transition-colors duration-500 ${textPrimary}`}
              >
                Welcome to Tech Eyrie
              </span>
            </div>

            <h1
              className={`font-italiana font-light text-[34px] lg:text-[40px] xl:text-[48px] 2xl:text-[56px] leading-[0.95] tracking-[0.01em] transition-colors duration-500 mb-6 sm:mb-8 ${textPrimary}`}
            >
              Every interaction is a journey, resonating digital experiences into
              meaningful impact.
            </h1>

            <BookFlightButton label="Book your flight" />
          </div>
        </div>

        <div
          ref={secondHeadingRef}
          className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6 md:px-8 lg:px-12"
        >
          <div className="text-center max-w-5xl">
            <h2
              className={`font-italiana font-light text-[22px] lg:text-[26px] xl:text-[30px] 2xl:text-[34px] leading-[1.3] tracking-[0.01em] transition-colors duration-500 mb-5 sm:mb-6 md:mb-8 ${textPrimary}`}
            >
              Every business needs clarity and understanding, At Tech Eyrie we
              carefully craft digital systems that would elevate your journey by
              turning complexity into remarkable journeys.
            </h2>

            <BookFlightButton label="Book a flight" />
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
