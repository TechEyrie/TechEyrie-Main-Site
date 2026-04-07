"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  {
    id: "01",
    title: "DISCOVERY CALL",
    description:
      "WE DISCUSS YOUR GOALS, AUDIENCE, AND VISION. THIS HELPS US UNDERSTAND WHAT YOU NEED AND HOW TO DELIVER IT.",
    emoji: "📞",
    bg: "#f0ede6",
  },
  {
    id: "02",
    title: "BRIEF & PROPOSAL",
    description:
      "WE SEND A CLEAR PROJECT BRIEF AND PROPOSAL WITH TIMELINE, SCOPE, AND PRICING. NO SURPRISES.",
    emoji: "📋",
    bg: "#e8e4f0",
  },
  {
    id: "03",
    title: "DESIGN PHASE",
    description:
      "WE CREATE THE FULL VISUAL DESIGN OF YOUR ONE-PAGE WEBSITE. YOU REVIEW AND APPROVE BEFORE WE BUILD.",
    emoji: "🎨",
    bg: "#e4ede8",
  },
  {
    id: "04",
    title: "DEVELOPMENT",
    description:
      "WE BUILD THE SITE WITH CLEAN, PERFORMANT CODE. FULLY RESPONSIVE AND OPTIMISED FOR SPEED.",
    emoji: "💻",
    bg: "#e4ecf0",
  },
  {
    id: "05",
    title: "REVIEW & REVISIONS",
    description:
      "YOU TEST THE LIVE PREVIEW AND WE REFINE UNTIL EVERYTHING FEELS RIGHT. YOUR FEEDBACK DRIVES THIS STAGE.",
    emoji: "🔍",
    bg: "#f0ece4",
  },
  {
    id: "06",
    title: "HANDOVER & LAUNCH",
    description:
      "WE TRANSFER THE WEBSITE, PROVIDE ACCESS, AND ASSIST WITH LAUNCH. THE PROJECT IS READY TO GO LIVE.",
    emoji: "🚀",
    bg: "#ebe4f0",
  },
];

const BG_LINES = [
  "A SIMPLE, FOCUSED",
  "PROCESS DESIGNED",
  "TO MOVE FAST AND",
  "BUILD RIGHT",
];

function SplitChars({ text, charRefs, startIndex = 0 }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => { if (charRefs) charRefs.current[startIndex + i] = el; }}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </span>
      ))}
    </>
  );
}

