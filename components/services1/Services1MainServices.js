"use client";
import React from 'react';
import Image from 'next/image';

export default function Services1MainServices({ theme = 'light' }) {
  const isDark = theme === 'dark';
  
  return (
    <section className={`relative py-20 md:py-28 lg:py-36 xl:py-40 rounded-[32px] md:rounded-[40px] lg:rounded-[48px] -mt-12 md:-mt-16 lg:-mt-20 xl:-mt-24 z-20 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#EDE8E0]'}`}>
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-12 xl:px-16">
        <p className={`max-w-4xl mx-auto text-center font-merriweather text-[16px] md:text-[18px] lg:text-[20px] leading-[1.8] mb-12 md:mb-16 lg:mb-20 ${isDark ? 'text-[#d0d0d0]' : 'text-[#3f3f3f]'}`}>
          We believe industries don&apos;t just grow, they grow with intelligent decisions, organized systems, and partners who believe.
        </p>
        <div className="grid gap-12 md:gap-16 lg:gap-20 xl:gap-24 md:grid-cols-2">
          
          {/* Qualitative Research Card */}
          <div className={`rounded-[16px] md:rounded-[20px] p-8 md:p-10 lg:p-12 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-6 md:gap-8 ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'}`}>
            {/* Icon with GIF */}
            <div className="flex-shrink-0">
              <div className="relative w-[80px] h-[80px] md:w-[90px] md:h-[90px] lg:w-[100px] lg:h-[100px] rounded-full bg-gradient-to-br from-[#FF6B5A] to-[#FF8A7A] flex items-center justify-center overflow-hidden">
                <img
                  src="https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif"
                  alt="Qualitative Research Animation"
                  className="w-[65%] h-[65%] object-contain"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h2 className={`font-italiana font-light text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.01em] mb-4 md:mb-5 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
              From observation to strategy

              </h2>
              
              <p className={`font-merriweather text-[14px] leading-[1.7] ${isDark ? 'text-[#b0b0b0]' : 'text-[#4a4a4a]'}`}>
              Exploring human motivations behind every decision, through interviews, behavioural expertise and cultural insights we reveal what others miss Focusing on deeper concepts, smart strategies and turning data into practicable intelligence. Because understanding human behaviour is mandatory to expect an exceptional result. 

              </p>
            </div>
          </div>

          {/* Behavioural Analysis Card */}
          <div className={`rounded-[16px] md:rounded-[20px] p-8 md:p-10 lg:p-12 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-6 md:gap-8 ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'}`}>
            {/* Icon with GIF */}
            <div className="flex-shrink-0">
              <div className="relative w-[80px] h-[80px] md:w-[90px] md:h-[90px] lg:w-[100px] lg:h-[100px] rounded-full bg-gradient-to-br from-[#7EC977] to-[#9ED999] flex items-center justify-center overflow-hidden">
                <img
                  src="https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif"
                  alt="Behavioural Analysis Animation"
                  className="w-[65%] h-[65%] object-contain"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h2 className={`font-italiana font-light text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.01em] mb-4 md:mb-5 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
              Precision in Action

              </h2>
              
              <p className={`font-merriweather text-[14px] leading-[1.7] ${isDark ? 'text-[#b0b0b0]' : 'text-[#4a4a4a]'}`}>
              Our qualitative work emphasizes on what people actually do, not what they say. Through observational methods, time- tracking and behavioural data we bring out habits, decision making and patterns to a granular level, helping your business to respond with confidence across the audience, markets and touchpoints. 

              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
