"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services1ListingDarkSurface } from './services1ListingSurfaces';

gsap.registerPlugin(ScrollTrigger);

export default function Services1Hero({ theme = 'light', dark7 = false }) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax scroll and fade effect
      gsap.to(headingRef.current, {
        y: -150,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const isDark = theme === 'dark';
  
  return (
    <section 
      ref={sectionRef}
      className={`relative overflow-hidden min-h-[600px] sm:min-h-[700px] md:min-h-[800px] lg:min-h-[900px] ${!isDark ? 'bg-[#FF6B5A]' : isDark && dark7 ? '' : 'bg-[#1a1a1a]'}`}
      style={isDark && dark7 ? services1ListingDarkSurface : undefined}
    >
      <div className="relative mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8 pt-24 sm:pt-32 md:pt-40 lg:pt-48 xl:pt-52 pb-12 sm:pb-16 md:pb-20 min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex flex-col sm:flex-row sm:justify-between sm:items-stretch gap-8 sm:gap-0">
        
        {/* Left Side - Services Label + Heading */}
        <div 
          ref={headingRef}
          className="relative z-10 pl-0 sm:pl-2 md:pl-4 lg:pl-6 max-w-[700px] mb-0"
        >
          <p className={`font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase mb-6 sm:mb-8 md:mb-10 ${isDark && dark7 ? 's2-hero-eyebrow' : isDark ? 'text-white' : 'text-[#2d2d2d]'}`}>
            Services
          </p>
          
          <h1 className={`mb-0 font-italiana tracking-[-0.03em] ${isDark && dark7 ? 's2-hero-h1' : isDark ? 'text-white' : 'text-[#2d2d2d]'}`}>
            <span className="block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.05] font-light">
            We think 
            </span>
            <span className="block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] leading-[1.05] font-light -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem]">
            beyond limits
            </span>
          </h1>
        </div>

        {/* Right Side - Description (pushed to bottom on right) */}
        <div className="relative w-full sm:w-auto sm:max-w-[400px] md:max-w-[440px] lg:max-w-[480px] pr-0 sm:pr-2 md:pr-4 lg:pr-6 z-10 mt-auto sm:pt-0 flex flex-col sm:justify-end">
          <p className={`font-playfair text-[17px] md:text-[25px] font-normal leading-relaxed ${isDark && dark7 ? 's2-hero-desc' : isDark ? 'text-[#b0b0b0]' : 'text-[#2d2d2d]'}`}>
          We believe industries don’t just grow, it grows with intelligent decisions, organized systems and partners who believe. 


          </p>
        </div>
      </div>

      {/* Left Character - Placeholder for your illustration */}
      <div className="absolute bottom-0 left-0 w-[180px] h-[200px] sm:w-[220px] sm:h-[260px] md:w-[280px] md:h-[320px] lg:w-[340px] lg:h-[400px] xl:w-[420px] xl:h-[480px] 2xl:w-[500px] 2xl:h-[560px] pointer-events-none z-5 hidden sm:block">
        {/* Add your left character image here */}
        {/* <img src="/chaos-left.png" alt="Chaos characters" className="w-full h-full object-contain object-bottom" /> */}
      </div>

      {/* Right Character - Placeholder for your illustration */}
      <div className="absolute top-[80px] sm:top-[100px] md:top-[120px] lg:top-[140px] right-0 w-[150px] h-[320px] sm:w-[200px] sm:h-[420px] md:w-[240px] md:h-[520px] lg:w-[300px] lg:h-[620px] xl:w-[360px] xl:h-[700px] 2xl:w-[420px] 2xl:h-[780px] pointer-events-none z-5 hidden sm:block">
        {/* Add your right character image here */}
        {/* <img src="/success-right.png" alt="Success character" className="w-full h-full object-contain object-top" /> */}
      </div>

      {/* Paper Plane 1 - Flying in middle */}
      <div className="absolute top-[140px] sm:top-[160px] md:top-[180px] lg:top-[200px] left-[38%] sm:left-[42%] md:left-[46%] lg:left-[45%] w-[60px] h-[45px] sm:w-[80px] sm:h-[60px] md:w-[100px] md:h-[75px] lg:w-[120px] lg:h-[90px] pointer-events-none hidden sm:block z-10">
        <svg viewBox="0 0 120 90" fill="none" className="w-full h-full">
          <path 
            d="M 10 45 L 110 10 L 100 45 L 110 80 L 10 45 Z M 100 45 L 40 45" 
            fill="white" 
            stroke="#2d2d2d" 
            strokeWidth="2" 
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Paper Plane 2 - Small one near left character */}
      <div className="absolute bottom-[200px] sm:bottom-[240px] md:bottom-[280px] lg:bottom-[320px] left-[120px] sm:left-[150px] md:left-[180px] lg:left-[240px] xl:left-[320px] w-[45px] h-[35px] sm:w-[60px] sm:h-[45px] md:w-[75px] md:h-[55px] pointer-events-none hidden md:block z-10 opacity-80 rotate-[-15deg]">
        <svg viewBox="0 0 75 55" fill="none" className="w-full h-full">
          <path 
            d="M 5 27 L 70 5 L 65 27 L 70 50 L 5 27 Z M 65 27 L 25 27" 
            fill="white" 
            stroke="#2d2d2d" 
            strokeWidth="1.5" 
            opacity="0.85"
          />
        </svg>
      </div>

      {/* Decorative wavy line - Top Right */}
      <div className="absolute top-[100px] sm:top-[120px] md:top-[140px] right-[8%] sm:right-[12%] md:right-[16%] lg:right-[22%] w-[80px] h-[28px] sm:w-[100px] sm:h-[35px] md:w-[130px] md:h-[45px] pointer-events-none hidden sm:block z-10">
        <svg viewBox="0 0 130 45" fill="none" className="w-full h-full">
          <path 
            d="M 10 22 Q 35 12, 60 22 T 110 22" 
            stroke={isDark ? (dark7 ? '#74F5A1' : '#ffffff') : '#1a1a1a'} 
            strokeWidth="2.5" 
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Decorative squiggle - Yellow accent */}
      <div className="absolute top-[240px] sm:top-[280px] md:top-[320px] lg:top-[380px] right-[80px] sm:right-[100px] md:right-[130px] lg:right-[170px] xl:right-[210px] 2xl:right-[250px] w-[30px] h-[45px] sm:w-[40px] sm:h-[60px] md:w-[50px] md:h-[75px] pointer-events-none hidden sm:block z-10">
        <svg viewBox="0 0 50 75" fill="none" className="w-full h-full">
          <path 
            d="M 25 10 Q 32 30, 25 42 T 25 65" 
            stroke="#FFD93D" 
            strokeWidth="5" 
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
}
