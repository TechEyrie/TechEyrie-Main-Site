'use client';

import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroExpertise({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const sectionRef = useRef(null);
  const [triangles, setTriangles] = useState([]);
  const triangleIdRef = useRef(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: 'power3.out' },
      });

      tl.from('.hero-badge', {
        y: 24,
        opacity: 0,
      })
        .from(
          '.hero-title-line',
          {
            y: 60,
            opacity: 0,
            skewY: 4,
            transformOrigin: 'top left',
            stagger: 0.06,
          },
          '-=0.3'
        )
        .from(
          '.hero-body',
          {
            y: 32,
            opacity: 0,
            stagger: 0.08,
          },
          '-=0.2'
        );
    }, section);

    return () => ctx.revert();
  }, []);

  // Cursor Trail Effect
  const createTriangle = useCallback((x, y) => {
    const id = triangleIdRef.current++;
    const size = Math.random() * 15 + 25;
    const rotation = Math.random() * 360;
    const greenShades = ['#74F5A1', '#5FE08D', '#4DD97F', '#3BC972'];
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
    const throttleDelay = 80;

    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastTime < throttleDelay) return;
      lastTime = currentTime;

      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      createTriangle(x, y);
    };

    section.addEventListener('mousemove', handleMouseMove);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
    };
  }, [createTriangle]);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden pt-40 md:pt-48 pb-36 md:pb-44 min-h-[85vh] ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#EFEFEF]'}`}
    >
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

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 mx-auto max-w-[1800px] px-4 md:px-6 lg:px-10">
        {/* Top text block: badge + full-width title */}
        <div className="max-w-[1400px]">
          {/* Badge */}
          <div className="hero-badge mb-10 flex items-center gap-3">
            <span className="inline-flex h-5 w-5 rounded-sm bg-[#74F5A1]" />
            <span className={`font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase ${isDark ? 'text-white' : 'text-[#212121]'}`}>
              B2B SaaS Agency
            </span>
          </div>

          {/* Title - same scale as /dark hero */}
          <h1 className={`font-italiana tracking-[-0.03em] ${isDark ? 'text-white' : 'text-[#111111]'}`}>
            <span className="hero-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.05] font-light">
              Hire an agency
            </span>
            <span className="hero-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] leading-[1.05] font-light -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem]">
              specialized in
            </span>
            <span className="hero-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] leading-[1.05] font-playfair italic font-light -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem]">
              B2B SaaS
            </span>
          </h1>
        </div>

        {/* Row: left = subcopy + CTA, right = Card */}
        <div className="mt-2 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-14">
          {/* Left column: subcopy + CTA */}
          <div className="hero-body lg:flex-1 max-w-[640px] flex flex-col">
            <p className={`mb-16 font-playfair text-[17px] md:text-[25px] font-normal leading-relaxed ${isDark ? 'text-white/90' : 'text-[#212121]'}`}>
              We help SaaS businesses build and scale marketing engines that generate pipeline.
            </p>

            {/* CTA Buttons */}
            <div className={`inline-flex flex-wrap items-center gap-4 rounded-2xl px-6 py-4 w-fit ${isDark ? 'bg-white/10' : 'bg-white'}`}>
              {/* Book a Strategy Call Button */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-lg bg-[#74F5A1] px-6 py-3.5 transition-all duration-300 hover:bg-[#5FE08D] hover:scale-105 hover:shadow-lg group"
              >
                <span className="font-merriweather text-[14px] font-semibold text-[#111111]">
                  Book a Strategy Call
                </span>
                <span className="flex h-5 w-5 items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12L12 4M12 4H6M12 4V10"
                      stroke="#111111"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>

              {/* Discover More Button */}
              <Link
                href="#discover"
                className={`inline-flex items-center gap-3 rounded-lg px-6 py-3.5 transition-all duration-300 hover:scale-105 hover:shadow-lg group ${isDark ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-200 hover:bg-gray-500'}`}
              >
                <span className={`font-merriweather text-[14px] font-semibold tracking-tight ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                  Discover more
                </span>
                <span className="flex h-5 w-5 items-center justify-center transition-transform duration-300 group-hover:translate-y-0.5">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 2L8 14M8 14L4 10M8 14L12 10"
                      stroke="#111111"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Right column: Card flush to the right */}
          <div className="hero-body lg:flex-shrink-0 lg:ml-auto lg:pb-12">
            <div className="w-[420px] max-w-full">
              <div className="rounded-2xl overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
                <div className="relative h-40 w-full bg-gradient-to-br from-[#B8A3FF] to-[#E8DEFF]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-16 w-32">
                      <Image
                        src="https://cdn.prod.website-files.com/67bd789ea8377ea95b1724ad/683979c61bb4c3a3f5a9f665_Storyteq_Logo_Light_Final.svg"
                        alt="CPP Logo"
                        fill
                        className="object-contain"
                        sizes="128px"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white px-5 py-5 md:px-6 md:py-6">
                  <p className="mb-3 font-merriweather text-[14px] font-semibold leading-snug text-[#4A3D8F]">
                    Trusted by 200+ platforms and marketplaces across Europe Solutions.
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative h-8 w-20">
                      <Image
                        src="https://cdn.prod.website-files.com/67bd789ea8377ea95b1724ad/683979c61bb4c3a3f5a9f665_Storyteq_Logo_Light_Final.svg"
                        alt="CPP"
                        fill
                        className="object-contain object-left"
                        sizes="80px"
                      />
                    </div>
                    <Link
                      href="#case"
                      aria-label="Open case study"
                      className="group flex h-9 w-9 items-center justify-center"
                    >
                      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[4px] bg-[#74F5A1] transition-all duration-500 ease-out group-hover:bg-black group-hover:scale-110 group-hover:-translate-y-[1px]">
                        <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-y-3 group-hover:opacity-0">
                          <svg width="14" height="14" viewBox="0 0 14 14">
                            <path
                              d="M7 1V13M7 13L3 9M7 13L11 9"
                              fill="none"
                              stroke="#212121"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className="absolute inset-0 flex items-center justify-center translate-y-[-12px] opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                          <svg width="14" height="14" viewBox="0 0 14 14">
                            <path
                              d="M7 1V13M7 13L3 9M7 13L11 9"
                              fill="none"
                              stroke="#74F5A1"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className={`mt-20 h-px w-full border-b ${isDark ? 'border-white/10' : 'border-black/10'}`} />
      </div>
    </section>
  );
}
