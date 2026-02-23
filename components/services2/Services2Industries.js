"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const industries = [
  {
    id: 1,
    title: "FMCG",
    image: "https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=800&q=80",
    link: "/expertise/fmcg",
    slug: "fmcg"
  },
  {
    id: 2,
    title: "Transport & Logistics",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    link: "/expertise/logistics",
    slug: "logistics"
  },
  {
    id: 3,
    title: "NGOs and Non-Profit Organisations",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
    link: "/expertise/ngo",
    slug: "ngo"
  },
  {
    id: 4,
    title: "Technology & Startups",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    link: "/expertise/technology",
    slug: "technology"
  },
  {
    id: 5,
    title: "Healthcare & Life Sciences",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
    link: "/expertise/healthcare",
    slug: "healthcare"
  },
  {
    id: 6,
    title: "Financial Services",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    link: "/expertise/finance",
    slug: "finance"
  },
  {
    id: 7,
    title: "Retail & E-commerce",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    link: "/expertise/retail",
    slug: "retail"
  },
  {
    id: 8,
    title: "Education & EdTech",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    link: "/expertise/education",
    slug: "education"
  },
  {
    id: 9,
    title: "Manufacturing & Industrial",
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80",
    link: "/expertise/manufacturing",
    slug: "manufacturing"
  },
  {
    id: 10,
    title: "Hospitality & Tourism",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    link: "/expertise/hospitality",
    slug: "hospitality"
  },
  {
    id: 11,
    title: "Public Sector & Government",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    link: "/expertise/public",
    slug: "public"
  },
  {
    id: 12,
    title: "Media & Entertainment",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    link: "/expertise/media",
    slug: "media"
  }
];

export default function IndustriesGrid({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial positions for all cards to ensure alignment
      gsap.set(cardsRef.current, {
        opacity: 0,
        y: 60,
      });

      // Stagger animation for cards on scroll
      gsap.to(cardsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none none',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleBookmark = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle bookmark logic here
    console.log(`Bookmarked industry: ${id}`);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-16 md:py-20 lg:py-24 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20"
      style={{ 
        background: isDark 
          ? 'linear-gradient(to bottom, #1a1a1a 0%, #0a0a0a 100%)'
          : 'linear-gradient(to bottom, #e8ddd3 0%, #d4c4b8 100%)'
      }}
    >
      <div className="max-w-[1800px] mx-auto">
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-start">
          {industries.map((industry, index) => (
            <a
              key={industry.id}
              href={industry.link}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative block aspect-[16/11] overflow-hidden rounded-xl cursor-pointer transition-transform duration-300 hover:scale-[1.02] w-full"
              style={{
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={industry.image}
                  alt={industry.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              </div>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

              {/* Bookmark Icon */}
              <button
                onClick={(e) => handleBookmark(e, industry.id)}
                className="absolute top-5 left-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                aria-label={`Bookmark ${industry.title}`}
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <h3 className="font-italiana text-white text-[24px] sm:text-[26px] md:text-[28px] lg:text-[32px] font-light leading-tight" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                  {industry.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
