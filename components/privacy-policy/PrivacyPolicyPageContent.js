"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dark7MainSurfaceStyle } from "../dark7/dark7PageSurface";
import { PRIVACY_SECTIONS } from "./privacyData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function LuxuryCornerBracket({ className, flip }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `privacy-bracket-${uid}`;
  return (
    <svg
      className={className}
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M2 22V2h20M50 2h20v20M2 50v20h20M50 70h20V50"
        stroke={`url(#${gradId})`}
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a7b431" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#74F5A1" stopOpacity="0.35" />
          <stop offset="1" stopColor="#a7b431" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function PrivacyPolicyPageContent() {
  const heroRef = useRef(null);
  const heroInnerRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const bridgeRef = useRef(null);
  const lineRef = useRef(null);
  const orbA = useRef(null);
  const orbB = useRef(null);
  const orbC = useRef(null);

  const [activeId, setActiveId] = useState(PRIVACY_SECTIONS[0]?.id ?? "");
  const [hasTitleAnimated, setHasTitleAnimated] = useState(false);

  const triggerElectricalTitle = useCallback(() => {
    if (hasTitleAnimated) return;
    const lines = document.querySelectorAll(".privacy-page-title-line");
    if (!lines.length) return;

    const electricColor = "#74F5A1";
    const bright = "#FFFFFF";

    const tl = gsap.timeline({
      onComplete: () => {
        document.querySelectorAll(".privacy-page-title-line .char").forEach((c) => {
          c.style.color = "";
          c.style.transform = "";
        });
        setHasTitleAnimated(true);
      },
    });

    lines.forEach((line, lineIndex) => {
      if (!line.querySelector(".char")) {
        const text = line.textContent;
        line.innerHTML = text
          .split("")
          .map(
            (c) =>
              `<span class="char" style="display:inline-block">${c === " " ? "&nbsp;" : c}</span>`
          )
          .join("");
      }
      const lineColor = line.classList.contains("font-playfair") ? "#e8e4dc" : "#f3f3f3";
      line.querySelectorAll(".char").forEach((char, charIndex) => {
        const baseDelay = lineIndex * 0.45 + charIndex * 0.05;
        const totalDelay = baseDelay + Math.random() * 0.08;
        tl.to(
          char,
          { duration: 0.12, color: bright, scale: 1.06, ease: "power2.out", delay: totalDelay },
          0
        )
          .to(
            char,
            {
              duration: 0.18,
              color: electricColor,
              scale: 1.02,
              ease: "sine.inOut",
              delay: totalDelay + 0.12,
            },
            0
          )
          .to(
            char,
            {
              duration: 0.28,
              color: lineColor,
              scale: 1,
              ease: "power2.in",
              delay: totalDelay + 0.32,
            },
            0
          );
      });
    });
  }, [hasTitleAnimated]);

  useEffect(() => {
    const el = titleRef.current;
    if (!el || hasTitleAnimated) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(triggerElectricalTitle, 200);
          obs.disconnect();
        }
      },
      { threshold: 0.45, rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggerElectricalTitle, hasTitleAnimated]);

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.028) 1px, rgba(255, 255, 255, 0.028) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.028) 1px, rgba(255, 255, 255, 0.028) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.012) 2px, rgba(255, 255, 255, 0.012) 4px)
    `,
  };

  useLayoutEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(orbA.current, {
        y: -22,
        x: 12,
        scale: 1.06,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(orbB.current, {
        y: 18,
        x: -16,
        scale: 1.04,
        duration: 6.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(orbC.current, {
        y: -12,
        x: -10,
        scale: 1.05,
        duration: 7.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0.15, opacity: 0.3 },
        {
          scaleX: 1,
          opacity: 0.55,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 75%",
            end: "bottom 40%",
            scrub: 1,
          },
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!heroInnerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".privacy-hero-reveal", {
        y: 32,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.15,
      });
    }, heroInnerRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!bridgeRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".privacy-bridge-reveal", {
        immediateRender: false,
        scrollTrigger: {
          trigger: bridgeRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, bridgeRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".privacy-section-card").forEach((card) => {
        gsap.from(card, {
          immediateRender: false,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      });

      gsap.from(".privacy-toc-reveal", {
        immediateRender: false,
        scrollTrigger: {
          trigger: ".privacy-toc-panel",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        x: -28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
      gsap.from(".privacy-mobile-toc-reveal", {
        immediateRender: false,
        scrollTrigger: {
          trigger: ".privacy-mobile-toc-reveal",
          start: "top 92%",
          toggleActions: "play none none none",
        },
        y: 20,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
      });
      gsap.from(".privacy-cta-block", {
        immediateRender: false,
        scrollTrigger: {
          trigger: ".privacy-cta-block",
          start: "top 88%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, contentRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const t = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const nodes = PRIVACY_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!nodes.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-18% 0px -52% 0px", threshold: [0, 0.12, 0.25] }
    );

    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(sectionId);
    }
  };

  const TocButton = ({ section, compact }) => {
    const Icon = section.Icon;
    const isActive = activeId === section.id;
    return (
      <button
        type="button"
        onClick={() => scrollToSection(section.id)}
        className={`privacy-toc-btn group flex w-full items-center gap-3 rounded-xl border text-left transition-all duration-300 ${
          isActive ? "privacy-toc-btn-active" : ""
        } ${compact ? "shrink-0 px-4 py-2.5 sm:px-5" : "px-4 py-3.5"} ${
          isActive
            ? "border-[#74F5A1]/40 bg-[rgba(116,245,161,0.12)] shadow-[0_0_28px_rgba(116,245,161,0.12)]"
            : "border-white/[0.1] bg-[rgba(255,255,255,0.03)] hover:border-[#a7b431]/35 hover:bg-[rgba(255,255,255,0.05)]"
        }`}
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
            isActive ? "bg-[#74F5A1]" : "bg-white/[0.06]"
          }`}
        >
          <Icon
            className="h-4 w-4"
            color={isActive ? "#000000" : "#74F5A1"}
            strokeWidth={1.75}
          />
        </span>
        <span className="font-merriweather text-[12px] sm:text-[13px] font-medium leading-snug text-[#f3f3f3] min-w-0">
          {compact ? (
            <span className="block max-w-[200px] truncate sm:max-w-none">{section.title}</span>
          ) : (
            section.title
          )}
        </span>
      </button>
    );
  };

  return (
    <div className="relative overflow-x-hidden">
      <section
        ref={heroRef}
        className="relative min-h-[88svh] flex flex-col sm:min-h-[92svh]"
        style={dark7MainSurfaceStyle}
      >
        <div
          className="faqs-luxury-mesh pointer-events-none absolute inset-0 z-[1] opacity-40 mix-blend-soft-light"
          style={{
            background: `
              radial-gradient(ellipse 85% 55% at 12% 8%, rgba(167, 180, 49, 0.12), transparent 52%),
              radial-gradient(ellipse 70% 50% at 90% 72%, rgba(116, 245, 161, 0.08), transparent 48%),
              radial-gradient(ellipse 45% 35% at 52% 38%, rgba(18, 104, 91, 0.18), transparent 55%)
            `,
          }}
        />
        <div className="absolute inset-0 pointer-events-none z-[1]" style={noiseOverlayStyle} />
        <div
          className="absolute inset-x-0 top-0 h-48 sm:h-56 md:h-64 pointer-events-none z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,81,96,0.5) 0%, rgba(0,81,96,0.12) 50%, rgba(0,81,96,0) 100%)",
          }}
        />
        <div
          className="faqs-luxury-hero-frame absolute inset-x-0 top-[40%] mx-auto h-px max-w-5xl opacity-30 pointer-events-none z-[1]"
          aria-hidden
        />

        <div
          ref={orbA}
          className="pointer-events-none absolute -right-24 top-24 h-[460px] w-[460px] rounded-full z-[1] opacity-[0.16]"
          style={{
            background: "radial-gradient(circle, rgba(116,245,161,0.5) 0%, transparent 62%)",
            filter: "blur(40px)",
          }}
        />
        <div
          ref={orbB}
          className="pointer-events-none absolute -left-32 bottom-32 h-[380px] w-[380px] rounded-full z-[1] opacity-[0.13]"
          style={{
            background: "radial-gradient(circle, rgba(0,81,96,0.72) 0%, transparent 65%)",
            filter: "blur(44px)",
          }}
        />
        <div
          ref={orbC}
          className="pointer-events-none absolute right-[16%] bottom-[10%] h-[280px] w-[280px] rounded-full z-[1] opacity-[0.11]"
          style={{
            background: "radial-gradient(circle, rgba(224,209,182,0.22) 0%, transparent 68%)",
            filter: "blur(36px)",
          }}
        />

        <LuxuryCornerBracket className="pointer-events-none absolute left-4 top-28 z-[2] opacity-70 sm:left-8 md:left-10 lg:top-32" />
        <LuxuryCornerBracket
          className="pointer-events-none absolute right-4 bottom-20 z-[2] opacity-70 sm:right-8 md:right-10"
          flip
        />

        <div
          ref={heroInnerRef}
          className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-center px-4 pt-28 pb-16 sm:px-6 sm:pt-32 sm:pb-20 md:px-8 md:pt-36 md:pb-24 lg:px-10"
        >
          <div
            ref={lineRef}
            className="mb-10 h-px w-full max-w-lg origin-left bg-gradient-to-r from-[#74F5A1] via-[#a7b431]/70 to-transparent sm:mb-12"
            aria-hidden
          />

          <div className="privacy-hero-reveal mb-7 flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-7">
            <span className="inline-flex h-[2px] w-10 shrink-0 bg-gradient-to-r from-[#a7b431] to-[#74F5A1] sm:w-14" />
            <div className="flex items-center gap-3 sm:gap-4">
              <Shield className="h-4 w-4 shrink-0 text-[#74F5A1] sm:h-5 sm:w-5" strokeWidth={1.5} />
              <span className="font-merriweather text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-semibold uppercase tracking-[0.16em] text-[#f3f3f3]">
                Legal & trust
              </span>
            </div>
            <span className="hidden sm:inline font-playfair text-[12px] italic text-[#a7b431]/75">
              Confidentiality first
            </span>
          </div>

          <h1
            ref={titleRef}
            className="privacy-page-heading max-w-5xl font-italiana font-light leading-[1.05] tracking-[0.012em] text-[#f3f3f3]"
          >
            <span className="privacy-page-title-line block text-[34px] sm:text-[44px] md:text-[54px] lg:text-[64px] xl:text-[76px] 2xl:text-[86px]">
              Privacy, composed with
            </span>
            <span className="privacy-page-title-line block font-playfair font-semibold italic text-[34px] sm:text-[44px] md:text-[54px] lg:text-[64px] xl:text-[76px] 2xl:text-[86px] text-[#e8e4dc]">
              clarity & restraint
            </span>
          </h1>

          <p className="privacy-hero-reveal mt-10 max-w-xl border-l border-[#a7b431]/35 pl-6 font-merriweather text-[13px] sm:text-[14px] md:text-[15px] leading-[1.9] text-[#c8c2ad]">
            At Tech Eyrie, privacy is one of our core priorities. Every piece of information
            you share is handled with precision, respect, and intention. Our approach reflects
            the same rigor we apply when building strategy.
          </p>

        </div>
      </section>

      <section
        className="relative border-t border-white/[0.09] py-12 sm:py-16 md:py-20 lg:py-24"
        style={dark7MainSurfaceStyle}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.35]" style={noiseOverlayStyle} />
        <div
          className="pointer-events-none absolute right-0 top-0 h-[50%] w-[42%] max-w-lg opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle at 100% 0%, rgba(167,180,49,0.45), transparent 72%)",
          }}
        />

        <div ref={contentRef} className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-10">
          <div
            ref={bridgeRef}
            className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center lg:mb-14"
          >
            <div className="privacy-bridge-reveal mb-6 flex w-full max-w-sm items-center gap-3 sm:max-w-md">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#a7b431]/25" />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#a7b431]/35 bg-[rgba(167,180,49,0.06)] text-[#a7b431]">
                <span className="font-playfair text-base leading-none">◇</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#a7b431]/25" />
            </div>
            <p className="privacy-bridge-reveal font-italiana text-[26px] text-[#e0d1b6] sm:text-[30px] md:text-[36px]">
              Policy sections
            </p>
            <p className="privacy-bridge-reveal mt-2 font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-regular uppercase tracking-[0.16em] text-[#a0a0a0]">
              Navigate with ease
            </p>
          </div>

          <div className="privacy-mobile-toc-reveal mb-10 flex gap-2 overflow-x-auto pb-2 lg:hidden [-webkit-overflow-scrolling:touch]">
            {PRIVACY_SECTIONS.map((section) => (
              <TocButton key={section.id} section={section} compact />
            ))}
          </div>

          <div className="flex flex-col gap-12 lg:flex-row lg:gap-14 xl:gap-20">
            <aside className="privacy-toc-reveal hidden lg:block lg:w-80 xl:w-[22rem] lg:flex-shrink-0">
              <div className="privacy-toc-panel sticky top-28 rounded-2xl border border-white/[0.11] bg-[rgba(12,22,18,0.55)] p-6 backdrop-blur-xl shadow-[0_28px_64px_-20px_rgba(0,0,0,0.5)] xl:p-7">
                <p className="mb-5 font-italiana text-xl text-[#e0d1b6] xl:text-2xl">Contents</p>
                <nav className="flex max-h-[calc(100vh-11rem)] flex-col gap-2 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
                  {PRIVACY_SECTIONS.map((section) => (
                    <TocButton key={section.id} section={section} compact={false} />
                  ))}
                </nav>
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              {PRIVACY_SECTIONS.map((section) => {
                const Icon = section.Icon;
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="privacy-section-card faqs-lux-card relative mb-8 scroll-mt-28 overflow-hidden rounded-2xl border border-white/[0.11] bg-[rgba(12,22,18,0.45)] backdrop-blur-xl transition-all duration-500 last:mb-0 hover:border-[#a7b431]/22 sm:mb-10"
                  >
                    <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[#a7b431]/50 via-[#74F5A1]/22 to-transparent opacity-90" />
                    <div className="relative p-7 sm:p-9 md:p-10 lg:p-11">
                      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#74F5A1] ring-1 ring-[#74F5A1]/40 shadow-[0_0_28px_rgba(116,245,161,0.2)]">
                          <Icon className="h-6 w-6" color="#000000" strokeWidth={1.65} />
                        </div>
                        <h2 className="font-italiana text-[26px] font-light leading-tight text-[#f3f3f3] sm:text-[30px] md:text-[34px]">
                          {section.title}
                        </h2>
                      </div>
                      <div className="relative">
                        <div
                          className="absolute left-0 top-1 bottom-2 w-px bg-gradient-to-b from-[#a7b431]/50 to-transparent sm:top-2"
                          aria-hidden
                        />
                        <p className="whitespace-pre-line pl-5 font-merriweather text-[13px] sm:text-[14px] md:text-[15px] leading-[1.92] text-[#d4cfc3] sm:pl-6">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </section>
                );
              })}

              <div className="privacy-cta-block faqs-lux-cta-panel relative mt-14 overflow-hidden rounded-[28px] border border-white/[0.1] px-7 py-12 text-center sm:mt-20 sm:px-10 sm:py-14 md:px-14 md:py-20">
                <div
                  className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full opacity-30"
                  style={{
                    background: "radial-gradient(circle, rgba(116,245,161,0.35), transparent 70%)",
                    filter: "blur(32px)",
                  }}
                />
                <div
                  className="pointer-events-none absolute -right-12 bottom-0 h-40 w-40 rounded-full opacity-25"
                  style={{
                    background: "radial-gradient(circle, rgba(167,180,49,0.4), transparent 70%)",
                    filter: "blur(28px)",
                  }}
                />

                <p className="font-merriweather text-[10px] uppercase tracking-[0.28em] text-[#74F5A1]/90">
                  We&apos;re here
                </p>
                <p className="mx-auto mt-4 max-w-lg font-italiana text-[24px] leading-tight text-[#e0d1b6] sm:text-[30px] md:text-[36px]">
                  Want to know more about this policy?
                </p>
                <p className="mx-auto mt-4 max-w-md font-playfair text-[14px] italic leading-relaxed text-[#b5ae9c] sm:text-[15px]">
                  Reach out directly- your questions are treated with the same attention as your information.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
                  <a
                    href="mailto:hello@dapper.agency"
                    className="privacy-cta-link inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 shadow-[0_12px_40px_-8px_rgba(18,104,91,0.55)] transition-all duration-300 ease-out hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-[0_16px_48px_-8px_rgba(18,104,91,0.65)]"
                    style={{ backgroundColor: "#12685b" }}
                  >
                    <span className="font-merriweather text-[14px] sm:text-[15px] font-semibold tracking-[0.06em] text-white">
                      Email us
                    </span>
                    <span className="text-white/90" aria-hidden>
                      →
                    </span>
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-[rgba(255,255,255,0.04)] px-8 py-3.5 font-merriweather text-[14px] font-semibold text-[#e8e4dc] transition-all duration-300 hover:border-[#a7b431]/35 hover:bg-[rgba(255,255,255,0.07)]"
                  >
                    Speak with us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
