// components/TalkToExpertSection.jsx
'use client';

import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TalkToExpertSection({ theme = 'light' }) {
  const sectionRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  
  // Triangle animation effects
  const [triangles, setTriangles] = useState([]);
  const triangleIdRef = useRef(0);

  // Color Palettes
  const lightColors = {
    primary: "#013825",      // Deep Forest Green
    secondary: "#9E8F72",    // Golden Brown (updated)
    tertiary: "#CEC8B0",     // Light Beige/Tan (updated)
    background: "#F9F7F0",   // Very light neutral for section background
  };

  // Background styles based on theme - KEEPING ORIGINAL AS DEFAULT
  const bgStyle = theme === 'dark' 
    ? {
        backgroundColor: '#f5f5f5', // White-gray background as in dapper.agency
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"),
          radial-gradient(ellipse at top left, rgba(0, 0, 0, 0.03), transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 0.02), transparent 50%)
        `,
        backgroundBlendMode: 'overlay, normal, normal',
      }
    : {
        backgroundColor: lightColors.background, // Light brown for light theme
      };

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.02) 1px, rgba(0, 0, 0, 0.02) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0, 0, 0, 0.02) 1px, rgba(0, 0, 0, 0.02) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.01) 2px, rgba(0, 0, 0, 0.01) 4px)
    `,
  };

  const lightNoiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px)
    `,
  };

  const createTriangle = useCallback((x, y) => {
    const id = triangleIdRef.current++;
    const size = Math.random() * 5 + 8;
    const rotation = Math.random() * 360;
    const greenShades = theme === 'dark' 
      ? ['#74F5A1', '#5FE08D', '#4DD97F', '#3BC972']
      : ['#013825', '#295E4C', '#9E8F72', '#CEC8B0'];
    const color = greenShades[Math.floor(Math.random() * greenShades.length)];

    const newTriangle = {
      id,
      x,
      y,
      size,
      rotation,
      color,
    };

    setTriangles((prev) => [...prev, newTriangle]);

    setTimeout(() => {
      setTriangles((prev) => prev.filter((t) => t.id !== id));
    }, 1050);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let lastTime = 0;
    const throttleDelay = 100;

    const handleMouseMove = (e) => {
      const currentSection = sectionRef.current;
      if (!currentSection) return;
      const currentTime = Date.now();
      if (currentTime - lastTime < throttleDelay) return;
      lastTime = currentTime;

      const rect = currentSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      createTriangle(x, y);
    };

    section.addEventListener('mousemove', handleMouseMove);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
    };
  }, [createTriangle]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const section = sectionRef.current;
    const leftText = leftTextRef.current;
    const rightText = rightTextRef.current;
    if (!section || !leftText || !rightText) return;

    const ctx = gsap.context(() => {
      // Only animate on desktop
      if (window.innerWidth >= 1024) {
        // Left text: move left as user scrolls down through the section
        gsap.fromTo(
          leftText,
          { x: 0 },
          {
            x: -150,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );

        // Right text: move right as user scrolls down through the section
        gsap.fromTo(
          rightText,
          { x: 0 },
          {
            x: 150,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes triangle-fade {
          0% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }

        .animate-triangle-fade {
          animation: triangle-fade 1.05s ease-out forwards;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32"
        style={bgStyle}
      >
        {/* Noise texture overlay */}
        {theme === 'dark' ? (
          <div 
            className="absolute inset-0 pointer-events-none z-[1]"
            style={noiseOverlayStyle}
          />
        ) : (
          <div 
            className="absolute inset-0 pointer-events-none z-[1]"
            style={lightNoiseOverlayStyle}
          />
        )}

        {/* CURSOR TRAIL TRIANGLES */}
        {triangles.map((triangle) => (
          <div
            key={triangle.id}
            className="pointer-events-none absolute z-[5] animate-triangle-fade"
            style={{
              left: `${triangle.x}px`,
              top: `${triangle.y}px`,
              width: '0',
              height: '0',
              borderLeft: `${triangle.size / 2}px solid transparent`,
              borderRight: `${triangle.size / 2}px solid transparent`,
              borderBottom: `${triangle.size}px solid ${triangle.color}`,
              transform: `translate(-50%, -50%) rotate(${triangle.rotation}deg)`,
              opacity: 0.7,
            }}
          />
        ))}

        {/* Subtle background pattern for light theme */}
        {theme === 'light' && (
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <svg
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-20"
            >
              <defs>
                <pattern
                  id="grid-pattern"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="20" cy="20" r="1" fill="#74F5A1" opacity="0.1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          </div>
        )}

        {/* Large decorative arrow background - subtle */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
          <svg width="600" height="600" viewBox="0 0 600 600" fill="none" className="w-full max-w-[600px]">
            <path
              d="M300 100L500 300L300 500M100 300H500"
              stroke={theme === 'light' ? '#74F5A1' : '#111111'}
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Decorative squares - bottom right */}
        <div className="pointer-events-none absolute bottom-16 right-12 hidden lg:block">
          <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
            <rect x="0" y="0" width="48" height="48" rx="8" fill={theme === 'light' ? '#4A4A4A' : '#E8E8E8'} />
            <rect x="62" y="0" width="48" height="48" rx="8" fill="#74F5A1" />
          </svg>
        </div>

        {/* Decorative squares - bottom left */}
        <div className="pointer-events-none absolute bottom-24 left-12 hidden lg:block">
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
            <rect x="0" y="0" width="70" height="70" rx="8" fill="#74F5A1" />
          </svg>
        </div>

        {/* Decorative square - top left */}
        <div className="pointer-events-none absolute top-20 left-20 hidden xl:block">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <rect x="0" y="0" width="50" height="50" rx="6" fill={theme === 'light' ? '#4A4A4A' : '#E8E8E8'} />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8">
          {/* Main content centered */}
          <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:flex-row lg:gap-12 xl:gap-20">
            {/* Left text: "Talk to" */}
            <div
              ref={leftTextRef}
              className="text-center lg:text-right will-change-transform"
            >
              <h2 className={`font-[Helvetica Now Text,Arial,sans-serif] text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] 3xl:text-[80px] 4xl:text-[96px] font-bold leading-[1.05] tracking-[-0.02em] ${theme === 'light' ? 'text-white' : 'text-[#111111]'}`}>
                Talk to
              </h2>
            </div>

            {/* Center: Stacked phone cards with expert images */}
            <div className="relative flex-shrink-0 my-6 sm:my-8 lg:my-0">
              {/* Back phone frame */}
              <div 
                className={`absolute -right-3 -top-2 sm:-right-4 sm:-top-3 md:-right-5 md:-top-4 lg:-right-6 lg:-top-4 z-0 h-[280px] w-[160px] sm:h-[340px] sm:w-[200px] md:h-[400px] md:w-[240px] lg:h-[460px] lg:w-[260px] xl:h-[500px] xl:w-[280px] 2xl:h-[520px] 2xl:w-[300px] rounded-[24px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[36px] border-[2px] sm:border-[2.5px] md:border-[3px] p-2 sm:p-2.5 md:p-3 ${theme === 'light' ? 'border-white/20 bg-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'border-black/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)]'}`}
                style={{ opacity: 0.4 }}
              >
                <div className={`relative h-full w-full overflow-hidden rounded-[18px] sm:rounded-[22px] md:rounded-[24px] lg:rounded-[28px] ${theme === 'light' ? 'bg-gradient-to-b from-[#3A3A3A] to-[#2A2A2A]' : 'bg-gradient-to-b from-gray-100 to-gray-200'}`}>
                  <div className="relative h-full w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop"
                      alt="Expert team member"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, (max-width: 1024px) 240px, (max-width: 1280px) 260px, (max-width: 1536px) 280px, 300px"
                    />
                  </div>
                </div>
                {/* Top notch */}
                <div className={`absolute left-1/2 top-2 sm:top-3 md:top-4 z-20 h-3 w-12 sm:h-4 sm:w-16 md:h-5 md:w-20 -translate-x-1/2 rounded-full ${theme === 'light' ? 'bg-[#1A1A1A]' : 'bg-white'}`} />
              </div>

              {/* Front phone frame */}
              <div 
                className={`relative z-10 h-[280px] w-[160px] sm:h-[340px] sm:w-[200px] md:h-[400px] md:w-[240px] lg:h-[460px] lg:w-[260px] xl:h-[500px] xl:w-[280px] 2xl:h-[520px] 2xl:w-[300px] rounded-[24px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[36px] border-[2px] sm:border-[2.5px] md:border-[3px] p-2 sm:p-2.5 md:p-3 ${theme === 'light' ? 'border-white/30 bg-[#1A1A1A] shadow-[0_35px_90px_rgba(0,0,0,0.6)]' : 'border-black/10 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.2)]'}`}
              >
                <div className={`relative h-full w-full overflow-hidden rounded-[18px] sm:rounded-[22px] md:rounded-[24px] lg:rounded-[28px] ${theme === 'light' ? 'bg-gradient-to-b from-[#3A3A3A] to-[#2A2A2A]' : 'bg-gradient-to-b from-gray-100 to-gray-200'}`}>
                  {/* Expert image */}
                  <div className="relative h-full w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=600&fit=crop"
                      alt="Marketing expert"
                      fill
                      className="object-cover object-top"
                      priority
                      sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, (max-width: 1024px) 240px, (max-width: 1280px) 260px, (max-width: 1536px) 280px, 300px"
                    />
                  </div>

                  {/* Green action badge at bottom */}
                  <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 z-10 -translate-x-1/2">
                    <Link
                      href="/contact"
                      aria-label="Contact an expert"
                      className="group flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl bg-[#74F5A1] shadow-[0_8px_25px_rgba(116,245,161,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_35px_rgba(116,245,161,0.6)] active:scale-95"
                    >
                      <svg
                        width="16"
                        height="16"
                        className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-[22px] lg:h-[22px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path
                          d="M5 12L19 12M19 12L12 5M19 12L12 19"
                          stroke="#111111"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Top notch/camera cutout effect */}
                <div className={`absolute left-1/2 top-2 sm:top-3 md:top-4 z-20 h-3 w-12 sm:h-4 sm:w-16 md:h-5 md:w-20 -translate-x-1/2 rounded-full ${theme === 'light' ? 'bg-[#1A1A1A]' : 'bg-white'}`} />
              </div>

              {/* Subtle glow behind phones */}
              <div className={`absolute inset-0 -z-10 scale-110 rounded-[24px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[36px] ${theme === 'light' ? 'bg-[#74F5A1]/8' : 'bg-[#74F5A1]/5'} blur-2xl`} />
            </div>

            {/* Right text: "an expert" */}
            <div
              ref={rightTextRef}
              className="text-center lg:text-left will-change-transform"
            >
              <h2 className={`font-[Helvetica Now Text,Arial,sans-serif] text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] 3xl:text-[80px] 4xl:text-[96px] font-normal italic leading-[1.05] tracking-[-0.02em] ${theme === 'light' ? 'text-white' : 'text-[#111111]'}`}>
                an expert
              </h2>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}