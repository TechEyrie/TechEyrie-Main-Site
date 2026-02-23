"use client";

import Image from "next/image";

export default function DrawerHeader({ selectedItem, onClose, rating, date, theme = 'light' }) {
  const isDark = theme === 'dark';
  return (
    <div className={`relative px-4 sm:px-6 md:px-8 py-4 sm:py-6 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#E8E8E8]'}`}>
      {/* Top Bar with Title and Action Icons */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
        {/* Left: Site name and creators */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0 flex-1">
          <h3 className={`font-merriweather text-[14px] font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {selectedItem.title}
          </h3>
          <span className={`font-merriweather text-[12px] sm:text-[14px] hidden sm:inline ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>by</span>
          {selectedItem.creators?.slice(0, 1).map((creator, index) => (
            <div key={index} className="flex items-center gap-1.5 sm:gap-2">
              <div className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full font-merriweather text-[9px] sm:text-[10px] font-bold ${
                isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'
              }`}>
                {creator.avatar}
              </div>
              <span className={`font-merriweather text-[12px] sm:text-[13px] font-medium truncate max-w-[100px] sm:max-w-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {creator.name}
              </span>
              {creator.type && (
                <span className={`font-merriweather rounded px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold hidden sm:inline ${
                  isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'
                }`}>
                  {creator.type}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Bookmark */}
          <button className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg transition-colors ${
            isDark 
              ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-900'
          }`}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          {/* Share */}
          <button className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg transition-colors ${
            isDark 
              ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-900'
          }`}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
          {/* External Link */}
          <button className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg transition-colors ${
            isDark 
              ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-900'
          }`}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
          {/* Close */}
          <button
            onClick={onClose}
            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg transition-colors ${
              isDark 
                ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white' 
                : 'bg-white hover:bg-gray-100 text-gray-900'
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Rating Badge */}
      {rating && (
        <div className="absolute left-4 sm:left-6 md:left-8 top-20 sm:top-24">
          <div className={`flex flex-col items-center justify-center rounded-lg sm:rounded-xl border-2 px-3 sm:px-4 py-2 sm:py-3 min-w-[60px] sm:min-w-[80px] ${
            isDark 
              ? 'border-gray-700 bg-[#2a2a2a]' 
              : 'border-gray-300 bg-white'
          }`}>
            <span className={`font-merriweather text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              SOTD
            </span>
            <span className={`font-italiana text-[20px] sm:text-[24px] md:text-[28px] font-light leading-none mt-0.5 sm:mt-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {rating}
            </span>
            <span className={`font-merriweather text-[9px] sm:text-[11px] font-medium ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              /10
            </span>
          </div>
        </div>
      )}

      {/* Date */}
      {date && (
        <p className={`font-merriweather text-center text-[11px] sm:text-[13px] mb-3 sm:mb-4 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {date}
        </p>
      )}

      {/* Large Title */}
      <h2 className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.05] tracking-[-0.03em] mb-4 sm:mb-6 text-center px-2 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {selectedItem.title}
      </h2>

      {/* Creators Below Title */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap mb-6 sm:mb-8 px-2">
        {selectedItem.creators?.map((creator, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full font-merriweather text-[12px] font-bold ${
              isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'
            }`}>
              {creator.avatar}
            </div>
            <span className={`font-merriweather text-[14px] font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {creator.name}
            </span>
            {creator.type && (
              <span className={`font-merriweather rounded px-1.5 py-0.5 text-[10px] font-bold ${
                isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'
              }`}>
                {creator.type}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

