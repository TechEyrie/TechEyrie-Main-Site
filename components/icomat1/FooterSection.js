"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── SVG: ICOMAT stacked-waves logo ────────────────────────────
const WavesLogo = () => (
  <svg width="88" height="72" viewBox="0 0 88 72" fill="none" aria-label="ICOMAT waves mark">
    <path d="M4  14 Q22  2 44 14 Q66  2 84 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.55"/>
    <path d="M4  26 Q22 14 44 26 Q66 14 84 26" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.68"/>
    <path d="M4  38 Q22 26 44 38 Q66 26 84 38" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.82"/>
    <path d="M4  50 Q22 38 44 50 Q66 38 84 50" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.92"/>
    <path d="M4  62 Q22 50 44 62 Q66 50 84 62" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
  </svg>
);

// ── Social icons ───────────────────────────────────────────────
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.985V9h3.101v1.561h.046c.433-.818 1.49-1.681 3.065-1.681 3.275 0 3.879 2.156 3.879 4.961v6.611zM5.337 7.433a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6zM6.927 20.452H3.742V9h3.185v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.734-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
  </svg>
);
const YouTubeIcon = () => (
  <svg width="20" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// ── Nav data (keeps previous footer structure) ─────────────────
const NAV_MAIN = [
  {
    label: "OUR SERVICES",
    href: "https://freshysites.com/",
    sub: [
      "WordPress website design",
      "WordPress retained services",
      "WordPress backups",
      "WordPress conversion",
      "WordPress security",
      "WordPress search engine optimization",
      "WordPress support",
      "WooCommerce developer",
      "WordPress development",
      "WordPress hosting",
      "WordPress compliance",
      "WordPress Divi theme",
      "WordPress migration",
      "WordPress GDPR compliance",
      "WordPress theme experts",
      "Sell my web design company",
      "WordPress maintenance",
      "WordPress ADA compliance",
      "Marketing Pro",
      "WordPress Elementor builder",
      "WordPress PCI compliance",
      "WordPress speed optimization",
      "WordPress white label",
    ],
  },
  {
    label: "OUR WORK",
    href: "https://freshysites.com/portfolio/",
    sub: ["Featured projects", "Testimonials", "Markets we serve", "Industries we serve"],
  },
  {
    label: "ABOUT US",
    href: "https://freshysites.com/about/",
    sub: [
      "Why Freshy",
      "Read the blog",
      "How to sell your agency guide",
      "WordPress resource guides",
      "WordPress security bulletins",
      "Compare WordPress agencies",
      "Privacy policy",
      "AI disclosure (llms.txt)",
    ],
  },
];

const NAV_LEGAL = [
  { label: "LEGAL",          href: "https://freshysites.com/", bold: true },
  { label: "TERMS",          href: "https://freshysites.com/", bold: false },
  { label: "PRIVACY POLICY", href: "https://freshysites.com/", bold: false },
];

const SOCIALS = [
  { icon: <LinkedInIcon />, href: "#linkedin", label: "LinkedIn" },
  { icon: <XIcon />,        href: "#x",        label: "X (Twitter)" },
  { icon: <YouTubeIcon />,  href: "#youtube",  label: "YouTube" },
];

// ── Wave lines background ──────────────────────────────────────
function WaveLines() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, raf = null, tick = 0;

    const LINE_SPACING = 22;
    const AMPLITUDE    = 6;
    const WAVELENGTH   = 220;
    const SPEED        = 0.6;
    const BASE_OPACITY = 0.055;
    const LINE_WIDTH   = 0.85;
    const TILT         = 0.18;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = canvas.width  = Math.round(rect.width)  || canvas.offsetWidth;
      H = canvas.height = Math.round(rect.height) || canvas.offsetHeight;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      tick += SPEED;

      const rowCount = Math.ceil(H / LINE_SPACING) + 2;
      ctx.lineWidth = LINE_WIDTH;

      for (let r = -1; r < rowCount; r++) {
        const baseY = r * LINE_SPACING;
        const opacityMod = 0.7 + 0.3 * ((r % 5) / 5);
        ctx.strokeStyle = `rgba(255,255,255,${(BASE_OPACITY * opacityMod).toFixed(4)})`;
        ctx.beginPath();

        for (let x = 0; x <= W; x += 2) {
          const tiltY = x * TILT;
          const phase = (r * 0.55) + (tick / WAVELENGTH) * (Math.PI * 2);
          const waveY = Math.sin((x / WAVELENGTH) * Math.PI * 2 - phase) * AMPLITUDE;
          const y = baseY + tiltY + waveY;
          if (x === 0) ctx.moveTo(x, y);
          else         ctx.lineTo(x, y);
        }

        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// ── Footer ─────────────────────────────────────────────────────
export default function FooterSection() {
  const footerRef   = useRef(null);
  const logoRef     = useRef(null);
  const wordmarkRef = useRef(null);
  const navRef      = useRef(null);
  const taglineRef  = useRef(null);
  const bottomRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = [logoRef.current, wordmarkRef.current, navRef.current].filter(Boolean);
      gsap.set(els, { opacity: 0, y: 24 });
      gsap.set([taglineRef.current, bottomRef.current], { opacity: 0 });

      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 92%",
        once: true,
        onEnter: () => {
          gsap.to(els, {
            opacity: 1, y: 0,
            duration: 0.9, ease: "power3.out", stagger: 0.12,
          });
          gsap.to([taglineRef.current, bottomRef.current], {
            opacity: 1,
            duration: 1.1, ease: "power2.out",
            delay: 0.3, stagger: 0.15,
          });
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "720px",
        background: "#162D24",
        overflow: "hidden",
        padding: "clamp(20px, 2.5vw, 28px) clamp(28px, 5vw, 72px) 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >

      <WaveLines />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-10%", right: "-5%",
          width: "55%",   height: "80%",
          background: "radial-gradient(ellipse at 80% 70%, rgba(80,80,70,0.18) 0%, transparent 68%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── TOP ROW ───────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1, marginTop: 0, paddingTop: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "22px",
          }}
        >
          <div ref={logoRef} style={{ marginTop: 0, paddingTop: 0 }}>
            <WavesLogo />
          </div>
          <div ref={wordmarkRef} style={{ marginTop: 0, paddingTop: 0, textAlign: "right" }}>
            <span style={{
              display: "block",
              fontFamily: "'Arial Black', 'Arial', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(3.5rem, 9vw, 9rem)",
              letterSpacing: "-0.02em",
              color: "rgba(210,215,220,0.9)",
              lineHeight: 1,
              userSelect: "none",
            }}>
              FRESHY
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
          <div ref={navRef} style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "20px", width: "100%", marginTop: "48px" }}>
            <nav aria-label="Footer navigation">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.2fr 1fr 1fr",
                  gap: "clamp(34px, 4vw, 72px)",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                {NAV_MAIN.map((item) => (
                  <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <a
                      href={item.href}
                      style={{
                        color: "rgba(255,255,255,0.82)",
                        fontSize: "clamp(0.6rem, 0.72vw, 0.7rem)",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textDecoration: "none",
                        transition: "color 0.2s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.82)"}
                    >
                      {item.label}
                    </a>
                    {item.sub && (
                      <div
                        style={{
                          display: item.label === "OUR SERVICES" ? "grid" : "flex",
                          gridTemplateColumns: item.label === "OUR SERVICES" ? "repeat(3, minmax(0, 1fr))" : undefined,
                          gap: item.label === "OUR SERVICES" ? "6px 30px" : "8px",
                          flexDirection: item.label === "OUR SERVICES" ? undefined : "column",
                        }}
                      >
                        {item.sub.map((sub) => (
                          <a
                            key={sub}
                            href={`#${sub.toLowerCase().replace(/\s/g, "-")}`}
                            style={{
                              color: "rgba(255,255,255,0.35)",
                          fontSize: "clamp(0.76rem, 0.9vw, 0.88rem)",
                              fontWeight: 500,
                              letterSpacing: "0.1em",
                              textDecoration: "none",
                              transition: "color 0.2s",
                              whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
                          >
                            {sub}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1, marginTop: "clamp(24px, 4vw, 48px)" }}>
        <div style={{
          width: "100%", height: "1px",
          background: "rgba(255,255,255,0.08)",
          marginBottom: "28px",
        }} />

        <div
          ref={bottomRef}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div ref={taglineRef} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <p style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "clamp(1rem, 1.6vw, 1.35rem)",
                fontWeight: 700, lineHeight: 1.25,
                letterSpacing: "-0.01em", margin: 0,
              }}>The WordPress</p>
              <p style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "clamp(1rem, 1.6vw, 1.35rem)",
                fontWeight: 700, lineHeight: 1.25,
                letterSpacing: "-0.01em", margin: 0,
              }}>partner you've been looking for.</p>
            </div>
            <p style={{
              color: "rgba(255,255,255,0.28)",
              fontSize: "clamp(0.58rem, 0.65vw, 0.65rem)",
              fontWeight: 500, letterSpacing: "0.04em", margin: 0,
            }}>
              ©2026 Freshy. All rights reserved.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignSelf: "flex-end" }}>
            {NAV_LEGAL.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  color: item.bold ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.32)",
                  fontSize: "clamp(0.58rem, 0.65vw, 0.65rem)",
                  fontWeight: item.bold ? 700 : 500,
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.75)"}
                onMouseLeave={(e) => e.currentTarget.style.color = item.bold ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.32)"}
              >
                {item.label}
              </a>
            ))}

            <div style={{
              width: "100%", height: "1px",
              background: "rgba(255,255,255,0.07)",
              margin: "8px 0",
            }} />

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "32px", height: "32px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    transition: "border-color 0.2s, color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}