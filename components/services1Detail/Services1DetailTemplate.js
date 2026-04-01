"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dark7MainSurfaceStyle } from "../dark7/dark7PageSurface";
import { getServiceDetailData } from "./services1DetailData";
import "./services1DetailCta.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Services1DetailTemplate({ slug, theme = "light" }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [faqHeights, setFaqHeights] = useState([]);
  const data = getServiceDetailData(slug);
  const rootRef = useRef(null);
  const faqContentRefs = useRef([]);
  const isDark = theme === "dark";

  useEffect(() => {
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
  }, [slug]);

  useEffect(() => {
    const measureHeights = () => {
      const heights = data.faqs.map((_, idx) => faqContentRefs.current[idx]?.scrollHeight || 0);
      setFaqHeights(heights);
    };

    requestAnimationFrame(measureHeights);
    window.addEventListener("resize", measureHeights);
    return () => window.removeEventListener("resize", measureHeights);
  }, [data.faqs, slug]);

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
          <div className="absolute inset-0 pointer-events-none opacity-15" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.02) 1px, rgba(255,255,255,0.02) 2px)" }} />
          <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full blur-3xl bg-[#74F5A1]/25 pointer-events-none" />
          <div className="absolute top-[42%] -right-24 h-[360px] w-[360px] rounded-full blur-3xl bg-[#005160]/45 pointer-events-none" />
        </>
      )}

      <section className="relative z-10 px-6 md:px-10 lg:px-16 pt-24 md:pt-32 pb-14 md:pb-16">
        <div className="max-w-[1700px] mx-auto grid lg:grid-cols-[62%_38%] gap-10 items-center">
          <div className="d7-reveal">
            <p className={`font-merriweather uppercase tracking-[0.16em] text-[13px] md:text-[15px] font-semibold mb-7 ${isDark ? "text-[#f3f3f3]" : "text-[#212121]"}`}>Service</p>
            <h1 className={`font-italiana tracking-[-0.03em] leading-[1.02] text-[34px] sm:text-[44px] md:text-[58px] lg:text-[72px] xl:text-[88px] ${isDark ? "text-[#f3f3f3]" : "text-[#111111]"}`}>
              {data.title}
            </h1>
            <h2 className={`font-playfair italic text-[22px] md:text-[30px] leading-[1.35] mt-7 ${isDark ? "text-[#74F5A1]" : "text-[#013825]"}`}>
              {data.headline}
            </h2>
            <p className={`font-playfair text-[17px] md:text-[24px] leading-relaxed mt-6 max-w-3xl ${isDark ? "text-[#f3f3f3]" : "text-[#212121]"}`}>
              {data.supportingLine}
            </p>
            <Link href="/contact" className="inline-flex items-center gap-3 group mt-8">
              <span className={`font-[Helvetica_Now_Text,Helvetica,Arial,sans-serif] text-[16px] md:text-[20px] font-bold tracking-tight ${isDark ? "text-[#f3f3f3]" : "text-[#111111]"}`}>
                Talk to an Expert
              </span>
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[4px] bg-[#74F5A1] transition-all duration-500 ease-out group-hover:scale-110">
                <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M2 7H12M12 7L8.5 3.5M12 7L8.5 10.5" fill="none" stroke="#212121" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>

          <div className="d7-reveal relative h-[340px] md:h-[460px] rounded-[20px] overflow-hidden shadow-2xl">
            <Image src={data.heroImage} alt={data.title} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d251d]/85 via-[#0d251d]/10 to-transparent" />
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 py-14">
        <div className="max-w-[1700px] mx-auto grid lg:grid-cols-2 gap-6">
          <article className={`d7-reveal rounded-2xl p-7 md:p-9 ${cardTheme}`}>
            <h3 className="font-italiana text-[34px] md:text-[48px] leading-tight mb-4">Problem Statement</h3>
            <p className={`font-merriweather text-[15px] md:text-[16px] leading-[1.9] ${isDark ? "text-white/85" : "text-[#3f3a34]"}`}>{data.problemStatement}</p>
          </article>
          <article className={`d7-reveal rounded-2xl p-7 md:p-9 ${cardTheme}`}>
            <h3 className="font-italiana text-[34px] md:text-[48px] leading-tight mb-4">What We Do</h3>
            <p className={`font-merriweather text-[15px] md:text-[16px] leading-[1.9] ${isDark ? "text-white/85" : "text-[#3f3a34]"}`}>{data.whatWeDo}</p>
          </article>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 py-16 md:py-20 lg:py-24">
        <div className="max-w-[1700px] mx-auto">
          <div className="d7-reveal mb-10 md:mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h3 className={`font-italiana text-[44px] sm:text-[52px] md:text-[72px] lg:text-[84px] leading-[0.98] ${isDark ? "text-[#f3f3f3]" : "text-[#111]"}`}>Key Offerings</h3>
            <span className={`font-merriweather text-[13px] md:text-[15px] lg:text-[16px] uppercase tracking-[0.16em] shrink-0 ${isDark ? "text-[#74F5A1]" : "text-[#1f614d]"}`}>
              Built for impact
            </span>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {data.keyOfferings.map((item, idx) => (
              <article
                key={item}
                className={`d7-reveal group relative rounded-3xl p-8 md:p-10 lg:p-12 min-h-[180px] md:min-h-[200px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(116,245,161,0.24)] ${cardTheme}`}
              >
                <div className="absolute top-0 left-0 h-1 md:h-[5px] w-full bg-gradient-to-r from-[#74F5A1] via-[#9dffbe] to-transparent opacity-90" />
                <div className="absolute -right-16 -top-16 h-40 w-40 md:h-48 md:w-48 rounded-full bg-[#74F5A1]/10 blur-3xl group-hover:bg-[#74F5A1]/28 transition-all duration-300" />

                <div className="flex flex-col sm:flex-row sm:items-start gap-6 md:gap-8">
                  <div className="relative shrink-0">
                    <div className="inline-flex h-14 w-14 md:h-[4.25rem] md:w-[4.25rem] lg:h-20 lg:w-20 items-center justify-center rounded-2xl bg-[#0a1e18] border-[3px] border-[#74F5A1] text-[#9dffbe] font-extrabold text-xl md:text-2xl lg:text-3xl shadow-[0_0_28px_rgba(116,245,161,0.4)]">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="absolute -inset-1.5 rounded-2xl border border-[#74F5A1]/35 pointer-events-none" />
                  </div>

                  <p className={`font-merriweather text-[17px] md:text-[19px] lg:text-[21px] leading-[1.75] md:leading-[1.8] ${isDark ? "text-white/92" : "text-[#2d2a26]"}`}>
                    {item}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 py-20 md:py-24 lg:py-28 overflow-hidden">
        <div className="max-w-[1700px] mx-auto">
          <div className="d7-reveal mb-12 md:mb-16 flex items-end justify-between gap-4">
            <h3 className={`font-italiana text-[42px] md:text-[72px] lg:text-[86px] leading-[0.95] ${isDark ? "text-[#f3f3f3]" : "text-[#111]"}`}>Our Process</h3>
            <p className={`hidden md:block font-merriweather text-[14px] lg:text-[16px] max-w-[360px] text-right ${isDark ? "text-white/75" : "text-[#3f3a34]"}`}>
              A clear execution path from strategy to measurable outcomes.
            </p>
          </div>

          <div className="hidden md:block relative">
            <div className="absolute left-0 right-0 top-[62px] h-[1px] bg-gradient-to-r from-transparent via-[#74F5A1]/65 to-transparent" />
            <div className="absolute left-[8%] right-[8%] top-[58px] h-[9px] rounded-full bg-[#74F5A1]/12 blur-md" />
            <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
              {data.process.map((step) => (
                <div
                  key={step.step}
                  className={`d7-reveal relative rounded-3xl p-7 lg:p-8 pt-6 min-h-[320px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_48px_rgba(116,245,161,0.22)] ${cardTheme}`}
                >
                  <div className="absolute top-0 left-0 right-0 h-[4px] rounded-t-3xl bg-gradient-to-r from-[#74F5A1] via-[#9dffbe] to-transparent" />
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#74F5A1]/12 blur-2xl" />

                  <div className="w-[68px] h-[68px] rounded-full bg-[#0a1e18] border-[3px] border-[#74F5A1] text-[#9dffbe] text-[24px] font-extrabold flex items-center justify-center mb-5 shadow-[0_0_24px_rgba(116,245,161,0.35)]">
                    {step.step}
                  </div>
                  <p className="font-merriweather text-[12px] tracking-[0.17em] uppercase text-[#74F5A1] mb-3">Phase {step.step}</p>
                  <h4 className="font-italiana text-[34px] lg:text-[40px] mb-3 leading-[1.02]">{step.title}</h4>
                  <p className={`font-merriweather text-[15px] lg:text-[16px] leading-[1.85] ${isDark ? "text-white/88" : "text-[#4a453f]"}`}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden relative pl-7">
            <div className="absolute left-[14px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#74F5A1] via-[#74F5A1]/50 to-[#74F5A1]/10" />
            {data.process.map((step) => (
              <div key={step.step} className={`d7-reveal relative rounded-2xl p-5 mb-4 ${cardTheme}`}>
                <div className="absolute -left-[30px] top-6 w-5 h-5 rounded-full bg-[#0a1e18] border-2 border-[#74F5A1]" />
                <p className="font-merriweather text-xs tracking-[0.16em] uppercase text-[#74F5A1] mb-2">Step {step.step}</p>
                <h4 className="font-italiana text-[30px] mb-2 leading-tight">{step.title}</h4>
                <p className={`font-merriweather text-[14px] leading-[1.8] ${isDark ? "text-white/85" : "text-[#4a453f]"}`}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 py-20 md:py-24 lg:py-28 overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[min(80%,640px)] pointer-events-none opacity-[0.07] bg-[radial-gradient(ellipse_at_center,rgba(116,245,161,0.5)_0%,transparent_65%)]" aria-hidden />
        <div className="max-w-[1700px] mx-auto relative">
          <div className="d7-reveal flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10 mb-10 md:mb-14">
            <div>
              <p className="font-merriweather text-[12px] md:text-[13px] uppercase tracking-[0.18em] text-[#74F5A1] mb-4">
                Stack &amp; toolchain
              </p>
              <h3 className={`font-italiana text-[42px] md:text-[72px] lg:text-[86px] leading-[0.95] ${isDark ? "text-[#f3f3f3]" : "text-[#111]"}`}>
                Technologies &amp; Tools
              </h3>
            </div>
            <p className={`font-merriweather text-[15px] md:text-[17px] leading-relaxed max-w-xl lg:text-right ${isDark ? "text-white/78" : "text-[#3f3a34]"}`}>
              The same production-grade stack we use to ship fast, stay observable, and scale without surprises.
            </p>
          </div>

          <div
            className={`d7-reveal rounded-[28px] md:rounded-[36px] border p-6 md:p-10 lg:p-12 relative overflow-hidden ${
              isDark
                ? "border-[#74F5A1]/25 bg-[#0c1f19]/75 shadow-[0_0_0_1px_rgba(116,245,161,0.06),inset_0_1px_0_rgba(255,255,255,0.04)]"
                : "border-[#1f614d]/15 bg-white/80 shadow-lg"
            }`}
          >
            <div
              className="absolute inset-0 opacity-[0.35] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(116,245,161,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(116,245,161,0.06) 1px, transparent 1px)`,
                backgroundSize: "48px 48px",
              }}
              aria-hidden
            />
            <div className="relative">
              {(() => {
                const items = data.technologies;
                const mid = Math.ceil(items.length / 2);
                const core = items.slice(0, mid);
                const extended = items.slice(mid);
                return (
                  <>
                    <div className="mb-10 md:mb-12">
                      <p className="font-merriweather text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-[#74F5A1] mb-4 md:mb-5">
                        Core layer
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                        {core.map((tech) => (
                          <div
                            key={tech.name}
                            className={`d7-reveal group relative rounded-2xl md:rounded-3xl p-5 md:p-7 min-h-[140px] md:min-h-[168px] flex flex-col items-center justify-center text-center gap-3 md:gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(116,245,161,0.2)] ${cardTheme}`}
                          >
                            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl md:rounded-t-3xl bg-gradient-to-r from-[#74F5A1] via-[#9dffbe] to-transparent opacity-80" />
                            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#74F5A1]/10 blur-2xl group-hover:bg-[#74F5A1]/22 transition-all duration-300" />
                            <div
                              className={`relative w-[72px] h-[72px] md:w-[88px] md:h-[88px] rounded-2xl flex items-center justify-center ring-2 ring-[#74F5A1]/25 shadow-[0_8px_32px_rgba(0,0,0,0.2)] ${
                                isDark ? "bg-[#0a1814]/90" : "bg-[#f8f5ef]"
                              }`}
                            >
                              <Image src={tech.logo} alt={tech.name} width={44} height={44} className="object-contain" unoptimized />
                            </div>
                            <span className={`font-merriweather text-[15px] md:text-[17px] font-semibold ${isDark ? "text-white" : "text-[#1a1a1a]"}`}>
                              {tech.name}
                            </span>
                            <span className={`text-[10px] md:text-[11px] uppercase tracking-[0.14em] ${isDark ? "text-[#74F5A1]/90" : "text-[#245241]"}`}>
                              In production
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {extended.length > 0 && (
                      <div>
                        <p className="font-merriweather text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-[#74F5A1] mb-4 md:mb-5">
                          Platform &amp; delivery
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                          {extended.map((tech) => (
                            <div
                              key={tech.name}
                              className={`d7-reveal group relative rounded-2xl md:rounded-3xl p-5 md:p-7 min-h-[140px] md:min-h-[168px] flex flex-col items-center justify-center text-center gap-3 md:gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(0,81,96,0.18)] ${cardTheme}`}
                            >
                              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl md:rounded-t-3xl bg-gradient-to-r from-[#005160]/80 via-[#67bfda]/50 to-transparent opacity-90" />
                              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#005160]/15 blur-2xl group-hover:bg-[#005160]/28 transition-all duration-300" />
                              <div
                                className={`relative w-[72px] h-[72px] md:w-[88px] md:h-[88px] rounded-2xl flex items-center justify-center ring-2 ring-[#005160]/30 shadow-[0_8px_32px_rgba(0,0,0,0.18)] ${
                                  isDark ? "bg-[#0a1418]/90" : "bg-[#eef6f8]"
                                }`}
                              >
                                <Image src={tech.logo} alt={tech.name} width={44} height={44} className="object-contain" unoptimized />
                              </div>
                              <span className={`font-merriweather text-[15px] md:text-[17px] font-semibold ${isDark ? "text-white" : "text-[#1a1a1a]"}`}>
                                {tech.name}
                              </span>
                              <span className={`text-[10px] md:text-[11px] uppercase tracking-[0.14em] ${isDark ? "text-[#67bfda]/95" : "text-[#005160]"}`}>
                                Ships with you
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 py-20 md:py-24">
        <div className="max-w-[1700px] mx-auto">
          <div className="d7-reveal mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <h3 className={`font-italiana text-[42px] md:text-[72px] lg:text-[84px] leading-[0.95] ${isDark ? "text-[#f3f3f3]" : "text-[#111]"}`}>
              Who We Build For
            </h3>
            <p className={`font-merriweather text-[14px] md:text-[16px] max-w-[520px] md:text-right ${isDark ? "text-white/78" : "text-[#4a443d]"}`}>
              Teams with high stakes, complex workflows, and a need for reliable execution.
            </p>
          </div>

          <div className="grid lg:grid-cols-[58%_42%] gap-6 md:gap-8">
            <article className={`d7-reveal relative rounded-3xl p-8 md:p-10 lg:p-12 overflow-hidden flex flex-col min-h-0 ${cardTheme}`}>
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#74F5A1] via-[#9dffbe] to-transparent" />
              <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[#74F5A1]/12 blur-3xl" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a1814]/55 to-transparent pointer-events-none" aria-hidden />

              <p className="font-merriweather text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-[#74F5A1] mb-4">
                Primary personas
              </p>
              <ul className="space-y-5 md:space-y-6">
                {data.audience.map((item, i) => (
                  <li key={item} className="flex gap-4 md:gap-5 items-start">
                    <span className="mt-1 inline-flex h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-full items-center justify-center border-2 border-[#74F5A1] text-[#9dffbe] font-bold text-sm md:text-base">
                      {i + 1}
                    </span>
                    <p className={`font-merriweather text-[16px] md:text-[19px] leading-[1.75] ${isDark ? "text-white/92" : "text-[#332f2a]"}`}>
                      {item}
                    </p>
                  </li>
                ))}
              </ul>

              <div className={`my-8 md:my-10 h-px w-full ${isDark ? "bg-[#74F5A1]/25" : "bg-[#1f614d]/20"}`} />

              <div className="relative z-[1] flex-1 flex flex-col gap-6 md:gap-8">
                <div>
                  <p className="font-merriweather text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-[#74F5A1] mb-4">
                    Strong fit signals
                  </p>
                  <ul className="space-y-3 md:space-y-4">
                    {[
                      "You need production systems — not slides, proofs-of-concept, or one-off demos.",
                      "Your roadmap has real dependencies: data, security, integrations, or compliance.",
                      "You want a partner who owns architecture, build quality, and launch discipline.",
                      "You are ready for weekly checkpoints, clear milestones, and measurable acceptance criteria.",
                    ].map((line) => (
                      <li key={line} className="flex gap-3 items-start">
                        <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-[#74F5A1]/20 border border-[#74F5A1]/60 flex items-center justify-center text-[#74F5A1] text-xs font-bold">
                          ✓
                        </span>
                        <span className={`font-merriweather text-[14px] md:text-[16px] leading-[1.7] ${isDark ? "text-white/88" : "text-[#3a3630]"}`}>
                          {line}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-merriweather text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-[#74F5A1] mb-3">
                    How we usually engage
                  </p>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {["Discovery sprint", "Architecture review", "MVP build", "Scale & hardening", "Ongoing support"].map((tag) => (
                      <span
                        key={tag}
                        className={`font-merriweather text-[12px] md:text-[13px] px-3 py-1.5 rounded-full border ${isDark ? "border-[#74F5A1]/35 text-white/90 bg-[#0d241d]/60" : "border-[#245241]/25 text-[#1a2e26] bg-[#f4efe5]"}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`rounded-2xl p-4 md:p-5 mt-auto border ${isDark ? "border-[#74F5A1]/20 bg-[#0d241d]/55" : "border-[#d8d1c4] bg-[#faf7f1]"}`}>
                  <p className={`font-playfair italic text-[15px] md:text-[17px] leading-relaxed ${isDark ? "text-[#e8e4dc]" : "text-[#2c2824]"}`}>
                    &ldquo;If your team is tired of restarting projects, we align on outcomes first — then ship the system that holds up in production.&rdquo;
                  </p>
                  <p className="font-merriweather text-[11px] md:text-[12px] uppercase tracking-[0.14em] text-[#74F5A1] mt-3">
                    Typical kickoff: 2-week discovery &amp; technical audit
                  </p>
                </div>
              </div>
            </article>

            <article className={`d7-reveal relative rounded-3xl p-8 md:p-10 overflow-hidden ${cardTheme}`}>
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(116,245,161,0.16),transparent_55%)]" />
              <h4 className="font-italiana text-[38px] md:text-[54px] leading-[0.95] mb-3">Impact Snapshot</h4>
              <p className={`font-merriweather text-[14px] md:text-[15px] mb-6 ${isDark ? "text-white/80" : "text-[#514b44]"}`}>
                Outcomes seen across recent delivery engagements.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                {data.stats.map((stat, idx) => (
                  <div key={stat} className={`rounded-2xl p-5 md:p-6 border ${isDark ? "bg-[#0d241d]/70 border-[#74F5A1]/25" : "bg-[#f4efe5] border-[#d8d1c4]"}`}>
                    <p className="font-merriweather text-[30px] md:text-[36px] font-extrabold tracking-tight text-[#74F5A1] leading-none">
                      {stat.split(" ").slice(0, 1).join("")}
                    </p>
                    <p className={`font-merriweather text-[12px] md:text-[13px] uppercase tracking-[0.14em] mt-2 ${isDark ? "text-white/75" : "text-[#5a544c]"}`}>
                      Metric {idx + 1}
                    </p>
                    <p className={`font-merriweather text-[14px] md:text-[15px] mt-2 leading-[1.55] ${isDark ? "text-white/90" : "text-[#3f3a34]"}`}>
                      {stat.split(" ").slice(1).join(" ")}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 py-14">
        <div className="max-w-[1700px] mx-auto">
          <div className="d7-reveal mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h3 className={`font-italiana text-[40px] md:text-[64px] leading-[0.95] ${isDark ? "text-[#f3f3f3]" : "text-[#111]"}`}>Case Studies</h3>
            <p className={`font-merriweather text-[14px] md:text-[16px] max-w-[520px] md:text-right ${isDark ? "text-white/78" : "text-[#4a443d]"}`}>
              Featured delivery outcomes from real-world implementations.
            </p>
          </div>

          <div className="grid lg:grid-cols-[58%_42%] gap-6 md:gap-8">
            <article className={`d7-reveal relative rounded-3xl overflow-hidden min-h-[360px] md:min-h-[520px] ${cardTheme}`}>
              <Image src={data.caseStudies[0].image} alt={data.caseStudies[0].title} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
              <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a1e18]/85 border border-[#74F5A1]/40">
                <span className="w-2 h-2 rounded-full bg-[#74F5A1]" />
                <span className="font-merriweather text-[11px] uppercase tracking-[0.14em] text-[#b9ffd0]">Featured Project</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10">
                <p className="inline-block mb-4 font-merriweather text-[12px] md:text-[13px] uppercase tracking-[0.16em] text-[#74F5A1]">
                  {data.caseStudies[0].outcome}
                </p>
                <h4 className="font-italiana text-[34px] md:text-[48px] leading-[1.02] text-white mb-3">
                  {data.caseStudies[0].title}
                </h4>
                <p className="font-merriweather text-[14px] md:text-[16px] leading-[1.8] text-white/90 max-w-[620px]">
                  {data.caseStudies[0].summary}
                </p>
              </div>
            </article>

            <div className="grid gap-5">
              {data.caseStudies.slice(1).map((item) => (
                <article key={item.title} className={`d7-reveal rounded-2xl overflow-hidden border ${isDark ? "bg-[#0d241d]/75 border-[#74F5A1]/20" : "bg-[#f7f2e8] border-[#d8d1c4]"}`}>
                  <div className="grid sm:grid-cols-[42%_58%] min-h-[220px]">
                    <div className="relative min-h-[220px]">
                      <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    </div>
                    <div className="p-5 md:p-6 flex flex-col">
                      <p className="font-merriweather text-[11px] uppercase tracking-[0.14em] text-[#74F5A1] mb-3">{item.outcome}</p>
                      <h4 className={`font-italiana text-[28px] leading-[1.02] mb-2 ${isDark ? "text-white" : "text-[#1e1a17]"}`}>{item.title}</h4>
                      <p className={`font-merriweather text-[14px] leading-[1.75] ${isDark ? "text-white/85" : "text-[#4f4942]"}`}>{item.summary}</p>
                      <span className="mt-auto pt-4 font-merriweather text-[12px] uppercase tracking-[0.14em] text-[#74F5A1]">View breakdown</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 py-14">
        <div className="max-w-[1700px] mx-auto">
          <h3 className={`d7-reveal font-italiana text-[36px] md:text-[58px] mb-8 ${isDark ? "text-[#f3f3f3]" : "text-[#111]"}`}>FAQ</h3>
          <div className="space-y-3">
            {data.faqs.map((faq, idx) => {
              const isOpen = idx === openFaq;
              return (
                <div key={faq.q} className={`d7-reveal rounded-xl overflow-hidden ${cardTheme}`}>
                  <button className="w-full text-left p-5 flex items-center justify-between transition-colors duration-300 hover:bg-white/[0.03]" onClick={() => setOpenFaq(isOpen ? -1 : idx)}>
                    <span className="font-merriweather text-[14px] md:text-[15px]">{faq.q}</span>
                    <span className={`text-[#74F5A1] text-xl transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}>+</span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                    style={{
                      maxHeight: isOpen ? `${faqHeights[idx] || 0}px` : "0px",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div ref={(el) => (faqContentRefs.current[idx] = el)}>
                      <p className={`px-5 pb-5 font-merriweather text-[14px] leading-[1.8] ${isDark ? "text-white/85" : "text-[#4a453f]"}`}>{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 py-14">
        <div className="max-w-[1700px] mx-auto">
          <h3 className={`d7-reveal font-italiana text-[36px] md:text-[58px] mb-8 ${isDark ? "text-[#f3f3f3]" : "text-[#111]"}`}>Related Services</h3>
          <div className="grid md:grid-cols-3 gap-5">
            {data.related.map((service) => (
              <Link key={service.slug} href={`/services1/${service.slug}`} className={`d7-reveal rounded-xl overflow-hidden block transition-transform duration-300 hover:-translate-y-1 ${cardTheme}`}>
                <div className="relative h-[340px] sm:h-[380px] md:h-[420px] lg:h-[460px]">
                  <Image src={service.image} alt={service.title} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6 md:p-8 min-h-[120px]">
                  <h4 className="font-italiana text-[26px] leading-tight mb-3">{service.title}</h4>
                  <p className={`font-merriweather text-[14px] leading-[1.7] ${isDark ? "text-white/85" : "text-[#4e4942]"}`}>{service.description}</p>
                  <span className="inline-block mt-4 text-[#74F5A1] font-merriweather text-sm">View Service -&gt;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-10 lg:px-16 pt-10 pb-20 md:pb-24">
        <div className="services1-detail-cta-box max-w-[1700px] mx-auto d7-reveal rounded-[24px] md:rounded-[30px] p-8 md:p-12 bg-gradient-to-r from-[#74F5A1] via-[#5FE08D] to-[#3BC972] shadow-[0_28px_80px_rgba(116,245,161,0.28)]">
          <h3 className="services1-detail-cta-heading font-italiana text-[36px] md:text-[58px] leading-[1.1] max-w-4xl">Ready to put AI to work in your business? Let&apos;s talk.</h3>
          <p className="services1-detail-cta-sub font-playfair text-[18px] md:text-[24px] mt-4 max-w-3xl">Get a focused roadmap, clear implementation plan, and measurable outcomes.</p>
          <Link href="/contact" className="services1-detail-cta-btn inline-flex mt-7 px-7 py-3 rounded-full bg-[#102b22] font-merriweather text-sm md:text-base">
            Book a Free Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
