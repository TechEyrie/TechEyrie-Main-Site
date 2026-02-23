"use client";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function BlogSection({ theme = 'light', blogPosts = [] }) {
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState('All');
  const titleRef = useRef(null);
  
  // Ensure blogPosts is an array
  const safeBlogPosts = Array.isArray(blogPosts) ? blogPosts : [];
  
  // Extract unique categories from posts
  const allCategories = ['All', ...new Set(safeBlogPosts.map(post => post?.category).filter(Boolean))];
  const categories = allCategories.length > 1 ? allCategories : ['All', 'Demand Generation', 'Other'];
  
  // Filter posts by category
  const filteredPosts = activeCategory === 'All' 
    ? safeBlogPosts 
    : safeBlogPosts.filter(post => post?.category === activeCategory);

  useEffect(() => {
    // Refresh ScrollTrigger on mount
    ScrollTrigger.refresh();
    
    if (titleRef.current) {
      // Set initial opacity to ensure visibility
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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* Blog Hero Section */}
      <section 
        className={`relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#F5F5F5]'}`}
      >
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <span className={`inline-flex items-center gap-2 font-merriweather text-[13px] font-semibold ${isDark ? 'text-white/80' : 'text-[#111111]'}`}>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#74F5A1] rounded-sm"></span>
              Blog
            </span>
          </div>
          
          <h1 
            ref={titleRef}
            className={`font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] leading-[0.95] tracking-tight text-center ${isDark ? 'text-white' : 'text-[#111111]'}`}
            style={{ opacity: 1 }}
          >
            On our <span className="italic font-playfair font-light">minds</span>
          </h1>
          
          <div className="mt-8 sm:mt-10 md:mt-12 mb-4 sm:mb-6 text-center">
            <span 
              className={`font-merriweather text-[14px] ${isDark ? 'text-white/70' : 'text-[#666666]'}`}
            >
              Choose a category:
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`font-merriweather text-[13px] font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#74F5A1] text-[#0a0a0a] shadow-lg shadow-[#74F5A1]/20'
                    : isDark
                    ? 'bg-white/10 text-white/80 hover:bg-white/15'
                    : 'bg-white text-[#666666] hover:bg-[#111111] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section
        className={`relative py-12 sm:py-16 md:py-20 lg:py-24 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#F5F5F5]'}`}
      >
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8 lg:px-12">
          
          {/* No Posts Message */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16 sm:py-20 md:py-24">
              <p className={`font-merriweather text-[14px] ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                No blog posts found in this category.
              </p>
            </div>
          )}
          
          {/* First Row - 2 Cards */}
          {filteredPosts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8 md:mb-10">
              
              {/* LEFT CARD - Takes 3 columns (First post) */}
              {filteredPosts[0] && (
                <Link href={`/blog/${filteredPosts[0].slug}`} className="group block lg:col-span-3">
                  <article className="relative rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 h-full">
                    
                    {/* Flex Container - 2 Columns */}
                    <div className="flex flex-col md:flex-row h-full min-h-[400px] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[600px]">
                      
                      {/* LEFT COLUMN - Image */}
                      <div className="relative w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-full overflow-hidden">
                        {filteredPosts[0].image ? (
                          <Image
                            src={filteredPosts[0].image}
                            alt={filteredPosts[0].title || 'Blog post'}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* RIGHT COLUMN - Content */}
                      <div className="relative w-full md:w-1/2 bg-[#2a2a2a] p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-between gap-4 sm:gap-6">
                        
                        {/* Top - Category Badge */}
                        <div>
                          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-merriweather text-[13px] font-semibold uppercase tracking-wider bg-[#74F5A1] text-[#0a0a0a]">
                            {filteredPosts[0].category || 'Blog'}
                          </span>
                        </div>

                        {/* Middle - Title */}
                        <h2 className="font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] leading-[1.1] text-white transition-colors duration-300 group-hover:text-[#74F5A1]">
                          {filteredPosts[0].title}
                        </h2>

                        {/* Bottom - Author Info */}
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#74F5A1]/20 flex items-center justify-center">
                            <span className="font-merriweather text-[14px] font-semibold text-[#74F5A1]">
                              {filteredPosts[0].author?.charAt(0) || 'A'}
                            </span>
                          </div>
                          
                          <div className="flex flex-col gap-0.5 sm:gap-1">
                            <span className="font-merriweather text-[14px] text-white">
                              {filteredPosts[0].author || 'Author'}
                            </span>
                            <span className="font-merriweather text-[14px] text-white/60">
                              {filteredPosts[0].readTime || '5 min read'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* RIGHT CARD - Image background with white content overlay (Second post) */}
              {filteredPosts[1] && (
                <Link href={`/blog/${filteredPosts[1].slug}`} className="group block lg:col-span-1">
                  <article className="relative rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10 h-full min-h-[450px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[700px]">
                    
                    {/* Background Image - Full Card */}
                    {filteredPosts[1].image ? (
                      <Image
                        src={filteredPosts[1].image}
                        alt={filteredPosts[1].title || 'Blog post'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 1024px) 100vw, 25vw"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=800&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* White Content Box Overlay */}
                    <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
                      <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 min-h-[280px] sm:min-h-[300px] md:min-h-[320px] flex flex-col justify-between gap-4">
                        
                        {/* Category */}
                        <div>
                          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-merriweather text-[13px] font-semibold uppercase tracking-wider bg-[#74F5A1] text-[#0a0a0a]">
                            {filteredPosts[1].category || 'Blog'}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-italiana font-light text-[18px] sm:text-[22px] md:text-[26px] lg:text-[32px] leading-[1.2] text-[#111111] transition-colors duration-300 group-hover:text-[#111111]/80">
                          {filteredPosts[1].title}
                        </h2>

                        {/* Meta Info */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#74F5A1]/20 flex items-center justify-center">
                            <span className="font-merriweather text-[14px] font-semibold text-[#74F5A1]">
                              {filteredPosts[1].author?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-merriweather text-[14px] text-[#111111]">
                              {filteredPosts[1].author || 'Author'}
                            </span>
                            <span className="font-merriweather text-[14px] text-[#666666]">
                              {filteredPosts[1].readTime || '5 min read'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

            </div>
          )}

          {/* Second Row - 4 Cards */}
          {filteredPosts.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8 md:mb-10">
              {filteredPosts.slice(2, 6).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="relative rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10 h-full min-h-[450px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[650px] xl:min-h-[700px]">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title || 'Blog post'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=800&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
                      <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 min-h-[280px] sm:min-h-[300px] md:min-h-[320px] flex flex-col justify-between gap-4">
                        <div>
                          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-merriweather text-[13px] font-semibold uppercase tracking-wider bg-[#74F5A1] text-[#0a0a0a]">
                            {post.category || 'Blog'}
                          </span>
                        </div>
                        <h2 className="font-italiana font-light text-[18px] sm:text-[22px] md:text-[26px] lg:text-[32px] leading-[1.2] text-[#111111] transition-colors duration-300 group-hover:text-[#111111]/80">
                          {post.title}
                        </h2>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#74F5A1]/20 flex items-center justify-center">
                            <span className="font-merriweather text-[14px] font-semibold text-[#74F5A1]">
                              {post.author?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-merriweather text-[14px] text-[#111111]">
                              {post.author || 'Author'}
                            </span>
                            <span className="font-merriweather text-[14px] text-[#666666]">
                              {post.readTime || '5 min read'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* Third Row - 4 Cards */}
          {filteredPosts.length > 6 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredPosts.slice(6, 10).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="relative rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10 h-full min-h-[450px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[650px] xl:min-h-[700px]">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title || 'Blog post'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
                      <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 min-h-[280px] sm:min-h-[300px] md:min-h-[320px] flex flex-col justify-between gap-4">
                        <div>
                          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-merriweather text-[13px] font-semibold uppercase tracking-wider bg-[#74F5A1] text-[#0a0a0a]">
                            {post.category || 'Blog'}
                          </span>
                        </div>
                        <h2 className="font-italiana font-light text-[18px] sm:text-[22px] md:text-[26px] lg:text-[32px] leading-[1.2] text-[#111111] transition-colors duration-300 group-hover:text-[#111111]/80">
                          {post.title}
                        </h2>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#74F5A1]/20 flex items-center justify-center">
                            <span className="font-merriweather text-[14px] font-semibold text-[#74F5A1]">
                              {post.author?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-merriweather text-[14px] text-[#111111]">
                              {post.author || 'Author'}
                            </span>
                            <span className="font-merriweather text-[14px] text-[#666666]">
                              {post.readTime || '5 min read'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}
