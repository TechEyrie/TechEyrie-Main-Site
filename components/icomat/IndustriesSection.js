"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INDUSTRIES = [
  {
    id: "defense",
    label: "Defense",
    heading: "Supporting leading\nindustries: Defence.",
    subheading: "Lightweight, high-strength composite structures for next-generation defence platforms — from fighter airframes to unmanned systems.",
    src: "https://images.unsplash.com/photo-1564053489984-317bbd824340?w=1600&q=85&fit=crop",
    alt: "Fighter jet in flight — defence industry",
  },
  {
    id: "aeronautics",
    label: "Aeronautics",
    heading: "Supporting leading\nindustries: Aeronautics.",
    subheading: "Enabling the next generation of commercial and advanced air mobility with optimised composite aerostructures.",
    src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=85&fit=crop",
    alt: "Commercial aircraft in flight — aeronautics industry",
  },
  {
    id: "space",
    label: "Space",
    heading: "Supporting leading\nindustries: Space.",
    subheading: "Mission-critical composite components built for the extreme demands of launch vehicles, satellites, and re-entry systems.",
    src: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1600&q=85&fit=crop",
    alt: "Rocket launch — space industry",
  },
  {
    id: "automotive",
    label: "Automotive",
    heading: "Supporting leading\nindustries: Automotive.",
    subheading: "High-rate composite production for structural vehicle components — reducing weight without compromising safety or performance.",
    src: "https://images.unsplash.com/photo-1555353540-64580b51c258?w=1600&q=85&fit=crop",
    alt: "High-performance automotive manufacturing",
  },
];

export default function IndustriesSection() {
  const sectionRef   = useRef(null);
  const containerRef = useRef(null);
  const contentRef   = useRef(null);
  const headingRef   = useRef(null);
  const subRef       = useRef(null);
  const learnRef     = useRef(null);
  const tabsRef      = useRef(null);
  const imgLayersRef = useRef([]);

  const [active, setActive] = useState(0);
  const isAnimating         = useRef(false);

  // ── Scroll expand ──────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.set(containerRef.current, {
        width: "36vw",
        height: "56vh",
        borderRadius: "20px",
        x: "50%",
        xPercent: -50,
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 1.6,
          invalidateOnRefresh: true,
        },
      })
      .to(containerRef.current, {
        width: "100vw",
        height: "100vh",
        borderRadius: "0px",
        x: 0,
        xPercent: 0,
        ease: "power2.inOut",
        duration: 1,
      }, 0)
      .fromTo(contentRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, ease: "power3.out", duration: 0.45 },
        0.55
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Tab switch ─────────────────────────────────────────────
  const switchTo = (idx) => {
    if (idx === active || isAnimating.current) return;
    isAnimating.current = true;

    const oldIdx  = active;
    const newImg  = imgLayersRef.current[idx];
    const oldImg  = imgLayersRef.current[oldIdx];
    const heading = headingRef.current;
    const sub     = subRef.current;
    const learn   = learnRef.current;

    setActive(idx);

    // Image: clips from top → reveals downward
    gsap.set(newImg, { zIndex: 2, clipPath: "inset(0% 0% 100% 0%)" });
    gsap.to(newImg, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.95,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(oldImg, { zIndex: 1 });
        gsap.set(newImg, { zIndex: 1 });
        isAnimating.current = false;
      },
    });

    // Text: fade out → swap → fade in
    gsap.timeline()
      .to([heading, sub, learn], {
        opacity: 0, y: -10,
        duration: 0.22, ease: "power2.in", stagger: 0.04,
      })
      .call(() => {
        if (heading) heading.textContent = INDUSTRIES[idx].heading;
        if (sub)     sub.textContent     = INDUSTRIES[idx].subheading;
      })
      .to([heading, sub, learn], {
        opacity: 1, y: 0,
        duration: 0.45, ease: "power3.out", stagger: 0.06,
      });
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "200vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      {/* Sticky wrapper */}
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >

        {/* ── Expanding image container ── */}
        <div
          ref={containerRef}
          style={{
            position: "relative",
            overflow: "hidden",
            background: "#111",
            willChange: "width, height, border-radius",
          }}
        >

          {/* Image layers */}
          {INDUSTRIES.map((ind, i) => (
            <img
              key={ind.id}
              ref={(el) => (imgLayersRef.current[i] = el)}
              src={ind.src}
              alt={ind.alt}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: i === 0 ? 1 : 0,
                clipPath: i === 0
                  ? "inset(0% 0% 0% 0%)"
                  : "inset(0% 0% 100% 0%)",
              }}
            />
          ))}

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              pointerEvents: "none",
              background: `
                linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 45%, transparent 70%),
                linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 35%)
              `,
            }}
          />

          {/* ── Content overlay ── */}
          <div
            ref={contentRef}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 4,
              opacity: 0,
            }}
          >

            {/* TOP LEFT — heading + sub + link — absolutely positioned */}
            <div
              style={{
                position: "absolute",
                top: "clamp(28px, 5vw, 64px)",
                left: "clamp(28px, 5vw, 64px)",
                maxWidth: "520px",
              }}
            >
              <h2
                ref={headingRef}
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "clamp(1.9rem, 3.8vw, 4rem)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.02em",
                  marginBottom: "20px",
                  whiteSpace: "pre-line",
                }}
              >
                {INDUSTRIES[0].heading}
              </h2>

              <p
                ref={subRef}
                style={{
                  color: "rgba(255,255,255,0.72)",
                  fontSize: "clamp(0.88rem, 1.1vw, 1rem)",
                  lineHeight: 1.65,
                  maxWidth: "420px",
                  marginBottom: "24px",
                  fontWeight: 400,
                }}
              >
                {INDUSTRIES[0].subheading}
              </p>

              <a
                ref={learnRef}
                href="#"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "clamp(0.8rem, 0.95vw, 0.9rem)",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.3)",
                  paddingBottom: "2px",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                }}
              >
                Learn more
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* BOTTOM LEFT — flat text tabs, anchored to bottom-left */}
            <div
              ref={tabsRef}
              style={{
                position: "absolute",
                bottom: "clamp(28px, 4vw, 56px)",
                left: "clamp(28px, 5vw, 64px)",
                display: "flex",
                alignItems: "center",
                gap: "32px",
                flexWrap: "wrap",
              }}
            >
              {INDUSTRIES.map((ind, i) => (
                <button
                  key={ind.id}
                  onClick={() => switchTo(i)}
                  style={{
                    position: "relative",
                    padding: "0",
                    paddingBottom: "6px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "clamp(0.7rem, 0.82vw, 0.78rem)",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: active === i
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.38)",
                    transition: "color 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (active !== i) e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                  }}
                  onMouseLeave={(e) => {
                    if (active !== i) e.currentTarget.style.color = "rgba(255,255,255,0.38)";
                  }}
                >
                  {ind.label}

                  {/* Animated underline */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: active === i ? "100%" : "0%",
                      height: "1.5px",
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: "2px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}