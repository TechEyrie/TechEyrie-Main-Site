"use client";
import React from "react";
import { GridAnimation } from "./GridAnimation";
import { MaskedReveal } from "../ui/MaskedRevel";
import { AboutLuxuryStaticBg } from "./AboutLuxuryStaticBg";

const PARTNERS = [
  { name: "8VC", logo: "https://cdn.healthtechalpha.com/static/resized/social_media_image/investorsById/3856.png" },
  { name: "Lineage", logo: "https://cdn.healthtechalpha.com/static/resized/social_media_image/investorsById/3856.png" },
  { name: "NFI", logo: "https://cdn.healthtechalpha.com/static/resized/social_media_image/investorsById/3856.png" },
  { name: "Prologis", logo: "https://cdn.healthtechalpha.com/static/resized/social_media_image/investorsById/3856.png" },
  { name: "Ryder", logo: "https://cdn.healthtechalpha.com/static/resized/social_media_image/investorsById/3856.png" },
  { name: "Velocity Truck Centers", logo: "https://cdn.healthtechalpha.com/static/resized/social_media_image/investorsById/3856.png" },
  { name: "B37", logo: "https://cdn.healthtechalpha.com/static/resized/social_media_image/investorsById/3856.png" }, 
  { name: "The Friedkin Group", logo: "https://cdn.healthtechalpha.com/static/resized/social_media_image/investorsById/3856.png" },
  { name: "Trimac", logo: "https://cdn.healthtechalpha.com/static/resized/social_media_image/investorsById/3856.png" }
];

const Backing = ({ theme = "light" }) => {
  const isDark = theme === "dark";

  return (
    <section className={`overflow-hidden border-b transition-colors duration-500 ${isDark ? 'bg-[#162d24] text-[#f3f3f3] border-[#e0d1b6]/12' : 'bg-white text-black border-gray-100'}`}>
      
      {/* HEADER (With Background Animation) */}
      <div className="relative pt-32 md:pt-48 pb-24 md:pb-32 px-6 md:px-12 text-center">
         <GridAnimation theme={theme} className="opacity-50" />
         
         <div className="relative z-10 max-w-6xl mx-auto">
            {/* Title */}
            <div className="mb-12 md:mb-16">
              <MaskedReveal delay={0.1}>
                <h2 className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[0.95] tracking-[-0.03em] ${isDark ? 'text-[#f3f3f3]' : 'text-[#032219]'}`}>
                Built on Trust, Innovation <br className="hidden md:block" /> and Performance.

                </h2>
              </MaskedReveal>
            </div>

            {/* Description */}
            <div className="max-w-2xl mx-auto">
              <MaskedReveal delay={0.2}>
                <p className={`font-merriweather text-[14px] leading-relaxed ${isDark ? 'text-[#c8c2ad]' : 'text-gray-600'}`}>
                Prominent leaders found Tech Eyrie and our ability to deliver AI-driven high-impact solutions, this strategic alignment, a commitment to building platforms to redefine your business and chose to partner in shaping the future of logistics.

                </p>
              </MaskedReveal>
            </div>
         </div>
      </div>

      {/* PARTNERS GRID — static luxury gradient (no GridAnimation here) */}
      <div className="relative overflow-hidden px-6 md:px-12 pb-24 md:pb-32 mt-16 pt-8 md:pt-12">
        {isDark && <AboutLuxuryStaticBg />}
        <div className="relative z-[1] max-w-[1800px] mx-auto">
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-t border-l ${isDark ? 'border-[#e0d1b6]/12' : 'border-gray-100'}`}>
           {PARTNERS.map((partner, index) => (
             <div 
               key={index}
               onMouseMove={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
                 e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
               }}
               className={`relative group border-r border-b ${isDark ? 'border-[#e0d1b6]/12' : 'border-gray-100'} p-8 md:p-12 flex items-center justify-center aspect-[3/2] overflow-hidden backdrop-blur-sm ${isDark ? 'bg-white/[0.04]' : 'bg-white/50'}`}
             >
                {/* Spotlight Glow */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "radial-gradient(400px circle at var(--x) var(--y), rgba(116, 245, 161, 0.12), transparent 40%)"
                  }}
                />

                {/* Border Glow */}
                <div 
                  className="absolute inset-0 pointer-events-none border border-[#74F5A1]/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    maskImage: "radial-gradient(150px circle at var(--x) var(--y), black, transparent)",
                    WebkitMaskImage: "radial-gradient(150px circle at var(--x) var(--y), black, transparent)"
                  }}
                />

                {/* Corner Highlight (First Item Only) */}
                {index === 0 && (
                   <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none z-10">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#74F5A1] to-transparent" />
                      <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-[#a7b431] to-transparent" />
                   </div>
                )}

                {/* Grid Crosshairs */}
                <div className={`absolute -top-[5px] -left-[5px] w-[11px] h-[11px] z-10 ${isDark ? 'text-[#3d5a4a]' : 'text-gray-200'}`}>
                   <svg viewBox="0 0 10 10" className="w-full h-full"><path d="M5 0V10 M0 5H10" stroke="currentColor" strokeWidth="1"/></svg>
                </div>
                
                {/* Content (Logo or Text) */}
                <div className="relative z-10 flex items-center justify-center w-full h-full p-6">
                  {partner.logo ? (
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className={`max-h-16 md:max-h-20 w-auto object-contain transition-all duration-500 will-change-transform group-hover:scale-110 
                        ${isDark 
                          ? 'grayscale invert opacity-60 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100' 
                          : 'grayscale contrast-200 mix-blend-multiply opacity-80 group-hover:grayscale-0 group-hover:contrast-100 group-hover:mix-blend-normal group-hover:opacity-100'
                        }`}
                    />
                  ) : (
                    <span className={`font-italiana text-[24px] md:text-[32px] font-light tracking-tight transition-colors duration-300 ${isDark ? 'text-[#f3f3f3]/90 group-hover:text-[#f3f3f3]' : 'text-black/90 group-hover:text-black'}`}>
                      {partner.name}
                    </span>
                  )}
                </div>

             </div>
           ))}
           
           {/* Empty Cell for proper grid ending if needed, or let css grid handle it. 9 items fills 5-col grid incompletely, which is fine. */}
        </div>
        </div>
      </div>

    </section>
  );
};

export default Backing;
