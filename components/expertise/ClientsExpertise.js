'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

const logos = [
  {
    name: 'Bedrijfsfitness Nederland',
    src: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=200&fit=crop',
    width: 280,
  },
  {
    name: 'Surepay',
    src: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=200&fit=crop',
    width: 240,
  },
  {
    name: 'Noovy',
    src: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=200&fit=crop',
    width: 220,
  },
  {
    name: 'Slidebuilder',
    src: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=200&fit=crop',
    width: 260,
  },
  {
    name: 'Whiffle',
    src: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=200&fit=crop',
    width: 240,
  },
  {
    name: 'Deployteq',
    src: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=200&fit=crop',
    width: 260,
  },
];

export default function ClientsSection() {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const animationRef = useRef(null);
  const [baseSpeed, setBaseSpeed] = useState(60);
  const lastScrollY = useRef(0);
  const currentDirection = useRef(1); // 1 for right-to-left, -1 for left-to-right
  const targetDirection = useRef(1);
  const isTransitioning = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const scroller = scrollerRef.current;
    if (!container || !scroller) return;

    // Clone the items for seamless infinite scroll
    const scrollerContent = Array.from(scroller.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scroller.appendChild(duplicatedItem);
    });

    // Calculate total width
    const scrollerWidth = scroller.scrollWidth / 2;

    // Create continuous GSAP animation with variable direction
    const startAnimation = () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }

      let currentX = gsap.getProperty(scroller, 'x') || 0;

      animationRef.current = gsap.to(scroller, {
        x: '-=' + (scrollerWidth * 10), // Large value for continuous movement
        duration: baseSpeed * 5,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: (x) => {
            const value = parseFloat(x);
            return `${((value % scrollerWidth) + scrollerWidth) % scrollerWidth - scrollerWidth}px`;
          },
        },
        onRepeat: function() {
          this.progress(0);
        }
      });

      // Set initial timeScale based on direction
      animationRef.current.timeScale(currentDirection.current);
    };

    startAnimation();

    // Handle scroll direction change with smooth transition
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      
      if (Math.abs(scrollDelta) > 1) {
        // Determine target scroll direction
        targetDirection.current = scrollDelta > 0 ? 1 : -1;
        
        // Smooth direction change
        if (targetDirection.current !== currentDirection.current && !isTransitioning.current) {
          isTransitioning.current = true;
          currentDirection.current = targetDirection.current;
          
          if (animationRef.current) {
            gsap.to(animationRef.current, {
              timeScale: currentDirection.current,
              duration: 1.2,
              ease: 'power2.inOut',
              onComplete: () => {
                isTransitioning.current = false;
              }
            });
          }
        }

        // Increase speed temporarily when scrolling
        const speedMultiplier = Math.min(2.5, 1 + Math.abs(scrollDelta) / 120);
        
        if (animationRef.current && !isTransitioning.current) {
          gsap.to(animationRef.current, {
            timeScale: currentDirection.current * speedMultiplier,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }

        // Reset speed after scroll stops
        clearTimeout(window.scrollResetTimer);
        window.scrollResetTimer = setTimeout(() => {
          if (animationRef.current && !isTransitioning.current) {
            gsap.to(animationRef.current, {
              timeScale: currentDirection.current,
              duration: 1,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        }, 200);
      }

      lastScrollY.current = currentScrollY;
    };

    // Throttle scroll handler for better performance
    let scrollTicking = false;
    const throttledScroll = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (animationRef.current) {
        animationRef.current.kill();
      }
      if (window.scrollResetTimer) {
        clearTimeout(window.scrollResetTimer);
      }
    };
  }, [baseSpeed]);

  return (
    <section className="relative w-full overflow-hidden bg-[#EFEFEF] py-20 md:py-28">
      <div className="mx-auto max-w-[1800px] px-4 md:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Left: Badge + Title */}
            <div className="flex-1">
              {/* Badge */}
              <div className="mb-8 flex items-center gap-3">
                <span className="inline-flex h-5 w-5 rounded-sm bg-[#74F5A1]" />
                <span className="font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase text-[#212121]">
                  Clients
                </span>
              </div>

              {/* Title */}
              <h2 className="font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.05] tracking-[-0.02em] text-[#111111]">
                <span className="block">50+ B2B software companies</span>
                <span className="block -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem] text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px]">trust us to improve their</span>
                <span className="block -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem] text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] font-playfair italic font-light">Marketing ROI</span>
              </h2>
            </div>

            {/* Right: CTA Button - Bottom Right Aligned */}
            <div className="lg:flex items-end pb-2">
              <button className="group flex items-center gap-3 rounded-lg bg-white px-6 py-4 transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-lg">
                <span className="font-merriweather text-[14px] font-semibold text-[#111111]">
                  Explore our results
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
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Scrolling Logos */}
      <div ref={containerRef} className="relative w-full overflow-hidden">
        {/* Gradient Overlays */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#EFEFEF] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#EFEFEF] to-transparent" />

        {/* Scrolling Container */}
        <div
          ref={scrollerRef}
          className="flex items-center gap-6 md:gap-8"
        >
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center rounded-md bg-white p-10 md:p-14 lg:p-16 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:scale-105"
              style={{ 
                width: `${logo.width + 120}px`,
                minWidth: `${logo.width + 120}px`,
              }}
            >
              <div className="relative w-full h-32 md:h-40 lg:h-44">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  className="object-contain grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                  sizes={`${logo.width + 120}px`}
                  priority={index < 3}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
