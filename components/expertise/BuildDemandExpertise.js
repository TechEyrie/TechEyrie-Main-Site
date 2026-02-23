'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SERVICES = [
  {
    id: 'thought-leadership',
    title: 'Thought leadership',
    description:
      'Position your executives as industry experts through strategic content, speaking opportunities, media placements.',
  },
  {
    id: 'linkedin-advertising',
    title: 'LinkedIn Advertising',
    description:
      'Reach decision-makers with targeted LinkedIn campaigns that drive qualified leads and meaningful engagement.',
  },
  {
    id: 'content-marketing',
    title: 'Content Marketing',
    description:
      'Create compelling content that educates, engages, and converts your target audience at every stage.',
  },
  {
    id: 'social-media',
    title: 'Social Media Advertising',
    description:
      'Amplify your brand reach with strategic paid social campaigns across multiple platforms.',
  },
  {
    id: 'video-content',
    title: 'Video content',
    description:
      'Produce engaging video content that captures attention and communicates your value proposition effectively.',
  },
];

export default function BuildDemandSection({ theme = 'light' }) {
  const [activeId, setActiveId] = useState(null);
  const isDark = theme === 'dark';

  return (
    <>
      <style jsx global>{`
        .demand-grid {
          transition: grid-template-columns 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 639px) {
          .demand-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .demand-card {
          transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .demand-description {
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <section className={`relative overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#EFEFEF]'} py-20 sm:py-28 md:py-36 lg:py-44`}>
        {/* Decorative Squares */}
        <div className="pointer-events-none absolute left-0 top-40 h-16 w-12 bg-[#74F5A1] opacity-70" />
        <div className="pointer-events-none absolute left-16 top-48 h-12 w-12 bg-[#5FE08D] opacity-60" />

        <div className="relative z-10 mx-auto max-w-[1800px] px-4 md:px-6 lg:px-10">
          {/* Top Row: Badge (left) + Title (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-6 lg:gap-8 mb-8">
            {/* Left: Badge */}
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-5 w-5 rounded-sm bg-[#74F5A1]" />
                <span className={`font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase ${isDark ? 'text-white' : 'text-[#212121]'}`}>
                  Build demand
                </span>
              </div>
            </div>

            {/* Right: Title */}
            <div>
              <h2 className={`font-italiana font-light leading-[1.05] tracking-[-0.03em] ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                <span className="block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px]">
                  We help you build
                </span>
                <span className="block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem]">
                  <span className="font-playfair italic font-light">demand</span> for your SaaS
                </span>
              </h2>
            </div>
          </div>

          {/* Bottom Row: Image (left) + Cards (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-6 lg:gap-8 lg:items-start">
            {/* Left: Portrait Image - matches card height */}
            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[650px]">
              <div className="relative h-full overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=900&fit=crop&q=80"
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  priority
                />
              </div>
            </div>

            {/* Right: Service Cards - 5 cards totaling same height as image */}
            <div className="flex flex-col gap-3 sm:gap-4 h-auto sm:h-[500px] lg:h-[650px]">
              {/* Top Row - 3 Cards */}
              <div
                className="demand-grid grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3 flex-1"
                style={{
                  gridTemplateColumns:
                    activeId === 'thought-leadership'
                      ? '1.25fr 1fr 1fr'
                      : activeId === 'linkedin-advertising'
                      ? '1fr 1.25fr 1fr'
                      : activeId === 'content-marketing'
                      ? '1fr 1fr 1.25fr'
                      : '1fr 1fr 1fr',
                }}
              >
                {SERVICES.slice(0, 3).map((item) => {
                  const isActive = activeId === item.id;

                  return (
                    <article
                      key={item.id}
                      onMouseEnter={() => setActiveId(item.id)}
                      onMouseLeave={() => setActiveId(null)}
                      className={`demand-card group relative flex h-full min-h-[180px] sm:min-h-0 flex-col justify-between rounded-lg border ${isDark ? 'border-white/10 bg-[#2a2a2a] hover:bg-[#333333]' : 'border-black/6 bg-white hover:bg-[#FAFAFA]'} p-6 sm:p-8 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]`}
                    >
                      {/* Title */}
                      <h3 className={`font-italiana font-light text-[24px] sm:text-[28px] md:text-[32px] tracking-tight ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                        {item.title}
                      </h3>

                      {/* Bottom: Description + Button */}
                      <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4">
                        {/* Description - fades in on hover */}
                        <p
                          className={`demand-description w-full sm:max-w-[280px] font-merriweather text-[14px] leading-snug ${isDark ? 'text-gray-300' : 'text-[#555555]'} ${
                            isActive
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-4 opacity-0'
                          }`}
                        >
                          {item.description}
                        </p>

                        {/* Plus Button */}
                        <Link
                          href={`/services/${item.id}`}
                          className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-[#74F5A1] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#5FE08D] group-hover:-translate-y-1"
                        >
                          {/* Default Plus Icon */}
                          <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:rotate-90 group-hover:opacity-0">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10 4V16M4 10H16"
                                stroke={isDark ? "#1a1a1a" : "#111111"}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>

                          {/* Hover Plus Icon */}
                          <span className="absolute inset-0 flex items-center justify-center translate-y-[20px] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10 4V16M4 10H16"
                                stroke={isDark ? "#1a1a1a" : "#111111"}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Bottom Row - 2 Cards */}
              <div
                className="demand-grid grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3 flex-1"
                style={{
                  gridTemplateColumns:
                    activeId === 'social-media'
                      ? '1.25fr 1fr'
                      : activeId === 'video-content'
                      ? '1fr 1.25fr'
                      : '1fr 1fr',
                }}
              >
                {SERVICES.slice(3, 5).map((item) => {
                  const isActive = activeId === item.id;

                  return (
                    <article
                      key={item.id}
                      onMouseEnter={() => setActiveId(item.id)}
                      onMouseLeave={() => setActiveId(null)}
                      className={`demand-card group relative flex h-full min-h-[180px] sm:min-h-0 flex-col justify-between rounded-lg border ${isDark ? 'border-white/10 bg-[#2a2a2a] hover:bg-[#333333]' : 'border-black/6 bg-white hover:bg-[#FAFAFA]'} p-6 sm:p-8 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]`}
                    >
                      {/* Title */}
                      <h3 className={`font-italiana font-light text-[24px] sm:text-[28px] md:text-[32px] tracking-tight ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                        {item.title}
                      </h3>

                      {/* Bottom: Description + Button */}
                      <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4">
                        {/* Description - fades in on hover */}
                        <p
                          className={`demand-description w-full sm:max-w-[280px] font-merriweather text-[14px] leading-snug ${isDark ? 'text-gray-300' : 'text-[#555555]'} ${
                            isActive
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-4 opacity-0'
                          }`}
                        >
                          {item.description}
                        </p>

                        {/* Plus Button */}
                        <Link
                          href={`/services/${item.id}`}
                          className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-[#74F5A1] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#5FE08D] group-hover:-translate-y-1"
                        >
                          {/* Default Plus Icon */}
                          <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:rotate-90 group-hover:opacity-0">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10 4V16M4 10H16"
                                stroke={isDark ? "#1a1a1a" : "#111111"}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>

                          {/* Hover Plus Icon */}
                          <span className="absolute inset-0 flex items-center justify-center translate-y-[20px] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10 4V16M4 10H16"
                                stroke={isDark ? "#1a1a1a" : "#111111"}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
