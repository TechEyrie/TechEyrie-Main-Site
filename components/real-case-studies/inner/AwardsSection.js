"use client";

import { useState } from "react";

export default function ProjectAwards({ theme = "light" }) {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === "dark";

  // Sample data - replace with actual props
  const award = {
    label: "AWARDS",
    title: "UX Design Awards - Nomination 2024",
    cardTitle: ["UX", "Design", "Awards"],
    year: "2024",
    description:
      "",
  };

  return (
    <section className={`w-full ${isDark ? "bg-[#1a1a1a]" : "bg-white"}`}>
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24 lg:py-28">
        {/* Label */}
        <p
          className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-12 sm:mb-16 md:mb-20 ${
            isDark ? "text-gray-500" : "text-gray-600"
          }`}
        >
          {award.label}
        </p>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24">
          {/* Left Side - Award Title */}
          <div>
            <h2
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[48px] lg:text-[56px] xl:text-[64px] leading-[1.1] tracking-[-0.03em] cursor-pointer transition-colors duration-300 ${
                isHovered
                  ? isDark
                    ? "text-white"
                    : "text-black"
                  : isDark
                  ? "text-gray-600"
                  : "text-gray-400"
              }`}
            >
              {award.title}
            </h2>
          </div>

          {/* Right Side - Card (appears on hover) */}
          <div className="flex items-center justify-center">
            {isHovered && (
              <div
                className={`w-[70%] sm:w-[65%] md:w-[60%] aspect-square rounded-2xl flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 shadow-2xl animate-fadeIn ${
                  isDark ? "bg-[#4a3f5f]" : "bg-[#e8d9ff]"
                }`}
              >
                {/* Card Title - Stacked */}
                <div className="text-center mb-4 sm:mb-6">
                  {award.cardTitle.map((line, index) => (
                    <h3
                      key={index}
                      className={`font-italiana font-light text-[24px] sm:text-[28px] md:text-[32px] lg:text-[40px] leading-[0.95] tracking-[-0.03em] ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {line}
                    </h3>
                  ))}
                </div>

                {/* Year */}
                <p
                  className={`font-merriweather text-[14px] font-semibold mb-4 sm:mb-6 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {award.year}
                </p>

                {/* Description */}
                <p
                  className={`font-merriweather text-[14px] leading-relaxed text-center ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {award.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </section>
  );
}
