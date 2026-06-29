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
      background: "#F4F1E8",
      noiseOverlay: "rgba(200, 200, 200, 0.3)",
      text: "#0D0D0D",
      paginationActive: "#013825",
      paginationInactive: "rgba(0,0,0,0.22)",
      gold: "#B8965A",
      ink: "#0D0D0D",
    }),
    [],
  );

  const darkColors = useMemo(
    () => ({
      primary: "#d4af37",
      secondary: "#e8c97a",
      tertiary: "#3BC972",
      background: "#141210",
      noiseOverlay: "rgba(60, 60, 60, 0.3)",
      text: "#F0EBE0",
      paginationActive: "#D9BC82",
      paginationInactive: "rgba(255,255,255,0.22)",
      gold: "#D9BC82",
      ink: "#F0EBE0",
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
  const mobileCardTriangleIntervals = useRef({});

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
        title: "MUD\\WTR",
        subtitle: "Health & Wellness",
        metric: "+35% Conversion Rate",
        year: "2024",
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
        year: "2024",
        buttons: ["Food & Beverage", "CPG"],
        link: "/work/cotopaxi",
      },
      {
        type: "video",
        src: "https://stream.mux.com/zaOX00ijKS1dZVZGFpLMjhNOIGbKQ8dmO/medium.mp4",
        alt: "Digital marketing campaign showcase",
        title: "OREO",
        subtitle: "Food & Beverage",
        metric: "+45% Engagement",
        year: "2023",
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
        year: "2023",
        buttons: ["Food & Beverage", "CPG"],
        link: "/work/coca-cola",
      },
    ],
    [],
  );

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
  }, [mediaAssets.length, isInHeroSection, isScrolling]);

  useEffect(() => {
    setCardTriangles({});
  }, [activeCard]);

  useEffect(() => {
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
    const originalColor = theme === "dark" ? "#F0EBE0" : "#0D0D0D";
    const electricColor = theme === "dark" ? "#D9BC82" : "#B8965A";
    const brightElectricColor = theme === "dark" ? "#FFFFFF" : "#FFFFFF";
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
    }, containerRef);
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
      const goldShades =
        theme === "dark"
          ? ["#D9BC82", "#C9A86C", "#E8D09A", "#B89050"]
          : ["#B8965A", "#9E7D40", "#CCA96A", "#8A6830"];
      const color = goldShades[Math.floor(Math.random() * goldShades.length)];
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
    [theme],
  );

  const createTriangleForPortfolioCard = useCallback(
    (cardIndex, x, y) => {
      const id = portfolioCardTriangleIdRef.current++;
      const size = Math.random() * 10 + 15;
      const rotation = Math.random() * 360;
      const goldShades =
        theme === "dark"
          ? ["#D9BC82", "#C9A86C", "#E8D09A", "#B89050"]
          : ["#B8965A", "#9E7D40", "#CCA96A", "#8A6830"];
      const color = goldShades[Math.floor(Math.random() * goldShades.length)];
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
    [theme],
  );

  const createPortfolioTriangle = useCallback(
    (x, y) => {
      const id = portfolioTriangleIdRef.current++;
      const size = Math.random() * 10 + 15;
      const rotation = Math.random() * 360;
      const goldShades =
        theme === "dark"
          ? ["#D9BC82", "#C9A86C", "#E8D09A", "#B89050"]
          : ["#B8965A", "#9E7D40", "#CCA96A", "#8A6830"];
      const color = goldShades[Math.floor(Math.random() * goldShades.length)];
      setPortfolioTriangles((prev) => [...prev, { id, x, y, size, rotation, color }]);
      setTimeout(() => setPortfolioTriangles((prev) => prev.filter((t) => t.id !== id)), 1050);
    },
    [theme],
  );

  useEffect(() => {
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
    return () => {
      if (autoTriangleIntervalRef.current) clearInterval(autoTriangleIntervalRef.current);
    };
  }, [createTriangleForCard, isInHeroSection, isScrolling, activeCard]);

  useEffect(() => {
    Object.keys(portfolioCardTriangleIntervals.current).forEach((key) =>
      clearInterval(portfolioCardTriangleIntervals.current[key]),
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
          createTriangleForPortfolioCard(
            hoveredPortfolioCard,
            Math.random() * cardRect.width,
            Math.random() * cardRect.height,
          );
        }
      }, 200);
    }
    return () => {
      Object.keys(portfolioCardTriangleIntervals.current).forEach((key) =>
        clearInterval(portfolioCardTriangleIntervals.current[key]),
      );
    };
  }, [hoveredPortfolioCard, isInHeroSection, createTriangleForPortfolioCard]);

  useEffect(() => {
    Object.keys(mobileCardTriangleIntervals.current).forEach((key) =>
      clearInterval(mobileCardTriangleIntervals.current[key]),
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
        clearInterval(mobileCardTriangleIntervals.current[key]),
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

      @keyframes gold-line-expand {
        from { transform: scaleX(0); opacity: 0; }
        to   { transform: scaleX(1); opacity: 1; }
      }
      .gold-line-in {
        transform-origin: left center;
        animation: gold-line-expand 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      @keyframes editorial-counter-tick {
        0%   { opacity: 0; transform: translateY(8px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .stat-in {
        animation: editorial-counter-tick 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      .hero-pyramid-label {
        color: #013825;
      }

      .lux-hairline {
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(184,150,90,0.15) 10%,
          rgba(184,150,90,0.72) 50%,
          rgba(184,150,90,0.15) 90%,
          transparent 100%
        );
      }

      .lux-hairline-dark {
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(217,188,130,0.15) 10%,
          rgba(217,188,130,0.68) 50%,
          rgba(217,188,130,0.15) 90%,
          transparent 100%
        );
      }

      .editorial-cta-underline {
        position: relative;
        display: inline-block;
      }
      .editorial-cta-underline::after {
        content: "";
        position: absolute;
        bottom: -3px;
        left: 0;
        right: 0;
        height: 1px;
        background: currentColor;
        transform: scaleX(1);
        transform-origin: left;
        transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .editorial-cta-underline:hover::after {
        transform: scaleX(0);
        transform-origin: right;
      }

      .index-numeral {
        font-feature-settings: "tnum" 1;
        font-variant-numeric: tabular-nums;
      }

      .card-edge-reveal {
        transition: box-shadow 0.4s ease, outline-offset 0.3s ease;
      }
      .card-edge-reveal:hover {
        box-shadow: 0 0 0 1px rgba(184,150,90,0.55), 0 20px 60px rgba(0,0,0,0.22);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const bgStyle = useMemo(
    () =>
      theme === "dark"
        ? {
            background:
              "linear-gradient(135deg, #162d24 0%, #1b4732 18%, #005160 55%, #162d24 100%)",
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

  const gold = theme === "dark" ? darkColors.gold : lightColors.gold;
  const ink  = theme === "dark" ? darkColors.ink  : lightColors.ink;

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

  const stats = [
    { value: "12+", label: "Years of practice" },
    { value: "240M", label: "Pipeline generated" },
    { value: "97%", label: "Client retention" },
  ];

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
          <div
            className="absolute inset-x-0 top-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[1]"
            style={{ background: "linear-gradient(to bottom, #162d24 0%, rgba(22,45,36,0) 100%)" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-48 pointer-events-none z-[1]"
            style={{ background: "linear-gradient(to top, rgba(0,81,96,0.9) 0%, rgba(0,81,96,0) 100%)" }}
          />
        </>
      )}

      {/* ── HERO SECTION ── */}
      <section
        ref={heroSectionRef}
        className="relative overflow-visible pt-32 md:pt-40 pb-0"
        style={{ paddingBottom: getBottomPadding(), zIndex: 2, marginBottom: "0" }}
      >
        {theme === "dark" && !prefersReducedMotion && (
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
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-[0.42]"
              src="/videos/back-video.mp4"
              autoPlay muted loop playsInline preload="metadata"
            />
            <div className="absolute inset-0 bg-[#2d5f4c]/76" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#3a7260]/32 via-transparent to-transparent" style={{ mixBlendMode: "soft-light" }} />
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse 120% 90% at 60% 85%, rgba(142, 162, 88, 0.46) 0%, rgba(52, 102, 82, 0.34) 42%, rgba(22, 45, 36, 0) 72%)",
              mixBlendMode: "soft-light",
            }} />
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse 85% 70% at 50% 20%, rgba(0, 81, 96, 0.36) 0%, transparent 58%)",
              mixBlendMode: "screen",
              opacity: 0.7,
            }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c241c]/46 via-[#234d3e]/14 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#265445]/44 via-transparent to-[#17352c]/30" />
            <div className="absolute inset-0 opacity-[0.12]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
              mixBlendMode: "overlay",
            }} />
          </div>
        )}

        {theme === "dark" && !sharedBackground && (
          <div className="absolute inset-0 pointer-events-none z-[1]" style={noiseOverlayStyle} />
        )}

        <div className="relative z-10 mx-auto max-w-[1800px] px-4 md:px-6 lg:px-10 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-[62%_38%] gap-8 lg:gap-16 items-start">
            <div className="flex flex-col" ref={titleContainerRef}>

              {/* ── TOP META ROW ── */}
              <div className="hero-badge mb-10 md:mb-12 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <span
                    className="inline-block text-[10px] sm:text-[11px] md:text-[12px] uppercase tracking-[0.3em] font-merriweather"
                    style={{ color: gold }}
                  >
                    Est. 2012
                  </span>
                  <span
                    className="hidden sm:block h-px w-10 gold-line-in"
                    style={{ background: gold }}
                    aria-hidden
                  />
                  <span
                    className={`text-[10px] sm:text-[11px] uppercase tracking-[0.28em] ${
                      theme === "dark" ? "text-white/48" : "text-black/42"
                    }`}
                  >
                    B2B Growth Partner
                  </span>
                </div>

                <span
                  className={`index-numeral text-[11px] md:text-[12px] tracking-[0.22em] uppercase ${
                    theme === "dark" ? "text-white/36" : "text-black/32"
                  }`}
                >
                  01 / Overview
                </span>
              </div>

              {/* ── MAIN HEADLINE ── */}
              <h1 className="font-italiana tracking-[-0.04em] mb-0">
                <span
                  className={`hero-main-title-line block text-[40px] sm:text-[56px] md:text-[72px] lg:text-[80px] xl:text-[96px] 2xl:text-[112px] leading-[0.95] font-light ${
                    theme === "dark" ? "text-[#F0EBE0]" : "text-[#0D0D0D]"
                  }`}
                >
                  High-performing
                </span>
                <span
                  className={`hero-main-title-line block text-[40px] sm:text-[56px] md:text-[72px] lg:text-[80px] xl:text-[96px] 2xl:text-[112px] leading-[0.95] font-light -mt-[0.08em] ${
                    theme === "dark" ? "text-[#F0EBE0]" : "text-[#0D0D0D]"
                  }`}
                >
                  marketing{" "}
                  <span className="font-playfair italic" style={{ color: gold }}>
                    engines
                  </span>
                </span>
                <span
                  className={`hero-main-title-line block text-[40px] sm:text-[56px] md:text-[72px] lg:text-[80px] xl:text-[96px] 2xl:text-[112px] leading-[0.95] font-light -mt-[0.08em] ${
                    theme === "dark" ? "text-[#F0EBE0]" : "text-[#0D0D0D]"
                  }`}
                >
                  for B2B brands
                </span>
              </h1>

              {/* ── GOLD DIVIDER ── */}
              <div
                className={`mt-8 md:mt-10 mb-8 md:mb-10 h-px w-full ${
                  theme === "dark" ? "lux-hairline-dark" : "lux-hairline"
                }`}
                aria-hidden
              />

              {/* ── BODY + CTA ── */}
              <div className="hero-body grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-8 xl:gap-14 items-end">
                <p
                  className={`font-playfair text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] leading-[1.75] max-w-[600px] ${
                    theme === "dark" ? "text-[#F0EBE0]/80" : "text-[#1a1a1a]/78"
                  }`}
                >
                  We architect demand-generation systems that feel premium,
                  convert with precision, and build lasting brand authority
                  for B2B companies that refuse to be average.
                </p>

                <div className="flex flex-col gap-5 xl:items-end xl:text-right">
                  <Link
                    href="#discover"
                    className="editorial-cta-underline group inline-flex items-center gap-4 w-fit"
                    style={{ color: ink }}
                  >
                    <span
                      className="font-[Helvetica_Now_Text,Helvetica,Arial,sans-serif] text-[15px] md:text-[18px] font-bold tracking-tight"
                    >
                      Discover more
                    </span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      className="transition-transform duration-400 group-hover:translate-x-1 group-hover:translate-y-1"
                    >
                      <path
                        d="M3 15L15 3M15 3H6M15 3V12"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>

                  <div
                    className={`flex items-center gap-2.5 text-[12px] uppercase tracking-[0.22em] ${
                      theme === "dark" ? "text-white/42" : "text-black/38"
                    }`}
                  >
                    <span
                      className="inline-block h-px w-6"
                      style={{ background: gold }}
                    />
                    Strategy · Creative · Pipeline
                  </div>
                </div>
              </div>

              {/* ── EDITORIAL STATS ROW ── */}
              <div
                className={`hero-body mt-12 md:mt-16 pt-8 md:pt-10 border-t ${
                  theme === "dark" ? "border-white/10" : "border-black/10"
                } grid grid-cols-3 gap-6 md:gap-10`}
              >
                {stats.map((stat, i) => (
                  <div key={stat.label} className="stat-in" style={{ animationDelay: `${i * 0.12}s` }}>
                    <div
                      className="index-numeral font-italiana text-[32px] sm:text-[42px] md:text-[52px] leading-none tracking-[-0.04em] mb-2"
                      style={{ color: gold }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className={`text-[10px] sm:text-[11px] uppercase tracking-[0.22em] ${
                        theme === "dark" ? "text-white/52" : "text-black/48"
                      }`}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── DESKTOP STACKED CARDS ── */}
          {isDesktop ? (
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
                      className="absolute w-full h-full cursor-pointer rounded-2xl overflow-hidden card-edge-reveal"
                      style={{
                        zIndex: 50 - index,
                        transformOrigin: "0 0",
                        transform: `translateX(${index * heroStackOffset}px) scale(${1 - index * 0.05})`,
                        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                      }}
                      onClick={() => handleCardClick(index)}
                      onMouseEnter={() => { setHoveredPortfolioCard(index); setHoveredHeroCard(index); }}
                      onMouseLeave={() => { setHoveredPortfolioCard(null); setHoveredHeroCard(null); }}
                    >
                      <div className="card-inner-content relative w-full h-full overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 z-10">
                          {asset.type === "image" ? (
                            <Image src={asset.src} alt={asset.alt} fill className="object-cover rounded-2xl" />
                          ) : (
                            <video src={asset.src} muted loop playsInline autoPlay className="w-full h-full object-cover rounded-2xl" />
                          )}
                        </div>

                        {/* Minimal editorial overlay */}
                        <div className="card-overlay absolute inset-0 z-15 pointer-events-none"
                          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }}
                        >
                          <div className="absolute top-3 right-3">
                            <span
                              className="index-numeral text-[10px] uppercase tracking-[0.2em]"
                              style={{ color: `rgba(${theme === "dark" ? "217,188,130" : "217,188,130"},0.9)` }}
                            >
                              {asset.year}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <div
                              className="h-px w-8 mb-2"
                              style={{ background: gold }}
                              aria-hidden
                            />
                            <h3 className="text-white text-sm font-merriweather font-bold mb-0.5">{asset.title}</h3>
                            <p className="text-white/70 text-[10px] uppercase tracking-[0.18em]">{asset.subtitle}</p>
                          </div>
                        </div>

                        {isInHeroSection && index === activeCard && cardTriangles[index] && (
                          <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden rounded-2xl">
                            {cardTriangles[index].map((triangle) => <TriangleSVG key={triangle.id} triangle={triangle} />)}
                          </div>
                        )}

                        {!isInHeroSection && hoveredPortfolioCard === index && portfolioCardTriangles[index] && (
                          <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden rounded-2xl">
                            {portfolioCardTriangles[index].map((triangle) => <TriangleSVG key={triangle.id} triangle={triangle} />)}
                          </div>
                        )}

                        <div
                          className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 pointer-events-none overflow-visible ${
                            (!isScrolling && isInHeroSection) || (hoveredPortfolioCard === index && !isInHeroSection)
                              ? "translate-y-0 opacity-100"
                              : "translate-y-full opacity-0"
                          }`}
                          style={{ height: "22%" }}
                        >
                          <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M 0 100 L 46 15 A 5 5 0 0 1 54 15 L 100 100 Z" fill="#d4af37" />
                          </svg>
                          <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 flex flex-col items-center">
                            <h3 className="hero-pyramid-label font-medium text-[9px] sm:text-[10px] mb-0.5">{asset.title}</h3>
                            <p className="hero-pyramid-label text-[8px] sm:text-[9px] font-medium">{asset.metric}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pill-style pagination */}
                <div
                  className="flex justify-center mt-4 space-x-2 transition-opacity duration-300"
                  style={{ opacity: scrollProgress > 0.05 ? 0 : 1, pointerEvents: scrollProgress > 0.05 ? "none" : "auto" }}
                >
                  {mediaAssets.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleCardClick(index)}
                      className="rounded-full transition-all duration-300"
                      aria-label={`Show card ${index + 1}`}
                      style={{
                        width: index === activeCard ? 22 : 6,
                        height: 6,
                        backgroundColor: index === activeCard ? gold : theme === "dark" ? darkColors.paginationInactive : lightColors.paginationInactive,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center mt-10 mb-0">
              <div ref={heroCardsContainerRef} className="w-[140px] sm:w-[180px]">
                <div className="relative w-full aspect-[3/4]" style={{ perspective: "1000px" }}>
                  {mediaAssets.map((asset, index) => (
                    <div
                      key={index}
                      ref={(el) => { if (el) heroCardsRef.current[index] = el; }}
                      className="absolute w-full h-full cursor-pointer rounded-xl overflow-hidden card-edge-reveal"
                      style={{ zIndex: 50 - index, transform: `translateX(${index * 30}px) scale(${1 - index * 0.05})` }}
                      onClick={() => handleCardClick(index)}
                    >
                      <div className="card-inner-content relative w-full h-full overflow-hidden rounded-xl">
                        <div className="absolute inset-0 z-10">
                          {asset.type === "image" ? (
                            <Image src={asset.src} alt={asset.alt} fill className="object-cover rounded-xl" />
                          ) : (
                            <video src={asset.src} muted loop playsInline autoPlay className="w-full h-full object-cover rounded-xl" />
                          )}
                        </div>

                        <div className="card-overlay absolute inset-0 z-15 pointer-events-none"
                          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 60%)" }}
                        >
                          <div className="absolute top-2 right-2">
                            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: "rgba(217,188,130,0.9)" }}>
                              {asset.year}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="h-px w-5 mb-1.5" style={{ background: gold }} aria-hidden />
                            <h3 className="text-white text-[11px] font-bold mb-0.5">{asset.title}</h3>
                            <p className="text-white/70 text-[9px] uppercase tracking-[0.14em]">{asset.subtitle}</p>
                          </div>
                        </div>

                        {index === activeCard && cardTriangles[index] && (
                          <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden rounded-xl">
                            {cardTriangles[index].map((triangle) => <TriangleSVG key={triangle.id} triangle={triangle} />)}
                          </div>
                        )}

                        <div
                          className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 pointer-events-none overflow-visible ${
                            !isScrolling ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                          }`}
                          style={{ height: "22%" }}
                        >
                          <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M 0 100 L 46 15 A 5 5 0 0 1 54 15 L 100 100 Z" fill="#d4af37" />
                          </svg>
                          <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center">
                            <h3 className="hero-pyramid-label font-medium text-[8px] mb-0.5">{asset.title}</h3>
                            <p className="hero-pyramid-label text-[7px] font-medium">{asset.metric}</p>
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
                      className="rounded-full transition-all duration-300"
                      aria-label={`Show card ${index + 1}`}
                      style={{
                        width: index === activeCard ? 18 : 6,
                        height: 6,
                        backgroundColor: index === activeCard ? gold : theme === "dark" ? darkColors.paginationInactive : lightColors.paginationInactive,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── SCROLL PROMPT ── */}
        <div
          className={`absolute z-20 ${
            isDesktop
              ? "left-1/2 -translate-x-1/2 bottom-[15%]"
              : "left-4 sm:left-6 md:left-8 bottom-8 sm:bottom-12 md:bottom-4"
          }`}
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
                  style={{ color: isActive ? gold : theme === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)" }}
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

      {/* ── PORTFOLIO SECTION ── */}
      <section
        ref={portfolioSectionRef}
        className="w-full min-h-screen py-0 relative overflow-visible"
        style={{ zIndex: 1 }}
      >
        {theme === "dark" && !sharedBackground && (
          <>
            <div className="absolute inset-0 pointer-events-none z-[1]" style={noiseOverlayStyle} />
            <div
              className="absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-48 pointer-events-none z-[1]"
              style={{ background: "linear-gradient(to top, rgba(0,81,96,0.9) 0%, rgba(0,81,96,0) 100%)" }}
            />
          </>
        )}

        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {/* Portfolio header — editorial style */}
          <header className="mb-12 sm:mb-16">
            <div
              className={`flex items-center gap-5 mb-6 ${
                theme === "dark" ? "text-white/42" : "text-black/38"
              }`}
            >
              <span className="text-[11px] uppercase tracking-[0.28em]">02 / Selected work</span>
              <div
                className={`flex-1 h-px ${theme === "dark" ? "lux-hairline-dark" : "lux-hairline"}`}
                aria-hidden
              />
            </div>

            <h2
              className={`font-italiana text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-[-0.03em] ${
                theme === "dark" ? "text-[#F0EBE0]" : "text-[#0D0D0D]"
              }`}
            >
              <span className="font-light">Creating impact for </span>
              <span
                className="font-playfair italic"
                style={{ color: gold }}
              >
                businesses in Qatar
              </span>
            </h2>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaAssets.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="relative flex flex-col w-full"
                  style={{ width: isDesktop ? `${portfolioCardWidth}px` : "85%" }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none"
                    style={{ backgroundColor: "#0f1a14", opacity: hoveredBottomSection === index ? 1 : 0, zIndex: 0 }}
                  />

                  <div
                    ref={(el) => { if (el) portfolioCardPlaceholdersRef.current[index] = el; }}
                    className="relative w-full overflow-hidden rounded-t-2xl flex-shrink-0"
                    style={{ aspectRatio: "3 / 4", zIndex: 10, pointerEvents: "auto" }}
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
                          <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 260px"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <video src={item.src} muted loop playsInline autoPlay className="absolute inset-0 w-full h-full object-cover" />
                        )}
                      </>
                    )}

                    {isDesktop && <div className="absolute inset-0 bg-black/5" aria-hidden />}

                    {!isDesktop && hoveredCard === index && portfolioCardTriangles[index] && (
                      <div className="absolute inset-0 z-[15] pointer-events-none overflow-hidden rounded-t-2xl">
                        {portfolioCardTriangles[index].map((triangle) => <TriangleSVG key={triangle.id} triangle={triangle} />)}
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
                          <path d="M 0 100 L 30 35 C 38 25, 44 20, 50 20 C 56 20, 62 25, 70 35 L 100 100 Z" fill="#d4af37" />
                        </svg>
                        <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex flex-col items-center">
                          <h3 className="text-[#013825] font-medium text-[10px] sm:text-[11px] mb-0.5">{item.title}</h3>
                          <p className="text-[#013825] text-[9px] sm:text-[10px] font-medium">{item.metric}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className="relative z-10 w-full rounded-b-2xl transition-colors duration-300 flex flex-col justify-center h-[132px] sm:h-[148px]"
                    onMouseEnter={() => setHoveredBottomSection(index)}
                    onMouseLeave={() => setHoveredBottomSection(null)}
                  >
                    <Link href={item.link} className="block h-full">
                      <div className="px-4 sm:px-5 py-5 sm:py-6 flex flex-col justify-between h-full">
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            className="font-bold text-base sm:text-lg transition-colors duration-300"
                            style={{ color: hoveredBottomSection === index ? "#ffffff" : theme === "dark" ? "#F0EBE0" : "#0D0D0D" }}
                          >
                            {item.title}
                          </h3>
                          <span
                            className="index-numeral text-[10px] tracking-[0.18em] uppercase mt-1 flex-shrink-0"
                            style={{ color: hoveredBottomSection === index ? gold : theme === "dark" ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.34)" }}
                          >
                            {item.year}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.buttons.map((button, btnIndex) => (
                            <span
                              key={btnIndex}
                              className="border rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] transition-colors duration-300"
                              style={{
                                borderColor: hoveredBottomSection === index ? "rgba(255,255,255,0.22)" : theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.16)",
                                color: hoveredBottomSection === index ? "rgba(255,255,255,0.75)" : theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)",
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

          {portfolioTriangles.length > 0 && (
            <div className="pointer-events-none absolute inset-0">
              {portfolioTriangles.map((triangle) => <TriangleSVG key={triangle.id} triangle={triangle} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}