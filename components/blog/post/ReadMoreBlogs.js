"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ReadMoreBlogs({ posts = [], currentSlug = '', theme = 'light' }) {
  const isDark = theme === 'dark';

  // Filter out current post and limit to 4 related posts
  const relatedPosts = posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, 4);

  // Return null if no related posts
  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section
      className={`relative py-12 sm:py-16 md:py-20 lg:py-24 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#F5F5F5]'}`}
    >
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Section Header - Left Aligned */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className={`font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] leading-[1.1] ${
            isDark ? 'text-white' : 'text-[#111111]'
          }`}>
            Read <span className="italic font-playfair font-light">more</span> blogs
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {relatedPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <article className="relative rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10 h-full min-h-[450px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[650px] xl:min-h-[700px]">
                {post.image && post.image.trim() !== "" ? (
                  <Image
                    src={post.image}
                    alt={post.title || 'Blog post'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className={`w-full h-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'} flex items-center justify-center`}>
                    <svg className={`w-16 h-16 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      {post.authorAvatar && post.authorAvatar.trim() !== "" ? (
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={post.authorAvatar}
                            alt={post.author || 'Author'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 40px, 48px"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-merriweather text-[14px] font-semibold bg-[#111111] text-white">
                          {post.author?.charAt(0) || 'A'}
                        </div>
                      )}
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
      </div>
    </section>
  );
}
