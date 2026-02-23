"use client";

import { forwardRef } from "react";

const DrawerTechnologies = forwardRef(function DrawerTechnologies({ technologies = [], theme = 'light' }, ref) {
  const isDark = theme === 'dark';
  return (
    <div ref={ref} className={`px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 border-t ${
      isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-[#E8E8E8] border-gray-300'
    }`}>
      <h3 className={`font-italiana font-light text-[24px] sm:text-[28px] md:text-[32px] tracking-[-0.03em] mb-6 sm:mb-8 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        Technologies & Tools
      </h3>

      {/* Technology Pills */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {technologies.map((tech, index) => (
          <button
            key={index}
            className={`font-merriweather px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full border-2 bg-transparent text-[14px] font-medium transition-all duration-200 ${
              isDark
                ? 'border-white text-white hover:bg-white hover:text-black'
                : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  );
});

export default DrawerTechnologies;

