"use client";
import React from "react";
import Link from "next/link";
import { MaskedReveal } from "../ui/MaskedRevel";

const JoinTeam = ({ theme = "light" }) => {
  const isDark = theme === "dark";

  return (
    <section className={`relative py-32 md:py-48 overflow-hidden border-b transition-colors duration-500 ${isDark ? 'bg-[#0B0B0B] text-white border-white/10' : 'bg-white text-black border-gray-100'}`}>
      
      {/* BACKGROUND ANIMATION */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
          
          {/* Path 1: Section Top -> Left Side */}
          <path 
            d="M 400 0 C 400 150 200 300 0 350" 
            stroke={isDark ? "#333333" : "#E5E7EB"} 
            strokeWidth="1.5"
          />
          <path 
            d="M 400 0 C 400 150 200 300 0 350" 
            stroke="url(#gradient1)" 
            strokeWidth="3"
            strokeDasharray="100 1000"
            strokeLinecap="round"
            className="animate-flow-out"
          />

          {/* Path 2: Section Top -> Right Side */}
          <path 
             d="M 1040 0 C 1040 150 1240 300 1440 350" 
             stroke={isDark ? "#333333" : "#E5E7EB"} 
             strokeWidth="1.5"
          />
           <path 
             d="M 1040 0 C 1040 150 1240 300 1440 350" 
             stroke="url(#gradient2)" 
             strokeWidth="3"
             strokeDasharray="100 1000"
             strokeLinecap="round"
             className="animate-flow-out"
          />

          {/* Path 3: Left Side -> Section Bottom */}
           <path 
             d="M 0 450 C 200 500 400 650 400 800" 
             stroke={isDark ? "#333333" : "#E5E7EB"} 
             strokeWidth="1.5"
          />
           <path 
             d="M 0 450 C 200 500 400 650 400 800" 
             stroke="url(#gradient1)" 
             strokeWidth="3"
             strokeDasharray="80 1000"
             strokeLinecap="round"
             className="animate-flow-out"
          />

          {/* Path 4: Right Side -> Section Bottom */}
           <path 
             d="M 1440 450 C 1240 500 1040 650 1040 800" 
             stroke={isDark ? "#333333" : "#E5E7EB"} 
             strokeWidth="1.5"
          />
           <path 
             d="M 1440 450 C 1240 500 1040 650 1040 800" 
             stroke="url(#gradient2)" 
             strokeWidth="3"
             strokeDasharray="80 1000"
             strokeLinecap="round"
             className="animate-flow-out"
          />

          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D9F99D" stopOpacity="0" />
              <stop offset="50%" stopColor="#84CC16" />
              <stop offset="100%" stopColor="#D9F99D" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 text-center">
        
        {/* Label */}
        <div className="mb-8">
           <MaskedReveal>
             <span className={`font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
               Our Team
             </span>
           </MaskedReveal>
        </div>

        {/* Title */}
        <div className="mb-12 md:mb-16">
          <MaskedReveal delay={0.1}>
            <h2 className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[0.95] tracking-[-0.03em] ${isDark ? 'text-white' : 'text-[#032219]'}`}>
              Ready to make <br />
              goods flow?
            </h2>
          </MaskedReveal>
        </div>

        {/* Link */}
        <div className="max-w-2xl mx-auto">
          <MaskedReveal delay={0.2}>
            <Link 
              href="#" 
              className={`inline-block font-merriweather text-[14px] font-semibold tracking-[0.16em] uppercase border-b pb-1 transition-colors ${
                  isDark 
                  ? 'text-white border-white hover:text-white/70 hover:border-white/70' 
                  : 'text-black border-black hover:text-[#032219]/70 hover:border-[#032219]/70'
              }`}
            >
              Join Our Team
            </Link>
          </MaskedReveal>
        </div>

      </div>

      <style jsx>{`
        .animate-flow-out {
          animation: flow 4s linear infinite;
        }

        @keyframes flow {
          from {
            stroke-dashoffset: 1100;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default JoinTeam;
