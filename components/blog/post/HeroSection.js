"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function BlogPostHero({ theme = 'light', post }) {
  const isDark = theme === 'dark';
  const titleRef = useRef(null);
  const metaRef = useRef(null);
  const imageRef = useRef(null);

  // Default post data (fallback if no post provided)
  const defaultPost = {
    category: "Demand Generation",
    title: "Why Brand Is Your Most Underrated Growth Channel",
    author: "Tycho Luijten",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    readTime: "5 min read",
    date: "August 21, 2025",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop",
    hasVideo: false
  };

  // Use provided post or fallback to default
  const postData = post || defaultPost;

  useEffect(() => {
    // Refresh ScrollTrigger on mount
    ScrollTrigger.refresh();
    
    if (titleRef.current) {
      gsap.set(titleRef.current, { opacity: 1 });
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(titleRef.current, { opacity: 1 });
        }
      });
    }
    if (metaRef.current) {
      gsap.set(metaRef.current, { opacity: 1 });
      gsap.from(metaRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
        onComplete: () => {
          gsap.set(metaRef.current, { opacity: 1 });
        }
      });
    }
    if (imageRef.current) {
      gsap.set(imageRef.current, { opacity: 1 });
      gsap.from(imageRef.current, {
        opacity: 0,
        x: 50,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3,
        onComplete: () => {
          gsap.set(imageRef.current, { opacity: 1 });
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Parse title to find italic words (between underscores)
  const renderTitle = (title) => {
    const parts = title.split(/(_[^_]+_)/g);
    return parts.map((part, i) => {
      if (part.startsWith('_') && part.endsWith('_')) {
        return <span key={i} className="italic">{part.slice(1, -1)}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <section 
      className={`relative pt-20 sm:pt-24 md:pt-16 lg:pt-20 pb-12 sm:pb-16 md:pb-20 lg:pb-24 overflow-x-hidden ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#F5F5F5]'}`}
    >
      <div className="mx-auto max-w-[1800px] px-4 md:px-6 lg:px-8 xl:px-12 w-full">
        
        {/* Back Button */}
        <Link 
          href="/blog"
          className={`inline-flex items-center gap-2 mb-8 sm:mb-10 md:mb-12 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-merriweather text-[14px] transition-all duration-300 ${
            isDark 
              ? 'bg-white/10 text-white hover:bg-white/15' 
              : 'bg-white text-[#111111] hover:bg-[#f0f0f0]'
          }`}
        >
          <svg 
            className="w-4 h-4 sm:w-5 sm:h-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          All blogs
        </Link>

        {/* Grid Layout - 50/50 on mobile/tablet, 45/55 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[45%_55%] gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* LEFT SIDE - Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left w-full">
            {/* Category Badge */}
            <div className="mb-6 sm:mb-8 flex justify-center lg:justify-start">
              <span className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-merriweather text-[13px] font-semibold uppercase tracking-wider bg-[#74F5A1] text-[#0a0a0a]">
                {postData.category || 'Blog'}
              </span>
            </div>

            {/* Title */}
            <h1 
              ref={titleRef}
              className={`font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] leading-[1.1] tracking-tight mb-6 sm:mb-8 md:mb-10 ${
                isDark ? 'text-white' : 'text-[#111111]'
              }`}
              style={{ opacity: 1 }}
            >
              {renderTitle(postData.title || 'Blog Post')}
            </h1>

            {/* Meta Information */}
            <div 
              ref={metaRef}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-5"
              style={{ opacity: 1 }}
            >
              {/* Author Avatar & Name */}
              <div className="flex items-center gap-3 sm:gap-4">
                {postData.authorAvatar && postData.authorAvatar.trim() !== "" ? (
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={postData.authorAvatar}
                      alt={postData.author || 'Author'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, (max-width: 1024px) 56px, 64px"
                    />
                  </div>
                ) : (
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center font-merriweather text-[14px] font-semibold ${
                    isDark 
                      ? 'bg-[#74F5A1]/20 text-[#74F5A1]' 
                      : 'bg-[#111111] text-white'
                  }`}>
                    {postData.author?.charAt(0) || 'A'}
                  </div>
                )}
                <p className={`font-merriweather text-[14px] ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                  {postData.author || 'Author'}
                </p>
              </div>
              
              {/* Read Time */}
              <div className="flex items-center gap-2">
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-white/60' : 'text-[#666666]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className={`font-merriweather text-[14px] ${isDark ? 'text-white/60' : 'text-[#666666]'}`}>
                  {postData.readTime || '5 min read'}
                </p>
              </div>

              {/* Date */}
              {postData.date && (
                <div className="flex items-center gap-2">
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-white/60' : 'text-[#666666]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className={`font-merriweather text-[14px] ${isDark ? 'text-white/60' : 'text-[#666666]'}`}>
                    {postData.date}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - Featured Image */}
          {postData.image && postData.image.trim() !== "" ? (
            <div 
              ref={imageRef}
              className="relative w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[650px] 2xl:h-[750px] rounded-2xl sm:rounded-3xl overflow-hidden group order-1 lg:order-2"
              style={{ opacity: 1 }}
            >
              <Image
                src={postData.image}
                alt={postData.title || 'Blog post image'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 55vw"
              />
              
              {/* Play Button Overlay (if video) */}
              {postData.hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-[#74F5A1] rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#5FE08D] shadow-lg">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#0a0a0a] ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={`relative w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[650px] 2xl:h-[750px] rounded-2xl sm:rounded-3xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'} flex items-center justify-center order-1 lg:order-2`}>
              <svg className={`w-16 h-16 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
