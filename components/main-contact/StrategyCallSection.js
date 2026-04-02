// components/StrategyCallSection.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import { dark7MainSurfaceStyle } from "../dark7/dark7PageSurface";

gsap.registerPlugin(Draggable);

const strategySteps = [
  {
    id: 1,
    number: '01',
    title: 'Discovery Meeting',
    description: "We take the time to understand your business, marketing goals, and challenges — so we can get a clear picture of what you truly need."
  },
  {
    id: 2,
    number: '02',
    title: 'Analysis of Marketing Set-up',
    description: "We analyze your marketing setup to identify opportunities and gaps."
  },
  {
    id: 3,
    number: '03',
    title: 'Strategy Presentation',
    description: "In a follow-up call, we share our findings and an initial roadmap for higher marketing ROI."
  },
  {
    id: 4,
    number: '04',
    title: 'Custom Solution Design',
    description: "Based on our analysis, we design a tailored marketing strategy that aligns with your business objectives and budget."
  },
  {
    id: 5,
    number: '05',
    title: 'Implementation Planning',
    description: "We create a detailed implementation plan with timelines, milestones, and key performance indicators to track progress."
  },
  {
    id: 6,
    number: '06',
    title: 'Ongoing Support',
    description: "We provide continuous support and optimization to ensure your marketing engine delivers maximum ROI over time."
  }
];

