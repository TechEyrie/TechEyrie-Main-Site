"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { industriesCatalog, industryClusters } from "./industriesData";
import { services1ListingDarkSurface } from "../services1/services1ListingSurfaces";

gsap.registerPlugin(ScrollTrigger);

/** Uniform grid: 20 industries ÷ 2 or ÷ 4 columns = no orphan empty cells (bento spans caused holes). */
const clusterAccent = {
  regulated: "#74F5A1",
  professional: "#67bfda",
  built: "#a7b431",
  creative: "#9dffbe",
  knowledge: "#6dd6ff",
  wellness: "#83f1bf",
  operations: "#8ad4a1",
};

export default function IndustriesListingMosaic({ theme = "dark" }) {
  const isDark = theme === "dark";
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          opacity: 0,
          y: 36,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          opacity: 0,
          y: 50,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none none",
          },
          delay: i * 0.02,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const clusterLabel = (id) => industryClusters.find((c) => c.id === id)?.label || "";

  return (
    <section
      id="industries-grid"
      ref={sectionRef}
      className="relative py-16 md:py-20 lg:py-28 px-6 sm:px-8 md:px-12 lg:px-16 transition-colors duration-500"
      style={isDark ? services1ListingDarkSurface : { background: "#f5e8d1" }}
    >
      <div className="max-w-[1700px] mx-auto">
        <div ref={headerRef} className="mb-12 md:mb-16 lg:mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-3xl">
            <p className="font-merriweather text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-[#74F5A1] mb-4">
              Sectors
            </p>
            <h2
              className={`font-italiana text-[38px] sm:text-[48px] md:text-[64px] lg:text-[76px] leading-[0.98] ${
                isDark ? "text-[#f3f3f3]" : "text-[#162d24]"
              }`}
            >
              Pick a sector—
              <span className="text-[#67bfda]">
                Tech Eyrie will convert content and search strategies to luxury clients
              </span>
            </h2>
          </div>
          <p
            className={`font-merriweather text-[14px] md:text-[16px] leading-relaxed max-w-md lg:text-right shrink-0 ${
              isDark ? "text-[#e0d1b6]/90" : "text-[#3f3a34]"
            }`}
          >
            Twenty sectors—one flow designed edge-to-edge that conveys luxury and completeness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6 lg:gap-6 auto-rows-[minmax(403px,auto)]">
          {industriesCatalog.map((industry, index) => {
            const pad = "p-7 md:p-8 lg:p-9";
            const accent = clusterAccent[industry.cluster] || "#74F5A1";
            return (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className={`group relative overflow-hidden rounded-2xl md:rounded-[24px] border border-white/10 bg-[#0c1f19]/72 shadow-[0_18px_48px_rgba(0,0,0,0.28)] min-h-[403px] md:min-h-[442px] lg:min-h-[468px] flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_56px_rgba(116,245,161,0.18)] ${pad}`}
                style={{ boxShadow: `0 18px 48px rgba(0,0,0,0.28), inset 0 0 0 1px ${accent}22` }}
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src={industry.image}
                    alt={industry.name}
                    fill
                    className="object-cover opacity-68 group-hover:opacity-82 group-hover:scale-110 transition-all duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    unoptimized
                  />
                  {/* Readability: image-side treatment only (no text panel) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020805]/94 via-[#061410]/72 to-[#0f221a]/22" />
                  <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_100%,rgba(2,8,5,0.92)_0%,rgba(6,20,16,0.55)_38%,transparent_72%)]" />
                  <div className="absolute inset-0 backdrop-blur-[1.5px] [mask-image:linear-gradient(to_top,black_52%,transparent)] opacity-80" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 82% 18%, ${accent}44 0%, transparent 42%)` }} />
                </div>

                <div className="relative z-[1] flex flex-wrap items-center gap-2">
                  <span className="font-merriweather text-[10px] md:text-[11px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full bg-[#0a1e18]/85 border text-[#d6efe3]" style={{ borderColor: `${accent}66` }}>
                    {clusterLabel(industry.cluster)}
                  </span>
                  <span className="font-merriweather text-[10px] text-[#e0d1b6]/75">
                    {String(industry.id).padStart(2, "0")}
                  </span>
                </div>

                <div className="relative z-[1] mt-auto">
                  <h3 className="font-italiana text-[30px] sm:text-[34px] md:text-[38px] leading-[1.04] text-white mb-2">
                    {industry.name}
                  </h3>
                  <p className="font-merriweather text-[14px] md:text-[15px] leading-relaxed text-[#f4f3ee]/92 line-clamp-2 md:line-clamp-3 mb-3">
                    {industry.pageTitle}
                  </p>
                  <p className="font-merriweather text-[13px] md:text-[14px] leading-relaxed text-[#dbe5df]/88 line-clamp-2 opacity-95 group-hover:opacity-100 transition-opacity mb-5">
                    {industry.teaser}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {industry.keywords.slice(0, 3).map((kw) => (
                      <span
                        key={kw}
                        className="font-merriweather text-[10px] md:text-[11px] px-2 py-1 rounded-md bg-black/35 border border-white/10 text-[#dbe5df]/90"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                  <span className="ind-mint-btn mt-8 md:mt-9 inline-flex items-center justify-center gap-3 self-start font-merriweather text-[13px] md:text-[14px] font-bold tracking-tight bg-[#74F5A1] pl-5 pr-2 py-2 md:pl-6 md:pr-2.5 md:py-2.5 rounded-full shadow-[0_10px_28px_rgba(116,245,161,0.38)] border border-[#5bdc8c]/80 ring-1 ring-white/25 group-hover:shadow-[0_14px_36px_rgba(116,245,161,0.48)] group-hover:scale-[1.02] transition-all duration-300">
                    Explore industry
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0d291f] text-[#74F5A1]" aria-hidden>
                      <svg width="16" height="16" viewBox="0 0 14 14" className="transition-transform group-hover:translate-x-0.5">
                        <path d="M2 7H12M12 7L8.5 3.5M12 7L8.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </span>
                </div>

                <div className="absolute top-0 left-0 right-0 h-[3px] opacity-90 z-[2]" style={{ background: `linear-gradient(to right, ${accent}, #67bfda, transparent)` }} />
                <div className="absolute -bottom-16 -right-16 h-36 w-36 rounded-full blur-3xl opacity-35 group-hover:opacity-60 transition-opacity" style={{ backgroundColor: accent }} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
