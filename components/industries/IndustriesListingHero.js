"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function IndustriesListingHero({ theme = "dark" }) {
  const isDark = theme === "dark";
  const rootRef = useRef(null);
  const contentRef = useRef(null);
  const bgRef = useRef(null);
  const heroVisualRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current?.children || [], {
        opacity: 0,
        y: 48,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });
      gsap.from(".ind-hero-meta", {
        opacity: 0,
        y: 28,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.32,
      });
      gsap.to(".ind-hero-float", {
        y: -16,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
      });
      gsap.to(bgRef.current, {
        y: 90,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
      gsap.to(".ind-hero-marquee-track", {
        xPercent: -50,
        duration: 24,
        repeat: -1,
        ease: "none",
      });
      gsap.from(".ind-hero-media", {
        opacity: 0,
        y: 24,
        scale: 0.98,
        duration: 0.95,
        ease: "power3.out",
        delay: 0.24,
      });
      if (heroVisualRef.current) {
        gsap.to(heroVisualRef.current, {
          y: -18,
          rotation: 1.2,
          duration: 4.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, rootRef);

    const onPointerMove = (e) => {
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(".ind-hero-tilt", {
        x: x * 14,
        y: y * 10,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    root?.addEventListener("pointermove", onPointerMove);

    return () => {
      root?.removeEventListener("pointermove", onPointerMove);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative min-h-[90vh] max-w-[100vw] overflow-hidden overflow-x-clip">
      <div className="absolute inset-0 z-0">
        <Image
          ref={bgRef}
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
          alt=""
          fill
          priority
          className="object-cover object-center scale-[1.06]"
          sizes="100vw"
        />
        <div className="absolute left-[5%] top-[16%] ind-hero-float w-[300px] h-[300px] rounded-full bg-[#74F5A1]/20 blur-3xl" />
        <div className="absolute right-[10%] top-[14%] ind-hero-float w-[250px] h-[250px] rounded-full bg-[#67bfda]/20 blur-3xl" />
        <div className="absolute right-[20%] bottom-[10%] ind-hero-float w-[340px] h-[340px] rounded-full bg-[#005160]/34 blur-3xl" />
        <div className="absolute left-[34%] bottom-[18%] ind-hero-float w-[180px] h-[180px] rounded-full bg-[#74F5A1]/14 blur-3xl" />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(118deg, rgba(22,45,36,0.78) 0%, rgba(8,25,20,0.84) 34%, rgba(0,81,96,0.5) 100%), linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(22,45,36,0.92) 100%), radial-gradient(ellipse at 18% 20%, rgba(116,245,161,0.22) 0%, transparent 52%), radial-gradient(ellipse at 84% 80%, rgba(103,191,218,0.24) 0%, transparent 58%)"
              : "linear-gradient(to right, rgba(245,232,209,0.95), rgba(245,232,209,0.75))",
          }}
        />
        <div className="absolute inset-0 opacity-[0.16] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(116,245,161,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(103,191,218,0.1) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
        <div className="absolute inset-0 pointer-events-none opacity-70" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(116,245,161,0.06) 28%, transparent 50%, rgba(103,191,218,0.09) 78%, transparent 100%)" }} />
      </div>

      <div className="relative z-[2] px-6 sm:px-10 md:px-14 lg:px-16 pt-28 md:pt-32 pb-14 md:pb-16 overflow-x-clip">
        <div className="max-w-[1700px] mx-auto grid xl:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)] gap-8 xl:gap-12 items-center">
          <div ref={contentRef} className="max-w-[840px] min-w-0">
          <p className="ind-hero-kicker font-merriweather uppercase tracking-[0.2em] text-[12px] md:text-[14px] font-semibold mb-6">
            Industries
          </p>
          <h1 className="ind-hero-title font-italiana font-light tracking-[-0.04em] leading-[0.95] text-[42px] sm:text-[56px] md:text-[72px] lg:text-[88px] xl:text-[106px]">
            <span className="block">Tailored Strategy</span>
            <span className="block mt-1 text-[#74F5A1]">for every domain</span>
          </h1>
          <p className="ind-hero-lead font-playfair text-[19px] md:text-[27px] leading-relaxed mt-7 md:mt-8 max-w-2xl">
            At Tech Eyrie we bind market strategy with deep sector expertise. Every page, every interaction, every keyword
            is designed to align with your audience&apos;s expectations and brand&apos;s standard.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/contact" className="ind-mint-btn inline-flex items-center rounded-full px-6 py-3 bg-[#74F5A1] font-merriweather text-[13px] md:text-[14px] font-bold hover:translate-x-1 transition-transform shadow-[0_12px_34px_rgba(116,245,161,0.35)]">
              Book strategy call
            </Link>
            <Link href="#industries-grid" className="inline-flex items-center rounded-full px-6 py-3 border border-[#74F5A1]/35 bg-[#0b1f18]/72 text-[#d8ece2] font-merriweather text-[13px] md:text-[14px]">
              Browse all industries
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2.5 max-w-2xl">
            {["Search-intent architecture", "Dark7 visual system", "Conversion-led sector pages", "20 launch-ready routes"].map((chip) => (
              <span key={chip} className="ind-hero-meta font-merriweather text-[11px] md:text-[12px] tracking-[0.12em] uppercase px-3 py-2 rounded-full border border-[#74F5A1]/35 bg-[#0a1e18]/65 text-[#d8ece2]">
                {chip}
              </span>
            ))}
          </div>
          <div className="ind-hero-meta mt-8 rounded-xl border border-white/10 bg-[#081810]/55 backdrop-blur-sm overflow-hidden max-w-2xl">
            <div className="ind-hero-marquee-track flex whitespace-nowrap">
              {[
                "LAW & LEGAL",
                "FINANCE & FINTECH",
                "HEALTHCARE",
                "HOSPITALITY",
                "REAL ESTATE",
                "SOFTWARE & SAAS",
                "MANUFACTURING",
                "EDTECH",
              ]
                .concat([
                  "LAW & LEGAL",
                  "FINANCE & FINTECH",
                  "HEALTHCARE",
                  "HOSPITALITY",
                  "REAL ESTATE",
                  "SOFTWARE & SAAS",
                  "MANUFACTURING",
                  "EDTECH",
                ])
                .map((item, i) => (
                  <span
                    key={`${item}-${i}`}
                    className="px-4 py-2.5 font-merriweather text-[10px] md:text-[11px] tracking-[0.14em] uppercase text-[#d7e6df]"
                  >
                    {item}
                  </span>
                ))}
            </div>
          </div>
          </div>

          <div className="min-w-0 max-w-full xl:max-w-[620px] 2xl:max-w-[680px] xl:justify-self-end self-center">
            <div
              ref={heroVisualRef}
              className="ind-hero-media relative z-[3] w-full rounded-[28px] overflow-hidden border border-white/20 bg-[#06110d] ring-1 ring-[#74F5A1]/30 shadow-[0_34px_90px_rgba(0,0,0,0.48)]"
            >
              <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-[#74F5A1]/28 via-transparent to-[#67bfda]/22 blur-2xl opacity-80" aria-hidden />
              <div className="relative overflow-hidden rounded-[24px]">
                <Image
                  src="/industry/industry-hero-float.png"
                  alt="Industries visual"
                  width={1280}
                  height={1100}
                  className="w-full h-auto object-cover saturate-110 contrast-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04110c]/35 via-transparent to-transparent" />
                <div className="absolute inset-0 ind-hero-tilt" style={{ background: "radial-gradient(circle at 78% 18%, rgba(116,245,161,0.20) 0%, transparent 45%)" }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.08) 45%, transparent 100%)", mixBlendMode: "soft-light" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
