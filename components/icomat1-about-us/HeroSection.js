"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

function HeroQuoteButton({ onClick }) {
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const cloneRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const text = textRef.current;
    const clone = cloneRef.current;
    if (!wrap || !text || !clone) return;

    const H = wrap.offsetHeight;
    gsap.set(clone, { y: H, opacity: 1 });
    gsap.set(text, { y: 0, opacity: 1 });

    const onEnter = () => {
      tlRef.current?.kill();
      gsap.to(wrap, {
        backgroundColor: "rgba(255,255,255,0.96)",
        borderColor: "rgba(255,255,255,1)",
        duration: 0.35,
        ease: "power2.out",
      });
      tlRef.current = gsap.timeline({
        defaults: { duration: 0.52, ease: "power3.inOut" },
      });
      tlRef.current.to(text, { y: -H }, 0).to(clone, { y: 0 }, 0);
    };

    const onLeave = () => {
      tlRef.current?.kill();
      gsap.to(wrap, {
        backgroundColor: "rgba(255,255,255,0.12)",
        borderColor: "rgba(255,255,255,0.34)",
        duration: 0.35,
        ease: "power2.out",
      });
      tlRef.current = gsap.timeline({
        defaults: { duration: 0.48, ease: "power3.inOut" },
      });
      tlRef.current.to(clone, { y: H }, 0).to(text, { y: 0 }, 0);
    };

    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      tlRef.current?.kill();
    };
  }, []);

  return (
    <button
      ref={wrapRef}
      type="button"
      onClick={onClick}
      className="mt-6 inline-flex items-center justify-center rounded-[38px] px-14 py-9 text-[14px] sm:text-[15px] tracking-[0.09em] font-semibold uppercase"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.34)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 24px rgba(0,0,0,0.3)",
        cursor: "pointer",
      }}
    >
      <span
        ref={textRef}
        style={{
          display: "block",
          lineHeight: 1,
          color: "#ffffff",
          whiteSpace: "nowrap",
        }}
      >
        Get a Quote
      </span>
      <span
        ref={cloneRef}
        aria-hidden="true"
        style={{
          display: "block",
          lineHeight: 1,
          color: "#101010",
          whiteSpace: "nowrap",
          position: "absolute",
        }}
      >
        Get a Quote
      </span>
    </button>
  );
}

export default function HeroSection({ onQuoteClick }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const headingRef = useRef(null);
  const badgeRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, { opacity: 0 });
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(badgeRef.current, { opacity: 0, y: 20 });
      gsap.set(scrollIndicatorRef.current, { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(
        imageRef.current,
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

      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.6,
      });

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
      });

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
      });

      gsap.to(imageRef.current, {
        yPercent: -8,
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
      className="relative w-full h-screen min-h-[600px] bg-[#162D24]"
      style={{ overflow: "clip" }}
    >
      <img
        ref={imageRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/pics/solutions-main-pic.avif"
        alt="About us hero"
      />

      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))",
        }}
      />

      <div className="relative z-10 h-full flex flex-col px-6 sm:px-10 md:px-16 lg:px-10 pt-84 pb-16 md:pb-20">
        <div className="flex-1" />

        <div>
          <h1
            ref={headingRef}
            className="text-white font-extrabold tracking-tight leading-[0.95]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              fontWeight: 600,
            }}
          >
            Why Freshy
          </h1>

          <div ref={badgeRef} className="mt-4 max-w-[760px]">
            <p
              className="text-[14px] sm:text-[15px] lg:text-[17px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              We&apos;ve spent the last 15 years perfecting our website design and
              development process so that each project exceeds client
              expectations.
            </p>

            <HeroQuoteButton onClick={onQuoteClick} />
          </div>
        </div>
      </div>

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

