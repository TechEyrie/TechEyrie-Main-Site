"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    title: "Intent maps",
    body: "Every city cluster gets its own keyword spine and page hierarchy—no copy-paste templates.",
    tone: "from-[#74F5A1]/35 to-transparent",
  },
  {
    title: "Luxury UX",
    body: "Dark7 polish: typography, spacing, and motion that still hits aggressive CRO benchmarks.",
    tone: "from-[#67bfda]/30 to-transparent",
  },
  {
    title: "Launch velocity",
    body: "Shared design systems let us roll multi-market updates without breaking brand consistency.",
    tone: "from-[#c8ffd8]/25 to-transparent",
  },
];

export default function ServiceAreasSpotlight() {
  const rootRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll("[data-sa-card]");
    if (!cards?.length) return;
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 36,
        stagger: 0.12,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative px-6 sm:px-10 md:px-14 lg:px-16 py-10 md:py-14">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[90%] max-w-[1100px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(116,245,161,0.14)_0%,transparent_65%)] blur-xl" />
      <div className="max-w-[1700px] mx-auto relative z-[1]">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-8 md:mb-10">
          <div>
            <p className="sa-kicker font-merriweather text-[11px] uppercase tracking-[0.22em] mb-3">Why it pops</p>
            <h2 className="sa-title font-italiana text-[32px] md:text-[46px] leading-[1.02] max-w-[720px]">
              Bright strategy.
              <span className="sa-gradient-headline"> Zero generic.</span>
            </h2>
          </div>
          <p className="sa-lead font-playfair text-[16px] md:text-[19px] max-w-[400px]">
            We treat each territory like a product launch—not a footer link list.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-4 md:gap-5">
          {pillars.map((p) => (
            <div
              key={p.title}
              data-sa-card
              className={`relative overflow-hidden rounded-2xl border border-white/15 bg-[#07140f]/88 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] hover:border-[#74F5A1]/40 transition-colors duration-500`}
            >
              <div
                className={`pointer-events-none absolute -top-6 right-0 h-32 w-32 rounded-full bg-gradient-to-br ${p.tone} blur-2xl`}
              />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#74F5A1]/80 to-transparent opacity-90" />
              <h3 className="font-italiana text-[26px] md:text-[30px] text-[#f3f3f3] relative">{p.title}</h3>
              <p className="font-merriweather text-[14px] md:text-[15px] leading-relaxed text-[#e0d1b6]/88 mt-3 relative">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
