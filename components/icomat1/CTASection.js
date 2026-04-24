"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection({ onQuoteOpen }) {
  const sectionRef  = useRef(null);
  const gradientRef = useRef(null);
  const textRef     = useRef(null);
  const btnRef      = useRef(null);
  const btnTextRef  = useRef(null);
  const btnCloneRef = useRef(null);
  const btnTlRef    = useRef(null);

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
          start: "top 95%",       // ← fires the moment section barely enters viewport
          end:   "top 10%",       // ← completes while section top is near top of screen
          scrub: 0.4,             // ← tight scrub = very responsive to scroll speed
        },
      });

      tl
        // Phase 1 (0 → 0.4): black → deep green, gradient rises
        .to(section, {
          backgroundColor: "#0d2b1e",
          duration: 0.4,
          ease: "power1.inOut",
        }, 0)
        .to(gradient, {
          opacity: 1,
          scaleY: 1,
          duration: 0.4,
          ease: "power2.out",
        }, 0)

        // Phase 2 (0.4 → 0.75): green → white, gradient fades
        .to(section, {
          backgroundColor: "#ffffff",
          duration: 0.35,
          ease: "power1.inOut",
        }, 0.4)
        .to(gradient, {
          opacity: 0,
          duration: 0.3,
          ease: "power1.in",
        }, 0.42)

        // Phase 3 (0.7 → 0.85): text + button flip to dark
        .to(text, {
          color: "#0a0a09",
          duration: 0.15,
          ease: "none",
        }, 0.7)
        .to(btn, {
          borderColor: "rgba(255,255,255,0)",
          backgroundColor: "#ffffff",
          duration: 0.15,
          ease: "none",
        }, 0.7)
        .to(btnTextRef.current, {
          color: "#0a0a09",
          duration: 0.15,
          ease: "none",
        }, 0.7)
        .to(btnCloneRef.current, {
          color: "#0a0a09",
          duration: 0.15,
          ease: "none",
        }, 0.7);

      // Text + button entrance — immediate on entry
      gsap.fromTo(
        [text, btn],
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 90%",   // ← fires as soon as section enters
            once: true,
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const btn = btnRef.current;
    const text = btnTextRef.current;
    const clone = btnCloneRef.current;
    if (!btn || !text || !clone) return;

    const H = btn.offsetHeight;
    gsap.set(clone, { y: H, opacity: 1 });
    gsap.set(text, { y: 0, opacity: 1 });

    const onEnter = () => {
      btnTlRef.current?.kill();
      gsap.to(btn, {
        backgroundColor: "rgba(255,255,255,0.96)",
        borderColor: "rgba(255,255,255,1)",
        duration: 0.35,
        ease: "power2.out",
      });
      btnTlRef.current = gsap.timeline({ defaults: { duration: 0.52, ease: "power3.inOut" } });
      btnTlRef.current.to(text, { y: -H }, 0).to(clone, { y: 0 }, 0);
    };

    const onLeave = () => {
      btnTlRef.current?.kill();
      gsap.to(btn, {
        backgroundColor: "rgba(255,255,255,0.12)",
        borderColor: "rgba(255,255,255,0.34)",
        duration: 0.35,
        ease: "power2.out",
      });
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

      {/* Radiant green gradient */}
      <div
        ref={gradientRef}
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 110% 80% at 50% 115%,
              #2d7a52 0%,
              #1B4732 25%,
              rgba(27,71,50,0.55) 55%,
              transparent 75%
            )
          `,
          pointerEvents: "none",
          zIndex: 0,
          transformOrigin: "bottom center",
        }}
      />

      {/* Noise texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "160px 160px",
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.5,
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 2,
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
          <span
            ref={btnTextRef}
            style={{
              display: "block",
              color: "#ffffff",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            Get a Quote
          </span>
          <span
            ref={btnCloneRef}
            aria-hidden="true"
            style={{
              display: "block",
              color: "#101010",
              whiteSpace: "nowrap",
              position: "absolute",
              lineHeight: 1,
            }}
          >
            Get a Quote
          </span>
        </button>

      </div>
      <style>{`
        @media (min-width: 1024px) {
          .cta-title {
            white-space: nowrap;
            font-size: clamp(2.1rem, 3.7vw, 4.2rem) !important;
          }
        }
      `}</style>
    </section>
  );
}