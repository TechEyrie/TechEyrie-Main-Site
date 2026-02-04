// components/AirplaneHero.jsx
"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

export default function AirplaneHero() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial state
      gsap.set([textRef.current, buttonRef.current, footerRef.current], { 
        opacity: 0, 
        y: 20 
      });

      // Animation sequence
      tl.to(textRef.current, { opacity: 1, y: 0, duration: 1.2 })
        .to(buttonRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.8")
        .to(footerRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.8");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black flex flex-col justify-between overflow-hidden font-sans"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/airplane-bg.jpg"
          alt="Airplane"
          fill
          priority
          className="object-cover object-center opacity-80"
        />
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-start pt-24 md:pt-32 px-6 sm:px-12 md:px-20 lg:px-32">
        <div ref={textRef} className="max-w-3xl">
          <h1 className="text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] font-light font-italiana text-white leading-[1.1] tracking-tight">
            We manage flights.
            <br />
            You grow your aviation
            <br />
            business.
          </h1>
        </div>

        <div ref={buttonRef} className="mt-8 md:mt-12">
          <Link
            href="/get-started"
            className="group relative inline-flex items-center justify-center px-10 py-3.5 overflow-hidden font-light font-merriweather text-black bg-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
          >
            <span className="relative text-sm tracking-widest font-regular uppercase">
              Get Started
            </span>
          </Link>
        </div>
      </div>

      {/* Footer Email Section */}
      <div 
        ref={footerRef}
        className="relative z-10 w-full px-6 sm:px-12 md:px-20 lg:px-32 pb-12"
      >
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/20 pb-8">
          <div className="w-full md:w-2/3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent border-none text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-merriweather font-light placeholder:text-gray-700 focus:outline-none focus:ring-0 transition-all"
            />
          </div>

          <button className="group flex items-center gap-3 bg-white/90 hover:bg-white text-black px-8 py-3 font-merriweather rounded-lg transition-all duration-300 shadow-lg">
            <span className="text-sm font-regular uppercase tracking-wider">Get Started</span>
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
