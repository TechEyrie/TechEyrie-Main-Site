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

export default function Home8CTA() {
  const sectionRef = useRef(null);
  const glowRef = useRef(null);
  const animFrameRef = useRef(null);
  const currentPos = useRef({ x: 50, y: 50 });
  const targetPos = useRef({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const headingLineRefs = useRef([]);
  const buttonRef = useRef(null);

  // â”€â”€ Cursor glow RAF â€” updates CSS custom props on section + direct style on glow div â”€â”€
  useEffect(() => {
    const node = sectionRef.current;
    const glow = glowRef.current;
    if (!node || !glow) return;

    const tick = () => {
      const c = currentPos.current;
      const t = targetPos.current;
      c.x += (t.x - c.x) * 0.05;
      c.y += (t.y - c.y) * 0.05;

      // Directly set background on the glow element â€” most reliable
      glow.style.background = `radial-gradient(ellipse 650px 550px at ${c.x}% ${c.y}%, rgba(116, 245, 161, 0.50) 0%, rgba(103, 191, 218, 0.28) 40%, transparent 70%)`;

      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (!isHovering) setIsHovering(true);
    targetPos.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Smoothly drift glow back to center
    targetPos.current = { x: 50, y: 50 };
  };

  // â”€â”€ Animations â”€â”€
  useGSAP(
    () => {
      const lines = headingLineRefs.current.filter(Boolean);
      if (lines.length) {
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
            trigger: lines[0],
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }

      if (buttonRef.current) {
        gsap.set(buttonRef.current, { autoAlpha: 0, y: 16 });
        gsap.to(buttonRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.55,
          scrollTrigger: {
            trigger: buttonRef.current,
            start: "top 92%",
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
          "linear-gradient(to bottom, #1b4732 0%, #162d24 35%, #101e27 68%, #050a08 100%)",
        minHeight: "60vh",
      }}
    >
      {/* â”€â”€ Cursor glow â€” RAF-driven, direct style mutation â”€â”€ */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          // Initial centered glow so it's visible before any mouse move
          background:
            "radial-gradient(ellipse 650px 550px at 50% 50%, rgba(116, 245, 161, 0.35) 0%, rgba(103, 191, 218, 0.18) 40%, transparent 70%)",
          opacity: 1,
        }}
      />

      {/* â”€â”€ Ambient static glow â€” bottom left warm purple, always visible â”€â”€ */}
      <div
        className="pointer-events-none absolute inset-0 z-[0]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 15% 80%, rgba(167, 180, 49, 0.32) 0%, transparent 65%)",
        }}
      />

      {/* Content */}
      <div className="relative z-[2] flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 sm:px-10 md:px-14 lg:px-16">

        {/* Heading */}
        <h2 className="font-italiana mb-10 text-center text-[30px] sm:text-[40px] md:text-[52px] lg:text-[60px] xl:text-[68px] font-semibold leading-[0.96] tracking-[-0.02em] text-[#f3f3f3] uppercase">
          {HEADING_LINES.map((line, i) => (
            <span
              key={i}
              style={{ display: "block", overflow: "hidden", paddingBottom: "0.09em" }}
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

        {/* CTA Button */}
        <a
          ref={buttonRef}
          href="#"
          className="font-merriweather inline-flex items-center rounded-full border border-[#74F5A1]/50 px-8 py-[10px] text-[12px] sm:text-[13px] font-medium tracking-[0.1em] text-[#f3f3f3] uppercase transition-all duration-300 hover:bg-[#74F5A1] hover:text-[#162d24]"
        >
          FILL THE FORM
        </a>

      </div>
    </section>
  );
}
