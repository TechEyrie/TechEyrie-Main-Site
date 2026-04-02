"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote, Star, Users } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dark7MainSurfaceStyle } from "../dark7/dark7PageSurface";
import { TESTIMONIALS } from "./testimonialsData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function LuxuryCornerBracket({ className, flip }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `testimonials-bracket-${uid}`;
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

export default function TestimonialsPageContent() {
  const heroRef = useRef(null);
  const heroInnerRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const bridgeRef = useRef(null);
  const lineRef = useRef(null);
  const orbA = useRef(null);
  const orbB = useRef(null);
  const orbC = useRef(null);

  const [filter, setFilter] = useState("all");
  const [hasTitleAnimated, setHasTitleAnimated] = useState(false);

  const services = ["all", ...new Set(TESTIMONIALS.map((t) => t.service))];
  const filteredTestimonials =
    filter === "all" ? TESTIMONIALS : TESTIMONIALS.filter((t) => t.service === filter);

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.028) 1px, rgba(255, 255, 255, 0.028) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.028) 1px, rgba(255, 255, 255, 0.028) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.012) 2px, rgba(255, 255, 255, 0.012) 4px)
    `,
  };

  const triggerElectricalTitle = useCallback(() => {
    if (hasTitleAnimated) return;
    const lines = document.querySelectorAll(".testimonials-page-title-line");
    if (!lines.length) return;

    const electricColor = "#74F5A1";
    const bright = "#FFFFFF";

    const tl = gsap.timeline({
      onComplete: () => {
        document.querySelectorAll(".testimonials-page-title-line .char").forEach((c) => {
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
      gsap.from(".testimonials-hero-reveal", {
        y: 32,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.12,
      });
    }, heroInnerRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!bridgeRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".testimonials-bridge-reveal", {
        immediateRender: false,
        scrollTrigger: {
          trigger: bridgeRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, bridgeRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".testimonial-lux-card").forEach((card) => {
        gsap.from(card, {
          immediateRender: false,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          y: 44,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
        });
      });

      gsap.from(".testimonials-stats-block", {
        immediateRender: false,
        scrollTrigger: {
          trigger: ".testimonials-stats-block",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(".testimonials-bottom-cta", {
        immediateRender: false,
        scrollTrigger: {
          trigger: ".testimonials-bottom-cta",
          start: "top 88%",
          toggleActions: "play none none none",
        },
        y: 32,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
      });
    }, contentRef);
    return () => ctx.revert();
  }, [filter, filteredTestimonials.length]);

  useEffect(() => {
    const t = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(t);
  }, [filter]);

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
              radial-gradient(ellipse 82% 52% at 14% 10%, rgba(167, 180, 49, 0.13), transparent 52%),
              radial-gradient(ellipse 68% 48% at 88% 70%, rgba(116, 245, 161, 0.09), transparent 48%),
              radial-gradient(ellipse 42% 34% at 48% 42%, rgba(18, 104, 91, 0.16), transparent 55%)
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
          className="pointer-events-none absolute right-[18%] bottom-[12%] h-[280px] w-[280px] rounded-full z-[1] opacity-[0.11]"
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

          <div className="testimonials-hero-reveal mb-7 flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-7">
            <span className="inline-flex h-[2px] w-10 shrink-0 bg-gradient-to-r from-[#a7b431] to-[#74F5A1] sm:w-14" />
            <div className="flex items-center gap-3 sm:gap-4">
              <Quote className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" color="#74F5A1" strokeWidth={1.6} />
              <span className="font-merriweather text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-semibold uppercase tracking-[0.16em] text-[#f3f3f3]">
                Client chorus
              </span>
            </div>
            <span className="hidden sm:inline font-playfair text-[12px] italic text-[#a7b431]/75">
              Proof in their words
            </span>
          </div>

          <h1
            ref={titleRef}
            className="testimonials-page-heading max-w-5xl font-italiana font-light leading-[1.05] tracking-[0.012em] text-[#f3f3f3]"
          >
            <span className="testimonials-page-title-line block text-[34px] sm:text-[44px] md:text-[54px] lg:text-[64px] xl:text-[76px] 2xl:text-[86px]">
              Testimonials that
            </span>
            <span className="testimonials-page-title-line block font-playfair font-semibold italic text-[34px] sm:text-[44px] md:text-[54px] lg:text-[64px] xl:text-[76px] 2xl:text-[86px] text-[#e8e4dc]">
              resonate & endure
            </span>
          </h1>

          <p className="testimonials-hero-reveal mt-10 max-w-xl border-l border-[#a7b431]/35 pl-6 font-merriweather text-[13px] sm:text-[14px] md:text-[15px] leading-[1.9] text-[#c8c2ad]">
            A curated gallery of partnerships—where strategy met execution and outcomes
            became the only metric that mattered. Filter by focus, read at leisure.
          </p>
        </div>
      </section>

      <section
        className="relative border-t border-white/[0.09] py-12 sm:py-16 md:py-20 lg:py-24"
        style={dark7MainSurfaceStyle}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.35]" style={noiseOverlayStyle} />
        <div
          className="pointer-events-none absolute left-0 top-[20%] h-[45%] w-[36%] max-w-md opacity-[0.07]"
          style={{
            background: "radial-gradient(circle at 0% 50%, rgba(116,245,161,0.35), transparent 70%)",
          }}
        />

        <div ref={contentRef} className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-10">
          <div ref={bridgeRef} className="mx-auto mb-12 max-w-2xl lg:max-w-6xl xl:max-w-7xl lg:mb-14">
            <div className="testimonials-bridge-reveal mb-6 flex w-full items-center gap-3 sm:gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#a7b431]/25" />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#a7b431]/35 bg-[rgba(167,180,49,0.06)] text-[#a7b431]">
                <span className="font-playfair text-base leading-none">◇</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#a7b431]/25" />
            </div>
            <p className="testimonials-bridge-reveal text-center font-italiana text-[26px] text-[#e0d1b6] sm:text-[30px] md:text-[36px]">
              Refine the room
            </p>
            <p className="testimonials-bridge-reveal mt-2 text-center font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-regular uppercase tracking-[0.16em] text-[#a0a0a0]">
              Select a service lens
            </p>

            <div className="testimonials-bridge-reveal mt-8 grid w-full grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {services.map((service) => {
                const active = filter === service;
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => setFilter(service)}
                    className={`w-full rounded-full px-3 py-2.5 text-center font-merriweather text-[10px] font-semibold uppercase leading-snug tracking-[0.12em] transition-all duration-300 sm:px-4 sm:py-3 sm:text-[11px] sm:tracking-[0.14em] md:text-[12px] ${
                      active
                        ? "testimonials-filter-active bg-[#74F5A1] shadow-[0_0_28px_rgba(116,245,161,0.25)]"
                        : "testimonials-filter-idle border border-white/[0.12] bg-[rgba(255,255,255,0.04)] hover:border-[#a7b431]/35 hover:bg-[rgba(255,255,255,0.07)]"
                    }`}
                  >
                    {service === "all" ? "All services" : service}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3" key={filter}>
            {filteredTestimonials.map((t) => (
              <article
                key={t.id}
                className="testimonial-lux-card faqs-lux-card group relative overflow-hidden rounded-2xl border border-white/[0.11] bg-[rgba(12,22,18,0.45)] p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#a7b431]/22 sm:p-8"
              >
                <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[#a7b431]/50 via-[#74F5A1]/22 to-transparent opacity-90" />

                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#74F5A1] ring-1 ring-[#74F5A1]/40 shadow-[0_0_20px_rgba(116,245,161,0.2)]">
                    <Quote className="h-5 w-5" color="#000000" strokeWidth={1.65} />
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="testimonials-star h-3.5 w-3.5 sm:h-4 sm:w-4"
                        color="#74F5A1"
                        fill="#74F5A1"
                        strokeWidth={1.25}
                      />
                    ))}
                  </div>
                </div>

                <blockquote className="mb-6 font-playfair text-[16px] leading-[1.75] text-[#e8e4dc] sm:text-[17px] md:text-[18px]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="mb-6">
                  <span className="inline-block rounded-full border border-[#a7b431]/35 bg-[rgba(167,180,49,0.08)] px-3 py-1 font-merriweather text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a7b431] sm:text-[11px]">
                    {t.service}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] pt-6">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white/15">
                      <Image
                        src={t.avatar}
                        alt={t.author}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-merriweather text-[14px] font-semibold text-[#f3f3f3]">
                        {t.author}
                      </p>
                      <p className="truncate font-merriweather text-[12px] text-[#a0a0a0]">
                        {t.role}
                      </p>
                      <p className="mt-0.5 font-playfair text-[11px] italic text-[#a7b431]/90 sm:text-[12px]">
                        {t.company}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    color="#74F5A1"
                    strokeWidth={1.75}
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="testimonials-stats-block faqs-lux-card relative mt-14 overflow-hidden rounded-[28px] border border-white/[0.1] px-6 py-10 sm:mt-16 sm:px-10 sm:py-12 md:px-14 md:py-14">
            <div className="pointer-events-none absolute -right-20 top-0 h-40 w-40 rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, rgba(167,180,49,0.45), transparent 70%)",
                filter: "blur(28px)",
              }}
            />
            <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
              {[
                { num: "100+", label: "Happy clients" },
                { num: "4.9", suffix: "/5", label: "Average rating" },
                { num: "95%", label: "Client retention" },
                { num: "50+", label: "Projects delivered" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-italiana text-[2.25rem] leading-none text-[#e0d1b6] sm:text-[2.75rem] md:text-[3.25rem]">
                    {stat.num}
                    {stat.suffix ? (
                      <span className="font-playfair text-[1.35rem] italic text-[#74F5A1] sm:text-4xl">
                        {stat.suffix}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-2 font-merriweather text-[10px] uppercase tracking-[0.18em] text-[#a8a498] sm:text-[11px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="testimonials-bottom-cta faqs-lux-cta-panel relative mx-auto mt-14 max-w-3xl overflow-hidden rounded-[28px] border border-white/[0.1] px-7 py-12 text-center sm:mt-20 sm:px-10 sm:py-14 md:px-12 md:py-16">
            <div
              className="pointer-events-none absolute -left-12 top-0 h-44 w-44 rounded-full opacity-25"
              style={{
                background: "radial-gradient(circle, rgba(116,245,161,0.4), transparent 70%)",
                filter: "blur(30px)",
              }}
            />
            <p className="font-merriweather text-[10px] uppercase tracking-[0.28em] text-[#74F5A1]/90">
              Your chapter next
            </p>
            <h2 className="mx-auto mt-4 max-w-xl font-italiana text-[26px] leading-tight text-[#e0d1b6] sm:text-[32px] md:text-[38px]">
              Ready to join this wall of proof?
            </h2>
            <p className="mx-auto mt-4 max-w-md font-playfair text-[14px] italic leading-relaxed text-[#b5ae9c] sm:text-[15px]">
              One conversation is often all it takes to see whether we&apos;re the right
              long-term partner—no pitch deck required.
            </p>
            <Link
              href="/contact"
              className="testimonials-cta-link group mt-9 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 shadow-[0_12px_40px_-8px_rgba(18,104,91,0.55)] transition-all duration-300 ease-out hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-[0_16px_48px_-8px_rgba(18,104,91,0.65)]"
              style={{ backgroundColor: "#12685b" }}
            >
              <Users className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" color="#ffffff" strokeWidth={1.85} />
              <span className="font-merriweather text-[14px] sm:text-[15px] font-semibold tracking-[0.06em] text-white">
                Reserve a conversation
              </span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                color="#ffffff"
                strokeWidth={1.75}
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
