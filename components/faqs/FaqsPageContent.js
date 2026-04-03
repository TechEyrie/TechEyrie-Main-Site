"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dark7MainSurfaceStyle } from "../dark7/dark7PageSurface";
import { FAQ_ITEMS } from "./faqData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function HeroCornerBracket({ className, flip }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `faq-bracket-${uid}`;
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

export default function FaqsPageContent() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const listRef = useRef(null);
  const bridgeRef = useRef(null);
  const orbA = useRef(null);
  const orbB = useRef(null);
  const orbC = useRef(null);
  const lineRef = useRef(null);

  const [openIndex, setOpenIndex] = useState(null);
  const [hasTitleAnimated, setHasTitleAnimated] = useState(false);

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.028) 1px, rgba(255, 255, 255, 0.028) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.028) 1px, rgba(255, 255, 255, 0.028) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.012) 2px, rgba(255, 255, 255, 0.012) 4px)
    `,
  };

  const triggerElectricalTitle = useCallback(() => {
    if (hasTitleAnimated) return;
    const lines = document.querySelectorAll(".faq-page-title-line");
    if (!lines.length) return;

    const electricColor = "#74F5A1";
    const bright = "#FFFFFF";

    const tl = gsap.timeline({
      onComplete: () => {
        document.querySelectorAll(".faq-page-title-line .char").forEach((c) => {
          c.style.color = "";
          c.style.transform = "";
        });
        setHasTitleAnimated(true);
      },
    });

    const charSpan = (c) =>
      `<span class="char" style="display:inline-block">${c === " " ? "&nbsp;" : c}</span>`;

    lines.forEach((line, lineIndex) => {
      if (!line.querySelector(".char")) {
        const text = line.textContent;
        const segments = text.split(/(\s+)/);
        line.innerHTML = segments
          .map((segment) => {
            if (/^\s+$/.test(segment)) {
              return segment.split("").map(charSpan).join("");
            }
            const chars = segment.split("").map(charSpan).join("");
            return `<span class="faq-title-word" style="white-space:nowrap;display:inline-block">${chars}</span>`;
          })
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
    if (!listRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".faq-page-card", {
        immediateRender: false,
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        y: 32,
        opacity: 0,
        duration: 0.75,
        stagger: 0.07,
        ease: "power3.out",
      });
    }, listRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!bridgeRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".faq-bridge-reveal", {
        immediateRender: false,
        scrollTrigger: {
          trigger: bridgeRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        y: 20,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, bridgeRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const t = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(t);
  }, []);

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div className="relative overflow-x-hidden">
      <section
        className="relative min-h-[100svh] flex flex-col"
        style={dark7MainSurfaceStyle}
      >
        <div
          className="faqs-luxury-mesh pointer-events-none absolute inset-0 z-[1] opacity-40 mix-blend-soft-light"
          style={{
            background: `
              radial-gradient(ellipse 85% 55% at 15% 10%, rgba(167, 180, 49, 0.12), transparent 52%),
              radial-gradient(ellipse 70% 50% at 88% 75%, rgba(116, 245, 161, 0.08), transparent 48%),
              radial-gradient(ellipse 45% 35% at 55% 40%, rgba(18, 104, 91, 0.18), transparent 55%)
            `,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={noiseOverlayStyle}
        />
        <div
          className="absolute inset-x-0 top-0 h-48 sm:h-56 md:h-64 pointer-events-none z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,81,96,0.5) 0%, rgba(0,81,96,0.12) 50%, rgba(0,81,96,0) 100%)",
          }}
        />
        <div
          className="faqs-luxury-hero-frame absolute inset-x-0 top-[42%] h-px max-w-5xl mx-auto opacity-30 pointer-events-none z-[1]"
          aria-hidden
        />

        <div
          ref={orbA}
          className="pointer-events-none absolute -right-24 top-28 h-[460px] w-[460px] rounded-full z-[1] opacity-[0.16]"
          style={{
            background:
              "radial-gradient(circle, rgba(116,245,161,0.5) 0%, transparent 62%)",
            filter: "blur(40px)",
          }}
        />
        <div
          ref={orbB}
          className="pointer-events-none absolute -left-32 bottom-36 h-[380px] w-[380px] rounded-full z-[1] opacity-[0.13]"
          style={{
            background:
              "radial-gradient(circle, rgba(0,81,96,0.72) 0%, transparent 65%)",
            filter: "blur(44px)",
          }}
        />
        <div
          ref={orbC}
          className="pointer-events-none absolute right-[18%] bottom-[12%] h-[280px] w-[280px] rounded-full z-[1] opacity-[0.11]"
          style={{
            background:
              "radial-gradient(circle, rgba(224,209,182,0.22) 0%, transparent 68%)",
            filter: "blur(36px)",
          }}
        />

        <HeroCornerBracket className="pointer-events-none absolute left-4 top-28 z-[2] opacity-70 sm:left-8 md:left-10 lg:top-32" />
        <HeroCornerBracket
          className="pointer-events-none absolute right-4 bottom-24 z-[2] opacity-70 sm:right-8 md:right-10"
          flip
        />

        <div
          ref={heroRef}
          className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-center px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24 md:px-8 md:pt-36 md:pb-28 lg:px-10"
        >
          <div
            ref={lineRef}
            className="mb-10 h-px w-full max-w-lg origin-left bg-gradient-to-r from-[#74F5A1] via-[#a7b431]/70 to-transparent sm:mb-12"
            aria-hidden
          />

          <div className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-7">
            <span className="inline-flex h-[2px] w-10 shrink-0 bg-gradient-to-r from-[#a7b431] to-[#74F5A1] sm:w-14" />
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="inline-flex h-3 w-3 shrink-0 rotate-45 border border-[#74F5A1]/80 bg-[#74F5A1]/20 sm:h-3.5 sm:w-3.5" />
              <span className="font-merriweather text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-semibold uppercase tracking-[0.16em] text-[#f3f3f3]">
                Insight Concierge
              </span>
            </div>
            <span className="hidden sm:inline font-playfair text-[12px] italic text-[#a7b431]/75">
              Absolute clarity
            </span>
          </div>

          <h1
            ref={titleRef}
            className="faq-page-heading max-w-5xl font-italiana font-light leading-[1.05] tracking-[0.012em] text-[#f3f3f3]"
          >
            <span className="faq-page-title-line block text-[36px] sm:text-[46px] md:text-[58px] lg:text-[70px] xl:text-[82px] 2xl:text-[92px]">
              Precision Delivered.
            </span>
            <span className="faq-page-title-line block font-playfair font-semibold italic text-[36px] sm:text-[46px] md:text-[58px] lg:text-[70px] xl:text-[82px] 2xl:text-[92px] text-[#e8e4dc]">
              Answers designed to perform.
            </span>
          </h1>

          <p className="mt-10 max-w-xl border-l border-[#a7b431]/35 pl-6 font-merriweather text-[13px] sm:text-[14px] md:text-[15px] leading-[1.9] text-[#c8c2ad]">
            At Tech Eyrie, the Insight Concierge space is where strategy meets elegance. Its editorial environment is
            powered by AI insights (low volume) and sector-specific intelligence, so processes, expectations, and next
            steps are communicated with absolute clarity.
          </p>
        </div>
      </section>

      <section
        className="relative border-t border-white/[0.09] py-14 sm:py-20 md:py-24 lg:py-28"
        style={dark7MainSurfaceStyle}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={noiseOverlayStyle}
        />
        <div
          className="pointer-events-none absolute left-0 top-0 h-[55%] w-[38%] max-w-md opacity-[0.06]"
          style={{
            background: "radial-gradient(circle at 0% 0%, rgba(116,245,161,0.5), transparent 70%)",
          }}
        />

        <div ref={bridgeRef} className="relative z-10 mx-auto max-w-[940px] px-4 sm:px-6 md:px-8">
          <div className="mb-14 flex flex-col items-center sm:mb-16 md:mb-20">
            <div className="flex w-full max-w-md items-center gap-4 sm:max-w-lg">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#a7b431]/25" />
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#a7b431]/35 bg-[rgba(167,180,49,0.06)] text-[#a7b431] shadow-[0_0_24px_rgba(116,245,161,0.08)]">
                <span className="font-playfair text-lg leading-none">◇</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#a7b431]/25" />
            </div>
            <p className="faq-bridge-reveal mt-8 text-center font-italiana text-[28px] text-[#e0d1b6] sm:text-[34px] md:text-[40px] lg:text-[44px]">
              What we&apos;re asked first
            </p>
            <p className="faq-bridge-reveal mt-3 text-center font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-regular uppercase tracking-[0.16em] text-[#a0a0a0]">
              Refined for an effortless read
            </p>
          </div>
        </div>

        <div ref={listRef} className="relative z-10 mx-auto max-w-[920px] px-4 sm:px-6 md:px-8">
          <div className="space-y-5 sm:space-y-6">
            {FAQ_ITEMS.map((item, index) => {
              const open = openIndex === index;
              return (
                <article
                  key={item.question}
                  className={`faq-page-card faqs-lux-card group relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-500 ease-out ${
                    open
                      ? "is-open border-[#74F5A1]/40 bg-[rgba(116,245,161,0.06)] -translate-y-0.5"
                      : "border-white/[0.11] bg-[rgba(12,22,18,0.45)] hover:-translate-y-1 hover:border-[#a7b431]/28 hover:shadow-[0_28px_64px_-18px_rgba(0,0,0,0.55)]"
                  }`}
                >
                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[#a7b431]/50 via-[#74F5A1]/25 to-transparent opacity-80" aria-hidden />

                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => toggle(index)}
                    className="relative flex w-full items-center gap-4 px-5 py-6 text-left sm:gap-6 sm:px-8 sm:py-7 md:px-9 md:py-8"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-500 ease-out ${
                        open
                          ? "rotate-45 scale-105 ring-[#74F5A1]/50 shadow-[0_0_24px_rgba(116,245,161,0.25)]"
                          : "rotate-0 ring-white/10 group-hover:ring-[#a7b431]/35 group-hover:scale-[1.03]"
                      }`}
                      style={{ backgroundColor: "#74F5A1" }}
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 22 22"
                        fill="none"
                        aria-hidden
                      >
                        <line x1="11" y1="3" x2="11" y2="19" stroke="#0d1814" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="3" y1="11" x2="19" y2="11" stroke="#0d1814" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="flex-1 font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-light leading-snug text-[#f3f3f3]">
                      {item.question}
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      open
                        ? "max-h-[min(40rem,120vh)] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="relative px-5 pb-6 sm:px-8 sm:pb-7 md:px-9 md:pb-8">
                      <div
                        className="absolute left-9 top-0 bottom-6 w-px bg-gradient-to-b from-[#a7b431]/65 via-[#74F5A1]/35 to-transparent sm:left-11 md:left-12"
                        aria-hidden
                      />
                      <p className="border-l-0 pl-5 font-playfair text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] leading-relaxed text-[#d0d0d0] sm:pl-6">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-20 max-w-[920px] px-4 sm:mt-28 sm:px-6 md:px-8">
          <div className="faqs-lux-cta-panel relative overflow-hidden rounded-[28px] border border-white/[0.1] px-8 py-12 text-center sm:px-12 sm:py-16 md:px-16 md:py-20">
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
              Connect first, convert later
            </p>
            <p className="mx-auto mt-4 max-w-lg font-italiana text-[26px] leading-tight text-[#e0d1b6] sm:text-[32px] md:text-[38px]">
              Still thinking of your next move?
            </p>
            <p className="mx-auto mt-4 max-w-md font-playfair text-[15px] italic leading-relaxed text-[#b5ae9c] sm:text-[16px]">
              One thoughtful, focused call can replace a week of uncertainty. At Tech Eyrie, we meet you where you
              are—strategic, clear, and actionable.
            </p>
            <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {[
                "AI-powered workflows (low volume)",
                "Analytics tools (medium volume)",
                "AI insights (low volume)",
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-[#a7b431]/30 bg-[rgba(12,22,18,0.55)] px-3 py-1.5 font-merriweather text-[10px] sm:text-[11px] tracking-wide text-[#d0d0d0]"
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-2xl font-merriweather text-[12px] sm:text-[13px] leading-relaxed text-[#a8a59a]">
              Combining medium-volume keywords for broader visibility with low-volume, high-intent keywords for niche
              authority provides a balanced SEO strategy, aligning perfectly with Tech Eyrie&apos;s AI-driven,
              high-conversion, and premium positioning.
            </p>
            <Link
              href="/contact"
              className="faqs-cta-link group mt-10 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 shadow-[0_12px_40px_-8px_rgba(18,104,91,0.55)] transition-all duration-300 ease-out hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-[0_16px_48px_-8px_rgba(18,104,91,0.65)]"
              style={{ backgroundColor: "#12685b" }}
            >
              <span className="font-merriweather text-[14px] sm:text-[15px] font-semibold tracking-[0.06em] text-white">
                Reserve a moment
              </span>
              <span className="text-white/90 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
