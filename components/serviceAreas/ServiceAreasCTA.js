"use client";

import React from "react";
import Link from "next/link";

export default function ServiceAreasCTA() {
  return (
    <section className="relative px-6 sm:px-10 md:px-14 lg:px-16 pt-8 md:pt-12 pb-24 md:pb-32 overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] max-w-[1400px] h-[320px] bg-[radial-gradient(ellipse_at_center,rgba(116,245,161,0.22)_0%,transparent_70%)] blur-2xl" />

      <div className="max-w-[1700px] mx-auto relative z-[1]">
        <div className="relative rounded-[26px] md:rounded-[34px] overflow-hidden border border-[#74F5A1]/25 shadow-[0_32px_100px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(110deg,transparent_30%,rgba(116,245,161,0.07)_50%,transparent_70%)] sa-cta-sheen" />

          <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] relative">
            <div className="relative p-8 md:p-12 lg:p-14 bg-gradient-to-br from-[#74F5A1] via-[#5FE08D] to-[#2ebd78] sa-cta-gradient-shift">
              <div className="absolute inset-0 opacity-25 bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M30 0L60 30L30 60L0 30z\\' fill=\\'none\\' stroke=\\'%23081b15\\' stroke-opacity=\\'0.06\\'/%3E%3C/svg%3E')]" />
              <div className="absolute top-6 right-6 flex gap-2">
                <span className="h-2 w-2 rounded-full bg-[#081b15]/35 animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-[#081b15]/20" />
              </div>
              <div className="relative">
                <h3 className="sa-mint-text font-italiana text-[36px] md:text-[52px] leading-[1.02] max-w-[720px]">
                  Your next move
                </h3>
                <p className="sa-mint-sub font-playfair text-[18px] md:text-[22px] mt-5 max-w-[640px] leading-relaxed font-medium">
                  Your next territory—designed, AI-optimized, and automated to lead.
                </p>
                <p className="sa-mint-sub font-playfair text-[16px] md:text-[19px] mt-4 max-w-[640px] leading-relaxed font-medium opacity-95">
                  Each city gets its own launch page, reflecting local culture, intent, and expectations—keeping a shared
                  system that aligns with your brand, across borders.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {["Neural Velocity", "Coded flow", "Search Forge"].map((t) => (
                    <span
                      key={t}
                      className="sa-cta-chip rounded-full border px-3.5 py-1.5 font-merriweather text-[11px] font-bold tracking-[0.04em] normal-case"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 lg:p-14 bg-[#020807]/95 border-t lg:border-t-0 lg:border-l border-[#74F5A1]/20 relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#67bfda]/15 rounded-full blur-3xl pointer-events-none" />
              <p className="font-merriweather text-[11px] uppercase tracking-[0.22em] text-[#74F5A1] mb-4 font-bold">
                Start project
              </p>
              <p className="font-playfair text-[19px] md:text-[23px] leading-relaxed text-[#e0d1b6] max-w-[480px]">
                Send your priority region. We&apos;ll sketch IA, hero narrative, and conversion events before we write a
                single line of lazy filler.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="sa-mint-text inline-flex items-center justify-center rounded-full bg-[#74F5A1] px-8 py-4 font-merriweather text-[14px] font-bold border border-[#b8ffd8]/90 shadow-[0_14px_40px_rgba(116,245,161,0.45)] hover:brightness-110 hover:-translate-y-px transition-all"
                >
                  Book strategy call
                </Link>
                <Link
                  href="/industries"
                  className="inline-flex items-center justify-center rounded-full border-2 border-[#67bfda]/50 bg-[#67bfda]/10 px-8 py-4 font-merriweather text-[14px] font-semibold text-[#c8f7ff] hover:bg-[#67bfda]/18 transition-colors"
                >
                  See industries
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
