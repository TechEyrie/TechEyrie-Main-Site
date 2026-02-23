"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function WorkCard({ project, theme = "light", layout = "grid", onListHover, onListLeave }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);
  const isDark = theme === "dark";

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleListItemEnter = (e) => {
    if (onListHover) {
      onListHover(project, e);
    }
  };

  const handleListItemLeave = (e) => {
    if (onListLeave) {
      onListLeave(e);
    }
  };

  if (layout === "list") {
    return (
      <a
        href={project.link || "#"}
        className="block group cursor-pointer"
        onMouseEnter={handleListItemEnter}
        onMouseLeave={handleListItemLeave}
      >
        <div
          className="flex items-center justify-between py-10 border-b transition-colors duration-300"
          style={{
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        >
          <span
            className={`font-italiana font-light text-[24px] md:text-[28px] transition-opacity duration-300 group-hover:opacity-60 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}
          >
            {project.title}
            <span
              className={`font-merriweather opacity-0 group-hover:opacity-40 transition-opacity duration-300 ml-3 text-[14px] ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}
            >
              {project.category}
            </span>
          </span>
          <span
            className={`font-merriweather text-[14px] opacity-50 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}
          >
            {project.year}
          </span>
        </div>
      </a>
    );
  }

  // Grid layout
  return (
    <a
      href={project.link || "#"}
      className="block group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card Image/Video Container */}
      <div
        className="relative w-full aspect-[4/6] rounded-[12px] overflow-hidden mb-4"
        style={{
          backgroundColor: isDark ? "#1f1f1f" : "#f0f0f0",
        }}
      >
        {/* Static Image */}
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{
            opacity: isHovered ? 0 : 1,
          }}
        />

        {/* Video (shown on hover) */}
        <video
          ref={videoRef}
          src={project.video}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Hover Overlay with Logo/Title */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          <span className="font-italiana font-light text-white text-xl md:text-2xl tracking-[-0.03em]">
            {project.title}
          </span>
        </div>
      </div>

      {/* Card Info */}
      <div className="flex flex-col gap-1">
        <h3 className={`font-italiana font-light text-[24px] md:text-[28px] tracking-[-0.03em] ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
          {project.title}
        </h3>
        <span
          className={`font-merriweather text-[14px] opacity-0 group-hover:opacity-50 transition-opacity duration-300 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}
        >
          {project.category}
        </span>
      </div>
    </a>
  );
}
