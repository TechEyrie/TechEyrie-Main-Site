"use client";

import { forwardRef } from "react";
import Image from "next/image";

const DrawerHighlights = forwardRef(function DrawerHighlights({ highlights = [], theme = 'light' }, ref) {
  const isDark = theme === 'dark';
  
  // Debug: Log highlights data
  console.log('=== HIGHLIGHTS DEBUG ===');
  console.log('Highlights prop received:', highlights);
  console.log('Type of highlights:', typeof highlights);
  console.log('Is array?', Array.isArray(highlights));
  console.log('Length:', highlights?.length);
  console.log('First highlight:', highlights?.[0]);
  console.log('All highlights:', JSON.stringify(highlights, null, 2));
  console.log('=== END HIGHLIGHTS DEBUG ===');
  
  return (
    <div ref={ref} className={`px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#E8E8E8]'}`}>
      <div className="mb-6 sm:mb-8">
        <h3 className={`font-italiana font-light text-[24px] sm:text-[28px] md:text-[32px] leading-tight tracking-[-0.03em] ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          See the highlights
          <br />
          of this website.
        </h3>
      </div>

      {/* Highlights Grid - 2 per row, 6 total */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {highlights.map((highlight) => {
          const hasIcon = highlight?.icon && highlight.icon.trim() !== "";
          
          return (
            <div key={highlight.id} className="group">
              {/* Card Container */}
              <div className="bg-[#2A2A2A] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-10 overflow-hidden">
                {/* Image Preview with Hover Overlay */}
                <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[530px] bg-white rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4">
                  {hasIcon ? (
                    <Image
                      src={highlight.icon}
                      alt={highlight.title || 'Highlight'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <svg
                        className="w-16 h-16 text-gray-400"
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

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 sm:p-6">
                  {/* Bottom Left - Text */}
                  <div className="text-white">
                    <h4 className="font-italiana font-light text-[14px] sm:text-[16px] md:text-[18px] mb-1">
                      {highlight.title}
                    </h4>
                    <p className="font-merriweather text-[12px] sm:text-[13px] md:text-[14px] text-white/80">
                      {highlight.subtitle}
                    </p>
                  </div>

                  {/* Bottom Right - Icons */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Save Icon */}
                    <button className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>

                    {/* Arrow Icon */}
                    <button className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Labels Below Card */}
            <div className="mt-2 sm:mt-3 flex items-center gap-2 flex-wrap">
              <span className={`font-merriweather text-[13px] md:text-[14px] font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {highlight.title || 'Highlight'}
              </span>
              <span className={`hidden sm:inline ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>→</span>
              <span className={`font-merriweather text-[11px] sm:text-[13px] ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {highlight.subtitle || ''}
              </span>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
});

export default DrawerHighlights;

