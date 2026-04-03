"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { services1ListingDarkSurface } from '../services1/services1ListingSurfaces';

gsap.registerPlugin(ScrollTrigger);

export default function ApproachSection({ theme = 'light', dark7 = false }) {
  const isDark = theme === 'dark';
  const sectionRef = useRef(null);
  const videoSectionRef = useRef(null);
  const textSectionRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const buttonsRef = useRef(null);
  const mainTextRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Video section animations
      gsap.from(labelRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from(headingRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        delay: 0.4,
      });

      gsap.from(subheadingRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        delay: 0.6,
      });

      gsap.from(buttonsRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.8,
      });

      // Text section animation on scroll
      gsap.from(mainTextRef.current, {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textSectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        }
      });

      gsap.from(iconRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: iconRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full transition-colors duration-500"
      style={
        isDark && dark7
          ? services1ListingDarkSurface
          : isDark
            ? { background: 'linear-gradient(to bottom, #1a1a1a 0%, #0a0a0a 100%)' }
            : { background: 'linear-gradient(to bottom, #e8ddd3 0%, #d4c4b8 100%)' }
      }
    >
      {/* Video/Hero Section */}
      <div 
        ref={videoSectionRef}
        className="relative mx-12 sm:mx-16 md:mx-24 lg:mx-32 xl:mx-40 pt-16 md:pt-20 lg:pt-24"
      >
        <div 
          className="relative w-full h-[500px] md:h-[600px] lg:h-[680px] rounded-3xl overflow-hidden"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}
        >
          {/* Background Video */}
          <div className="absolute inset-0 w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_30fps.mp4" type="video/mp4" />
              {/* Fallback for browsers that don't support video */}
              Your browser does not support the video tag.
            </video>
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12 lg:p-16">
            {/* Top Label */}
            <div ref={labelRef}>
              <span className="font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase text-white/90">
                Approach
              </span>
            </div>

            {/* Center Content */}
            <div className="flex-1 flex flex-col justify-center max-w-[800px]">
              <h2
                ref={headingRef}
                className="font-italiana font-light text-white text-[32px] sm:text-[42px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-0.03em] mb-4 md:mb-6"
              >
                Crafting the future with Tech Eyrie

              </h2>
              <p
                ref={subheadingRef}
                className="font-playfair text-[17px] md:text-[20px] font-normal text-white/90 leading-[1.5]"
              >
                We don’t deliver results, we engineer reality

              </p>
            </div>

            {/* Bottom Buttons */}
            <div
              ref={buttonsRef}
              className="flex flex-wrap gap-3"
            >
              <button
                className="px-5 py-2.5 rounded-full text-white font-merriweather text-[14px] hover:bg-[#74F5A1]/15 transition-colors cursor-pointer"
                style={{
                  border: isDark ? '1px solid rgba(116, 245, 161, 0.45)' : '1px solid #e8ddd3'
                }}
              >
                The Idea Forge
              </button>
              <button
                className="px-5 py-2.5 rounded-full text-white font-merriweather text-[14px] hover:bg-[#74F5A1]/15 transition-colors cursor-pointer"
                style={{
                  border: isDark ? '1px solid rgba(116, 245, 161, 0.45)' : '1px solid #e8ddd3'
                }}
              >
                The Reality Engine
              </button>
              <button
                className="px-5 py-2.5 rounded-full text-white font-merriweather text-[14px] hover:bg-[#74F5A1]/15 transition-colors cursor-pointer"
                style={{
                  border: isDark ? '1px solid rgba(116, 245, 161, 0.45)' : '1px solid #e8ddd3'
                }}
              >
                The Growth Driver
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div 
        ref={textSectionRef}
        className="relative px-6 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-20 md:py-28 lg:py-36"
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Main Text */}
          <h3
            ref={mainTextRef}
            className={`font-italiana font-light text-center text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-[1.4] tracking-[-0.03em] mb-16 md:mb-20 ${isDark && dark7 ? 's2-approach-highlight' : ''}`}
            style={{
              color: isDark && !dark7 ? '#74F5A1' : isDark && dark7 ? undefined : '#c7006e'
            }}
          >
          At Tech Eyrie, we are the architects of the future. Every challenge is a step to innovation, Every idea holds potential for reshaping the Digital world, our mission is to turn bold concepts into AI driven experiences that don’t just perform but evolve. 

          </h3>

          {/* Decorative Icon */}
          <div ref={iconRef} className="flex justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32">
              <svg 
                viewBox="0 0 100 100" 
                fill="none" 
                className="w-full h-full"
              >
                <g transform="translate(50,50)">
                  {[...Array(12)].map((_, i) => (
                    <g key={i} transform={`rotate(${i * 30})`}>
                      <path
                        d="M 0,-35 Q 5,-25 0,-15 Q -5,-25 0,-35"
                        fill={isDark ? '#74F5A1' : '#c7006e'}
                        opacity="0.8"
                      />
                    </g>
                  ))}
                  <circle cx="0" cy="0" r="8" fill={isDark ? '#74F5A1' : '#c7006e'} />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
