"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function CardVideo({ src, badge, footerContent }) {
  const videoRef = useRef(null);
  const handleMouseEnter = () => videoRef.current?.play();
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className="relative w-full bg-black overflow-hidden cursor-pointer group"
        style={{ aspectRatio: "4/3" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-all duration-500 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-[#2a2a2a]/80 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 group-hover:opacity-60 transition-opacity duration-300">
            <span className="text-white text-[11px] font-semibold tracking-[0.12em] uppercase">{badge}</span>
            <span className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-white text-[10px]">+</span>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="text-white text-[10px] font-medium tracking-wide">Hover to play</span>
          </div>
        </div>
      </div>
      <div className="bg-[#f5f5f5] border border-[#e0e0e0] py-5 px-5">{footerContent}</div>
    </div>
  );
}

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
    <div className="absolute pointer-events-none" style={{ top, left, transform: "translate(-50%,-50%)" }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-px bg-white/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-4 bg-white/20" />
      <div className="w-1 h-1 rounded-full bg-white/30 relative z-10" />
    </div>
  );
}

export default function RTSCombinedSection() {
  const wrapperRef = useRef(null);
  const panelARef = useRef(null);
  const headerRef = useRef(null);
  const midColRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const cardsWrapperRef = useRef(null);
  const panelBRef = useRef(null);
  const badgesRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Panel A: header fade up ────────────────────────────────
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── Panel A: bottom tag fade up ────────────────────────────
      gsap.fromTo(midColRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: midColRef.current,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── Panel A: card slide ────────────────────────────────────
      const setupCards = () => {
        const leftEl = leftCardRef.current;
        const rightEl = rightCardRef.current;
        if (!leftEl || !rightEl) return;

        if (window.innerWidth < 768) {
          gsap.set([leftEl, rightEl], { clearProps: "all" });
          return;
        }

        const leftWidth = leftEl.getBoundingClientRect().width;
        const startX = -(leftWidth * 0.8 + 16);

        gsap.set(leftEl, { opacity: 0.5, scale: 0.97 });
        gsap.set(rightEl, { x: startX });

        ScrollTrigger.create({
          trigger: cardsWrapperRef.current,
          start: "top 75%",
          end: "top 20%",
          scrub: 1.4,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(rightEl, { x: startX * (1 - p) });
            gsap.set(leftEl, { opacity: 0.5 + 0.5 * p, scale: 0.97 + 0.03 * p });
          },
          onLeaveBack: () => {
            gsap.to(rightEl, { x: startX, duration: 0.5, ease: "power2.inOut", overwrite: true });
            gsap.to(leftEl, { opacity: 0.5, scale: 0.97, duration: 0.5, ease: "power2.inOut", overwrite: true });
          },
          onLeave: () => {
            gsap.set(rightEl, { x: 0 });
            gsap.set(leftEl, { opacity: 1, scale: 1 });
          },
        });
      };

      setupCards();

      // ── Master pin + timeline ──────────────────────────────────
      gsap.set(panelBRef.current, { y: "100vh" });
      gsap.set([badgesRef.current, gridRef.current], { opacity: 0, y: 12 });

      /*
        KEY FIX:
        - Remove manual height: "400vh" from wrapper
        - Use pinSpacing: true so GSAP adds EXACTLY the right spacing
          (= pin duration = 200vh for slide + dwell)
        - end: "+=200%" = only 200vh of pin (not 300vh)
          breakdown: 100vh slide-up + 100vh dwell = 200vh total
        - The wrapper's natural height (100vh panel) + 200vh pinSpacing = 300vh total page space
          which is correct — no extra blank space
      */
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1.2,
        },
      });

      /*
        With end: "+=200%" (200vh), timeline units:
        0%–50%  (0–100vh) : Panel B slides up, Panel A scales back
        50%–100% (100–200vh): badges fade in, dwell
      */

      // 0–50%: Panel B slides up, Panel A scales back simultaneously
      masterTl.to(panelBRef.current,
        { y: "0vh", ease: "power2.inOut", duration: 2 },
        0
      );
      masterTl.to(panelARef.current,
        { scale: 0.88, borderRadius: "20px", opacity: 0.8, ease: "power2.inOut", duration: 2 },
        0
      );

      // 50–100%: badges + grid fade in, then dwell
      masterTl.to([badgesRef.current, gridRef.current],
        { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: "power2.out" }
      );
      masterTl.to({}, { duration: 1 }); // dwell

      window.addEventListener("resize", () => { setupCards(); ScrollTrigger.refresh(); });

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    /*
      No fixed height — GSAP pinSpacing handles it automatically.
      Wrapper only needs to be the natural panel height (100vh).
      GSAP adds exactly 200vh of spacing below it for the pin duration.
    */
    <div ref={wrapperRef} className="relative w-full" style={{ minHeight: "100vh" }}>

      {/* ── PANEL A ─────────────────────────────────────────────── */}
      <div
        ref={panelARef}
        className="absolute inset-0 w-full bg-[#f5f5f5] pt-20 pb-0 will-change-transform"
        style={{
          height: "100vh",
          overflow: "clip",
          transformOrigin: "center center",
          zIndex: 1,
        }}
      >
        <div
          ref={headerRef}
          className="px-6 sm:px-10 md:px-16 lg:px-20 mb-14 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20"
        >
          <div className="flex items-start">
            <p className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-[#111] tracking-tight leading-snug">
              Core WordPress Services
            </p>
          </div>
          <div className="max-w-lg">
            <p className="text-[16px] sm:text-[17px] md:text-[18px] font-medium text-[#111] leading-snug mb-4">
              WordPress website design, WordPress development, WordPress managed
              hosting, WordPress maintenance, WordPress support, and search
              engine optimization.
            </p>
            <a href="#" className="text-[15px] sm:text-[16px] font-semibold text-[#111] underline underline-offset-4 hover:opacity-50 transition-opacity duration-200 inline-flex items-center gap-1">
              Meet the WP team →
            </a>
          </div>
        </div>

        <div ref={cardsWrapperRef} className="px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
            <div ref={leftCardRef} className="will-change-transform">
              <CardVideo
                src="https://www.icomat.co.uk/videos/composites/A01.mp4"
                badge="Design + Dev"
                footerContent={
                  <p className="text-[14px] sm:text-[15px] font-semibold text-[#111] leading-snug">
                    WordPress website design<br />
                    <span className="font-normal text-[#666]">Beautiful websites made by top WordPress designers</span>
                  </p>
                }
              />
            </div>
            <div ref={rightCardRef} className="will-change-transform">
              <CardVideo
                src="https://www.icomat.co.uk/videos/composites/A02.mp4"
                badge="Managed Services"
                footerContent={
                  <p className="text-[14px] sm:text-[15px] font-semibold text-[#111] leading-snug">
                    WordPress development<br />
                    Full WordPress development team with deep technical experience
                  </p>
                }
              />
            </div>
          </div>
        </div>

        <div
          ref={midColRef}
          className="mt-5 mx-6 sm:mx-10 md:mx-16 lg:mx-20 border border-[#ddd] rounded-sm py-3 px-5 mb-14"
        >
          <p className="text-[11px] sm:text-[12px] font-medium text-[#aaa] tracking-[0.18em] uppercase">
            Freshy / WordPress Service Platform
          </p>
        </div>
      </div>

      {/* ── PANEL B ─────────────────────────────────────────────── */}
      <div
        ref={panelBRef}
        className="absolute inset-0 w-full bg-[#0a0a0a] overflow-hidden will-change-transform"
        style={{ height: "100vh", zIndex: 2 }}
      >
        <video
          className="absolute inset-0 w-full h-full object-contain"
          src="https://icomat.cdn.prismic.io/icomat/aWZQUwIvOtkhBcXM_ICOMAT-HOMEPAGE_1.mp4"
          autoPlay muted loop playsInline preload="auto"
          style={{ opacity: 0.85 }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)" }}
        />
        <div ref={gridRef} className="absolute inset-0">
          {GRID_DOTS.map((d, i) => <CrosshairDot key={i} top={d.top} left={d.left} />)}
          <div className="absolute inset-0 pointer-events-none">
            {["18%", "57%", "88%"].map((top, i) => (
              <div key={i} className="absolute left-0 right-0 border-t border-white/[0.06]" style={{ top }} />
            ))}
            {["9%", "25%", "50%", "75%", "91%"].map((left, i) => (
              <div key={i} className="absolute top-0 bottom-0 border-l border-white/[0.06]" style={{ left }} />
            ))}
          </div>
        </div>
        <div ref={badgesRef} className="absolute inset-0">
          {BADGES.map((b, i) => (
            <div key={i} className="absolute pointer-events-none" style={{ top: b.top, left: b.left }}>
              <div className="bg-[#1c1c1c]/90 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 whitespace-nowrap">
                <span className="text-white/80 text-[11px] font-semibold tracking-[0.14em] uppercase">{b.label}</span>
                <span className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center text-white/70 text-[10px] flex-shrink-0">+</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}