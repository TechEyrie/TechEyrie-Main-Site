"use client";

import { forwardRef } from "react";

const DrawerColorPalette = forwardRef(function DrawerColorPalette({ colorPalette = [], theme = 'light' }, ref) {
  const isDark = theme === 'dark';
  return (
    <div ref={ref} className={`px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 border-t ${
      isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-[#E8E8E8] border-gray-300'
    }`}>
      <h3 className={`font-italiana font-light text-[24px] sm:text-[28px] md:text-[32px] tracking-[-0.03em] mb-3 sm:mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        Color Palette
      </h3>
      <p className={`font-merriweather text-[14px] mb-6 sm:mb-8 ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        This website uses a color palette of{" "}
        <span className={`font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {colorPalette.length}
        </span>{" "}
        colors
      </p>

      {/* Color Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {colorPalette.map((color, index) => (
          <div key={index} className="group cursor-pointer">
            <div
              className="relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: color.hex }}
            >
              <div className="aspect-[3/4] flex flex-col items-center justify-center p-6">
                {/* HEX Code at top */}
                <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6 flex items-center justify-between">
                  <span
                    className="font-merriweather text-[10px] sm:text-[11px] md:text-[13px] font-medium"
                    style={{
                      color:
                        color.hex === "#FFFFFF" ? "#000000" : "#FFFFFF",
                    }}
                  >
                    HEX {color.hex}
                  </span>
                  <button
                    className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-lg transition-colors"
                    style={{
                      backgroundColor:
                        color.hex === "#FFFFFF"
                          ? "rgba(0,0,0,0.1)"
                          : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={
                        color.hex === "#FFFFFF" ? "#000000" : "#FFFFFF"
                      }
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                </div>

                {/* Large Aa in center */}
                <div
                  className="text-[40px] sm:text-[60px] md:text-[80px] font-bold leading-none"
                  style={{
                    color:
                      color.hex === "#FFFFFF" ? "#000000" : "#FFFFFF",
                  }}
                >
                  Aa
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default DrawerColorPalette;

