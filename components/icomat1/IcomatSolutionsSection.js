"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    id: "production",
    label: "WordPress website design",
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80",
    alt: "Automated composite production machinery",
  },
  {
    id: "design",
    label: "WordPress development",
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80",
    alt: "Engineers reviewing 3D design on screen",
  },
  {
    id: "tailored",
    label: "Hosting, support, and SEO",
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80",
    alt: "Engineer inspecting manufacturing machine",
  },
];

export default function IcomatSolutionSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef    = useRef(null);
  const cardRefs   = useRef([]);
  const labelRefs  = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Heading ──────────────────────────────────────────────
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── Cards stagger ────────────────────────────────────────
      gsap.fromTo(cardRefs.current.filter(Boolean),
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.9, ease: "power3.out", stagger: 0.14,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── Labels stagger ───────────────────────────────────────
      gsap.fromTo(labelRefs.current.filter(Boolean),
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0,
          duration: 0.65, ease: "power3.out", stagger: 0.14,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── Hover zoom on images ─────────────────────────────────
      cardRefs.current.filter(Boolean).forEach((card) => {
        const img = card.querySelector("img");
        if (!img) return;

        const onEnter = () => gsap.to(img, { scale: 1.06, duration: 0.6, ease: "power2.out" });
        const onLeave = () => gsap.to(img, { scale: 1,    duration: 0.7, ease: "power2.inOut" });

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        card._cleanup = () => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
        };
      });

    }, sectionRef);

    return () => {
      cardRefs.current.filter(Boolean).forEach((c) => c._cleanup?.());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#0a0a0a] px-6 sm:px-10 md:px-16 lg:px-20 py-20 md:py-28"
    >

      {/* ── Heading ───────────────────────────────────────────── */}
      <div ref={headingRef} className="mb-10 md:mb-12">
        <h2
          className="text-white font-semibold leading-[1.05] tracking-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
        >
          The Freshy<br />solution
        </h2>
      </div>

      {/* ── 3-col image grid ──────────────────────────────────── */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {CARDS.map((card, i) => (
          <div key={card.id} className="flex flex-col gap-4">

            {/* Image card */}
            <div
              ref={(el) => (cardRefs.current[i] = el)}
              className="relative overflow-hidden"
              style={{
                borderRadius: "16px",
                aspectRatio: "4/3",
                background: "#111",
              }}
            >
              <img
                src={card.src}
                alt={card.alt}
                loading="lazy"
                decoding="async"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transformOrigin: "center center",
                }}
              />

              {/* Bottom vignette */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.32) 100%)",
                }}
              />
            </div>

            {/* Label — increased size */}
            <p
              ref={(el) => (labelRefs.current[i] = el)}
              className="font-medium"
              style={{
                fontSize: "clamp(0.92rem, 1.1vw, 1.05rem)",  /* ← was 0.78rem → 0.88rem */
                color: "rgba(255,255,255,0.6)",
                paddingLeft: "2px",
              }}
            >
              {card.label}
            </p>

          </div>
        ))}
      </div>

    </section>
  );
}