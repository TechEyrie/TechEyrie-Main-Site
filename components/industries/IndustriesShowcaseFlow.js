"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { industriesCatalog } from "./industriesData";
import { services1ListingDarkSurface } from "../services1/services1ListingSurfaces";

gsap.registerPlugin(ScrollTrigger);

const featured = [industriesCatalog[0], industriesCatalog[10], industriesCatalog[13]];

export default function IndustriesShowcaseFlow({ theme = "dark" }) {
  const isDark = theme === "dark";
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".ind-show-block").forEach((node, i) => {
        gsap.from(node, {
          opacity: 0,
          y: 48,
          duration: 0.9,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 86%",
            toggleActions: "play none none none",
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative py-16 md:py-20 lg:py-24 px-6 sm:px-8 md:px-12 lg:px-16 overflow-hidden"
      style={isDark ? services1ListingDarkSurface : { background: "#f5e8d1" }}
    >
      <div className="absolute -top-20 right-0 w-[360px] h-[360px] rounded-full bg-[#74F5A1]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-[320px] h-[320px] rounded-full bg-[#67bfda]/10 blur-3xl pointer-events-none" />

      <div className="max-w-[1700px] mx-auto">
        <div className="ind-show-block mb-12 md:mb-14 lg:mb-16">
          <p className="font-merriweather text-[12px] uppercase tracking-[0.2em] text-[#74F5A1] mb-4">
            Flagship Experiences
          </p>
          <h2 className="font-italiana text-[36px] sm:text-[48px] md:text-[62px] lg:text-[74px] leading-[0.98] text-[#f3f3f3] max-w-5xl">
            Elevate your brand with combined storytelling, visual authority, and SEO-driven engagement for luxury clients.
          </h2>
        </div>

        <div className="space-y-10 md:space-y-14">
          {featured.map((item, idx) => {
            const reverse = idx % 2 === 1;
            return (
              <article
                key={item.slug}
                className={`ind-show-block grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative rounded-[22px] border border-white/10 bg-[#0c1f19]/72 p-4 md:p-5 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
                  <div className="absolute -top-2 -left-2 h-14 w-14 rounded-xl bg-[#74F5A1] opacity-90 blur-[1px]" />
                  <div className="absolute -bottom-2 -right-2 h-14 w-14 rounded-xl bg-[#67bfda]/90 blur-[1px]" />
                  <div className="relative rounded-[16px] overflow-hidden min-h-[280px] md:min-h-[400px] lg:min-h-[460px]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061410]/52 via-transparent to-transparent" />
                  </div>
                  <div className="absolute top-7 right-7 bg-[#081a15]/90 border border-[#74F5A1]/45 rounded-lg px-3 py-2">
                    <p className="font-merriweather text-[10px] uppercase tracking-[0.14em] text-[#74F5A1]">
                      Sector-ready
                    </p>
                  </div>
                </div>

                <div className="relative rounded-[22px] border border-[#74F5A1]/20 bg-[#0b1c17]/68 p-6 md:p-8 lg:p-10 overflow-hidden">
                  <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(116,245,161,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(103,191,218,0.1) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
                  <p className="relative font-merriweather text-[11px] uppercase tracking-[0.18em] text-[#67bfda] mb-3">
                    {String(item.id).padStart(2, "0")} / {item.cluster}
                  </p>
                  <h3 className="relative font-italiana text-[34px] md:text-[46px] lg:text-[56px] leading-[1.02] text-[#f3f3f3] mb-3">
                    {item.name}
                  </h3>
                  <p className="relative font-playfair text-[18px] md:text-[22px] leading-relaxed text-[#74F5A1] mb-4">
                    {item.pageTitle}
                  </p>
                  <p className="relative font-merriweather text-[14px] md:text-[16px] leading-[1.85] text-[#e0d1b6]/88 mb-6">
                    {item.teaser}
                  </p>
                  <div className="relative flex flex-wrap gap-2 mb-7">
                    {item.keywords.map((kw) => (
                      <span key={kw} className="font-merriweather text-[11px] px-2.5 py-1.5 rounded-md border border-white/15 bg-black/25 text-[#dbe5df]">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/industries/${item.slug}`}
                    className="ind-mint-btn relative inline-flex items-center justify-center gap-3 rounded-full bg-[#74F5A1] font-merriweather text-[13px] md:text-[14px] font-bold tracking-tight pl-5 pr-2 py-2 md:pl-6 md:pr-2.5 md:py-2.5 shadow-[0_10px_28px_rgba(116,245,161,0.38)] border border-[#5bdc8c]/80 ring-1 ring-white/25 hover:scale-[1.02] transition-transform duration-300 group"
                  >
                    Explore industry
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0d291f] text-[#74F5A1]" aria-hidden>
                      <svg width="16" height="16" viewBox="0 0 14 14" className="transition-transform group-hover:translate-x-0.5">
                        <path d="M2 7H12M12 7L8.5 3.5M12 7L8.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

