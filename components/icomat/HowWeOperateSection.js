"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function HowWeOperateSection() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Character-by-character color reveal on scroll ──────────────
      if (textRef.current) {
        const split = new SplitText(textRef.current, { type: "chars,words" });
        const chars = split.chars;

        // All chars start muted gray
        gsap.set(chars, { color: "#555555" });

        // Scrub each char from gray → white as section scrolls through viewport
        gsap.to(chars, {
          color: "#ffffff",
          ease: "none",
          stagger: {
            each: 0.015,
            from: "start",
          },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 10%",
            scrub: 1,
          },
        });
      }

      // ── Images slide up + fade in ──────────────────────────────────
      gsap.fromTo(
        [img1Ref.current, img2Ref.current],
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: img1Ref.current,
            start: "top 88%",
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
      className="w-full bg-[#0a0a0a] pt-20 pb-24 px-6 sm:px-10 md:px-16 lg:px-20"
    >
      {/* ── Large text block ─────────────────────────────────────────── */}
      <div className="mb-10 md:mb-14 max-w-[95%]">
        <p
          ref={textRef}
          className="font-medium leading-[1.12] tracking-tight"
          style={{ fontSize: "clamp(1.2rem, 3.2vw, 3.2rem)" }}
        >
          {/*
            "How we operate." renders as its own span so it can start
            visually distinct — GSAP will still split all chars uniformly,
            but the label phrase sits inline before the main copy.
          */}
          How we operate.{" "}
          We build fully integrated factories for composite parts. Using
          proprietary hardware and software, we automate and control the
          entire process. From a roll of carbon fiber through a finished,
          painted, and inspected product, including design and analysis.
        </p>
      </div>

      {/* ── Two images ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

        {/* Left image — robot arm */}
        <div
          ref={img1Ref}
          className="relative w-full overflow-hidden rounded-sm bg-[#1a1a1a]"
          style={{ aspectRatio: "16/10" }}
        >
          <img
            src="https://images.prismic.io/icomat/aWZQUwIvOtkhBcXM_robot.jpg"
            alt="ICOMAT robot arm"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              // Fallback gradient if image 404s
              e.currentTarget.style.display = "none";
            }}
          />
          {/* Fallback visual if image fails */}
          <div
            className="absolute inset-0 flex items-end p-5"
            style={{
              background:
                "linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 40%, #1a1a1a 100%)",
            }}
          >
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50">
              ICOMAT Robot Arm
            </span>
          </div>
        </div>

        {/* Right image — studio / inspection */}
        <div
          ref={img2Ref}
          className="relative w-full overflow-hidden rounded-sm bg-[#111]"
          style={{ aspectRatio: "16/10" }}
        >
          <img
            src="https://images.prismic.io/icomat/aWZQUwIvOtkhBcXM_inspect.jpg"
            alt="ICOMAT composite inspection"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {/* Fallback visual */}
          <div
            className="absolute inset-0 flex items-end p-5"
            style={{
              background:
                "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)",
            }}
          >
            {/* Abstract shape mimicking the reference right image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="bg-white/90 rounded-[40%]"
                style={{ width: "38%", height: "55%", transform: "rotate(-15deg) translateX(30%)" }}
              />
              <div
                className="absolute bg-white/90 rounded-full"
                style={{ width: "18%", height: "28%", transform: "translateX(80%) translateY(20%)" }}
              />
            </div>
            <span className="relative z-10 text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50">
              Composite Inspection
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}