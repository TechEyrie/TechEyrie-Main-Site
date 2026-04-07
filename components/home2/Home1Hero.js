"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Home1Header from "./Home1Header";

gsap.registerPlugin(useGSAP);

const HERO_LINES = [
  ["WE", "BUILD", "HIGH-IMPACT"],
  ["ONE-PAGE", "WEBSITES"],
  ["MADE", "TO", "LAUNCH", "FAST"],
  ["AND", "SCALE", "LATER"],
];

export default function Home1Hero() {
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const animRef = useRef(null);
  const currentRef = useRef({ x: 50, y: 50 });
  const targetRef = useRef({ x: 50, y: 50 });
  const wordRefs = useRef([]);
  const metaRefs = useRef([]);
  const [isHovering, setIsHovering] = useState(false);

  // --- Smooth Cursor Gradient Follow ---
  useEffect(() => {
    const node = mainRef.current;
    if (!node) return;
    node.style.setProperty("--gx", "50%");
    node.style.setProperty("--gy", "50%");

    const animate = () => {
      const current = currentRef.current;
      const target = targetRef.current;
      const ease = 0.045;
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      node.style.setProperty("--gx", `${current.x}%`);
      node.style.setProperty("--gy", `${current.y}%`);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handlePointerMove = (e) => {
    const node = mainRef.current;
    if (!node) return;
    if (!isHovering) setIsHovering(true);
    const rect = node.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    targetRef.current = { x, y };
  };

  // --- GSAP Hero Entrance Animation ---
  useGSAP(
    () => {
      const words = wordRefs.current.filter(Boolean);
      const metas = metaRefs.current.filter(Boolean);

      if (!words.length) return;

      // Set all words hidden initially
      gsap.set(words, {
        yPercent: 110,
        scaleY: 0.62,
        autoAlpha: 0,
        filter: "blur(6px)",
        transformOrigin: "center bottom",
      });

      // Set all meta items hidden initially
      gsap.set(metas, {
        y: 24,
        autoAlpha: 0,
      });

      const tl = gsap.timeline({ delay: 0.05 });

      // Step 1: All title words animate in with stagger
      tl.to(words, {
        yPercent: 0,
        scaleY: 1,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.82,
        ease: "power3.out",
        stagger: 0.075,
      });

      // Step 2: Label placed exactly when last word finishes
      tl.addLabel("metaStart");

      // Step 3: Meta items animate in after title fully completes
      tl.to(
        metas,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
        },
        "metaStart+=0.1"
      );
    },
    { scope: heroRef }
  );

  // Flat word ref index counter (must be outside JSX map but inside render)
  let wordRefIndex = 0;

  return (
    <main
      ref={mainRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={() => setIsHovering(false)}
      className="relative min-h-screen overflow-hidden bg-[#22144a] text-white"
    >
      {/* Static background: gradient + noise */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(34, 20, 74, 0) 48%, rgba(14, 8, 36, 0.56) 78%, rgba(8, 4, 22, 0.86) 100%),
            radial-gradient(ellipse 65% 50% at 50% 26%, rgba(95, 72, 175, 0.35) 0%, rgba(39, 27, 93, 0.18) 58%, transparent 100%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.09'/%3E%3C/svg%3E")
          `,
          backgroundBlendMode: "normal, screen, overlay",
        }}
      />

      {/* Dynamic cursor glow */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: isHovering
            ? `radial-gradient(ellipse 730px 640px at var(--gx) var(--gy), rgba(255, 154, 72, 0.48) 0%, rgba(255, 118, 46, 0.3) 30%, rgba(255, 102, 36, 0.14) 56%, rgba(255, 98, 30, 0.06) 72%, transparent 86%),
               radial-gradient(ellipse 550px 470px at calc(var(--gx) + 6%) calc(var(--gy) - 4%), rgba(255, 132, 58, 0.18) 0%, rgba(255, 120, 52, 0.08) 52%, transparent 82%),
               radial-gradient(ellipse 420px 360px at calc(var(--gx) - 7%) calc(var(--gy) + 5%), rgba(255, 180, 96, 0.12) 0%, rgba(255, 170, 88, 0.05) 50%, transparent 80%)`
            : `radial-gradient(ellipse 730px 640px at var(--gx) var(--gy), rgba(255, 160, 92, 0.34) 0%, rgba(255, 126, 58, 0.2) 30%, rgba(255, 103, 40, 0.09) 56%, rgba(255, 98, 34, 0.04) 72%, transparent 86%),
               radial-gradient(ellipse 520px 450px at calc(var(--gx) + 5%) calc(var(--gy) - 4%), rgba(255, 136, 62, 0.12) 0%, rgba(255, 124, 58, 0.05) 52%, transparent 82%),
               radial-gradient(ellipse 400px 340px at calc(var(--gx) - 6%) calc(var(--gy) + 5%), rgba(255, 182, 102, 0.08) 0%, rgba(255, 170, 92, 0.04) 50%, transparent 80%)`,
          mixBlendMode: "screen",
        }}
      />

      <section
        ref={heroRef}
        className="font-ppneue relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-6 sm:px-8 md:px-10"
      >
        <Home1Header />

        {/* Hero Title */}
        <div className="flex flex-1 items-center justify-center">
          <h1 className="max-w-[1400px] text-center text-[44px] sm:text-[60px] md:text-[76px] lg:text-[66px] xl:text-[100px] tracking-[-0.03em]">
            {HERO_LINES.map((line, lineIndex) => (
              <span
                key={`line-${lineIndex}`}
                style={{
                  overflow: "hidden",
                  display: "block",
                  lineHeight: 0.95,
                }}
              >
                {line.map((word) => {
                  const currentIndex = wordRefIndex++;
                  return (
                    <span
                      key={`${lineIndex}-${word}`}
                      ref={(el) => (wordRefs.current[currentIndex] = el)}
                      style={{
                        display: "inline-block",
                        transformOrigin: "center bottom",
                        willChange: "transform, opacity, filter",
                        marginRight: "0.28em",
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>
        </div>

        {/* Bottom Meta Row */}
        <div className="mb-5 grid grid-cols-3 items-end text-[14px] font-thin uppercase leading-[1.2] tracking-[0.03em] text-white/75">
          <p
            ref={(el) => (metaRefs.current[0] = el)}
            className="justify-self-start"
            style={{ willChange: "transform, opacity" }}
          >
            ALMATY, KZ
          </p>
          <p
            ref={(el) => (metaRefs.current[1] = el)}
            className="max-w-[480px] justify-self-center text-center"
            style={{ willChange: "transform, opacity" }}
          >
            PERFECT FOR STARTUPS, PRODUCTS, AND
            <br />
            TEAM TESTING IDEAS — WITHOUT LOCKING
            <br />
            THEMSELVES INTO COMPLEX SYSTEMS.
          </p>
          <p
            ref={(el) => (metaRefs.current[2] = el)}
            className="justify-self-end"
            style={{ willChange: "transform, opacity" }}
          >
            SINCE 2023
          </p>
        </div>
      </section>
    </main>
  );
}