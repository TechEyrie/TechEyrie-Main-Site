"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services1ListingDarkSurface } from "../services1/services1ListingSurfaces";

gsap.registerPlugin(ScrollTrigger);

const signals = [
  {
    stat: "20",
    label: "Vertical play books",
    detail:
      "Each industry page is a strategic one, it mirrors how buyers evaluate vendors in that sector.",
  },
  {
    stat: "3",
    label: "Keyword depth",
    detail:
      "Primary terms guide H1, modules, and internal links, ensuring search intent drives every element.",
  },
  {
    stat: "1",
    label: "Design system",
    detail:
      "Dark typography paired with mint accents flows seamlessly from overview to detailed pages, reinforcing brand clarity.",
  },
];

export default function IndustriesSignalsSection({ theme = "dark" }) {
  const isDark = theme === "dark";
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".ind-signal-card").forEach((node, i) => {
        gsap.from(node, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          delay: i * 0.06,
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const card = isDark
    ? "bg-[#17382e]/75 border border-[#74F5A1]/22 text-[#f3f3f3]"
    : "bg-white border border-[#d8d3c8] text-[#222]";

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-20 lg:py-24 px-6 sm:px-8 md:px-12 lg:px-16"
      style={isDark ? services1ListingDarkSurface : { background: "#eef6f3" }}
    >
      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,560px)_minmax(0,760px)] lg:justify-between gap-10 lg:gap-x-16 xl:gap-x-24 items-start">
        <div className="w-full max-w-none lg:max-w-[560px]">
          <p className="font-merriweather text-[12px] uppercase tracking-[0.2em] text-[#74F5A1] mb-4">
            Why sector page matters
          </p>
          <h2 className="font-italiana text-[36px] sm:text-[48px] md:text-[58px] lg:text-[68px] leading-[0.98] mb-6">
            {isDark ? <span className="text-[#f3f3f3]">Signals buyers look for</span> : <span className="text-[#111]">Signals buyers look for</span>}
          </h2>
          <p className={`font-merriweather text-[15px] md:text-[17px] leading-[1.85] ${isDark ? "text-[#e0d1b6]/90" : "text-[#3f3a34]"}`}>
            A general service page won&rsquo;t attract confidence—a buyer searching for{" "}
            <span className="text-[#74F5A1] font-semibold">insurance broker website</span> or{" "}
            <span className="text-[#67bfda] font-semibold">clinic SEO</span> might need you to understand their workflow, compliance, and sales processes before they even scroll or continue.
          </p>
          <ul className={`mt-6 space-y-3 font-merriweather text-[14px] md:text-[15px] leading-snug ${isDark ? "text-[#e0d1b6]/88" : "text-[#3f3a34]"}`}>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#74F5A1]" />
              Proof and sector language above the fold—no general filter, just reliability.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#67bfda]" />
              Structured for comparison—pages reflect how buyers judge their vendors in their industry.
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {["Intent-first copy", "SERP-ready sections", "Conversion events mapped"].map((item) => (
              <span
                key={item}
                className={`font-merriweather text-[11px] md:text-[12px] px-3 py-1.5 rounded-full border ${
                  isDark
                    ? "border-[#74F5A1]/35 bg-[#0d241d]/60 text-[#e0d1b6]"
                    : "border-[#1f614d]/25 bg-[#f4efe5] text-[#1a2e26]"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
          <Link
            href="/contact"
            className="ind-mint-btn mt-8 inline-flex items-center justify-center gap-3 self-start rounded-full bg-[#74F5A1] pl-6 pr-2 py-2.5 font-merriweather text-[14px] md:text-[15px] font-bold tracking-tight shadow-[0_10px_28px_rgba(116,245,161,0.35)] border border-[#5bdc8c]/80 ring-1 ring-white/20 hover:scale-[1.02] transition-transform duration-300 group"
          >
            Plan a sector workshop
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d291f] text-[#74F5A1] transition-transform group-hover:translate-x-0.5" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 14 14">
                <path d="M2 7H12M12 7L8.5 3.5M12 7L8.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>

        <div className="space-y-5 min-w-0 lg:pl-6 xl:pl-10">
          {signals.map((s) => (
            <div
              key={s.label}
              className={`ind-signal-card rounded-2xl p-6 md:p-8 ${card}`}
            >
              <p className="ind-strip-stat font-merriweather text-[40px] md:text-[48px] font-extrabold leading-none tracking-tight">
                {s.stat}
              </p>
              <p className="font-italiana text-[22px] md:text-[26px] mt-2 mb-2">{s.label}</p>
              <p className={`font-merriweather text-[14px] md:text-[15px] leading-relaxed ${isDark ? "text-white/82" : "text-[#4a453f]"}`}>
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
