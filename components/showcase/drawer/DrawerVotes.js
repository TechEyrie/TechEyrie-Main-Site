"use client";

import { forwardRef } from "react";
import Image from "next/image";

const DrawerVotes = forwardRef(function DrawerVotes({ juryMembers = [], theme = 'light' }, ref) {
  const isDark = theme === 'dark';
  
  // Debug: Log jury members data
  console.log('=== DRAWER VOTES DEBUG ===');
  console.log('Jury Members prop received:', juryMembers);
  console.log('Type of juryMembers:', typeof juryMembers);
  console.log('Is array?', Array.isArray(juryMembers));
  console.log('Length:', juryMembers?.length);
  console.log('First member:', juryMembers?.[0]);
  console.log('All jury members:', JSON.stringify(juryMembers, null, 2));
  console.log('=== END DRAWER VOTES DEBUG ===');
  
  return (
    <div ref={ref} className={`px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 border-t ${
      isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-[#E8E8E8] border-gray-300'
    }`}>
      {/* Tabs Header */}
      <div className={`flex items-center gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10 border-b overflow-x-auto ${
        isDark ? 'border-gray-800' : 'border-gray-300'
      }`}>
        <button className={`font-merriweather text-[14px] font-semibold pb-3 sm:pb-4 border-b-2 whitespace-nowrap ${
          isDark 
            ? 'text-white border-white' 
            : 'text-gray-900 border-gray-900'
        }`}>
          Votes
        </button>
        <button className={`font-merriweather text-[14px] font-medium pb-3 sm:pb-4 border-b-2 border-transparent transition-colors whitespace-nowrap ${
          isDark 
            ? 'text-white hover:border-gray-600' 
            : 'text-gray-900 hover:border-gray-400'
        }`}>
          Jury
        </button>
        <button className={`font-merriweather text-[14px] font-medium pb-3 sm:pb-4 border-b-2 border-transparent transition-colors whitespace-nowrap ${
          isDark 
            ? 'text-gray-500 hover:border-gray-700' 
            : 'text-gray-400 hover:border-gray-300'
        }`}>
          Community Members
        </button>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8">
        {/* Table Header */}
        <div className="grid grid-cols-[200px_80px_80px_100px_70px_120px_80px_80px] sm:grid-cols-[1fr_100px_100px_120px_80px_140px_100px_100px] gap-3 sm:gap-4 mb-4 sm:mb-6 min-w-[800px]">
        <div></div>
        <div className={`font-merriweather text-[13px] font-semibold text-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Semantics</div>
        <div className={`font-merriweather text-[13px] font-semibold text-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Animations</div>
        <div className={`font-merriweather text-[13px] font-semibold text-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Accessibility</div>
        <div className={`font-merriweather text-[13px] font-semibold text-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>WPO</div>
        <div className={`font-merriweather text-[13px] font-semibold text-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Responsive Design</div>
        <div className={`font-merriweather text-[13px] font-semibold text-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Markup</div>
        <div className={`font-merriweather text-[13px] font-semibold text-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Overall</div>
      </div>

        {/* Jury Members List */}
        <div className="space-y-0">
          {juryMembers.map((member, index) => (
            <div key={index} className={`grid grid-cols-[200px_80px_80px_100px_70px_120px_80px_80px] sm:grid-cols-[1fr_100px_100px_120px_80px_140px_100px_100px] gap-3 sm:gap-4 items-center py-5 sm:py-6 md:py-7 border-t border-dotted min-w-[800px] ${
              isDark ? 'border-gray-700' : 'border-gray-400'
            }`}>
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0 ${
                  isDark ? 'bg-[#2a2a2a]' : 'bg-gray-300'
                }`}>
                  <Image
                    src={member.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"}
                    alt={member.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                    <span className={`font-merriweather text-[14px] font-semibold truncate ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{member.name}</span>
                    
                  </div>
                  {member.role && (
                    <p className={`font-merriweather text-[12px] sm:text-[13px] md:text-[14px] truncate ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{member.role}</p>
                  )}
                </div>
              </div>
              <div className={`font-merriweather text-[14px] text-center font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{member.scores?.semantics || "-"}</div>
              <div className={`font-merriweather text-[14px] text-center font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{member.scores?.animations || "-"}</div>
              <div className={`font-merriweather text-[14px] text-center font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{member.scores?.accessibility || "-"}</div>
              <div className={`font-merriweather text-[14px] text-center font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{member.scores?.wpo || "-"}</div>
              <div className={`font-merriweather text-[14px] text-center font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{member.scores?.responsiveDesign || "-"}</div>
              <div className={`font-merriweather text-[14px] text-center font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{member.scores?.markup || "-"}</div>
              <div className={`font-italiana text-[16px] sm:text-[17px] md:text-[18px] font-light text-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{member.overall || "-"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default DrawerVotes;

