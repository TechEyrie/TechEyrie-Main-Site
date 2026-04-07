"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADING_LINES = [
  "READY TO START A PROJECT?",
  "FILL THE BRIEF FORM AND WE'LL",
  "CONTACT YOU SHORTLY WITH THE",
  "CLEAN PROJECT PLAN.",
];

export default function HomeCTABlue() {
  const sectionRef      = useRef(null);
  const glowRef         = useRef(null);
  const rafRef          = useRef(null);
  const currentPos      = useRef({ x: 50, y: 50 });
  const targetPos       = useRef({ x: 50, y: 50 });
  const headingWrapRef  = useRef(null);
  const headingLineRefs = useRef([]);
  const buttonRef       = useRef(null);
  const [hovering, setHovering] = useState(false);

  // ── RAF cursor glow — direct style mutation, guaranteed 60fps ──
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const tick = () => {
      const c = currentPos.current;
      const t = targetPos.current;
      c.x += (t.x - c.x) * 0.055;
      c.y += (t.y - c.y) * 0.055;
      glow.style.background = `radial-gradient(ellipse 700px 580px at ${c.x}% ${c.y}%, rgba(40, 110, 220, 0.72) 0%, rgba(20, 70, 160, 0.40) 40%, transparent 70%)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (!hovering) setHovering(true);
    targetPos.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const handleMouseLeave = () => {
    setHovering(false);
    targetPos.current = { x: 50, y: 50 };
  };

  // ── GSAP scroll animations ──
  useGSAP(
    () => {
      // Heading kinetic reveal
      const lines = headingLineRefs.current.filter(Boolean);
      if (lines.length && headingWrapRef.current) {
        gsap.set(lines, {
          yPercent: 110,
          scaleY: 0.62,
          autoAlpha: 0,
          filter: "blur(6px)",
          transformOrigin: "center bottom",
        });
        gsap.to(lines, {
          yPercent: 0,
          scaleY: 1,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.15,
          ease: "power3.out",
          stagger: 0.13,
          scrollTrigger: {
            trigger: headingWrapRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // Button fade up
      if (buttonRef.current) {
        gsap.set(buttonRef.current, { autoAlpha: 0, y: 20 });
        gsap.to(buttonRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          delay: 0.6,
          scrollTrigger: {
            trigger: headingWrapRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 120% 100% at 50% 100%, #1a4fa8 0%, #0f2d6b 35%, #070f2e 65%, #020510 100%)",
        minHeight: "58vh",
      }}
    >
      {/* ── Layer 0: Ambient static blue glow — always visible ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[0]"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 100%, rgba(30, 90, 200, 0.55) 0%, rgba(10, 40, 120, 0.25) 50%, transparent 75%)",
        }}
      />

      {/* ── Layer 1: Cursor glow — RAF driven, direct style mutation ── */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          // Initial centered glow visible before any mouse interaction
          background:
            "radial-gradient(ellipse 700px 580px at 50% 50%, rgba(40, 110, 220, 0.55) 0%, rgba(20, 70, 160, 0.28) 40%, transparent 70%)",
          opacity: hovering ? 1 : 0.55,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* ── Layer 2: Edge vignette — darkens corners for depth ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(2, 5, 16, 0.60) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-[3] flex min-h-[58vh] flex-col items-center justify-center px-6 py-20 sm:px-12 md:px-16 lg:px-20">

        {/* Heading wrapper — stable ScrollTrigger target */}
        <div ref={headingWrapRef} className="mb-10 w-full">
          <h2 className="font-ppneue text-center text-[28px] sm:text-[38px] md:text-[50px] lg:text-[58px] xl:text-[66px] font-semibold leading-[0.96] tracking-[-0.02em] text-white uppercase">
            {HEADING_LINES.map((line, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  overflow: "hidden",
                  paddingBottom: "0.09em",
                }}
              >
                <span
                  ref={(el) => (headingLineRefs.current[i] = el)}
                  style={{
                    display: "block",
                    transformOrigin: "center bottom",
                    willChange: "transform, opacity, filter",
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* CTA pill button */}
        <a
          ref={buttonRef}
          href="#"
          className="font-ppneue inline-flex items-center rounded-full border border-white/40 px-8 py-[11px] text-[12px] sm:text-[13px] font-medium tracking-[0.1em] text-white uppercase transition-all duration-300 hover:bg-white hover:text-[#0f2d6b]"
        >
          FILL THE FORM
        </a>

      </div>
    </section>
  );
}