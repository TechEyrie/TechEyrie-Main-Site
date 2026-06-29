// components/BuildOthersSection.jsx
"use client";

import { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BuildOthersSection({ theme = "light" }) {
  const sectionRef = useRef(null);

  const lightColors = {
    background: "#F9F7F0",
  };

  const bgStyle =
    theme === "dark"
      ? {
          backgroundColor: "#2b2b2b",
          backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
          radial-gradient(ellipse at top left, rgba(60, 60, 60, 0.3), transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(50, 50, 50, 0.2), transparent 50%)
        `,
          backgroundBlendMode: "overlay, normal, normal",
        }
      : { backgroundColor: lightColors.background };

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.015) 2px, rgba(0, 0, 0, 0.015) 4px)
    `,
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set([".build-title-line", ".build-description", ".build-cta"], {
        opacity: 0,
        y: 40,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          end: "top 25%",
          once: true,
        },
      });

      tl.to(".build-title-line", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.15,
      })
        .to(
          ".build-description",
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.6"
        )
        .to(
          ".build-cta",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        );
    }, section);

    return () => ctx.revert();
  }, [theme]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 sm:py-24 md:py-32 lg:py-40 xl:py-48 transition-colors duration-500"
      style={bgStyle}
    >
      {theme === "dark" && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={noiseOverlayStyle}
        />
      )}

      <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8">
        {/* Title - Full Width */}
        <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <h2 className="leading-[1.05] tracking-tight">
            {/* "TE Build What" - Merriweather light */}
            <div
              className={`build-title-line font-italiana font-light text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] xl:text-[84px] 2xl:text-[96px] transition-colors duration-500 ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
              }`}
            >
              TE Build What
            </div>

            {/* "Others Can't" - Playfair italic semibold */}
            <div
              className={`build-title-line font-playfair italic font-semibold text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] xl:text-[84px] 2xl:text-[96px] transition-colors duration-500 ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
              }`}
            >
              Others Can't
            </div>

            {/* "See Yet" - Playfair italic semibold */}
            <div
              className={`build-title-line font-playfair italic font-semibold text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] xl:text-[84px] 2xl:text-[96px] transition-colors duration-500 ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
              }`}
            >
              See Yet
            </div>
          </h2>
        </div>

        {/* Description - Right Aligned Below Title (pushed inward) */}
        <div className="grid lg:grid-cols-[45%_55%]">
          <div></div>
          <div className="space-y-6">
            <p
              className={`build-description font-merriweather font-light text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] xl:text-[19px] leading-relaxed transition-colors duration-500 ${
                theme === "dark" ? "text-[#d0d0d0]" : "text-[#212121]"
              }`}
            >
              We're a technology studio focused on turning complexity into clarity. From AI-driven automation to high-performance digital platforms, we design systems that help businesses move faster, think smarter, and scale with confidence.
            </p>

            <p
              className={`build-description font-merriweather font-light text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] xl:text-[19px] leading-relaxed transition-colors duration-500 ${
                theme === "dark" ? "text-[#d0d0d0]" : "text-[#212121]"
              }`}
            >
              We don't chase trends — we engineer foundations built to last.
            </p>

            <div className="build-cta pt-2">
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-white bg-[#2D6A5A] hover:bg-[#245548] rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
