// components/AirplaneHero.jsx
"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

export default function AirplaneHero({ theme = "dark" }) {
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
        y: 20,
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
      className="relative min-h-screen w-full bg-black flex flex-col justify-between overflow-hidden"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/airplane_bg.png"
          alt="Airplane"
          fill
          priority
          className="object-cover object-center opacity-80"
        />
        {/* Dark Gradient Overlay for text readability + page blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#162d24] via-black/60 to-[#162d24]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-start pt-24 md:pt-32 px-6 sm:px-12 md:px-20 lg:px-32">
        <div ref={textRef} className="max-w-3xl">
          <h1 className="font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] 3xl:text-[80px] text-[#f3f3f3] leading-[1.1] tracking-[0.01em]">
          Your competitors are already building.
            
            {/* We manage flights. */}
            <br />
            Are you?
            {/* You grow your aviation */}
            <br />
            {/* business. */}
          </h1>
        </div>

        <div ref={buttonRef} className="mt-8 md:mt-12">
          <Link
            href="/get-started"
            className="group inline-flex items-center justify-center self-start rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px]"
            style={{ backgroundColor: "#12685b" }}
          >
            <span className="font-merriweather text-[13px] sm:text-[14px] md:text-[15px] font-semibold tracking-wide text-white">
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
              className="w-full bg-transparent border-none text-[#f3f3f3] font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] placeholder:text-[#a0a0a0] focus:outline-none focus:ring-0 transition-all"
            />
          </div>

          <Link
            href="/get-started"
            className="group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px]"
            style={{ backgroundColor: "#12685b" }}
          >
            <span className="font-merriweather text-[13px] sm:text-[14px] md:text-[15px] font-semibold tracking-wide text-white">
              Get Started
            </span>
            <svg
              className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
