"use client";

import { caseStudySectionShell, caseStudySectionSurface } from "../caseStudySectionProps";
import Image from "next/image";

export default function ProjectOverview({ theme = "light" }) {
  const isDark = theme === "dark";

  // Sample data - replace with actual props
  const overview = {
    label: "OVERVIEW",
    title: "Overcoming all GRC challenges in one place",
    description:
      "The collaborative governance, risk, and compliance (GRC) assessment platform that helps the entire organization come together to enhance cybersecurity. It automates complex risk management tasks to improve data collection, risk identification, and regulatory compliance. Isora is trusted by information security teams at over 20% of high research activity universities (R1) in the United States.",
    client: {
      name: "SALTYCLOUD",
      location: "TEXAS, USA",
      flag: "🇺🇸",
    },
    services: [
      "UX AUDIT",
      "PRODUCT REDESIGN",
      "WEB DEVELOPMENT",
      "TEAM EXTENTION",
    ],
    technologies: [
      { name: "VITE", icon: "⚡" },
      { name: "REACT", icon: "⚛️" },
      { name: "TYPESCRIPT", icon: "TS" },
      { name: "REACT ROUTER DOM", icon: "🔀" },
      { name: "RADIX PRIMITIVES", icon: "▪️" },
      { name: "TAILWINDCSS", icon: "🌊" },
      { name: "RECHARTS", icon: "📊" },
      { name: "STORYBOOK", icon: "📚" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80",
        alt: "Dashboard analytics view",
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
        alt: "Project details interface",
      },
    ],
  };

  return (
    <section className={caseStudySectionShell(isDark)} style={caseStudySectionSurface(isDark)}>
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24">
          {/* Left Side - Label and Title */}
          <div>
            {/* Label */}
            <p
              className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-8 sm:mb-10 md:mb-12 ${
                isDark ? "text-[#a8a498]" : "text-gray-600"
              }`}
            >
              {overview.label}
            </p>

            {/* Title */}
            <h2
              className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-0.03em] ${
                isDark ? "text-[#f3f3f3]" : "text-black"
              }`}
            >
              {overview.title}
            </h2>
          </div>

          {/* Right Side - Empty space on desktop */}
          <div className="hidden lg:block"></div>
        </div>

        {/* Description and Info - Full width below, aligned to right column on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24 mt-12 md:mt-16 lg:mt-20">
          {/* Empty left column on desktop */}
          <div className="hidden lg:block"></div>

          {/* Description and Info on right */}
          <div className="space-y-12 sm:space-y-14 md:space-y-16">
            {/* Description */}
            <p
              className={`font-playfair text-[17px] md:text-[20px] font-normal leading-relaxed ${
                isDark ? "text-[#e8e4dc]" : "text-black"
              }`}
            >
              {overview.description}
            </p>

            {/* Client */}
            <div>
              <h3
                className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-4 sm:mb-5 ${
                  isDark ? "text-[#c8c2ad]" : "text-gray-600"
                }`}
              >
                Client
              </h3>
              <div className="flex items-center gap-3">
                <span
                  className={`font-merriweather text-[14px] uppercase tracking-[0.16em] ${
                    isDark ? "text-[#c8c2ad]" : "text-gray-700"
                  }`}
                >
                  {overview.client.name}
                </span>
                <span className="text-[18px]">{overview.client.flag}</span>
                <span
                  className={`font-merriweather text-[14px] uppercase tracking-[0.16em] ${
                    isDark ? "text-[#c8c2ad]" : "text-gray-700"
                  }`}
                >
                  {overview.client.location}
                </span>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3
                className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-4 sm:mb-5 ${
                  isDark ? "text-[#c8c2ad]" : "text-gray-600"
                }`}
              >
                Services
              </h3>
              <div className="flex flex-wrap gap-3">
                {overview.services.map((service, index) => (
                  <span
                    key={index}
                    className={`font-merriweather text-[14px] uppercase tracking-[0.16em] ${
                      isDark ? "text-[#c8c2ad]" : "text-gray-700"
                    }`}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3
                className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-4 sm:mb-5 ${
                  isDark ? "text-[#c8c2ad]" : "text-gray-600"
                }`}
              >
                Technologies
              </h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {overview.technologies.map((tech, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-[16px] sm:text-[18px]">
                      {tech.icon}
                    </span>
                    <span
                      className={`font-merriweather text-[14px] uppercase tracking-[0.16em] ${
                        isDark ? "text-[#c8c2ad]" : "text-gray-700"
                      }`}
                    >
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Images Section - Two columns side by side */}
        <div className="mt-16 sm:mt-20 md:mt-24 lg:mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {overview.images.map((image, index) => (
              <div
                key={index}
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
