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
import { dark7MainSurfaceStyle } from "../dark7/dark7PageSurface";
import EagleScrollScene from "../dark7-three1/EagleScrollScene";
import "./HeroSectionMediaSlot.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSectionMediaSlot({
  theme = "light",
  sharedBackground = false,
}) {
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

  const containerRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroPinRef = useRef(null);
  const heroContentRef = useRef(null);
  const titleContainerRef = useRef(null);
  const portfolioSectionRef = useRef(null);
  const portfolioCardTriangleIntervals = useRef({});

  const [portfolioTriangles, setPortfolioTriangles] = useState([]);
  const [portfolioCardTriangles, setPortfolioCardTriangles] = useState({});
  const portfolioTriangleIdRef = useRef(0);
  const portfolioCardTriangleIdRef = useRef(0);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [outgoingCity, setOutgoingCity] = useState(null);
  const [activeArrows, setActiveArrows] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBottomSection, setHoveredBottomSection] = useState(null);

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

  const scrollToPortfolio = useCallback(() => {
    portfolioSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const handleEagleScrollProgress = useCallback(
    (progress) => {
      const content = heroContentRef.current;
      if (!content || prefersReducedMotion) return;

      if (progress <= 0.001) {
        gsap.set(content, { opacity: 1, y: 0 });
        return;
      }

      const fade = gsap.utils.clamp(0, 1, (progress - 0.04) / 0.3);
      gsap.set(content, {
        opacity: 1 - fade,
        y: -56 * fade,
      });
    },
    [prefersReducedMotion],
  );

  useLayoutEffect(() => {
    const content = heroContentRef.current;
    if (!content) return;

    gsap.set(content, { opacity: 1, y: 0 });

    return () => {
      gsap.set(content, { clearProps: "opacity,y" });
    };
  }, [theme, prefersReducedMotion]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveArrows((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const triggerElectricalAnimation = useCallback(() => {
    const titleLines = document.querySelectorAll(".hero-main-title-line");
    const originalColor = "#1b3d36";
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

  const createPortfolioTriangle = useCallback(
    (x, y) => {
      const id = portfolioTriangleIdRef.current++;
      const size = Math.random() * 10 + 15;
      const rotation = Math.random() * 360;
      const greenShades =
        theme === "dark"
          ? ["#74F5A1", "#5FE08D", "#4DD97F", "#3BC972"]
          : [lightColors.primary, lightColors.secondary, lightColors.tertiary];
      const color = greenShades[Math.floor(Math.random() * greenShades.length)];

      setPortfolioTriangles((prev) => [...prev, { id, x, y, size, rotation, color }]);
      setTimeout(
        () => setPortfolioTriangles((prev) => prev.filter((t) => t.id !== id)),
        1050,
      );
    },
    [theme, lightColors],
  );

  useEffect(() => {
    Object.keys(portfolioCardTriangleIntervals.current).forEach((key) =>
      clearInterval(portfolioCardTriangleIntervals.current[key]),
    );
    portfolioCardTriangleIntervals.current = {};

    if (hoveredCard === null) return;

    portfolioCardTriangleIntervals.current[hoveredCard] = setInterval(() => {
      const card = document.querySelector(
        `[data-portfolio-card="${hoveredCard}"]`,
      );
      if (!card) return;
      const rect = card.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        createTriangleForPortfolioCard(
          hoveredCard,
          Math.random() * rect.width,
          Math.random() * rect.height,
        );
      }
    }, 200);

    return () => {
      Object.keys(portfolioCardTriangleIntervals.current).forEach((key) =>
        clearInterval(portfolioCardTriangleIntervals.current[key]),
      );
    };
  }, [hoveredCard, createTriangleForPortfolioCard]);

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
        className="h-full w-full"
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

      <section
        ref={heroSectionRef}
        className={`dark7-three2-hero relative overflow-x-hidden${
          theme === "dark" ? " dark7-three2-hero-eagle" : ""
        }`}
      >
        <div
          ref={heroPinRef}
          className="relative z-[1] h-[100svh] min-h-[100svh] w-full overflow-hidden pt-28 md:pt-32"
        >
          {theme === "dark" && (
            <EagleScrollScene
              backgroundOnly
              pinTargetRef={heroPinRef}
              onScrollProgress={
                prefersReducedMotion ? undefined : handleEagleScrollProgress
              }
            />
          )}

          {theme === "dark" && !sharedBackground && (
            <div
              className="pointer-events-none absolute inset-0 z-[1]"
              style={noiseOverlayStyle}
            />
          )}

          <div
            ref={heroContentRef}
            className="dark7-three2-hero-content relative z-10 mx-auto flex min-h-[calc(100svh-7rem)] max-w-[1800px] flex-col px-4 md:px-6 lg:px-10"
          >
          <div className="flex justify-center pt-4 md:pt-8">
            <div className="hero-badge flex items-center gap-3">
              <span
                className="inline-flex h-5 w-5 rounded-sm"
                style={{
                  backgroundColor:
                    theme === "dark" ? darkColors.primary : lightColors.primary,
                }}
              />
              <span
                className={`font-merriweather text-[13px] font-semibold uppercase tracking-[0.16em] md:text-[15px] ${theme === "dark" ? "text-[#1b3d36]" : "text-[#212121]"}`}
              >
                AI & Automation Partner
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-end pb-24 text-center md:pb-28">
            <div
              ref={titleContainerRef}
              className="dark7-three2-hero-title mx-auto w-full max-w-[1200px]"
            >
              <h1 className="font-italiana tracking-[-0.03em]">
                <span
                  className={`hero-main-title-line block text-[32px] leading-[1.05] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] text-[#1b3d36]`}
                >
                  <span className="font-light">AI Systems </span>
                  <span className="font-playfair text-[0.94em] italic tracking-[0.03em]">
                    that turns
                  </span>
                </span>
                <span
                  className={`hero-main-title-line -mt-[0.2rem] block text-[32px] leading-[1.05] font-light sm:-mt-[0.3rem] sm:text-[42px] md:-mt-[0.4rem] md:text-[58px] lg:-mt-[0.5rem] lg:text-[72px] xl:-mt-[0.6rem] xl:text-[88px] 2xl:-mt-[0.7rem] 2xl:text-[104px] text-[#1b3d36]`}
                >
                  workflows into
                </span>
                <span
                  className={`hero-main-title-line block text-[32px] leading-[1.05] font-light sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] text-[#1b3d36]`}
                >
                  Profit
                </span>
              </h1>
            </div>

            <div className="hero-body mx-auto mt-8 max-w-[640px] px-2 sm:mt-10">
              <p
                className={`mb-9 font-playfair text-[17px] font-normal leading-relaxed md:text-[25px] text-[#1b3d36]`}
              >
                Turning leads into loyal customers, we tailor high performance
                pipeline, ROI and elevate your brand authority.
              </p>
              <Link
                href="#discover"
                className="group inline-flex items-center justify-center gap-3"
              >
                <span
                  className="font-[Helvetica_Now_Text,Helvetica,Arial,sans-serif] text-[16px] font-bold tracking-tight text-[#1b3d36] md:text-[20px]"
                >
                  Discover more
                </span>
                <span
                  className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[4px] transition-all duration-500 ease-out group-hover:-translate-y-[10px] group-hover:scale-110"
                  style={{
                    backgroundColor:
                      theme === "dark" ? darkColors.primary : lightColors.primary,
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-y-3 group-hover:opacity-0">
                    <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden="true">
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
                  <span className="absolute inset-0 flex translate-y-[-12px] items-center justify-center opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                      <path
                        d="M7 1V13M7 13L3 9M7 13L11 9"
                        fill="none"
                        stroke={theme === "dark" ? "#212121" : darkColors.primary}
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

          <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 md:bottom-8">
            <button
              type="button"
              onClick={scrollToPortfolio}
              className="group flex cursor-pointer flex-col gap-[-2px] transition-transform duration-300 hover:scale-110"
              aria-label="Scroll to portfolio section"
            >
              {[0, 1, 2, 3].map((index) => {
                const isActive = 3 - index < activeArrows;
                return (
                  <svg
                    key={index}
                    className="-my-0.5 h-4 w-4 transition-colors duration-300 md:h-4 md:w-4"
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
        </div>
        </div>
      </section>

      <section
        ref={portfolioSectionRef}
        id="discover"
        className="relative w-full overflow-visible py-0"
        style={{ zIndex: 1 }}
      >
        {theme === "dark" && !sharedBackground && (
          <>
            <div
              className="pointer-events-none absolute inset-0 z-[1]"
              style={noiseOverlayStyle}
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

        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-4 pt-4 sm:px-6 lg:px-8">
          <header className="mb-12 text-center sm:mb-16">
            <p
              className={`mb-4 font-merriweather text-sm sm:mb-6 sm:text-base md:text-lg ${theme === "dark" ? "text-white/70" : "text-[#1b3d36]/70"}`}
            >
              Our Goal
            </p>
            <h2
              className={`font-italiana text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${theme === "dark" ? "text-white" : "text-[#1b3d36]"}`}
            >
              <span className="font-light">Creating impact for businesses in </span>
              <span className="relative -top-[2px] inline-flex min-w-[6ch] items-center justify-center overflow-hidden rounded-xl bg-black px-3 py-1 align-middle text-white">
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mediaAssets.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative mx-auto flex w-full max-w-[340px] flex-col sm:max-w-none">
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl"
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

                  <div
                    data-portfolio-card={index}
                    className="relative w-full flex-shrink-0 overflow-hidden rounded-t-xl"
                    style={{ aspectRatio: "3 / 4", zIndex: 10 }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onMouseMove={(event) => {
                      if (hoveredCard !== index) return;
                      const rect = event.currentTarget.getBoundingClientRect();
                      createPortfolioTriangle(
                        event.clientX - rect.left,
                        event.clientY - rect.top,
                      );
                    }}
                  >
                    {item.type === "image" ? (
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 260px"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.src}
                        muted
                        loop
                        playsInline
                        autoPlay
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}

                    {hoveredCard === index && portfolioCardTriangles[index] && (
                      <div className="pointer-events-none absolute inset-0 z-[15] overflow-hidden rounded-t-xl">
                        {portfolioCardTriangles[index].map((triangle) => (
                          <TriangleSVG key={triangle.id} triangle={triangle} />
                        ))}
                      </div>
                    )}

                    <div
                      className={`pointer-events-none absolute bottom-0 left-0 right-0 z-20 overflow-hidden transition-all duration-300 ${
                        hoveredCard === index
                          ? "translate-y-0 opacity-100"
                          : "translate-y-full opacity-0"
                      }`}
                      style={{ height: "18%" }}
                    >
                      <svg
                        className="absolute bottom-0 left-0 h-full w-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M 0 100 L 30 35 C 38 25, 44 20, 50 20 C 56 20, 62 25, 70 35 L 100 100 Z"
                          fill="#74f5a1"
                        />
                      </svg>
                      <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center sm:bottom-4">
                        <h3 className="mb-0.5 text-[10px] font-medium text-[#013825] sm:text-[11px]">
                          {item.title}
                        </h3>
                        <p className="text-[9px] font-medium text-[#013825] sm:text-[10px]">
                          {item.metric}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="relative z-10 flex h-[132px] w-full flex-col justify-center rounded-b-xl transition-colors duration-300 sm:h-[148px]"
                    onMouseEnter={() => setHoveredBottomSection(index)}
                    onMouseLeave={() => setHoveredBottomSection(null)}
                  >
                    <Link href={item.link} className="block h-full">
                      <div className="flex h-full flex-col justify-center px-4 py-5 sm:px-6 sm:py-6">
                        <h3
                          className="mb-2 text-base font-bold transition-colors duration-300 sm:text-lg"
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
                              className="rounded-full border px-3 py-1 text-xs transition-colors duration-300"
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

          {portfolioTriangles.map((triangle) => (
            <TriangleSVG key={triangle.id} triangle={triangle} />
          ))}
        </div>
      </section>
    </div>
  );
}
