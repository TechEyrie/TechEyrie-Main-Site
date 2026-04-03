"use client";

import { caseStudySectionShell, caseStudySectionSurface } from "../caseStudySectionProps";
import { useState, useRef } from "react";
import Image from "next/image";

export default function BeforeAfterComparison({ theme = "light" }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const isDark = theme === "dark";

  const handleMouseMove = (e) => {
    updateSliderPosition(e.clientX);
  };

  const handleTouchMove = (e) => {
    updateSliderPosition(e.touches[0].clientX);
  };

  const updateSliderPosition = (clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // Clamp between 0 and 100
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
    setSliderPosition(clampedPercentage);
  };

  const handleMouseLeave = () => {
    setSliderPosition(50);
  };

  // Sample images - replace with actual props
  const beforeImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80";
  const afterImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80";

  return (
    <section className={caseStudySectionShell(isDark)} style={caseStudySectionSurface(isDark)}>
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24 lg:py-28">
        {/* Before/After Comparison Container */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl cursor-ew-resize select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
        >
          {/* After Image (Background - Full Width) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={afterImage}
              alt="After"
              fill
              className="object-cover"
              sizes="100vw"
              priority
              unoptimized
            />
          </div>

          {/* Before Image (Foreground - Clipped by slider position) */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            }}
          >
            <Image
              src={beforeImage}
              alt="Before"
              fill
              className="object-cover"
              sizes="100vw"
              priority
              unoptimized
            />
          </div>

          {/* Slider Line and Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Slider Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-ew-resize">
              {/* Left Arrow */}
              <svg
                className="absolute left-2"
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
              >
                <path
                  d="M6 10L2 6L6 2"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Right Arrow */}
              <svg
                className="absolute right-2"
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
              >
                <path
                  d="M2 2L6 6L2 10"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
