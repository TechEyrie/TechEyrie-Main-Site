"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADING_LINES = [
  "CLEAR PRICING MODELS",
  "FOR DIFFERENT TYPES",
  "OF COLLABORATION",
];

const PLANS = [
  {
    name: "LITE",
    price: "$3,000",
    period: "/ PROJECT",
    description:
      "FOR STARTUPS AND TEAMS THAT NEED A FAST, HIGH-IMPACT LAUNCH TO VALIDATE IDEAS AND START CONVERTING USERS.",
    features: [
      "ONE-PAGE WEBSITE DESIGN",
      "RESPONSIVE LAYOUT",
      "BASIC UI ANIMATION",
      "FRONTEND DEVELOPMENT",
      "BASIC SEO SETUP",
      "2 REVISION ROUNDS",
      "DURATION: 2-3 WEEKS",
    ],
    cta: "CHOOSE LITE",
  },
  {
    name: "PRO",
    price: "$4,500",
    period: "/ PROJECT",
    description:
      "FOR GROWING PRODUCTS THAT WANT A SCALABLE FOUNDATION WITHOUT REBUILDING FROM SCRATCH LATER.",
    features: [
      "EVERYTHING IN LITE",
      "MODULAR DESIGN SYSTEM",
      "SCALABLE LAYOUT",
      "ADVANCED UI ANIMATIONS",
      "DOCUMENTED FRONTEND CODE",
      "4 REVISION ROUNDS",
      "DURATION: 4-5 WEEKS",
    ],
    cta: "CHOOSE PRO",
  },
  {
    name: "ADMIN",
    price: "$6,500",
    period: "/ PROJECT",
    description:
      "FOR TEAMS THAT WANT FULL CONTROL OVER CONTENT, VISUALS, AND STRUCTURE WITHOUT TOUCHING CODE.",
    features: [
      "EVERYTHING IN PRO",
      "CUSTOM ADMIN PANEL (CMS)",
      "EDITABLE STYLES & CONTENT",
      "EASY PUBLISHING",
      "SCALABLE STRUCTURE",
      "PRIORITY SUPPORT",
      "DURATION: 6-8 WEEKS",
    ],
    cta: "CHOOSE ADMIN",
  },
];

export default function Home9Pricing() {
  const sectionRef = useRef(null);
  const headingWrapRef = useRef(null);
  const headingLineRefs = useRef([]);
  const subtitleRef = useRef(null);
  const cardsWrapRef = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(
    () => {
      const lines = headingLineRefs.current.filter(Boolean);
      if (lines.length && headingWrapRef.current) {
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
          duration: 1.15,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: headingWrapRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { autoAlpha: 0, y: 16 });
        gsap.to(subtitleRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.45,
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }

      const cards = cardRefs.current.filter(Boolean);
      if (cards.length && cardsWrapRef.current) {
        gsap.set(cards, { autoAlpha: 0, y: 48 });
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: cardsWrapRef.current,
            start: "top 88%",
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
      className="w-full bg-[#162d24] px-6 py-24 sm:px-10 sm:py-28 md:px-14 lg:px-16"
    >
      <div className="mx-auto max-w-[1280px]">

        {/* Heading */}
        <div ref={headingWrapRef}>
          <h2 className="font-italiana mb-6 text-center text-[40px] sm:text-[56px] md:text-[70px] lg:text-[82px] xl:text-[92px] font-semibold leading-[0.92] tracking-[-0.025em] text-[#f3f3f3] uppercase">
            {HEADING_LINES.map((line, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  overflow: "hidden",
                  paddingBottom: "0.08em",
                }}
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
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-merriweather mx-auto mb-20 max-w-[360px] text-center text-[11px] sm:text-[12px] font-light leading-[1.85] tracking-[0.05em] text-[#e0d1b6]/55 uppercase"
        >
          ONE-PAGE FIRST. SCALE WHEN YOU'RE READY.
          <br />
          PICK A PLAN THAT FITS YOUR NEEDS, WITH FAIR
          <br />
          PRICES AND NO HIDDEN SURPRISES.
        </p>

        {/* Cards */}
        <div
          ref={cardsWrapRef}
          className="mx-auto grid w-[90%] grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              ref={(el) => (cardRefs.current[i] = el)}
              className="flex flex-col bg-[#122a21] p-8 sm:p-10"
              style={{
                border: "1px solid rgba(116,245,161,0.22)",
                willChange: "transform, opacity",
              }}
            >
              {/* Plan name â€” increased font size */}
              <p className="font-merriweather mb-16 text-[14px] sm:text-[15px] font-light tracking-[0.1em] text-[#e0d1b6]/50 uppercase">
                {plan.name}
              </p>

              {/* Price */}
              <div className="mb-4">
                <span className="font-merriweather text-[34px] sm:text-[36px] md:text-[40px] font-light leading-none tracking-[-0.02em] text-[#f3f3f3]">
                  {plan.price}
                </span>
                <span className="font-merriweather ml-[6px] text-[18px] sm:text-[20px] font-light tracking-[-0.01em] text-[#e0d1b6]">
                  {plan.period}
                </span>
              </div>

              {/* Description */}
              <p className="font-merriweather mb-8 text-[13px] sm:text-[14px] font-light leading-[1.8] tracking-[0.04em] text-[#e0d1b6] uppercase">
                {plan.description}
              </p>

              {/* Features */}
              <ul className="mb-10 flex flex-1 flex-col">
                {plan.features.map((feat, fi) => (
                  <li key={fi}>
                    <div className="h-[1.5px] w-full bg-[#74F5A1]/25" />
                    <p className="font-merriweather py-[14px] text-[13px] sm:text-[14px] font-light tracking-[0.04em] text-[#e0d1b6] uppercase">
                      {feat}
                    </p>
                  </li>
                ))}
                <div className="h-[1.5px] w-full bg-[#74F5A1]/25" />
              </ul>

              {/* CTA */}
              <a
                href="#"
                className="font-merriweather mt-auto flex w-full items-center justify-center rounded-full border border-[#74F5A1] py-[14px] text-[12px] sm:text-[13px] font-light tracking-[0.1em] text-[#e0d1b6] uppercase transition-all duration-300 hover:bg-[#74F5A1] hover:text-[#162d24]"
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
