"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Dot-matrix digit map (5 wide × 7 tall) ───────────────────
const DOT_MAP = {
  "0": [
    [0,1,1,1,0],[1,0,0,0,1],[1,0,0,1,1],
    [1,0,1,0,1],[1,1,0,0,1],[1,0,0,0,1],[0,1,1,1,0],
  ],
  "1": [
    [0,0,1,0,0],[0,1,1,0,0],[0,0,1,0,0],
    [0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0],
  ],
  "2": [
    [0,1,1,1,0],[1,0,0,0,1],[0,0,0,0,1],
    [0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,1,1,1,1],
  ],
  "3": [
    [1,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],
    [0,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[1,1,1,1,0],
  ],
  "4": [
    [0,0,0,1,0],[0,0,1,1,0],[0,1,0,1,0],
    [1,0,0,1,0],[1,1,1,1,1],[0,0,0,1,0],[0,0,0,1,0],
  ],
  "5": [
    [1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],
    [1,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[1,1,1,1,0],
  ],
  "6": [
    [0,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],
    [1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0],
  ],
  "7": [
    [1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],
    [0,0,1,0,0],[0,1,0,0,0],[0,1,0,0,0],[0,1,0,0,0],
  ],
  "8": [
    [0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],
    [0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0],
  ],
  "9": [
    [0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],
    [0,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[0,1,1,1,0],
  ],
  "X": [
    [1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],
    [0,0,1,0,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1],
  ],
  "K": [
    [1,0,0,1,0],[1,0,1,0,0],[1,1,0,0,0],
    [1,0,1,0,0],[1,0,0,1,0],[1,0,0,1,0],[1,0,0,0,1],
  ],
  "+": [
    [0,0,0,0,0],[0,0,1,0,0],[0,0,1,0,0],
    [1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0],
  ],
  "W": [
    [1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],
    [1,0,1,0,1],[1,0,1,0,1],[1,1,0,1,1],[1,0,0,0,1],
  ],
  "P": [
    [1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],
    [1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],
  ],
};

function DotChar({ char, dotSize = 6, gap = 3, color = "rgba(0,0,0,0.15)" }) {
  const grid = DOT_MAP[char.toUpperCase()];
  if (!grid) return null;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: `${gap}px`, flexShrink: 0 }}>
      {grid.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: `${gap}px` }}>
          {row.map((cell, ci) => (
            <div key={ci} style={{
              width: `${dotSize}px`, height: `${dotSize}px`,
              borderRadius: "50%",
              background: cell ? color : "transparent",
              flexShrink: 0,
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function DotMatrix({ value, dotSize = 7, gap = 3.5, charGap = 10, color = "rgba(0,0,0,0.18)" }) {
  const chars = value.toUpperCase().split("").filter((c) => DOT_MAP[c]);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: `${charGap}px`, userSelect: "none" }}>
      {chars.map((c, i) => (
        <DotChar key={i} char={c} dotSize={dotSize} gap={gap} color={color} />
      ))}
    </div>
  );
}

// ── Stat cell ─────────────────────────────────────────────────
function StatCell({ label, sublabel, value, isLeftCol }) {
  const cellRef = useRef(null);
  const lineRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cell = cellRef.current;
    const line = lineRef.current;
    if (!cell || !line) return;

    gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

    ScrollTrigger.create({
      trigger: cell,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(line, { scaleX: 1, duration: 0.75, ease: "power2.inOut" });
        gsap.fromTo(cell,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.1 }
        );
        setVisible(true);
      },
    });
  }, []);

  return (
    <div
      ref={cellRef}
      style={{
        position: "relative",
        paddingTop: "24px",
        paddingBottom: "40px",
        paddingRight: isLeftCol ? "40px" : "0",
        paddingLeft:  isLeftCol ? "0"   : "40px",
        borderRight: isLeftCol ? "1px solid rgba(0,0,0,0.12)" : "none",
        opacity: 0,
      }}
    >
      {/* Top border line */}
      <div ref={lineRef} style={{
        position: "absolute",
        top: 0,
        left: isLeftCol ? "0" : "40px",
        right: isLeftCol ? "40px" : "0",
        height: "1px",
        background: "rgba(0,0,0,0.18)",
      }} />

      {/* Mono label */}
      <p style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "0.62rem",
        fontWeight: 400,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "rgba(0,0,0,0.4)",
        margin: "0 0 20px",
        lineHeight: 1.6,
        whiteSpace: "pre-line",
      }}>
        {label}{sublabel ? `\n${sublabel}` : ""}
      </p>

      {/* Dot-matrix */}
      {visible && <DotMatrix value={value} dotSize={6} gap={3} charGap={8} />}
    </div>
  );
}

