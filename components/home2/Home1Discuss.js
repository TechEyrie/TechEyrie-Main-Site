"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADING_LINES = ["LET'S DISCUSS", "YOUR PROJECT", "TOGETHER"];

export default function Home5Contact() {
  const sectionRef = useRef(null);
  const animFrameRef = useRef(null);
  const currentPos = useRef({ x: 50, y: 50 });
  const targetPos = useRef({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const headingLineRefs = useRef([]);
  const leftContentRefs = useRef([]);
  const cardRef = useRef(null);
  const cardLineRefs = useRef([]);

  // ── Cursor glow RAF ──
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    node.style.setProperty("--gx", "50%");
    node.style.setProperty("--gy", "50%");

    const tick = () => {
      const c = currentPos.current;
      const t = targetPos.current;
      c.x += (t.x - c.x) * 0.045;
      c.y += (t.y - c.y) * 0.045;
      node.style.setProperty("--gx", `${c.x}%`);
      node.style.setProperty("--gy", `${c.y}%`);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (!isHovering) setIsHovering(true);
    targetPos.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  // ── All animations scoped to sectionRef ──
  useGSAP(
    () => {
      // Heading lines
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
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: lines[0],
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }

      // Subtitle + button
      const leftEls = leftContentRefs.current.filter(Boolean);
      if (leftEls.length) {
        gsap.set(leftEls, { autoAlpha: 0, y: 20 });
        gsap.to(leftEls, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: leftEls[0],
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }

      // Card slide in
      if (cardRef.current) {
        gsap.set(cardRef.current, { autoAlpha: 0, x: 40 });
        gsap.to(cardRef.current, {
          autoAlpha: 1,
          x: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }

      // Card inner lines
      const cardEls = cardLineRefs.current.filter(Boolean);
      if (cardEls.length) {
        gsap.set(cardEls, { autoAlpha: 0, y: 16 });
        gsap.to(cardEls, {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.3,
          scrollTrigger: {
            trigger: cardRef.current,
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
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovering(false)}
      className="relative flex w-full items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 100% 120% at 10% 60%, #0d2a5e 0%, #071a3e 50%, #030d20 100%)",
        minHeight: "80vh",
      }}
    >
      {/* Blue cursor glow */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: isHovering
            ? `radial-gradient(ellipse 700px 580px at var(--gx) var(--gy), rgba(80, 160, 255, 0.38) 0%, rgba(60, 130, 255, 0.22) 40%, transparent 70%)`
            : `radial-gradient(ellipse 700px 580px at var(--gx) var(--gy), rgba(80, 160, 255, 0.16) 0%, rgba(60, 130, 255, 0.08) 40%, transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* Content */}
      <div className="relative z-[2] mx-auto w-full max-w-[1200px] px-6 sm:px-10 md:px-14 lg:flex lg:items-center lg:gap-14 lg:px-16">

        {/* ── Left: heading + subtitle + CTA ── */}
        <div className="w-full py-12 lg:w-[52%] lg:py-0">
          <h2 className="font-ppneue text-[48px] sm:text-[62px] md:text-[76px] lg:text-[70px] xl:text-[70px] font-regular leading-[0.92] tracking-[-0.02em] text-white uppercase">
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

          <p
            ref={(el) => (leftContentRefs.current[0] = el)}
            className="font-ppneue mt-7 max-w-[340px] text-[11px] sm:text-[12px] font-light leading-[1.7] tracking-[0.04em] text-white/55 uppercase"
          >
            OR FILL THE BRIEF FORM AND WE'LL CONTACT
            <br />
            YOU SHORTLY WITH THE CLEAN PROJECT PLAN.
          </p>

          <div ref={(el) => (leftContentRefs.current[1] = el)} className="mt-7">
            <a
              href="#"
              className="font-ppneue inline-flex items-center rounded-full border border-white/50 px-7 py-3 text-[12px] sm:text-[13px] font-medium tracking-[0.08em] text-white uppercase transition-all duration-300 hover:bg-white hover:text-[#030d20]"
            >
              FILL THE FORM
            </a>
          </div>
        </div>

        {/* ── Right: person card ── */}
        <div className="w-full pb-12 lg:w-[48%] lg:pb-0">
          <div
            ref={cardRef}
            className="flex overflow-hidden rounded-[3px] bg-[#f0ede6]"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Photo */}
            <div
              className="relative w-[40%] flex-shrink-0"
              style={{ minHeight: "320px" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80"
                alt="Alex Tkachev"
                fill
                sizes="25vw"
                className="object-cover object-top"
              />
            </div>

            {/* Card content */}
            <div className="flex flex-1 flex-col justify-between px-6 py-6 sm:px-7 sm:py-7">
              <div>
                <p
                  ref={(el) => (cardLineRefs.current[0] = el)}
                  className="font-ppneue mb-2 text-[10px] font-light tracking-[0.1em] text-[#1a1a1a]/55 uppercase"
                >
                  CREATIVE DIRECTOR
                </p>
                <h3
                  ref={(el) => (cardLineRefs.current[1] = el)}
                  className="font-ppneue mb-4 text-[20px] sm:text-[24px] font-semibold leading-none tracking-[-0.01em] text-[#1a1a1a]"
                >
                  ALEX TKACHEV
                </h3>

                <div
                  ref={(el) => (cardLineRefs.current[2] = el)}
                  className="mb-4 h-px w-full bg-[#1a1a1a]/15"
                />

                <p
                  ref={(el) => (cardLineRefs.current[3] = el)}
                  className="font-ppneue text-[10px] sm:text-[11px] font-light leading-[1.75] tracking-[0.04em] text-[#1a1a1a]/65 uppercase"
                >
                  AN EXPERIENCED DIGITAL DESIGNER
                  <br />
                  WITH A BACKGROUND IN WEB-DEV,
                  <br />
                  WITH A FOCUS ON CREATIVE VISUAL
                  <br />
                  EXPERIENCES AND AN ENTHUSIASM
                  <br />
                  FOR THE LIMITLESS POTENTIAL OF
                  <br />
                  CREATION.
                </p>
              </div>

              <div>
                <div
                  ref={(el) => (cardLineRefs.current[4] = el)}
                  className="mb-4 h-px w-full bg-[#1a1a1a]/15"
                />
                <a
                  ref={(el) => (cardLineRefs.current[5] = el)}
                  href="mailto:alex@ykwmi.studio"
                  className="font-ppneue text-[10px] sm:text-[11px] font-light tracking-[0.08em] text-[#1a1a1a]/60 uppercase transition-colors duration-200 hover:text-[#1a1a1a]"
                >
                  ALEX@YKWMI.STUDIO
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}