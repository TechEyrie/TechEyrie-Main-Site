"use client";

import { useRef,useEffect, useLayoutEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BlogsSection = ({ theme = "light" }) => {
  const titleRef = useRef(null);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false); // ✅ Track if animation has played

  // Blog posts data with images
  const blogPosts = [
    {
      id: 1,
      title: "July 2025 TikTok Trends: 20 Viral Moments You Need to Know",
      tags: ["For Creators", "Trends"],
      date: "06.23.25",
      image: "https://www.datocms-assets.com/151374/1750711920-ne_blog_thumbnails_july_v1.png?auto=format&fit=max&h=600&q=85&w=600",
      alt: "July 2025 TikTok Trends thumbnail"
    },
    {
      id: 2,
      title: "Viral Product Drop Strategy: FOMO, Limited Editions & TikTok",
      tags: ["POV"],
      date: "07.03.25",
      image: "https://www.datocms-assets.com/151374/1751487740-ne_blog_thumbnail_product-drop_v1-0-1.png?auto=format&fit=max&h=600&q=85&w=600",
      alt: "Viral Product Drop Strategy thumbnail"
    },
    {
      id: 3,
      title: "TikTok Trends for DTC Brands in 2025: What's Driving Growth",
      tags: ["Trends", "Content & Creative"],
      date: "06.25.25",
      image: "https://www.datocms-assets.com/151374/1750711920-ne_blog_thumbnails_july_v1.png?auto=format&fit=max&h=600&q=85&w=600",
      alt: "TikTok Trends for DTC Brands thumbnail"
    }
  ];

  // ✅ Electrical animation function - character-by-character effect
  const triggerElectricalAnimation = useCallback(() => {
    if (hasAnimated) return; // Don't run if already animated

    const titleElement = titleRef.current;
    if (!titleElement) return;

    const originalColor = theme === "dark" ? "#f3f3f3" : "#111111";
    const accentOriginalColor = theme === "dark" ? "#74F5A1" : "#111111";
    const electricColor = theme === "dark" ? "#74F5A1" : "#3BC972";
    const brightElectricColor = theme === "dark" ? "#FFFFFF" : "#FFFFFF";

    // Get the two text parts
    const insightsBy = titleElement.querySelector(".insights-by-text");
    const newEngen = titleElement.querySelector(".new-engen-text");

    if (!insightsBy || !newEngen) return;

    const tl = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
      },
      onComplete: () => {
        setHasAnimated(true); // ✅ Mark as animated after completion
      }
    });

    // Split "Insights by" into characters
    const insightsByText = insightsBy.textContent;
    if (!insightsBy.querySelector(".char")) {
      const chars = insightsByText
        .split("")
        .map(
          (char, i) =>
            `<span class="char" style="color: ${originalColor}; display: inline-block; position: relative;" data-index="${i}">${
              char === " " ? "&nbsp;" : char
            }</span>`
        )
        .join("");
      insightsBy.innerHTML = chars;
    }

    // Split "New Engen" into characters
    const newEngenText = newEngen.textContent;
    if (!newEngen.querySelector(".char")) {
      const chars = newEngenText
        .split("")
        .map(
          (char, i) =>
            `<span class="char" style="color: ${accentOriginalColor}; display: inline-block; position: relative;" data-index="${i}">${
              char === " " ? "&nbsp;" : char
            }</span>`
        )
        .join("");
      newEngen.innerHTML = chars;
    }

    const insightsByChars = insightsBy.querySelectorAll(".char");
    const newEngenChars = newEngen.querySelectorAll(".char");

    // Animate "Insights by" characters
    insightsByChars.forEach((char, charIndex) => {
      const baseDelay = charIndex * 0.04;
      const randomDelay = Math.random() * 0.08;
      const totalDelay = baseDelay + randomDelay;

      tl.to(
        char,
        {
          duration: 0.1,
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
            duration: 0.15,
            color: electricColor,
            scale: 1.02,
            delay: totalDelay + 0.1,
            ease: "sine.inOut",
          },
          0
        )
        .to(
          char,
          {
            duration: 0.25,
            color: originalColor,
            scale: 1,
            delay: totalDelay + 0.25,
            ease: "power2.in",
          },
          0
        );
    });

    // Animate "New Engen" characters with slight offset
    newEngenChars.forEach((char, charIndex) => {
      const baseDelay = (insightsByChars.length * 0.04) + (charIndex * 0.04);
      const randomDelay = Math.random() * 0.08;
      const totalDelay = baseDelay + randomDelay;

      tl.to(
        char,
        {
          duration: 0.1,
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
            duration: 0.15,
            color: electricColor,
            scale: 1.02,
            delay: totalDelay + 0.1,
            ease: "sine.inOut",
          },
          0
        )
        .to(
          char,
          {
            duration: 0.25,
            color: accentOriginalColor,
            scale: 1,
            delay: totalDelay + 0.25,
            ease: "power2.in",
          },
          0
        );
    });
  }, [theme, hasAnimated]);

  // ✅ Update colors on theme change (if already animated)
  useEffect(() => {
    if (!hasAnimated) return;

    const titleElement = titleRef.current;
    if (!titleElement) return;

    const originalColor = theme === "dark" ? "#f3f3f3" : "#111111"; // Main text
    const accentOriginalColor = theme === "dark" ? "#74F5A1" : "#111111"; // Accent text

    const insightsByChars = titleElement.querySelectorAll(".insights-by-text .char");
    const newEngenChars = titleElement.querySelectorAll(".new-engen-text .char");

    // Force update character colors
    insightsByChars.forEach(char => {
      char.style.color = originalColor;
    });

    newEngenChars.forEach(char => {
      char.style.color = accentOriginalColor;
    });

  }, [theme, hasAnimated]);

  // ✅ IntersectionObserver for title - triggers electrical animation once
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || hasAnimated) return;

    const titleEl = titleRef.current;
    if (!titleEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          // Trigger electrical animation after a short delay
          setTimeout(() => {
            triggerElectricalAnimation();
          }, 300);

          observer.unobserve(titleEl); // ✅ Stop observing after first trigger
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of title is visible
        rootMargin: '0px 0px -100px 0px',
      }
    );

    observer.observe(titleEl);
    return () => observer.disconnect();
  }, [triggerElectricalAnimation, hasAnimated]);

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

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden transition-colors duration-500"
      style={bgStyle}
    >
      {theme === "dark" && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={noiseOverlayStyle}
        />
      )}

      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8">

        {/* Header Section */}
        <div className="w-full mx-auto mb-10 sm:mb-14 md:mb-16 lg:mb-20 xl:mb-24">

          {/* Main Title */}
          <div ref={titleRef} className="mb-6 sm:mb-8 md:mb-10 text-center">
            <h2
              className={`font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] 3xl:text-[80px] leading-[1.08] tracking-[0.01em] transition-colors duration-500 ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
              }`}
            >
              <span className="insights-by-text block">Insights by</span>
              <span className={`new-engen-text block ${theme === "dark" ? "text-[#74F5A1]" : "text-[#111111]"}`}>
                New Engen
              </span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-3xl mx-auto text-center">
            <p
              className={`font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-regular leading-relaxed tracking-tight transition-colors duration-500 ${
                theme === "dark" ? "text-[#a0a0a0]" : "text-[#444444]"
              }`}
            >
              Insights that drive impact—rooted in research, supported by data, and made to fuel brand growth.
            </p>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12 mb-10 sm:mb-12 md:mb-14 lg:mb-16">
          {blogPosts.map((post, index) => (
            <article 
              key={post.id}
              className="group cursor-pointer"
            >
              {/* Blog Post Image */}
              <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl mb-4 sm:mb-5 md:mb-6 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.alt}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Tags and Date */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                {post.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full border text-[11px] sm:text-[12px] font-medium leading-none transition-colors duration-300 ${
                      theme === "dark"
                        ? "border-[#74F5A1] text-[#74F5A1]"
                        : "border-[#111111] text-[#111111]"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                <span
                  className={`text-[11px] sm:text-[12px] font-normal leading-snug ml-auto transition-colors duration-500 ${
                    theme === "dark" ? "text-[#f3f3f3]/70" : "text-[#111111]/70"
                  }`}
                >
                  {post.date}
                </span>
              </div>

              {/* Title with Background Animation */}
              <h3
                className={`font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-light leading-snug transition-colors duration-500 ${
                  theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                }`}
              >
                <span
                  className="relative inline-block px-1 bg-transparent group-hover:bg-[#74F5A1] transition-all duration-500 ease-out"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${
                      theme === "dark" ? "#74F5A1" : "#E8FF6B"
                    } 50%, transparent 50%)`,
                    backgroundSize: '210% 100%',
                    backgroundPosition: '100% 0',
                    backgroundRepeat: 'no-repeat'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundPosition = '0% 0';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundPosition = '100% 0';
                  }}
                >
                  {post.title}
                </span>
              </h3>
            </article>
          ))}
        </div>

        {/* View All Button - same style as RealProblemSection */}
        <div className="flex justify-center">
          <Link
            href="/blog"
            className="group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px]"
            style={{ backgroundColor: '#12685b' }}
          >
            <span className="font-merriweather text-[13px] sm:text-[14px] md:text-[15px] font-semibold tracking-wide text-white">
              View all
            </span>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 10H16M16 10L12 6M16 10L12 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;