"use client";

import { useRef, useLayoutEffect } from 'react';
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

  useLayoutEffect(() => {
    const title = titleRef.current;
    const section = sectionRef.current;

    if (!title || !section) return;

    const ctx = gsap.context(() => {
      // Electrical glitch animation on title
      const glitchTl = gsap.timeline({
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          end: "top 50%",
          once: true,
        },
      });

      glitchTl
        .fromTo(
          title,
          {
            opacity: 0,
            x: -10,
            filter: "blur(5px)",
          },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.1,
            ease: "power2.inOut",
          }
        )
        .to(title, {
          x: 5,
          duration: 0.05,
          ease: "power1.inOut",
        })
        .to(title, {
          x: -5,
          duration: 0.05,
          ease: "power1.inOut",
        })
        .to(title, {
          x: 3,
          duration: 0.05,
          ease: "power1.inOut",
        })
        .to(title, {
          x: 0,
          duration: 0.1,
          ease: "power2.out",
        })
        .to(
          title,
          {
            textShadow: `
              0 0 10px ${theme === "dark" ? "rgba(232, 255, 107, 0.8)" : "rgba(17, 17, 17, 0.5)"},
              0 0 20px ${theme === "dark" ? "rgba(232, 255, 107, 0.6)" : "rgba(17, 17, 17, 0.3)"},
              0 0 30px ${theme === "dark" ? "rgba(232, 255, 107, 0.4)" : "rgba(17, 17, 17, 0.2)"}
            `,
            duration: 0.15,
          },
          "-=0.1"
        )
        .to(title, {
          textShadow: "0 0 0px transparent",
          duration: 0.3,
          ease: "power2.out",
        });
    }, section);

    return () => ctx.revert();
  }, [theme]);

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
      className="relative w-full py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden transition-colors duration-500"
      style={bgStyle}
    >
      {theme === "dark" && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={noiseOverlayStyle}
        />
      )}

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header Section */}
        <div className="w-full max-w-[1386px] mx-auto mb-12 sm:mb-16 lg:mb-20">
          
          {/* Main Title */}
          <div ref={titleRef} className="mb-8 sm:mb-12 lg:mb-16 text-center">
            <h2
              className={`font-italiana font-light text-[40px] sm:text-[56px] md:text-[70px] lg:text-[90px] xl:text-[110px] 2xl:text-[130px] leading-[0.9] tracking-tight transition-colors duration-500 ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
              }`}
            >
              Insights by
              <br />
              <span className={theme === "dark" ? "text-[#E8FF6B]" : "text-[#111111]"}>
                New Engen
              </span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-4xl mx-auto text-center">
            <p
              className={`font-merriweather text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed transition-colors duration-500 ${
                theme === "dark" ? "text-[#f3f3f3]/90" : "text-[#111111]/80"
              }`}
            >
              Insights that drive impact—rooted in research, supported by data, and made to fuel brand growth.
            </p>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 mb-12 sm:mb-16 lg:mb-20">
          {blogPosts.map((post, index) => (
            <article 
              key={post.id}
              className="group cursor-pointer"
            >
              {/* Blog Post Image */}
              <div className="w-full aspect-[4/3] bg-gray-200 rounded-2xl mb-6 sm:mb-8 overflow-hidden">
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
              <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6">
                {post.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`inline-flex items-center px-4 py-2 rounded-full border text-sm font-medium leading-none transition-colors duration-300 ${
                      theme === "dark"
                        ? "border-[#E8FF6B] text-[#E8FF6B]"
                        : "border-[#111111] text-[#111111]"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                <span
                  className={`text-base font-normal leading-snug ml-auto transition-colors duration-500 ${
                    theme === "dark" ? "text-[#f3f3f3]/70" : "text-[#111111]/70"
                  }`}
                >
                  {post.date}
                </span>
              </div>

              {/* Title with Background Animation */}
              <h3
                className={`font-italiana font-light text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight transition-colors duration-500 ${
                  theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                }`}
              >
                <span
                  className="relative inline-block px-2 bg-transparent group-hover:bg-[#E8FF6B] transition-all duration-500 ease-out"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${
                      theme === "dark" ? "#CCE561" : "#E8FF6B"
                    } 50%, transparent 50%)`,
                    backgroundSize: '200% 100%',
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

        {/* View All Button */}
        <div className="flex justify-center">
          <Link 
            href="/blog"
            className={`group relative px-8 py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-lg ${
              theme === "dark"
                ? "bg-[#f3f3f3] text-[#111111]"
                : "bg-[#111111] text-[#f3f3f3]"
            }`}
          >
            {/* Hover Background */}
            <div
              className={`absolute inset-0 rounded-full transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ${
                theme === "dark" ? "bg-[#E8FF6B]" : "bg-[#CCE561]"
              }`}
            />
            
            {/* Button Content */}
            <div className="relative flex items-center justify-center gap-2">
              <span className="text-base sm:text-lg font-semibold">
                View all
              </span>
              
              {/* Arrow Icon */}
              <svg 
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
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
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
