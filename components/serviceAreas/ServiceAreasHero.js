"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chips = [
  "Deep learning UX",
  "Auto-optimized pipelines",
  "Search-optimized structure",
  "24/7 automation cells",
];

export default function ServiceAreasHero() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const orbsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
      tl.from(leftRef.current?.children || [], { opacity: 0, y: 40, stagger: 0.08, duration: 0.85 }, 0);
      tl.from(rightRef.current, { opacity: 0, scale: 0.96, y: 32, duration: 1 }, 0.12);
      gsap.to(orbsRef.current?.querySelectorAll("[data-orb]") || [], {
        y: (i) => (i % 2 === 0 ? -10 : 12),
        x: (i) => (i % 2 === 0 ? 6 : -8),
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.3 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 sm:px-10 md:px-14 lg:px-16 pt-28 md:pt-32 pb-10 md:pb-12 max-w-[100vw]">
      <div ref={orbsRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          data-orb
          className="absolute -top-24 right-[-4%] h-[420px] w-[420px] rounded-full bg-[#74F5A1]/35 blur-[100px]"
        />
        <div
          data-orb
          className="absolute top-[40%] left-[-12%] h-[340px] w-[340px] rounded-full bg-[#67bfda]/30 blur-[90px]"
        />
        <div
          data-orb
          className="absolute bottom-[-15%] right-[25%] h-[280px] w-[280px] rounded-full bg-[#b8ffd8]/25 blur-[80px]"
        />
      </div>
      <p
        className="pointer-events-none absolute top-24 right-[8%] font-italiana text-[clamp(4rem,14vw,11rem)] leading-none text-[#74F5A1]/[0.06] select-none tracking-tight"
        aria-hidden
      >
        Areas
      </p>

      <div className="max-w-[1700px] mx-auto grid xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] gap-8 xl:gap-14 items-center relative z-[1]">
        <div ref={leftRef} className="min-w-0">
          <p className="sa-kicker font-merriweather text-[11px] md:text-[12px] uppercase tracking-[0.26em] mb-4">
            Service areas
          </p>
          <h1 className="sa-title font-italiana text-[44px] sm:text-[56px] md:text-[68px] lg:text-[80px] leading-[0.96] max-w-[920px]">
            Local precision.
            <br />
            <span className="sa-gradient-headline">Global voltage.</span>
          </h1>
          <p className="sa-lead font-playfair text-[18px] md:text-[24px] leading-relaxed mt-7 max-w-[760px]">
            At Tech Eyrie, our AI Automation (medium volume) solutions provide market-specific strategies with accuracy.
            From Qatar to Sri Lanka, the UAE, and Oxfordshire UK, we blend intelligent systems and automation technology
            to create experiences that are both powerful and refined.
          </p>

          <div className="mt-7 flex flex-wrap gap-2 md:gap-2.5">
            {chips.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full border border-[#74F5A1]/45 bg-[#74F5A1]/12 px-4 py-1.5 font-merriweather text-[11px] md:text-[12px] font-semibold tracking-[0.04em] text-[#74F5A1] normal-case"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3 md:gap-4">
            <Link
              href="#service-areas-grid"
              className="sa-mint-text inline-flex items-center justify-center rounded-full bg-[#74F5A1] px-7 py-3.5 font-merriweather text-[13px] md:text-[14px] font-bold border border-[#b8ffd8]/90 shadow-[0_16px_42px_rgba(116,245,161,0.45)] hover:brightness-110 hover:-translate-y-px transition-all"
            >
              Explore locations
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#67bfda]/55 bg-[#67bfda]/10 px-7 py-3.5 font-merriweather text-[13px] md:text-[14px] font-semibold text-[#c8f7ff] hover:bg-[#67bfda]/20 transition-colors shadow-[0_0_28px_rgba(103,191,218,0.2)]"
            >
              Request local strategy
            </Link>
          </div>
        </div>

        <div ref={rightRef} className="relative min-h-[360px] md:min-h-[460px]">
          <div className="absolute -inset-px rounded-[30px] bg-gradient-to-br from-[#74F5A1] via-[#67bfda] to-[#99f6cf] opacity-80 blur-[1px] sa-hero-ring-pulse" />
          <div className="relative h-full min-h-[360px] md:min-h-[460px] rounded-[28px] overflow-hidden border border-white/20 bg-[#04120d] shadow-[0_36px_100px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 sa-hero-grid sa-hero-grid-bright" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(116,245,161,0.45)_0%,transparent_42%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(103,191,218,0.35)_0%,transparent_45%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(4,15,10,0.15)_0%,rgba(4,10,8,0.88)_100%)]" />

            <div className="relative z-[1] h-full p-7 md:p-9 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <p className="font-merriweather text-[11px] uppercase tracking-[0.24em] text-[#d6efe3]">
                  Coverage footprint
                </p>
                <span className="rounded-full bg-[#74F5A1] px-3 py-1 font-merriweather text-[10px] font-bold uppercase tracking-wider text-[#081b15]">
                  Live roster
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {[
                  ["4", "Markets"],
                  ["14", "premium cities"],
                  ["100%", "brand locked QA"],
                  ["∞", "Iterative excellence"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/18 bg-[#0a1f18]/65 backdrop-blur-sm p-4 md:p-5 shadow-[0_0_24px_rgba(116,245,161,0.08)] hover:border-[#74F5A1]/45 transition-colors"
                  >
                    <p className="font-italiana text-[34px] md:text-[42px] leading-none bg-gradient-to-br from-[#74F5A1] to-[#67bfda] bg-clip-text text-transparent sa-stat-num">
                      {value}
                    </p>
                    <p className="mt-2 font-merriweather text-[11px] md:text-[12px] font-medium tracking-[0.06em] text-[#e0d1b6]/90 normal-case">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
