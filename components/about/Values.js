"use client";
import React from "react";
import { GridAnimation } from "./GridAnimation";
import { MaskedReveal } from "../ui/MaskedRevel";

const Values = ({ theme = "light" }) => {
  const isDark = theme === "dark";

  return (
    <section className={`relative py-24 md:py-32 overflow-hidden border-t transition-colors duration-500 ${isDark ? 'bg-[#0B0B0B] text-white border-white/10' : 'bg-white text-black border-gray-100'}`}>
      {/* Background Animation */}
      <GridAnimation theme={theme} className="opacity-50" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="text-center mb-20 md:mb-32">
          <MaskedReveal>
            <h2 className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[0.95] tracking-[-0.03em] ${isDark ? 'text-white' : 'text-black'}`}>
              Our story, our values
            </h2>
          </MaskedReveal>
        </div>

        {/* 2-Column Text Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="space-y-8 md:space-y-12">
            <MaskedReveal delay={0.1}>
              <p className={`font-merriweather text-[14px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Every day, over <strong className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>$50 billion of goods move through 50,000+ U.S. warehouses</strong> — yet 35% of that supply chain stalls in the yard. While transportation and warehouse systems have modernized, the yard remains the industry's blind spot, still run on clipboards, spreadsheets, and outdated IoT. The result? Bottlenecks, wasted labor, and millions lost in inefficiency.
              </p>
            </MaskedReveal>
            
            <div className="space-y-6">
              <MaskedReveal delay={0.2}>
                <h3 className={`font-italiana font-light text-[24px] md:text-[32px] tracking-[-0.03em] ${isDark ? 'text-white' : 'text-black'}`}>
                  Terminal is reinventing the yard.
                </h3>
              </MaskedReveal>
              <MaskedReveal delay={0.3}>
                <p className={`font-merriweather text-[14px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  We are building the industry's first <strong className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>AI-native, Computer Vision-powered Yard Operating System (YOS)</strong> — designed to digitize, automate, and optimize yard operations end to end.
                </p>
              </MaskedReveal>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 md:space-y-12">
            <MaskedReveal delay={0.2}>
              <p className={`font-merriweather text-[14px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Our platform connects cameras, data, and workflows into one seamless layer of visibility and control. From <strong className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>gate acceleration</strong> to <strong className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>asset inventory, compliance, orchestration, analytics, YMS-reimagined</strong>, Terminal delivers rapid ROI: reducing costs, accelerating throughput, and unlocking new revenue opportunities for the world's largest logistics operators.
              </p>
            </MaskedReveal>

            <MaskedReveal delay={0.3}>
              <p className={`font-merriweather text-[14px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                With backing from leading investors and partnerships with several of the top 10 logistics companies, Terminal is <strong className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>building with the industry, for the industry</strong> — setting the new standard for yard technology.
              </p>
            </MaskedReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;
