"use client";

import { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MAX_BLOGS = 3;

// Fallback posts that match the demo blog detail slugs,
// so clicking from the dark page always opens a working article.
const FALLBACK_POSTS = [
  {
    id: 1,
    title: "What Is Demand Generation? A Simple Guide for B2B Marketers",
    tags: ["Demand Generation"],
    date: "August 15, 2025",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    alt: "What Is Demand Generation? A Simple Guide for B2B Marketers",
    slug: "what-is-demand-generation",
  },
  {
    id: 2,
    title: "Why Brand Is Your Most Underrated Growth Channel",
    tags: ["Demand Generation"],
    date: "August 21, 2025",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    alt: "Why Brand Is Your Most Underrated Growth Channel",
    slug: "why-brand-is-underrated-growth-channel",
  },
  {
    id: 3,
    title: "What Is Thought Leadership in B2B Marketing?",
    tags: ["Demand Generation"],
    date: "August 10, 2025",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    alt: "What Is Thought Leadership in B2B Marketing?",
    slug: "what-is-thought-leadership-b2b",
  },
];

const BlogsSection = ({ theme = "light", sharedBackground = false }) => {
  const titleRef = useRef(null);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [blogPosts, setBlogPosts] = useState(FALLBACK_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/blog-posts');
        const wpPosts = res.ok ? await res.json() : null;
        if (Array.isArray(wpPosts) && wpPosts.length > 0) {
          const mapped = wpPosts.slice(0, MAX_BLOGS).map((post) => ({
            id: post.id,
            title: post.title || '',
            tags: post.category ? [post.category] : [],
            date: post.date || '',
            image: post.image || '',
            alt: post.title || 'Blog post',
            slug: post.slug || '',
          }));
          setBlogPosts(mapped);
        }
      } catch (e) {
        console.error('Error loading blog posts for dark page:', e);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // ✅ Electrical animation function - character-by-character effect
  const triggerElectricalAnimation = useCallback(() => {
    if (hasAnimated) return; // Don't run if already animated

    const titleElement = titleRef.current;
    if (!titleElement) return;

    const originalColor = theme === "dark" ? "#f3f3f3" : "#111111";
    const accentOriginalColor = theme === "dark" ? "#c8c4bc" : "#111111";
    const electricColor = theme === "dark" ? "#c8c4bc" : "#2a5c48";
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
    const accentOriginalColor = theme === "dark" ? "#c8c4bc" : "#111111"; // Accent text

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
      ? sharedBackground
        ? { background: "transparent" }
        : {
            // Match dark page base color at the very top and bottom so
            // this section blends smoothly into neighbors.
            background:
              "linear-gradient(to bottom, #162d24 0%, #162d24 18%, #1e3d30 45%, #1b4732 70%, #162d24 100%)",
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
      {theme === "dark" && !sharedBackground && (
        <>
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={noiseOverlayStyle}
          />
          {/* Stronger blending buffer at top/bottom */}
          <div
            className="absolute inset-x-0 top-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[2]"
            style={{
              background:
                "linear-gradient(to bottom, #162d24 0%, rgba(22,45,36,0) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[2]"
            style={{
              background:
                "linear-gradient(to top, #162d24 0%, rgba(22,45,36,0) 100%)",
            }}
          />
        </>
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
              <span className="insights-by-text block">Not Built for Everyone</span>
              <span className={`new-engen-text block ${theme === "dark" ? "text-[#c8c4bc]" : "text-[#111111]"}`}>
              Built for the Right Ones

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
            Our insights are built on research, data driven and designed to elevate the strategic growth of your business. 

            </p>
          </div>
        </div>

        {/* Blog Posts Grid - fetched from API (max 3), same styling as blog page */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12 mb-10 sm:mb-12 md:mb-14 lg:mb-16">
          {loading ? (
            <div className="col-span-full font-merriweather text-[12px] sm:text-[13px] md:text-[14px] text-center py-8" style={{ color: theme === 'dark' ? '#a0a0a0' : '#444' }}>
              Loading…
            </div>
          ) : (
          blogPosts.map((post, index) => (
            <Link key={post.id} href={post.slug ? `/blog/${post.slug}` : '/blog'} className="block group">
              <article className="group cursor-pointer">
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
                  {(post.tags || []).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full border text-[11px] sm:text-[12px] font-medium leading-none transition-colors duration-300 ${
                      theme === "dark"
                        ? "border-[#c8c4bc] text-[#c8c4bc]"
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
                  className="relative inline-block px-1 bg-transparent group-hover:bg-[#c8c4bc] transition-all duration-500 ease-out"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${
                      theme === "dark" ? "#c8c4bc" : "#c8c4bc"
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
            </Link>
          )))}
        </div>

        {/* View All Button - same style as RealProblemSection */}
        <div className="flex justify-center">
          <Link
            href="/blog"
            className="group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px]"
            style={{ backgroundColor: '#1e3d30' }}
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