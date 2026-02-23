"use client";
import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MaskedReveal } from "../ui/MaskedRevel";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  {
    id: 1,
    number: "01",
    title: "Built by the industry, for the industry",
    text: "Terminal is a strategic joint venture, not a typical startup. Backed by leading logistics operators such as Prologis, Ryder, Lineage, and NFI, and supported by venture capital firm 8VC, we were designed to solve major industry pain points and establish the category standard. Our strategic investors contributed critical insights and became anchor product design partners, ensuring we’re rapidly solving the industries biggest challenges in yard logistics.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop", // Truck yard placeholder
    layout: "text-left", // Text on left, Image on right
  },
  {
    id: 2,
    number: "02",
    title: "Solving the yard's biggest challenges",
    text: "Fragmented systems and manual processes have held yard operations back for decades. We bring everything together into a single, intelligent platform that gives you total visibility and control. From gate management to spotter optimization, our AI-driven solution prevents bottlenecks before they happen.",
    image: "https://images.unsplash.com/photo-1621955964441-c173e01c135b?q=80&w=2086&auto=format&fit=crop", // Logistics placeholder
    layout: "image-left", // Image on left, Text on right
  },
  {
    id: 3,
    number: "03",
    title: "Total visibility across your operations",
    text: "Stop guessing and start knowing. Our platform creates a real-time digital twin of your yard, tracking every asset, trailer, and driver movement with precision. Gain actionable insights that drive efficiency and safety from day one.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", // Dashboard/Analytics/High-tech placeholder
    layout: "text-left", // Text on left, Image on right
  },
];

const ScrollTextReveal = ({ children, className = "", isDark = false }) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const words = containerRef.current.querySelectorAll(".word");
      
      gsap.fromTo(
        words,
        { color: isDark ? "#6B7280" : "#D1D5DB", opacity: 0.3 }, // Start color
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 50%",
            scrub: true,
          },
          keyframes: [
            { color: "#FBBF24", duration: 1 }, // Highlight Yellow
            { color: isDark ? "#FFFFFF" : "#000000", duration: 1 }, // Settle to White/Black
          ]
        }
      );
    }, [isDark]);

    return () => ctx.revert();
  }, [children, isDark]);

  // Split text into words
  const words = children.split(" ");

  return (
    <p ref={containerRef} className={`${className} flex flex-wrap gap-[0.25em]`}>
      {words.map((word, i) => (
        <span key={i} className="word transition-colors duration-0">
          {word}
        </span>
      ))}
    </p>
  );
};

const MissionSection = ({ theme = "light" }) => {
  const containerRef = useRef(null);
  const imageRefs = useRef([]);
  const isDark = theme === "dark";

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      imageRefs.current.forEach((img, index) => {
        if (!img) return;
        
        // Parallax effect: Moving the image inside its container
        gsap.fromTo(
          img,
          { y: "-15%" }, // Start slightly up
          {
            y: "15%",    // Move slightly down
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement, // Trigger based on the container
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={`${isDark ? 'bg-[#0B0B0B] text-white' : 'bg-white text-black'} py-24 md:py-32 overflow-hidden transition-colors duration-500`}>
      <div className="w-full space-y-32 md:space-y-48">
        {SECTIONS.map((section, index) => (
          <div
            key={section.id}
            className={`flex flex-col ${
              section.layout === "text-left" ? "lg:flex-row" : "lg:flex-row-reverse"
            } items-center`}
          >
            {/* TEXT COLUMN */}
            <div className={`w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 ${
               section.layout === "text-left" 
                 ? "lg:pl-[max(4rem,calc((100vw-1600px)/2))] lg:pr-24" // Align left to site container
                 : "lg:pr-[max(4rem,calc((100vw-1600px)/2))] lg:pl-24" // Align right to site container
            }`}>
              <div className="max-w-2xl">
                <div className="flex items-start gap-4 mb-8">
                  <span className={`font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-2`}>{section.number}</span>
                  <MaskedReveal>
                    <h2 className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-0.03em] ${isDark ? 'text-white' : 'text-black'}`}>
                      {section.title}
                    </h2>
                  </MaskedReveal>
                </div>

                <div className="">
                  <ScrollTextReveal className="font-merriweather text-[14px] leading-relaxed" isDark={isDark}>
                    {section.text}
                  </ScrollTextReveal>
                </div>
              </div>
            </div>

            {/* IMAGE COLUMN - FULL BLEED */}
            <div className="w-full lg:w-1/2 h-[60vh] lg:h-[80vh] mt-8 md:mt-12 lg:mt-0">
              <div 
                className="relative w-full h-full overflow-hidden"
                style={{
                  clipPath: section.layout === "text-left"
                    // Image Right (bleeds right): Notch on Top-Left
                    ? "polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 15%)" 
                    // Image Left (bleeds left): Notch on Top-Right
                    : "polygon(0 0, 90% 0, 100% 15%, 100% 100%, 0 100%)"
                }}
              >
                 <div ref={el => imageRefs.current[index] = el} className="absolute inset-0 w-full h-[130%] -top-[15%]">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover"
                    />
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MissionSection;