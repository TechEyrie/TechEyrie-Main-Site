'use client';

import { useState } from 'react';
import Link from 'next/link';

const EXPERTISE = [
  {
    id: 'seo',
    title: 'SEO',
    description:
      'Improve organic visibility and drive qualified traffic through technical SEO, content optimization, and strategic link building.',
  },
  {
    id: 'sea',
    title: 'SEA',
    description:
      'Launch and scale paid search campaigns that convert, with data-driven optimization and ROI-focused strategies.',
  },
  {
    id: 'cro',
    title: 'CRO',
    description:
      'Convert more visitors into customers through systematic testing, user research, and conversion optimization.',
  },
  {
    id: 'gtm',
    title: 'GTM Engineering & Direct Outreach',
    description:
      'Build scalable go-to-market engines with technical implementation, automation, and strategic outbound campaigns.',
  },
  {
    id: 'g2',
    title: 'G2',
    description:
      'Leverage G2 as a growth channel through review generation, profile optimization, and buyer intent data.',
  },
  {
    id: 'capterra',
    title: 'Capterra',
    description:
      'Maximize your Capterra presence with optimized listings, review management, and lead generation strategies.',
  },
  {
    id: 'llm',
    title: 'LLM Optimization',
    description:
      'Position your brand for AI-powered search and ensure visibility in LLM responses and AI search results.',
  },
];

export default function ExpertiseSection() {
  const [activeId, setActiveId] = useState(null);

  return (
    <>
      <style jsx global>{`
        @keyframes smoothExpand {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 1;
          }
        }

        .expertise-grid {
          transition: grid-template-columns 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .expertise-card {
          transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .expertise-description {
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <section className="relative overflow-hidden bg-white py-28 md:py-36 lg:py-44">
        <div className="relative z-10 mx-auto max-w-[1800px] px-4 md:px-6 lg:px-10">
          {/* Header */}
          <div className="mb-20 md:mb-24">
            {/* Badge */}
            <div className="mb-10 flex items-center gap-3">
              <span className="inline-flex h-5 w-5 rounded-sm bg-[#74F5A1]" />
              <span className="font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase text-[#212121]">
                Expertise
              </span>
            </div>

            {/* Title */}
            <h2 className="font-italiana font-light leading-[1.05] tracking-[-0.03em] text-[#111111]">
              <span className="block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px]">
                We understand how to
              </span>
              <span className="block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem]">
                <span className="font-playfair italic font-light">convert</span> in-market SaaS
              </span>
              <span className="block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem]">
                buyers
              </span>
            </h2>
          </div>

          {/* Expertise Cards - Two Separate Grids */}
          <div className="flex flex-col gap-3">
            {/* Top Row - 4 Cards */}
            <div
              className="expertise-grid grid gap-3"
              style={{
                gridTemplateColumns:
                  activeId === 'seo'
                    ? '1.25fr 1fr 1fr 1fr'
                    : activeId === 'sea'
                    ? '1fr 1.25fr 1fr 1fr'
                    : activeId === 'cro'
                    ? '1fr 1fr 1.25fr 1fr'
                    : activeId === 'gtm'
                    ? '1fr 1fr 1fr 1.25fr'
                    : '1fr 1fr 1fr 1fr',
              }}
            >
              {EXPERTISE.slice(0, 4).map((item) => {
                const isActive = activeId === item.id;

                return (
                  <article
                    key={item.id}
                    onMouseEnter={() => setActiveId(item.id)}
                    onMouseLeave={() => setActiveId(null)}
                    className="expertise-card group relative flex min-h-[280px] flex-col justify-between rounded-lg border border-black/8 bg-[#F8F8F8] p-8 hover:bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
                  >
                    {/* Title */}
                    <h3 className="font-italiana font-light text-[24px] sm:text-[28px] md:text-[32px] tracking-tight text-[#111111]">
                      {item.title}
                    </h3>

                    {/* Bottom: Description + Button */}
                    <div className="mt-auto flex items-end justify-between gap-4">
                      {/* Description - fades in on hover */}
                      <p
                        className={`expertise-description max-w-[320px] font-merriweather text-[14px] leading-snug text-[#555555] ${
                          isActive
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-4 opacity-0'
                        }`}
                      >
                        {item.description}
                      </p>

                      {/* Plus Button */}
                      <Link
                        href={`/expertise/${item.id}`}
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
                              stroke="#111111"
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
                              stroke="#111111"
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

            {/* Bottom Row - 3 Cards Spanning Full Width */}
            <div
              className="expertise-grid grid gap-3"
              style={{
                gridTemplateColumns:
                  activeId === 'g2'
                    ? '1.25fr 1fr 1fr'
                    : activeId === 'capterra'
                    ? '1fr 1.25fr 1fr'
                    : activeId === 'llm'
                    ? '1fr 1fr 1.25fr'
                    : '1fr 1fr 1fr',
              }}
            >
              {EXPERTISE.slice(4, 7).map((item) => {
                const isActive = activeId === item.id;

                return (
                  <article
                    key={item.id}
                    onMouseEnter={() => setActiveId(item.id)}
                    onMouseLeave={() => setActiveId(null)}
                    className="expertise-card group relative flex min-h-[280px] flex-col justify-between rounded-lg border border-black/8 bg-[#F8F8F8] p-8 hover:bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
                  >
                    {/* Title */}
                    <h3 className="font-italiana font-light text-[24px] sm:text-[28px] md:text-[32px] tracking-tight text-[#111111]">
                      {item.title}
                    </h3>

                    {/* Bottom: Description + Button */}
                    <div className="mt-auto flex items-end justify-between gap-4">
                      {/* Description - fades in on hover */}
                      <p
                        className={`expertise-description max-w-[320px] font-merriweather text-[14px] leading-snug text-[#555555] ${
                          isActive
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-4 opacity-0'
                        }`}
                      >
                        {item.description}
                      </p>

                      {/* Plus Button */}
                      <Link
                        href={`/expertise/${item.id}`}
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
                              stroke="#111111"
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
                              stroke="#111111"
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
      </section>
    </>
  );
}
