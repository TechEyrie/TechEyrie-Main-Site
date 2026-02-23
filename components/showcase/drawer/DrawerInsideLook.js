"use client";

import { forwardRef } from "react";
import Image from "next/image";

const DrawerInsideLook = forwardRef(function DrawerInsideLook({ insideLookImages = [], theme = 'light' }, ref) {
  const isDark = theme === 'dark';

  return (
    <div ref={ref} className={`px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 border-t ${
      isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-[#E8E8E8] border-gray-300'
    }`}>
      <span className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-2 sm:mb-3 block ${
        isDark ? 'text-gray-500' : 'text-gray-500'
      }`}>
        Inside look
      </span>
      <h3 className={`font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] leading-tight tracking-[-0.03em] mb-8 sm:mb-10 md:mb-12 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        Discover more
        <br />
        details of this SOTD.
      </h3>

      {/* Grid - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {insideLookImages.map((item) => {
          const hasImage = item?.image && item.image.trim() !== "";
          
          return (
            <div key={item.id} className="group cursor-pointer">
              {/* Card with image as background */}
              <div
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[650px] bg-gray-800"
              >
                {/* Image */}
                {hasImage ? (
                  <Image
                    src={item.image}
                    alt={item.title || 'Inside look image'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

            {/* Label Below */}
            <div className="mt-3 sm:mt-4">
              <p className={`font-merriweather text-[14px] ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="font-semibold">Great element</span>
                <span className={isDark ? 'text-gray-500' : 'text-gray-500'}> from </span>
                <span className="font-semibold">{item.title || 'Project'}</span>
              </p>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
});

export default DrawerInsideLook;

