"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function Services2Hero({
  theme = 'dark',
  dark7 = false,
  kicker = 'Industries',
  titleLine1 = 'Industries & Sector',
  titleLine2 = 'Expertise',
  description = 'We make moves in these specialised industries and sectors.',
}) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const overlayRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax scroll effect for heading
      gsap.to(headingRef.current, {
        y: -120,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }
      });

      // Parallax effect for background image (slower than text)
      gsap.to(imageRef.current, {
        y: 200,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        }
      });

      // Fade in animation on load
      gsap.from([headingRef.current, descriptionRef.current], {
        opacity: 0,
        y: 50,
        duration: 1.4,
        ease: 'power3.out',
        stagger: 0.25,
        delay: 0.2,
      });

      // Overlay fade in
      gsap.from(overlayRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const isDark = theme === 'dark';
  
  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden min-h-[90vh] flex items-center justify-start"
    >
      {/* Background Image */}
      <div 
        ref={imageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
      >
        <Image
          src="https://wearebrain.com/wp-content/uploads/2025/06/Industries-640x293.webp"
          alt="Industries background"
          fill
          priority
          quality={95}
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Dark Overlay with Reddish/Orangish Gradient - Uniform across whole image */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 z-[1]"
        style={{
          background: isDark && dark7
            ? 'linear-gradient(135deg, rgba(22,45,36,0.88) 0%, rgba(0,81,96,0.5) 45%, rgba(22,45,36,0.92) 100%), linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 55%, rgba(22,45,36,0.75) 100%), radial-gradient(ellipse 90% 80% at 60% 85%, rgba(142,162,88,0.22) 0%, transparent 55%)'
            : isDark
              ? 'linear-gradient(to bottom, rgba(200, 60, 40, 0.35) 0%, rgba(220, 80, 50, 0.3) 50%, rgba(200, 60, 40, 0.35) 100%), linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.25) 100%)'
              : 'linear-gradient(to bottom, rgba(200, 60, 40, 0.4) 0%, rgba(220, 80, 50, 0.35) 50%, rgba(200, 60, 40, 0.4) 100%), linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 100%)'
        }}
      />

      {/* Content Container - Same layout as Services1: left heading, right description at bottom */}
      <div className="relative z-10 w-full min-h-[90vh] flex flex-col sm:flex-row sm:justify-between sm:items-stretch gap-8 sm:gap-0 pl-6 sm:pl-8 md:pl-12 lg:pl-16 xl:pl-20 pr-6 sm:pr-8 md:pr-12 lg:pr-16 xl:pr-20 py-24 md:py-32 lg:py-36">
        {/* Left - Label + Heading */}
        <div
          ref={headingRef}
          className="relative max-w-[700px] pt-12 md:pt-16 lg:pt-20"
        >
          <p className={`font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase mb-6 sm:mb-8 md:mb-10 ${isDark && dark7 ? 's2-hero-eyebrow' : 'text-white/95'}`}>
            {kicker}
          </p>
          <h1 className={`font-italiana font-light leading-[1.05] tracking-[-0.03em] ${isDark && dark7 ? 's2-hero-h1' : 'text-white'}`} style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            <span className="block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px]">
              {titleLine1}
            </span>
            <span className="block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem]">
              {titleLine2}
            </span>
          </h1>
        </div>

        {/* Right - Description at bottom */}
        <div
          ref={descriptionRef}
          className="relative w-full sm:w-auto sm:max-w-[400px] md:max-w-[440px] lg:max-w-[480px] mt-auto sm:pt-0 flex flex-col sm:justify-end"
        >
          <p className={`font-playfair text-[17px] md:text-[25px] font-normal leading-relaxed ${isDark && dark7 ? 's2-hero-desc' : 'text-white/95'}`} style={{ textShadow: '0 1px 10px rgba(0,0,0,0.2)' }}>
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
