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
import { dark7MainSurfaceStyle } from "./dark7PageSurface";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSectionMediaSlot({ theme = "light", sharedBackground = false }) {
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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [outgoingCity, setOutgoingCity] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const mediaAssets = useMemo(
    () => [
      {
        type: "image",
        src: "https://www.datocms-assets.com/151374/1741831437-mudwtr.png?auto=format&fit=max&h=2440&lossless=false&q=75&w=2440",
        alt: "MUD\\WTR brand showcase",
        title: "Technology Partner",
        subtitle: "Health & Wellness",
        metric: "+35% Conversion Rate",
        buttons: ["Health & Wellness"],
        link: "/work/mud-wtr",
      },
      {
        type: "image",
        src: "https://www.datocms-assets.com/151374/1741910699-cotopaxi_482x858_alternate.png?auto=format&fit=max&h=2440&lossless=false&q=75&w=2440",
        alt: "Cotopaxi brand showcase",
        title: "Solution Architect",
        subtitle: "Outdoor & Lifestyle",
        metric: "+20% Marketing Efficiency",
        buttons: ["Food & Beverage", "CPG"],
        link: "/work/cotopaxi",
      },
      {
        type: "video",
        src: "https://stream.mux.com/zaOX00ijKS1dZVZGFpLMjhNOIGbKQ8dmO/medium.mp4",
        alt: "Digital marketing campaign showcase",
        title: "Exacting Precision",
        subtitle: "Food & Beverage",
        metric: "+45% Engagement",
        buttons: ["Food & Beverage", "CPG"],
        link: "/work/oreo",
      },
      {
        type: "video",
        src: "https://stream.mux.com/s5S6U18mND3t8caFSka7r7Wrulxm4SAb/medium.mp4",
        alt: "Brand impact visualization",
        title: "Expert Mastery",
        subtitle: "Global Campaigns",
        metric: "+60% Brand Awareness",
        buttons: ["Food & Beverage", "CPG"],
        link: "/work/coca-cola",
      },
    ],
    [],
  );

  const rotatingCities = useMemo(() => ["Qatar", "Dubai", "UK"], []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let cycleTimeout;
    let swapTimeout;

    cycleTimeout = window.setTimeout(() => {
      setOutgoingCity(rotatingCities[currentCityIndex]);

      swapTimeout = window.setTimeout(() => {
        setCurrentCityIndex((prev) => (prev + 1) % rotatingCities.length);
        setOutgoingCity(null);
      }, 520);
    }, 2600);

    return () => {
      window.clearTimeout(cycleTimeout);
      window.clearTimeout(swapTimeout);
    };
  }, [currentCityIndex, prefersReducedMotion, rotatingCities]);

  const calculateCardSizes = useCallback((width) => {
    let heroWidth;
    if (width >= 1920) heroWidth = 260;
    else if (width >= 1536) heroWidth = 240;
    else if (width >= 1280) heroWidth = 210;
    else if (width >= 1024) heroWidth = 190;
    else heroWidth = 180;

    let portfolioWidth;
    if (width >= 1920) portfolioWidth = 360;
    else if (width >= 1536) portfolioWidth = 330;
    else if (width >= 1280) portfolioWidth = 290;
    else if (width >= 1024) portfolioWidth = 260;
    else portfolioWidth = 240;

    return { heroWidth, portfolioWidth };
  }, []);

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

  useEffect(() => {
    if (!isDesktop) return;
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
      if (autoRotateIntervalRef.current) clearInterval(autoRotateIntervalRef.current);
    };
  }, [mediaAssets.length, isInHeroSection, isScrolling, isDesktop]);

  useEffect(() => {
    setCardTriangles({});
  }, [activeCard]);

  useEffect(() => {
    if (!isDesktop) return;
    if (heroCardsRef.current.length === 0) return;
    heroCardsRef.current.forEach((card, index) => {
      if (!card) return;
      const offset = isDesktop ? heroStackOffset : 30;
      if (index === activeCard) {
        gsap.to(card, { x: 0, scale: 1, zIndex: 100, duration: 0.5, ease: "power2.out" });
      } else {
        let newIndex;
        if (index < activeCard) newIndex = mediaAssets.length - activeCard + index;
        else newIndex = index - activeCard;
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
      if (autoRotateIntervalRef.current) clearInterval(autoRotateIntervalRef.current);
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
      portfolioSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveArrows((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      const desktop = width >= 1024;
      setIsDesktop(desktop);
      if (width < 640) setScreenSize("mobile");
      else if (width < 1024) setScreenSize("tablet");
      else if (width < 1440) setScreenSize("laptop");
      else setScreenSize("desktop");

      const sizes = calculateCardSizes(width);
      setCardWidth(sizes.heroWidth);
      setPortfolioCardWidth(sizes.portfolioWidth);

      if (width >= 1280) setHeroStackOffset(100);
      else if (width >= 1024) setHeroStackOffset(56);
      else setHeroStackOffset(100);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [calculateCardSizes]);

  const triggerElectricalAnimation = useCallback(() => {
    const titleLines = document.querySelectorAll(".hero-main-title-line");
    const originalColor = theme === "dark" ? "#e8e4dc" : "#111111";
    const electricColor = theme === "dark" ? "#c8c4bc" : "#2a5c48";
    const brightElectricColor = "#FFFFFF";
    const tl = gsap.timeline();
    titleLines.forEach((line, index) => {
      tl.to(line, { color: brightElectricColor, duration: 0.1, ease: "power2.out" }, index * 0.2)
        .to(line, { color: electricColor, duration: 0.15, ease: "sine.inOut" })
        .to(line, { color: originalColor, duration: 0.25, ease: "power2.in" });
    });
  }, [theme]);

  useLayoutEffect(() => {
    if (!isDesktop || !heroCardsContainerRef.current || !portfolioSectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-main-title-line",
        { opacity: 0, y: 60, skewY: 4 },
        {
          opacity: 1, y: 0, skewY: 0, duration: 0.8, ease: "power3.out",
          stagger: 0.06, transformOrigin: "top left",
          scrollTrigger: {
            trigger: titleContainerRef.current,
            start: "top 85%", end: "bottom 20%",
            onEnter: () => setTimeout(() => triggerElectricalAnimation(), 1000),
            onEnterBack: () => setTimeout(() => triggerElectricalAnimation(), 500),
          },
        },
      );

      gsap.from(".hero-badge", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".hero-body", { y: 32, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2, stagger: 0.08 });

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
              setScrollProgress(progress);
              const heroContainer = heroCardsContainerRef.current;
              if (!heroContainer || !placeholder) return;
              const heroContainerRect = heroContainer.getBoundingClientRect();
              const placeholderRect = placeholder.getBoundingClientRect();
              const stackOffset = index * heroStackOffset;
              const heroStartX = heroContainerRect.left + stackOffset;
              const heroStartY = heroContainerRect.top;
              const targetScale = placeholderRect.width / heroContainerRect.width;
              const startScale = 1 - index * 0.05;
              const currentScale = startScale + (targetScale - startScale) * progress;
              const deltaX = placeholderRect.left - heroStartX;
              const deltaY = placeholderRect.top - heroStartY;
              gsap.set(heroCard, {
                transformOrigin: "0 0",
                x: stackOffset + deltaX * progress,
                y: deltaY * progress,
                scale: currentScale,
                zIndex: progress > 0.05 ? 1000 + index : 50 - index,
                pointerEvents: progress > 0.85 ? "none" : "auto",
              });
              if (overlay) gsap.set(overlay, { opacity: 1 - progress });
            },
          });
        });
      }, 500);
    }, containerRef.current);
    return () => ctx.revert();
  }, [isDesktop, screenSize, mediaAssets, triggerElectricalAnimation, heroStackOffset]);

  useEffect(() => {
    if (!isDesktop) {
      const timer = setTimeout(() => triggerElectricalAnimation(), 1500);
      return () => clearTimeout(timer);
    }
  }, [triggerElectricalAnimation, isDesktop]);

  const createTriangleForCard = useCallback(
    (cardIndex, x, y) => {
      const id = triangleIdRef.current++;
      const size = Math.random() * 10 + 15;
      const rotation = Math.random() * 360;
      const greenShades = theme === "dark"
        ? ["#c8c4bc", "#b0bab4", "#c8c4bc", "#2a5c48"]
        : [lightColors.primary, lightColors.secondary, lightColors.tertiary];
      const color = greenShades[Math.floor(Math.random() * greenShades.length)];
      setCardTriangles((prev) => ({
        ...prev,
        [cardIndex]: [...(prev[cardIndex] || []), { id, x, y, size, rotation, color }],
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

  const createTriangleForPortfolioCard = useCallback(
    (cardIndex, x, y) => {
      const id = portfolioCardTriangleIdRef.current++;
      const size = Math.random() * 10 + 15;
      const rotation = Math.random() * 360;
      const greenShades = theme === "dark"
        ? ["#c8c4bc", "#b0bab4", "#c8c4bc", "#2a5c48"]
        : [lightColors.primary, lightColors.secondary, lightColors.tertiary];
      const color = greenShades[Math.floor(Math.random() * greenShades.length)];
      setPortfolioCardTriangles((prev) => ({
        ...prev,
        [cardIndex]: [...(prev[cardIndex] || []), { id, x, y, size, rotation, color }],
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
      const size = Math.random() * 10 + 15;
      const rotation = Math.random() * 360;
      const greenShades = theme === "dark"
        ? ["#c8c4bc", "#b0bab4", "#c8c4bc", "#2a5c48"]
        : [lightColors.primary, lightColors.secondary, lightColors.tertiary];
      const color = greenShades[Math.floor(Math.random() * greenShades.length)];
      setPortfolioTriangles((prev) => [...prev, { id, x, y, size, rotation, color }]);
      setTimeout(() => setPortfolioTriangles((prev) => prev.filter((t) => t.id !== id)), 1050);
    },
    [theme, lightColors],
  );

  useEffect(() => {
    if (!isDesktop) return;
    if (autoTriangleIntervalRef.current) clearInterval(autoTriangleIntervalRef.current);
    if (!isInHeroSection || isScrolling) return;
    const activeCardElement = heroCardsRef.current[activeCard];
    if (!activeCardElement) return;
    autoTriangleIntervalRef.current = setInterval(() => {
      const card = heroCardsRef.current?.[activeCard];
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      if (cardRect.width > 0 && cardRect.height > 0) {
        createTriangleForCard(activeCard, Math.random() * cardRect.width, Math.random() * cardRect.height);
      }
    }, 200);
    return () => { if (autoTriangleIntervalRef.current) clearInterval(autoTriangleIntervalRef.current); };
  }, [createTriangleForCard, isInHeroSection, isScrolling, activeCard, isDesktop]);

  // --- AUTO TRIANGLES for HOVERED HERO CARD when in PORTFOLIO SECTION (desktop) ---
  useEffect(() => {
    Object.keys(portfolioCardTriangleIntervals.current).forEach((key) =>
      clearInterval(portfolioCardTriangleIntervals.current[key])
    );
    portfolioCardTriangleIntervals.current = {};
    if (hoveredPortfolioCard !== null && !isInHeroSection) {
      const cardElement = heroCardsRef.current[hoveredPortfolioCard];
      if (!cardElement) return;
      portfolioCardTriangleIntervals.current[hoveredPortfolioCard] = setInterval(() => {
        const card = heroCardsRef.current?.[hoveredPortfolioCard];
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        if (cardRect.width > 0 && cardRect.height > 0) {
          createTriangleForPortfolioCard(hoveredPortfolioCard, Math.random() * cardRect.width, Math.random() * cardRect.height);
        }
      }, 200);
    }
    return () => {
      Object.keys(portfolioCardTriangleIntervals.current).forEach((key) =>
        clearInterval(portfolioCardTriangleIntervals.current[key])
      );
    };
  }, [hoveredPortfolioCard, isInHeroSection, createTriangleForPortfolioCard]);

  // --- AUTO TRIANGLES for HOVERED CARD in PORTFOLIO SECTION (mobile/tablet) ---
  const mobileCardTriangleIntervals = useRef({});
  useEffect(() => {
    Object.keys(mobileCardTriangleIntervals.current).forEach((key) =>
      clearInterval(mobileCardTriangleIntervals.current[key])
    );
    mobileCardTriangleIntervals.current = {};
    if (hoveredCard !== null && !isDesktop) {
      const placeholder = portfolioCardPlaceholdersRef.current[hoveredCard];
      if (!placeholder) return;
      mobileCardTriangleIntervals.current[hoveredCard] = setInterval(() => {
        const el = portfolioCardPlaceholdersRef.current?.[hoveredCard];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          createTriangleForPortfolioCard(hoveredCard, Math.random() * rect.width, Math.random() * rect.height);
        }
      }, 200);
    }
    return () => {
      Object.keys(mobileCardTriangleIntervals.current).forEach((key) =>
        clearInterval(mobileCardTriangleIntervals.current[key])
      );
    };
  }, [hoveredCard, isDesktop, createTriangleForPortfolioCard]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes triangle-fade {
        0% { opacity: 0.7; transform: translate(-50%, -50%) scale(1) rotate(var(--rotation)); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5) rotate(var(--rotation)); }
      }
      .animate-triangle-fade { animation: triangle-fade 1.05s ease-out forwards; }
      @keyframes hero-ripple {
        0% {
          transform: translate3d(-8%, -50%, 0) scaleX(0.9);
          opacity: 0.0;
        }
        18% {
          opacity: 0.78;
        }
        50% {
          transform: translate3d(8%, -52%, 0) scaleX(1.08);
          opacity: 0.9;
        }
        82% {
          opacity: 0.0;
        }
        100% {
          transform: translate3d(12%, -48%, 0) scaleX(1.16);
          opacity: 0.0;
        }
      }
        @keyframes city-pill-slide-in {
          0% {
            opacity: 0;
            transform: translateY(-110%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes city-pill-slide-out {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(115%);
          }
        }
        .animate-city-pill-in {
          animation: city-pill-slide-in 0.52s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .animate-city-pill-out {
          animation: city-pill-slide-out 0.52s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
        }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const bgStyle = useMemo(
    () =>
      theme === "dark"
        ? {
            // Start and end in the shared deep green so the hero
            // softly blends into the dark page sections above/below.
            background:
              "linear-gradient(135deg, #0f2219 0%, #1e3d30 18%, #0a2e32 55%, #0f2219 100%)",
          }
        : { backgroundColor: lightColors.background },
    [theme, lightColors],
  );

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px)
    `,
  };

  const getBottomPadding = () => "0px";

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
        style={{ transform: `translate(-50%, -50%) rotate(${triangle.rotation}deg)` }}
      >
        <path d="M50 10 L90 90 L10 90 Z" fill={triangle.color} />
      </svg>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={
        theme === "dark" && sharedBackground
          ? dark7MainSurfaceStyle
          : sharedBackground
            ? { background: "transparent", backgroundColor: "transparent" }
            : bgStyle
      }
    >
      {theme === "dark" && !sharedBackground && (
        <>
          {/* Extra soft blend into neighbors at very top/bottom */}
          <div
            className="absolute inset-x-0 top-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[1]"
            style={{
              background:
                "linear-gradient(to bottom, #0f2219 0%, rgba(15,34,25,0) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-48 pointer-events-none z-[1]"
            style={{
              background:
                "linear-gradient(to top, rgba(10,46,50,0.9) 0%, rgba(10,46,50,0) 100%)",
            }}
          />
        </>
      )}
      {/* HERO SECTION */}
      <section
        ref={heroSectionRef}
        className="relative overflow-visible pt-32 md:pt-40 pb-0"
        style={{
          paddingBottom: getBottomPadding(),
          zIndex: 2,
          marginBottom: "0",
        }}
      >
        {theme === "dark" && (
          <div
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            aria-hidden
            style={{
              maskImage:
                "linear-gradient(to bottom, #000 0%, #000 46%, rgba(0,0,0,0.94) 56%, rgba(0,0,0,0.62) 66%, rgba(0,0,0,0.28) 78%, rgba(0,0,0,0.08) 90%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 0%, #000 46%, rgba(0,0,0,0.94) 56%, rgba(0,0,0,0.62) 66%, rgba(0,0,0,0.28) 78%, rgba(0,0,0,0.08) 90%, transparent 100%)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "#0f2219" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 135% 65% at 62% 96%, #1e3d30 0%, rgba(30,61,48,0.98) 30%, rgba(15,34,25,0) 88%)",
              }}
            />
          </div>
        )}
        {theme === "dark" && !sharedBackground && (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={noiseOverlayStyle}
          />
        )}
        <div className="relative z-10 mx-auto max-w-[1800px] px-4 md:px-6 lg:px-10 min-h-0 flex flex-col justify-between pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8 lg:gap-12 xl:gap-16 items-start">
            <div className="flex flex-col">
              <div className="max-w-full lg:max-w-[1600px] xl:max-w-[1800px]" ref={titleContainerRef}>
                <div className="hero-badge mb-10 flex items-center gap-3 mb-16">
                  <span
                    className="inline-flex h-5 w-5 rounded-sm"
                    style={{ backgroundColor: theme === "dark" ? darkColors.primary : lightColors.primary }}
                  />
                  <span className={`font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase ${theme === "dark" ? "text-[#e8e4dc]" : "text-[#212121]"}`}>
                  AI & Automation Partner

                  </span>
                </div>

                <h1 className="mb-4 font-italiana tracking-[-0.03em]">
                  <span className={`hero-main-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.05] whitespace-nowrap ${theme === "dark" ? "text-[#e8e4dc]" : "text-[#111111]"}`}>
                    <span className="font-light">AI Systems   </span>
                    <span className="font-playfair italic text-[0.94em] tracking-[0.03em]">that turns</span>
                  </span>
                  <span className={`hero-main-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] leading-[1.05] font-light whitespace-nowrap -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem] ${theme === "dark" ? "text-[#e8e4dc]" : "text-[#111111]"}`}>
                  workflows into 
                  </span>
                  <span className={`hero-main-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] leading-[1.05] font-light whitespace-nowrap ${theme === "dark" ? "text-[#f0eeea]" : "text-[#111111]"}`}>
                  Profit
                  </span>
                </h1>
              </div>

              <div className="hero-body max-w-full lg:max-w-[640px] pt-8 sm:pt-12 lg:pt-20">
                <p className={`mb-9 font-playfair text-[17px] md:text-[25px] font-normal leading-relaxed ${theme === "dark" ? "text-[#b8b4ac]" : "text-[#212121]"}`}>
                  Turning leads into loyal customers, we tailor high performance pipeline, ROI and elevate your brand authority.

                </p>
                <Link href="#discover" className="inline-flex items-center gap-3 group">
                  <span className={`font-[Helvetica_Now_Text,Helvetica,Arial,sans-serif] text-[16px] md:text-[20px] font-bold tracking-tight ${theme === "dark" ? "text-[#e8e4dc]" : "text-[#111111]"}`}>
                    Discover more
                  </span>
                  <span
                    className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[4px] transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-[10px]"
                    style={{ backgroundColor: theme === "dark" ? darkColors.primary : lightColors.primary }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-y-3 group-hover:opacity-0">
                      <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M7 1V13M7 13L3 9M7 13L11 9" fill="none" stroke={theme === "dark" ? "#0f2219" : "#F9FAF5"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center translate-y-[-12px] opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M7 1V13M7 13L3 9M7 13L11 9" fill="none" stroke={theme === "dark" ? "#0f2219" : darkColors.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* DESKTOP / LAPTOP ONLY — stacked hero cards + scroll morph */}
          {isDesktop && (
            <div
              className="flex justify-end items-end mb-0 pr-48 lg:pr-56 xl:pr-64 2xl:pr-72"
              style={{ transform: "translateY(-95%)", height: 120, overflow: "visible" }}
            >
              <div ref={heroCardsContainerRef} style={{ width: `${cardWidth}px` }}>
                <div className="relative w-full aspect-[3/4]" style={{ perspective: "1000px" }}>
                  {mediaAssets.map((asset, index) => (
                    <div
                      key={index}
                      ref={(el) => { if (el) heroCardsRef.current[index] = el; }}
                      className="absolute w-full h-full cursor-pointer shadow-lg rounded-xl overflow-hidden"
                      style={{
                        zIndex: 50 - index,
                        transformOrigin: "0 0",
                        transform: `translateX(${index * heroStackOffset}px) scale(${1 - index * 0.05})`,
                      }}
                      onClick={() => handleCardClick(index)}
                      onMouseEnter={() => setHoveredPortfolioCard(index)}
                      onMouseLeave={() => setHoveredPortfolioCard(null)}
                    >
                      <div className="card-inner-content relative w-full h-full overflow-hidden rounded-xl">
                        <div className="absolute inset-0 z-10">
                          {asset.type === "image" ? (
                            <Image src={asset.src} alt={asset.alt} fill className="object-cover rounded-xl" />
                          ) : (
                            <video src={asset.src} muted loop playsInline autoPlay className="w-full h-full object-cover rounded-xl" />
                          )}
                        </div>

                        <div className="card-overlay absolute inset-0 z-15 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none">
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-white text-sm font-merriweather font-bold mb-1">{asset.title}</h3>
                            <p className="text-white/80 text-xs">{asset.subtitle}</p>
                          </div>
                        </div>

                        {isInHeroSection && index === activeCard && cardTriangles[index] && (
                          <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden rounded-xl">
                            {cardTriangles[index].map((triangle) => <TriangleSVG key={triangle.id} triangle={triangle} />)}
                          </div>
                        )}

                        {!isInHeroSection && hoveredPortfolioCard === index && portfolioCardTriangles[index] && (
                          <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden rounded-xl">
                            {portfolioCardTriangles[index].map((triangle) => <TriangleSVG key={triangle.id} triangle={triangle} />)}
                          </div>
                        )}

                        <div
                          className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 pointer-events-none overflow-visible ${(!isScrolling && isInHeroSection) || (hoveredPortfolioCard === index && !isInHeroSection) ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
                          style={{ height: "22%" }}
                        >
                          <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M 0 100 L 46 15 A 5 5 0 0 1 54 15 L 100 100 Z" fill="#c8c4bc" />
                          </svg>
                          <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 flex flex-col items-center">
                            <h3
                              className="hero-pyramid-label font-medium text-[9px] sm:text-[10px] mb-0.5"
                            >
                              {asset.title}
                            </h3>
                            <p
                              className="hero-pyramid-label text-[8px] sm:text-[9px] font-medium"
                            >
                              {asset.metric}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}
        </div>

        <div
          className={`z-20 ${
            isDesktop
              ? "absolute left-1/2 -translate-x-1/2 top-[calc(50%+21rem)]"
              : "relative flex justify-center mt-10 mb-4"
          }`}
        >
          <button onClick={scrollToPortfolio} className="flex flex-col gap-[-2px] cursor-pointer group hover:scale-110 transition-transform duration-300" aria-label="Scroll to next section">
            {[0, 1, 2, 3].map((index) => {
              const isActive = 3 - index < activeArrows;
              return (
                <svg key={index} className="w-4 h-4 md:w-4 md:h-4 transition-colors duration-300 -my-0.5" viewBox="0 0 24 24" fill="none" style={{ color: isActive ? (theme === "dark" ? "#e8e4dc" : "#FCD34D") : (theme === "dark" ? "#5a605c" : "#92400E") }}>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              );
            })}
          </button>
        </div>
      </section>

      {/* PORTFOLIO SECTION */}
      <section
        ref={portfolioSectionRef}
        className="w-full min-h-screen py-0 relative overflow-visible"
        style={{ zIndex: 1 }}
      >
        {theme === "dark" && !sharedBackground && (
          <>
            <div
              className="absolute inset-0 pointer-events-none z-[1]"
              style={noiseOverlayStyle}
            />
            {/* Softer teal blend at the very bottom so this band eases
                into RealProblemSection instead of a dark / black line. */}
            <div
              className="absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-48 pointer-events-none z-[1]"
              style={{
                // Option B: deeper / more cinematic – stronger teal,
                // blended over a slightly taller band.
                background:
                  "linear-gradient(to top, rgba(10,46,50,0.9) 0%, rgba(10,46,50,0) 100%)",
              }}
            />
          </>
        )}
        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <header className="text-center mb-12 sm:mb-16">
            <p className={`font-merriweather text-sm sm:text-base md:text-lg mb-4 sm:mb-6 ${theme === "dark" ? "text-white/70" : "text-[#111111]/70"}`}>
              Our Goal
            </p>
            <h2 className={`font-italiana text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight ${theme === "dark" ? "text-white" : "text-[#111111]"}`}>
              <span className="font-light">Creating impact for businesses in </span>
              <span className="relative inline-flex min-w-[6ch] items-center justify-center overflow-hidden rounded-xl bg-black px-3 py-1 align-middle text-white -top-[2px]">
                {outgoingCity && !prefersReducedMotion && (
                  <span className="absolute inset-0 -translate-y-[1px] flex items-center justify-center italic font-playfair font-semibold animate-city-pill-out">
                    {outgoingCity}
                  </span>
                )}
                <span
                  key={rotatingCities[currentCityIndex]}
                  className={`-translate-y-[1px] flex items-center justify-center italic font-playfair font-semibold ${
                    prefersReducedMotion ? "" : "animate-city-pill-in"
                  }`}
                  style={{ opacity: outgoingCity ? 0 : 1 }}
                >
                  {rotatingCities[currentCityIndex]}
                </span>
              </span>
            </h2>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaAssets.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative flex flex-col w-full" style={{ width: isDesktop ? `${portfolioCardWidth}px` : "85%" }}>
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      backgroundColor: theme === "dark" ? "#1e3d30" : "#015b4f",
                      zIndex: 0,
                      opacity: hoveredBottomSection === index ? 1 : 0,
                      transform: hoveredBottomSection === index ? "scaleY(1)" : "scaleY(0)",
                      transformOrigin: "top center",
                      transition: "transform 720ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms ease-out",
                    }}
                  />
                  <div
                    ref={(el) => { if (el) portfolioCardPlaceholdersRef.current[index] = el; }}
                    className="relative w-full overflow-hidden rounded-t-xl flex-shrink-0"
                    style={{
                      aspectRatio: "3 / 4",
                      zIndex: 10,
                      pointerEvents: "auto",
                    }}
                    onMouseEnter={() => {
                      if (!isDesktop) setHoveredCard(index);
                      if (isDesktop && !isInHeroSection) setHoveredPortfolioCard(index);
                    }}
                    onMouseLeave={() => {
                      if (!isDesktop) setHoveredCard(null);
                      if (isDesktop && !isInHeroSection) setHoveredPortfolioCard(null);
                    }}
                  >
                    {!isDesktop && (
                      <>
                        {item.type === "image" ? (
                          <Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 260px" className="object-cover w-full h-full" />
                        ) : (
                          <video src={item.src} muted loop playsInline autoPlay className="absolute inset-0 w-full h-full object-cover" />
                        )}
                      </>
                    )}
                    {isDesktop && <div className="absolute inset-0 bg-black/5" aria-hidden />}

                    {/* ✅ FIXED: Triangles for mobile/tablet portfolio card hover */}
                    {!isDesktop && hoveredCard === index && portfolioCardTriangles[index] && (
                      <div className="absolute inset-0 z-[15] pointer-events-none overflow-hidden rounded-t-xl">
                        {portfolioCardTriangles[index].map((triangle) => (
                          <TriangleSVG key={triangle.id} triangle={triangle} />
                        ))}
                      </div>
                    )}

                    {!isDesktop && (
                      <div
                        className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 pointer-events-none overflow-hidden ${
                          hoveredCard === index ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                        }`}
                        style={{ height: "18%" }}
                      >
                        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M 0 100 L 30 35 C 38 25, 44 20, 50 20 C 56 20, 62 25, 70 35 L 100 100 Z" fill="#c8c4bc" />
                        </svg>
                        <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex flex-col items-center">
                          <h3 className="text-[#013825] font-medium text-[10px] sm:text-[11px] mb-0.5">{item.title}</h3>
                          <p className="text-[#013825] text-[9px] sm:text-[10px] font-medium">{item.metric}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className="relative z-10 w-full rounded-b-xl transition-colors duration-300 flex flex-col justify-center h-[132px] sm:h-[148px]"
                    onMouseEnter={() => setHoveredBottomSection(index)}
                    onMouseLeave={() => setHoveredBottomSection(null)}
                  >
                    <Link href={item.link} className="block h-full">
                      <div className="px-4 sm:px-6 py-5 sm:py-6 flex flex-col justify-center h-full">
                        <h3
                          className="font-bold text-base sm:text-lg mb-2 transition-colors duration-300"
                          style={{ color: hoveredBottomSection === index ? "#ffffff" : theme === "dark" ? "#ffffff" : "#111111" }}
                        >
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {item.buttons.map((button, btnIndex) => (
                            <span
                              key={btnIndex}
                              className="border rounded-full px-3 py-1 text-xs transition-colors duration-300"
                              style={{
                                borderColor: hoveredBottomSection === index ? "rgba(255, 255, 255, 0.3)" : theme === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)",
                                color: hoveredBottomSection === index ? "rgba(255, 255, 255, 0.8)" : theme === "dark" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
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
