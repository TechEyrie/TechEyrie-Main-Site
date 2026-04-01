"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services1ListingDarkSurface } from "../services1/services1ListingSurfaces";
import { industriesCatalog } from "./industriesData";

gsap.registerPlugin(ScrollTrigger);

const BRIEF_EMAIL = "contact@chipsa.design";

export default function IndustriesPageCTA({ theme = "dark" }) {
  const isDark = theme === "dark";
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [sector, setSector] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | sending | success

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 56,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      gsap.from([leftRef.current, rightRef.current], {
        opacity: 0,
        y: 28,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.12,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Please add your name and work email.");
      return;
    }
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      setError("Please enter a valid email address.");
      return;
    }

    setPhase("sending");
    const subject = encodeURIComponent(
      `Sector briefing request${sector ? `: ${sector}` : ""}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Company: ${company.trim() || "—"}`,
        `Sector focus: ${sector || "—"}`,
        "",
        message.trim() || "—",
      ].join("\n"),
    );

    window.setTimeout(() => {
      setPhase("success");
      try {
        window.location.href = `mailto:${BRIEF_EMAIL}?subject=${subject}&body=${body}`;
      } catch {
        /* ignore */
      }
    }, 450);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setCompany("");
    setSector("");
    setMessage("");
    setError("");
    setPhase("idle");
  };

  return (
    <section
      ref={rootRef}
      className="relative py-16 md:py-20 pb-28 md:pb-32 px-6 sm:px-8 md:px-12 lg:px-16 overflow-hidden"
      style={isDark ? services1ListingDarkSurface : { background: "#eef6f3" }}
    >
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full opacity-[0.14]"
        style={{ background: "radial-gradient(circle, #74F5A1 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-20%] left-[-15%] h-[380px] w-[380px] rounded-full opacity-[0.1]"
        style={{ background: "radial-gradient(circle, #67bfda 0%, transparent 68%)" }}
        aria-hidden
      />

      <div className="max-w-[1700px] mx-auto relative z-[1]">
        <div
          ref={cardRef}
          className="relative rounded-[26px] md:rounded-[32px] overflow-hidden border border-white/[0.12] shadow-[0_40px_100px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.06]"
        >
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
            aria-hidden
          />

          <div className="relative grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            {/* Left — mint editorial */}
            <div
              ref={leftRef}
              className="relative min-h-[280px] lg:min-h-[520px] p-9 md:p-12 lg:p-14 xl:p-16 bg-gradient-to-br from-[#74F5A1] via-[#59df8f] to-[#28b86e] flex flex-col justify-between"
            >
              <div
                className="absolute inset-0 opacity-[0.18] pointer-events-none mix-blend-multiply"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
                }}
                aria-hidden
              />

              <div className="relative">
                <p className="ind-mint-subtext font-merriweather text-[11px] md:text-[12px] uppercase tracking-[0.22em] mb-4">
                  Private briefing
                </p>
                <h2 className="ind-mint-text font-italiana text-[34px] sm:text-[44px] lg:text-[52px] xl:text-[58px] leading-[1.04] max-w-xl">
                  A sector narrative worth the inquiry.
                </h2>
                <p className="ind-mint-subtext font-playfair text-[16px] md:text-[19px] leading-relaxed mt-5 max-w-lg">
                  Share where you compete and what buyers should feel when they land on your brand. We reply with a
                  concise audit outline—not a generic pitch deck.
                </p>

                <ul className="mt-8 space-y-3 max-w-md">
                  {[
                    "Intent-mapped page architecture for your vertical",
                    "Editorial copy direction aligned with compliance tone",
                    "Measurement: events, funnels, and SERP milestones",
                  ].map((line) => (
                    <li
                      key={line}
                      className="ind-mint-subtext font-merriweather text-[13px] md:text-[14px] leading-snug flex gap-3"
                    >
                      <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#102b22]/75" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative mt-10 lg:mt-0 flex flex-wrap gap-x-10 gap-y-6 pt-8 border-t border-[#102b22]/15">
                <div>
                  <p className="ind-mint-text font-italiana text-[32px] md:text-[38px] leading-none">20</p>
                  <p className="ind-mint-subtext font-merriweather text-[10px] uppercase tracking-[0.18em] mt-2">
                    Sector routes
                  </p>
                </div>
                <div>
                  <p className="ind-mint-text font-italiana text-[32px] md:text-[38px] leading-none">48h</p>
                  <p className="ind-mint-subtext font-merriweather text-[10px] uppercase tracking-[0.18em] mt-2">
                    First response
                  </p>
                </div>
                <div>
                  <p className="ind-mint-text font-italiana text-[32px] md:text-[38px] leading-none">1:1</p>
                  <p className="ind-mint-subtext font-merriweather text-[10px] uppercase tracking-[0.18em] mt-2">
                    Director-led review
                  </p>
                </div>
              </div>
            </div>

            {/* Right — glass form */}
            <div
              ref={rightRef}
              className="relative min-h-[320px] lg:min-h-0 p-8 md:p-11 lg:p-14 bg-[#030806]/[0.88] backdrop-blur-[18px] border-t lg:border-t-0 lg:border-l border-white/[0.1]"
            >
              <div
                className="absolute top-0 right-0 w-[min(55%,280px)] h-[min(40%,200px)] opacity-[0.12] pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 100% 0%, #74F5A1, transparent 65%)",
                }}
                aria-hidden
              />

              {phase === "success" ? (
                <div className="relative h-full min-h-[380px] flex flex-col items-center justify-center text-center px-4 py-10">
                  <div className="mb-6 h-14 w-14 rounded-full border border-[#74F5A1]/40 flex items-center justify-center bg-[#74F5A1]/10">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#74F5A1]">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="font-italiana text-[28px] md:text-[34px] text-[#f3f3f3] leading-tight">
                    Request received
                  </h3>
                  <p className="font-merriweather text-[14px] md:text-[15px] text-[#e0d1b6]/85 max-w-sm mt-4 leading-relaxed">
                    If your mail app opened, send the draft and we&apos;ll continue from there. You can also reach us
                    directly at{" "}
                    <a href={`mailto:${BRIEF_EMAIL}`} className="text-[#74F5A1] underline-offset-2 hover:underline">
                      {BRIEF_EMAIL}
                    </a>
                    .
                  </p>
                  <div className="mt-10 flex flex-wrap gap-3 justify-center">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="font-merriweather text-[13px] px-6 py-2.5 rounded-full border border-white/20 text-[#f4f3ee] hover:bg-white/5 transition-colors"
                    >
                      Send another
                    </button>
                    <Link
                      href="/contact"
                      className="ind-mint-btn font-merriweather text-[13px] font-semibold px-6 py-2.5 rounded-full bg-[#74F5A1] hover:brightness-105 transition-all"
                    >
                      Full contact
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                      <p className="font-merriweather text-[11px] uppercase tracking-[0.2em] text-[#74F5A1]/90 mb-2">
                        Request form
                      </p>
                      <h3 className="font-italiana text-[26px] md:text-[32px] text-[#f3f3f3] leading-[1.08]">
                        Brief us in two minutes.
                      </h3>
                    </div>
                    <Link
                      href="/contact"
                      className="font-merriweather text-[12px] text-[#e0d1b6]/75 hover:text-[#74F5A1] transition-colors shrink-0"
                    >
                      Prefer a call? Contact page →
                    </Link>
                  </div>

                  <form className="ind-cta-form space-y-4 md:space-y-5" onSubmit={handleSubmit} noValidate>
                    <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="ind-cta-name" className="ind-cta-label">
                          Full name
                        </label>
                        <input
                          id="ind-cta-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          value={name}
                          onChange={(ev) => setName(ev.target.value)}
                          placeholder="Alex Mercer"
                          className="ind-cta-input font-merriweather"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="ind-cta-email" className="ind-cta-label">
                          Work email
                        </label>
                        <input
                          id="ind-cta-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(ev) => setEmail(ev.target.value)}
                          placeholder="you@company.com"
                          className="ind-cta-input font-merriweather"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="ind-cta-company" className="ind-cta-label">
                          Company <span className="text-[#e0d1b6]/45 font-normal">(optional)</span>
                        </label>
                        <input
                          id="ind-cta-company"
                          name="company"
                          type="text"
                          autoComplete="organization"
                          value={company}
                          onChange={(ev) => setCompany(ev.target.value)}
                          placeholder="Studio / fund / group"
                          className="ind-cta-input font-merriweather"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="ind-cta-sector" className="ind-cta-label">
                          Sector focus
                        </label>
                        <select
                          id="ind-cta-sector"
                          name="sector"
                          value={sector}
                          onChange={(ev) => setSector(ev.target.value)}
                          className="ind-cta-input ind-cta-select cursor-pointer font-merriweather"
                        >
                          <option value="">Select or leave open</option>
                          {industriesCatalog.map((ind) => (
                            <option key={ind.slug} value={ind.name}>
                              {ind.name}
                            </option>
                          ))}
                          <option value="Multiple sectors">Multiple sectors</option>
                          <option value="Not sure yet">Not sure yet</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="ind-cta-message" className="ind-cta-label">
                        What should we know?
                      </label>
                      <textarea
                        id="ind-cta-message"
                        name="message"
                        rows={4}
                        value={message}
                        onChange={(ev) => setMessage(ev.target.value)}
                        placeholder="Market, competitors, timeline, must-win pages…"
                        className="ind-cta-input ind-cta-textarea resize-y min-h-[112px] font-merriweather"
                      />
                    </div>

                    {error ? (
                      <p className="font-merriweather text-[13px] text-[#ffb4a8]" role="alert">
                        {error}
                      </p>
                    ) : null}

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center pt-2">
                      <button
                        type="submit"
                        disabled={phase === "sending"}
                        className="ind-mint-btn inline-flex items-center justify-center gap-2 font-merriweather text-[14px] font-bold tracking-tight px-8 py-3.5 rounded-full bg-[#74F5A1] text-[#081b15] shadow-[0_14px_40px_rgba(116,245,161,0.28)] border border-[#5bdc8c]/80 hover:brightness-105 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                      >
                        {phase === "sending" ? (
                          "Sending…"
                        ) : (
                          <>
                            Submit briefing
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 14 14"
                              aria-hidden
                              className="opacity-100 pointer-events-none shrink-0"
                            >
                              <path
                                d="M2 7H12M12 7L8.5 3.5M12 7L8.5 10.5"
                                fill="none"
                                stroke="#081b15"
                                strokeWidth="1.85"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                      <p className="font-merriweather text-[11px] text-[#e0d1b6]/55 max-w-xs sm:ml-2">
                        Submitting opens your email client with a pre-filled message you can edit before sending.
                      </p>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
