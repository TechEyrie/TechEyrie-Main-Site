'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export default function B2BBuyersSection() {
  const sectionRef = useRef(null);
  const squaresRef = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title animation
      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: 'power3.out' },
      });

      tl.from('.b2b-badge', {
        y: 24,
        opacity: 0,
      })
        .from(
          '.b2b-title-line',
          {
            y: 60,
            opacity: 0,
            skewY: 4,
            transformOrigin: 'top left',
            stagger: 0.08,
          },
          '-=0.3'
        )
        .from(
          '.b2b-description',
          {
            y: 32,
            opacity: 0,
          },
          '-=0.2'
        )
        .from(
          '.b2b-cta',
          {
            y: 24,
            opacity: 0,
            scale: 0.95,
          },
          '-=0.1'
        );

      // Floating squares animation
      squaresRef.current.forEach((square, index) => {
        if (!square) return;

        gsap.to(square, {
          y: 'random(-30, 30)',
          x: 'random(-20, 20)',
          rotation: 'random(-15, 15)',
          duration: 'random(3, 5)',
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: index * 0.2,
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#EFEFEF] py-28 md:py-36 lg:py-44"
    >
      {/* Animated Floating Squares */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top Left Group */}
        <div
          ref={(el) => (squaresRef.current[0] = el)}
          className="absolute left-10 top-20 h-12 w-12 rounded-sm bg-[#74F5A1] opacity-60"
        />
        <div
          ref={(el) => (squaresRef.current[1] = el)}
          className="absolute left-10 top-36 h-10 w-10 rounded-sm bg-[#74F5A1] opacity-40"
        />
        <div
          ref={(el) => (squaresRef.current[2] = el)}
          className="absolute left-24 top-[140px] h-14 w-14 rounded-sm bg-[#5FE08D] opacity-50"
        />
        <div
          ref={(el) => (squaresRef.current[3] = el)}
          className="absolute left-2 top-[200px] h-12 w-12 rounded-sm bg-[#4DD97F] opacity-55"
        />

        {/* Right side scattered squares */}
        <div
          ref={(el) => (squaresRef.current[4] = el)}
          className="absolute right-20 top-32 h-10 w-10 rounded-sm bg-[#74F5A1] opacity-45"
        />
        <div
          ref={(el) => (squaresRef.current[5] = el)}
          className="absolute right-40 top-20 h-8 w-8 rounded-sm bg-[#5FE08D] opacity-50"
        />
        <div
          ref={(el) => (squaresRef.current[6] = el)}
          className="absolute right-16 bottom-32 h-12 w-12 rounded-sm bg-[#4DD97F] opacity-40"
        />
        <div
          ref={(el) => (squaresRef.current[7] = el)}
          className="absolute right-44 bottom-20 h-10 w-10 rounded-sm bg-[#74F5A1] opacity-55"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1800px] px-4 md:px-6 lg:px-10">
        <div className="flex flex-col">
          {/* Top Row - Badge + Title + Empty Space */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
            {/* Left - Badge + Title */}
            <div className="flex-1">
              {/* Badge */}
              <div className="b2b-badge mb-10 flex items-center gap-3">
                <span className="inline-flex h-5 w-5 rounded-sm bg-[#74F5A1]" />
                <span className="font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase text-[#212121]">
                  B2B buyers
                </span>
              </div>

              {/* Title */}
              <h2 className="font-italiana font-light leading-[0.95] tracking-[-0.03em] text-[#111111]">
                <span className="b2b-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px]">
                  Marketing for
                </span>
                <span className="b2b-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem]">
                  modern-day
                </span>
                <span className="b2b-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem] font-playfair italic font-light">
                  Go-To-Market
                </span>
              </h2>
            </div>

            {/* Right - Empty space on desktop for proper alignment */}
            <div className="hidden lg:block lg:w-[200px]"></div>
          </div>

          {/* Bottom Row - Description & CTA (Pulled to the left) */}
          <div className="mt-12 lg:mt-16 lg:ml-[50%]">
            <div className="lg:max-w-[650px]">
              <div className="b2b-description mb-10">
                <p className="font-playfair text-[17px] md:text-[25px] font-normal leading-[1.65] text-[#212121]">
                  How B2B buyers buy has changed. B2B buyers research themselves,
                  and will reach out to you when they're ready to buy. The job of
                  marketing is to educate and nurture prospects with great
                  content, and capture demand as effectively as possible.
                </p>
              </div>

              {/* CTA Button */}
              <div className="b2b-cta">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 rounded-lg bg-[#74F5A1] px-7 py-4 transition-all duration-300 hover:bg-[#5FE08D] hover:scale-105 hover:shadow-lg"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
