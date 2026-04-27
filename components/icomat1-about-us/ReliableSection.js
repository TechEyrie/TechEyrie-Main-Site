"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Logo card data ────────────────────────────────────────────
const LOGOS = [
  {
    id: "moog",
    label: "Moog",
    content: (
      <svg viewBox="0 0 60 28" fill="none" style={{ width: 42, height: 22 }}>
        <path
          d="M2 26 C2 26 8 2 15 14 C20 22 20 22 20 14 C20 6 24 2 30 14 C34 22 34 22 34 14 C34 6 40 2 46 14 C52 24 58 26 58 26"
          stroke="#1a1a1a"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    id: "bae",
    label: "BAE Systems",
    content: (
      <span style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: "0.85rem",
        fontWeight: 400,
        letterSpacing: "0.22em",
        color: "#1a1a1a",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}>
        BAE&nbsp; SYSTEMS
      </span>
    ),
  },
  {
    id: "hyundai",
    label: "Hyundai",
    content: (
      <svg viewBox="0 0 120 32" fill="none" style={{ width: 118, height: 32 }}>
        <ellipse cx="16" cy="16" rx="15" ry="14" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
        <path d="M8 22 C14 10 18 22 16 16 C14 10 18 22 24 10" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <text x="36" y="22" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="14" fontWeight="500" letterSpacing="1" fill="#1a1a1a">HYUNDAI</text>
      </svg>
    ),
  },
  {
    id: "pall",
    label: "Pall Corporation",
    content: (
      <svg viewBox="0 0 140 32" fill="none" style={{ width: 138, height: 32 }}>
        <ellipse cx="20" cy="16" rx="18" ry="13" stroke="#1a1a1a" strokeWidth="1.4" fill="none"/>
        <text x="8" y="21" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="11.5" fontWeight="700" letterSpacing="1.5" fill="#1a1a1a">PALL</text>
        <text x="44" y="21" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.5" fill="#1a1a1a">Pall Corporation</text>
      </svg>
    ),
  },
  {
    id: "jlr",
    label: "Jaguar Land Rover",
    content: (
      <span style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: "0.75rem",
        fontWeight: 400,
        letterSpacing: "0.28em",
        color: "#1a1a1a",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}>
        JAGUAR&nbsp;/&nbsp;LAND&nbsp;ROVER
      </span>
    ),
  },
  {
    id: "esa",
    label: "ESA",
    content: (
      <svg viewBox="0 0 64 32" fill="none" style={{ width: 60, height: 30 }}>
        <circle cx="16" cy="16" r="14" stroke="#1a1a1a" strokeWidth="1.4" fill="none"/>
        <path d="M16 6 L17.5 11.5 L23 11.5 L18.5 14.8 L20.2 20.5 L16 17 L11.8 20.5 L13.5 14.8 L9 11.5 L14.5 11.5 Z" fill="#1a1a1a"/>
        <text x="34" y="21" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="14" fontWeight="500" letterSpacing="1.5" fill="#1a1a1a">esa</text>
      </svg>
    ),
  },
];

