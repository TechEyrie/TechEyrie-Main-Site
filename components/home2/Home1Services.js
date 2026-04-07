"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SERVICES = [
  {
    category: "DESIGN",
    items: [
      "ONE-PAGE WEBSITE",
      "ART DIRECTION",
      "BRAND IDENTITY / PRESENTATIONS",
      "RESPONSIVE LAYOUT",
      "MOTION & UI ANIMATION",
      "ILLUSTRATION / 2D / 3D",
    ],
  },
  {
    category: "DEVELOPMENT",
    items: [
      "CUSTOM FRONT-END",
      "WEBFLOW / FRAMER",
      "DOCUMENTED FRONTEND CODE",
      "SMOOTH DIGITAL EXPERIENCE",
      "SEO SETUP",
      "EASY PUBLISHING",
    ],
  },
  {
    category: "MANAGEMENT",
    items: [
      "ADMIN PANELS & CMS",
      "CONTENT UPDATES",
      "PERFORMANCE MONITORING",
      "ANALYTICS & REPORTING",
    ],
  },
  {
    category: "STRATEGY",
    items: [
      "DESIGN SYSTEM FOR SCALING",
      "LAUNCH PLANNING",
      "CONVERSION OPTIMIZATION",
      "BRAND POSITIONING",
    ],
  },
];

const HEADING_LINES = ["OUR SERVICES", "AND CAPABILITIES"];

// ── Service block ─────────────────────────────────────────────────────────────
function ServiceBlock({ service }) {
  const containerRef = useRef(null);
  const categoryRef = useRef(null);
  const itemTextRefs = useRef([]);
  const topLineRef = useRef(null);
  const itemLineRefs = useRef([]);

  useGSAP(
    () => {
      const trigger = containerRef.current;
      if (!trigger) return;

      const triggerConfig = {
        trigger,
        start: "top 88%",
        toggleActions: "play none none none",
      };

      // ── Category heading — kinetic slide-up ──
      const catEl = categoryRef.current;
      if (catEl) {
        gsap.set(catEl, {
          yPercent: 110,
          scaleY: 0.62,
          autoAlpha: 0,
          filter: "blur(5px)",
          transformOrigin: "center bottom",
        });
        gsap.to(catEl, {
          yPercent: 0,
          scaleY: 1,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.17,
          ease: "power3.out",
          scrollTrigger: triggerConfig,
        });
      }

      // ── Top line — draw left to right ──
      const topLine = topLineRef.current;
      if (topLine) {
        gsap.set(topLine, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(topLine, {
          scaleX: 1,
          duration: 1.04,
          ease: "power3.inOut",
          delay: 0.39,
          scrollTrigger: triggerConfig,
        });
      }

      // ── Each item: text kinetic + line draw ──
      itemTextRefs.current.forEach((textEl, i) => {
        if (!textEl) return;
        const lineEl = itemLineRefs.current[i];
        const baseDelay = 0.58 + i * 0.16;

        // text — kinetic slide-up
        gsap.set(textEl, {
          yPercent: 110,
          scaleY: 0.62,
          autoAlpha: 0,
          filter: "blur(4px)",
          transformOrigin: "center bottom",
        });
        gsap.to(textEl, {
          yPercent: 0,
          scaleY: 1,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.07,
          ease: "power3.out",
          delay: baseDelay,
          scrollTrigger: triggerConfig,
        });

        // line — draw left to right after text
        if (lineEl) {
          gsap.set(lineEl, { scaleX: 0, transformOrigin: "left center" });
          gsap.to(lineEl, {
            scaleX: 1,
            duration: 0.91,
            ease: "power3.inOut",
            delay: baseDelay + 0.20,
            scrollTrigger: triggerConfig,
          });
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      {/* Category label — overflow hidden for mask */}
      <div className="mb-5 overflow-hidden pb-[0.08em]">
        <h3
          ref={categoryRef}
          className="font-ppneue text-[26px] sm:text-[30px] md:text-[34px] font-thin tracking-[0.05em] text-white uppercase"
          style={{ transformOrigin: "center bottom", willChange: "transform, opacity, filter" }}
        >
          {service.category}
        </h3>
      </div>

      {/* Top divider line */}
      <div
        ref={topLineRef}
        className="h-[1.5px] w-full bg-white/60"
        style={{ transformOrigin: "left center" }}
      />

      {/* Items */}
      {service.items.map((item, i) => (
        <div key={item}>
          {/* Item text — overflow hidden for mask */}
          <div className="overflow-hidden py-[8px] pb-[calc(8px+0.06em)]">
            <span
              ref={(el) => (itemTextRefs.current[i] = el)}
              className="font-ppneue text-[13px] sm:text-[14px] md:text-[15px] font-thin tracking-[0.06em] text-white/75 uppercase"
              style={{
                display: "inline-block",
                transformOrigin: "center bottom",
                willChange: "transform, opacity, filter",
              }}
            >
              {item}
            </span>
          </div>

          {/* Bottom divider line — draws left to right */}
          <div
            ref={(el) => (itemLineRefs.current[i] = el)}
            className="h-[1.5px] w-full bg-white/60"
            style={{ transformOrigin: "left center" }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function Home3Services() {
  const sectionRef = useRef(null);
  const animFrameRef = useRef(null);
  const currentPos = useRef({ x: 50, y: 50 });
  const targetPos = useRef({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const headingRef = useRef(null);
  const headingLineRefs = useRef([]);

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

  // ── Heading scroll reveal ──
  useGSAP(
    () => {
      const lines = headingLineRefs.current.filter(Boolean);
      if (!lines.length) return;

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
        duration: 1.3,
        ease: "power3.out",
        stagger: 0.20,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: headingRef }
  );

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovering(false)}
      className="relative w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 90% 70% at 25% 35%, #0c2a5c 0%, #071a3e 45%, #030d20 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Blue cursor glow */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: isHovering
            ? `radial-gradient(ellipse 700px 580px at var(--gx) var(--gy), rgba(80, 160, 255, 0.42) 0%, rgba(60, 130, 255, 0.26) 40%, transparent 70%)`
            : `radial-gradient(ellipse 700px 580px at var(--gx) var(--gy), rgba(80, 160, 255, 0.20) 0%, rgba(60, 130, 255, 0.10) 40%, transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* Content */}
      <div className="relative z-[2] mx-auto max-w-[1200px] px-6 py-20 sm:px-10 md:px-14 lg:px-16">

        {/* Heading */}
        <div ref={headingRef} className="mb-20 md:mb-28">
          <h2 className="font-ppneue text-[52px] sm:text-[68px] md:text-[84px] lg:text-[100px] xl:text-[112px] font-thin leading-[0.95] tracking-[-0.02em] text-white uppercase">
            {HEADING_LINES.map((line, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  overflow: "hidden",
                  paddingBottom: "0.1em",
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

        {/* 2-column services grid */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-2 md:gap-y-16">
          {SERVICES.map((service) => (
            <ServiceBlock key={service.category} service={service} />
          ))}
        </div>

      </div>
    </section>
  );
}