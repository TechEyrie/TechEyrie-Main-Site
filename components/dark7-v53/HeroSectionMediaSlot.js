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
  DARK7_V53_HERO_PIN_ID,
  notifyScrollLayoutReady,
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
  const activeCardRef = useRef(0);
  const [hoveredBottomSection, setHoveredBottomSection] = useState(null);
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hoveredPortfolioCard, setHoveredPortfolioCard] = useState(null);
  const [cardWidth, setCardWidth] = useState(220);
  const [heroCardHeight, setHeroCardHeight] = useState(320);
  const [portfolioCardWidth, setPortfolioCardWidth] = useState(300);
  const [heroStackOffset, setHeroStackOffset] = useState(100);
  const [ctaHovered, setCtaHovered] = useState(false);
  const isInHeroSectionRef = useRef(true);
  const isScrollingRef = useRef(false);
  const rotatePauseUntilRef = useRef(0);

  // ── MEMOS ─────────────────────────────────────────────────────────
  const mediaAssets = useMemo(
    () => [
      {
        type: "image",
        src: "/card-image1.png",
        alt: "MUD\\WTR brand showcase",
        title: "Technology Partner",
        subtitle: "Health & Wellness",
        metric: "+35% Conversion Rate",
        buttons: ["Health & Wellness", { label: "CPG", small: true }],
        link: "/case-studies/1",
      },
      {
        type: "image",
        src: "/card-image2.png",
        alt: "Cotopaxi brand showcase",
        title: "Solution Architect",
        subtitle: "Outdoor & Lifestyle",
        metric: "+20% Marketing Efficiency",
        buttons: ["Food & Beverage", "CPG"],
        link: "/case-studies/2",
      },
      {
        type: "image",
        src: "/card-image3.png",
        alt: "Digital marketing campaign showcase",
        title: "Exacting Precision",
        subtitle: "Food & Beverage",
        metric: "+45% Engagement",
        buttons: ["Food & Beverage", "CPG"],
        link: "/case-studies/3",
      },
      {
        type: "image",
        src: "/card-image4.png",
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

  const getHeroStackIndex = useCallback(
    (index, currentActive = activeCardRef.current) => {
      if (index === currentActive) return 0;
      if (index < currentActive) {
        return mediaAssets.length - currentActive + index;
      }
      return index - currentActive;
    },
    [mediaAssets.length],
  );

  const getHeroStackX = useCallback(
    (index, currentActive = activeCardRef.current) =>
      getHeroStackIndex(index, currentActive) * heroStackOffset,
    [getHeroStackIndex, heroStackOffset],
  );

  const applyHeroCardStack = useCallback(
    ({ animate = true } = {}) => {
      if (!isDesktop) return;
      if (isScrollingRef.current) return;

      const cards = heroCardsRef.current;
      if (!cards.length) return;

      const active = activeCardRef.current;
      const duration = animate ? 0.55 : 0;

      cards.forEach((card, index) => {
        if (!card) return;
        const stackIndex = getHeroStackIndex(index, active);
        const nextX = stackIndex * heroStackOffset;
        const nextZ = 100 - stackIndex;

        gsap.killTweensOf(card);

        if (animate) {
          gsap.to(card, {
            x: nextX,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            zIndex: nextZ,
            transformOrigin: "0 0",
            duration,
            ease: "power2.inOut",
            overwrite: "auto",
          });
        } else {
          gsap.set(card, {
            x: nextX,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            zIndex: nextZ,
            transformOrigin: "0 0",
          });
        }
      });
    },
    [getHeroStackIndex, heroStackOffset, isDesktop],
  );

  useEffect(() => {
    activeCardRef.current = activeCard;
  }, [activeCard]);

  useEffect(() => {
    isInHeroSectionRef.current = isInHeroSection;
  }, [isInHeroSection]);

  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);

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
    const originalColor = "#F7F3F0";
    const electricColor = theme === "dark" ? "#00D4A0" : "#3BC972";
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
      gsap.from(".hero-body", {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
        stagger: 0.08,
      });
      // Do NOT animate .hero-cta-row — it fights the on-story overlay position
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
      const naturalHeroCardHeight = sizes.heroWidth * (4 / 3);
      const maxHeroCardHeight = Math.max(280, window.innerHeight * 0.42);
      setHeroCardHeight(Math.round(Math.min(naturalHeroCardHeight, maxHeroCardHeight)));

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

        // Eagle pin scrolls the hero section top negative while cards stay put.
        // Only treat as "sliding away" after the pin ends (morph begins).
        const eagleTrigger = ScrollTrigger.getById(DARK7_V53_HERO_PIN_ID);
        const isPinned = Boolean(eagleTrigger?.isActive);
        const pinRect = heroPinRef.current?.getBoundingClientRect();
        const cardsStillInHero =
          isPinned || !pinRect || pinRect.top >= -2;
        setIsScrolling(!cardsStillInHero && heroTop < 0);
      } catch (_) {}
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("dark7-v53-scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("dark7-v53-scroll", handleScroll);
    };
  }, []);

  // Auto-rotation of hero cards
  useEffect(() => {
    if (!isDesktop) return;

    autoRotateIntervalRef.current = window.setInterval(() => {
      if (!isInHeroSectionRef.current || isScrollingRef.current) return;
      if (Date.now() < rotatePauseUntilRef.current) return;
      setActiveCard((prev) => (prev + 1) % mediaAssets.length);
    }, 3000);

    return () => {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
        autoRotateIntervalRef.current = null;
      }
    };
  }, [mediaAssets.length, isDesktop]);

  // Clear triangles on card change
  useEffect(() => {
    setCardTriangles({});
  }, [activeCard]);

  // Animate stack whenever the active card changes
  useEffect(() => {
    applyHeroCardStack({ animate: true });
  }, [activeCard, applyHeroCardStack]);

  // Snap stack into place on layout / size changes (no mid-rotation jump from layout effect)
  useLayoutEffect(() => {
    applyHeroCardStack({ animate: false });
  }, [isDesktop, heroStackOffset, heroCardHeight, cardWidth, applyHeroCardStack]);

  // After scroll morph ends, restore clean stack
  useEffect(() => {
    if (!isDesktop || isScrolling) return;
    applyHeroCardStack({ animate: false });
  }, [isScrolling, isDesktop, applyHeroCardStack]);

  // ── CALLBACKS ─────────────────────────────────────────────────────

  const openCaseStudy = useCallback(
    (href) => {
      router.push(href);
    },
    [router],
  );

  const handleCardClick = useCallback(
    (clickedIndex) => {
      if (clickedIndex === activeCardRef.current) return;
      rotatePauseUntilRef.current = Date.now() + 5000;
      setActiveCard(clickedIndex);
    },
    [],
  );

  const scrollToPortfolio = useCallback(() => {
    if (portfolioSectionRef.current) {
      portfolioSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // ── TRIANGLE EFFECTS ──────────────────────────────────────────────

  const TRIANGLE_FILL = "#F7F3F0";
  const CARD_PYRAMID_FILL = "#F7F3F0";

  const createTriangleForCard = useCallback(
    (cardIndex, x, y) => {
      const id = triangleIdRef.current++;
      const size = Math.random() * 10 + 15;
      const rotation = Math.random() * 360;
      const greenShades = [lightColors.primary, lightColors.secondary, lightColors.tertiary];
      const color =
        theme === "dark"
          ? TRIANGLE_FILL
          : greenShades[Math.floor(Math.random() * greenShades.length)];
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
      const greenShades = [lightColors.primary, lightColors.secondary, lightColors.tertiary];
      const color =
        theme === "dark"
          ? TRIANGLE_FILL
          : greenShades[Math.floor(Math.random() * greenShades.length)];
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

  // Storytelling size comes from CSS (20vw) — clear any prior inline fit
  useLayoutEffect(() => {
    const root = titleContainerRef.current;
    const story = root?.querySelector("[data-hero-story]");
    if (story) {
      story.style.removeProperty("font-size");
    }
    notifyScrollLayoutReady();
  }, []);

  // Hero title entrance — Noomo alignment
  useLayoutEffect(() => {
    if (prefersReducedMotion || !titleContainerRef.current) return;
    const root = titleContainerRef.current;
    const ctx = gsap.context(() => {
      const lead = root.querySelector("[data-hero-lead]");
      const story = root.querySelector("[data-hero-story]");
      const bar = root.querySelector("[data-hero-bar]");
      gsap.set([lead, story, bar].filter(Boolean), { opacity: 0, y: 20 });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (lead) tl.to(lead, { opacity: 1, y: 0, duration: 0.9 }, 0.12);
      if (story) tl.to(story, { opacity: 1, y: 0, duration: 1.1 }, 0.22);
      if (bar) tl.to(bar, { opacity: 1, y: 0, duration: 0.75 }, 0.45);
    }, root);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // ── TRIANGLE SVG COMPONENT ────────────────────────────────────────
  const TriangleSVG = ({ triangle }) => (
    <div
      className="hero-card-triangle absolute animate-triangle-fade pointer-events-none"
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
        className="hero-card-triangle-svg h-full w-full"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `translate(-50%, -50%) rotate(${triangle.rotation}deg)` }}
      >
        <path
          className="hero-card-triangle-path"
          d="M50 10 L90 90 L10 90 Z"
          fill={theme === "dark" ? TRIANGLE_FILL : triangle.color}
        />
      </svg>
    </div>
  );

  const heroCtaButton = (
    <Link
      href="#discover"
      className="hero-cta-btn hero-cta-pill relative z-[251] inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-5 py-2.5 text-[13px] font-light tracking-[0.03em] text-[#F7F3F0] transition-colors duration-300 md:gap-3 md:px-6 md:py-3 md:text-[15px]"
      style={{
        fontFamily: "'PPNeueMontreal', 'Helvetica Now Text', Arial, sans-serif",
        backgroundColor: ctaHovered ? "#162D24" : "rgba(247, 243, 240, 0.12)",
        borderColor: ctaHovered ? "rgba(247, 243, 240, 0.55)" : "rgba(247, 243, 240, 0.4)",
      }}
      onMouseEnter={() => setCtaHovered(true)}
      onMouseLeave={() => setCtaHovered(false)}
    >
      <span className="hero-cta-bird inline-flex h-4 w-4 items-center justify-center md:h-5 md:w-5" aria-hidden>
        <svg viewBox="0 0 24 24" className="h-full w-full fill-current" aria-hidden>
          <path d="M12.2 3.2c.4 2.6 1.9 4.6 4.2 5.8-2.6.9-4.4 2.8-5.2 5.6-.7-2.1-2.4-3.7-4.9-4.5 2.5-1.1 4.1-3.2 5.9-6.9z" />
        </svg>
      </span>
      Explore Our Expertise
    </Link>
  );

  const scrollDownButton = (
    <button
      type="button"
      onClick={scrollToPortfolio}
      className="hero-scroll-down-btn flex cursor-pointer flex-col gap-[-2px] transition-transform duration-300 hover:scale-110"
      aria-label="Scroll to next section"
    >
      {[0, 1, 2, 3].map((index) => (
        <svg
          key={index}
          className="hero-scroll-arrow -my-0.5 h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 10L12 15L17 10"
            stroke="#F7F3F0"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </button>
  );

  const heroStackWidth = cardWidth + (mediaAssets.length - 1) * heroStackOffset;

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
        className={`dark7-v53-hero relative z-30 overflow-visible pb-0${
          theme === "dark" ? " dark7-v53-hero-dark" : ""
        }`}
        style={theme === "dark" && !sharedBackground ? dark7HeroSurfaceStyle() : undefined}
      >
        <div
          ref={heroPinRef}
          className="dark7-v53-hero-pin relative z-[1] h-[100svh] min-h-[100svh] w-full overflow-visible"
        >
          {theme === "dark" && (
            <>
              <EagleScrollScene backgroundOnly pinTargetRef={heroPinRef} />
              <div
                className="pointer-events-none absolute inset-0 z-[5]"
                style={{
                  // Minimal veil — eagle stays vivid; seam still #8EAC85
                  background:
                    "linear-gradient(180deg, rgba(22, 45, 36, 0.08) 0%, rgba(22, 45, 36, 0.02) 38%, rgba(61, 86, 68, 0.06) 68%, rgba(142, 172, 133, 0.42) 90%, #8EAC85 100%)",
                }}
                aria-hidden
              />
            </>
          )}
          <div
            ref={heroContentRef}
            className="dark7-v53-hero-content absolute inset-0 z-20"
          >
            <div ref={titleContainerRef} className="hero-stage">
              {/*
                Noomo reference alignment:
                - two-line lead: The power / indented "of digital"
                - full-width storytelling under it
                - scroll bottom-left / CTA bottom-right
              */}
              <div className="hero-title-unit">
                <h1 data-hero-lead className="dark7-v53-hero-title hero-lead">
                  <span className="hero-lead-line hero-lead-line--1">
                    <span className="hero-lead-sans">The power</span>
                  </span>
                  <span className="hero-lead-line hero-lead-line--2">
                    <span className="hero-lead-of">of</span>
                    <span className="hero-lead-sans"> digital</span>
                  </span>
                </h1>

                <div data-hero-story className="hero-storytelling">
                  storytelling
                </div>
              </div>

              <div data-hero-bar className="hero-bottom-bar">
                <div className="hero-scroll-cue">{scrollDownButton}</div>
                <div className="hero-cta-row">{heroCtaButton}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ PORTFOLIO SECTION ═══════════════ */}
      <section
        ref={portfolioSectionRef}
        id="discover"
        className="dark7-v53-portfolio relative z-20 w-full overflow-visible py-0 pb-0"
      >
        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
          <header className="mb-12 text-center sm:mb-16">
            <p
              className={`dark7-v53-portfolio-eyebrow mb-4 flex items-center justify-center gap-2 font-playfair text-base sm:mb-6 sm:gap-3 sm:text-lg md:text-xl lg:text-2xl ${
                theme === "dark" ? "text-[#F7F3F0]/90" : "text-[#162D24]/90"
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
            <h2 className="dark7-v53-portfolio-title font-italiana text-3xl leading-tight text-[#162D24] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              <span className="dark7-v53-portfolio-title-lead font-light text-[#162D24]">
                Creating impact for businesses in{" "}
              </span>
              <span className="dark7-v53-portfolio-city-pill relative -top-[2px] inline-flex min-w-[6ch] items-center justify-center overflow-hidden rounded-xl bg-[#1D322740] px-3 py-1 align-middle text-[#F7F3F0]">
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
                  className={`dark7-v53-portfolio-card relative flex flex-col w-full ${
                    hoveredBottomSection === index ? "is-hovered" : ""
                  }`}
                  style={{ width: isDesktop ? `${portfolioCardWidth}px` : "85%" }}
                  onMouseEnter={() => setHoveredBottomSection(index)}
                  onMouseLeave={() => setHoveredBottomSection(null)}
                >
                  {/* Hover background */}
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      backgroundColor: "#162D24",
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
                            className="hero-card-pyramid-path"
                            d="M 0 100 L 30 35 C 38 25, 44 20, 50 20 C 56 20, 62 25, 70 35 L 100 100 Z"
                            fill={theme === "dark" ? CARD_PYRAMID_FILL : "#74f5a1"}
                          />
                        </svg>
                        <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex flex-col items-center">
                          <h3 className="hero-pyramid-label font-medium text-[10px] sm:text-[11px] mb-0.5">
                            {item.title}
                          </h3>
                          <p className="hero-pyramid-label text-[9px] sm:text-[10px] font-medium">
                            {item.metric}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom info */}
                  <div
                    className="relative z-10 w-full rounded-b-xl transition-colors duration-300 flex flex-col justify-center h-[132px] sm:h-[148px]"
                  >
                    <Link href={item.link} className="block h-full">
                      <div className="px-4 sm:px-6 py-5 sm:py-6 flex flex-col justify-center h-full">
                        <h3 className="dark7-v53-portfolio-card-title font-merriweather font-light leading-snug tracking-tight mb-2 transition-colors duration-300">
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {item.buttons.map((button, btnIndex) => {
                            const label = typeof button === "string" ? button : button.label;
                            const isSmall = typeof button === "object" && button.small;

                            return (
                            <span
                              key={btnIndex}
                              className={`dark7-v53-portfolio-card-tag font-merriweather border rounded-full transition-colors duration-300 ${
                                isSmall ? "is-small px-2 py-0.5" : "px-2.5 py-0.5"
                              }`}
                            >
                              {label}
                            </span>
                            );
                          })}
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
