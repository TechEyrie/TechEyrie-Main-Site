"use client";

import React from "react";
import { allServiceCities } from "./serviceAreasData";

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-10 md:gap-14 pr-10 md:pr-14">
      {allServiceCities.map((city) => (
        <span key={city} className="flex shrink-0 items-center gap-10 md:gap-14">
          <span className="font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.18em] text-[#74F5A1]">
            {city}
          </span>
          <span className="text-[#67bfda] text-lg leading-none opacity-95" aria-hidden>
            ◆
          </span>
        </span>
      ))}
    </div>
  );
}

export default function ServiceAreasMarquee() {
  return (
    <div className="relative border-y border-[#74F5A1]/30 bg-[#060f0c]/95 overflow-hidden py-3.5 md:py-4 sa-marquee-wrap">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,15,12,0.95)_0%,transparent_12%,transparent_88%,rgba(6,15,12,0.95)_100%)] z-[1]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(116,245,161,0.12)_50%,transparent_100%)] opacity-80" />
      <div className="sa-marquee-track flex w-max">
        <Row />
        <Row />
      </div>
    </div>
  );
}
