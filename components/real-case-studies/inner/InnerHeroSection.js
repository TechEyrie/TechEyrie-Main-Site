"use client";

import Image from "next/image";
import Link from "next/link";

export default function InnerHeroSection({ theme = "light" }) {
  const isDark = theme === "dark";

  // Sample project data - replace with actual data from API/props
  const project = {
    breadcrumb: [
      { label: "HOME", href: "/" },
      { label: "PROJECTS", href: "/case-studies" },
      { label: "ISORA – OPTIMIZING GOVERNANCE, RISK & COMPLIANCE FOR TOP INSTITUTIONS", href: "#" },
    ],
    categories: ["SAAS", "WEB APP"],
    title: "Isora – optimizing governance, risk & compliance for top institutions",
    ctaText: "VIEW LIVE",
    ctaLink: "https://example.com",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80",
    highlights: [
      {
        title: "2x increase in user efficiency",
        description: "Optimized workflows and intuitive design improvements doubled user efficiency in assessment completion, reducing friction and streamlining complex processes across the platform.",
      },
      {
        title: "50% reduced time-to-market",
        description: "A robust design system with reusable atomic components and Storybook integration accelerated development, ensured visual consistency, and reduced time-to-market by over 50%.",
      },
      {
        title: "Industry recognition and market growth",
        description: "Nominating the UX Design Award and boosting traffic and lead generation positioned Isora GRC as a leader in the GRC industry, recognized for its user-centric design.",
      },
    ],
  };

  return (
    <section
      className={`w-full min-h-screen pt-20 sm:pt-24 md:pt-28 lg:pt-32 ${
        isDark ? "bg-[#1a1a1a]" : "bg-white"
      }`}
    >
      {/* Container */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20">
        {/* Breadcrumb */}
        <nav className="mb-12 sm:mb-16 md:mb-20">
          <ol className="flex flex-wrap items-center gap-3 sm:gap-4">
            {project.breadcrumb.map((crumb, index) => (
              <li key={index} className="flex items-center gap-3 sm:gap-4">
                <Link
                  href={crumb.href}
                  className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    index === project.breadcrumb.length - 1
                      ? isDark
                        ? "text-white"
                        : "text-black"
                      : isDark
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {crumb.label}
                </Link>
                {index < project.breadcrumb.length - 1 && (
                  <span
                    className={`text-[13px] sm:text-[14px] ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-4 sm:gap-5 mb-8 sm:mb-10">
          {project.categories.map((category, index) => (
            <span
              key={index}
              className={`font-merriweather px-7 sm:px-8 md:px-9 py-3 sm:py-3.5 md:py-4 rounded-lg text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] ${
                isDark
                  ? "bg-[#2a2a2a] text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {category}
            </span>
          ))}
        </div>

        {/* Main Title */}
        <h1
          className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.05] tracking-[-0.03em] mb-10 sm:mb-12 md:mb-16 max-w-full lg:max-w-[85%] xl:max-w-[80%] ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {project.title}
        </h1>

        {/* CTA Button */}
        <Link
          href={project.ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-orange-500 hover:bg-orange-600 text-white font-merriweather text-[14px] font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 mb-16 sm:mb-20 md:mb-24"
        >
          {project.ctaText}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </Link>

        {/* Hero Image - 95% width */}
        <div className="w-full max-w-[95%] mx-auto mb-16 sm:mb-20 md:mb-24 lg:mb-28">
          <div className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover"
              sizes="95vw"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Highlights Section - 3 Column Grid with Increased Sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {project.highlights.map((highlight, index) => (
            <div
              key={index}
              className={`p-10 sm:p-12 md:p-14 lg:p-16 rounded-2xl flex flex-col ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-50"
              }`}
            >
              {/* Title - Top */}
              <h3
                className={`font-italiana font-light text-[24px] sm:text-[28px] md:text-[32px] leading-tight tracking-[-0.03em] mb-auto pb-8 sm:pb-10 md:pb-12 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                {highlight.title}
              </h3>

              {/* Description - Bottom */}
              <p
                className={`font-merriweather text-[14px] leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20 sm:h-32"></div>
    </section>
  );
}
