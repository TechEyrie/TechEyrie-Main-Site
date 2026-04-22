"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const headingRef = useRef(null);
  const badgeRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Set hard initial states so scroll-out never conflicts ──────
      gsap.set(videoRef.current, { opacity: 0 });
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(badgeRef.current, { opacity: 0, y: 20 });
      gsap.set(scrollIndicatorRef.current, { opacity: 0 });

      // ── Entrance timeline ──────────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(
        videoRef.current,
        { opacity: 1, duration: 1.8, ease: "power2.inOut" },
        0
      );

      tl.to(
        overlayRef.current,
        { opacity: 1, duration: 1.5, ease: "power2.inOut" },
        0.2
      );

      tl.to(
        badgeRef.current,
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        0.6
      );

      if (headingRef.current) {
        const split = new SplitText(headingRef.current, {
          type: "lines,words",
        });
        gsap.set(split.words, { opacity: 0, y: 60, skewY: 4 });
        tl.to(
          split.words,
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.08,
          },
          0.8
        );
      }

      tl.to(
        scrollIndicatorRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        1.8
      );

      // Scroll indicator bounce
      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.6,
      });

      // ── Scroll-out: heading ────────────────────────────────────────
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "50% top",
        end: "bottom top",
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(headingRef.current, {
            y: -100 * p,
            opacity: 1 - p,
          });
        },
        onLeaveBack: () => {
          gsap.to(headingRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true,
          });
        },
      });

      // ── Scroll-out: badge ──────────────────────────────────────────
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "30% top",
        end: "60% top",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(badgeRef.current, {
            y: -50 * p,
            opacity: 1 - p,
          });
        },
        onLeaveBack: () => {
          gsap.to(badgeRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true,
          });
        },
      });

      // ── Video parallax ─────────────────────────────────────────────
      gsap.to(videoRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[600px] bg-black"
      style={{ overflow: "clip" }}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="https://icomat.cdn.prismic.io/icomat/aWZQUwIvOtkhBcXM_ICOMAT-HOMEPAGE_1.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Gradient Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col px-6 sm:px-10 md:px-16 lg:px-10 pt-84 pb-10 md:pb-14">

        {/* Top-right badge */}
        <div className="flex justify-end flex-shrink-0">
          <div
            ref={badgeRef}
            className="max-w-[360px] sm:max-w-xs md:max-w-sm text-left"
          >
            <p className="text-white text-[20px] sm:text-sm lg:text-[17px] font-medium leading-snug tracking-tight">
              The only composite manufacturer in the world delivering steered
              fiber composites at scale.
            </p>
            <p
              className="mt-1 text-[12px] sm:text-[13px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Unlocking design and performance never thought possible.
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom-left heading */}
        <div>
          <h1
            ref={headingRef}
            className="text-white font-extrabold tracking-tight leading-[0.95]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              fontWeight: 600,
            }}
          >
            Engineer
            <br />
            Without Limits
            <sup
              style={{
                fontSize: "0.22em",
                verticalAlign: "super",
                fontWeight: 400,
                letterSpacing: "0.05em",
                marginLeft: "0.3em",
              }}
            >
              ™
            </sup>
          </h1>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 right-6 sm:right-10 md:right-16 lg:right-20 z-20"
      >
        <div className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}