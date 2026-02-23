"use client";

const sections = [
  { id: "highlights", label: "Highlights" },
  { id: "colorPalette", label: "Colors" },
  { id: "technologies", label: "Tools" },
  { id: "description", label: "Description" },
  { id: "insideLook", label: "Inside Look" },
  { id: "score", label: "Score" },
  { id: "votes", label: "Votes" },
  { id: "collections", label: "Collections" },
];

export default function DrawerNavigation({ activeSection, onSectionClick, theme = 'light' }) {
  const isDark = theme === 'dark';
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] flex items-center justify-center pb-4 sm:pb-6 pointer-events-none">
      <div className="bg-[#3E3E3E] rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-fit mx-auto scrollbar-hide pointer-events-auto backdrop-blur-sm border border-white/10">
        <div className="min-h-10 sm:min-h-12 md:min-h-14 px-2 sm:px-3 md:px-4 flex items-center justify-center rounded-md sm:rounded-lg flex-shrink-0 border border-gray-600 bg-black mr-1 sm:mr-2">
          <svg viewBox="0 0 32 32" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" aria-hidden="true">
            <path d="M7 18C7 11 13 7 19 7V18H7Z" fill="currentColor" className="text-white" />
            <path d="M19 18C25 18 29 24 29 28H19V18Z" fill="currentColor" className="text-white" />
          </svg>
        </div>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={`font-merriweather min-h-10 sm:min-h-12 md:min-h-14 px-2 sm:px-3 md:px-4 flex items-center justify-center rounded-md sm:rounded-lg text-[10px] sm:text-[11px] md:text-[12px] font-medium tracking-wide whitespace-nowrap transition-all duration-200 flex-shrink-0 border cursor-pointer ${
              activeSection === section.id
                ? 'text-yellow-400 border-yellow-400 bg-transparent'
                : `${isDark ? 'text-white/60 hover:text-white border-gray-600 hover:border-white' : 'text-white/70 hover:text-white border-gray-500 hover:border-white'} bg-transparent`
            }`}
          >
            {section.label}
          </button>
        ))}
        <button
          className="font-merriweather min-h-10 sm:min-h-12 md:min-h-14 px-2 sm:px-3 md:px-4 flex items-center justify-center rounded-md sm:rounded-lg text-[10px] sm:text-[11px] md:text-[12px] font-semibold tracking-wide whitespace-nowrap transition-all duration-200 flex-shrink-0 border-0 cursor-pointer bg-yellow-400 text-black hover:bg-yellow-500 ml-1 sm:ml-2"
        >
          Visit Site
        </button>
      </div>
    </div>
  );
}

