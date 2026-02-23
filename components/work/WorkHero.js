"use client";
import React from "react";

export default function WorkHero({ theme = "light" }) {
  const isDark = theme === "dark";

  return (
    <section
      className="relative w-full min-h-[70vh] flex items-center overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #1a2a3a 0%, #151515 50%, #1a1a1a 100%)"
          : "linear-gradient(180deg, #d4e4ed 0%, #f5f0e8 40%, #f8f8f8 100%)",
      }}
    >
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
        <div className="flex flex-col gap-2">
          <p className={`font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase ${isDark ? 'text-white/70' : 'text-[#1a1a1a]/70'}`}>
            Work
          </p>
          {/* Main Heading */}
          <h1
            className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.05] tracking-[-0.03em] ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}
          >
            Our work
          </h1>

          {/* Subheading */}
          <h2
            className={`font-playfair italic font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] leading-[1.05] tracking-[-0.03em] ${isDark ? 'text-white/60' : 'text-[#1a1a1a]/50'}`}
          >
            From idea to exit
          </h2>
        </div>
      </div>
    </section>
  );
}
