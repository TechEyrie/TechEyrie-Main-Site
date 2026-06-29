"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import CardsServicesSection from "./CardsServicesSection";
import FAQSection from "./FAQSection";
import BlogsSection from "./BlogSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

export default function InfoSectionsCombined({ theme = "light" }) {
  const wrapperRef = useRef(null);
  const noiseRef = useRef(null);
  const gradientRef = useRef(null);

  const orbRefs = useRef([]);

  const orbDefs = useMemo(
    () => [
      // Starts near center-bottom and drifts right.
      { left: "50%", top: "78%", size: 460, dir: 1, amp: 980, center: 0.14, width: 0.22 },
      // Drifts left.
      { left: "50%", top: "80%", size: 430, dir: -1, amp: 480, center: 0.52, width: 0.24 },
      // Higher glow for variety.
      { left: "72%", top: "62%", size: 420, dir: -1, amp: 260, center: 0.78, width: 0.20 },
    ],
    [],
  );

  const bgStyle = useMemo(
    () =>
      theme === "dark"
        ? {
            backgroundColor: "#162d24",
            backgroundImage: `
              url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
              radial-gradient(
                ellipse at 60% 80%,
                rgba(117, 133, 53, 0.5) 0%,
                rgba(27, 71, 50, 0.4) 40%,
                rgba(22, 45, 36, 0.92) 100%
              )
            `,
            backgroundBlendMode: "overlay, normal",
          }
        : { backgroundColor: "#F9F7F0" },
    [theme],
  );

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;
    if (theme !== "dark") return;

    // Initialize visibility.
    gsap.set(gradientRef.current, { opacity: 0 });
    gsap.set(noiseRef.current, { opacity: 0.06 });

    orbRefs.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, { opacity: 0.02, scale: 0.95, filter: "blur(18px)" });
    });

    const st = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top 85%",
      end: "bottom 15%",
      scrub: 0.65,
      onUpdate: (self) => {
        const p = self.progress; // 0..1

        const midGlow = Math.pow(Math.sin(p * Math.PI), 0.65);

        // Animated gradient sweep.
        gsap.set(gradientRef.current, {
          opacity: 0.06 + midGlow * 0.85,
          rotateZ: p * 680,
          // Move circle from center to right off-screen.
          x: p * 900,
          filter: `blur(${Math.max(16, 28 - midGlow * 10)}px)`,
        });

        // Moving noise (so it doesn't look static).
        gsap.set(noiseRef.current, {
          x: (p * 2 - 1) * 70,
          y: Math.cos(p * Math.PI * 2) * 18,
          opacity: 0.04 + midGlow * 0.08,
        });

        // Soft circle glows: radial blob that drifts left/right across scroll.
        orbDefs.forEach((def, i) => {
          const el = orbRefs.current[i];
          if (!el) return;

          const t = (p - def.center) / Math.max(0.0001, def.width);
          const pulse = Math.exp(-t * t * 5.0); // 0..1

          // Continuous drift (DeepJudge2-like), opacity only emphasized by pulse.
          const xShift = def.dir * def.amp * p;
          const yShift = Math.sin(p * Math.PI * 2 + i * 1.6) * 14;

          gsap.set(el, {
            opacity: 0.02 + pulse * 0.55,
            x: xShift,
            y: yShift,
            scale: 0.92 + pulse * 0.35,
            filter: `blur(${18 - pulse * 7}px)`,
          });
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [theme, orbDefs]);

  return (
    <div
      ref={wrapperRef}
      className="info-sections-combined relative overflow-hidden transition-colors duration-500"
      style={bgStyle}
    >
      {theme === "dark" && (
        <>
          <div
            ref={noiseRef}
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              backgroundImage: `
                url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='420' height='420' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")
              `,
              backgroundSize: "420px 420px",
              opacity: 0.06,
              mixBlendMode: "overlay",
            }}
          />

          <div
            ref={gradientRef}
            className="absolute pointer-events-none z-[2] left-1/2 top-1/2"
            style={{
              width: "120vmax",
              height: "120vmax",
              backgroundImage: `
                conic-gradient(
                  from 0deg at 50% 55%,
                  rgba(156,176,168,0) 0%,
                  rgba(156,176,168,0.38) 18%,
                  rgba(10,46,50,0.30) 42%,
                  rgba(156,176,168,0) 72%,
                  rgba(22,45,36,0) 100%
                ),
                radial-gradient(
                  ellipse at 50% 50%,
                  rgba(156,176,168,0.22) 0%,
                  rgba(27,71,50,0.10) 40%,
                  rgba(22,45,36,0) 70%
                )
              `,
              mixBlendMode: "screen",
              filter: "blur(28px)",
              opacity: 0,
              transform: "translate(-50%, -50%)",
              borderRadius: "9999px",
              transformOrigin: "50% 55%",
            }}
          />

          {orbDefs.map((def, i) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              ref={(el) => {
                orbRefs.current[i] = el;
              }}
              className="absolute pointer-events-none z-[3] rounded-full"
              style={{
                left: def.left,
                top: def.top,
                width: `${def.size}px`,
                height: `${def.size}px`,
                transform: "translate(-50%, -50%)",
                backgroundImage:
                  "radial-gradient(circle at center, rgba(156,176,168,0.65) 0%, rgba(10,46,50,0.28) 35%, rgba(22,45,36,0) 72%)",
                opacity: 0.02,
                filter: "blur(18px)",
                boxShadow: "0 0 120px rgba(156,176,168,0.10)",
              }}
            />
          ))}

          {/* Blend into neighbors so seams don't look harsh */}
          <div
            className="absolute inset-x-0 top-0 h-24 pointer-events-none z-[4]"
            style={{
              background: "linear-gradient(to bottom, rgba(22,45,36,0.9) 0%, rgba(22,45,36,0) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-[4]"
            style={{
              background: "linear-gradient(to top, rgba(22,45,36,0.9) 0%, rgba(22,45,36,0) 100%)",
            }}
          />
        </>
      )}

      <div className="relative z-10">
        <CardsServicesSection theme={theme} sharedBackground />
        <FAQSection theme={theme} sharedBackground />
        <BlogsSection theme={theme} sharedBackground />
      </div>
    </div>
  );
}