// ── Stats data ────────────────────────────────────────────────
const STATS = [
  { id: "team",      label: "EXPERIENCED TEAM",      sublabel: "MEMBERS",              value: "50+",  col: 0 },
  { id: "wordpress", label: "WORDPRESS",             sublabel: "EXPERTS",              value: "WP",   col: 1 },
  { id: "reviews",   label: "5-STAR GOOGLE",         sublabel: "REVIEWS",              value: "370+", col: 0 },
  { id: "projects",  label: "PROJECTS",              sublabel: "COMPLETED",            value: "2K+",  col: 1 },
];

// ── Main Section ──────────────────────────────────────────────
export default function FactorySection({
  heading      = "We're focused on creating value through service",
  description1 = "At Freshy, we believe we're a team of guides. We are focused on solving problems in order to make our clients' lives easier and their work more effective. Every process we build, every system we implement, every team member we add, aims to further that mission.",
  description2 = "",
  stats        = STATS,
}) {
  const headingRef = useRef(null);
  const rightRef   = useRef(null);
  const numbersRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(headingRef.current,
      { opacity: 0, x: -32 },
      {
        opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 88%", once: true },
      }
    );
    gsap.fromTo(rightRef.current,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: "power3.out", delay: 0.12,
        scrollTrigger: { trigger: rightRef.current, start: "top 88%", once: true },
      }
    );
    gsap.fromTo(numbersRef.current,
      { opacity: 0 },
      {
        opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.2,
        scrollTrigger: { trigger: numbersRef.current, start: "top 90%", once: true },
      }
    );
  }, []);

  return (
    <>
      <section style={{
        width: "100%",
        background: "#f5f4f0",
        padding: "clamp(72px, 9vw, 130px) 0",
        /* ── Fix 4: 90% width, centred ── */
        display: "flex",
        justifyContent: "center",
      }}>
        {/* Inner wrapper — wider with bigger inter-column gap */}
        <div style={{
          width: "94%",
          maxWidth: "1680px",
          display: "grid",
          /* ── Equal halves, heading left / content right ── */
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(80px, 9vw, 180px)",
          alignItems: "start",
        }}>

          {/* ── LEFT: Heading — anchored to far left ─────────── */}
          {/* Fix 2: no auto-margin, text-align left, padding-right pushes it
              toward the left edge of its column             */}
          <div style={{
            paddingRight: "clamp(24px, 4vw, 64px)",
          }}>
            <h2
              ref={headingRef}
              style={{
                fontFamily: "inherit",
                fontSize: "clamp(1.9rem, 2.8vw, 3.2rem)",
                fontWeight: 900,
                lineHeight: 1.07,
                letterSpacing: "-0.025em",
                color: "#0a0a09",
                margin: 0,
                opacity: 0,
                textAlign: "left",   /* explicit left-align */
              }}
            >
              {heading}
            </h2>
          </div>

          {/* ── RIGHT: Content — anchored to far right, left-aligned text ── */}
          {/* Fix 3: padding-left pushes content toward the right edge,
              but all text inside remains left-aligned              */}
          <div
            ref={rightRef}
            style={{
              paddingLeft: "clamp(24px, 4vw, 64px)",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(40px, 5vw, 60px)",   /* Fix 1 vertical rhythm */
              alignItems: "flex-start",
              opacity: 0,
            }}
          >

            {/* Description paragraphs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "22px", width: "100%" }}>
              <p style={{
                fontFamily: "inherit",
                /* ── Fix 1: bigger text ── */
                fontSize: "clamp(1rem, 1.15vw, 1.15rem)",
                fontWeight: 400,
                lineHeight: 1.72,
                color: "#0a0a09",
                margin: 0,
              }}>
                {description1}
              </p>
              {description2 ? (
                <p style={{
                  fontFamily: "inherit",
                  fontSize: "clamp(1rem, 1.15vw, 1.15rem)",
                  fontWeight: 400,
                  lineHeight: 1.72,
                  color: "#0a0a09",
                  margin: 0,
                }}>
                  {description2}
                </p>
              ) : null}
            </div>

            {/* The Numbers block */}
            <div style={{ width: "100%" }}>
              <p
                ref={numbersRef}
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  /* ── Fix 1: bigger label ── */
                  fontSize: "clamp(1rem, 1.15vw, 1.15rem)",
                  fontWeight: 400,
                  color: "#0a0a09",
                  margin: "0 0 clamp(20px, 2.5vw, 32px)",
                  opacity: 0,
                }}
              >
                The Numbers
              </p>

              {/* 2 × 2 stats grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "0",
                rowGap: "0",
                width: "100%",
              }}>
                {stats.map((stat) => (
                  <StatCell
                    key={stat.id}
                    label={stat.label}
                    sublabel={stat.sublabel}
                    value={stat.value}
                    isLeftCol={stat.col === 0}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .factory-inner {
            grid-template-columns: 1fr !important;
            width: 92% !important;
          }
          .factory-right {
            padding-left: 0 !important;
          }
          .factory-left {
            padding-right: 0 !important;
          }
        }
      `}</style>
    </>
  );
}