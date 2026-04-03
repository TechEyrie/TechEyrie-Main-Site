"use client";

import { caseStudySectionShell, caseStudySectionSurface } from "../caseStudySectionProps";
import Image from "next/image";

export default function DesignDirectionSection({ theme = "light" }) {
  const isDark = theme === "dark";

  // Sample data - replace with actual props
  const research = {
    label: "STAGE 3",
    title: "Design system",
    description:
      "Before diving into the design concept, we created a comprehensive mood board and conducted a short client survey. These steps helped us align on the overall visual direction and establish a clear path forward. Accessibility was a key focus throughout this stage. From the outset, the design needed to be inherently accessible, ensuring usability for all users. This requirement introduced certain constraints on visual choices, guiding the design team toward solutions that balanced creativity with inclusivity.",
    stages: {
      title: "Stages",
      items: [
        "#Design direction",
        "#Product UI design",
        "#Design system",
       
      ],
    },
    image: {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80",
        alt: "Documentation review process",
      },
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
              {research.label}
            </p>

            {/* Title */}
            <h2
              className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-0.03em] ${
                isDark ? "text-[#f3f3f3]" : "text-black"
              }`}
            >
              {research.title}
            </h2>
          </div>

          {/* Right Side - Empty space on desktop */}
          <div className="hidden lg:block"></div>
        </div>

        {/* Description and Stages - Full width below, aligned to right column on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24 mt-12 md:mt-16 lg:mt-20">
          {/* Empty left column on desktop */}
          <div className="hidden lg:block"></div>

          {/* Description and Stages on right */}
          <div className="space-y-12 sm:space-y-14 md:space-y-16">
            {/* Description */}
            <p
              className={`font-playfair text-[17px] md:text-[20px] font-normal leading-relaxed ${
                isDark ? "text-[#f3f3f3]" : "text-black"
              }`}
            >
              {research.description}
            </p>

            
            
          </div>
        </div>
         {/* Full Width Image */}
         <div className="mt-16 sm:mt-20 md:mt-24 lg:mt-28">
          <div className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={research.image.url}
              alt={research.image.alt}
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
