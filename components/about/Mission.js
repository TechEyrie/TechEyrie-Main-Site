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
    title: "Industry built it, Tech Eyrie Perfected it",
    text: "We don’t exercise as a startup but as an organized partnership, collaborating with market leaders and providing realistic solutions and challenges. Tech Eyrie, partnering with tech companies such as —---------- to create strategic business insights goals guiding decisions and addressing complex strategies. With Tech Eyrie, every insight, platforms and workflow collaborates with the leaders in providing accuracy, reliability and impacts in the luxury B2B market. ",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop", // Truck yard placeholder
    layout: "text-left", // Text on left, Image on right
  },
  {
    id: 2,
    number: "02",
    title: "No more waiting, Technology unleashed",
    text: "For decades manual systems have paused and slowed down the most important operations, but when it comes to B2B it is not only inefficient but also costly. With Tech Eyrie  complexity is turned into clarity, our intelligence and platforms connect all the operational elements and deliver an efficient, controllable and visible business track. From management to real-time optimization, our ai driven solution obstruct any potential disruptions into opportunities, in the luxury B2B world operational excellence is all about competition. ",
    image: "https://images.unsplash.com/photo-1621955964441-c173e01c135b?q=80&w=2086&auto=format&fit=crop", // Logistics placeholder
    layout: "image-left", // Image on left, Text on right
  },
  {
    id: 3,
    number: "03",
    title: "Total Visibility and control",
    text: "In B2B market uncertainty is costly, every delay results in inefficiency, unnoticed movement and loss of time. But in Tech Eyrie, there is no room for guessing, we create real-time digital operations tracking assets, trailers and precisions. From the very first day you will be notified about the insights, efficiency, safety and optimization of decisions. Every luxury brand needs to know the next step, that's the strategic differentiator not just an advantage. ",
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
            { color: "#74F5A1", duration: 1 },
            { color: isDark ? "#E8E4DC" : "#000000", duration: 1 },
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
    <section ref={containerRef} className={`${isDark ? 'bg-[#162d24] text-[#f3f3f3]' : 'bg-white text-black'} py-24 md:py-32 overflow-hidden transition-colors duration-500`}>
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
                  <span className={`font-merriweather about-lux-label text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase ${isDark ? '' : 'text-gray-400'} mt-2`}>{section.number}</span>
                  <MaskedReveal>
                    <h2 className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-0.03em] ${isDark ? 'text-[#f3f3f3]' : 'text-black'}`}>
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