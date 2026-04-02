"use client";
import React from "react";
import { MaskedReveal } from "../ui/MaskedRevel";
import { AboutLuxuryStaticBg } from "./AboutLuxuryStaticBg";

const LEADERS = [
  {
    name: "Darin Brannan",
    title: "Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop", 
  },
  {
    name: "Chris Brumett",
    title: "Chief Product Officer",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2574&auto=format&fit=crop", 
  },
  {
    name: "Kris Evans",
    title: "Chief Technology Officer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop", 
  },
  {
    name: "Sarah Jenkins",
    title: "VP of Operations",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop", 
  },
  {
    name: "Michael Chen",
    title: "Head of Engineering",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop", 
  },
  {
    name: "Emily Rodriguez",
    title: "Chief Marketing Officer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2661&auto=format&fit=crop", 
  },
  {
    name: "David Kim",
    title: "VP of Sales",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop", 
  },
  {
    name: "Jessica Wong",
    title: "Head of Product Design",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=2574&auto=format&fit=crop", 
  },
];

const Leaders = ({ theme = "light" }) => {
  const isDark = theme === "dark";

  return (
    <section className={`relative overflow-hidden py-32 md:py-48 px-6 md:px-12 border-b transition-colors duration-500 ${isDark ? 'text-[#f3f3f3] border-[#e0d1b6]/12' : 'bg-white text-black border-gray-100'}`}>
      {isDark && <AboutLuxuryStaticBg />}
      <div className="relative z-[1] max-w-[1800px] mx-auto text-center">
        
        {/* Label */}
        <div className="mb-8">
           <MaskedReveal>
             <span className={`font-merriweather about-lux-label text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase ${isDark ? '' : 'text-gray-400'}`}>
               Our Leaders
             </span>
           </MaskedReveal>
        </div>

        {/* Title */}
        <div className="mb-16 md:mb-24">
          <MaskedReveal delay={0.1}>
            <h2 className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[0.95] tracking-[-0.03em] ${isDark ? 'text-[#f3f3f3]' : 'text-black'}`}>
            Powered by<br className="hidden md:block" />
            visionaries in Technology   <br className="hidden md:block" />
            and refined by strategy
            </h2>
          </MaskedReveal>
        </div>

        {/* Subtitles */}
        <div className="max-w-2xl mx-auto space-y-12 mb-32">
          <MaskedReveal delay={0.2}>
            <p className={`font-merriweather text-[14px] leading-relaxed ${isDark ? 'text-[#c8c2ad]' : 'text-gray-600'}`}>
            Driven by innovation, refined execution, and industry insight, shaping the future of 
High-Value Brands

            </p>
          </MaskedReveal>

          <MaskedReveal delay={0.3}>
            <p className={`font-merriweather text-[14px] ${isDark ? 'text-[#c8c2ad]' : 'text-gray-600'}`}>
            Meet the Mater minds behind the strategies 

            </p>
          </MaskedReveal>
        </div>

        {/* LEADERS GRID */}
        <div className={`grid grid-cols-1 md:grid-cols-3 border-t border-l ${isDark ? 'border-[#e0d1b6]/12' : 'border-gray-100'}`}>
          {LEADERS.map((leader, index) => (
             <div 
               key={index}
               onMouseMove={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
                 e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
               }}
               className={`relative group border-r border-b ${isDark ? 'border-[#e0d1b6]/12' : 'border-gray-100'} p-8 md:p-12 lg:p-16 flex flex-col items-center overflow-hidden`}
             >
                {/* Spotlight Glow */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "radial-gradient(600px circle at var(--x) var(--y), rgba(116, 245, 161, 0.12), transparent 40%)"
                  }}
                />

                {/* Border Glow (Revealed by cursor) */}
                <div 
                  className="absolute inset-0 pointer-events-none border border-[#74F5A1]/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    maskImage: "radial-gradient(150px circle at var(--x) var(--y), black, transparent)",
                    WebkitMaskImage: "radial-gradient(150px circle at var(--x) var(--y), black, transparent)"
                  }}
                />

                {/* Corner Highlight (First Item Only) */}
                {index === 0 && (
                   <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none z-10">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#74F5A1] to-transparent" />
                      <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-[#a7b431] to-transparent" />
                   </div>
                )}

                {/* Grid Crosshairs (Decoration) */}
                <div className={`absolute -top-[5px] -left-[5px] w-[11px] h-[11px] z-10 ${isDark ? 'text-[#3d5a4a]' : 'text-gray-200'}`}>
                   <svg viewBox="0 0 10 10" className="w-full h-full"><path d="M5 0V10 M0 5H10" stroke="currentColor" strokeWidth="1"/></svg>
                </div>

                {/* Image */}
                <div className={`relative w-full aspect-square mb-8 overflow-hidden z-10 transition-transform duration-500 will-change-transform group-hover:scale-105 ${isDark ? 'bg-[#101e27]' : 'bg-gray-50'}`}>
                   <img 
                     src={leader.image} 
                     alt={leader.name} 
                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                   />
                </div>

                {/* Info */}
                <div className="text-center space-y-2 z-10">
                   <h3 className={`font-italiana text-[24px] md:text-[28px] font-light ${isDark ? 'text-[#f3f3f3]' : 'text-[#032219]'}`}>
                      {leader.name}
                   </h3>
                   <p className={`font-merriweather text-[14px] font-medium ${isDark ? 'text-[#c8c2ad]' : 'text-gray-500'}`}>
                      {leader.title}
                   </p>
                </div>
             </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Leaders;
