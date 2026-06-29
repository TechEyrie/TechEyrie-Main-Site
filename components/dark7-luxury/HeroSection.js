"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection({ theme = "light" }) {
  // --- Color Palettes (Memoized to prevent re-renders) ---
  const lightColors = useMemo(
    () => ({
      primary: "#013825",
      secondary: "#9E8F72",
      tertiary: "#CEC8B0",
      background: "#F9F7F0",
      noiseOverlay: "rgba(200, 200, 200, 0.3)",
      text: "#111111",
      paginationActive: "#013825",
      paginationInactive: "black/30",
    }),
    [],
  );

  const darkColors = useMemo(
    () => ({
      primary: "#c8c4bc",
      secondary: "#b0bab4",
      tertiary: "#2a5c48",
      background: "#2b2b2b",
      noiseOverlay: "rgba(60, 60, 60, 0.3)",
      text: "white",
      paginationActive: "#c8c4bc",
      paginationInactive: "white/30",
    }),
    [],
  );

  // --- Refs & State ---
  const containerRef = useRef(null);
  const heroSectionRef = useRef(null);
  const titleContainerRef = useRef(null);
  const heroCardsContainerRef = useRef(null);
  const portfolioSectionRef = useRef(null);
  const heroCardsRef = useRef([]);
  const portfolioCardPlaceholdersRef = useRef([]);
  const autoRotateIntervalRef = useRef(null);
  const autoTriangleIntervalRef = useRef(null);
  const portfolioCardTriangleIntervals = useRef({});

  // SEPARATE triangle state for each card
  const [cardTriangles, setCardTriangles] = useState({});
  const [portfolioTriangles, setPortfolioTriangles] = useState([]);
  const [portfolioCardTriangles, setPortfolioCardTriangles] = useState({});
  const triangleIdRef = useRef(0);
  const portfolioTriangleIdRef = useRef(0);
  const portfolioCardTriangleIdRef = useRef(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [screenSize, setScreenSize] = useState("mobile");
  const [activeCard, setActiveCard] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredHeroCard, setHoveredHeroCard] = useState(null);
  const [activeArrows, setActiveArrows] = useState(0);
  const [hoveredBottomSection, setHoveredBottomSection] = useState(null);
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredPortfolioCard, setHoveredPortfolioCard] = useState(null);
  const [cardWidth, setCardWidth] = useState(220);
  const [portfolioCardWidth, setPortfolioCardWidth] = useState(300);
  const [heroStackOffset, setHeroStackOffset] = useState(100);

  // --- Data (Memoized to prevent re-renders) ---
  const mediaAssets = useMemo(
    () => [
      {
        type: "image",
        src: "https://www.datocms-assets.com/151374/1741831437-mudwtr.png?auto=format&fit=max&h=2440&lossless=false&q=75&w=2440",
        alt: "MUD\\WTR brand showcase",
        title: "MUD\\WTR",
        subtitle: "Health & Wellness",
        metric: "+35% Conversion Rate",
        buttons: ["Health & Wellness"],
        link: "/work/mud-wtr",
      },
      {
        type: "image",
        src: "https://www.datocms-assets.com/151374/1741910699-cotopaxi_482x858_alternate.png?auto=format&fit=max&h=2440&lossless=false&q=75&w=2440",
        alt: "Cotopaxi brand showcase",
        title: "Cotopaxi",
        subtitle: "Outdoor & Lifestyle",
        metric: "+20% Marketing Efficiency",
        buttons: ["Outdoor & Active Lifestyle", "Fashion & Apparel"],
        link: "/work/cotopaxi",
      },
      {
        type: "video",
        src: "https://stream.mux.com/zaOX00ijKS1dZVZGFpLMjhNOIGbKQ8dmO/medium.mp4",
        alt: "Digital marketing campaign showcase",
        title: "OREO",
        subtitle: "Food & Beverage",
        metric: "+45% Engagement",
        buttons: ["Food & Beverage", "CPG"],
        link: "/work/oreo",
      },
      {
        type: "video",
        src: "https://stream.mux.com/s5S6U18mND3t8caFSka7r7Wrulxm4SAb/medium.mp4",
        alt: "Brand impact visualization",
        title: "Coca-Cola",
        subtitle: "Global Campaigns",
        metric: "+60% Brand Awareness",
        buttons: ["Food & Beverage", "CPG"],
        link: "/work/coca-cola",
      },
    ],
    [],
  );

  // ✅ Calculate card sizes based on screen width
  const calculateCardSizes = useCallback((width) => {
    // Hero card sizes (smaller)
    let heroWidth;
    if (width >= 1920) {
      heroWidth = 260; // 2xl+
    } else if (width >= 1536) {
      heroWidth = 240; // xl
    } else if (width >= 1280) {
      heroWidth = 210; // lg-xl
    } else if (width >= 1024) {
      heroWidth = 190; // lg
    } else {
      heroWidth = 180; // fallback
    }

    // Portfolio card sizes (larger - scales up from hero)
    let portfolioWidth;
    if (width >= 1920) {
      portfolioWidth = 360; // 2xl+
    } else if (width >= 1536) {
      portfolioWidth = 330; // xl
    } else if (width >= 1280) {
      portfolioWidth = 290; // lg-xl
    } else if (width >= 1024) {
      portfolioWidth = 260; // lg
    } else {
      portfolioWidth = 240; // fallback
    }

    return { heroWidth, portfolioWidth };
  }, []);

  // --- Track scroll position ---
  useEffect(() => {
    const handleScroll = () => {
      const hero = heroSectionRef.current;
      if (!hero) return;
      try {
        const heroBottom = hero.getBoundingClientRect().bottom;
        const heroTop = hero.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        const inHero = heroBottom > windowHeight * 0.3;
        setIsInHeroSection(inHero);

        const scrollingDown = heroTop < 0;
        setIsScrolling(scrollingDown);
      } catch (_) {}
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Auto-rotate cards ---
  useEffect(() => {
    if (isInHeroSection && !isScrolling) {
      autoRotateIntervalRef.current = setInterval(() => {
        setActiveCard((prev) => (prev + 1) % mediaAssets.length);
      }, 3000);
    } else {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
        autoRotateIntervalRef.current = null;
      }
    }

    return () => {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
      }
    };
  }, [mediaAssets.length, isInHeroSection, isScrolling]);

  // CLEAR triangles when active card changes
  useEffect(() => {
    setCardTriangles({});
  }, [activeCard]);

  // --- Animate cards ---
  useEffect(() => {
    if (heroCardsRef.current.length === 0) return;

    heroCardsRef.current.forEach((card, index) => {
      if (!card) return;

      const offset = isDesktop ? heroStackOffset : 30;

      if (index === activeCard) {
        gsap.to(card, {
          x: 0,
          scale: 1,
          zIndex: 100,
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        let newIndex;
        if (index < activeCard) {
          newIndex = mediaAssets.length - activeCard + index;
        } else {
          newIndex = index - activeCard;
        }

        gsap.to(card, {
          x: newIndex * offset,
          scale: 1 - newIndex * 0.05,
          zIndex: 50 - newIndex,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
  }, [activeCard, isDesktop, mediaAssets.length, heroStackOffset]);

  const handleCardClick = useCallback(
    (clickedIndex) => {
      if (clickedIndex === activeCard) return;

      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
      }

      setActiveCard(clickedIndex);

      setTimeout(() => {
        if (isInHeroSection && !isScrolling) {
          autoRotateIntervalRef.current = setInterval(() => {
            setActiveCard((prev) => (prev + 1) % mediaAssets.length);
          }, 3000);
        }
      }, 5000);
    },
    [activeCard, mediaAssets.length, isInHeroSection, isScrolling],
  );

  const scrollToPortfolio = useCallback(() => {
    if (portfolioSectionRef.current) {
      portfolioSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveArrows((prev) => {
        if (prev >= 4) return 0;
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // ✅ Update card sizes on resize
  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      const desktop = width >= 1024;
      setIsDesktop(desktop);

      if (width < 640) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else if (width < 1440) {
        setScreenSize("laptop");
      } else {
        setScreenSize("desktop");
      }

      // Calculate responsive card sizes
      const sizes = calculateCardSizes(width);
      setCardWidth(sizes.heroWidth);
      setPortfolioCardWidth(sizes.portfolioWidth);
      // Smaller stack offset on laptop/small desktop so 4th card doesn't overflow right
      if (width >= 1280) {
        setHeroStackOffset(100);
      } else if (width >= 1024) {
        setHeroStackOffset(56);
      } else {
        setHeroStackOffset(100); // only used when isDesktop, fallback
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [calculateCardSizes]);

  // --- Electrical Animation (NO INTERVAL - ONLY ON VIEWPORT ENTRY) ---
  const triggerElectricalAnimation = useCallback(() => {
    const titleLines = document.querySelectorAll(".hero-main-title-line");
    const originalColor = theme === "dark" ? "#f3f3f3" : "#111111";
    const electricColor = theme === "dark" ? "#c8c4bc" : "#2a5c48";
    const brightElectricColor = theme === "dark" ? "#FFFFFF" : "#FFFFFF";

    const tl = gsap.timeline();

    titleLines.forEach((line, index) => {
      tl.to(
        line,
        {
          color: brightElectricColor,
          duration: 0.1,
          ease: "power2.out",
        },
        index * 0.2,
      )
        .to(line, {
          color: electricColor,
          duration: 0.15,
          ease: "sine.inOut",
        })
        .to(line, {
          color: originalColor,
          duration: 0.25,
          ease: "power2.in",
        });
    });
  }, [theme]);

  // --- GSAP Scroll Animation ---
  useLayoutEffect(() => {
    if (
      !isDesktop ||
      !heroCardsContainerRef.current ||
      !portfolioSectionRef.current
    )
      return;

    const ctx = gsap.context(() => {
      // Title animation with electrical effect on enter/re-enter
      gsap.fromTo(
        ".hero-main-title-line",
        { opacity: 0, y: 60, skewY: 4 },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          transformOrigin: "top left",
          scrollTrigger: {
            trigger: titleContainerRef.current,
            start: "top 85%",
            end: "bottom 20%",
            onEnter: () => {
              setTimeout(() => {
                triggerElectricalAnimation();
              }, 1000);
            },
            onEnterBack: () => {
              setTimeout(() => {
                triggerElectricalAnimation();
              }, 500);
            },
          },
        },
      );

      gsap.from(".hero-badge", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".hero-body", {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
        stagger: 0.08,
      });

      setTimeout(() => {
        mediaAssets.forEach((_, index) => {
          const heroCard = heroCardsRef.current[index];
          const placeholder = portfolioCardPlaceholdersRef.current[index];

          if (!heroCard || !placeholder) return;

          const overlay = heroCard.querySelector(".card-overlay");

          ScrollTrigger.create({
            trigger: heroSectionRef.current,
            start: "top top",
            end: "50% top",
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress;

              // Track scroll progress for pagination dots
              setScrollProgress(progress);

              const heroContainer = heroCardsContainerRef.current;
              if (!heroContainer || !placeholder) return;
              const heroContainerRect = heroContainer.getBoundingClientRect();
              const placeholderRect = placeholder.getBoundingClientRect();

              const stackOffset = index * heroStackOffset;
              const heroStartX = heroContainerRect.left + stackOffset;
              const heroStartY = heroContainerRect.top;

              const heroWidth = heroContainerRect.width;
              const heroHeight = heroContainerRect.height;
              const targetWidth = placeholderRect.width;
              const targetHeight = placeholderRect.height;

              const scaleX = targetWidth / heroWidth;
              const scaleY = targetHeight / heroHeight;
              const targetScale = Math.min(scaleX, scaleY);
              const startScale = 1 - index * 0.05;
              const currentScale =
                startScale + (targetScale - startScale) * progress;

              // Calculate scaled dimensions for proper centering
              const scaledWidth = heroWidth * currentScale;
              const scaledHeight = heroHeight * currentScale;

              // Center the card within the placeholder
              const offsetX = (targetWidth - scaledWidth) / 2;
              const offsetY = (targetHeight - scaledHeight) / 2;

              const targetX = placeholderRect.left + offsetX;
              const targetY = placeholderRect.top + offsetY;

              const deltaX = targetX - heroStartX;
              const deltaY = targetY - heroStartY;

              // Small horizontal fine‑tune so the hero card
              // lines up perfectly over the portfolio card
              const horizontalNudge = 0; // tweak (e.g. 2 or -2) if needed

              gsap.set(heroCard, {
                x: stackOffset + deltaX * progress + horizontalNudge * progress,
                y: deltaY * progress,
                scale: currentScale,
              });

              if (overlay) {
                gsap.set(overlay, {
                  opacity: 1 - progress,
                });
              }
            },
          });
        });
      }, 500);
    }, containerRef.current);

    return () => ctx.revert();
  }, [isDesktop, screenSize, mediaAssets, triggerElectricalAnimation, heroStackOffset]);



  









  // --- Mobile: Trigger electrical animation once on mount ---
  useEffect(() => {
    if (!isDesktop) {
      const timer = setTimeout(() => {
        triggerElectricalAnimation();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [triggerElectricalAnimation, isDesktop]);

  // --- Create triangle for ACTIVE CARD ONLY ---
  const createTriangleForCard = useCallback(
    (cardIndex, x, y) => {
      const id = triangleIdRef.current++;
      const size = Math.random() * 10 + 15; // SMALL triangles: 15-25px
      const rotation = Math.random() * 360;
      const greenShades =
        theme === "dark"
          ? ["#c8c4bc", "#b0bab4", "#c8c4bc", "#2a5c48"]
          : [lightColors.primary, lightColors.secondary, lightColors.tertiary];
      const color = greenShades[Math.floor(Math.random() * greenShades.length)];

      setCardTriangles((prev) => ({
        ...prev,
        [cardIndex]: [
          ...(prev[cardIndex] || []),
          { id, x, y, size, rotation, color },
        ],
      }));

      setTimeout(() => {
        setCardTriangles((prev) => ({
          ...prev,
          [cardIndex]: (prev[cardIndex] || []).filter((t) => t.id !== id),
        }));
      }, 1050);
    },
    [theme, lightColors],
  );

  // --- Create triangle for PORTFOLIO HERO CARDS (same cards, different section) ---
  const createTriangleForPortfolioCard = useCallback(
    (cardIndex, x, y) => {
      const id = portfolioCardTriangleIdRef.current++;
      const size = Math.random() * 10 + 15; // SMALL triangles: 15-25px
      const rotation = Math.random() * 360;
      const greenShades =
        theme === "dark"
          ? ["#c8c4bc", "#b0bab4", "#c8c4bc", "#2a5c48"]
          : [lightColors.primary, lightColors.secondary, lightColors.tertiary];
      const color = greenShades[Math.floor(Math.random() * greenShades.length)];

      setPortfolioCardTriangles((prev) => ({
        ...prev,
        [cardIndex]: [
          ...(prev[cardIndex] || []),
          { id, x, y, size, rotation, color },
        ],
      }));

      setTimeout(() => {
        setPortfolioCardTriangles((prev) => ({
          ...prev,
          [cardIndex]: (prev[cardIndex] || []).filter((t) => t.id !== id),
        }));
      }, 1050);
    },
    [theme, lightColors],
  );

  const createPortfolioTriangle = useCallback(
    (x, y) => {
      const id = portfolioTriangleIdRef.current++;
      const size = Math.random() * 10 + 15; // SMALL triangles: 15-25px
      const rotation = Math.random() * 360;
      const greenShades =
        theme === "dark"
          ? ["#c8c4bc", "#b0bab4", "#c8c4bc", "#2a5c48"]
          : [lightColors.primary, lightColors.secondary, lightColors.tertiary];
      const color = greenShades[Math.floor(Math.random() * greenShades.length)];
      setPortfolioTriangles((prev) => [
        ...prev,
        { id, x, y, size, rotation, color },
      ]);
      setTimeout(
        () => setPortfolioTriangles((prev) => prev.filter((t) => t.id !== id)),
        1050,
      );
    },
    [theme, lightColors],
  );

  // --- AUTO TRIANGLES for ACTIVE CARD in HERO ---
  useEffect(() => {
    if (autoTriangleIntervalRef.current) {
      clearInterval(autoTriangleIntervalRef.current);
    }

    if (!isInHeroSection || isScrolling) return;

    const activeCardElement = heroCardsRef.current[activeCard];
    if (!activeCardElement) return;

    autoTriangleIntervalRef.current = setInterval(() => {
      const card = heroCardsRef.current?.[activeCard];
      if (!card) return;
      const cardRect = card.getBoundingClientRect();

      if (cardRect.width > 0 && cardRect.height > 0) {
        const randomX = Math.random() * cardRect.width;
        const randomY = Math.random() * cardRect.height;

        createTriangleForCard(activeCard, randomX, randomY);
      }
    }, 200);

    return () => {
      if (autoTriangleIntervalRef.current) {
        clearInterval(autoTriangleIntervalRef.current);
      }
    };
  }, [createTriangleForCard, isInHeroSection, isScrolling, activeCard]);

  // --- AUTO TRIANGLES for HOVERED HERO CARD when in PORTFOLIO SECTION ---
  useEffect(() => {
    // Clear all intervals
    Object.keys(portfolioCardTriangleIntervals.current).forEach((key) => {
      clearInterval(portfolioCardTriangleIntervals.current[key]);
    });
    portfolioCardTriangleIntervals.current = {};

    // Only when NOT in hero section AND hovering a card
    if (hoveredPortfolioCard !== null && !isInHeroSection) {
      const cardElement = heroCardsRef.current[hoveredPortfolioCard];
      
      if (!cardElement) return;

      portfolioCardTriangleIntervals.current[hoveredPortfolioCard] = setInterval(() => {
        const card = heroCardsRef.current?.[hoveredPortfolioCard];
        if (!card) return;
        const cardRect = card.getBoundingClientRect();

        if (cardRect.width > 0 && cardRect.height > 0) {
          const randomX = Math.random() * cardRect.width;
          const randomY = Math.random() * cardRect.height;

          createTriangleForPortfolioCard(hoveredPortfolioCard, randomX, randomY);
        }
      }, 200);
    }

    return () => {
      Object.keys(portfolioCardTriangleIntervals.current).forEach((key) => {
        clearInterval(portfolioCardTriangleIntervals.current[key]);
      });
    };
  }, [hoveredPortfolioCard, isInHeroSection, createTriangleForPortfolioCard]);

  // --- Portfolio triangles ---
  // useEffect(() => {
  //   const section = portfolioSectionRef.current;
  //   if (!section) return;
  //   let lastTime = 0;
  //   const handleMouseMove = (e) => {
  //     if (isInHeroSection) return;

  //     const currentTime = Date.now();
  //     if (currentTime - lastTime < 300) return;
  //     lastTime = currentTime;
  //     const rect = section.getBoundingClientRect();
  //     // createPortfolioTriangle(e.clientX - rect.left, e.clientY - rect.top);
  //   };
  //   section.addEventListener("mousemove", handleMouseMove);
  //   return () => section.removeEventListener("mousemove", handleMouseMove);
  // }, [createPortfolioTriangle, isInHeroSection]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes triangle-fade {
        0% { opacity: 0.7; transform: translate(-50%, -50%) scale(1) rotate(var(--rotation)); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5) rotate(var(--rotation)); }
      }
      .animate-triangle-fade { animation: triangle-fade 1.05s ease-out forwards; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const bgStyle = useMemo(
    () =>
      theme === "dark"
        ? {
            backgroundColor: darkColors.background,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          }
        : {
            backgroundColor: lightColors.background,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          },
    [theme, darkColors, lightColors],
  );

  const getBottomPadding = () => {
    if (screenSize === "laptop") return "0px";
    if (screenSize === "desktop") return "0px";
    return "0px";
  };

  const TriangleSVG = ({ triangle }) => (
    <div
      className="absolute animate-triangle-fade pointer-events-none"
      style={{
        left: `${triangle.x}px`,
        top: `${triangle.y}px`,
        width: `${triangle.size}px`,
        height: `${triangle.size}px`,
        "--rotation": `${triangle.rotation}deg`,
        opacity: 0.7,
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `translate(-50%, -50%) rotate(${triangle.rotation}deg)`,
        }}
      >
        <path
          d="M50 10 L90 90 L10 90 Z"
          fill={triangle.color}
        />
      </svg>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full">
      <section
        ref={heroSectionRef}
        className="relative overflow-visible pt-32 md:pt-40 pb-0 min-h-screen"
        style={{
          ...bgStyle,
          paddingBottom: getBottomPadding(),
        }}
      >
        <div className="relative z-10 mx-auto max-w-[1800px] px-4 md:px-6 lg:px-10 min-h-[calc(100vh-12rem)] flex flex-col justify-between pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8 lg:gap-12 xl:gap-16 items-start">
            <div className="flex flex-col">
              <div
                className="max-w-full lg:max-w-[1600px] xl:max-w-[1800px]"
                ref={titleContainerRef}
              >
                <div className="hero-badge mb-10 flex items-center gap-3 mb-16">
                  <span
                    className="inline-flex h-5 w-5 rounded-sm"
                    style={{
                      backgroundColor:
                        theme === "dark"
                          ? darkColors.primary
                          : lightColors.primary,
                    }}
                  />
                  <span
                    className={`font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"}`}
                  >
                    B2B marketing agency
                  </span>
                </div>

                <h1 className="mb-4 font-italiana tracking-[-0.03em]">
                  <span
                    className={`hero-main-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.05] whitespace-nowrap ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"}`}
                  >
                    <span className="font-light">We build </span>
                    <span className="font-playfair italic text-[0.94em] tracking-[0.03em]">
                      high‑performing
                    </span>
                  </span>

                  <span
                    className={`hero-main-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] leading-[1.05] font-light whitespace-nowrap -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem] ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"}`}
                  >
                    marketing engines for
                  </span>

                  <span
                    className={`hero-main-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] leading-[1.05] font-light whitespace-nowrap ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"}`}
                  >
                    B2B brands
                  </span>
                </h1>
              </div>

              <div className="hero-body max-w-full lg:max-w-[640px] pt-20">
                <p
                  className={`mb-9 font-playfair text-[17px] md:text-[25px] font-normal leading-relaxed ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"}`}
                >
                  We build, optimize and scale marketing engines that generate
                  pipeline and improve marketing ROI.
                </p>

                <Link
                  href="#discover"
                  className="inline-flex items-center gap-3 group"
                >
                  <span
                    className={`font-[Helvetica_Now_Text,Helvetica,Arial,sans-serif] text-[16px] md:text-[20px] font-bold tracking-tight ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"}`}
                  >
                    Discover more
                  </span>
                  <span
                    className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[4px] transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-[1px]"
                    style={{
                      backgroundColor:
                        theme === "dark"
                          ? darkColors.primary
                          : lightColors.primary,
                    }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-y-3 group-hover:opacity-0">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 14 14"
                        aria-hidden="true"
                      >
                        <path
                          d="M7 1V13M7 13L3 9M7 13L11 9"
                          fill="none"
                          stroke={theme === "dark" ? "#212121" : "#F9FAF5"}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center translate-y-[-12px] opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        aria-hidden="true"
                      >
                        <path
                          d="M7 1V13M7 13L3 9M7 13L11 9"
                          fill="none"
                          stroke={
                            theme === "dark" ? "#212121" : darkColors.primary
                          }
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* ✅ HERO SECTION CARDS - RESPONSIVE SIZING (extra right padding so last card stays inside) */}
          {isDesktop ? (
            <div
              className="flex justify-end items-end mb-0 pr-48 lg:pr-56 xl:pr-64 2xl:pr-72"
              style={{ transform: "translateY(-95%)" }}
            >
              <div
                ref={heroCardsContainerRef}
                style={{ width: `${cardWidth}px` }}
              >
                <div
                  className="relative w-full aspect-[3/4]"
                  style={{ perspective: "1000px" }}
                >
                  {mediaAssets.map((asset, index) => (
                    <div
                      key={index}
                      ref={(el) => {
                        if (el) heroCardsRef.current[index] = el;
                      }}
                      className="absolute w-full h-full cursor-pointer shadow-lg rounded-xl overflow-hidden"
                      style={{
                        zIndex: 50 - index,
                        transform: `translateX(${index * heroStackOffset}px) scale(${1 - index * 0.05})`,
                      }}
                      onClick={() => handleCardClick(index)}
                      onMouseEnter={() => setHoveredPortfolioCard(index)}
                      onMouseLeave={() => setHoveredPortfolioCard(null)}
                    >
                      <div className="card-inner-content relative w-full h-full overflow-hidden rounded-xl">
                        <div className="absolute inset-0 z-10">
                          {asset.type === "image" ? (
                            <Image
                              src={asset.src}
                              alt={asset.alt}
                              fill
                              className="object-cover rounded-xl"
                            />
                          ) : (
                            <video
                              src={asset.src}
                              muted
                              loop
                              playsInline
                              autoPlay
                              className="w-full h-full object-cover rounded-xl"
                            />
                          )}
                        </div>

                        <div className="card-overlay absolute inset-0 z-15 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none">
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-black text-sm font-merriweather font-bold mb-1">
                              {asset.title}
                            </h3>
                            <p className="text-black/80 text-xs">
                              {asset.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* TRIANGLES - For HERO active card IN HERO SECTION */}
                        {isInHeroSection && index === activeCard && cardTriangles[index] && (
                          <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden rounded-xl">
                            {cardTriangles[index].map((triangle) => (
                              <TriangleSVG
                                key={triangle.id}
                                triangle={triangle}
                              />
                            ))}
                          </div>
                        )}

                        {/* TRIANGLES - For same HERO card when hovered IN PORTFOLIO SECTION */}
                        {!isInHeroSection && hoveredPortfolioCard === index && portfolioCardTriangles[index] && (
                          <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden rounded-xl">
                            {portfolioCardTriangles[index].map((triangle) => (
                              <TriangleSVG
                                key={triangle.id}
                                triangle={triangle}
                              />
                            ))}
                          </div>
                        )}

                        <div
                          className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 pointer-events-none overflow-visible ${(!isScrolling && isInHeroSection) || (hoveredPortfolioCard === index && !isInHeroSection) ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
                          style={{ height: "22%" }}
                        >
                          <svg
                            className="absolute bottom-0 left-0 w-full h-full"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="
                                M 0 100
                                L 46 15
                                A 5 5 0 0 1 54 15
                                L 100 100
                                Z
                              "
                              fill="#74f5a1"
                            />
                          </svg>

                          <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 flex flex-col items-center">
                            <h3 className="text-[#013825] font-medium text-[9px] sm:text-[10px] mb-0.5">
                              {asset.title}
                            </h3>
                            <p className="text-[#013825] text-[8px] sm:text-[9px] font-medium">
                              {asset.metric}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div 
                  className="flex justify-center mt-4 space-x-2 transition-opacity duration-300"
                  style={{
                    opacity: scrollProgress > 0.05 ? 0 : 1,
                    pointerEvents: scrollProgress > 0.05 ? 'none' : 'auto'
                  }}
                >
                  {mediaAssets.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleCardClick(index)}
                      className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{
                        backgroundColor:
                          index === activeCard
                            ? theme === "dark"
                              ? darkColors.paginationActive
                              : lightColors.paginationActive
                            : theme === "dark"
                              ? darkColors.paginationInactive
                              : lightColors.paginationInactive,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center mt-8 mb-0">
              <div
                ref={heroCardsContainerRef}
                className="w-[140px] sm:w-[180px]"
              >
                <div
                  className="relative w-full aspect-[3/4]"
                  style={{ perspective: "1000px" }}
                >
                  {mediaAssets.map((asset, index) => (
                    <div
                      key={index}
                      ref={(el) => {
                        if (el) heroCardsRef.current[index] = el;
                      }}
                      className="absolute w-full h-full cursor-pointer shadow-lg rounded-xl overflow-hidden"
                      style={{
                        zIndex: 50 - index,
                        transform: `translateX(${index * 30}px) scale(${1 - index * 0.05})`,
                      }}
                      onClick={() => handleCardClick(index)}
                    >
                      <div className="card-inner-content relative w-full h-full overflow-hidden rounded-xl">
                        <div className="absolute inset-0 z-10">
                          {asset.type === "image" ? (
                            <Image
                              src={asset.src}
                              alt={asset.alt}
                              fill
                              className="object-cover rounded-xl"
                            />
                          ) : (
                            <video
                              src={asset.src}
                              muted
                              loop
                              playsInline
                              autoPlay
                              className="w-full h-full object-cover rounded-xl"
                            />
                          )}
                        </div>

                        <div className="card-overlay absolute inset-0 z-15 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none">
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-black text-[11px] font-bold mb-1">
                              {asset.title}
                            </h3>
                            <p className="text-black/80 text-[9px]">
                              {asset.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* TRIANGLES - ONLY FOR ACTIVE CARD MOBILE */}
                        {index === activeCard && cardTriangles[index] && (
                          <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden rounded-xl">
                            {cardTriangles[index].map((triangle) => (
                              <TriangleSVG
                                key={triangle.id}
                                triangle={triangle}
                              />
                            ))}
                          </div>
                        )}

                        <div
                          className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 pointer-events-none overflow-visible ${!isScrolling ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
                          style={{ height: "22%" }}
                        >
                          <svg
                            className="absolute bottom-0 left-0 w-full h-full"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="
                                M 0 100
                                L 46 15
                                A 5 5 0 0 1 54 15
                                L 100 100
                                Z
                              "
                              fill="#74f5a1"
                            />
                          </svg>

                          <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center">
                            <h3 className="text-[#013825] font-medium text-[8px] mb-0.5">
                              {asset.title}
                            </h3>
                            <p className="text-[#013825] text-[7px] font-medium">
                              {asset.metric}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-4 space-x-2">
                  {mediaAssets.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleCardClick(index)}
                      className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{
                        backgroundColor:
                          index === activeCard
                            ? theme === "dark"
                              ? darkColors.paginationActive
                              : lightColors.paginationActive
                            : theme === "dark"
                              ? darkColors.paginationInactive
                              : lightColors.paginationInactive,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`absolute z-20 ${isDesktop ? "left-1/2 -translate-x-1/2 bottom-[calc(20rem*1.2)]" : "left-4 sm:left-6 md:left-8 bottom-8 sm:bottom-12 md:bottom-4"}`}
        >
          <button
            onClick={scrollToPortfolio}
            className="flex flex-col gap-[-2px] cursor-pointer group hover:scale-110 transition-transform duration-300"
            aria-label="Scroll to next section"
          >
            {[0, 1, 2, 3].map((index) => {
              const isActive = 3 - index < activeArrows;

              return (
                <svg
                  key={index}
                  className="w-6 h-6 md:w-6 md:h-6 transition-colors duration-300 -my-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    color: isActive ? "#FCD34D" : "#92400E",
                  }}
                >
                  <path
                    d="M7 10L12 15L17 10"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              );
            })}
          </button>
        </div>
      </section>

      <section
        ref={portfolioSectionRef}
        className="w-full min-h-screen py-0 relative -mt-[20vh]"
        style={bgStyle}
      >
        {/* {portfolioTriangles.map((triangle) => (
          <TriangleSVG key={triangle.id} triangle={triangle} />
        ))} */}

        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <p
              className={`font-merriweather text-sm sm:text-base md:text-lg mb-12 ${theme === "dark" ? "text-white/70" : "text-[#111111]/70"}`}
            >
              Lorem Ipsum
            </p>

            <h2
              className={`font-italiana text-3xl sm:text-4xl md:text-5xl lg:text-7xl ${theme === "dark" ? "text-white" : "text-[#111111]"}`}
            >
              <span className="font-light">Creating impact for </span>
              <span className="italic bg-black text-white px-3 py-1.5 rounded-xl font-playfair font-semibold">
                businesses in Qatar
              </span>
            </h2>
          </div>

          {/* ✅ PORTFOLIO GRID - RESPONSIVE SIZING */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaAssets.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="relative"
                  style={{
                    width: isDesktop ? `${portfolioCardWidth}px` : '85%',
                    
                  }}
                >
                  <div 
                    className="absolute rounded-xl transition-all duration-300 pointer-events-none"
                    style={{
                      top: 0,
                      left: 0,
                      right: 0,
                      height: hoveredBottomSection === index 
                        ? `calc(${portfolioCardWidth * 1.33}px + 170px)` 
                        : `${portfolioCardWidth * 1.33}px`,
                      backgroundColor: '#015b4f',
                      opacity: hoveredBottomSection === index ? 1 : 0,
                      zIndex: 0,
                    }}
                  />

                  {/* ✅ PLACEHOLDER - RESPONSIVE SIZE */}
                  <div
  ref={(el) => {
    if (el) portfolioCardPlaceholdersRef.current[index] = el;
  }}
  className={`rounded-xl mb-6 relative ${!isDesktop ? 'cursor-pointer' : ''}`}
  style={isDesktop ? {
    width: `${portfolioCardWidth}px`,
    aspectRatio: '3/4',
    zIndex: 10,
    pointerEvents: !isInHeroSection ? 'none' : 'auto',
    transform: (() => {
      const width = window.innerWidth;
      const baseWidth = 1800;
      const baseOffsetX = 39;
      const baseOffsetY = 60;
      const stepPx = width < 1400 ? 50 : 15;
      const pxPerStep = width < 1400 ? 1.2: 0.4;

      const steps = Math.max(0, Math.floor((baseWidth - width) / stepPx));
      let offsetX = Math.max(0, baseOffsetX - steps * pxPerStep);
      const offsetY = Math.max(0, baseOffsetY - steps * pxPerStep);

      if (width >= 1024 && width <= 1250) {
        offsetX += 2;
      }

      return `translate(${offsetX}px, ${offsetY}px)`;
    })(),
  } : {
    width: '100%',
    aspectRatio: '3/4',
    zIndex: 10,
  }}
  onMouseEnter={() => !isDesktop && setHoveredCard(index)}
  onMouseLeave={() => !isDesktop && setHoveredCard(null)}
>

                    {!isDesktop && (
                      <div className="relative w-full h-full rounded-xl overflow-hidden">
                        <div className="absolute inset-0 z-10">
                          {item.type === "image" ? (
                            <Image
                              src={item.src}
                              alt={item.alt}
                              fill
                              className="object-cover rounded-xl"
                            />
                          ) : (
                            <video
                              src={item.src}
                              muted
                              loop
                              playsInline
                              autoPlay
                              className="w-full h-full object-cover rounded-xl"
                            />
                          )}
                        </div>

                        {/* ✅ Triangle overlay on hover for mobile */}
                        <div
                          className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 pointer-events-none overflow-hidden ${hoveredCard === index ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
                          style={{ height: "18%" }}
                        >
                          <svg
                            className="absolute bottom-0 left-0 w-full h-full"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="M 0 100 L 30 35 C 38 25, 44 20, 50 20 C 56 20, 62 25, 70 35 L 100 100 Z"
                              fill="#74f5a1"
                            />
                          </svg>
                          <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex flex-col items-center">
                            <h3 className="text-black font-medium text-[10px] sm:text-[11px] mb-0.5">
                              {item.title}
                            </h3>
                            <p className="text-black text-[9px] sm:text-[10px] font-medium">
                              {item.metric}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className="transition-all duration-300 rounded-xl relative z-10"
                    style={{
                      width: isDesktop ? `${portfolioCardWidth}px` : '100%',
                    }}
                    onMouseEnter={() => setHoveredBottomSection(index)}
                    onMouseLeave={() => setHoveredBottomSection(null)}
                  >
                    <Link href={item.link}>
                      <div className="px-4 sm:px-6 py-5 sm:py-6">
                        <h3
                          className="font-bold text-base sm:text-lg mb-2 transition-colors duration-300"
                          style={{
                            color:
                              hoveredBottomSection === index
                                ? "#ffffff"
                                : theme === "dark"
                                  ? "#ffffff"
                                  : "#111111",
                          }}
                        >
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {item.buttons.map((button, btnIndex) => (
                            <span
                              key={btnIndex}
                              className="border rounded-full px-3 py-1 text-xs transition-colors duration-300"
                              style={{
                                borderColor:
                                  hoveredBottomSection === index
                                    ? "rgba(255, 255, 255, 0.3)"
                                    : theme === "dark"
                                      ? "rgba(255, 255, 255, 0.3)"
                                      : "rgba(0, 0, 0, 0.2)",
                                color:
                                  hoveredBottomSection === index
                                    ? "rgba(255, 255, 255, 0.8)"
                                    : theme === "dark"
                                      ? "rgba(255, 255, 255, 0.8)"
                                      : "rgba(0, 0, 0, 0.8)",
                              }}
                            >
                              {button}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