export default function StrategyCallSection({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const draggableInstanceRef = useRef(null);

  const getVisibleCards = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const [visibleCards, setVisibleCards] = useState(1);

  useEffect(() => {
    setVisibleCards(getVisibleCards());

    const handleResize = () => {
      setVisibleCards(getVisibleCards());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, strategySteps.length - visibleCards);

  useEffect(() => {
    if (!carouselRef.current || !containerRef.current) return;

    const carousel = carouselRef.current;
    const container = containerRef.current;

    const updateBounds = () => {
      const containerWidth = container.offsetWidth;
      const carouselWidth = carousel.scrollWidth;
      const maxDrag = Math.max(0, carouselWidth - containerWidth);
      
      return {
        minX: -maxDrag,
        maxX: 0
      };
    };

    const bounds = updateBounds();

    const draggableInstance = Draggable.create(carousel, {
      type: 'x',
      bounds: bounds,
      inertia: true,
      dragResistance: 0.3,
      edgeResistance: 0.65,
      onDragStart: function() {
        setIsDragging(true);
      },
      onDrag: function() {
        const cardWidth = carousel.children[0]?.offsetWidth || 0;
        const gap = 24;
        const offset = Math.abs(this.x);
        const newIndex = Math.round(offset / (cardWidth + gap));
        setCurrentIndex(Math.min(newIndex, maxIndex));
      },
      onDragEnd: function() {
        setIsDragging(false);
        const cardWidth = carousel.children[0]?.offsetWidth || 0;
        const gap = 24;
        const offset = Math.abs(this.x);
        const newIndex = Math.round(offset / (cardWidth + gap));
        const clampedIndex = Math.max(0, Math.min(newIndex, maxIndex));
        
        gsap.to(carousel, {
          x: -clampedIndex * (cardWidth + gap),
          duration: 0.3,
          ease: 'power2.out'
        });
        
        setCurrentIndex(clampedIndex);
      },
      snap: function(endValue) {
        const cardWidth = carousel.children[0]?.offsetWidth || 0;
        const gap = 24;
        return Math.round(endValue / (cardWidth + gap)) * (cardWidth + gap);
      }
    })[0];

    draggableInstanceRef.current = draggableInstance;

    const handleResize = () => {
      const newBounds = updateBounds();
      draggableInstance.applyBounds(newBounds);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (draggableInstance) {
        draggableInstance.kill();
      }
    };
  }, [maxIndex, visibleCards]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      
      if (carouselRef.current) {
        const cardWidth = carouselRef.current.children[0]?.offsetWidth || 0;
        const gap = 24;
        
        gsap.to(carouselRef.current, {
          x: -newIndex * (cardWidth + gap),
          duration: 0.5,
          ease: 'power2.out'
        });

        if (draggableInstanceRef.current) {
          draggableInstanceRef.current.update();
        }
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      
      if (carouselRef.current) {
        const cardWidth = carouselRef.current.children[0]?.offsetWidth || 0;
        const gap = 24;
        
        gsap.to(carouselRef.current, {
          x: -newIndex * (cardWidth + gap),
          duration: 0.5,
          ease: 'power2.out'
        });

        if (draggableInstanceRef.current) {
          draggableInstanceRef.current.update();
        }
      }
    }
  };

  const bgStyle = isDark ? dark7MainSurfaceStyle : { backgroundColor: "#F9F7F0" };

  const carouselNavBtn =
    "min-h-12 min-w-12 xl:min-h-14 xl:min-w-14 flex items-center justify-center rounded-[8px] transition-all duration-200";

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 relative" style={bgStyle}>
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12 mb-12 sm:mb-16 lg:mb-20">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <span
                className="h-2 w-10 sm:w-12 rounded-full shrink-0"
                style={{ backgroundColor: "#a7b431" }}
                aria-hidden
              />
              <span
                className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.16em] ${
                  isDark ? "text-[#e0d1b6]" : "text-[#162d24]"
                }`}
              >
                Strategy call
              </span>
            </div>

            <h2
              className={`font-italiana font-light text-[2rem] min-[400px]:text-[2.5rem] sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-[1.05] tracking-[0.01em] max-w-4xl ${
                isDark ? "text-[#e0d1b6]" : "text-[#162d24]"
              }`}
            >
              Here&apos;s what to expect
            </h2>
          </div>
        </div>

        <div className="flex items-center justify-end mb-6 sm:mb-8 lg:mb-8">
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`strategy-carousel-nav ${carouselNavBtn} ${
                currentIndex === 0
                  ? isDark
                    ? "cursor-not-allowed opacity-40 border border-white/10 bg-[#1a1a1a] text-white"
                    : "cursor-not-allowed opacity-40 border border-gray-300 bg-gray-200 text-gray-500"
                  : isDark
                    ? "cursor-pointer border border-white/15 bg-[#12685b] text-white shadow-[0_8px_24px_rgba(18,104,91,0.35)] hover:scale-105 hover:bg-[#0f5a4f] hover:shadow-[0_12px_28px_rgba(18,104,91,0.4)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#74F5A1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#162d24]"
                    : "cursor-pointer border border-black/10 bg-[#12685b] text-white shadow-[0_8px_24px_rgba(18,104,91,0.25)] hover:scale-105 hover:bg-[#0f5a4f] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#74F5A1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F7F0]"
              }`}
              aria-label="Previous slide"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={currentIndex === 0 ? 'opacity-50' : ''}
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={`strategy-carousel-nav ${carouselNavBtn} ${
                currentIndex >= maxIndex
                  ? isDark
                    ? "cursor-not-allowed opacity-40 border border-white/10 bg-[#1a1a1a] text-white"
                    : "cursor-not-allowed opacity-40 border border-gray-300 bg-gray-200 text-gray-500"
                  : isDark
                    ? "cursor-pointer border-0 bg-[#12685b] text-white shadow-[0_8px_28px_rgba(18,104,91,0.4)] hover:scale-105 hover:brightness-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#74F5A1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#162d24]"
                    : "cursor-pointer border border-black/10 bg-[#12685b] text-white shadow-[0_8px_24px_rgba(18,104,91,0.25)] hover:scale-105 hover:brightness-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#74F5A1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F7F0]"
              }`}
              aria-label="Next slide"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={currentIndex >= maxIndex ? 'opacity-50' : ''}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing -mx-1 px-1"
        >
          <div
            ref={carouselRef}
            className={`flex gap-6 ${isDragging ? "select-none" : ""}`}
            style={{ touchAction: "pan-x" }}
          >
            {strategySteps.map((step) => (
              <div
                key={step.id}
                className={`flex-shrink-0 w-[min(100%,calc(100vw-2.5rem))] sm:w-[calc(50%-10px)] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] ${
                  isDark
                    ? "bg-[#101e27] border border-[rgba(167,180,49,0.24)]"
                    : "bg-white border border-black/10 shadow-sm"
                } rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between min-h-[320px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[480px]`}
                style={{ userSelect: isDragging ? "none" : "auto" }}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
                    <h3
                      className={`font-italiana font-light text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl leading-[1.12] tracking-[0.01em] pr-2 flex-1 min-w-0 ${
                        isDark ? "text-[#e0d1b6]" : "text-[#162d24]"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <span
                      className={`font-playfair italic font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl tabular-nums flex-shrink-0 ${
                        isDark ? "text-[#a7b431]" : "text-[#1b4732]"
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>
                </div>

                <p
                  className={`font-merriweather font-light text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] leading-relaxed ${
                    isDark ? "text-[#d0d0d0]" : "text-[#374635]"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex lg:hidden items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`strategy-carousel-nav ${carouselNavBtn} sm:min-h-14 sm:min-w-14 ${
              currentIndex === 0
                ? isDark
                  ? "cursor-not-allowed opacity-40 border border-white/10 bg-[#1a1a1a] text-white"
                  : "cursor-not-allowed opacity-40 border border-gray-300 bg-gray-200 text-gray-500"
                : isDark
                  ? "cursor-pointer border border-white/15 bg-[#12685b] text-white shadow-[0_8px_24px_rgba(18,104,91,0.35)] hover:scale-105 hover:bg-[#0f5a4f] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#74F5A1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#162d24]"
                  : "cursor-pointer border border-black/10 bg-[#12685b] text-white shadow-[0_8px_24px_rgba(18,104,91,0.25)] hover:scale-105 hover:bg-[#0f5a4f] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#74F5A1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F7F0]"
            }`}
            aria-label="Previous slide"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={currentIndex === 0 ? 'opacity-50' : ''}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`strategy-carousel-nav ${carouselNavBtn} sm:min-h-14 sm:min-w-14 ${
              currentIndex >= maxIndex
                ? isDark
                  ? "cursor-not-allowed opacity-40 border border-white/10 bg-[#1a1a1a] text-white"
                  : "cursor-not-allowed opacity-40 border border-gray-300 bg-gray-200 text-gray-500"
                : isDark
                  ? "cursor-pointer border-0 bg-[#12685b] text-white shadow-[0_8px_28px_rgba(18,104,91,0.4)] hover:scale-105 hover:brightness-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#74F5A1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#162d24]"
                  : "cursor-pointer border border-black/10 bg-[#12685b] text-white shadow-[0_8px_24px_rgba(18,104,91,0.25)] hover:scale-105 hover:brightness-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#74F5A1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F7F0]"
            }`}
            aria-label="Next slide"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={currentIndex >= maxIndex ? 'opacity-50' : ''}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
