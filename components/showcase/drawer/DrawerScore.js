"use client";

import { forwardRef } from "react";

const DrawerScore = forwardRef(function DrawerScore({ overallScore, evaluationMetrics = [], theme = 'light' }, ref) {
  const isDark = theme === 'dark';
  return (
    <div ref={ref} className={`px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16 border-t ${
      isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-[#E8E8E8] border-gray-300'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 sm:mb-12 md:mb-16 flex-wrap gap-4">
        <h3 className={`font-italiana font-light text-[32px] sm:text-[40px] md:text-[56px] lg:text-[72px] leading-none tracking-[-0.03em] ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          SOTD / SCORE
        </h3>
        <span className={`font-merriweather text-[10px] sm:text-[11px] md:text-[12px] uppercase tracking-[0.16em] ${
          isDark ? 'text-gray-500' : 'text-gray-500'
        }`}>
          Evaluation System
        </span>
      </div>

      {/* Overall Score Display */}
      <div className="flex items-center justify-center mb-12 sm:mb-16 md:mb-20">
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
          {/* Arrow */}
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`hidden sm:block ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`block sm:hidden ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>

                {/* Score */}
                <div className="flex items-baseline gap-0.5 sm:gap-1">
                  <span className={`font-italiana font-light text-[80px] sm:text-[120px] md:text-[180px] lg:text-[200px] xl:text-[220px] leading-none tracking-tighter ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {overallScore}
                  </span>
                  <span className={`font-merriweather text-[28px] sm:text-[40px] md:text-[56px] lg:text-[64px] font-medium ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    /10
                  </span>
                </div>
        </div>
      </div>

      {/* Evaluation Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {evaluationMetrics.map((metric, index) => (
          <div key={index} className="flex flex-col">
            {/* Category and Weight */}
            <div className="flex items-baseline justify-between mb-4">
              <h4 className={`font-merriweather text-[14px] font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {metric.category}
              </h4>
              <span className={`font-merriweather text-[14px] font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {metric.weight}
              </span>
            </div>

            {/* Score Bar Container */}
            <div
              className={`relative w-full rounded-lg mb-3 sm:mb-4 overflow-hidden h-[120px] sm:h-[150px] lg:h-[180px] ${
                isDark ? 'bg-[#2a2a2a]' : 'bg-[#D5D5D5]'
              }`}
            >
              {/* Filled portion - from bottom */}
              <div
                className={`absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out rounded-t-lg ${
                  isDark ? 'bg-white' : 'bg-white'
                }`}
                style={{
                  height: `${
                    (parseFloat(metric.score) /
                      parseFloat(metric.maxScore)) *
                    100
                  }%`,
                }}
              />
            </div>

            {/* Score Display */}
            <div className="text-center">
              <span className={`font-italiana text-[22px] font-light ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {metric.score}
              </span>
              <span className={`font-merriweather text-[15px] font-medium ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {" "}
                / {metric.maxScore}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default DrawerScore;

