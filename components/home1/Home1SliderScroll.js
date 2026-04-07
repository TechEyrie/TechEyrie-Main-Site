"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// â”€â”€ Gallery images â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const IMAGES = [
  { id: 1,  src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80", alt: "Portrait 1" },
  { id: 2,  src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80", alt: "Portrait 2" },
  { id: 3,  src: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&auto=format&fit=crop&q=80", alt: "Portrait 3" },
  { id: 4,  src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80", alt: "Portrait 4" },
  { id: 5,  src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80", alt: "Portrait 5" },
  { id: 6,  src: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&auto=format&fit=crop&q=80", alt: "Portrait 6" },
  { id: 7,  src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80", alt: "Portrait 7" },
  { id: 8,  src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80", alt: "Portrait 8" },
  { id: 9,  src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80", alt: "Portrait 9" },
  { id: 10, src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80", alt: "Portrait 10" },
  { id: 11, src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80", alt: "Portrait 11" },
  { id: 12, src: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80", alt: "Portrait 12" },
  { id: 13, src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&auto=format&fit=crop&q=80", alt: "Portrait 13" },
  { id: 14, src: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&auto=format&fit=crop&q=80", alt: "Portrait 14" },
  { id: 15, src: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&auto=format&fit=crop&q=80", alt: "Portrait 15" },
  { id: 16, src: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=400&auto=format&fit=crop&q=80", alt: "Portrait 16" },
  { id: 17, src: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&auto=format&fit=crop&q=80", alt: "Portrait 17" },
  { id: 18, src: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&auto=format&fit=crop&q=80", alt: "Portrait 18" },
  { id: 19, src: "https://images.unsplash.com/photo-1560250097-0dc05329d0ea?w=400&auto=format&fit=crop&q=80", alt: "Portrait 19" },
  { id: 20, src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80", alt: "Portrait 20" },
  { id: 21, src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80", alt: "Portrait 21" },
  { id: 22, src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80", alt: "Portrait 22" },
  { id: 23, src: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80", alt: "Portrait 23" },
  { id: 24, src: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&auto=format&fit=crop&q=80", alt: "Portrait 24" },
];

const CARD_W = 220;
const CARD_GAP = 12;
const TRAVEL = (CARD_W + CARD_GAP) * IMAGES.length * 0.55;

// â”€â”€ Statement text lines â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const HEADING_LINES = [
  "WE'RE A SMALL TEAM",
  "OF PROFESSIONALS",
  "WORKING DIRECTLY WITH",
  "CLIENTS WORLDWIDE",
];

export default function Home7Gallery() {
  const sectionRef = useRef(null);
  const rowRef = useRef(null);
  const headingRef = useRef(null);
  const headingLineRefs = useRef([]);
  const subtitleRef = useRef(null);

  useGSAP(
    () => {
      // â”€â”€ Scroll-scrub horizontal slide â”€â”€
      gsap.fromTo(
        rowRef.current,
        { x: 0 },
        {
          x: -TRAVEL,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "center top",
            scrub: 1.5,
          },
        }
      );

      // â”€â”€ Heading kinetic mask reveal â”€â”€
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
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // â”€â”€ Subtitle fade up â”€â”€
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { autoAlpha: 0, y: 18 });
        gsap.to(subtitleRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.6,
          scrollTrigger: {
            trigger: headingRef.current,
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
      className="w-full overflow-hidden bg-[#162d24]"
    >
      {/* â”€â”€ Horizontal scroll gallery â”€â”€ */}
      <div className="overflow-hidden pt-16 sm:pt-20">
        <div
          ref={rowRef}
          className="flex will-change-transform"
          style={{ gap: CARD_GAP }}
        >
          {IMAGES.map((img) => (
            <div
              key={img.id}
              className="relative flex-shrink-0 overflow-hidden rounded-[6px]"
              style={{ width: CARD_W, height: 300 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* â”€â”€ Statement text â”€â”€ */}
      <div
        ref={headingRef}
        className="mx-auto max-w-[1200px] px-6 pb-20 pt-20 sm:px-10 sm:pb-24 sm:pt-40 md:px-14 lg:px-16"
      >
        {/* Large heading */}
        <h2 className="font-italiana mb-10 text-[42px] sm:text-[56px] md:text-[68px] lg:text-[78px] xl:text-[88px] font-regular leading-[0.92] tracking-[-0.025em] text-[#f3f3f3] uppercase">
          {HEADING_LINES.map((line, i) => (
            <span
              key={i}
              style={{ display: "block", overflow: "hidden", paddingBottom: "0.08em" }}
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

        {/* Subtitle â€” bottom left, small caps */}
        <p
          ref={subtitleRef}
          className="font-merriweather max-w-[260px] text-[11px] sm:text-[12px] font-light leading-[1.8] tracking-[0.05em] text-[#e0d1b6]/65 uppercase"
        >
          NO UNNECESSARY LAYERS — JUST DIRECT
          <br />
          COLLABORATION AND A CLEAR FOCUS ON
          <br />
          QUALITY AND RESULTS.
        </p>
      </div>
    </section>
  );
}
