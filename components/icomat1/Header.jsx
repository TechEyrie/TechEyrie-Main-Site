"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Nav items ─────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "SOLUTIONS",   href: "#solutions" },
  { label: "TECH",        href: "#tech" },
  { label: "INDUSTRIES",  href: "#industries" },
  {
    label: "THE COMPANY",
    href: "#company",
    hasDropdown: true,
    sub: ["MANIFESTO", "CAREERS", "WHITEPAPERS"],
  },
];

// ── Waves SVG logo ────────────────────────────────────────────
function WavesLogo() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M4.93561 20.277C8.90405 18.1244 14.4418 18.1244 18.4102 20.277L18.3688 20.4163C17.825 20.2601 17.2756 20.1246 16.7224 20.0098C13.4088 19.2986 9.93896 19.2986 6.62535 20.0098C6.07214 20.1246 5.52269 20.262 4.97889 20.4163L4.9375 20.277H4.93561Z" fill="#F8F8F8"/>
      <path d="M2.54027 18.0303C7.96888 14.7186 15.3789 14.7186 20.8075 18.0303L20.751 18.1639C20.0322 17.8666 19.3003 17.607 18.557 17.3831C14.105 16.0245 9.24465 16.0245 4.79074 17.3831C4.04749 17.6051 3.31364 17.8666 2.59672 18.1639L2.54027 18.0303Z" fill="#F8F8F8"/>
      <path d="M1.04246 15.62C7.22186 11.3844 16.1259 11.3844 22.3053 15.62L22.2394 15.7479C21.4228 15.3377 20.5817 14.9783 19.7218 14.6679C14.5792 12.7824 8.76858 12.7824 3.62599 14.6679C2.76607 14.9783 1.92684 15.3377 1.10832 15.7479L1.04246 15.62Z" fill="#F8F8F8"/>
      <path d="M0.186365 12.9706C6.75903 8.12719 16.587 8.12719 23.1596 12.9706L23.0881 13.0967C22.2188 12.615 21.3194 12.1878 20.3955 11.8209C14.8671 9.58737 8.47887 9.58737 2.95053 11.8209C2.02664 12.1878 1.1272 12.6131 0.257868 13.0967L0.186365 12.9706Z" fill="#F8F8F8"/>
      <path d="M0 9.96744C6.65545 4.98479 16.6904 4.98479 23.3458 9.96744L23.2743 10.0916C22.3937 9.59299 21.4811 9.1508 20.544 8.7707C14.9329 6.45813 8.41481 6.45813 2.80368 8.7707C1.86661 9.1508 0.954005 9.59111 0.073385 10.0916L0.00188167 9.96744H0Z" fill="#F8F8F8"/>
      <path d="M0.811009 6.41106C7.09954 2.01548 16.2482 2.01548 22.5367 6.41106L22.469 6.53901C21.6373 6.10999 20.7793 5.73178 19.9043 5.40813C14.6563 3.43238 8.69143 3.43238 3.44346 5.40813C2.5666 5.73178 1.71045 6.10999 0.878749 6.53901L0.811009 6.41106Z" fill="#F8F8F8"/>
      <path d="M4.03998 1.90448C8.56539 -0.633887 14.7805 -0.635768 19.3059 1.90448L19.2589 2.04184C18.6474 1.83862 18.0283 1.66175 17.4036 1.50933C13.6591 0.581671 9.68686 0.581671 5.94235 1.50933C5.31763 1.65987 4.69856 1.83862 4.08702 2.04184L4.03998 1.90448Z" fill="#F8F8F8"/>
    </svg>
  );
}

// ── ICOMAT wordmark ───────────────────────────────────────────
function IcomatWordmark() {
  return (
    <span
      style={{
        fontFamily: "'Arial Black', Arial, sans-serif",
        fontWeight: 500,
        fontSize: "1.8rem",
        letterSpacing: "0.12em",
        color: "#f8f8f8",
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      ICOMAT
    </span>
  );
}

// ── Dropdown ──────────────────────────────────────────────────
function Dropdown({ items, visible }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        left: "50%",
        background: "rgba(14,14,13,0.96)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        padding: "8px 0",
        minWidth: "180px",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(-6px)",
        transition: "opacity 0.22s ease, transform 0.22s ease",
        zIndex: 100,
      }}
    >
      {items.map((item) => (
        <a
          key={item}
          href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
          style={{
            display: "block",
            padding: "9px 20px",
            color: "rgba(255,255,255,0.62)",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.13em",
            textDecoration: "none",
            transition: "color 0.18s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.62)")}
        >
          {item}
        </a>
      ))}
    </div>
  );
}

