"use client";
import React from "react";
import { GridAnimation } from "./GridAnimation";
import { MaskedReveal } from "../ui/MaskedRevel";

const Values = ({ theme = "light" }) => {
  const isDark = theme === "dark";

  return (
    <section className={`relative py-24 md:py-32 overflow-hidden border-t transition-colors duration-500 ${isDark ? 'bg-[#162d24] text-[#f3f3f3] border-[#e0d1b6]/12' : 'bg-white text-black border-gray-100'}`}>
      {/* Background Animation */}
      <GridAnimation theme={theme} className="opacity-50" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="text-center mb-20 md:mb-32">
          <MaskedReveal>
            <h2 className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[0.95] tracking-[-0.03em] ${isDark ? 'text-[#f3f3f3]' : 'text-black'}`}>
              Our story, our values
            </h2>
          </MaskedReveal>
        </div>

        {/* 2-Column Text Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="space-y-8 md:space-y-12">
            <MaskedReveal delay={0.1}>
              <p className={`font-merriweather text-[14px] leading-relaxed ${isDark ? 'text-[#c8c2ad]' : 'text-gray-600'}`}>
                Every day, billions <strong className={`font-semibold ${isDark ? 'text-[#f3f3f3]' : 'text-black'}`}>billions of business takes place through a chain</strong>, yet inefficiency remains the same, outdated processes, spreadsheets and clipboards, resulting in obstructions and inefficiency which luxury clients reject.

              </p>
            </MaskedReveal>
            
            <div className="space-y-6">
              <MaskedReveal delay={0.2}>
                <h3 className={`font-italiana font-light text-[24px] md:text-[32px] tracking-[-0.03em] ${isDark ? 'text-[#f3f3f3]' : 'text-black'}`}>
                  TechEyrie is reinventing the yard.
                </h3>
              </MaskedReveal>
              <MaskedReveal delay={0.3}>
                <p className={`font-merriweather text-[14px] leading-relaxed ${isDark ? 'text-[#c8c2ad]' : 'text-gray-600'}`}>
                  {/* We are building the industry's first <strong className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>AI-native, Computer Vision-powered Yard Operating System (YOS)</strong> — designed to digitize, automate, and optimize yard operations end to end.
                   */}
                   At Tech Eyrie, we are not just operators but strategic advisors. Our AI native, computer powered Yard Operating system is tailored for accuracy, smooth and unmatched operation. 


                </p>
              </MaskedReveal>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 md:space-y-12">
            <MaskedReveal delay={0.2}>
              <p className={`font-merriweather text-[14px] leading-relaxed ${isDark ? 'text-[#c8c2ad]' : 'text-gray-600'}`}>
              But here in Tech Eyrie we transform complexity into strategic advantage, connecting data and workflow into a single ecosystem, delivering control and visibility over every operation. From gate operations, inventory to analytics, our solutions are tailored for precision, efficiency at ROI scale. By doing so, we lower the cost and unlock premium competitive advantage for high-value brands. Because the luxury B2B world is all about operational excellence. 

              </p>
            </MaskedReveal>

            <MaskedReveal delay={0.3}>
              <p className={`font-merriweather text-[14px] leading-relaxed ${isDark ? 'text-[#c8c2ad]' : 'text-gray-600'}`}>
              We craft solutions to elevate your business with confidence, automates, terminal digitizes, and YOS end-to-end transforming complexity into an intelligent and flawless system.
                {/* With backing from leading investors and partnerships with several of the top 10 logistics companies, Terminal is <strong className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>building with the industry, for the industry</strong> — setting the new standard for yard technology. */}
              </p>
            </MaskedReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;
