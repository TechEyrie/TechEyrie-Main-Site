"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSectionMediaSlot from "./HeroSectionMediaSlot";
import LuxuryGoldPearls from "./LuxuryGoldPearls";
import RealProblemSection from "./RealProblemSection";
import NewServicesSection from "./NewServicesSection";
import { dark7MainSurfaceStyle } from "./dark7PageSurface";
import HeroVersion2 from './HeroVersion2';
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroProblemServicesCombined({ theme = "light" }) {
  const wrapperRef = useRef(null);
  const heroWrapRef = useRef(null);
  const servicesWrapRef = useRef(null);
  const midMarkerRef = useRef(null);

  const heroOrbRef = useRef(null);
  const servicesOrbRef = useRef(null);
  const midOrbRef = useRef(null);

  const heroNoiseRef = useRef(null);
  const servicesNoiseRef = useRef(null);
  const midNoiseRef = useRef(null);

  const bgStyle = useMemo(
    () => (theme === "dark" ? dark7MainSurfaceStyle : { backgroundColor: "#F9F7F0" }),
    [theme],
  );

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    // Kill any stale animations/tweens when theme changes.
    gsap.killTweensOf([
      heroOrbRef.current,
      servicesOrbRef.current,
      midOrbRef.current,
      heroNoiseRef.current,
      servicesNoiseRef.current,
      midNoiseRef.current,
    ]);

    if (theme !== "dark") return;

    // Ensure initial state. Middle glow must be visible immediately
    // (inline opacity starts at 0, so this prevents it from looking "missing").
    gsap.set(heroOrbRef.current, { opacity: 0.38 });
    gsap.set(servicesOrbRef.current, { opacity: 0.02 });
    gsap.set(midOrbRef.current, { opacity: 0.12 });

    gsap.set(heroNoiseRef.current, { opacity: 0.07 });
    gsap.set(servicesNoiseRef.current, { opacity: 0.07 });
    gsap.set(midNoiseRef.current, { opacity: 0.09 });

    const setupSectionTrigger = ({
      triggerEl,
      orbEl,
      noiseEl,
      start,
      end,
      baseY,
      xAmplitude,
    }) => {
      if (!triggerEl || !orbEl) return null;

      return ScrollTrigger.create({
        trigger: triggerEl,
        start,
        end,
        scrub: 0.7,
        onUpdate: (self) => {
          const p = self.progress; // 0..1

          // Circle glow "pulse": peaks in the middle of scroll through that section.
          const pulse = Math.pow(Math.sin(p * Math.PI), 0.75); // 0..1

          // Left/right drift across the scroll – from center → off-screen.
          const xShift = p * xAmplitude; // 0..+amp (direction handled by amplitude sign)
          const yShift = (0.25 - Math.abs(p - 0.5)) * 18; // small bump near middle

          // Move & strengthen the orb.
          gsap.set(orbEl, {
            opacity: 0.08 + pulse * 0.98,
            x: xShift,
            y: yShift,
            scale: 0.62 + pulse * 0.65,
            filter: `blur(${15 - pulse * 6}px)`,
          });

          // Move the noise layer with the same xShift so the texture feels alive.
          if (noiseEl) {
            gsap.set(noiseEl, {
              x: xShift * 0.35,
              y: yShift * 0.25 + baseY,
              opacity: 0.05 + pulse * 0.1,
            });
          }

        },
        onRefresh: (self) => {
          // Apply once on refresh so the glow is visible without waiting for
          // the first scroll tick.
          const p = self.progress;
          const pulse = Math.pow(Math.sin(p * Math.PI), 0.75);
          const xShift = p * xAmplitude;
          const yShift = (0.25 - Math.abs(p - 0.5)) * 18;

          gsap.set(orbEl, {
            opacity: 0.08 + pulse * 0.98,
            x: xShift,
            y: yShift,
            scale: 0.62 + pulse * 0.65,
            filter: `blur(${15 - pulse * 6}px)`,
          });

          if (noiseEl) {
            gsap.set(noiseEl, {
              x: xShift * 0.35,
              y: yShift * 0.25 + baseY,
              opacity: 0.05 + pulse * 0.1,
            });
          }
        },
      });
    };

    const heroTrigger = setupSectionTrigger({
      triggerEl: heroWrapRef.current,
      orbEl: heroOrbRef.current,
      noiseEl: heroNoiseRef.current,
      start: "top 40%",
      end: "bottom 10%",
      baseY: 100,
      xAmplitude: 860, // stronger drift → faster to the right
    });

    const servicesTrigger = setupSectionTrigger({
      triggerEl: servicesWrapRef.current,
      orbEl: servicesOrbRef.current,
      noiseEl: servicesNoiseRef.current,
      start: "top 85%",
      end: "bottom 15%",
      baseY: 0,
      xAmplitude: -240, // negative → move to the left
    });

    const midTrigger = setupSectionTrigger({
      triggerEl: midMarkerRef.current,
      orbEl: midOrbRef.current,
      noiseEl: midNoiseRef.current,
      start: "top 120%",
      end: "bottom 10%",
      baseY: 0,
      xAmplitude: -520, // move from center towards the left off-screen
    });

    return () => {
      heroTrigger && heroTrigger.kill();
      servicesTrigger && servicesTrigger.kill();
      midTrigger && midTrigger.kill();
    };
  }, [theme]);

  return (
    <main
      ref={wrapperRef}
      className="hero-problem-services-combined relative overflow-hidden transition-colors duration-500"
      style={bgStyle}
    >
      {theme === "dark" && (
        <>
          {/* Soft blend into neighboring sections */}
          <div
            className="absolute inset-x-0 top-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[2]"
            style={{
              // Match the top tint treatment used in `AirvoirSection`.
              background:
                "linear-gradient(to bottom, rgba(0,81,96,0.45) 0%, rgba(0,81,96,0) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[2]"
            style={{
              background:
                "linear-gradient(to top, #162d24 0%, rgba(22,45,36,0) 100%)",
            }}
          />
        </>
      )}

      <div className="relative z-10">
        {theme === "dark" && (
          <>
            {/* 2) Middle glow orb (between RealProblem and NewServices) */}
            <div
              ref={midNoiseRef}
              className="absolute left-1/2 pointer-events-none z-[1]"
              style={{
                top: "62%",
                width: "420px",
                height: "420px",
                transform: "translate(-50%, -50%)",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='420' height='420' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
                mixBlendMode: "overlay",
                opacity: 0.09,
              }}
            />
            <div
              ref={midOrbRef}
              className="absolute left-1/2 rounded-full pointer-events-none z-[2]"
              style={{
                top: "62%",
                width: "440px",
                height: "440px",
                transform: "translate(-50%, -50%)",
                backgroundImage:
                  "radial-gradient(circle at center, rgba(212,175,95,0.62) 0%, rgba(0,81,96,0.26) 35%, rgba(22,45,36,0) 72%)",
                mixBlendMode: "screen",
                opacity: 0.12,
                filter: "blur(18px)",
              }}
            />
          </>
        )}

        {/* 1) Hero glow orb with moving left/right ripple */}
        <div ref={heroWrapRef} className="relative dark777-luxury-hero min-h-[92vh] sm:min-h-[94vh] lg:min-h-[100vh]">
          {theme === "dark" && (
            <>
              <div className="luxury-hero-vignette" aria-hidden />
              <LuxuryGoldPearls />
              <div
                ref={heroNoiseRef}
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='620' height='620'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='620' height='620' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
                  mixBlendMode: "overlay",
                  opacity: 0.03,
                }}
              />

              <div
                ref={heroOrbRef}
                className="absolute left-1/2 rounded-full pointer-events-none z-[2]"
                style={{
                  top: "26%",
                  width: "540px",
                  height: "540px",
                  transform: "translate(-50%, -50%)",
                  backgroundImage:
                    "radial-gradient(circle at center, rgba(212,175,95,0.22) 0%, rgba(212,175,95,0.55) 18%, rgba(0,81,96,0.28) 42%, rgba(22,45,36,0) 72%)",
                  mixBlendMode: "screen",
                  opacity: 0.38,
                  filter: "blur(18px)",
                }}
              />
            </>
          )}

          <div className="relative z-[10]">
            <HeroSectionMediaSlot theme={theme} sharedBackground />
            {/* <HeroVersion2 theme={theme} sharedBackground /> */}
          </div>
        </div>

        <RealProblemSection theme={theme} />

        {/* Scroll trigger marker: sits between RealProblemSection and NewServicesSection */}
        <div ref={midMarkerRef} style={{ height: 1, width: "100%" }} />

        {/* 3) NewServices section glow orb */}
        <div ref={servicesWrapRef} className="relative">
          {theme === "dark" && (
            <>
              <div
                ref={servicesNoiseRef}
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='420' height='420' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
                  mixBlendMode: "overlay",
                  opacity: 0.03,
                }}
              />

              <div
                ref={servicesOrbRef}
                className="absolute left-1/2 rounded-full pointer-events-none z-[2]"
                style={{
                  top: "64%",
                  width: "410px",
                  height: "410px",
                  transform: "translate(-50%, -50%)",
                  backgroundImage:
                    "radial-gradient(circle at center, rgba(212,175,95,0.62) 0%, rgba(0,81,96,0.26) 35%, rgba(22,45,36,0) 72%)",
                  mixBlendMode: "screen",
                  opacity: 0,
                  filter: "blur(18px)",
                }}
              />
            </>
          )}

          <div className="relative z-[3]">
            <NewServicesSection theme={theme} sharedBackground />
          </div>
        </div>
      </div>
    </main>
  );
}