// ── Burger dots icon ──────────────────────────────────────────
function BurgerIcon({ open }) {
  return (
    <svg viewBox="0 0 14 7" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="7">
      {[0, 2, 4, 6, 8, 10, 12].map((x, i) => (
        <circle
          key={`t${i}`}
          cx={x * 0.999 + 0.665}
          cy="0.665"
          r="0.665"
          fill={open ? "rgba(255,255,255,0.4)" : "white"}
          style={{ transition: "fill 0.2s" }}
        />
      ))}
      {[0, 2, 4, 6, 8, 10, 12].map((x, i) => (
        <circle
          key={`b${i}`}
          cx={x * 0.999 + 0.665}
          cy="5.692"
          r="0.665"
          fill="white"
        />
      ))}
    </svg>
  );
}

// ── Mobile menu ───────────────────────────────────────────────
function MobileMenu({ open, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(10,10,9,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        padding: "80px 32px 48px",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transform: open ? "translateY(0)" : "translateY(-12px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close menu"
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.6)",
          fontSize: "1.4rem",
          cursor: "pointer",
          lineHeight: 1,
          padding: "8px",
        }}
      >
        ✕
      </button>

      <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {[...NAV_ITEMS, { label: "CONTACT", href: "#contact" }].map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={onClose}
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              textDecoration: "none",
              padding: "10px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              transition: "color 0.18s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <a
        href="#contact"
        onClick={onClose}
        style={{
          marginTop: "40px",
          display: "inline-block",
          padding: "14px 32px",
          border: "1px solid rgba(255,255,255,0.5)",
          borderRadius: "999px",
          color: "#fff",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textDecoration: "none",
          textAlign: "center",
          transition: "background 0.2s, border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.borderColor = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
        }}
      >
        BUILD W/ ICOMAT
      </a>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────
export default function Header() {
  const headerRef = useRef(null);
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [dropdown,  setDropdown]  = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 150,
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(20px, 3vw, 40px)",
          background: scrolled
            ? "rgba(10,10,9,0.82)"
            : "linear-gradient(to bottom, rgba(10,10,9,0.55) 0%, transparent 100%)",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
        }}
      >
        {/* ── Left: logo + wordmark ─────────────────────────── */}
        <Link
          href="/"
          aria-label="ICOMAT — Back home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <WavesLogo />
          <IcomatWordmark />
        </Link>

        {/* ── Right: black pill (nav + CTA) + burger ────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px, 1.5vw, 16px)" }}>

          {/* Black pill containing nav links + CTA button */}
          <nav
            aria-label="Primary navigation"
            className="header-desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(6px, 1.2vw, 20px)",
              background: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "8px 8px 8px 18px",
            }}
          >
            {/* Nav links */}
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                style={{ position: "relative" }}
                onMouseEnter={() => item.hasDropdown && setDropdown(item.label)}
                onMouseLeave={() => setDropdown(null)}
              >
                <a
                  href={item.href}
                  style={{
                    color: "rgba(255,255,255,0.82)",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.13em",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    whiteSpace: "nowrap",
                    transition: "color 0.18s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.82)")}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ opacity: 0.6, marginTop: "1px" }}>
                      <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </a>
                {item.hasDropdown && (
                  <Dropdown items={item.sub} visible={dropdown === item.label} />
                )}
              </div>
            ))}

            {/* CTA button — inside the black pill */}
            <a
              href="#contact"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                background: "#ffffff",
                border: "1px solid #ffffff",
                borderRadius: "7px",
                color: "#0a0a09",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.13em",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.88)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.88)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.borderColor = "#ffffff";
              }}
            >
              BUILD W/ ICOMAT
            </a>
          </nav>

          {/* Burger button — mobile only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-pressed={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="header-burger"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.82)",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <span style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.82)",
            }}>
              {menuOpen ? "CLOSE" : "MENU"}
            </span>
            <BurgerIcon open={menuOpen} />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <style>{`
        @media (max-width: 768px) {
          .header-desktop-nav { display: none !important; }
        }
        @media (min-width: 769px) {
          .header-burger { display: none !important; }
        }
      `}</style>
    </>
  );
}