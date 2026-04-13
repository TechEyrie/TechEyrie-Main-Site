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
  const lightColors = useMemo(() => ({
    primary:    "#013825",
    secondary:  "#9E8F72",
    tertiary:   "#CEC8B0",
    background: "#F9F7F0",
    text:       "#111111",
  }), []);

  const darkColors = useMemo(() => ({
    primary:   "#74F5A1",
    secondary: "#5FE08D",
    tertiary:  "#3BC972",
    background:"#2b2b2b",
    text:      "white",
  }), []);

  const containerRef                   = useRef(null);
  const heroSectionRef                 = useRef(null);
  const heroContentRef                 = useRef(null);
  const eagleRef                       = useRef(null);
  const portfolioSectionRef            = useRef(null);
  const portfolioSpacerRef             = useRef(null);
  const titleContainerRef              = useRef(null);
  const portfolioCardPlaceholdersRef   = useRef([]);
  const portfolioCardTriangleIntervals = useRef({});
  const mobileCardTriangleIntervals    = useRef({});
  const portfolioCardTriangleIdRef     = useRef(0);
  const portfolioTriangleIdRef         = useRef(0);

  const [portfolioCardTriangles, setPortfolioCardTriangles] = useState({});
  const [portfolioTriangles, setPortfolioTriangles]         = useState([]);
  const [isDesktop, setIsDesktop]         = useState(false);
  const [screenSize, setScreenSize]       = useState("mobile");
  const [hoveredCard, setHoveredCard]     = useState(null);
  const [hoveredBottomSection, setHoveredBottomSection] = useState(null);
  const [hoveredPortfolioCard, setHoveredPortfolioCard] = useState(null);
  const [portfolioCardWidth, setPortfolioCardWidth]     = useState(300);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const mediaAssets = useMemo(() => [
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
  ], []);

  const calculateCardSizes = useCallback((w) => {
    if (w >= 1920) return 360;
    if (w >= 1536) return 330;
    if (w >= 1280) return 290;
    if (w >= 1024) return 260;
    return 240;
  }, []);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsDesktop(w >= 1024);
      if (w < 640)       setScreenSize("mobile");
      else if (w < 1024) setScreenSize("tablet");
      else if (w < 1440) setScreenSize("laptop");
      else               setScreenSize("desktop");
      setPortfolioCardWidth(calculateCardSizes(w));
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [calculateCardSizes]);

  const triggerElectricalAnimation = useCallback(() => {
    const lines = document.querySelectorAll(".hero-main-title-line");
    const orig  = theme === "dark" ? "#f3f3f3" : "#111111";
    const elec  = theme === "dark" ? "#74F5A1" : "#3BC972";
    const tl    = gsap.timeline();
    lines.forEach((line, i) => {
      tl.to(line, { color: "#ffffff",  duration: 0.10, ease: "power2.out" }, i * 0.2)
        .to(line, { color: elec,       duration: 0.15, ease: "sine.inOut" })
        .to(line, { color: orig,       duration: 0.25, ease: "power2.in"  });
    });
  }, [theme]);

  useLayoutEffect(() => {
    if (
      !heroSectionRef.current ||
      !heroContentRef.current ||
      !eagleRef.current ||
      !portfolioSectionRef.current ||
      !portfolioSpacerRef.current
    ) return;

    gsap.from(".hero-badge", { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.1 });
    gsap.fromTo(
      ".hero-main-title-line",
      { opacity: 0, y: 60, skewY: 4 },
      {
        opacity: 1, y: 0, skewY: 0,
        duration: 0.85, ease: "power3.out",
        stagger: 0.07, transformOrigin: "top left",
        delay: 0.25,
        onComplete: () => setTimeout(triggerElectricalAnimation, 800),
      },
    );
    gsap.from(eagleRef.current, {
      opacity: 0, y: 40, duration: 1.0, ease: "power3.out", delay: 0.5,
    });

    if (prefersReducedMotion) return;

    const portfolio    = portfolioSectionRef.current;
    const spacer       = portfolioSpacerRef.current;
    const greenOverlay = document.querySelector(".eagle-green-overlay");

    // Step 1: yank portfolio out of flow via fixed+opacity0
    portfolio.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      z-index: 10000 !important;
      opacity: 0 !important;
    `;

    // Step 2: spacer holds its exact height in the doc so section 3 is pushed down
    spacer.style.display   = "block";
    spacer.style.height    = `${portfolio.scrollHeight || window.innerHeight}px`;

    const eagleRect = eagleRef.current.getBoundingClientRect();

    const eagleClone = document.createElement("div");
    eagleClone.style.cssText = `
      position: fixed;
      top:    ${eagleRect.top}px;
      left:   ${eagleRect.left}px;
      width:  ${eagleRect.width}px;
      height: ${eagleRect.height}px;
      border-radius: 1rem;
      overflow: hidden;
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
    `;
    const cloneImg = document.createElement("img");
    cloneImg.src = "/pics/ggwp.png";
    cloneImg.alt = "";
    cloneImg.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
    eagleClone.appendChild(cloneImg);
    document.body.appendChild(eagleClone);
    gsap.set(eagleClone, { transformOrigin: "center center", scale: 1 });

    let released = false;

    const releasePortfolio = () => {
      if (released) return;
      released = true;
      // Kill every GSAP tween touching portfolio so nothing fights us
      gsap.killTweensOf(portfolio);
      // Now restore to normal flow with !important stripped via cssText
      portfolio.style.cssText = "";
      spacer.style.display    = "none";
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:       heroSectionRef.current,
        start:         "top top",
        end:           "+=280%",
        pin:           true,
        pinSpacing:    true,
        scrub:         0.8,
        anticipatePin: 1,

        onEnter() {
          eagleClone.style.opacity = "1";
          if (eagleRef.current) eagleRef.current.style.visibility = "hidden";
        },

        onUpdate(self) {
          // When scrub reaches the end, release portfolio from fixed
          if (self.progress >= 0.999) {
            releasePortfolio();
          }
        },

        onLeaveBack() {
          released = false;
          gsap.killTweensOf(portfolio);
          gsap.set(eagleClone, { clearProps: "transform" });
          gsap.set(eagleClone, {
            top:             eagleRect.top,
            left:            eagleRect.left,
            width:           eagleRect.width,
            height:          eagleRect.height,
            borderRadius:    "1rem",
            opacity:         0,
            transformOrigin: "center center",
          });
          portfolio.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            z-index: 10000 !important;
            opacity: 0 !important;
          `;
          spacer.style.display = "block";
          spacer.style.height  = `${portfolio.scrollHeight || window.innerHeight}px`;
          if (eagleRef.current) eagleRef.current.style.visibility = "visible";
          if (greenOverlay) gsap.set(greenOverlay, { opacity: 0 });
          gsap.set(heroContentRef.current, { clearProps: "y,opacity" });
        },
      },
    });

    tl.to(heroContentRef.current, {
      y: -80, opacity: 0, ease: "power3.in", duration: 0.12,
    }, 0)
    .to(eagleClone, {
      scale: 5, borderRadius: 0, ease: "power2.inOut", duration: 0.42,
    }, 0)
    .to(greenOverlay, {
      opacity: 0.88, ease: "power1.inOut", duration: 0.20,
    }, 0.42)
    .to(eagleClone, {
      opacity: 0, ease: "power2.in", duration: 0.17,
    }, 0.55)
    .to(portfolio, {
      opacity: 1, ease: "power1.inOut", duration: 0.20,
    }, 0.65)
    .to(greenOverlay, {
      opacity: 0, ease: "power2.in", duration: 0.28,
    }, 0.72);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      eagleClone.remove();
      gsap.killTweensOf(portfolio);
      portfolio.style.cssText = "";
      spacer.style.display    = "none";
      if (eagleRef.current) eagleRef.current.style.visibility = "visible";
      if (greenOverlay) gsap.set(greenOverlay, { opacity: 0 });
    };
  }, [isDesktop, screenSize, theme, triggerElectricalAnimation, prefersReducedMotion]);

  useEffect(() => {
    if (!isDesktop) {
      const t = setTimeout(triggerElectricalAnimation, 1500);
      return () => clearTimeout(t);
    }
  }, [triggerElectricalAnimation, isDesktop]);

  const createTriangleForPortfolioCard = useCallback((cardIndex, x, y) => {
    const id       = portfolioCardTriangleIdRef.current++;
    const size     = Math.random() * 10 + 15;
    const rotation = Math.random() * 360;
    const shades   = theme === "dark"
      ? ["#74F5A1", "#5FE08D", "#4DD97F", "#3BC972"]
      : [lightColors.primary, lightColors.secondary, lightColors.tertiary];
    const color = shades[Math.floor(Math.random() * shades.length)];
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
  }, [theme, lightColors]);

  useEffect(() => {
    Object.values(portfolioCardTriangleIntervals.current).forEach(clearInterval);
    portfolioCardTriangleIntervals.current = {};
    if (hoveredPortfolioCard !== null) {
      portfolioCardTriangleIntervals.current[hoveredPortfolioCard] = setInterval(() => {
        const ref = portfolioCardPlaceholdersRef.current?.[hoveredPortfolioCard];
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0)
          createTriangleForPortfolioCard(hoveredPortfolioCard, Math.random() * rect.width, Math.random() * rect.height);
      }, 200);
    }
    return () => Object.values(portfolioCardTriangleIntervals.current).forEach(clearInterval);
  }, [hoveredPortfolioCard, createTriangleForPortfolioCard]);

  useEffect(() => {
    Object.values(mobileCardTriangleIntervals.current).forEach(clearInterval);
    mobileCardTriangleIntervals.current = {};
    if (hoveredCard !== null && !isDesktop) {
      mobileCardTriangleIntervals.current[hoveredCard] = setInterval(() => {
        const ref = portfolioCardPlaceholdersRef.current?.[hoveredCard];
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0)
          createTriangleForPortfolioCard(hoveredCard, Math.random() * rect.width, Math.random() * rect.height);
      }, 200);
    }
    return () => Object.values(mobileCardTriangleIntervals.current).forEach(clearInterval);
  }, [hoveredCard, isDesktop, createTriangleForPortfolioCard]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes triangle-fade {
        0%   { opacity:0.7; transform:translate(-50%,-50%) scale(1)   rotate(var(--rotation)); }
        100% { opacity:0;   transform:translate(-50%,-50%) scale(1.5) rotate(var(--rotation)); }
      }
      .animate-triangle-fade { animation: triangle-fade 1.05s ease-out forwards; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const sharedSectionBgStyle = useMemo(() => {
    if (theme === "dark" && sharedBackground) return dark7MainSurfaceStyle;
    if (sharedBackground) return { background: "transparent" };
    if (theme === "dark") return { background: "linear-gradient(135deg,#162d24 0%,#1b4732 18%,#005160 55%,#162d24 100%)" };
    return { backgroundColor: lightColors.background };
  }, [theme, sharedBackground, lightColors]);

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(255,255,255,.03) 1px,rgba(255,255,255,.03) 2px),
      repeating-linear-gradient(90deg,transparent,transparent 1px,rgba(255,255,255,.03) 1px,rgba(255,255,255,.03) 2px),
      repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(255,255,255,.015) 2px,rgba(255,255,255,.015) 4px)
    `,
  };

  const portfolioBgStyle = theme === "dark"
    ? { background: "linear-gradient(135deg,#162d24 0%,#1b4732 18%,#005160 55%,#162d24 100%)" }
    : { backgroundColor: lightColors.background };

  const TriangleSVG = ({ triangle }) => (
    <div
      className="absolute animate-triangle-fade pointer-events-none"
      style={{
        left: `${triangle.x}px`, top: `${triangle.y}px`,
        width: `${triangle.size}px`, height: `${triangle.size}px`,
        "--rotation": `${triangle.rotation}deg`, opacity: 0.7,
      }}
    >
      <svg className="w-full h-full" viewBox="0 0 100 100" fill="none"
        style={{ transform: `translate(-50%,-50%) rotate(${triangle.rotation}deg)` }}>
        <path d="M50 10 L90 90 L10 90 Z" fill={triangle.color} />
      </svg>
    </div>
  );

  return (
    <div ref={containerRef} className="relative w-full" style={sharedSectionBgStyle}>

      {/* Global green overlay */}
      <div
        className="eagle-green-overlay pointer-events-none"
        style={{
          position:        "fixed",
          inset:           0,
          zIndex:          9998,
          opacity:         0,
          backgroundColor: theme === "dark" ? "#013825" : "#016040",
        }}
      />

      {theme === "dark" && !sharedBackground && (
        <>
          <div className="absolute inset-x-0 top-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[1]"
            style={{ background: "linear-gradient(to bottom,#162d24 0%,rgba(22,45,36,0) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-48 pointer-events-none z-[1]"
            style={{ background: "linear-gradient(to top,rgba(0,81,96,.9) 0%,rgba(0,81,96,0) 100%)" }} />
        </>
      )}

      {/* ══════════════════════════════════
          HERO SECTION
          ══════════════════════════════════ */}
      <section
        ref={heroSectionRef}
        className="relative w-full min-h-screen flex flex-col items-center overflow-hidden"
        style={{ zIndex: 2 }}
      >
        {theme === "dark" && !sharedBackground && (
          <div className="absolute inset-0 pointer-events-none z-[1]" style={noiseOverlayStyle} />
        )}

        <div
          ref={heroContentRef}
          className="relative z-10 w-full flex flex-col items-center text-center pt-32 md:pt-40 px-4 md:px-6 lg:px-10"
        >
          <div className="hero-badge flex items-center gap-3 mb-6">
            <span
              className="inline-flex h-5 w-5 rounded-sm"
              style={{ backgroundColor: theme === "dark" ? darkColors.primary : lightColors.primary }}
            />
            <span className={`font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"}`}>
              AI &amp; Automation Partner
            </span>
          </div>

          <div ref={titleContainerRef}>
            <h1 className="font-italiana tracking-[-0.03em]">
              <span className={`hero-main-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.05] ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"}`}>
                <span className="font-light">AI Systems </span>
                <span className="font-playfair italic text-[0.94em] tracking-[0.03em]">that turns</span>
              </span>
              <span className={`hero-main-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] leading-[1.05] font-light -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem] ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"}`}>
                workflows into
              </span>
              <span className={`hero-main-title-line block text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] leading-[1.05] font-light ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"}`}>
                Profit
              </span>
            </h1>
          </div>
        </div>

        <div
          ref={eagleRef}
          className="relative z-10 mt-8 overflow-hidden flex-shrink-0"
          style={{
            width:        "min(720px, 88vw)",
            aspectRatio:  "800 / 450",
            borderRadius: "1rem",
          }}
        >
          <Image
            src="/pics/ggwp.png"
            alt="Eagle eyes close-up"
            fill
            sizes="(max-width: 768px) 88vw, 720px"
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/*
        SPACER
        Holds the portfolio's exact content height in document flow
        while portfolio is position:fixed (invisible to layout).
        Without this, section 3 sits directly after the hero and
        the page scrolls straight into it, skipping the portfolio entirely.
        display:none after onLeaveForward — portfolio back in flow, no duplicate height.
      */}
      <div
        ref={portfolioSpacerRef}
        aria-hidden="true"
        style={{ display: "none", width: "100%" }}
      />

      {/* ══════════════════════════════════
          CASE STUDY SECTION
          ══════════════════════════════════ */}
      <section
        ref={portfolioSectionRef}
        className="w-full min-h-screen relative"
        style={{ ...portfolioBgStyle }}
      >
        {theme === "dark" && !sharedBackground && (
          <>
            <div className="absolute inset-0 pointer-events-none z-[1]" style={noiseOverlayStyle} />
            <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-48 pointer-events-none z-[1]"
              style={{ background: "linear-gradient(to top,rgba(0,81,96,.9) 0%,rgba(0,81,96,0) 100%)" }} />
          </>
        )}

        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
          <header className="text-center mb-12 sm:mb-16">
            <p className={`font-merriweather text-sm sm:text-base md:text-lg mb-4 sm:mb-6 ${theme === "dark" ? "text-white/70" : "text-[#111111]/70"}`}>
              Our Goal
            </p>
            <h2 className={`font-italiana text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight ${theme === "dark" ? "text-white" : "text-[#111111]"}`}>
              <span className="font-light">Creating impact for </span>
              <span className="italic bg-black text-white px-3 py-1.5 rounded-xl font-playfair font-semibold">
                businesses in Qatar
              </span>
            </h2>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaAssets.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="relative flex flex-col"
                  style={{ width: isDesktop ? `${portfolioCardWidth}px` : "85%" }}
                >
                  <div
                    className="absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none"
                    style={{ backgroundColor: "#015b4f", opacity: hoveredBottomSection === index ? 1 : 0, zIndex: 0 }}
                  />

                  <div
                    ref={(el) => { if (el) portfolioCardPlaceholdersRef.current[index] = el; }}
                    className="relative w-full overflow-hidden rounded-t-xl flex-shrink-0"
                    style={{ aspectRatio: "3 / 4", zIndex: 10 }}
                    onMouseEnter={() => isDesktop ? setHoveredPortfolioCard(index) : setHoveredCard(index)}
                    onMouseLeave={() => isDesktop ? setHoveredPortfolioCard(null) : setHoveredCard(null)}
                  >
                    {item.type === "image" ? (
                      <Image src={item.src} alt={item.alt} fill
                        sizes="(max-width:640px) 85vw,(max-width:1024px) 50vw,260px"
                        className="object-cover w-full h-full" />
                    ) : (
                      <video src={item.src} muted loop playsInline autoPlay
                        className="absolute inset-0 w-full h-full object-cover" />
                    )}

                    {((isDesktop && hoveredPortfolioCard === index) || (!isDesktop && hoveredCard === index)) &&
                      portfolioCardTriangles[index] && (
                        <div className="absolute inset-0 z-[15] pointer-events-none overflow-hidden rounded-t-xl">
                          {portfolioCardTriangles[index].map((t) => <TriangleSVG key={t.id} triangle={t} />)}
                        </div>
                      )}

                    <div
                      className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 pointer-events-none overflow-hidden ${
                        (isDesktop && hoveredPortfolioCard === index) || (!isDesktop && hoveredCard === index)
                          ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                      }`}
                      style={{ height: "18%" }}
                    >
                      <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M 0 100 L 30 35 C 38 25,44 20,50 20 C 56 20,62 25,70 35 L 100 100 Z" fill="#74f5a1" />
                      </svg>
                      <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex flex-col items-center">
                        <h3 className="text-[#013825] font-medium text-[10px] sm:text-[11px] mb-0.5">{item.title}</h3>
                        <p className="text-[#013825] text-[9px] sm:text-[10px] font-medium">{item.metric}</p>
                      </div>
                    </div>
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
                          style={{ color: hoveredBottomSection === index ? "#fff" : theme === "dark" ? "#fff" : "#111111" }}
                        >
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {item.buttons.map((btn, bi) => (
                            <span key={bi}
                              className="border rounded-full px-3 py-1 text-xs transition-colors duration-300"
                              style={{
                                borderColor: hoveredBottomSection === index ? "rgba(255,255,255,.3)" : theme === "dark" ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.2)",
                                color:       hoveredBottomSection === index ? "rgba(255,255,255,.8)" : theme === "dark" ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.8)",
                              }}>
                              {btn}
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