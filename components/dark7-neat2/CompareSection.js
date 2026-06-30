// components/CompareSection.jsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const TRADITIONAL_ITEMS = [
  'Marketing and sales work in silos',
  'Prioritizes MQLs',
  'Reporting stops at vanity metrics',
  'Relies on gated content for leads',
  'Sees marketing as a cost center',
  'Thinks in campaigns',
];

const MODERN_ITEMS = [
  'Marketing and sales collaborate to generate revenue',
  'Prioritizes pipeline growth and lead quality',
  'Metrics align with real business outcomes',
  'Provides ungated value that builds demand',
  'Proves marketing as a revenue driver',
  'Thinks in always-on demand gen',
];

export default function CompareSection({ theme = 'light' }) {
  const sectionRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);
  
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

  // Background styles based on theme
  const bgStyle = theme === 'dark' 
    ? {
        backgroundColor: '#2b2b2b',
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
          radial-gradient(ellipse at top left, rgba(60, 60, 60, 0.3), transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(50, 50, 50, 0.2), transparent 50%)
        `,
        backgroundBlendMode: 'overlay, normal, normal',
      }
    : { backgroundColor: lightColors.background };

  const noiseOverlayStyle = {
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
    const throttleDelay = 100;

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

  // Electric animation refs and state
  const animationIntervalRef = useRef(null);

  // Function to create smooth electrical hover effect
  const triggerElectricalAnimation = useCallback(() => {
    const titleLines = document.querySelectorAll(".hero-title-line");

    // Define colors based on theme
    const originalColor = theme === "dark" ? "#f3f3f3" : "#111111";
    const electricColor = theme === "dark" ? "#74F5A1" : "#3BC972";
    const brightElectricColor = theme === "dark" ? "#FFFFFF" : "#FFFFFF";

    // Create a single timeline for all lines
    const tl = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
      },
    });

    // Animate each line with an electrical sweep effect
    titleLines.forEach((line, lineIndex) => {
      // Get the text content
      const text = line.textContent;

      // Split text into spans for character-by-character animation
      if (!line.querySelector(".char")) {
        const chars = text
          .split("")
          .map(
            (char, i) =>
              `<span class="char" style="color: ${originalColor}; display: inline-block; position: relative;" data-index="${i}">${
                char === " " ? "&nbsp;" : char
              }</span>`
          )
          .join("");
        line.innerHTML = chars;
      }

      // Animate each character with electrical effect
      const chars = line.querySelectorAll(".char");
      chars.forEach((char, charIndex) => {
        // Randomize timing slightly for electrical feel
        const baseDelay = lineIndex * 0.5 + charIndex * 0.06;
        const randomDelay = Math.random() * 0.1;
        const totalDelay = baseDelay + randomDelay;

        // Electrical flicker effect
        tl.to(
          char,
          {
            duration: 0.12,
            color: brightElectricColor,
            scale: 1.05,
            delay: totalDelay,
            ease: "power2.out",
          },
          0
        )
          .to(
            char,
            {
              duration: 0.18,
              color: electricColor,
              scale: 1.02,
              delay: totalDelay + 0.12,
              ease: "sine.inOut",
            },
            0
          )
          .to(
            char,
            {
              duration: 0.3,
              color: originalColor,
              scale: 1,
              delay: totalDelay + 0.3,
              ease: "power2.in",
            },
            0
          );
      });
    });
  }, [theme]);

  const startElectricalAnimation = useCallback(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    setTimeout(() => {
      triggerElectricalAnimation();
    }, 800);

    animationIntervalRef.current = setInterval(() => {
      triggerElectricalAnimation();
    }, 10000);
  }, [triggerElectricalAnimation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      startElectricalAnimation();
    }, 1500);

    return () => {
      clearTimeout(timer);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [startElectricalAnimation]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    // Disable scroll-trigger animation on mobile/tablet
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) {
      setHasEntered(true); // show everything immediately
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.unobserve(sectionEl);
        }
      },
      {
        threshold: 0.45,
        rootMargin: '50px 0px',
      }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, []);

  // Stagger timing (ms)
  const STAGGER = 140;
  const traditionalTotal = TRADITIONAL_ITEMS.length * STAGGER;
  const modernBaseDelay = traditionalTotal + 200;

  // Calculate icon colors based on theme
  const traditionalIconBg = theme === 'dark' ? '#FFFFFF' : '#111111';
  const traditionalIconStroke = theme === 'dark' ? '#111111' : '#FFFFFF';
  const modernIconBg = '#74F5A1';
  const modernIconStroke = '#111111';

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
        className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32"
        style={bgStyle}
      >
        {/* Noise texture overlay */}
        {theme === 'dark' && (
          <div 
            className="absolute inset-0 pointer-events-none z-[1]"
            style={noiseOverlayStyle}
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

        {/* Decorative shapes - right */}
        <div className="pointer-events-none absolute right-0 top-20 hidden lg:block">
          <svg width="140" height="200" viewBox="0 0 140 200" fill="none">
            <rect x="0" y="0" width="70" height="70" rx="8" fill="#74F5A1" />
            <rect x="70" y="0" width="70" height="70" rx="8" fill={theme === 'dark' ? '#3a3a3a' : '#E8E8E8'} />
            <rect x="70" y="70" width="70" height="70" rx="8" fill="#74F5A1" />
            <rect x="0" y="140" width="70" height="70" rx="8" fill="#74F5A1" />
            <rect x="70" y="140" width="70" height="70" rx="8" fill={theme === 'dark' ? '#3a3a3a' : '#E8E8E8'} />
          </svg>
        </div>

        {/* Decorative shapes - left */}
        <div className="pointer-events-none absolute left-0 bottom-32 hidden lg:block">
          <svg width="100" height="160" viewBox="0 0 100 160" fill="none">
            <rect x="0" y="0" width="50" height="50" rx="6" fill="#74F5A1" />
            <rect x="0" y="60" width="50" height="50" rx="6" fill={theme === 'dark' ? '#3a3a3a' : '#E8E8E8'} />
            <rect x="0" y="120" width="50" height="50" rx="6" fill="#74F5A1" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8">
          {/* Label */}
          <div className="mb-6 sm:mb-8 md:mb-10 flex items-center justify-center gap-2 sm:gap-3">
            <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-sm bg-[#74F5A1]" />
            <span className={`font-[Helvetica Now Text,Arial,sans-serif] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-semibold tracking-[0.16em] uppercase ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
              Compare
            </span>
          </div>

          {/* Heading */}
          <h2 className={`mx-auto mb-6 sm:mb-8 md:mb-10 max-w-5xl text-center font-fellix leading-[1.08] tracking-[-0.02em] ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
            <span className="hero-title-line block text-[24px] sm:text-[28px] md:text-[36px] lg:text-[44px] xl:text-[52px] 2xl:text-[58px] 3xl:text-[68px] font-normal italic">
              Traditional B2B marketing
            </span>
            <span className="hero-title-line block text-[24px] sm:text-[28px] md:text-[36px] lg:text-[44px] xl:text-[52px] 2xl:text-[58px] 3xl:text-[68px] font-semibold">
              vs modern B2B marketing
            </span>
          </h2>

          {/* Subheading */}
          <p className={`mx-auto mb-10 sm:mb-14 md:mb-16 lg:mb-20 xl:mb-24 max-w-3xl text-center font-[Helvetica Now Text,Arial,sans-serif] text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px] font-regular leading-relaxed tracking-tight ${theme === 'dark' ? 'text-[#a0a0a0]' : 'text-[#444444]'}`}>
            B2B marketing is changing, fast. Attention spans are getting shorter,
            AI is getting smarter, and competition is increasing. That&apos;s why you
            need a partner who is a frontrunner in the industry.
          </p>

          {/* Comparison Grid */}
          <div className="grid gap-6 sm:gap-8 md:gap-10 lg:gap-14 xl:gap-20 md:grid-cols-2">
            {/* Traditional Column */}
            <div>
              <h3 className={`mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-center font-[Helvetica Now Text,Arial,sans-serif] text-[18px] sm:text-[22px] md:text-[24px] lg:text-[28px] xl:text-[32px] 2xl:text-[36px] 3xl:text-[40px] font-semibold tracking-tight ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
                Traditional B2B Marketing
              </h3>
              <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                {TRADITIONAL_ITEMS.map((item, index) => (
                  <div
                    key={index}
                    className={[
                      'flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 rounded-lg sm:rounded-xl md:rounded-2xl border',
                      theme === 'dark' 
                        ? 'border-white/[0.08] bg-[#3a3a3a]' 
                        : 'border-black/[0.08] bg-[#F9F9F9]',
                      'px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-6 lg:py-6 xl:px-8 xl:py-7',
                      'transition-all duration-600 ease-out',
                      hasEntered
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4',
                    ].join(' ')}
                    style={{
                      transitionDelay: hasEntered ? `${index * STAGGER}ms` : '0ms',
                    }}
                  >
                    <div 
                      className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: traditionalIconBg }}
                    >
                      <svg
                        width="14"
                        height="2"
                        className="sm:w-[16px] sm:h-[2.5px] md:w-[18px] md:h-3"
                        viewBox="0 0 22 3"
                        fill="none"
                        aria-hidden="true"
                      >
                        <line
                          x1="0"
                          y1="1.5"
                          x2="22"
                          y2="1.5"
                          stroke={traditionalIconStroke}
                          strokeWidth="3"
                        />
                      </svg>
                    </div>
                    <p className={`flex-1 font-[Helvetica Now Text,Arial,sans-serif] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[19px] 3xl:text-[23px] font-semibold leading-snug tracking-tight ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modern Column */}
            <div>
              <h3 className={`mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-center font-[Helvetica Now Text,Arial,sans-serif] text-[18px] sm:text-[22px] md:text-[24px] lg:text-[28px] xl:text-[32px] 2xl:text-[36px] 3xl:text-[40px] font-semibold tracking-tight ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
                Modern B2B Marketing
              </h3>
              <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                {MODERN_ITEMS.map((item, index) => (
                  <div
                    key={index}
                    className={[
                      'flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#74F5A1]/30',
                      theme === 'dark' 
                        ? 'bg-[#74F5A1]/[0.12]' 
                        : 'bg-[#74F5A1]/[0.08]',
                      'px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-6 lg:py-6 xl:px-8 xl:py-7',
                      'transition-all duration-600 ease-out',
                      hasEntered
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4',
                    ].join(' ')}
                    style={{
                      transitionDelay: hasEntered
                        ? `${modernBaseDelay + index * STAGGER}ms`
                        : '0ms',
                    }}
                  >
                    <div 
                      className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: modernIconBg }}
                    >
                      <svg
                        width="14"
                        height="14"
                        className="sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]"
                        viewBox="0 0 22 22"
                        fill="none"
                        aria-hidden="true"
                      >
                        <line
                          x1="11"
                          y1="0"
                          x2="11"
                          y2="22"
                          stroke={modernIconStroke}
                          strokeWidth="3"
                        />
                        <line
                          x1="0"
                          y1="11"
                          x2="22"
                          y2="11"
                          stroke={modernIconStroke}
                          strokeWidth="3"
                        />
                      </svg>
                    </div>
                    <p className={`flex-1 font-[Helvetica Now Text,Arial,sans-serif] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[19px] 3xl:text-[23px] font-semibold leading-snug tracking-tight ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}