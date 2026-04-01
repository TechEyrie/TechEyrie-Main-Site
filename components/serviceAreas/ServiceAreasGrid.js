"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { serviceAreas } from "./serviceAreasData";

export default function ServiceAreasGrid() {
  return (
    <section
      id="service-areas-grid"
      className="relative px-6 sm:px-10 md:px-14 lg:px-16 py-14 md:py-20"
    >
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#74F5A1]/50 to-transparent" />
      <div className="max-w-[1700px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-5 md:gap-8 mb-10 md:mb-12">
          <div>
            <p className="sa-kicker font-merriweather text-[11px] uppercase tracking-[0.22em] mb-3">Locations</p>
            <h2 className="sa-title font-italiana text-[36px] md:text-[52px] leading-[1.02]">
              Cities we{" "}
              <span className="sa-gradient-headline">light up</span>
            </h2>
          </div>
          <p className="sa-lead font-playfair text-[17px] md:text-[20px] max-w-[520px]">
            Imagery, glow, and region-specific copy—pick a market and we’ll architect the earn-it moment on page one.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
          {serviceAreas.map((area) => (
            <article
              key={area.country}
              className="group relative overflow-hidden rounded-[22px] border border-white/14 bg-[#050c09] shadow-[0_24px_60px_rgba(0,0,0,0.45)] hover:border-[#74F5A1]/50 hover:shadow-[0_28px_70px_rgba(116,245,161,0.18)] transition-all duration-500 min-h-[420px] flex flex-col opacity-100"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={area.image}
                  alt={area.country}
                  fill
                  className="object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  unoptimized
                />
                <div
                  className="absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(180deg, rgba(3,8,6,0.1) 0%, rgba(3,8,6,0.55) 38%, rgba(3,8,6,0.92) 100%), linear-gradient(135deg, ${area.accent}33 0%, transparent 55%)`,
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 120%, ${area.accentSoft}55 0%, transparent 55%)`,
                  }}
                />
              </div>

              <div className="relative z-[1] flex flex-col flex-1 p-6 md:p-7">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-italiana text-[30px] md:text-[34px] text-[#f3f3f3] leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                      {area.country}
                    </h3>
                    <p className="font-merriweather text-[11px] uppercase tracking-[0.2em] text-[#74F5A1] mt-2 font-semibold">
                      {area.cities.length} cities
                    </p>
                  </div>
                  <span
                    className="mt-1 h-3 w-3 shrink-0 rounded-full ring-2 ring-white/30"
                    style={{
                      backgroundColor: area.accent,
                      boxShadow: `0 0 22px ${area.accent}, 0 0 42px ${area.accentSoft}`,
                    }}
                    aria-hidden
                  />
                </div>

                <p className="font-merriweather text-[13px] md:text-[14px] leading-relaxed text-[#e8e4dc]/92 mt-4 line-clamp-3 drop-shadow-md">
                  {area.blurb}
                </p>

                <div className="mt-auto pt-6 flex flex-wrap gap-2">
                  {area.cities.map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center rounded-full border border-white/20 bg-[#04120d]/72 px-3 py-1.5 font-merriweather text-[11px] md:text-[12px] font-medium text-[#f4f3ee] backdrop-blur-[2px] group-hover:border-[#74F5A1]/35 transition-colors"
                    >
                      {city}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href="/contact"
                    className="sa-mint-text inline-flex items-center justify-center rounded-full bg-[#74F5A1] px-4 py-2 font-merriweather text-[11px] font-bold uppercase tracking-wider border border-[#b8ffd8]/80 shadow-[0_8px_24px_rgba(116,245,161,0.35)]"
                  >
                    Start build
                  </Link>
                  <Link
                    href="/services1"
                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-4 py-2 font-merriweather text-[11px] font-semibold uppercase tracking-wider text-[#f3f3f3] hover:bg-white/15"
                  >
                    Capabilities
                  </Link>
                </div>
              </div>

              <div
                className="absolute top-0 left-0 right-0 h-[3px] z-[2] opacity-95"
                style={{
                  background: `linear-gradient(90deg, transparent, ${area.accent}, ${area.accentSoft}, transparent)`,
                }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
