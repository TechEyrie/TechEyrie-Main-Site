"use client";

import Image from "next/image";

export default function ProductDevelopmentSection({ theme = "light" }) {
  const isDark = theme === "dark";

  // Sample data - replace with actual props
  const research = {
    label: "Development stages",
    title: "Product Development",
    description:
      "Given the visual focus of the redesign with selective feature additions, we streamlined the process by skipping traditional wireframes. Instead, we treated the live product and the newly developed informational architecture as our foundation. This approach allowed us to move faster and optimize the client’s budget without compromising on quality.",
    stages: {
      title: "Stages",
      items: [
        "#Design direction",
        "#Product UI design",
        "#Design system",
       
      ],
    },
    // images: [
    //   {
    //     url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80",
    //     alt: "Research analytics dashboard",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
    //     alt: "User flow documentation",
    //   },
    // ],
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
              {research.label}
            </p>

            {/* Title */}
            <h2
              className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-0.03em] ${
                isDark ? "text-white" : "text-black"
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
                isDark ? "text-white" : "text-black"
              }`}
            >
              {research.description}
            </p>

            {/* Stages */}
            <div>
              <h3
                className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-6 sm:mb-8 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                {research.stages.title}
              </h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {research.stages.items.map((stage, index) => (
                  <span
                    key={index}
                    className={`font-merriweather text-[14px] uppercase tracking-[0.16em] ${
                      isDark ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {stage}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </section>
  );
}
