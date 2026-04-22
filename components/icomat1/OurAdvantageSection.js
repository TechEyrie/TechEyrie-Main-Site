"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const FEATURES = [
  {
    title: "370+ 5-star Google reviews",
    desc: "5-star Google reviews",
  },
  {
    title: "2400+ Happy clients",
    desc: "Happy clients",
  },
  {
    title: "50+ In-house WordPress experts",
    desc: "In-house WordPress experts",
  },
];

export default function OurAdvantageSection() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const rightColRef = useRef(null);
  const featuresRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo(labelRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: "lines,words" });
        gsap.set(split.words, { opacity: 0, y: 40 });
        gsap.to(split.words, {
          opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      gsap.fromTo(rightColRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: rightColRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const featureEls = featuresRef.current.filter(Boolean);
      gsap.fromTo(featureEls,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15,
          scrollTrigger: {
            trigger: featureEls[0],
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
      className="w-full bg-[#0d0d0d] py-24 md:py-32 px-6 sm:px-10 md:px-16 lg:px-20"
    >
      {/*
        Three-column grid:
        Left  45% — label + big heading
        Gap   10% — empty breathing room
        Right 45% — right content pushed to far right with inner max-width
      */}
      <div className="grid grid-cols-1 md:grid-cols-[45%_10%_45%] items-start">

        {/* ── LEFT ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 md:gap-6">
          <p
            ref={labelRef}
            className="text-[13px] sm:text-[14px] font-medium tracking-wide"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Why Freshy as your expert WordPress agency?
          </p>

          <h2
            ref={headingRef}
            className="text-white font-bold leading-[1.0] tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 4vw, 4rem)" }}
          >
            Say hello to
            <br />
            best-in-industry
            <br />
            expertise and reliability.
          </h2>
        </div>

        {/* ── GAP ──────────────────────────────────────────────────── */}
        <div className="hidden md:block" />

        {/* ── RIGHT ────────────────────────────────────────────────── */}
        {/*
          The right column is 45% of the grid.
          We constrain the actual text to max-w-[300px] and push it
          to the far right with ml-auto — matching the reference where
          the right text block is narrow and hugs the right edge.
        */}
        <div className="mt-14 md:mt-0 flex justify-end">
          <div className="w-full max-w-[500px] flex flex-col gap-10">

            {/* Body copy */}
            <div ref={rightColRef} className="flex flex-col gap-5">
              <p
                className="text-[13px] sm:text-[18px] font-semibold leading-relaxed"
                style={{ color: "rgba(255,255,255,0.92)" }}
              >
                Freshy is a WP specialist firm and the world's leading agency
                for WordPress web design, development, hosting, maintenance,
                support, and comprehensive services -- managing every aspect of
                WordPress to deliver unmatched expertise.
              </p>
              <p
                className="text-[13px] sm:text-[18px] font-semibold leading-relaxed"
                style={{ color: "rgba(255,255,255,0.92)" }}
              >
                We promise the best WordPress web design and development services.
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10" />

            {/* Feature list */}
            <div className="flex flex-col gap-8">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  ref={(el) => (featuresRef.current[i] = el)}
                  className="flex flex-col gap-1.5"
                >
                  <p
                    className="text-[13px] sm:text-[18px] font-semibold"
                    style={{ color: "rgba(255,255,255,0.92)" }}
                  >
                    {f.title}
                  </p>
                  <p
                    className="text-[12px] sm:text-[18px] font-normal leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.38)" }}
                  >
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}