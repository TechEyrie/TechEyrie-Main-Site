"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LEFT_LINES = [
  "WE'RE NOT FOCUSED ON SAAS",
  "DASHBOARDS OR TEMPLATE",
  "PRODUCTS. WE DESIGN",
  "ONE-PAGE WEBSITES BUILT TO",
  "LAUNCH, TEST, AND CONVERT",
];

const RIGHT_LINES = [
  "WHERE DESIGN, MOTION, AND",
  "STRUCTURE WORK AS A SINGLE",
  "SYSTEM. ONE PAGE HELPS",
  "BRANDS MOVE FASTER, VALIDATE",
  "IDEAS, AND SCALE WHEN READY",
];

function AnimatedTextBlock({ lines, delay = 0 }) {
  const lineRefs = useRef([]);
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const lineEls = lineRefs.current.filter(Boolean);
      if (!lineEls.length) return;

      gsap.set(lineEls, {
        yPercent: 110,
        scaleY: 0.62,
        autoAlpha: 0,
        filter: "blur(6px)",
        transformOrigin: "center bottom",
      });

      gsap.to(lineEls, {
        yPercent: 0,
        scaleY: 1,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.18,
        delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      {lines.map((line, i) => (
        <span
          key={i}
          style={{
            display: "block",
            overflow: "hidden",
            lineHeight: 1.15,
            paddingBottom: "0.06em",
          }}
        >
          <span
            ref={(el) => (lineRefs.current[i] = el)}
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
    </div>
  );
}

export default function Home2About() {
  // Left block: 5 lines Ã— 0.18s stagger + 1.1s duration for last line
  // Last line starts at: 4 * 0.18 = 0.72s, finishes at 0.72 + 1.1 = 1.82s
  // Right block delay = 1.82s + 0.2s breath = ~2.0s
  const LEFT_TOTAL = (LEFT_LINES.length - 1) * 0.18 + 0.3;

  return (
    <section
      className="relative w-full bg-[#162d24] py-28"
      style={{ minHeight: "100vh" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">

        {/* Top-left text block â€” animates first */}
        <div className="max-w-[600px]">
          <div className="font-merriweather font-thin text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] xl:text-[37px] tracking-[-0.01em] text-[#e0d1b6]">
            <AnimatedTextBlock lines={LEFT_LINES} delay={0} />
          </div>
        </div>

        {/* Bottom-right text block â€” animates after left finishes */}
        <div className="mt-[16vh] flex justify-end">
          <div className="max-w-[600px]">
            <div className="font-merriweather font-thin text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] xl:text-[37px] tracking-[-0.01em] text-[#e0d1b6]">
              <AnimatedTextBlock lines={RIGHT_LINES} delay={LEFT_TOTAL} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