// ── Logo card ─────────────────────────────────────────────────
function LogoCard({ logo, index }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(card,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0,
        duration: 0.65,
        ease: "power3.out",
        delay: index * 0.08,
        scrollTrigger: { trigger: card, start: "top 90%", once: true },
      }
    );

    const onEnter = () => gsap.to(card, {
      y: -5,
      boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
      duration: 0.3,
      ease: "power2.out",
    });
    const onLeave = () => gsap.to(card, {
      y: 0,
      boxShadow: "0 0px 0px rgba(0,0,0,0)",
      duration: 0.35,
      ease: "power2.inOut",
    });

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      role="img"
      aria-label={logo.label}
      style={{
        /* flex-grow so all 6 cards fill the full row width equally */
        flex: "1 1 0",
        minWidth: 0,
        background: "#ebebea",
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        /* ── Fix 2: taller cards — more vertical padding ── */
        padding: "clamp(44px, 5vw, 64px) clamp(16px, 2vw, 28px)",
        opacity: 0,
        cursor: "default",
        willChange: "transform",
        border: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      {logo.content}
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────
export default function ReliableSection({
  heading       = "Reliable by design.",
  primaryText   = "They choose ICOMAT because we deliver what was previously considered impossible: steered fiber, defect-free composite structures, produced at industrial speed and with certainty.",
  secondaryText = "We work with engineers operating where performance, reliability, and scale are non-negotiable.",
  logos         = LOGOS,
}) {
  const headingRef   = useRef(null);
  const primaryRef   = useRef(null);
  const secondaryRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(headingRef.current,
      { opacity: 0, x: -28 },
      {
        opacity: 1, x: 0, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 88%", once: true },
      }
    );
    gsap.fromTo(
      [primaryRef.current, secondaryRef.current],
      { opacity: 0, y: 18 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.14,
        scrollTrigger: { trigger: primaryRef.current, start: "top 88%", once: true },
      }
    );
  }, []);

  return (
    <>
      <section
        style={{
          width: "100%",
          background: "#f5f4f0",
          /* ── Fix 1: use horizontal padding directly — no inner maxWidth cap ── */
          padding: "clamp(64px, 8vw, 110px) clamp(32px, 5vw, 80px)",
          boxSizing: "border-box",
        }}
      >
        <div style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(48px, 6vw, 80px)",
        }}>

          {/* ── Top row: Heading far left / Text far right ─────── */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "clamp(32px, 4vw, 64px)",
          }}>

            {/* LEFT: heading */}
            <h2
              ref={headingRef}
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "clamp(2rem, 3.4vw, 3.8rem)",
                fontWeight: 600,
                lineHeight: 1.07,
                letterSpacing: "-0.025em",
                color: "#0a0a09",
                margin: 0,
                opacity: 0,
                textAlign: "left",
                /* heading takes up to ~40% of the row */
                maxWidth: "40%",
                flexShrink: 0,
              }}
            >
              {heading}
            </h2>

            {/* RIGHT: two paragraphs */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(14px, 1.8vw, 22px)",
              maxWidth: "36%",
              flexShrink: 0,
              marginLeft: "auto",
              textAlign: "left",
            }}>
              <p
                ref={primaryRef}
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "clamp(0.95rem, 1.1vw, 1.08rem)",
                  fontWeight: 400,
                  lineHeight: 1.68,
                  color: "#0a0a09",
                  margin: 0,
                  opacity: 0,
                }}
              >
                {primaryText}
              </p>
              <p
                ref={secondaryRef}
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "clamp(0.95rem, 1.1vw, 1.08rem)",
                  fontWeight: 400,
                  lineHeight: 1.68,
                  color: "rgba(10,10,9,0.42)",
                  margin: 0,
                  opacity: 0,
                }}
              >
                {secondaryText}
              </p>
            </div>
          </div>

          {/* ── Logo cards — fill full width ─────────────────── */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            /* gap between cards */
            gap: "clamp(8px, 1vw, 14px)",
            alignItems: "stretch",
            width: "100%",
          }}>
            {logos.map((logo, i) => (
              <LogoCard key={logo.id} logo={logo} index={i} />
            ))}
          </div>

        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .reliable-top {
            flex-direction: column !important;
          }
          .reliable-top h2,
          .reliable-text {
            max-width: 100% !important;
          }
        }
        @media (max-width: 640px) {
          .reliable-logos {
            flex-wrap: wrap !important;
          }
          .reliable-logos > div {
            flex: 1 1 calc(33% - 10px) !important;
            min-width: 100px !important;
          }
        }
        @media (max-width: 420px) {
          .reliable-logos > div {
            flex: 1 1 calc(50% - 8px) !important;
          }
        }
      `}</style>
    </>
  );
}