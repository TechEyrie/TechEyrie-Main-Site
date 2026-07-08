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
import { useRouter } from "next/navigation";
import {
  dark7HeroPortfolioContainerStyle,
  dark7HeroSurfaceStyle,
} from "./dark7PageGradients";
import EagleScrollScene from "./EagleScrollScene";
import {
  dark7V4ScrollTrigger,
  DARK7_V4_HERO_PIN_ID,
  refreshDark7V4ScrollTriggers,
} from "./lenisScrollTrigger";
import "./HeroSectionMediaSlot.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSectionMediaSlot({
  theme = "light",
  sharedBackground = false,
}) {
  const router = useRouter();
  const lightColors = useMemo(
    () => ({
      primary: "#013825",
      secondary: "#9E8F72",
      tertiary: "#CEC8B0",
      background: "#F9F7F0",
      text: "#111111",
    }),
    [],
  );

  const darkColors = useMemo(
    () => ({
      primary: "#74F5A1",
      secondary: "#5FE08D",
      tertiary: "#3BC972",
      background: "#2b2b2b",
      text: "white",
    }),
    [],
  );

  // ── REFS ──────────────────────────────────────────────────────────
  const containerRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroPinRef = useRef(null);
  const heroContentRef = useRef(null);
  const titleContainerRef = useRef(null);
  const portfolioSectionRef = useRef(null);
  const heroCardsContainerRef = useRef(null);
  const heroCardsRef = useRef([]);
  const portfolioCardPlaceholdersRef = useRef([]);
  const autoRotateIntervalRef = useRef(null);
  const autoTriangleIntervalRef = useRef(null);
  const portfolioCardTriangleIntervals = useRef({});
  const mobileCardTriangleIntervals = useRef({});

  // ── STATE ─────────────────────────────────────────────────────────
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [outgoingCity, setOutgoingCity] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [cardTriangles, setCardTriangles] = useState({});
  const [portfolioCardTriangles, setPortfolioCardTriangles] = useState({});
  const triangleIdRef = useRef(0);
  const portfolioCardTriangleIdRef = useRef(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [screenSize, setScreenSize] = useState("mobile");
  const [activeCard, setActiveCard] = useState(0);
  const [activeArrows, setActiveArrows] = useState(0);
  const [hoveredBottomSection, setHoveredBottomSection] = useState(null);
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hoveredPortfolioCard, setHoveredPortfolioCard] = useState(null);
  const [cardWidth, setCardWidth] = useState(220);
  const [portfolioCardWidth, setPortfolioCardWidth] = useState(300);
  const [heroStackOffset, setHeroStackOffset] = useState(100);

  // ── MEMOS ─────────────────────────────────────────────────────────
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
        link: "/case-studies/1",
      },
      {
        type: "image",
        src: "https://www.datocms-assets.com/151374/1741910699-cotopaxi_482x858_alternate.png?auto=format&fit=max&h=2440&lossless=false&q=75&w=2440",
        alt: "Cotopaxi brand showcase",
        title: "Solution Architect",
        subtitle: "Outdoor & Lifestyle",
        metric: "+20% Marketing Efficiency",
        buttons: ["Food & Beverage", "CPG"],
        link: "/case-studies/2",
      },
      {
        type: "video",
        src: "https://stream.mux.com/zaOX00ijKS1dZVZGFpLMjhNOIGbKQ8dmO/medium.mp4",
        alt: "Digital marketing campaign showcase",
        title: "Exacting Precision",
        subtitle: "Food & Beverage",
        metric: "+45% Engagement",
        buttons: ["Food & Beverage", "CPG"],
        link: "/case-studies/3",
      },
      {
        type: "video",
        src: "https://stream.mux.com/s5S6U18mND3t8caFSka7r7Wrulxm4SAb/medium.mp4",
        alt: "Brand impact visualization",
        title: "Expert Mastery",
        subtitle: "Global Campaigns",
        metric: "+60% Brand Awareness",
        buttons: ["Food & Beverage", "CPG"],
        link: "/case-studies/4",
      },
    ],
    [],
  );

  const rotatingCities = useMemo(() => ["Qatar", "Dubai", "UK"], []);

  // ── CARD SIZE CALCULATION ─────────────────────────────────────────
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

  // ── EFFECTS ───────────────────────────────────────────────────────

  // Reduced motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Rotating cities
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

  // Hero content opacity
  useLayoutEffect(() => {
    const content = heroContentRef.current;
    if (!content) return;
    gsap.set(content, { opacity: 1, y: 0 });
    return () => {
      gsap.set(content, { clearProps: "opacity,y" });
    };
  }, [theme]);

  // Electrical animation
  const triggerElectricalAnimation = useCallback(() => {
    const titleLines = document.querySelectorAll(".hero-main-title-line");
    const originalColor = "#f8fffb";
    const electricColor = theme === "dark" ? "#74F5A1" : "#3BC972";
    const brightElectricColor = "#FFFFFF";
    const tl = gsap.timeline();
    titleLines.forEach((line, index) => {
      tl.to(
        line,
        { color: brightElectricColor, duration: 0.1, ease: "power2.out" },
        index * 0.2,
      )
        .to(line, { color: electricColor, duration: 0.15, ease: "sine.inOut" })
        .to(line, { color: originalColor, duration: 0.25, ease: "power2.in" });
    });
  }, [theme]);

  // Title entrance animation
  useLayoutEffect(() => {
    if (!titleContainerRef.current) return;
    const ctx = gsap.context(() => {
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
          transformOrigin: "top center",
          delay: 0.1,
        },
      );
      gsap.from(".hero-badge", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".hero-body", {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
        stagger: 0.08,
      });
    }, containerRef.current);
    return () => ctx.revert();
  }, [triggerElectricalAnimation]);

  useEffect(() => {
    const timer = setTimeout(() => triggerElectricalAnimation(), 1500);
    return () => clearTimeout(timer);
  }, [triggerElectricalAnimation]);

  // Background style
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

  // Screen size detection
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

  // Scroll position tracking
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

  // Auto-rotation of hero cards
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

  // Clear triangles on card change
  useEffect(() => {
    setCardTriangles({});
  }, [activeCard]);

  // Card stacking GSAP
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

  // Arrow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveArrows((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // ── CALLBACKS ─────────────────────────────────────────────────────

  const openCaseStudy = useCallback(
    (href) => {
      router.push(href);
    },
    [router],
  );

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

  // ── TRIANGLE EFFECTS ──────────────────────────────────────────────

  const createTriangleForCard = useCallback(
    (cardIndex, x, y) => {
      const id = triangleIdRef.current++;
      const size = Math.random() * 10 + 15;
      const rotation = Math.random() * 360;
      const greenShades =
        theme === "dark"
          ? ["#74F5A1", "#5FE08D", "#4DD97F", "#3BC972"]
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
      const greenShades =
        theme === "dark"
          ? ["#74F5A1", "#5FE08D", "#4DD97F", "#3BC972"]
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

  // Auto triangles on active hero card
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
    return () => {
      if (autoTriangleIntervalRef.current) clearInterval(autoTriangleIntervalRef.current);
    };
  }, [createTriangleForCard, isInHeroSection, isScrolling, activeCard, isDesktop]);

  // Auto triangles on hovered portfolio card (desktop)
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

  // Auto triangles on hovered card (mobile/tablet)
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

  // Triangle CSS injection
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

  // ── SCROLL-MORPH SCROLLTRIGGER ────────────────────────────────────
  useLayoutEffect(() => {
    if (!isDesktop || !heroCardsContainerRef.current || !portfolioSectionRef.current) return;

    const ctx = gsap.context(() => {
      setTimeout(() => {
        mediaAssets.forEach((_, index) => {
          const heroCard = heroCardsRef.current[index];
          const placeholder = portfolioCardPlaceholdersRef.current[index];
          if (!heroCard || !placeholder) return;
          const overlay = heroCard.querySelector(".card-overlay");

          ScrollTrigger.create(
            dark7V4ScrollTrigger({
              trigger: heroSectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
              onUpdate: (self) => {
                const rawProgress = self.progress;

                // ── FIX1: Use heroPinRef (not heroSectionRef) to detect pre-pin state ──
                // The eagle pin triggers on heroPinRef, but heroSectionRef has pt-40 padding
                // above it. Using heroSectionRef.top caused the morph to start ~160px too early.
                const eagleTrigger = ScrollTrigger.getById(DARK7_V4_HERO_PIN_ID);
                const isPinned = eagleTrigger?.isActive;
                const pinRect = heroPinRef.current?.getBoundingClientRect();
                const isBeforePin = !pinRect || pinRect.top >= -2;

                if (isPinned || isBeforePin) {
                  // Before pin: counteract scroll so cards don't drift upward
                  const scrollOffset = !isPinned && pinRect ? Math.max(0, -pinRect.top) : 0;
                  gsap.set(heroCard, {
                    transformOrigin: "0 0",
                    x: index * heroStackOffset,
                    y: scrollOffset,
                    scale: 1 - index * 0.05,
                    zIndex: 50 - index,
                  });
                  if (overlay) gsap.set(overlay, { opacity: 1 });
                  return;
                }

                // ── FIX2: Remap progress so morph starts cleanly after pin ──
                const pinDuration = 500;
                const sectionHeight = heroSectionRef.current?.offsetHeight || 1200;
                const pinEndProgress = Math.min(0.5, pinDuration / sectionHeight);
                const morphProgress = Math.max(0, Math.min(1, (rawProgress - pinEndProgress) / (1 - pinEndProgress)));

                // Morph cards to portfolio positions
                const heroContainer = heroCardsContainerRef.current;
                if (!heroContainer || !placeholder) return;
                const heroContainerRect = heroContainer.getBoundingClientRect();
                const placeholderRect = placeholder.getBoundingClientRect();
                const stackOffset = index * heroStackOffset;
                const heroStartX = heroContainerRect.left + stackOffset;
                const heroStartY = heroContainerRect.top;
                const targetScale = placeholderRect.width / heroContainerRect.width;
                const startScale = 1 - index * 0.05;
                const currentScale = startScale + (targetScale - startScale) * morphProgress;
                const deltaX = placeholderRect.left - heroStartX;
                const deltaY = placeholderRect.top - heroStartY;

                gsap.set(heroCard, {
                  transformOrigin: "0 0",
                  x: stackOffset + deltaX * morphProgress,
                  y: deltaY * morphProgress,
                  scale: currentScale,
                  zIndex: morphProgress > 0.05 ? 3000 + index : 50 - index,
                  pointerEvents: morphProgress > 0.85 ? "none" : "auto",
                });
                if (overlay) gsap.set(overlay, { opacity: 1 - morphProgress });
              },
            }),
          );
        });
      }, 500);
    }, containerRef.current);

    return () => ctx.revert();
  }, [isDesktop, screenSize, mediaAssets, heroStackOffset]);

  // ── TRIANGLE SVG COMPONENT ────────────────────────────────────────
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

  // ── JSX ───────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="relative z-30 w-full"
      style={
        theme === "dark" && sharedBackground
          ? dark7HeroPortfolioContainerStyle()
          : sharedBackground
            ? { background: "transparent", backgroundColor: "transparent" }
            : bgStyle
      }
    >
      {theme === "dark" && !sharedBackground && (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 sm:h-28 md:h-32"
            style={{
              background:
                "linear-gradient(to bottom, #162d24 0%, rgba(22,45,36,0) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 sm:h-40 md:h-48"
            style={{
              background:
                "linear-gradient(to top, rgba(0,81,96,0.9) 0%, rgba(0,81,96,0) 100%)",
            }}
          />
        </>
      )}

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section
        ref={heroSectionRef}
        className={`dark7-v4-hero relative z-30 overflow-visible pb-0${
          theme === "dark" ? " dark7-v4-hero-eagle" : ""
        }`}
        style={theme === "dark" && !sharedBackground ? dark7HeroSurfaceStyle() : undefined}
      >
        <div
          ref={heroPinRef}
          className="dark7-v4-hero-pin relative z-[1] h-[100svh] min-h-[100svh] w-full overflow-visible pt-32 md:pt-40"
        >
          {theme === "dark" && (
            <EagleScrollScene backgroundOnly pinTargetRef={heroPinRef} />
          )}

          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-[62%] max-w-[960px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(8, 26, 20, 0.78) 0%, rgba(8, 26, 20, 0.42) 48%, transparent 100%)",
            }}
            aria-hidden
          />

          <div ref={heroContentRef} className="dark7-v4-hero-content relative z-20">
            <div className="relative z-10 mx-auto flex min-h-0 max-w-[1800px] flex-col justify-between px-4 pt-12 md:px-6 lg:px-10">
              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[65%_35%] lg:gap-12 xl:gap-16">
                <div className="flex flex-col">
                  <div
                    ref={titleContainerRef}
                    className="dark7-v4-hero-title max-w-full lg:max-w-[1600px] xl:max-w-[1800px]"
                  >
                    <div className="hero-badge mb-10 flex items-center gap-3 mb-16">
                      <span
                        className="inline-flex h-5 w-5 rounded-sm"
                        style={{
                          backgroundColor:
                            theme === "dark" ? darkColors.primary : lightColors.primary,
                        }}
                      />
                      <span
                        className={`font-merriweather text-[13px] font-semibold uppercase tracking-[0.16em] md:text-[15px] ${
                          theme === "dark" ? "text-white/90" : "text-[#212121]"
                        }`}
                      >
                        AI & Automation Partner
                      </span>
                    </div>

                    <h1 className="mb-4 font-italiana tracking-[-0.03em]">
                      <span
                        className={`hero-main-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.05] whitespace-nowrap ${
                          theme === "dark" ? "text-white" : "text-[#1b3d36]"
                        }`}
                      >
                        <span className="font-light">Designed for</span>
                      </span>
                      <span
                        className={`hero-main-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] leading-[1.05] font-light whitespace-nowrap -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem] ${
                          theme === "dark" ? "text-white" : "text-[#1b3d36]"
                        }`}
                      >
                        companies that
                      </span>
                      <span
                        className={`hero-main-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] leading-[1.05] font-light whitespace-nowrap ${
                          theme === "dark" ? "text-white" : "text-[#1b3d36]"
                        }`}
                      >
                        refuse ordinary
                      </span>
                    </h1>
                  </div>

                  <div className="hero-body max-w-full pt-8 sm:pt-12 lg:max-w-[640px] lg:pt-20">
                    <p
                      className={`mb-9 font-merriweather text-[17px] font-light leading-relaxed md:text-[25px] ${
                        theme === "dark" ? "text-white/85" : "text-[#1b3d36]/90"
                      }`}
                    >
                      Enterprise AI, automation, and custom digital solutions designed to
                      simplify complexity, improve performance, and unlock sustainable growth.
                    </p>
                    <Link
                      href="#discover"
                      className={`inline-flex items-center justify-center px-5 py-2.5 font-merriweather text-[16px] font-light tracking-tight transition-colors duration-300 md:px-6 md:py-3 md:text-[18px] ${
                        theme === "dark" ? "text-white/90" : "text-[#1b3d36]/90"
                      }`}
                      style={{
                        backgroundColor: "#F7F3F033",
                        borderRadius: "10px",
                      }}
                    >
                      Explore Our Expertise
                    </Link>
                  </div>
                </div>
              </div>

              {/* ═══ DESKTOP CARD STACK ═══ */}
              {isDesktop && (
                <div
                  className="relative z-[200] flex justify-end items-end mb-0 pr-48 lg:pr-56 xl:pr-64 2xl:pr-72"
                  style={{ transform: "translateY(-95%)", height: 120, overflow: "visible" }}
                >
                  <div ref={heroCardsContainerRef} className="relative z-[200]" style={{ width: `${cardWidth}px` }}>
                    <div className="relative w-full aspect-[3/4]" style={{ perspective: "1000px" }}>
                      {mediaAssets.map((asset, index) => (
                        <div
                          key={index}
                          ref={(el) => {
                            if (el) heroCardsRef.current[index] = el;
                          }}
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
                                <h3 className="text-white text-sm font-merriweather font-bold mb-1">
                                  {asset.title}
                                </h3>
                                <p className="text-white/80 text-xs">{asset.subtitle}</p>
                              </div>
                            </div>

                            {isInHeroSection && index === activeCard && cardTriangles[index] && (
                              <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden rounded-xl">
                                {cardTriangles[index].map((triangle) => (
                                  <TriangleSVG key={triangle.id} triangle={triangle} />
                                ))}
                              </div>
                            )}

                            {!isInHeroSection && hoveredPortfolioCard === index && portfolioCardTriangles[index] && (
                              <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden rounded-xl">
                                {portfolioCardTriangles[index].map((triangle) => (
                                  <TriangleSVG key={triangle.id} triangle={triangle} />
                                ))}
                              </div>
                            )}

                            <div
                              className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 pointer-events-none overflow-visible ${
                                (!isScrolling && isInHeroSection) ||
                                (hoveredPortfolioCard === index && !isInHeroSection)
                                  ? "translate-y-0 opacity-100"
                                  : "translate-y-full opacity-0"
                              }`}
                              style={{ height: "22%" }}
                            >
                              <svg
                                className="absolute bottom-0 left-0 w-full h-full"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                              >
                                <path
                                  d="M 0 100 L 46 15 A 5 5 0 0 1 54 15 L 100 100 Z"
                                  fill="#74f5a1"
                                />
                              </svg>
                              <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 flex flex-col items-center">
                                <h3 className="hero-pyramid-label font-medium text-[9px] sm:text-[10px] mb-0.5">
                                  {asset.title}
                                </h3>
                                <p className="hero-pyramid-label text-[8px] sm:text-[9px] font-medium">
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
          </div>
        </div>

        {/* Scroll-down arrows */}
        <div
          className={`z-20 ${
            isDesktop
              ? "absolute left-1/2 -translate-x-1/2 top-[calc(50%+21rem)]"
              : "relative flex justify-center mt-10 mb-4"
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
                  className="w-4 h-4 md:w-4 md:h-4 transition-colors duration-300 -my-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ color: isActive ? "#FCD34D" : "#92400E" }}
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

      {/* ═══════════════ PORTFOLIO SECTION ═══════════════ */}
      <section
        ref={portfolioSectionRef}
        id="discover"
        className="dark7-v4-portfolio relative z-20 w-full overflow-visible py-0"
      >
        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-4 pt-4 sm:px-6 lg:px-8">
          <header className="mb-12 text-center sm:mb-16">
            <p
              className={`dark7-v4-portfolio-eyebrow mb-4 flex items-center justify-center gap-2 font-playfair text-base sm:mb-6 sm:gap-3 sm:text-lg md:text-xl lg:text-2xl ${
                theme === "dark" ? "text-white/70" : "text-[#1b3d36]/70"
              }`}
            >
              <Image
                src="/feather-heading.png"
                alt=""
                width={40}
                height={40}
                className="h-5 w-auto shrink-0 sm:h-6 md:h-7 lg:h-8"
                aria-hidden
              />
              Our Case Study
            </p>
            <h2 className="dark7-v4-portfolio-title font-italiana text-3xl leading-tight text-black sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              <span className="dark7-v4-portfolio-title-lead font-light text-black">
                Creating impact for businesses in{" "}
              </span>
              <span className="dark7-v4-portfolio-city-pill relative -top-[2px] inline-flex min-w-[6ch] items-center justify-center overflow-hidden rounded-xl bg-[#1D322740] px-3 py-1 align-middle text-white">
                {outgoingCity && !prefersReducedMotion && (
                  <span className="animate-city-pill-out absolute inset-0 flex -translate-y-[1px] items-center justify-center font-playfair font-semibold italic">
                    {outgoingCity}
                  </span>
                )}
                <span
                  key={rotatingCities[currentCityIndex]}
                  className={`-translate-y-[1px] flex items-center justify-center font-playfair font-semibold italic ${
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
                <div
                  className="relative flex flex-col w-full"
                  style={{ width: isDesktop ? `${portfolioCardWidth}px` : "85%" }}
                >
                  {/* Hover background */}
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      backgroundColor: "#015b4f",
                      zIndex: 0,
                      opacity: hoveredBottomSection === index ? 1 : 0,
                      transform:
                        hoveredBottomSection === index ? "scaleY(1)" : "scaleY(0)",
                      transformOrigin: "top center",
                      transition:
                        "transform 720ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms ease-out",
                    }}
                  />

                  {/* Placeholder (morph target) */}
                  <div
                    ref={(el) => {
                      if (el) portfolioCardPlaceholdersRef.current[index] = el;
                    }}
                    className="relative w-full overflow-hidden rounded-t-xl flex-shrink-0 z-50 bg-transparent"
                    style={{
                      aspectRatio: "3 / 4",
                      zIndex: 50,
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
                          <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 260px"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <video
                            src={item.src}
                            muted
                            loop
                            playsInline
                            autoPlay
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </>
                    )}

                    {/* Mobile triangles */}
                    {!isDesktop && hoveredCard === index && portfolioCardTriangles[index] && (
                      <div className="absolute inset-0 z-[15] pointer-events-none overflow-hidden rounded-t-xl">
                        {portfolioCardTriangles[index].map((triangle) => (
                          <TriangleSVG key={triangle.id} triangle={triangle} />
                        ))}
                      </div>
                    )}

                    {/* Mobile pyramid overlay */}
                    {!isDesktop && (
                      <div
                        className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 pointer-events-none overflow-hidden ${
                          hoveredCard === index
                            ? "translate-y-0 opacity-100"
                            : "translate-y-full opacity-0"
                        }`}
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
                          <h3 className="text-[#013825] font-medium text-[10px] sm:text-[11px] mb-0.5">
                            {item.title}
                          </h3>
                          <p className="text-[#013825] text-[9px] sm:text-[10px] font-medium">
                            {item.metric}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom info */}
                  <div
                    className="relative z-10 w-full rounded-b-xl transition-colors duration-300 flex flex-col justify-center h-[132px] sm:h-[148px]"
                    onMouseEnter={() => setHoveredBottomSection(index)}
                    onMouseLeave={() => setHoveredBottomSection(null)}
                  >
                    <Link href={item.link} className="block h-full">
                      <div className="px-4 sm:px-6 py-5 sm:py-6 flex flex-col justify-center h-full">
                        <h3
                          className={`dark7-v4-portfolio-card-title font-bold text-base sm:text-lg mb-2 transition-colors duration-300 ${
                            hoveredBottomSection === index ? "is-hovered" : ""
                          }`}
                        >
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {item.buttons.map((button, btnIndex) => (
                            <span
                              key={btnIndex}
                              className={`dark7-v4-portfolio-card-tag border rounded-full px-3 py-1 text-xs transition-colors duration-300 ${
                                hoveredBottomSection === index ? "is-hovered" : ""
                              }`}
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
