"use client";
import React from "react";
import Link from "next/link";
import { MaskedReveal } from "../ui/MaskedRevel";

const YardFuture = ({ theme = "light" }) => {
  const isDark = theme === "dark";

  return (
    <section className={`relative py-32 md:py-48 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#101e27] text-[#f3f3f3]' : 'bg-gray-50 text-black'}`}>
      
      {/* BACKGROUND ANIMATION - Connecting Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
          
          {/* Path 1: Continues from JoinTeam x=400 -> Flows down/left */}
          <path 
            d="M 400 0 C 400 300 300 600 0 700" 
            stroke={isDark ? "#12685b" : "#E5E7EB"} 
            strokeWidth="1.5"
          />
          <path 
            d="M 400 0 C 400 300 300 600 0 700" 
            stroke="url(#gradient-yard)" 
            strokeWidth="3"
            strokeDasharray="100 1000"
            strokeLinecap="round"
            className="animate-flow-yard"
          />

          {/* Path 2: Continues from JoinTeam x=1040 -> Flows down/right */}
          <path 
             d="M 1040 0 C 1040 300 1140 600 1440 700" 
             stroke={isDark ? "#12685b" : "#E5E7EB"} 
             strokeWidth="1.5"
          />
           <path 
             d="M 1040 0 C 1040 300 1140 600 1440 700" 
             stroke="url(#gradient-yard)" 
             strokeWidth="3"
             strokeDasharray="100 1000"
             strokeLinecap="round"
             className="animate-flow-yard"
          />

           {/* Additional ambient curve for depth */}
           <path 
             d="M -100 100 C 200 100 400 300 600 800" 
             stroke={isDark ? "#1b4732" : "#E5E7EB"} 
             strokeWidth="1"
             className="opacity-30"
          />

          <defs>
            <linearGradient id="gradient-yard" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#74F5A1" stopOpacity="0" />
              <stop offset="50%" stopColor="#a7b431" />
              <stop offset="100%" stopColor="#74F5A1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 text-center">
        
        {/* Title */}
        <div className="mb-16 md:mb-20">
          <MaskedReveal delay={0.1}>
            <h2 className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[0.95] tracking-[-0.03em] ${isDark ? 'text-[#f3f3f3]' : 'text-[#032219]'}`}>
          

             
             Luxury in Motion, <br className="hidden md:block" />
              precision in Control 
            </h2>
          </MaskedReveal>
        </div>

        {/* CTA Button */}
        <div className="max-w-2xl mx-auto">
          <MaskedReveal delay={0.2}>
             <Link 
               href="#"
               className={`about-lux-btn inline-flex items-center justify-center px-8 py-4 font-merriweather text-[14px] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 rounded-sm ${isDark ? '' : 'bg-[#032219] hover:bg-[#032219]/80 text-white'}`}
             >
               Redefine your Brand

             </Link>
          </MaskedReveal>
        </div>

      </div>

      <style jsx>{`
        .animate-flow-yard {
          animation: flow 5s linear infinite;
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

export default YardFuture;
