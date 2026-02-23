"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function BlogTalkToExpert({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.from(sectionRef.current, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative py-16 md:py-20 lg:py-24 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}
    >
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 md:px-12 lg:px-16">
        <h2
          className={`font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] mb-12 text-center ${
            isDark ? 'text-white' : 'text-[#111111]'
          }`}
        >
          Talk to <span className="italic font-playfair font-light">an expert</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Expert Card */}
          <div
            className={`p-6 rounded-2xl ${
              isDark ? 'bg-[#1a1a1a] border border-white/10' : 'bg-[#F5F5F5]'
            }`}
          >
            <h3
              className={`font-merriweather text-[13px] font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-[#111111]'
              }`}
            >
              Tycho Luijten
            </h3>
            <div className="space-y-3">
              <Link
                href="mailto:hello@dapper.agency"
                className={`block font-merriweather text-[14px] transition-colors ${
                  isDark
                    ? 'text-white/70 hover:text-[#74F5A1]'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                Contact Tycho
              </Link>
              <p
                className={`font-merriweather text-[14px] ${
                  isDark ? 'text-white/60' : 'text-[#666666]'
                }`}
              >
                hello@dapper.agency
              </p>
              <p
                className={`font-merriweather text-[14px] ${
                  isDark ? 'text-white/60' : 'text-[#666666]'
                }`}
              >
                +31 10 307 6707
              </p>
            </div>
          </div>

          {/* Locations */}
          <div
            className={`p-6 rounded-2xl ${
              isDark ? 'bg-[#1a1a1a] border border-white/10' : 'bg-[#F5F5F5]'
            }`}
          >
            <h3
              className={`font-merriweather text-[13px] font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-[#111111]'
              }`}
            >
              Dapper Rotterdam
            </h3>
            <p
              className={`font-merriweather text-[14px] leading-relaxed ${
                isDark ? 'text-white/70' : 'text-[#666666]'
              }`}
            >
              Weena 70, 13th floor
              <br />
              3012 CM Rotterdam
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl ${
              isDark ? 'bg-[#1a1a1a] border border-white/10' : 'bg-[#F5F5F5]'
            }`}
          >
            <h3
              className={`font-merriweather text-[13px] font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-[#111111]'
              }`}
            >
              Dapper Lisbon
            </h3>
            <p
              className={`font-merriweather text-[14px] leading-relaxed ${
                isDark ? 'text-white/70' : 'text-[#666666]'
              }`}
            >
              Av. Duque de Loulé 12,
              <br />
              1050-093 Lisbon
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

