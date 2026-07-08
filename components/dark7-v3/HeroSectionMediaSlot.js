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

  const containerRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroPinRef = useRef(null);
  const heroContentRef = useRef(null);
  const titleContainerRef = useRef(null);
  const portfolioSectionRef = useRef(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [outgoingCity, setOutgoingCity] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const openCaseStudy = useCallback(
    (href) => {
      router.push(href);
    },
    [router],
  );

  useLayoutEffect(() => {
    const content = heroContentRef.current;
    if (!content) return;

    gsap.set(content, { opacity: 1, y: 0 });

    return () => {
      gsap.set(content, { clearProps: "opacity,y" });
    };
  }, [theme]);

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

  return (
    <div
      ref={containerRef}
      className="relative w-full"
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

      <section
        ref={heroSectionRef}
        className={`dark7-v3-hero relative overflow-x-hidden${
          theme === "dark" ? " dark7-v3-hero-eagle" : ""
        }`}
        style={theme === "dark" && !sharedBackground ? dark7HeroSurfaceStyle() : undefined}
      >
        <div
          ref={heroPinRef}
          className="relative z-[1] h-[100svh] min-h-[100svh] w-full overflow-hidden pt-32 md:pt-40"
        >
          {theme === "dark" && (
            // Eagle 3D scene — position is controlled in:
            // components/dark7-three1/EagleScrollScene.js (search "EAGLE POSITION")
            <EagleScrollScene
              backgroundOnly
              pinTargetRef={heroPinRef}
            />
          )}

          <div
            ref={heroContentRef}
            className="dark7-v3-hero-content relative z-10 mx-auto flex w-full max-w-[1800px] flex-col px-4 pt-12 md:px-6 lg:px-10"
          >
            <div className="flex w-full flex-col items-start text-left">
            <div className="hero-badge mb-16 flex items-center gap-3">
              <span
                className="inline-flex h-5 w-5 rounded-sm"
                style={{
                  backgroundColor:
                    theme === "dark" ? darkColors.primary : lightColors.primary,
                }}
              />
              <span
                className={`font-merriweather text-[13px] font-semibold uppercase tracking-[0.16em] md:text-[15px] ${theme === "dark" ? "text-white/90" : "text-[#212121]"}`}
              >
                AI & Automation Partner
              </span>
            </div>

            <div
              ref={titleContainerRef}
              className="dark7-v3-hero-title w-full max-w-full lg:max-w-[1600px] xl:max-w-[1800px]"
            >
              <h1 className="font-italiana tracking-[-0.03em]">
                <span
                  className={`hero-main-title-line block text-[32px] leading-[1.08] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px] ${theme === "dark" ? "text-white" : "text-[#1b3d36]"}`}
                >
                  <span className="font-light">AI Systems </span>
                  <span className="font-playfair text-[0.94em] italic tracking-[0.03em]">
                    that turns
                  </span>
                </span>
                <span
                  className={`hero-main-title-line -mt-1 block text-[32px] leading-[1.08] font-light sm:-mt-1.5 sm:text-[42px] md:-mt-2 md:text-[58px] lg:-mt-2.5 lg:text-[72px] xl:-mt-3 xl:text-[88px] 2xl:-mt-3.5 2xl:text-[104px] ${theme === "dark" ? "text-white" : "text-[#1b3d36]"}`}
                >
                  workflows into Profit
                </span>
              </h1>
            </div>

            <div className="hero-body w-full max-w-full pt-8 sm:pt-12 lg:max-w-[640px] lg:pt-20">
              <p
                className={`mb-2 font-merriweather text-[17px] font-light leading-relaxed md:mb-2.5 md:text-[22px] md:leading-relaxed ${theme === "dark" ? "text-white/85" : "text-[#1b3d36]/90"}`}
              >
                Enterprise AI, automation, and custom digital solutions designed to
                simplify complexity, improve performance, and unlock sustainable growth.
              </p>
              <Link
                href="#discover"
                className={`inline-flex items-center justify-center px-5 py-2.5 font-merriweather text-[16px] font-light tracking-tight transition-colors duration-300 md:px-6 md:py-3 md:text-[18px] ${theme === "dark" ? "text-white/90" : "text-[#1b3d36]/90"}`}
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
        </div>
      </section>

      <section
        ref={portfolioSectionRef}
        id="discover"
        className="dark7-v3-portfolio relative w-full overflow-visible py-0"
        style={{ zIndex: 1 }}
      >

        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-4 pt-4 sm:px-6 lg:px-8">
          <header className="mb-12 text-center sm:mb-16">
            <p
              className={`dark7-v3-portfolio-eyebrow mb-4 font-merriweather text-sm sm:mb-6 sm:text-base md:text-lg ${theme === "dark" ? "text-white/70" : "text-[#1b3d36]/70"}`}
            >
              Our Goal
            </p>
            <h2 className="dark7-v3-portfolio-title font-italiana text-3xl leading-tight text-black sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              <span className="dark7-v3-portfolio-title-lead font-light text-black">
                Creating impact for businesses in{" "}
              </span>
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
                <div
                  role="link"
                  tabIndex={0}
                  aria-label={`View case study: ${item.title}`}
                  onClick={() => openCaseStudy(item.link)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openCaseStudy(item.link);
                    }
                  }}
                  className="group relative mx-auto flex w-full max-w-[340px] cursor-pointer flex-col sm:max-w-none"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl"
                    style={{
                      backgroundColor: "#015b4f",
                      zIndex: 0,
                      opacity: hoveredCard === index ? 1 : 0,
                      transform: hoveredCard === index ? "scaleY(1)" : "scaleY(0)",
                      transformOrigin: "top center",
                      transition:
                        "transform 720ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms ease-out",
                    }}
                  />

                  <div
                    data-portfolio-card={index}
                    className="relative w-full flex-shrink-0 overflow-hidden rounded-t-xl"
                    style={{ aspectRatio: "3 / 4", zIndex: 10 }}
                  >
                    {item.type === "image" ? (
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 260px"
                        className="pointer-events-none h-full w-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.src}
                        muted
                        loop
                        playsInline
                        autoPlay
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                      />
                    )}

                  </div>

                  <div className="relative z-10 flex h-[132px] w-full flex-col justify-center rounded-b-xl transition-colors duration-300 sm:h-[148px]">
                    <div className="flex h-full flex-col justify-center px-4 py-5 sm:px-6 sm:py-6">
                      <h3
                        className={`dark7-v3-portfolio-card-title mb-2 text-base font-bold transition-colors duration-300 sm:text-lg${
                          hoveredCard === index ? " is-hovered" : ""
                        }`}
                        style={{
                          color:
                            hoveredCard === index
                              ? "#ffffff"
                              : theme === "dark"
                                ? "#111111"
                                : "#111111",
                        }}
                      >
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {item.buttons.map((button, btnIndex) => (
                          <span
                            key={btnIndex}
                            className={`dark7-v3-portfolio-card-tag rounded-full border px-3 py-1 text-xs transition-colors duration-300${
                              hoveredCard === index ? " is-hovered" : ""
                            }`}
                            style={{
                              borderColor:
                                hoveredCard === index
                                  ? "rgba(255, 255, 255, 0.3)"
                                  : "rgba(0, 0, 0, 0.2)",
                              color:
                                hoveredCard === index
                                  ? "rgba(255, 255, 255, 0.8)"
                                  : "rgba(0, 0, 0, 0.75)",
                            }}
                          >
                            {button}
                          </span>
                        ))}
                      </div>
                    </div>
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
