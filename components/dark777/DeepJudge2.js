"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search } from "lucide-react";
import { dark7MainSurfaceStyle } from "./dark7PageSurface";

// Register usage
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FEATURE_CARDS = [
  { title: "Discovery", desc: "Understanding your workflow, challenges and ambitions to elevate your business. We go beyond the surface level to analyse what you really need." },
  { title: "Architecture", desc: "We design flexible and secure systems to align with your operations. No one size fits all, only precision-built foundation." },
  { title: "Engineering", desc: "Building AI powered platforms, workflow automation tools and custom digital systems using modern technology." },
  { title: "Integration", desc: "Everything works together seamlessly by connecting your data, tools and teams into one unified intelligent system." },
  { title: "Evolution", desc: "We ensure your system adapts, scales and improves as the business grows, with continuous refinement and long-term performance." },
];

const CIRCLE_ITEMS = [
  { text: "Artificial Intelligence", barcode: "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8f96866dde7aebec6949e_DeepJudge%20Frame%20634185.svg" },
  { text: "Automation", barcode: "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8fd519a08abfc193a45b1_DeepJudge%20Frame%20634185%20(1).svg" },
  { text: "ERP", barcode: "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8fe569ae8d17d933a3c60_DeepJudge%20Frame%20634185%20(2).svg" },
  { text: "Cloud API's", barcode: "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8f96866dde7aebec6949e_DeepJudge%20Frame%20634185.svg" },
  { text: "Web", barcode: "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8fd519a08abfc193a45b1_DeepJudge%20Frame%20634185%20(1).svg" },
  { text: "Email", barcode: "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8fe569ae8d17d933a3c60_DeepJudge%20Frame%20634185%20(2).svg" },
  { text: "Data", barcode: "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8f96866dde7aebec6949e_DeepJudge%20Frame%20634185.svg" },
  { text: "Deep Search", barcode: "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8fd519a08abfc193a45b1_DeepJudge%20Frame%20634185%20(1).svg" },
];

