"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services1ListingDarkSurface } from '../services1/services1ListingSurfaces';

gsap.registerPlugin(ScrollTrigger);

export default function VideoSection({ theme = 'light', dark7 = false }) {
  const isDark = theme === 'dark';
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(videoRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-20 lg:py-24 transition-colors duration-500"
      style={
        isDark && dark7
          ? services1ListingDarkSurface
          : isDark
            ? { background: 'linear-gradient(to bottom, #1a1a1a 0%, #0a0a0a 100%)' }
            : { background: 'linear-gradient(to bottom, #e8ddd3 0%, #d4c4b8 100%)' }
      }
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Video Container */}
        <div 
          ref={videoRef}
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            aspectRatio: '16/9'
          }}
        >
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
            title="Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
