"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CONTACT_ROWS = [
  {
    label: "EMAIL ADDRESS",
    value: "INFO@TECHEYRIE.STUDIO",
    href: "mailto:info@techeyrie.studio",
  },
  {
    label: "PHONE NUMBER",
    value: "+92 300 000 0000",
    href: "tel:+923000000000",
  },
  {
    label: "LOCATION",
    value: "PAKISTAN, RAWALPINDI (GMT+5)",
    href: null,
  },
];

const SOCIAL_LINKS = [
  { label: "AWWWARDS",  href: "#" },
  { label: "INSTAGRAM", href: "#" },
  { label: "LINKEDIN",  href: "#" },
];

export default function HomeFooter() {
  const footerRef    = useRef(null);
  const topRef       = useRef(null);
  const bottomRef    = useRef(null);
  const watermarkRef = useRef(null);

  useGSAP(
    () => {
      if (topRef.current) {
        gsap.set(topRef.current, { autoAlpha: 0, y: 16 });
        gsap.to(topRef.current, {
          autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: {
            trigger: topRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }

      if (bottomRef.current) {
        gsap.set(bottomRef.current, { autoAlpha: 0, y: 12 });
        gsap.to(bottomRef.current, {
          autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.15,
          scrollTrigger: {
            trigger: bottomRef.current,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        });
      }

      if (watermarkRef.current) {
        gsap.set(watermarkRef.current, { autoAlpha: 0, y: 40 });
        gsap.to(watermarkRef.current, {
          autoAlpha: 1, y: 0, duration: 1.4, ease: "power3.out", delay: 0.1,
          scrollTrigger: {
            trigger: watermarkRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: footerRef }
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    // ✅ min-h-screen — fills full viewport height
    <footer
      ref={footerRef}
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#f0ede6]"
    >

      {/* ── Top section ── */}
      <div
        ref={topRef}
        className="w-full px-6 pt-14 sm:px-10 sm:pt-16 md:px-14 lg:px-16"
      >
        <div className="h-px w-full bg-[#1a1a1a]/12" />

        <div className="flex flex-col gap-10 pt-10 sm:flex-row sm:gap-0">

          {/* Left — tagline */}
          <div className="w-full sm:w-1/2 lg:w-[45%]">
            <p className="font-ppneue text-[14px] sm:text-[16px] md:text-[17px] font-light leading-[1.9] tracking-[0.05em] text-[#1a1a1a] uppercase">
              WE BUILD HIGH-IMPACT ONE-PAGE
              <br />
              WEBSITES MADE TO LAUNCH FAST
              <br />
              AND SCALE LATER
            </p>
          </div>

          {/* Right — contact rows */}
          <div className="w-full sm:w-1/2 lg:w-[55%]">
            {CONTACT_ROWS.map((row) => (
              <div key={row.label}>
                <div className="h-px w-full bg-[#1a1a1a]/12" />
                <div className="flex flex-col gap-[6px] py-5">
                  <span className="font-ppneue text-[13px] sm:text-[14px] md:text-[15px] font-medium tracking-[0.08em] text-[#1a1a1a] uppercase">
                    {row.label}
                  </span>
                  {row.href ? (
                    <a
                      href={row.href}
                      className="font-ppneue text-[13px] sm:text-[14px] md:text-[15px] font-light tracking-[0.05em] text-[#1a1a1a]/45 uppercase transition-colors duration-200 hover:text-[#1a1a1a]"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <span className="font-ppneue text-[13px] sm:text-[14px] md:text-[15px] font-light tracking-[0.05em] text-[#1a1a1a]/45 uppercase">
                      {row.value}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div className="h-px w-full bg-[#1a1a1a]/12" />
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        ref={bottomRef}
        className="w-full px-6 pb-6 pt-10 sm:px-10 sm:pb-8 sm:pt-12 md:px-14 lg:px-16"
      >
        <div className="mb-5 h-px w-full bg-[#1a1a1a]/12" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Left — back to top + copyright */}
          <div className="flex flex-col gap-[8px]">
            <button
              onClick={scrollToTop}
              className="font-ppneue w-fit text-[13px] sm:text-[14px] md:text-[15px] font-light tracking-[0.08em] text-[#1a1a1a] uppercase transition-opacity duration-200 hover:opacity-40"
            >
              BACK TO TOP
            </button>
            <span className="font-ppneue text-[13px] sm:text-[14px] md:text-[15px] font-light tracking-[0.05em] text-[#1a1a1a]/50 uppercase">
              2026 © TECHEYRIE STUDIO
            </span>
          </div>

          {/* Right — social links */}
          <div className="flex items-center gap-8 sm:gap-10">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-ppneue text-[13px] sm:text-[14px] md:text-[15px] font-light tracking-[0.08em] text-[#1a1a1a] uppercase transition-opacity duration-200 hover:opacity-40"
              >
                {link.label}
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* ── Watermark — center aligned, pushed to bottom ── */}
      <div
        ref={watermarkRef}
        className="mt-auto w-full select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* ✅ text-center + block display centers it perfectly */}
        <p
          className="font-ppneue block w-full text-center font-bold leading-none tracking-[-0.03em] text-[#1a1a1a]"
          style={{
            fontSize: "clamp(72px, 18vw, 9999px)",
            opacity: 0.10,
          }}
        >
          TECHEYRIE
        </p>
      </div>

    </footer>
  );
}