export default function DeepJudge2({ theme }) {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  // References
  const circleBgRefs = useRef([]);
  const circleContentRefs = useRef([]);
  const centerOrbRef = useRef(null);
  const searchFieldRef = useRef(null);
  const heading1Ref = useRef(null);
  const heading2Ref = useRef(null);
  const description2Ref = useRef(null);
  const heading3Ref = useRef(null);
  const description3Ref = useRef(null);

  const isDark = theme === 'dark';
  
  // Color Palettes
  const lightColors = {
    primary: "#013825",
    secondary: "#9E8F72",
    tertiary: "#CEC8B0",
    background: "#F9F7F0",
    cardBg: "#F4F2EF",
    cardShadow: "#DCDAD7",
  };
  
  // Theme Colors (aligned with FAQ: #f3f3f3, #a0a0a0, #d0d0d0)
  const textColor = isDark ? 'text-[#f3f3f3]' : 'text-slate-900';
  const subtitleColor = isDark ? 'text-[#a0a0a0]' : 'text-slate-600';
  const circleBlobColor = isDark ? 'bg-neutral-800/80 border-neutral-700/50' : '';
  const circleBlobStyle = isDark ? {} : { backgroundColor: `${lightColors.tertiary}B3`, borderColor: `${lightColors.tertiary}66` };
  const subTextColor = isDark ? 'text-[#a0a0a0]' : 'text-slate-600';
  const cardBg = isDark ? 'bg-neutral-900/95 border-neutral-800' : 'bg-white/95 border-gray-200';
  const cardBgStyle = isDark ? {} : { backgroundColor: `${lightColors.background}F2`, borderColor: `${lightColors.tertiary}80` };
  const cardTitle = isDark ? 'text-[#f3f3f3]' : 'text-slate-900';
  const cardDesc = isDark ? 'text-[#d0d0d0]' : 'text-slate-500';
  const badgeBg = isDark ? 'bg-neutral-800 text-white' : '';
  const badgeBgStyle = isDark ? {} : { backgroundColor: lightColors.tertiary, color: '#1a1a1a' };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (!wrapperRef.current) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "+=4000",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const calculatePosition = (i) => {
          const isTop = i < 4;
          const colIndex = i % 4;
          const spread = 280;
          const xOffset = -420 + colIndex * spread;
          const yBase = isTop ? -300 : 280;
          const isOuter = colIndex === 0 || colIndex === 3;
          const push = 120;
          let yOffset = yBase;
          if (isTop) {
            if (isOuter) yOffset += push;
          } else {
            if (isOuter) yOffset -= push;
          }
          return { x: xOffset, y: yOffset };
        };

        // Apply Initial Positions
        circleBgRefs.current.forEach((el, i) => {
            if(!el) return;
            const pos = calculatePosition(i);
            gsap.set(el, { x: pos.x, y: pos.y, scale: 1, opacity: 1 });
        });
        
        circleContentRefs.current.forEach((el, i) => {
            if(!el) return;
            const pos = calculatePosition(i);
            gsap.set(el, { x: pos.x, y: pos.y, scale: 1, opacity: 1 });
        });

        // GSAP owns transform — keep orb centered when animating y (Tailwind translate gets wiped)
        const orbCenter = { xPercent: -50, yPercent: -50 };
        if (centerOrbRef.current) {
          gsap.set(centerOrbRef.current, orbCenter);
        }

        // =========================================
        // STAGE 1: MERGE TO CENTER
        // =========================================
        
        tl.to(circleContentRefs.current, { opacity: 0, scale: 0.5, duration: 1 }, "stage1")
        
        .to(circleBgRefs.current, {
            x: 0,
            y: 0, 
            scale: 0.2, 
            duration: 2,
            ease: "power2.inOut"
        }, "stage1")
        
        .to(heading1Ref.current, { opacity: 0, y: -50, duration: 1 }, "stage1")
        
        .to(circleBgRefs.current, { opacity: 0, duration: 0.1 }, "stage1+=1.9")
        .fromTo(centerOrbRef.current, 
            { width: 0, height: 0, opacity: 1, backgroundColor: "#FFFFFF", borderRadius: 0, ...orbCenter },
            { width: 20, height: 20, opacity: 1, borderRadius: 10, ...orbCenter, duration: 0.2 },
            "stage1+=1.9"
        );

        tl.to({}, { duration: 0.5 });

        // =========================================
        // STAGE 2: ORB MORPHS TO FIELD
        // =========================================
        
        const fieldWidth = "600px";
        const fieldHeight = 64;
        const pillRadius = fieldHeight / 2;
        const dotSize = 20;
        const dotRadius = dotSize / 2;
        const headingY = -120;
        const descriptionY = -120;
        const fieldY = 140;

        tl.fromTo(heading2Ref.current, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: headingY, duration: 1 }, 
            "stage2"
        );
        
        tl.fromTo(description2Ref.current, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: descriptionY, duration: 1 }, 
            "stage2+=0.3"
        );
        
        // px-only radius: dot → pill (avoid % ↔ px scrub jitter)
        tl.fromTo(
          centerOrbRef.current,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotRadius,
            backgroundColor: "#FFFFFF",
            ...orbCenter,
            y: 0,
          },
          {
            width: fieldWidth,
            height: fieldHeight,
            borderRadius: pillRadius,
            backgroundColor: "#FFFFFF",
            ...orbCenter,
            y: fieldY,
            duration: 1.5,
            ease: "power2.inOut",
          },
          "stage2",
        )
        
        .to(searchFieldRef.current, { opacity: 1, duration: 0.5 }, "stage2+=1.2");

        // Lock pill radius for the entire hold — do not let scrub drift it
        tl.set(centerOrbRef.current, { borderRadius: pillRadius }, "stage2+=1.5");

        tl.to({}, { duration: 1 });

        // =========================================
        // STAGE 3: FIELD MORPHS BACK TO DOT
        // =========================================
        
        // Keep pillRadius locked while shrinking; browser clamps to a circle at dot size
        tl.set(centerOrbRef.current, { borderRadius: pillRadius }, "stage3")
        .to(searchFieldRef.current, { opacity: 0, duration: 0.5 }, "stage3")
        .to(centerOrbRef.current, {
            width: dotSize,
            height: dotSize,
            backgroundColor: "#FFFFFF",
            ...orbCenter,
            y: 0,
            duration: 1,
            ease: "power3.inOut"
        }, "stage3")
        .set(centerOrbRef.current, { borderRadius: dotRadius }, "stage3+=1")
        .to([heading2Ref.current, description2Ref.current], { opacity: 0, y: -150, duration: 1 }, "stage3");

        // =========================================
        // STAGE 4: DOT EXPLODES TO TALLER CARDS WITH HEADING & DESCRIPTION
        // =========================================
        
        const cardWidth = "280px";
        const cardHeight = "320px";
        const heading3Y = -200;
        const description3Y = -200;

        tl.fromTo(heading3Ref.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: heading3Y, duration: 1 },
            "stage4"
        );
        
        tl.fromTo(description3Ref.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: description3Y, duration: 1 },
            "stage4+=0.3"
        );
        
        tl.to(centerOrbRef.current, { width: 30, height: 30, ...orbCenter, duration: 0.2 }, "stage4");

        const cards = gsap.utils.toArray(".feature-card");
        tl.set(cards, { opacity: 1, scale: 0.2 }, "stage4+=0.1")
          .to(centerOrbRef.current, { opacity: 0, duration: 0.1 }, "stage4+=0.2"); 
        
        tl.to(cards, {
            width: cardWidth,
            height: cardHeight,
            borderRadius: "16px",
            backgroundColor: isDark ? "rgba(23, 23, 23, 0.95)" : "rgba(255, 255, 255, 0.95)",
            scale: 1,
            left: (i) => {
                const positions = ["15%", "32.5%", "50%", "67.5%", "85%"];
                return positions[i];
            },
            top: () => "65%",
            xPercent: -50,
            yPercent: -50,
            duration: 1.5,
            stagger: 0.1,
            ease: "expo.out"
        }, "stage4+=0.2");
        
        tl.to(".card-content", { opacity: 1, duration: 0.5 }, "stage4+=1");
      });
    }, containerRef);
    return () => ctx.revert();
  }, [isDark]);

  const circleItems = CIRCLE_ITEMS;

  const bgStyle = theme === "dark" ? dark7MainSurfaceStyle : { backgroundColor: lightColors.background };

  return (
    <main
      ref={containerRef}
      style={bgStyle}
      className="relative min-h-screen overflow-x-hidden transition-colors duration-500 isolate"
    >
      {/* Global dark-page blend at this block’s edges */}
      {theme === "dark" && (
        <>
          <div
            className="absolute inset-x-0 top-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[2]"
            style={{
              background:
                "linear-gradient(to bottom, #162d24 0%, rgba(22,45,36,0) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[2]"
            style={{
              background:
                "linear-gradient(to top, #162d24 0%, rgba(22,45,36,0) 100%)",
            }}
          />
        </>
      )}
      {/* Desktop scroll animation — always mounted so ScrollTrigger pin initializes correctly */}
      <div
        ref={wrapperRef}
        className="relative z-10 hidden h-screen w-full items-center justify-center overflow-hidden lg:flex"
      >
        {/* === HEADINGS === (FAQ scale: 32→40→48→56→64→72→80, font-italiana / playfair, #f3f3f3 / #a0a0a0 / #d0d0d0) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[25] px-4 sm:px-6">
          <div className="text-center">
            {/* STAGE 1 */}
            <h1 ref={heading1Ref} className={`font-italiana font-light text-[22px] sm:text-[28px] md:text-[34px] lg:text-[39px] xl:text-[45px] ${textColor} tracking-[0.01em] leading-[1.1] max-w-5xl transition-colors duration-500`}>
              <span className="font-normal">
                Your business runs on<br />
                systems and data
              </span>
              <br />
              <span className="font-playfair italic font-semibold">
                But they're fragmented,<br />
                manual, and under-utilized
              </span>
            </h1>
          </div>

          {/* STAGE 2 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 ref={heading2Ref} className={`font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] text-center ${textColor} tracking-[0.01em] leading-[1.15] opacity-0 transition-colors duration-500 z-[26] px-4 max-w-4xl`}>
              <span className="font-normal">Design systems that work the<br />way your </span>
              <span className="font-playfair italic font-semibold">business works</span>
            </h1>
            <p ref={description2Ref} className={`font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] ${subtitleColor} opacity-0 max-w-3xl px-6 leading-relaxed transition-colors duration-500 z-[26] text-center mt-8 sm:mt-10 md:mt-12`}>
            Design systems that align with the way your business works. No templates, No assumptions, just systems built around you. Tech Eyrie we tailor AI- powered platforms connecting data, processes and teams into one flexible foundation. No Complexity, No clatter, just a system thoughtfully designed for clarity, speed and growth. 

            </p>
          </div>

          {/* STAGE 3 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 ref={heading3Ref} className={`font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] text-center ${textColor} tracking-[0.01em] leading-[1.15] opacity-0 transition-colors duration-500 z-[26] px-4 max-w-4xl`}>
              <span className="font-normal">We don't jump straight into </span>
              <span className="font-playfair italic font-semibold">building.</span>
            </h1>
            <p ref={description3Ref} className={`font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] ${subtitleColor} opacity-0 max-w-3xl px-6 leading-relaxed transition-colors duration-500 z-[26] text-center mt-8 sm:mt-10 md:mt-12`}>
            Understanding designing and Evolving your business - powered by AI, automation and modern technology.

            </p>
          </div>
        </div>

        {/* === ANIMATION LAYER === */}
        <div className="relative w-full h-full z-10">
            
            {/* GROUP 1: CIRCLE ITEMS */}
            {circleItems.map((item, i) => (
                <React.Fragment key={i}>
                    <div 
                        ref={el => circleBgRefs.current[i] = el}
                        className={`circle-bg absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 ${circleBlobColor} backdrop-blur-xl shadow-xl rounded-xl sm:rounded-2xl z-[5] transition-colors duration-500 border`}
                        style={{
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            ...circleBlobStyle
                        }}
                    />
                    
                    <div 
                        ref={el => circleContentRefs.current[i] = el}
                        className="circle-content absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex flex-col items-center justify-center z-[15] gap-1 sm:gap-2 pointer-events-none px-1"
                        style={{
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)"
                        }}
                    >
                        <span className={`text-[8px] sm:text-[9px] md:text-[12px] font-bold ${subTextColor} text-center leading-tight uppercase tracking-wide`}>
                          {item.text}
                        </span>
                        <img 
                          src={item.barcode}
                          alt=""
                          className="w-10 h-4 sm:w-12 sm:h-5 md:w-14 md:h-6 object-contain"
                        />
                    </div>
                </React.Fragment>
            ))}

            {/* GROUP 2: CENTER ORB / FIELD */}
            <div 
                ref={centerOrbRef}
                className="absolute left-1/2 top-1/2 bg-white z-30 flex items-center justify-center overflow-hidden shadow-2xl"
                style={{ width: '0px', height: '0px', opacity: 0, backgroundColor: '#FFFFFF' }} 
            >
                <div ref={searchFieldRef} className="flex items-center w-full px-3 sm:px-4 md:px-5 lg:px-6 opacity-0">
                  <Search className="!text-black mr-2 sm:mr-3 md:mr-4 shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" color="#000000" size={24} />
                  <span className="font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] !text-black font-normal truncate">Ask anything about your data...</span>
                </div>
            </div>

            {/* GROUP 3: TALLER VERTICAL CARDS - Card Titles 4xl */}
            {FEATURE_CARDS.map((card, i) => (
                <div 
                    key={i}
                    className={`feature-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${cardBg} shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden backdrop-blur-sm z-20 transition-colors duration-500 border`}
                    style={{ width: '0px', height: '0px', opacity: 0, borderRadius: '50%', ...cardBgStyle }}
                >
                    <div className="card-content opacity-0 p-5 sm:p-6 md:p-7 flex flex-col h-full">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${badgeBg} rounded-xl flex items-center justify-center font-bold mb-4 sm:mb-5 shrink-0 text-lg sm:text-xl`} style={badgeBgStyle}>
                            {i+1}
                        </div>
                        <h3 className={`font-italiana font-light text-[18px] sm:text-[20px] md:text-[22px] ${cardTitle} mb-3 sm:mb-4`}>{card.title}</h3>
                        <p className={`font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] leading-relaxed ${cardDesc}`}>{card.desc}</p>
                    </div>
                </div>
            ))}

        </div>

      </div>

      {/* Mobile / tablet static layout */}
      <section className="relative z-10 w-full px-4 sm:px-6 md:px-8 py-14 sm:py-20 md:py-24 lg:hidden">
          <div className="mx-auto flex max-w-2xl flex-col gap-16 sm:gap-20 md:gap-24 lg:max-w-3xl">
            {/* Phase 1 */}
            <div className="space-y-8 sm:space-y-10">
              <div className="text-center">
                <h2 className={`font-italiana font-light text-[26px] sm:text-[32px] md:text-[38px] ${textColor} tracking-[0.01em] leading-[1.12]`}>
                  <span className="font-normal">
                    Your business runs on
                    <br />
                    systems and data
                  </span>
                  <br />
                  <span className="font-playfair italic font-semibold">
                    But they&apos;re fragmented,
                    <br />
                    manual, and under-utilized
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                {circleItems.map((item) => (
                  <div
                    key={item.text}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 sm:px-3 sm:py-4 ${circleBlobColor}`}
                    style={circleBlobStyle}
                  >
                    <span className={`text-[9px] sm:text-[10px] font-bold ${subTextColor} text-center leading-tight uppercase tracking-wide`}>
                      {item.text}
                    </span>
                    <img src={item.barcode} alt="" className="w-10 h-4 sm:w-12 sm:h-5 object-contain opacity-80" />
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 2 */}
            <div className={`space-y-6 sm:space-y-8 border-t pt-14 sm:pt-16 md:pt-20 text-center ${isDark ? "border-white/10" : "border-black/10"}`}>
              <h2 className={`font-italiana font-light text-[24px] sm:text-[30px] md:text-[36px] ${textColor} tracking-[0.01em] leading-[1.15]`}>
                <span className="font-normal">Design systems that work the<br className="hidden sm:block" /> way your </span>
                <span className="font-playfair italic font-semibold">business works</span>
              </h2>
              <p className={`font-merriweather text-[14px] sm:text-[15px] ${subtitleColor} leading-relaxed px-1`}>
                Design systems that align with the way your business works. No templates, no assumptions — just systems built around you. Tech Eyrie tailors AI-powered platforms connecting data, processes and teams into one flexible foundation.
              </p>
              <div className="mx-auto flex h-12 sm:h-14 w-full max-w-md items-center rounded-full bg-white px-4 sm:px-5 shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
                <Search className="mr-3 shrink-0 !text-black w-5 h-5" color="#000000" aria-hidden="true" />
                <span className="font-merriweather text-[13px] sm:text-[14px] !text-black truncate text-left">
                  Ask anything about your data...
                </span>
              </div>
            </div>

            {/* Phase 3 */}
            <div className={`space-y-10 sm:space-y-12 border-t pt-14 sm:pt-16 md:pt-20 ${isDark ? "border-white/10" : "border-black/10"}`}>
              <div className="text-center space-y-4 sm:space-y-5">
                <h2 className={`font-italiana font-light text-[24px] sm:text-[30px] md:text-[36px] ${textColor} tracking-[0.01em] leading-[1.15]`}>
                  <span className="font-normal">We don&apos;t jump straight into </span>
                  <span className="font-playfair italic font-semibold">building.</span>
                </h2>
                <p className={`font-merriweather text-[14px] sm:text-[15px] ${subtitleColor} leading-relaxed px-1`}>
                  Understanding, designing and evolving your business — powered by AI, automation and modern technology.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4">
                {FEATURE_CARDS.map((card, i) => (
                  <article
                    key={card.title}
                    className={`rounded-2xl border p-5 sm:p-6 ${cardBg} shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-sm`}
                    style={cardBgStyle}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl font-bold text-lg ${badgeBg}`}
                        style={badgeBgStyle}
                      >
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-italiana font-light text-[20px] sm:text-[22px] ${cardTitle} mb-2 sm:mb-3`}>
                          {card.title}
                        </h3>
                        <p className={`font-merriweather text-[14px] sm:text-[15px] leading-relaxed ${cardDesc}`}>
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
    </main>
  );
}
