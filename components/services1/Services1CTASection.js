"use client";
import React from 'react';
import Link from 'next/link';

export default function Services1CTASection({ theme = 'light' }) {
  const isDark = theme === 'dark';
  
  return (
    <section className={`relative py-24 md:py-32 lg:py-40 xl:py-48 rounded-t-[32px] md:rounded-t-[40px] lg:rounded-t-[48px] -mt-12 md:-mt-16 lg:-mt-20 xl:-mt-24 z-30 overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#EDE8E0]'}`}>
      <div className="mx-auto max-w-[900px] px-6 md:px-8 text-center">
        {/* Heading */}
        <h2 className={`font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] leading-[1.15] tracking-[-0.015em] mb-10 md:mb-12 lg:mb-14 ${isDark ? 'text-white' : 'text-[#2d2d2d]'}`}>
          {/* Discover the tools we<br />use to get you there. */}
          Crafted for clarity 

        </h2>

        {/* CTA Button */}
        <Link 
          href="/methodology"
          className={`inline-flex items-center gap-3 hover:bg-[#FFC700] font-merriweather text-[14px] font-semibold px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg group ${isDark ? 'bg-[#74F5A1] text-[#1a1a1a] hover:bg-[#5FE08D]' : 'bg-[#FFD93D] text-[#1a1a1a]'}`}
        >
          <span>Methodology</span>
          <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 ${isDark ? 'bg-white' : 'bg-white'}`}>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 14 14" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#1a1a1a]"
            >
              <path 
                d="M1 7H13M13 7L7 1M13 7L7 13" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>
      </div>

      {/* Yellow Curved Bottom Decoration */}
     
    </section>
  );
}
