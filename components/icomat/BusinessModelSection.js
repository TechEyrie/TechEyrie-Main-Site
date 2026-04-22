"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const BODY_PARAS = [
  "ICOMAT eliminates compromise in composites production.",
  "We provide an end-to-end solution from structural design to finished composite parts.",
  "Our proprietary system unites design software, materials engineering, and automated production into one integrated process.",
  "It is tailored to the needs of each customer. We can supply preforms or finished parts and can set-up production lines near our clients for high-volume output.",
];

const CLIENT_BENEFITS = [
  {
    title: "No CapEx.",
    desc: "Scale without upfront investment. We own the system. You receive the output.",
  },
  {
    title: "Fully integrated system.",
    desc: "Software, machines, and production under one roof. No vendors. No handoffs. No risk.",
  },
  {
    title: "Scalable from day one.",
    desc: "Expands from prototype to full scale production, rapidly and without limits.",
  },
];

const COMPARISON_ROWS = [
  { others: "Costly, fragmented supply chains", icomat: "Unified production system"      },
  { others: "Slow, limited throughput",          icomat: "Automated high-rate production" },
  { others: "Unreliable scaling",                icomat: "Scalable from day one"          },
];

export default function BusinessModelSection() {
  const sectionRef    = useRef(null);
  const labelRef      = useRef(null);
  const headingRef    = useRef(null);
  const bodyRef       = useRef(null);
  const benefitsRef   = useRef(null);
  const benefitItems  = useRef([]);
  const dividerRef    = useRef(null);
  const compRef       = useRef(null);
  const compRowRefs   = useRef([]);
  const colHeaderRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Label ────────────────────────────────────────────────
      gsap.fromTo(labelRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── Heading word-by-word ─────────────────────────────────
      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: "lines,words" });
        gsap.set(split.words, { opacity: 0, y: 36 });
        gsap.to(split.words, {
          opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.06,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // ── Divider grows ────────────────────────────────────────
      gsap.fromTo(dividerRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1, duration: 1.2, ease: "power3.out",
          scrollTrigger: {
            trigger: dividerRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── Body paragraphs ──────────────────────────────────────
      const paras = bodyRef.current?.querySelectorAll("p");
      if (paras?.length) {
        gsap.fromTo(paras,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: "power3.out", stagger: 0.12,
            scrollTrigger: {
              trigger: bodyRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // ── Benefits label ───────────────────────────────────────
      gsap.fromTo(benefitsRef.current?.querySelector(".benefits-label"),
        { opacity: 0, y: 14 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── Benefit items ────────────────────────────────────────
      const items = benefitItems.current.filter(Boolean);
      gsap.fromTo(items,
        { opacity: 0, y: 22 },
        {
          opacity: 1, y: 0, duration: 0.75, ease: "power3.out", stagger: 0.14,
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── Comparison col headers ───────────────────────────────
      gsap.fromTo(colHeaderRefs.current.filter(Boolean),
        { opacity: 0, y: 14 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: "power3.out", stagger: 0.1,
          scrollTrigger: {
            trigger: compRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── Comparison rows ──────────────────────────────────────
      gsap.fromTo(compRowRefs.current.filter(Boolean),
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12,
          scrollTrigger: {
            trigger: compRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#0a0a0a] px-6 sm:px-10 md:px-16 lg:px-20 py-24 md:py-32"
    >

      {/* ── Label + Heading ───────────────────────────────────── */}
      <div className="max-w-[520px]">
        <p
          ref={labelRef}
          className="text-[13px] font-medium mb-4"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Business model
        </p>
        <h2
          ref={headingRef}
          className="text-white font-bold leading-[1.05] tracking-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
        >
          We don't sell machines. We unlock a new way to build.
        </h2>
      </div>

      {/* ── Divider ───────────────────────────────────────────── */}
      <div
        ref={dividerRef}
        className="w-full mt-16 md:mt-20 mb-14 md:mb-16"
        style={{ height: "1px", background: "rgba(255,255,255,0.1)" }}
      />

      {/* ── Single 3-col grid — everything lives here ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[35%_30%_35%] gap-10 md:gap-0">

        {/* Empty left col — aligns with heading */}
        <div className="hidden md:block" />

        {/* ── MIDDLE COL: body paragraphs + Others comparison ─── */}
        <div className="flex flex-col pr-0 md:pr-10">

          {/* Body paragraphs */}
          <div ref={bodyRef} className="flex flex-col gap-4">
            {BODY_PARAS.map((para, i) => (
              <p
                key={i}
                className="leading-relaxed"
                style={{
                  fontSize: "clamp(0.82rem, 3vw, 1.1rem)",
                  color: i === 0 ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.82)",
                  fontWeight: 500,
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Others comparison — directly under body text */}
          <div ref={compRef} className="mt-60">

            {/* OTHERS header */}
            <div
              ref={(el) => (colHeaderRefs.current[0] = el)}
              className="py-2.5 px-4 rounded-xl mb-2"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <p
                className="font-semibold tracking-[0.14em] uppercase"
                style={{
                  fontSize: "clamp(0.82rem, 3vw, 1.1rem)",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                Others
              </p>
            </div>

            {/* Others rows */}
            <div className="flex flex-col">
              {COMPARISON_ROWS.map((row, i) => (
                <div key={i} ref={(el) => (compRowRefs.current[i] = el)}>
                  <div className="py-4 px-1">
                    <p
                      className="font-medium"
                      style={{
                        fontSize: "clamp(0.82rem, 3vw, 1.1rem)",
                        color: "rgba(255,255,255,0.32)",
                      }}
                    >
                      {row.others}
                    </p>
                  </div>
                  {i < COMPARISON_ROWS.length - 1 && (
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── RIGHT COL: benefits + ICOMAT Way comparison ──────── */}
        <div ref={benefitsRef} className="flex flex-col pl-0 md:pl-12">

          {/* Benefits label */}
          <p
            className="benefits-label text-[13px] font-semibold mb-8"
            style={{ color: "rgba(255,255,255,0.88)" }}
          >
            For our clients, this means:
          </p>

          {/* Benefit items */}
          <div className="flex flex-col gap-6">
            {CLIENT_BENEFITS.map((b, i) => (
              <div
                key={i}
                ref={(el) => (benefitItems.current[i] = el)}
                className="flex flex-col gap-1"
              >
                <p
                  className="font-semibold"
                  style={{
                    fontSize: "clamp(0.82rem, 3vw, 1.1rem)",
                    color: "rgba(255,255,255,0.88)",
                  }}
                >
                  {b.title}
                </p>
                <p
                  className="leading-relaxed"
                  style={{
                    fontSize: "clamp(0.82rem, 3vw, 1.1rem)",
                    color: "rgba(255,255,255,0.32)",
                  }}
                >
                  {b.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ICOMAT Way comparison — directly under benefits */}
          <div className="mt-46">

            {/* THE ICOMAT WAY header */}
            <div
              ref={(el) => (colHeaderRefs.current[1] = el)}
              className="py-2.5 px-4 rounded-xl mb-2"
              style={{ background: "rgba(255,255,255,0.94)" }}
            >
              <p
                className="font-semibold tracking-[0.14em] uppercase"
                style={{
                  fontSize: "clamp(0.82rem, 3vw, 1.1rem)",
                  color: "rgba(0,0,0,0.75)",
                }}
              >
                The ICOMAT Way
              </p>
            </div>

            {/* ICOMAT rows */}
            <div className="flex flex-col">
              {COMPARISON_ROWS.map((row, i) => (
                <div key={i}>
                  <div className="py-4 px-1">
                    <p
                      className="font-semibold"
                      style={{
                        fontSize: "clamp(0.82rem, 3vw, 1.1rem)",
                        color: "rgba(255,255,255,0.88)",
                      }}
                    >
                      {row.icomat}
                    </p>
                  </div>
                  {i < COMPARISON_ROWS.length - 1 && (
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}