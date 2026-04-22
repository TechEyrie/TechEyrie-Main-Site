"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const CARDS = [
  {
    num: "01",
    label: "HRchitect",
    sub: "Website migration, infrastructure review, and a comprehensive audit result in strategic planning for phase II redesign project.",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400&q=85&fit=crop",
    color: "#1a1a2e",
  },
  {
    num: "02",
    label: "Tiger",
    sub: null,
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1400&q=85&fit=crop",
    color: "#16213e",
  },
  {
    num: "03",
    label: "Azelis A&ES",
    sub: "Seamless merger of two ecommerce websites into one adds ease and efficiency.",
    img: "https://images.unsplash.com/photo-1581091215367-59ab6dcef2f8?w=1400&q=85&fit=crop",
    color: "#0f3460",
  },
  {
    num: "04",
    label: "Acertus",
    sub: null,
    img: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=1400&q=85&fit=crop",
    color: "#1a1a2e",
  },
  {
    num: "05",
    label: "Seeding Action",
    sub: null,
    img: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1400&q=85&fit=crop",
    color: "#16213e",
  },
  {
    num: "06",
    label: "Grasshopper Gardens",
    sub: null,
    img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1400&q=85&fit=crop",
    color: "#0f3460",
  },
  {
    num: "07",
    label: "Paint Supply",
    sub: null,
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&q=85&fit=crop",
    color: "#1a1a2e",
  },
];

const CARD_W = 620;
const CARD_GAP = 24;

export default function EndToEndSection() {
  const wrapperRef = useRef(null);
  const headingRef = useRef(null);
  const trackRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Heading: char-by-char color reveal on scroll ───────────────
      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: "chars,words" });

        gsap.set(split.chars, { color: "#333333" });

        gsap.to(split.chars, {
          color: "#ffffff",
          ease: "none",
          stagger: {
            each: 0.03,
            from: "start",
          },
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        });
      }

      // ── Horizontal scroll ──────────────────────────────────────────
      const trackWidth   = CARDS.length * (CARD_W + CARD_GAP) - CARD_GAP;
      const viewportW    = window.innerWidth;
      const paddingX     = 80;
      const maxTranslate = -(trackWidth - viewportW + paddingX * 2);

      gsap.set(trackRef.current, { x: 0 });

      gsap.to(trackRef.current, {
        x: maxTranslate,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: () => `+=${Math.abs(maxTranslate)}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="w-full bg-[#0a0a0a] overflow-hidden pb-24"
      style={{ minHeight: "100vh" }}
    >
      {/* ── Heading ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-center pt-28 pb-14 px-6">
        <h2
          ref={headingRef}
          className="font-semibold text-center leading-tight tracking-tight"
          style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
        >
          Featured projects
        </h2>
      </div>

      {/* ── Track ─────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-visible px-20">
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ gap: `${CARD_GAP}px` }}
        >
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col"
              style={{ width: `${CARD_W}px` }}
            >
              {/* Number + dotted rule */}
              <div className="flex items-center gap-4 mb-5">
                <span
                  className="font-mono font-bold tracking-[0.18em] flex-shrink-0"
                  style={{
                    fontSize: "clamp(1rem, 1.4vw, 1.4rem)",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  {card.num}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to right, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 4px, transparent 4px, transparent 10px)",
                  }}
                />
              </div>

              {/* Image */}
              <div
                className="relative w-full overflow-hidden rounded-xl bg-[#1a1a1a]"
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src={card.img}
                  alt={card.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>

              {/* Label */}
              <div className="mt-4 flex flex-col gap-1">
                <p
                  className="text-[12px] tracking-[0.14em] uppercase leading-snug"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {card.sub ? card.sub : card.label}
                </p>
                {card.sub && (
                  <p
                    className="text-[11px] tracking-[0.1em] uppercase"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    {card.label}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}