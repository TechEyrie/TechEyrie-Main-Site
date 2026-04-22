"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

// Dot positions: [x%, y%] as percentage of section — matches reference layout
const DOTS = [
  // Left cluster
  { x: 6,  y: 35 },
  { x: 6,  y: 65 },
  { x: 16, y: 35 },
  { x: 16, y: 65 },
  // Center-left
  { x: 36, y: 20 },
  { x: 36, y: 80 },
  // Center
  { x: 51, y: 16 },
  { x: 51, y: 84 },
  // Center-right
  { x: 64, y: 20 },
  { x: 64, y: 80 },
  // Right cluster
  { x: 84, y: 35 },
  { x: 84, y: 65 },
  { x: 94, y: 35 },
  { x: 94, y: 65 },
];

export default function RTSSection() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;

      // ── Dots: slide in from outside screen on enter ────────────────
      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        const isLeft = parseFloat(dot.style.left) < 50;
        // Start each dot far off-screen left or right
        gsap.set(dot, { x: isLeft ? -300 : 300, opacity: 0 });

        ScrollTrigger.create({
          trigger: section,
          start: "top 75%",
          onEnter: () => {
            gsap.to(dot, {
              x: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              delay: i * 0.04,
            });
          },
          onLeaveBack: () => {
            gsap.to(dot, {
              x: isLeft ? -300 : 300,
              opacity: 0,
              duration: 0.6,
              ease: "power2.in",
            });
          },
        });
      });

      // ── Text: character-by-character color on scroll ───────────────
      if (textRef.current) {
        const split = new SplitText(textRef.current, { type: "chars" });
        const chars = split.chars;

        // All chars start as light gray
        gsap.set(chars, { color: "#c0c0c0" });

        // Use one scrubbed tween instead of per-char ScrollTriggers to avoid boundary jank.
        gsap.to(chars, {
          color: "#111111",
          ease: "none",
          stagger: {
            each: 0.02,
            from: "start",
          },
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom 35%",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f5f5f5] flex items-center justify-center"
      style={{ minHeight: "100vh" }}
    >
      {/* Dots */}
      {DOTS.map((pos, i) => (
        <span
          key={i}
          ref={(el) => (dotsRef.current[i] = el)}
          className="absolute rounded-full bg-[#aaaaaa]"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: "5px",
            height: "5px",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Center Text */}
      <div className="relative z-10 text-center px-6">
        <p
          ref={textRef}
          className="font-bold leading-tight tracking-tight"
          style={{
            fontSize: "clamp(1.6rem, 4vw, 4.6rem)",
            color: "#c0c0c0", // initial gray — GSAP overrides per char
          }}
        >
          Freshy builds WordPress.
          <br />
          Design, development, and support.
        </p>
      </div>
    </section>
  );
}