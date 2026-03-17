"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import AnimatedCTAButton from "../useful/buttonstyle";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TestHome = () => {
  const [videoStack, setVideoStack] = useState([0, 1, 2, 3]);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const videoRefs = useRef([]);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroStackRef = useRef(null);
  const portfolioSectionRef = useRef(null);
  const portfolioCardsRef = useRef([]);
  const lenisRef = useRef(null);
  const heroCardsRef = useRef([]);

  // Media assets for the hero stack
  const mediaAssets = [
    {
      type: "image",
      src: "https://www.datocms-assets.com/151374/1741831437-mudwtr.png?auto=format&fit=max&h=2440&lossless=false&q=75&w=2440",
      alt: "MUDWTR brand showcase",
      title: "MUD\\WTR",
      subtitle: "Health & Wellness",
    },
    {
      type: "image",
      src: "https://www.datocms-assets.com/151374/1741910699-cotopaxi_482x858_alternate.png?auto=format&fit=max&h=2440&lossless=false&q=75&w=2440",
      alt: "Cotopaxi brand showcase",
      title: "Cotopaxi",
      subtitle: "Outdoor & Lifestyle",
    },
    {
      type: "video",
      src: "https://stream.mux.com/zaOX00ijKS1dZVZGFpLMjhNOIGbKQ8dmO/medium.mp4",
      alt: "Digital marketing campaign showcase",
      title: "OREO",
      subtitle: "Food & Beverage",
    },
    {
      type: "video",
      src: "https://stream.mux.com/s5S6U18mND3t8caFSka7r7Wrulxm4SAb/medium.mp4",
      alt: "Brand impact visualization",
      title: "Coca-Cola",
      subtitle: "Global Campaigns",
    },
  ];

  // Brand logos for the portfolio section
  const brandLogos = [
    { src: "/stance_logo-bg.png", alt: "Cotopaxi" },
    { src: "/stance_logo-bg.png", alt: "MUD\\WTR" },
    { src: "/stance_logo-bg.png", alt: "OREO" },
    { src: "/stance_logo-bg.png", alt: "Coca-Cola" },
  ];

  // Portfolio items
  const portfolioItems = [
    {
      type: "image",
      title: "MUD\\WTR Campaign",
      src: "https://www.datocms-assets.com/151374/1741831437-mudwtr.png?auto=format&fit=max&h=2440&lossless=false&q=75&w=2440",
      alt: "MUD\\WTR Campaign Image",
      buttons: ["Health & Wellness"],
      link: "/work/mud-wtr",
    },
    {
      type: "image",
      title: "Cotopaxi Branding",
      src: "https://www.datocms-assets.com/151374/1741910699-cotopaxi_482x858_alternate.png?auto=format&fit=max&h=2440&lossless=false&q=75&w=2440",
      alt: "Cotopaxi Branding Image",
      buttons: ["Outdoor & Active Lifestyle", "Fashion & Apparel"],
      link: "/work/cotopaxi",
    },
    {
      type: "video",
      title: "OREO Social Media",
      src: "https://stream.mux.com/zaOX00ijKS1dZVZGFpLMjhNOIGbKQ8dmO/medium.mp4",
      alt: "OREO Social Media Video",
      buttons: ["Food & Beverage", "CPG"],
      link: "/work/oreo",
    },
    {
      type: "video",
      title: "Coca-Cola Ads",
      src: "https://stream.mux.com/s5S6U18mND3t8caFSka7r7Wrulxm4SAb/medium.mp4",
      alt: "Coca-Cola Ads Video",
      buttons: ["Food & Beverage", "CPG"],
      link: "/work/coca-cola",
    },
  ];

  const LOGO_HEIGHT = 112;

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (typeof window !== "undefined") {
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      const raf = (time) => {
        lenisRef.current.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      return () => {
        lenisRef.current?.destroy();
      };
    }
  }, []);

  // GSAP animations with precise scroll-pausing
  // useEffect(() => {
  //   if (
  //     typeof window !== "undefined" &&
  //     heroSectionRef.current &&
  //     heroCardsRef.current.length > 0 &&
  //     portfolioCardsRef.current.length > 0
  //   ) {
  //     const ctx = gsap.context(() => {
  //       const initAnimations = () => {
  //         gsap.set(heroCardsRef.current, {
  //           x: 0,
  //           y: 0,
  //           scale: 1,
  //           rotation: 0,
  //           opacity: 1,
  //         });
  //         gsap.set(portfolioCardsRef.current, {
  //           opacity: 0,
  //           scale: 0.8,
  //         });
  //         gsap.set(portfolioSectionRef.current, {
  //           backgroundColor: "#334238",
  //         });

  //         const portfolioContent =
  //           portfolioSectionRef.current?.querySelectorAll(
  //             ".portfolio-content > *"
  //           );
  //         if (portfolioContent) {
  //           gsap.set(portfolioContent, { y: 30, opacity: 0 });
  //         }

  //         const cardPositions = [];
  //         heroCardsRef.current.forEach((heroCard, index) => {
  //           if (heroCard && portfolioCardsRef.current[index]) {
  //             const portfolioCard = portfolioCardsRef.current[index];
  //             const heroRect = heroCard.getBoundingClientRect();
  //             const portfolioRect = portfolioCard.getBoundingClientRect();
  //             cardPositions[index] = {
  //               xDistance: portfolioRect.left - heroRect.left,
  //               yDistance: portfolioRect.top - heroRect.top,
  //             };
  //           }
  //         });

  //         // KEY CHANGES: `scrub: true` for instantaneous pause.
  //         const tl = gsap.timeline({
  //           scrollTrigger: {
  //             trigger: heroSectionRef.current,
  //             start: "30% top",
  //             endTrigger: portfolioSectionRef.current,
  //             end: "center center",
  //             // `true` creates a 1-to-1 link with the scrollbar. No smoothing.
  //             scrub: true,
  //           },
  //         });

  //         // All animations use `ease: "none"` for linear progression.
  //         heroCardsRef.current.forEach((heroCard, index) => {
  //           if (heroCard && cardPositions[index]) {
  //             tl.fromTo(
  //               heroCard,
  //               { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
  //               {
  //                 x: cardPositions[index].xDistance,
  //                 y: cardPositions[index].yDistance,
  //                 scale: 0.75,
  //                 rotation: 0,
  //                 opacity: 0,
  //                 ease: "none", // No easing, just direct scroll tracking
  //               },
  //               0
  //             );
  //           }
  //         });

  //         tl.fromTo(
  //           portfolioCardsRef.current,
  //           { opacity: 0, scale: 0.8, y: 20 },
  //           { opacity: 1, scale: 1, y: 0, stagger: 0.1, ease: "none" },
  //           0.3
  //         );

  //         tl.fromTo(
  //           portfolioSectionRef.current,
  //           { backgroundColor: "#334238" },
  //           { backgroundColor: "#FFF7ED", ease: "none" },
  //           0
  //         );

  //         if (portfolioContent) {
  //           tl.fromTo(
  //             portfolioContent,
  //             { y: 30, opacity: 0 },
  //             { y: 0, opacity: 1, stagger: 0.1, ease: "none" },
  //             0.5
  //           );
  //         }

  //         ScrollTrigger.refresh();
  //       };

  //       setTimeout(initAnimations, 200);
  //     }, containerRef.current);

  //     return () => {
  //       ctx.revert();
  //     };
  //   }
  // }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      heroSectionRef.current &&
      heroCardsRef.current.length > 0 &&
      portfolioCardsRef.current.length > 0
    ) {
      const ctx = gsap.context(() => {
        const initAnimations = () => {
          // Set initial states
          gsap.set(heroCardsRef.current, {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
          });
          gsap.set(portfolioCardsRef.current, {
            opacity: 0,
            scale: 0.8,
          });
          gsap.set(portfolioSectionRef.current, {
            backgroundColor: "#334238",
          });

          const portfolioContent =
            portfolioSectionRef.current?.querySelectorAll(
              ".portfolio-content > *"
            );
          if (portfolioContent) {
            gsap.set(portfolioContent, { y: 30, opacity: 0 });
          }
          console.log("Noob")
          // Calculate card positions
          const cardPositions = [];
          heroCardsRef.current.forEach((heroCard, index) => {
            if (heroCard && portfolioCardsRef.current[index]) {
              const portfolioCard = portfolioCardsRef.current[index];
              const heroRect = heroCard.getBoundingClientRect();
              const portfolioRect = portfolioCard.getBoundingClientRect();
              cardPositions[index] = {
                xDistance: portfolioRect.left - heroRect.left,
                yDistance: portfolioRect.top - heroRect.top,
              };
            }
          });

          // Create timeline with ScrollTrigger
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: heroSectionRef.current,
              start: "30% top",
              endTrigger: portfolioSectionRef.current,
              end: "center center",
              scrub: 0.5, // Slight smoothing for scroll
              markers: false, // Set to true for debugging
              invalidateOnRefresh: true, // Recalculate on resize
            },
          });

          // Animate hero cards to portfolio positions
          heroCardsRef.current.forEach((heroCard, index) => {
            if (heroCard && cardPositions[index]) {
              tl.to(
                heroCard,
                {
                  x: cardPositions[index].xDistance,
                  y: cardPositions[index].yDistance,
                  scale: 0.75,
                  opacity: 0,
                  ease: "none", // Linear for scroll-based animation
                  duration: 1,
                },
                index * 0.05 // Slight stagger for performance
              );
            }
          });

          // Animate portfolio cards
          tl.to(
            portfolioCardsRef.current,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              stagger: 0.1,
              ease: "none",
              duration: 0.8,
            },
            0.3
          );

          // Animate portfolio section background
          tl.to(
            portfolioSectionRef.current,
            {
              backgroundColor: "#FFF7ED",
              ease: "none",
              duration: 1,
            },
            0
          );

          // Animate portfolio content
          if (portfolioContent) {
            tl.to(
              portfolioContent,
              {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                ease: "none",
                duration: 0.8,
              },
              0.5
            );
          }
        };

        // Initialize after Lenis is ready
        if (lenisRef.current) {
          initAnimations();
          ScrollTrigger.refresh();
        }
      }, containerRef.current);

      return () => {
        ctx.revert();
      };
    }
  }, [lenisRef.current]); // Depend on lenisRef.current

  const handleMediaClick = (clickedIndex) => {
    const newStack = [
      clickedIndex,
      ...videoStack.filter((idx) => idx !== clickedIndex),
    ];
    setVideoStack(newStack);
    if (mediaAssets[clickedIndex].type === "video") {
      setPlayingVideo(clickedIndex);
    } else {
      setPlayingVideo(null);
    }
  };

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video && mediaAssets[index].type === "video") {
        if (index === playingVideo && index === videoStack[0]) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [playingVideo, videoStack]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % brandLogos.length);
    }, 2500);
    return () => clearTimeout(timeoutRef.current);
  }, [currentLogoIndex]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Hero Section */}
      <section
        ref={heroSectionRef}
        className="w-full min-h-screen relative pt-40"
        style={{ backgroundColor: "#334238" }}
      >
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row items-start justify-between min-h-[calc(100vh-8rem)] gap-8 sm:gap-12 lg:gap-16 xl:gap-24">
            {/* Left Column */}
            <div className="flex-1 w-full lg:w-auto text-left z-10">
              <div className="space-y-8 sm:space-y-12 lg:space-y-16">
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  <div>
                    <h1 className="text-white font-black font-['Figtree'] uppercase leading-none tracking-tight text-6xl sm:text-8xl md:text-9xl lg:text-[6rem] xl:text-[8rem] 2xl:text-[10rem]">
                      Genuine.
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-white font-black font-['Figtree'] uppercase leading-none tracking-tight text-6xl sm:text-8xl md:text-9xl lg:text-[6rem] xl:text-[8rem] 2xl:text-[10rem]">
                      Impact.
                    </h1>
                  </div>
                </div>
                <div>
                  <p className="text-white text-lg sm:text-xl lg:text-2xl font-normal font-['Figtree'] leading-relaxed max-w-2xl">
                    We are an industry-leading digital marketing agency
                    partnering with bold brands to drive impact across every
                    stage of the customer journey - maximizing it, measuring it,
                    and repeating it.
                  </p>
                </div>
                <div className="flex flex-col space-y-3 sm:space-y-4">
                  <BrandLogo text="Cotopaxi" />
                  <BrandLogo text="MUD\WTR" isMudWtr />
                  <BrandLogo text="OREO" />
                  <BrandLogo text="Coca-Cola" />
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="flex-1 w-full lg:w-auto flex justify-end z-10">
              <div className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl">
                <div
                  ref={heroStackRef}
                  className="relative w-full aspect-[4/5] rounded-2xl"
                  style={{ perspective: "1000px" }}
                >
                  {videoStack.map((mediaIndex, stackPosition) => (
                    <div
                      key={mediaIndex}
                      ref={(el) => {
                        if (el) heroCardsRef.current[mediaIndex] = el;
                      }}
                      className={`hero-card absolute w-full h-full transition-all duration-500 ease-out cursor-pointer ${
                        stackPosition === 0
                          ? "opacity-100 shadow-2xl scale-100 z-40"
                          : "opacity-80 shadow-lg"
                      }`}
                      style={{
                        transform: `translateX(${
                          stackPosition * 15
                        }px) translateY(${stackPosition * 15}px) translateZ(-${
                          stackPosition * 30
                        }px) scale(${1 - stackPosition * 0.05})`,
                        zIndex: 40 - stackPosition,
                      }}
                      onClick={() => handleMediaClick(mediaIndex)}
                    >
                      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black">
                        {mediaAssets[mediaIndex].type === "image" ? (
                          <Image
                            src={mediaAssets[mediaIndex].src}
                            alt={mediaAssets[mediaIndex].alt}
                            fill
                            className="object-cover"
                            priority={mediaIndex === videoStack[0]}
                          />
                        ) : (
                          <video
                            ref={(el) => (videoRefs.current[mediaIndex] = el)}
                            src={mediaAssets[mediaIndex].src}
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                          <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-white text-xl sm:text-2xl font-bold font-['Figtree'] mb-1">
                              {mediaAssets[mediaIndex].title}
                            </h3>
                            <p className="text-white/80 text-sm font-['Figtree']">
                              {mediaAssets[mediaIndex].subtitle}
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                          <span className="text-white text-xs font-medium font-['Figtree'] uppercase">
                            {mediaAssets[mediaIndex].type}
                          </span>
                        </div>
                        {mediaAssets[mediaIndex].type === "video" &&
                          stackPosition !== 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-white ml-1"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-6 space-x-2">
                  {mediaAssets.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleMediaClick(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === videoStack[0]
                          ? "bg-lime-300 scale-110"
                          : "bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`View ${mediaAssets[index].title}`}
                    />
                  ))}
                </div>
                <div className="text-center mt-4">
                  <p className="text-white/60 text-sm font-['Figtree']">
                    Click any card to bring it to the front
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm font-['Figtree'] text-center">
          <div className="flex flex-col items-center space-y-2">
            <span>Scroll to explore our services</span>
            <svg
              className="w-4 h-6 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section
        ref={portfolioSectionRef}
        className="w-full min-h-screen py-16 sm:py-20 lg:py-24"
        style={{ backgroundColor: "#334238" }}
      >
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 portfolio-content">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-black text-sm font-extrabold font-['Figtree'] uppercase leading-none tracking-tight">
              Selected Work
            </h2>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-16 lg:mb-20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4 xl:gap-6 justify-center">
              <h3 className="text-black font-bold font-['Figtree'] leading-tight text-4xl sm:text-6xl lg:text-8xl text-center lg:text-left">
                Creating impact for
              </h3>
              <div className="hidden lg:flex w-96 h-28 bg-lime-300 rounded-xl overflow-hidden items-center justify-center relative p-0 m-0">
                <div
                  className="flex flex-col transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateY(-${
                      currentLogoIndex * LOGO_HEIGHT
                    }px)`,
                  }}
                >
                  {brandLogos.map((logo, idx) => (
                    <div
                      key={idx}
                      className="w-96 h-28 flex items-center justify-center flex-shrink-0 p-0 m-0"
                      style={{ height: "112px" }}
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={260}
                        height={56}
                        className="object-contain mt-28"
                        priority={idx === 0}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full sm:w-96 h-28 bg-lime-300 rounded-xl overflow-hidden flex items-center justify-center relative lg:hidden mx-auto p-0 m-0">
              <div
                className="flex flex-col transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateY(-${currentLogoIndex * LOGO_HEIGHT}px)`,
                }}
              >
                {brandLogos.map((logo, idx) => (
                  <div
                    key={idx}
                    className="w-full h-28 flex items-center justify-center flex-shrink-0 p-0 m-0"
                    style={{ height: "112px" }}
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={260}
                      height={56}
                      className="object-contain mt-28"
                      priority={idx === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {portfolioItems.map((item, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) portfolioCardsRef.current[index] = el;
                }}
                className="portfolio-card"
              >
                <PortfolioCard item={item} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16">
          <AnimatedCTAButton />
        </div>
      </section>
    </div>
  );
};

function PortfolioCard({ item }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-300 bg-orange-50">
      <Link
        href={item.link || "#"}
        tabIndex={0}
        className="block focus:outline-none"
      >
        <div className="relative w-full h-[500px]">
          {item.type === "image" ? (
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <video
              src={item.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      </Link>
      <div className="p-6 sm:p-8 bg-orange-50 min-h-[120px] flex flex-col justify-between">
        <h3 className="text-neutral-800 font-bold font-['Figtree'] uppercase text-lg sm:text-xl mb-2 line-clamp-2">
          {item.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {item.buttons.map((button, btnIndex) => (
            <button
              key={btnIndex}
              className="bg-transparent border border-black rounded-full px-4 py-1 text-neutral-800 font-normal font-['Figtree'] leading-relaxed"
              style={{ fontSize: "14px" }}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const BrandLogo = ({ text, isMudWtr = false }) => {
  return (
    <div className="relative overflow-hidden h-4 group cursor-pointer max-w-fit">
      <style jsx>{`
        @keyframes leftToRightColor {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        .mudwtr-animate {
          background: linear-gradient(to right, #587c5e 50%, #ffffff 50%);
          background-size: 200% 100%;
          background-position: 0% 50%;
          animation: leftToRightColor 5s ease-in-out forwards;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
      <div className="relative flex items-center">
        {isMudWtr ? (
          <span className="mudwtr-animate text-sm font-extrabold font-['Figtree'] uppercase leading-none">
            {text}
          </span>
        ) : (
          <>
            <span className="text-[#587C5E] text-sm font-extrabold font-['Figtree'] uppercase leading-none transition-all duration-300 group-hover:text-transparent">
              {text}
            </span>
            <span className="absolute left-0 text-white text-sm font-extrabold font-['Figtree'] uppercase leading-none transition-all duration-300 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
              {text}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default TestHome;
