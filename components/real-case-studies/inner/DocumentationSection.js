"use client";

import Image from "next/image";

export default function DocumentationSection({ theme = "light" }) {
  const isDark = theme === "dark";

  // Sample data - replace with actual props
  const documentation = {
    label: "DOCUMENTATION",
    title: "Documentation analysis",
    description:
      "We conducted a comprehensive review of all technical and user-facing documentation to understand the platform's architecture, features, and current implementation. This deep dive into existing documentation helped us identify gaps, inconsistencies, and opportunities for improvement. By analyzing API documentation, user guides, and internal technical specs, we gained critical insights into the system's capabilities and constraints, which informed our redesign strategy and ensured alignment with the platform's technical foundation.",
    image: {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80",
      alt: "Documentation review process",
    },
  };

  return (
    <section className={`w-full ${isDark ? "bg-[#1a1a1a]" : "bg-white"}`}>
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24">
          {/* Left Side - Label and Title */}
          <div>
            {/* Label */}
            <p
              className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-8 sm:mb-10 md:mb-12 ${
                isDark ? "text-gray-500" : "text-gray-600"
              }`}
            >
              {documentation.label}
            </p>

            {/* Title */}
            <h2
              className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-0.03em] ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {documentation.title}
            </h2>
          </div>

          {/* Right Side - Empty space on desktop */}
          <div className="hidden lg:block"></div>
        </div>

        {/* Description - Full width below, aligned to right column on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24 mt-12 md:mt-16 lg:mt-20">
          {/* Empty left column on desktop */}
          <div className="hidden lg:block"></div>

          {/* Description on right */}
          <div>
            <p
              className={`font-playfair text-[17px] md:text-[20px] font-normal leading-relaxed ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {documentation.description}
            </p>
          </div>
        </div>

        {/* Full Width Image */}
        <div className="mt-16 sm:mt-20 md:mt-24 lg:mt-28">
          <div className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={documentation.image.url}
              alt={documentation.image.alt}
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
