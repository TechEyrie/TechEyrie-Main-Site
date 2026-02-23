"use client";
import React from "react";
import { GridAnimation } from "./GridAnimation";
import { MaskedReveal } from "../ui/MaskedRevel";

const ADVISORS = [
  {
    name: "Shaleen Devgun",
    title: "Schneider, Diamond, Deloitte",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2574&auto=format&fit=crop", 
  },
  {
    name: "Andy Clarke",
    title: "C.H. Robinson, Arrive, DCLI",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop", 
  },
  {
    name: "Alan Gershenhorn",
    title: "UPS, Coyote, Marken, Transportation Insights",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop", 
  },
  {
    name: "James Wilson",
    title: "Strategic Advisor",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop", 
  },
];

const AdvisoryBoard = ({ theme = "light" }) => {
  const isDark = theme === "dark";

  return (
    <section className={`overflow-hidden border-b transition-colors duration-500 ${isDark ? 'bg-[#0B0B0B] text-white border-white/10' : 'bg-white text-black border-gray-100'}`}>
      
      {/* HEADER (With GridAnimation) */}
      <div className="relative pt-32 md:pt-48 pb-24 md:pb-32 px-6 md:px-12 text-center">
          <GridAnimation theme={theme} className="opacity-50" />

          <div className="relative z-10 max-w-6xl mx-auto">
            {/* Label */}
            <div className="mb-8">
               <MaskedReveal>
                 <span className={`font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                   Industry Strategic Advisory Board
                 </span>
               </MaskedReveal>
            </div>

            {/* Title */}
            <div className="mb-12 md:mb-16">
              <MaskedReveal delay={0.1}>
                <h2 className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[0.95] tracking-[-0.03em] ${isDark ? 'text-white' : 'text-[#032219]'}`}>
                  Thinking big, <br className="hidden md:block" />
                  reinventing logistics
                </h2>
              </MaskedReveal>
            </div>

            {/* Description */}
            <div className="max-w-2xl mx-auto">
              <MaskedReveal delay={0.2}>
                <p className={`font-merriweather text-[14px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Our strategic advisors bring deep industry expertise to help us reinvent the future of logistics, turning operational bottlenecks into a scalable, strategic advantage.
                </p>
              </MaskedReveal>
            </div>
          </div>
      </div>

      {/* ADVISORS GRID (Simple White Background) */}
      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 pb-24 md:pb-32 mt-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          {ADVISORS.map((advisor, index) => (
             <div 
               key={index}
               onMouseMove={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
                 e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
               }}
               className={`relative group border-r border-b ${isDark ? 'border-white/10' : 'border-gray-100'} p-8 md:p-12 flex flex-col items-center backdrop-blur-sm ${isDark ? 'bg-white/5' : 'bg-white/50'}`}
             >
                {/* Spotlight Glow */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "radial-gradient(600px circle at var(--x) var(--y), rgba(251, 191, 36, 0.15), transparent 40%)"
                  }}
                />

                {/* Border Glow */}
                <div 
                  className="absolute inset-0 pointer-events-none border border-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    maskImage: "radial-gradient(150px circle at var(--x) var(--y), black, transparent)",
                    WebkitMaskImage: "radial-gradient(150px circle at var(--x) var(--y), black, transparent)"
                  }}
                />

                {/* Corner Highlight (First Item Only) */}
                {index === 0 && (
                   <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none z-10">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#D9F99D] to-transparent" />
                      <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-[#D9F99D] to-transparent" />
                   </div>
                )}

                {/* Grid Crosshairs */}
                <div className={`absolute -top-[5px] -left-[5px] w-[11px] h-[11px] z-10 ${isDark ? 'text-gray-700' : 'text-gray-200'}`}>
                   <svg viewBox="0 0 10 10" className="w-full h-full"><path d="M5 0V10 M0 5H10" stroke="currentColor" strokeWidth="1"/></svg>
                </div>

                {/* Image */}
                <div className={`relative w-full aspect-square mb-8 overflow-hidden z-10 transition-transform duration-500 will-change-transform group-hover:scale-105 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                   <img 
                     src={advisor.image} 
                     alt={advisor.name} 
                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                   />
                </div>

                {/* Info */}
                <div className="text-center space-y-2 z-10">
                   <h3 className={`font-italiana text-[24px] md:text-[28px] font-light ${isDark ? 'text-white' : 'text-[#032219]'}`}>
                      {advisor.name}
                   </h3>
                   <p className={`font-merriweather text-[14px] font-medium px-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {advisor.title}
                   </p>
                </div>
             </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default AdvisoryBoard;
