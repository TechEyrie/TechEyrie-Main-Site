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
            <span className="text-white text-[11px] font-semibold tracking-[0.12em] uppercase">
              {badge}
            </span>
            <span className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-white text-[10px]">
              +
            </span>
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
      <div className="bg-[#f5f5f5] border border-[#e0e0e0] py-5 px-5">
        {footerContent}
      </div>
    </div>
  );
}

export default function RTSRevolutionSection() {
  const wrapperRef = useRef(null);   // outer tall div — provides scroll runway
  const sectionRef = useRef(null);   // sticky inner panel
  const headerRef = useRef(null);
  const midColRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const cardsWrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Header fade up ─────────────────────────────────────────────
      gsap.fromTo(
        headerRef.current,
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

      // ── Bottom tag fade up ─────────────────────────────────────────
      gsap.fromTo(
        midColRef.current,
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

      // ── Card slide animation ───────────────────────────────────────
      const setupCardAnimation = () => {
        const leftEl = leftCardRef.current;
        const rightEl = rightCardRef.current;
        if (!leftEl || !rightEl) return;

        if (window.innerWidth < 768) {
          gsap.set([leftEl, rightEl], { clearProps: "all" });
          return;
        }

        const leftWidth = leftEl.getBoundingClientRect().width;
        const gap = 16;
        const startX = -(leftWidth * 0.8 + gap);

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

      setupCardAnimation();

      // ── Scale-back + pin effect when next section overlaps ────────
      // The section scales down and pushes back as CompositeShowcase rises over it
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "bottom bottom",   // when bottom of this wrapper hits bottom of viewport
        end: "bottom top",        // until it fully leaves viewport
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          // Scale from 1 → 0.88, fade slightly, add border-radius
          gsap.set(sectionRef.current, {
            scale: 1 - 0.12 * p,
            borderRadius: `${16 * p}px`,
            opacity: 1 - 0.15 * p,
            transformOrigin: "center center",
          });
        },
        onLeaveBack: () => {
          gsap.to(sectionRef.current, {
            scale: 1, borderRadius: "0px", opacity: 1,
            duration: 0.4, ease: "power2.out", overwrite: true,
          });
        },
      });

      const handleResize = () => { setupCardAnimation(); ScrollTrigger.refresh(); };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    // Outer wrapper — normal flow, provides the scroll distance
    <div ref={wrapperRef} className="relative will-change-transform">
      {/*
        Inner section — this is what scales back.
        position: sticky + top: 0 makes it stay in view
        while CompositeShowcaseSection rises over it
      */}
      <section
        ref={sectionRef}
        className="sticky top-0 w-full bg-[#f5f5f5] pt-20 pb-0 will-change-transform"
        style={{ overflow: "clip", minHeight: "100vh" }}
      >
        {/* ── Header Row ─────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="px-6 sm:px-10 md:px-16 lg:px-20 mb-14 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20"
        >
          <div className="flex items-start">
            <p className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-[#111] tracking-tight leading-snug">
              The RTS Revolution
            </p>
          </div>
          <div className="max-w-lg">
            <p className="text-[16px] sm:text-[17px] md:text-[18px] font-medium text-[#111] leading-snug mb-4">
              For 50 years, composites were limited to straight lines. Our
              patented RTS process removes that constraint. Fibers can now flow
              along curves to build lighter, stronger, more efficient parts.
            </p>
            <a
              href="#"
              className="text-[15px] sm:text-[16px] font-semibold text-[#111] underline underline-offset-4 hover:opacity-50 transition-opacity duration-200 inline-flex items-center gap-1"
            >
              Explore our technology →
            </a>
          </div>
        </div>

        {/* ── Cards Row ──────────────────────────────────────────────── */}
        <div ref={cardsWrapperRef} className="px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
            <div ref={leftCardRef} className="will-change-transform">
              <CardVideo
                src="https://www.icomat.co.uk/videos/composites/A01.mp4"
                badge="Before RTS"
                footerContent={
                  <p className="text-[14px] sm:text-[15px] font-semibold text-[#111] leading-snug">
                    Traditional fiber placement<br />
                    <span className="font-normal text-[#666]">straight-line constraint</span>
                  </p>
                }
              />
            </div>
            <div ref={rightCardRef} className="will-change-transform">
              <CardVideo
                src="https://www.icomat.co.uk/videos/composites/A02.mp4"
                badge="RTS Design"
                footerContent={
                  <p className="text-[14px] sm:text-[15px] font-semibold text-[#111] leading-snug">
                    Up to 65% lighter,<br />
                    10x faster production
                  </p>
                }
              />
            </div>
          </div>
        </div>

        {/* ── Bottom tag strip ───────────────────────────────────────── */}
        <div
          ref={midColRef}
          className="mt-5 mx-6 sm:mx-10 md:mx-16 lg:mx-20 border border-[#ddd] rounded-sm py-3 px-5 mb-14"
        >
          <p className="text-[11px] sm:text-[12px] font-medium text-[#aaa] tracking-[0.18em] uppercase">
            RTS / Steered Fiber Composites
          </p>
        </div>
      </section>
    </div>
  );
}