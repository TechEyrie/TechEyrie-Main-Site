"use client";

import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dark7MainSurfaceStyle } from "../dark7/dark7PageSurface";
import { getIndustryDetailData } from "./industryDetailData";
import "../services1Detail/services1DetailCta.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function IndustriesDetailTemplate({ slug, theme = "dark" }) {
  const data = useMemo(() => getIndustryDetailData(slug), [slug]);
  const isDark = theme === "dark";
  const rootRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(0);
  const faqRefs = useRef([]);
  const [faqHeights, setFaqHeights] = useState([]);

  useEffect(() => {
    if (!data) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".d7-reveal").forEach((node, index) => {
        gsap.fromTo(
          node,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.02,
            ease: "power3.out",
            scrollTrigger: {
              trigger: node,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [slug, data]);

  useEffect(() => {
    if (!data) return;
    const faqCount = data.faqs.length;
    const measure = () => {
      setFaqHeights((prev) => {
        const next = Array.from({ length: faqCount }, (_, i) => faqRefs.current[i]?.scrollHeight || 0);
        if (
          prev.length === next.length &&
          next.every((h, i) => h === prev[i])
        ) {
          return prev;
        }
        return next;
      });
    };
    requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [slug, data]);

  if (!data) return null;

  const cardTheme = isDark
    ? "bg-[#17382e]/80 border border-[#74F5A1]/20 text-[#f3f3f3]"
    : "bg-white border border-[#d8d3c8] text-[#222]";

  return (
    <main
      ref={rootRef}
      className="relative overflow-hidden"
      style={isDark ? dark7MainSurfaceStyle : { backgroundColor: "#F9F7F0" }}
    >
      {isDark && (
        <>
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.02) 1px, rgba(255,255,255,0.02) 2px)",
            }}
          />
          <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full blur-3xl bg-[#74F5A1]/25 pointer-events-none" />
          <div className="absolute top-[42%] -right-24 h-[360px] w-[360px] rounded-full blur-3xl bg-[#005160]/45 pointer-events-none" />
        </>
      )}

      <section className="relative z-10 px-6 md:px-10 lg:px-16 pt-24 md:pt-32 pb-14 md:pb-16">
        <div className="max-w-[1700px] mx-auto">
          <nav className="d7-reveal font-merriweather text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-[#74F5A1] mb-8">
            <Link href="/industries" className="hover:text-[#9dffbe] transition-colors">
              Industries
            </Link>
            <span className="mx-2 opacity-50">/</span>
            <span className="text-[#e0d1b6]/85">{data.title}</span>
          </nav>

          <div className="grid lg:grid-cols-[58%_42%] gap-10 items-center">
            <div className="d7-reveal">
              <p className="font-merriweather uppercase tracking-[0.16em] text-[13px] md:text-[15px] font-semibold mb-6 text-[#f3f3f3]">
                Industry
              </p>
              <h1 className="font-italiana tracking-[-0.03em] leading-[1.02] text-[34px] sm:text-[44px] md:text-[56px] lg:text-[68px] xl:text-[80px] text-[#f3f3f3]">
                {data.title}
              </h1>
              <h2 className="font-playfair italic text-[20px] md:text-[26px] leading-[1.35] mt-6 text-[#74F5A1]">
                {data.headline}
              </h2>
              <p className="font-playfair text-[16px] md:text-[22px] leading-relaxed mt-5 max-w-3xl text-[#f3f3f3]/95">
                {data.supportingLine}
              </p>
              <div className="flex flex-wrap gap-2 mt-8">
                {data.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="font-merriweather text-[11px] md:text-[12px] px-3 py-1.5 rounded-full border border-[#74F5A1]/35 bg-[#0d241d]/65 text-[#dbe8df]"
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <Link href="/contact" className="inline-flex items-center gap-3 group mt-8">
                <span className="font-[Helvetica_Now_Text,Helvetica,Arial,sans-serif] text-[16px] md:text-[19px] font-bold tracking-tight text-[#f3f3f3]">
                  Start this vertical
                </span>
                <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[4px] bg-[#74F5A1] transition-all duration-500 ease-out group-hover:scale-110">
                  <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
                    <path
                      d="M2 7H12M12 7L8.5 3.5M12 7L8.5 10.5"
                      fill="none"
                      stroke="#212121"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </div>

            <div className="d7-reveal relative h-[300px] md:h-[420px] lg:h-[480px] rounded-[20px] overflow-hidden shadow-2xl">
              <Image src={data.image} alt={data.title} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d251d]/88 via-[#0d251d]/15 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 py-12 md:py-14">
        <div className="max-w-[1700px] mx-auto grid md:grid-cols-2 gap-6">
          <article className={`d7-reveal rounded-2xl p-7 md:p-9 ${cardTheme}`}>
            <h3 className="font-italiana text-[30px] md:text-[44px] leading-tight mb-4">The gap</h3>
            <p className="font-merriweather text-[15px] md:text-[16px] leading-[1.9] text-white/85">{data.problemStatement}</p>
          </article>
          <article className={`d7-reveal rounded-2xl p-7 md:p-9 ${cardTheme}`}>
            <h3 className="font-italiana text-[30px] md:text-[44px] leading-tight mb-4">How we help</h3>
            <p className="font-merriweather text-[15px] md:text-[16px] leading-[1.9] text-white/85">{data.whatWeDo}</p>
          </article>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 py-14 md:py-16">
        <div className="max-w-[1700px] mx-auto">
          <div className="d7-reveal mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h3 className="font-italiana text-[38px] md:text-[56px] lg:text-[68px] leading-[0.98] text-[#f3f3f3]">
              Focus areas
            </h3>
            <span className="font-merriweather text-[12px] md:text-[14px] uppercase tracking-[0.16em] text-[#74F5A1] shrink-0">
              Mapped to your keywords
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {data.offerings.map((line) => (
              <div
                key={line}
                className={`d7-reveal rounded-2xl p-6 md:p-8 border border-[#74F5A1]/18 bg-[#0c1f19]/72`}
              >
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#74F5A1] to-[#67bfda] mb-4" />
                <p className="font-merriweather text-[15px] md:text-[17px] leading-[1.75] text-white/90">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 py-14 md:py-20">
        <div className="max-w-[1700px] mx-auto">
          <div className="d7-reveal mb-10">
            <h3 className="font-italiana text-[38px] md:text-[56px] lg:text-[64px] leading-[0.95] text-[#f3f3f3]">
              Engagement rhythm
            </h3>
            <p className="font-merriweather text-[14px] md:text-[16px] max-w-xl mt-3 text-white/75">
              A straight sequence from research to shipped vertical landing—no mystery phases.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.process.map((step) => (
              <div key={step.step} className={`d7-reveal rounded-2xl p-6 md:p-7 ${cardTheme} relative overflow-hidden`}>
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#74F5A1] via-[#9dffbe] to-transparent" />
                <p className="font-merriweather text-[11px] tracking-[0.18em] uppercase text-[#74F5A1] mb-2">Step {step.step}</p>
                <h4 className="font-italiana text-[26px] md:text-[32px] leading-tight mb-3">{step.title}</h4>
                <p className="font-merriweather text-[14px] md:text-[15px] leading-[1.8] text-white/85">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 py-14">
        <div className="max-w-[1700px] mx-auto">
          <div className="d7-reveal mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h3 className="font-italiana text-[36px] md:text-[52px] leading-[0.95] text-[#f3f3f3]">Nearby sectors</h3>
            <p className="font-merriweather text-[14px] md:text-[15px] max-w-md md:text-right text-white/78">
              Explore adjacent verticals—the system stays visually consistent route to route.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {data.related.map((item) => (
              <Link
                key={item.slug}
                href={`/industries/${item.slug}`}
                className={`d7-reveal group rounded-xl overflow-hidden block transition-transform duration-300 hover:-translate-y-1 ${cardTheme}`}
              >
                <div className="relative h-[220px] md:h-[260px]">
                  <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-merriweather text-[11px] uppercase tracking-[0.14em] text-[#74F5A1]">
                    {item.name}
                  </span>
                </div>
                <div className="p-5 md:p-6">
                  <p className="font-playfair text-[15px] md:text-[17px] leading-snug text-[#74F5A1]/95 line-clamp-2">{item.pageTitle}</p>
                  <span className="inline-block mt-3 text-[#67bfda] font-merriweather text-[12px]">View industry →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 py-14">
        <div className="max-w-[900px] mx-auto">
          <h3 className="d7-reveal font-italiana text-[32px] md:text-[48px] mb-8 text-[#f3f3f3]">FAQ</h3>
          <div className="space-y-3">
            {data.faqs.map((faq, idx) => {
              const isOpen = idx === openFaq;
              return (
                <div key={faq.q} className={`d7-reveal rounded-xl overflow-hidden ${cardTheme}`}>
                  <button
                    type="button"
                    className="w-full text-left p-5 flex items-center justify-between gap-3 hover:bg-white/[0.03]"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  >
                    <span className="font-merriweather text-[14px] md:text-[15px]">{faq.q}</span>
                    <span className={`text-[#74F5A1] text-xl transition-transform shrink-0 ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                    style={{
                      maxHeight: isOpen ? `${faqHeights[idx] || 0}px` : "0px",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div ref={(el) => (faqRefs.current[idx] = el)}>
                      <p className="px-5 pb-5 font-merriweather text-[14px] leading-[1.8] text-white/85">{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 pt-6 pb-20 md:pb-24">
        <div className="services1-detail-cta-box max-w-[1700px] mx-auto d7-reveal rounded-[24px] md:rounded-[30px] p-8 md:p-12 bg-gradient-to-r from-[#74F5A1] via-[#5FE08D] to-[#3BC972] shadow-[0_28px_80px_rgba(116,245,161,0.28)]">
          <h3 className="services1-detail-cta-heading font-italiana text-[32px] md:text-[52px] leading-[1.1] max-w-4xl">
            Want this vertical live under your brand?
          </h3>
          <p className="services1-detail-cta-sub font-playfair text-[17px] md:text-[22px] mt-4 max-w-2xl">
            We&apos;ll align on SERP intent, ship the Dark7-grade experience, and hand off a page your team can extend.
          </p>
          <Link href="/contact" className="services1-detail-cta-btn inline-flex mt-7 px-7 py-3 rounded-full bg-[#102b22] font-merriweather text-sm md:text-base">
            Book a Free Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}

export default memo(IndustriesDetailTemplate);
