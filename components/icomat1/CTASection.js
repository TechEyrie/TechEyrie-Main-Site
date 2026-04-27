"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection({ onQuoteOpen }) {
  const sectionRef   = useRef(null);
  const gradientRef  = useRef(null);
  const textRef      = useRef(null);
  const btnRef       = useRef(null);
  const btnTextRef   = useRef(null);
  const btnCloneRef  = useRef(null);
  const btnTlRef     = useRef(null);
  const grainRef     = useRef(null);
  const shimmerRef   = useRef(null);
  const grainAnimRef = useRef(null);

  // ── Animate grain during color transition ─────────────────
  const animateGrain = (intensity) => {
    const grain   = grainRef.current;
    const shimmer = shimmerRef.current;
    if (!grain || !shimmer) return;

    gsap.to(grain, {
      opacity: intensity * 0.65,
      duration: 0.3,
      ease: "power1.inOut",
    });
    gsap.to(shimmer, {
      opacity: intensity * 0.4,
      duration: 0.4,
      ease: "power1.inOut",
    });
  };

  // ── Scroll color-transition ───────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const section  = sectionRef.current;
      const gradient = gradientRef.current;
      const text     = textRef.current;
      const btn      = btnRef.current;

      gsap.set(section,  { backgroundColor: "#000000" });
      gsap.set(gradient, { opacity: 0, scaleY: 0, transformOrigin: "bottom center" });
      gsap.set(text,     { color: "#f8f8f4" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 95%",
          end:   "top 10%",
          scrub: 0.4,
          onUpdate: (self) => {
            const p = self.progress;
            // Grain peaks at mid-transition (0.25 → 0.7), fades out after
            let intensity = 0;
            if (p < 0.25) {
              intensity = p / 0.25;
            } else if (p < 0.7) {
              intensity = 1;
            } else {
              intensity = 1 - (p - 0.7) / 0.3;
            }
            animateGrain(Math.max(0, Math.min(1, intensity)));
          },
        },
      });

      tl
        .to(section, { backgroundColor: "#0d2b1e", duration: 0.4, ease: "power1.inOut" }, 0)
        .to(gradient, { opacity: 1, scaleY: 1, duration: 0.4, ease: "power2.out" }, 0)
        .to(section, { backgroundColor: "#ffffff", duration: 0.35, ease: "power1.inOut" }, 0.4)
        .to(gradient, { opacity: 0, duration: 0.3, ease: "power1.in" }, 0.42)
        .to(text,              { color: "#0a0a09", duration: 0.15, ease: "none" }, 0.7)
        .to(btn,               { borderColor: "rgba(255,255,255,0)", backgroundColor: "#ffffff", duration: 0.15, ease: "none" }, 0.7)
        .to(btnTextRef.current,  { color: "#0a0a09", duration: 0.15, ease: "none" }, 0.7)
        .to(btnCloneRef.current, { color: "#0a0a09", duration: 0.15, ease: "none" }, 0.7);

      gsap.fromTo(
        [text, btn],
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: section, start: "top 90%", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Grain animation loop — fast flickering frames ─────────
  useEffect(() => {
    const grain = grainRef.current;
    if (!grain) return;

    let frame;
    let t = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      t++;
      // Shift the SVG noise seed every ~3 frames for film-grain flicker
      if (t % 3 === 0) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        grain.style.backgroundPosition = `${x}% ${y}%`;
      }
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, []);

  // ── Button hover ──────────────────────────────────────────
  useEffect(() => {
    const btn   = btnRef.current;
    const text  = btnTextRef.current;
    const clone = btnCloneRef.current;
    if (!btn || !text || !clone) return;

    const H = btn.offsetHeight;
    gsap.set(clone, { y: H, opacity: 1 });
    gsap.set(text,  { y: 0, opacity: 1 });

    const onEnter = () => {
      btnTlRef.current?.kill();
      gsap.to(btn, { backgroundColor: "rgba(255,255,255,0.96)", borderColor: "rgba(255,255,255,1)", duration: 0.35, ease: "power2.out" });
      btnTlRef.current = gsap.timeline({ defaults: { duration: 0.52, ease: "power3.inOut" } });
      btnTlRef.current.to(text, { y: -H }, 0).to(clone, { y: 0 }, 0);
    };
    const onLeave = () => {
      btnTlRef.current?.kill();
      gsap.to(btn, { backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.34)", duration: 0.35, ease: "power2.out" });
      btnTlRef.current = gsap.timeline({ defaults: { duration: 0.48, ease: "power3.inOut" } });
      btnTlRef.current.to(clone, { y: H }, 0).to(text, { y: 0 }, 0);
    };

    btn.addEventListener("mouseenter", onEnter);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mouseenter", onEnter);
      btn.removeEventListener("mouseleave", onLeave);
      btnTlRef.current?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#000000",
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)",
      }}
    >
      {/* ── Radiant green gradient ── */}
      <div
        ref={gradientRef}
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 110% 80% at 50% 115%,
            #2d7a52 0%, #1B4732 25%, rgba(27,71,50,0.55) 55%, transparent 75%)`,
          pointerEvents: "none",
          zIndex: 0,
          transformOrigin: "bottom center",
        }}
      />

      {/* ── Film grain — flickering background-position ── */}
      <div
        ref={grainRef}
        style={{
          position: "absolute",
          inset: "-50%",          /* oversized so position shifts don't show edges */
          width: "200%",
          height: "200%",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23grain)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize:   "220px 220px",
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0,             /* starts invisible, driven by scroll */
          mixBlendMode: "screen", /* grain LIGHTS the scene — visible on dark AND mid tones */
          willChange: "background-position",
        }}
      />

      {/* ── Sweeping shimmer band ── */}
      <div
        ref={shimmerRef}
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            135deg,
            transparent          0%,
            transparent         30%,
            rgba(255,255,255,0.06) 45%,
            rgba(255,255,255,0.14) 50%,
            rgba(255,255,255,0.06) 55%,
            transparent         70%,
            transparent        100%
          )`,
          pointerEvents: "none",
          zIndex: 2,
          opacity: 0,
          animation: "shimmerSweep 2.8s ease-in-out infinite",
        }}
      />

      {/* ── Content ── */}
      <div style={{
        position: "relative",
        zIndex: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        maxWidth: "880px",
        width: "100%",
        gap: "clamp(36px, 5vw, 56px)",
      }}>
        <h2
          ref={textRef}
          className="cta-title"
          style={{
            fontFamily: "Akkurat, 'Helvetica Neue', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(2.2rem, 4.8vw, 5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            color: "#f8f8f4",
            margin: 0,
          }}
        >
          Ready to start your WordPress project?
        </h2>

        <button
          ref={btnRef}
          type="button"
          onClick={() => onQuoteOpen?.()}
          style={{
            position: "relative",
            overflow: "hidden",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "36px 56px",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.34)",
            borderRadius: "38px",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 24px rgba(0,0,0,0.3)",
            cursor: "pointer",
            fontFamily: "Akkurat, 'Helvetica Neue', sans-serif",
            fontSize: "clamp(14px, 0.95vw, 15px)",
            fontWeight: 600,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          <span ref={btnTextRef} style={{ display: "block", color: "#ffffff", whiteSpace: "nowrap", lineHeight: 1 }}>
            Get a Quote
          </span>
          <span ref={btnCloneRef} aria-hidden="true" style={{ display: "block", color: "#101010", whiteSpace: "nowrap", position: "absolute", lineHeight: 1 }}>
            Get a Quote
          </span>
        </button>
      </div>

      <style>{`
        @keyframes shimmerSweep {
          0%   { transform: translateX(-100%) skewX(-8deg); }
          100% { transform: translateX(200%)  skewX(-8deg); }
        }
        @media (min-width: 1024px) {
          .cta-title {
            white-space: nowrap;
            font-size: clamp(2.1rem, 3.7vw, 4.2rem) !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </section>
  );
}