export default function Home6HowWeWork() {
  const sectionRef = useRef(null);
  const charRefs = useRef([]);
  const cardWrapRef = useRef(null);
  const cardInnerRef = useRef(null);
  const labelRef = useRef(null);
  const paginationRef = useRef(null);

  const [activeStep, setActiveStep] = useState(0);
  const [cardVisible, setCardVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  const charOffsets = useRef([]);
  {
    let n = 0;
    charOffsets.current = BG_LINES.map((line) => {
      const s = n; n += line.length; return s;
    });
  }

  // ── Char reveal ──
  useGSAP(
    () => {
      const chars = charRefs.current.filter(Boolean);
      if (!chars.length) return;

      gsap.set(chars, { color: "rgba(0,0,0,0.10)" });

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 55%",
          toggleActions: "play none none none",
          once: true,
        },
        onComplete: () => setCardVisible(true),
      }).to(chars, {
        color: "rgba(0,0,0,1)",
        duration: 0.03,
        stagger: { each: 0.018, from: "start" },
        ease: "none",
      });
    },
    { scope: sectionRef }
  );

  // ── Card entrance ──
  useEffect(() => {
    if (!cardVisible) return;

    gsap.fromTo(
      cardWrapRef.current,
      { autoAlpha: 0, y: 36, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.85, ease: "power3.out" }
    );
    gsap.fromTo(
      labelRef.current,
      { autoAlpha: 0, y: -8 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.1 }
    );
    gsap.fromTo(
      paginationRef.current,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.2 }
    );
  }, [cardVisible]);

  // ── Slide transition ──
  const goToStep = useCallback(
    (nextIndex) => {
      if (animating || nextIndex === activeStep) return;
      if (nextIndex < 0 || nextIndex >= STEPS.length) return;

      const dir = nextIndex > activeStep ? 1 : -1;
      setAnimating(true);
      const vw = window.innerWidth;
      const inner = cardInnerRef.current;
      const wrap = cardWrapRef.current;

      gsap.to(inner, {
        x: dir * -vw * 1.2,
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setActiveStep(nextIndex);
          if (wrap) wrap.style.backgroundColor = STEPS[nextIndex].bg;
          gsap.set(inner, { x: dir * vw * 1.2, autoAlpha: 0 });
          gsap.to(inner, {
            x: 0,
            autoAlpha: 1,
            duration: 0.48,
            ease: "power3.out",
            onComplete: () => setAnimating(false),
          });
        },
      });
    },
    [activeStep, animating]
  );

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goToStep(activeStep + 1);
      if (e.key === "ArrowLeft") goToStep(activeStep - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeStep, goToStep]);

  const step = STEPS[activeStep];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#f0ede6]"
      style={{ minHeight: "100vh" }}
    >
      {/* HOW WE WORK label */}
      <div
        ref={labelRef}
        className="absolute left-0 right-0 top-5 z-20 text-center"
        style={{ opacity: 0 }}
      >
        <span className="font-ppneue text-[11px] font-light tracking-[0.22em] text-[#1a1a1a]/45 uppercase">
          HOW WE WORK
        </span>
      </div>

      {/* Background title */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <h2
          className="font-ppneue w-full text-center font-semibold uppercase leading-[0.92] tracking-[-0.02em] select-none"
          style={{ fontSize: "clamp(48px, 11.5vw, 100px)" }}
        >
          {BG_LINES.map((line, li) => (
            <span key={li} style={{ display: "block" }}>
              <SplitChars
                text={line}
                charRefs={charRefs}
                startIndex={charOffsets.current[li]}
              />
            </span>
          ))}
        </h2>
      </div>

      {/* Foreground: card + pagination */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">

        {/* Card wrap */}
        <div
          ref={cardWrapRef}
          className="overflow-hidden rounded-[6px]"
          style={{
            opacity: 0,
            width: "clamp(280px, 24vw, 360px)",
            backgroundColor: step.bg,
            transition: "background-color 0.4s ease",
          }}
        >
          {/* Inner — flex-col + items-center = everything centered */}
          <div
            ref={cardInnerRef}
            className="flex flex-col items-center px-8 pt-8 pb-10"
            style={{ minHeight: "520px" }}
          >

            {/* TOP: Step number — centered */}
            <p className="font-ppneue w-full text-center text-[13px] font-light tracking-[0.06em] text-[#1a1a1a]/35">
              {step.id}
            </p>

            {/* MIDDLE: Emoji — flex-1 centers it vertically */}
            <div className="flex flex-1 items-center justify-center">
              <span className="text-[104px] leading-none select-none">
                {step.emoji}
              </span>
            </div>

            {/* BOTTOM: Title + description — centered */}
            <div className="w-full text-center">
              <h3 className="font-ppneue mb-3 text-[16px] sm:text-[27px] font-regular leading-tight tracking-[0.01em] text-[#1a1a1a]">
                {step.title}
              </h3>
              <p className="font-ppneue text-[10px] sm:text-[13px] font-light leading-[1.2] tracking-[0.04em] text-[#1a1a1a]/55 uppercase">
                {step.description}
              </p>
            </div>

          </div>
        </div>

        {/* Pagination */}
        <div
          ref={paginationRef}
          className="mt-6 flex items-center gap-[4px]"
          style={{ opacity: 0 }}
        >
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goToStep(i)}
              disabled={animating}
              aria-label={`Step ${s.id}`}
              className="font-ppneue flex items-center justify-center rounded-full text-[10px] font-medium tracking-[0.03em] transition-all duration-300"
              style={{
                width: 34,
                height: 34,
                background: i === activeStep ? "#1a1a1a" : "transparent",
                color: i === activeStep ? "#fff" : "#1a1a1a",
                border: "1.5px solid #1a1a1a",
                opacity: animating ? 0.6 : 1,
              }}
            >
              {s.id}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}