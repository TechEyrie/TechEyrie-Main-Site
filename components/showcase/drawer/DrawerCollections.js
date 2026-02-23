"use client";

import { forwardRef } from "react";
import Image from "next/image";

const DrawerCollections = forwardRef(function DrawerCollections({ collections = [], theme = 'light' }, ref) {
  const isDark = theme === 'dark';
  return (
    <div ref={ref} className={`px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16 border-t ${
      isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-[#E8E8E8] border-gray-300'
    }`}>
      {/* Header */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <span className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-2 sm:mb-3 block ${
          isDark ? 'text-gray-500' : 'text-gray-500'
        }`}>Collections</span>
        <h3 className={`font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] leading-tight tracking-[-0.03em] ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Explore more<br />great collections.
        </h3>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {collections.map((collection, index) => (
          <div key={index} className="group cursor-pointer">
            {/* Card with dark background */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#2A2A2A] p-6 sm:p-8 md:p-12 mb-4 sm:mb-5 transition-transform duration-300 hover:scale-[1.02]">
              <div className="relative w-full aspect-[4/3]">
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className={`w-full h-full rounded-xl ${collection.customContent || "bg-black"}`}>
                    {collection.customContent && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {collection.customContent}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end p-4 sm:p-6">
                  <div className="text-white">
                    <p className="font-italiana font-light text-[16px] sm:text-[17px] md:text-[18px] mb-1">{collection.type || "Collection"}</p>
                    <p className="font-merriweather text-[14px] text-white/90">{collection.subtitle || "Inspiration"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Collection Info */}
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <h4 className={`font-merriweather text-[14px] font-semibold truncate ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{collection.title}</h4>
                {collection.showFollowedBy && (
                  <span className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] hidden sm:inline ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>followed by</span>
                )}
              </div>
              
              {/* Follower Avatars */}
              {collection.followers && collection.followers.length > 0 && (
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <div className="flex -space-x-1.5 sm:-space-x-2">
                    {collection.followers.slice(0, 3).map((follower, idx) => {
                      const hasAvatar = follower?.avatar && follower.avatar.trim() !== "";
                      
                      return (
                        <div key={idx} className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 overflow-hidden flex items-center justify-center ${
                          isDark 
                            ? 'border-[#1a1a1a] bg-[#2a2a2a]' 
                            : 'border-[#E8E8E8] bg-gray-300'
                        }`}>
                          {hasAvatar ? (
                            <Image
                              src={follower.avatar}
                              alt="Follower"
                              width={28}
                              height={28}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className={`font-merriweather text-[10px] sm:text-[12px] font-semibold ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {follower.name?.[0]?.toUpperCase() || '?'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {collection.followerCount && (
                    <span className={`font-merriweather text-[12px] sm:text-[13px] md:text-[14px] font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>+{collection.followerCount}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default DrawerCollections;

