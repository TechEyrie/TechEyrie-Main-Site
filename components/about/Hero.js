"use client";
import React, { useEffect, useRef } from "react";
import { MaskedReveal } from "../ui/MaskedRevel";
import { SectionLabel } from "../ui/SectionLabel";
import { GridAnimation } from "./GridAnimation";

const Hero = ({ theme = "light" }) => {
  const isDark = theme === 'dark';
  
  return (
    <section className={`relative pt-48 pb-32 md:pt-[30vh] md:pb-40 px-6 md:px-12 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} overflow-hidden transition-colors duration-500`}>
      <GridAnimation theme={theme} />

      <div className="relative z-10 max-w-[90%] mx-auto text-center">
        <div className="mb-12">
          <SectionLabel text="About Tech Eyrie" className={`font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] ${isDark ? "text-gray-500" : "text-gray-300"}`} />
        </div>
        
        <div className="flex flex-col mb-8 md:mb-12">
          <MaskedReveal className="h-auto pb-1 md:pb-4">
            <h1 className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.05] tracking-[-0.03em] ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Redefining Industries, Not

            </h1>
          </MaskedReveal>
          <MaskedReveal delay={0.15} className="h-auto pb-1 md:pb-4">
            <h1 className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] leading-[1.05] tracking-[-0.03em] ${isDark ? 'text-white' : 'text-gray-900'}`}>
             Just Building Solutions
            </h1>
          </MaskedReveal>
        </div>

        <div className="max-w-3xl mx-auto">
          <MaskedReveal delay={0.4}>
            <p className={`font-playfair text-[17px] md:text-[25px] font-normal leading-[1.4] ${isDark ? 'text-gray-400' : 'text-gray-500'} antialiased text-center`}>
            At Tech Eyrie, we don’t just create systems; we transform the way businesses operate. Working with luxury clients, industry leaders, and elite brands requires more than standard solutions. Every project we undertake is crafted with precision, innovation, and strategy, technology designed not just to support your business, but to make it stand out in the market. Redefining industries, turning complexity into clarity and operations into a strategic advantage.

            </p>
          </MaskedReveal>
        </div>
      </div>
    </section>
  );
};

export default Hero;