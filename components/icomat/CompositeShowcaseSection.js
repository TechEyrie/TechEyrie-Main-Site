"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BADGES = [
  { label: "AT SCALE",     top: "28%", left: "20%" },
  { label: "ZERO DEFECTS", top: "62%", left: "30%" },
  { label: "10x FASTER",   top: "55%", left: "72%" },
];

const GRID_DOTS = [
  { top: "18%", left: "25%" }, { top: "18%", left: "50%" }, { top: "18%", left: "75%" },
  { top: "57%", left: "9%"  }, { top: "57%", left: "25%" }, { top: "57%", left: "50%" },
  { top: "57%", left: "75%" }, { top: "57%", left: "91%" },
  { top: "88%", left: "9%"  }, { top: "88%", left: "25%" }, { top: "88%", left: "50%" },
  { top: "88%", left: "75%" }, { top: "88%", left: "91%" },
];

function CrosshairDot({ top, left }) {
  return (
    <div className="absolute pointer-events-none" style={{ top, left, transform: "translate(-50%, -50%)" }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-px bg-white/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-4 bg-white/20" />
      <div className="w-1 h-1 rounded-full bg-white/30 relative z-10" />
    </div>
  );
}

function Badge({ label, top, left }) {
  return (
    <div className="absolute pointer-events-none" style={{ top, left }}>
      <div className="bg-[#1c1c1c]/90 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 whitespace-nowrap">
        <span className="text-white/80 text-[11px] font-semibold tracking-[0.14em] uppercase">
          {label}
        </span>
        <span className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center text-white/70 text-[10px] flex-shrink-0">
          +
        </span>
      </div>
    </div>
  );
}

export default function CompositeShowcaseSection() {
  const wrapperRef = useRef(null);
  const stickyRef = useRef(null);
  const videoRef = useRef(null);
  const badgesRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Section slides up from bottom — starts below viewport, translates to 0
      gsap.fromTo(
        stickyRef.current,
        { yPercent: 30 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top bottom",   // when top of wrapper enters bottom of viewport
            end: "top top",        // when top of wrapper reaches top of viewport
            scrub: true,
          },
        }
      );

      // Badges + grid fade in once section is fully in view
      gsap.set([badgesRef.current, gridRef.current], { opacity: 0, y: 10 });
      gsap.to([badgesRef.current, gridRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 15%",
          toggleActions: "play none none reverse",
        },
      });

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    /*
      Outer wrapper is 200vh tall:
      - First 100vh: the slide-up travel distance (scrubbed)
      - Second 100vh: section stays sticky while user "reads" it
    */
    <div ref={wrapperRef} className="relative" style={{ height: "200vh" }}>
      <div
        ref={stickyRef}
        className="sticky top-0 w-full bg-[#0a0a0a] overflow-hidden will-change-transform"
        style={{ height: "100vh" }}
      >
        {/* Background video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain"
          src="https://icomat.cdn.prismic.io/icomat/aWZQUwIvOtkhBcXM_ICOMAT-HOMEPAGE_1.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ opacity: 0.85 }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        {/* Grid */}
        <div ref={gridRef} className="absolute inset-0">
          {GRID_DOTS.map((d, i) => (
            <CrosshairDot key={i} top={d.top} left={d.left} />
          ))}
          <div className="absolute inset-0 pointer-events-none">
            {["18%", "57%", "88%"].map((top, i) => (
              <div key={i} className="absolute left-0 right-0 border-t border-white/[0.06]" style={{ top }} />
            ))}
            {["9%", "25%", "50%", "75%", "91%"].map((left, i) => (
              <div key={i} className="absolute top-0 bottom-0 border-l border-white/[0.06]" style={{ left }} />
            ))}
          </div>
        </div>

        {/* Badges */}
        <div ref={badgesRef} className="absolute inset-0">
          {BADGES.map((b, i) => (
            <Badge key={i} label={b.label} top={b.top} left={b.left} />
          ))}
        </div>
      </div>
    </div>
  );
}