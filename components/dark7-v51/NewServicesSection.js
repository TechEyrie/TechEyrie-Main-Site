// components/NewServicesSection.jsx
"use client";

import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import {
  DARK7_GRADIENTS,
  DARK7_GRADIENT_NOISE_STYLE,
} from "./dark7PageGradients";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServicesRightWingScene from "./ServicesRightWingScene";

const SERVICES = [
  {
    id: "automation",
    title: "Business Automation & AI Enablement",
    titleLine1: "Business Automation &",
    titleLine2: "AI Enablement",
    description:
      "Transforming critical business processes through AI-enabled workflows and intelligent agents by delivering efficient work and reducing manual working so your team can focus on creativity, growth and strategy.",
  },
  {
    id: "data",
    title: "Data & Decision Intelligence",
    titleLine1: "Data & Decision",
    titleLine2: "Intelligence",
    description:
      "We build unified data and systems that bring everything into focus. No delays or uncertainty, just real-time Visibility into risk and opportunity, giving the leadership the confidence to lead. Every system transforms raw data into insights so your business doesn't just react, it predicts.",
  },
  {
    id: "platforms",
    title: "Custom Digital Platforms",
    titleLine1: "Custom Digital Platforms",
    titleLine2: null,
    description:
      "Every platform is tailored to your business aligned with workflow, data and long-term visions not by generic templates. Resulting in a foundation of robust, evolved and intelligent elevating your business with clarity, precision and control.",
  },
];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function ServiceArrowLink({ href, label, className = "", onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center overflow-hidden rounded-[4px] dark7-v51-header-arrow-btn transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-[1px] flex-shrink-0 ${className}`}
      aria-label={label}
    >
      <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0">
        <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M1 13L13 1M13 1H5M13 1V9"
            fill="none"
            stroke="#F7F3F0"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="absolute inset-0 flex items-center justify-center translate-x-[-10px] translate-y-[10px] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
        <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M1 13L13 1M13 1H5M13 1V9"
            fill="none"
            stroke="#162D24"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}

export default function NewServicesSection({ theme = "dark", sharedBackground = false }) {
  const [activeId, setActiveId] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef(null);
  const titleContainerRef = useRef(null);
  const hasAnimatedInViewport = useRef(false);
  const isDesktopRef = useRef(false);

  const surfaceIsLight = true;

  const bgStyle = {
    background: DARK7_GRADIENTS.newServices,
  };

  const headingColor = surfaceIsLight
    ? "text-[#162D24]"
    : theme === "dark"
      ? "text-[#f3f3f3]"
      : "text-[#162D24]";
  const bodyColor = surfaceIsLight
    ? "text-[#162D24]"
    : theme === "dark"
      ? "text-[#d0d0d0]"
      : "text-[#162D24]";

  const noiseOverlayStyle = DARK7_GRADIENT_NOISE_STYLE;

  const triggerFadeInAnimation = useCallback(() => {
    const targets = sectionRef.current?.querySelectorAll(".new-services-fade");
    if (!targets?.length) return;

    gsap.fromTo(
      targets,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
      },
    );
  }, []);

  useLayoutEffect(() => {
    const targets = sectionRef.current?.querySelectorAll(".new-services-fade");
    if (!targets?.length) return;
    gsap.set(targets, { opacity: 0, y: 28 });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedInViewport.current) {
            hasAnimatedInViewport.current = true;
            triggerFadeInAnimation();
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(section);
    return () => observer.unobserve(section);
  }, [triggerFadeInAnimation]);

  const handleCardHover = useCallback((serviceId) => {
    if (!isDesktopRef.current) return;
    setActiveId(serviceId);
  }, []);

  const handleCardLeave = useCallback(() => {
    if (!isDesktopRef.current) return;
    setActiveId(null);
  }, []);

  const handleMobileCardSelect = useCallback((serviceId) => {
    setActiveId((current) => (current === serviceId ? current : serviceId));
  }, []);

  useEffect(() => {
    const checkViewport = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      isDesktopRef.current = desktop;
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    if (isDesktop) return;
    setActiveId((current) => current ?? SERVICES[0].id);
  }, [isDesktop]);

  const desktopCardGridStyle = isDesktop
    ? {
        gridTemplateColumns:
          activeId === "automation"
            ? "1.2fr 0.8fr"
            : activeId === "data"
              ? "0.8fr 1.2fr"
              : "1fr 1fr",
        gridTemplateRows:
          activeId === "platforms" ? "0.45fr 0.55fr" : "0.5fr 0.5fr",
      }
    : undefined;

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .text-transition { transition: color 0.5s ease; }
      .bg-transition { transition: background-color 0.5s ease, border-color 0.5s ease; }

      .service-card {
        transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1),
                   box-shadow 0.7s cubic-bezier(0.34, 1.56, 0.64, 1),
                   background-color 0.5s ease,
                   border-color 0.5s ease;
      }

      @media (max-width: 1023px) {
        .service-card {
          transition: background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }
      }

      .dark7-v51-header-arrow-btn {
        background-color: #162d24;
        transition:
          background-color 0.5s ease,
          transform 0.5s ease;
      }

      .group:hover .dark7-v51-header-arrow-btn,
      .new-services-card:hover .dark7-v51-header-arrow-btn {
        background-color: #f7f3f0;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="dark7-v51-new-services relative overflow-hidden py-0 bg-transition"
        style={
          theme === "dark" || !sharedBackground
            ? bgStyle
            : { background: "transparent", backgroundColor: "transparent" }
        }
      >
        {theme === "dark" && !sharedBackground && (
          <>
            <div
              className="absolute inset-0 pointer-events-none z-[1]"
              style={noiseOverlayStyle}
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

        {/*
          Left wing canvas layer (screen layout) — v12 inverse of v11 right wing:
          - left-0 = anchored to left edge of section
          - w-[…] = how far the wing layer extends toward the text
            smaller width = wing stays more left; larger = reaches further right
          3D pose / rotation → ServicesRightWingScene.js (REST / EXIT / CAMERA)
        */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-full min-h-[520px] sm:w-[85%] lg:w-[58%] xl:w-[54%]">
          <ServicesRightWingScene sectionRef={sectionRef} />
        </div>

        <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8">
          <div className="new-services-fade mb-6 flex items-center gap-2 sm:mb-8 sm:gap-3">
            <Image
              src="/feather-heading.png"
              alt=""
              width={40}
              height={40}
              className="h-5 w-auto shrink-0 sm:h-6 md:h-7 lg:h-8"
              aria-hidden
            />
            <span className="dark7-v51-section-eyebrow font-playfair font-normal text-[#162D24]">
              Our services
            </span>
          </div>

          <div className="grid lg:grid-cols-[25%_1fr] gap-8 lg:gap-40 mb-8">
            <div className="hidden lg:block" aria-hidden />
            <div ref={titleContainerRef}>
              <h2 className="leading-[1.08] sm:leading-[1.05] tracking-[0.01em]">
                <div
                  className={`new-services-fade new-services-title-line text-transition ${headingColor}`}
                >
                  <span className="font-italiana font-light tracking-[0.01em]">
                    Business Systems Built
                  </span>
                </div>
                <div
                  className={`new-services-fade new-services-title-line text-transition ${headingColor}`}
                >
                  <span className="font-merriweather font-light">for </span>
                  <span className="font-playfair font-light italic tracking-[0.01em]">
                    Clarity
                  </span>
                </div>
              </h2>
            </div>
          </div>

          <div className="mb-8 flex flex-col gap-8 lg:hidden">
            <p
              className={`new-services-fade font-merriweather text-[14px] sm:text-[15px] font-light leading-relaxed text-transition new-services-surface-body ${bodyColor}`}
            >
              Growth is thrilling until it meets complexity. Tools expand, processes slow down, and
              visibility slips. Once felt controllable turns into uncontrollable.
            </p>
            <p
              className={`new-services-fade font-merriweather text-[14px] sm:text-[15px] font-light leading-relaxed text-transition new-services-surface-body ${bodyColor}`}
            >
              But Tech Eyrie brings back clarity, creating connected systems that make work viable,
              bringing data into focus, and automating decisions, turning operations into a
              high-performing engine for impressive success.
            </p>
          </div>

          {/* Content column only — wing lives in the left absolute layer */}
          <div className="grid lg:grid-cols-[25%_1fr] lg:gap-40">
            <div className="hidden lg:block min-h-[520px]" aria-hidden />

            <div className="flex flex-col w-full min-w-0 gap-8">
              <div className="hidden lg:flex lg:flex-col lg:gap-8 max-w-full">
                <p
                  className={`new-services-fade font-merriweather text-[13px] xl:text-[15px] font-light leading-relaxed text-transition new-services-surface-body ${bodyColor}`}
                >
                  Growth is thrilling until it meets complexity. Tools expand, processes slow down,
                  and visibility slips. Once felt controllable turns into uncontrollable.
                </p>
                <p
                  className={`new-services-fade font-merriweather text-[13px] xl:text-[15px] font-light leading-relaxed text-transition new-services-surface-body ${bodyColor}`}
                >
                  But Tech Eyrie brings back clarity, creating connected systems that make work
                  viable, bringing data into focus, and automating decisions, turning operations into
                  a high-performing engine for impressive success.
                </p>
              </div>

              <div
                className={
                  isDesktop
                    ? "grid h-full gap-0.5 md:gap-1 transition-all duration-700 ease-out"
                    : "flex flex-col gap-3 sm:gap-4"
                }
                style={desktopCardGridStyle}
              >
                {SERVICES.map((service, index) => {
                  const isActive = activeId === service.id;

                  return (
                    <article
                      key={service.id}
                      role={!isDesktop ? "button" : undefined}
                      tabIndex={!isDesktop ? 0 : undefined}
                      onClick={() => !isDesktop && handleMobileCardSelect(service.id)}
                      onKeyDown={(event) => {
                        if (isDesktop) return;
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleMobileCardSelect(service.id);
                        }
                      }}
                      onMouseEnter={() => isDesktop && handleCardHover(service.id)}
                      onMouseLeave={() => isDesktop && handleCardLeave()}
                      className={`
                        service-card new-services-card new-services-fade group relative flex flex-col
                        rounded-xl sm:rounded-2xl border border-black/6
                        bg-[#F2F0EC40]
                        transition-all duration-500 ease-out
                        ${
                          isDesktop
                            ? "justify-between px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-4 lg:px-7 lg:py-5"
                            : "px-4 py-4 sm:px-5 sm:py-5 cursor-pointer"
                        }
                        ${isDesktop && index === 2 ? "col-span-2" : ""}
                        ${
                          !isDesktop && isActive
                            ? "border-[#74F5A1]/40 shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
                            : ""
                        }
                      `}
                    >
                      <div className={`${!isDesktop ? "flex items-start justify-between gap-3" : ""}`}>
                        <h3
                          className={`new-services-card-title font-merriweather font-normal tracking-tight leading-snug text-[#162D24] text-transition ${
                            isDesktop
                              ? "text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]"
                              : "text-[16px] sm:text-[17px] pr-2"
                          }`}
                        >
                          {service.titleLine2 ? (
                            <>
                              {service.titleLine1}
                              <br />
                              {service.titleLine2}
                            </>
                          ) : (
                            service.titleLine1
                          )}
                        </h3>

                        {!isDesktop && (
                          <ServiceArrowLink
                            href={`/services/${service.id}`}
                            label={`Learn more about ${service.title}`}
                            onClick={(event) => event.stopPropagation()}
                          />
                        )}
                      </div>

                      <div
                        className={`${
                          isDesktop
                            ? "mt-2 sm:mt-3 flex items-end justify-between gap-3 sm:gap-4"
                            : isActive
                              ? "mt-3 sm:mt-4 block"
                              : "hidden"
                        }`}
                      >
                        <p
                          className={`new-services-card-body font-merriweather font-normal leading-relaxed text-[#162D24] text-transition ${
                            isDesktop
                              ? "max-w-full sm:max-w-[350px] md:max-w-[450px] text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] leading-snug transition-all duration-500 ease-out"
                              : "text-[14px] sm:text-[15px] leading-relaxed"
                          } ${
                            isDesktop
                              ? isActive
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-4 pointer-events-none"
                              : "opacity-100 translate-y-0"
                          }`}
                        >
                          {service.description}
                        </p>

                        {isDesktop && (
                          <ServiceArrowLink
                            href={`/services/${service.id}`}
                            label={`Learn more about ${service.title}`}
                          />
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

