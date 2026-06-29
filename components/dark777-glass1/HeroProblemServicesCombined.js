"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSectionMediaSlot from "../dark777-glass/HeroSectionMediaSlot";
import LuxuryGlassSplinters from "../dark777-glass/LuxuryGlassSplinters";
import RealProblemSection from "../dark777-glass/RealProblemSection";
import NewServicesSection from "../dark777-glass/NewServicesSection";
import { glass7LiquidSurfaceStyle } from "./dark7PageSurface";

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
    () => (theme === "dark" ? glass7LiquidSurfaceStyle : { backgroundColor: "#F9F7F0" }),
    [theme],
  );

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    gsap.killTweensOf([
      heroOrbRef.current,
      servicesOrbRef.current,
      midOrbRef.current,
      heroNoiseRef.current,
      servicesNoiseRef.current,
      midNoiseRef.current,
    ]);

    if (theme !== "dark") return;

    gsap.set(heroOrbRef.current, { opacity: 0.42 });
    gsap.set(servicesOrbRef.current, { opacity: 0.02 });
    gsap.set(midOrbRef.current, { opacity: 0.14 });

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
        onRefresh: (self) => {
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
      xAmplitude: 860,
    });

    const servicesTrigger = setupSectionTrigger({
      triggerEl: servicesWrapRef.current,
      orbEl: servicesOrbRef.current,
      noiseEl: servicesNoiseRef.current,
      start: "top 85%",
      end: "bottom 15%",
      baseY: 0,
      xAmplitude: -240,
    });

    const midTrigger = setupSectionTrigger({
      triggerEl: midMarkerRef.current,
      orbEl: midOrbRef.current,
      noiseEl: midNoiseRef.current,
      start: "top 120%",
      end: "bottom 10%",
      baseY: 0,
      xAmplitude: -520,
    });

    return () => {
      heroTrigger?.kill();
      servicesTrigger?.kill();
      midTrigger?.kill();
    };
  }, [theme]);

  return (
    <main
      ref={wrapperRef}
      className="hero-problem-services-combined glass-hero-combined glass-hero-combined-c relative overflow-hidden transition-colors duration-500"
      style={bgStyle}
    >
      {theme === "dark" && (
        <>
          <div
            className="absolute inset-x-0 top-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[2]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,130,150,0.28) 0%, rgba(0,130,150,0) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[2]"
            style={{
              background:
                "linear-gradient(to top, rgba(12,24,20,0.95) 0%, rgba(12,24,20,0) 100%)",
            }}
          />
        </>
      )}

      <div className="relative z-10">
        {theme === "dark" && (
          <>
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
                  "radial-gradient(circle at center, rgba(212,175,95,0.5) 0%, rgba(0,130,150,0.28) 35%, rgba(12,24,20,0) 72%)",
                mixBlendMode: "screen",
                opacity: 0.12,
                filter: "blur(18px)",
              }}
            />
          </>
        )}

        {/* Liquid Light hero — full scroll + portfolio morph */}
        <div
          ref={heroWrapRef}
          className="relative dark777-luxury-hero glass-hero-c min-h-[92vh] sm:min-h-[94vh] lg:min-h-[100vh]"
        >
          {theme === "dark" && (
            <>
              <div className="glass-hero-c-mesh pointer-events-none" aria-hidden />
              <div className="glass-hero-c-orb pointer-events-none" aria-hidden />
              <div className="glass-hero-vignette" aria-hidden />
              <LuxuryGlassSplinters />
              <div className="glass-hero-c-specular pointer-events-none" aria-hidden />
              <div
                ref={heroNoiseRef}
                className="glass-hero-noise absolute inset-0 pointer-events-none z-[1]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='620' height='620'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='620' height='620' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
                  mixBlendMode: "overlay",
                  opacity: 0.05,
                }}
              />
              <div
                ref={heroOrbRef}
                className="absolute left-1/2 rounded-full pointer-events-none z-[2]"
                style={{
                  top: "28%",
                  width: "560px",
                  height: "560px",
                  transform: "translate(-50%, -50%)",
                  backgroundImage:
                    "radial-gradient(circle at center, rgba(212,175,95,0.35) 0%, rgba(0,100,120,0.28) 32%, rgba(12,24,20,0) 68%)",
                  mixBlendMode: "screen",
                  opacity: 0.42,
                  filter: "blur(20px)",
                }}
              />
            </>
          )}

          <div className="relative z-[10]">
            <HeroSectionMediaSlot theme={theme} sharedBackground glassVariant="C" />
          </div>
        </div>

        <RealProblemSection theme={theme} />

        <div ref={midMarkerRef} style={{ height: 1, width: "100%" }} />

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
                    "radial-gradient(circle at center, rgba(212,175,95,0.5) 0%, rgba(0,130,150,0.25) 35%, rgba(12,24,20,0) 72%)",
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
