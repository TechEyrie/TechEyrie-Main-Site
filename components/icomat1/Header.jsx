"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { label: "Our Services", href: "#solutions", hasMega: true },
  { label: "Our Work",     href: "#work" },
  { label: "About Us",     href: "#about" },
];

const SERVICES = [
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="5" fill="#c8f04a" stroke="none"/>
        <path d="M18 20l1.5 1.5L22 18" stroke="#0a3a1a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "WordPress website design",
    desc: "Beautiful websites made by top WordPress designers",
    href: "#wp-design",
  },
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="6" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M9 12l3 3-3 3M14 18h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "WordPress development",
    desc: "Full WordPress development team with deep technical experience.",
    href: "#wp-dev",
  },
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 28 28" fill="none">
        <path d="M14 4l2.5 5 5.5.8-4 3.9.95 5.5L14 16.75 9.05 19.2 10 13.7 6 9.8l5.5-.8L14 4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M10 22h8M14 19.5V22" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    title: "WordPress maintenance",
    desc: "Our sites are always secured, always up and always fully functional",
    href: "#wp-maintenance",
  },
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 28 28" fill="none">
        <ellipse cx="14" cy="14" rx="10" ry="6" stroke="currentColor" strokeWidth="1.3"/>
        <ellipse cx="14" cy="14" rx="10" ry="6" stroke="currentColor" strokeWidth="1.3" transform="rotate(60 14 14)"/>
        <ellipse cx="14" cy="14" rx="10" ry="6" stroke="currentColor" strokeWidth="1.3" transform="rotate(120 14 14)"/>
        <circle cx="14" cy="14" r="2" fill="currentColor"/>
      </svg>
    ),
    title: "WordPress managed hosting",
    desc: "High level security, ultra-fast speeds, fully managed updates.",
    href: "#wp-hosting",
  },
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="11" r="5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M6 24c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="21" cy="10" r="3" fill="#c8f04a"/>
        <path d="M20 10l.8.8L22.2 9" stroke="#0a3a1a" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Freshy+ premium support",
    desc: "A dedicated point of contact, priority support and more",
    href: "#premium-support",
  },
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M14 4v20M4 14h20" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M7 8.5C9 11 11.5 12 14 12s5-1 7-3.5M7 19.5C9 17 11.5 16 14 16s5 1 7 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
    title: "Search engine optimization",
    desc: "Set your website up for success with our SEO programs",
    href: "#seo",
  },
];

function WavesLogo() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 21" fill="none" aria-hidden="true">
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

function IcomatWordmark() {
  return (
    <span style={{
      fontFamily: "'Arial Black', Arial, sans-serif",
      fontWeight: 500,
      fontSize: "1.8rem",
      letterSpacing: "0.12em",
      color: "#f8f8f8",
      lineHeight: 1,
      userSelect: "none",
    }}>
      ICOMAT
    </span>
  );
}

// ── Get a Quote Drawer ────────────────────────────────────────
function QuoteDrawer({ open, onClose }) {
  const overlayRef = useRef(null);
  const drawerRef  = useRef(null);
  const tlRef      = useRef(null);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", company: "", project: "",
  });
  const [focused,   setFocused]   = useState(null);
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.trim())    e.email    = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.company.trim())  e.company  = "Required";
    if (!form.project.trim())  e.project  = "Required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => { const n = { ...er }; delete n[field]; return n; });
  };

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setForm({ fullName: "", email: "", phone: "", company: "", project: "" });
        setErrors({});
        setSubmitted(false);
        setFocused(null);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const drawer  = drawerRef.current;
    if (!overlay || !drawer) return;
    tlRef.current?.kill();
    tlRef.current = gsap.timeline();
    if (open) {
      gsap.set(overlay, { display: "block" });
      gsap.set(drawer,  { display: "flex"  });
      tlRef.current
        .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4,  ease: "power2.out" }, 0)
        .fromTo(drawer,  { x: "110%" },  { x: "0%",   duration: 0.58, ease: "power4.out"  }, 0);
    } else {
      tlRef.current
        .to(drawer,  { x: "110%",  duration: 0.45, ease: "power4.inOut" }, 0)
        .to(overlay, { opacity: 0, duration: 0.38, ease: "power2.in"    }, 0.05)
        .set([overlay, drawer], { display: "none" });
    }
    return () => tlRef.current?.kill();
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const fieldStyle = (name, isTextarea = false) => ({
    width: "100%",
    background: focused === name ? "rgba(200,240,74,0.05)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${
      errors[name]     ? "rgba(255,90,70,0.55)"  :
      focused === name ? "rgba(200,240,74,0.35)"  :
                         "rgba(255,255,255,0.1)"
    }`,
    borderRadius: "10px",
    padding: isTextarea ? "15px 17px" : "13px 17px",
    color: "#f8f8f4",
    fontSize: "0.875rem",
    fontFamily: "Akkurat, sans-serif",
    fontWeight: 300,
    lineHeight: isTextarea ? 1.65 : 1,
    outline: "none",
    resize: isTextarea ? "none" : undefined,
    minHeight: isTextarea ? "120px" : undefined,
    transition: "border-color 0.25s, background 0.25s",
    caretColor: "#c8f04a",
    boxSizing: "border-box",
    display: "block",
  });

  const labelStyle = {
    display: "block",
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.62rem",
    fontFamily: "Akkurat, sans-serif",
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "8px",
  };

  const errorStyle = {
    display: "block",
    color: "rgba(255,100,80,0.9)",
    fontSize: "0.64rem",
    fontFamily: "Akkurat, sans-serif",
    fontWeight: 400,
    marginTop: "5px",
    letterSpacing: "0.03em",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={onClose}
        style={{
          display: "none",
          position: "fixed",
          inset: 0,
          zIndex: 300,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Floating drawer — NO overflow scroll on the outer shell */}
      <div
        ref={drawerRef}
        style={{
          display: "none",
          position: "fixed",
          top: "20px",
          bottom: "20px",
          right: "20px",
          zIndex: 301,
          width: "clamp(360px, 38vw, 540px)",
          flexDirection: "column",
          background: "linear-gradient(160deg, #162D24 0%, #162D24 50%, #1B4732 100%)",
          borderRadius: "12px",
          border: "1px solid rgba(200,240,74,0.12)",
          boxShadow: `
            0 32px 80px rgba(0,0,0,0.55),
            0 0 0 1px rgba(255,255,255,0.04),
            inset 0 1px 0 rgba(255,255,255,0.06)
          `,
          /* ── Key fix: hide scrollbar on the outer shell ── */
          overflow: "hidden",
        }}
      >

        {/* Lime glow orb */}
        <div style={{
          position: "absolute",
          bottom: "-60px", right: "-40px",
          width: "320px", height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,240,74,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* All content — this inner div scrolls without showing a scrollbar */}
        <div
          className="quote-scroll-inner"
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            /* scroll lives here, hidden via CSS class below */
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          {/* Top bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 32px 0",
            flexShrink: 0,
          }}>
            <WavesLogo />
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                width: "32px", height: "32px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.75rem",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s, color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(200,240,74,0.12)";
                e.currentTarget.style.color = "#c8f04a";
                e.currentTarget.style.borderColor = "rgba(200,240,74,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >✕</button>
          </div>

          {/* Heading block */}
          <div style={{ padding: "22px 32px 0", flexShrink: 0 }}>
            <h2 style={{
              color: "#f8f8f4",
              fontSize: "clamp(1.9rem, 3vw, 2.6rem)",
              fontWeight: 300,
              fontFamily: "Akkurat, sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 10px",
            }}>
              Get a quote
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.38)",
              fontSize: "0.8rem",
              fontFamily: "Akkurat, sans-serif",
              fontWeight: 300,
              lineHeight: 1.7,
              margin: "0 0 22px",
              maxWidth: "36ch",
            }}>
              Tell us about your project and we'll get back to you within 24 hours.
            </p>
            <div style={{
              height: "1px",
              background: "linear-gradient(to right, rgba(200,240,74,0.2), rgba(200,240,74,0.04) 60%, transparent)",
            }} />
          </div>

          {/* Form body */}
          <div style={{ padding: "22px 32px 28px", flex: 1 }}>

            {submitted ? (
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                textAlign: "center", paddingTop: "40px", gap: "20px",
              }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: "rgba(200,240,74,0.12)",
                  border: "1px solid rgba(200,240,74,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 32px rgba(200,240,74,0.12)",
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke="#c8f04a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p style={{ color: "#f8f8f4", fontSize: "1.1rem", fontWeight: 400, fontFamily: "Akkurat, sans-serif", margin: "0 0 8px", letterSpacing: "-0.01em" }}>Message sent!</p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", fontFamily: "Akkurat, sans-serif", fontWeight: 300, lineHeight: 1.65, margin: 0 }}>We'll be in touch within 24 hours.</p>
                </div>
                <button onClick={onClose} style={{
                  marginTop: "8px", padding: "13px 36px",
                  background: "#c8f04a", border: "none", borderRadius: "8px",
                  color: "#0a3a1a", fontSize: "0.68rem", fontWeight: 700,
                  fontFamily: "Akkurat, sans-serif", letterSpacing: "0.12em",
                  textTransform: "uppercase", cursor: "pointer",
                  transition: "background 0.2s, transform 0.15s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#d8ff5a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#c8f04a"; e.currentTarget.style.transform = "translateY(0)"; }}
                >Close</button>
              </div>

            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                <div>
                  <label style={labelStyle}>Full name <span style={{ color: "#c8f04a" }}>*</span></label>
                  <input type="text" placeholder="Jane Smith" value={form.fullName}
                    onChange={handleChange("fullName")}
                    onFocus={() => setFocused("fullName")} onBlur={() => setFocused(null)}
                    style={fieldStyle("fullName")} />
                  {errors.fullName && <span style={errorStyle}>{errors.fullName}</span>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={labelStyle}>Email <span style={{ color: "#c8f04a" }}>*</span></label>
                    <input type="email" placeholder="jane@company.com" value={form.email}
                      onChange={handleChange("email")}
                      onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                      style={fieldStyle("email")} />
                    {errors.email && <span style={errorStyle}>{errors.email}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input type="tel" placeholder="+44 7700 900000" value={form.phone}
                      onChange={handleChange("phone")}
                      onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                      style={fieldStyle("phone")} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Company <span style={{ color: "#c8f04a" }}>*</span></label>
                  <input type="text" placeholder="Acme Ltd." value={form.company}
                    onChange={handleChange("company")}
                    onFocus={() => setFocused("company")} onBlur={() => setFocused(null)}
                    style={fieldStyle("company")} />
                  {errors.company && <span style={errorStyle}>{errors.company}</span>}
                </div>

                <div>
                  <label style={labelStyle}>Tell us about your project <span style={{ color: "#c8f04a" }}>*</span></label>
                  <textarea
                    placeholder="Describe your goals, timeline, budget, or anything else you'd like us to know..."
                    value={form.project}
                    onChange={handleChange("project")}
                    onFocus={() => setFocused("project")} onBlur={() => setFocused(null)}
                    style={fieldStyle("project", true)} />
                  {errors.project && <span style={errorStyle}>{errors.project}</span>}
                </div>

                <button type="submit" style={{
                  marginTop: "6px", width: "100%", padding: "16px 24px",
                  background: "#c8f04a", border: "none", borderRadius: "10px",
                  color: "#0a2a12", fontSize: "0.7rem", fontWeight: 700,
                  fontFamily: "Akkurat, sans-serif", letterSpacing: "0.14em",
                  textTransform: "uppercase", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                  boxShadow: "0 4px 20px rgba(200,240,74,0.2)",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#d8ff5a"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(200,240,74,0.32)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#c8f04a"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(200,240,74,0.2)"; }}
                  onMouseDown={(e)  => { e.currentTarget.style.transform = "translateY(1px)"; }}
                  onMouseUp={(e)    => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                >
                  Send message
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9h12M11 5l4 4-4 4" stroke="#0a2a12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <p style={{
                  color: "rgba(255,255,255,0.2)", fontSize: "0.62rem",
                  fontFamily: "Akkurat, sans-serif", fontWeight: 300,
                  lineHeight: 1.7, textAlign: "center", margin: 0,
                }}>
                  By submitting you agree to our{" "}
                  <a href="#privacy" style={{ color: "rgba(200,240,74,0.45)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                    Privacy Policy
                  </a>
                  . We'll never share your data.
                </p>

              </form>
            )}
          </div>

          {/* Bottom reg bar — sticky at bottom inside the scroll container */}
          <div style={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 32px",
            marginTop: "auto",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.57rem", fontFamily: "Akkurat, sans-serif", fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              COMPANY REG NO. 11771620
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.57rem", fontFamily: "Akkurat, sans-serif", fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              VAT REG. NO. 326574685
            </span>
          </div>

        </div>{/* end quote-scroll-inner */}
      </div>
    </>
  );
}

// ── Service item ──────────────────────────────────────────────
function ServiceItem({ service, bottomBorder }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={service.href} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", gap: "14px",
        padding: "36px 24px 36px 0",
        borderBottom: bottomBorder ? "1px solid rgba(255,255,255,0.08)" : "none",
        textDecoration: "none", cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "18px" }}>
        <span style={{
          color: hovered ? "#c8f04a" : "rgba(255,255,255,0.7)",
          flexShrink: 0, marginTop: "2px", display: "block",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "transform 0.25s ease, color 0.25s ease",
        }}>{service.icon}</span>
        <span style={{
          color: hovered ? "#ffffff" : "rgba(255,255,255,0.88)",
          fontSize: "0.82rem", fontWeight: 300, fontFamily: "Akkurat, sans-serif",
          letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1.3,
          transition: "color 0.2s",
        }}>{service.title}</span>
      </div>
      <p style={{
        color: hovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)",
        fontSize: "0.86rem", fontFamily: "Akkurat, sans-serif", fontWeight: 300,
        lineHeight: 1.6, margin: 0, paddingLeft: "62px", transition: "color 0.2s",
      }}>{service.desc}</p>
    </a>
  );
}

// ── Mega dropdown ─────────────────────────────────────────────
function MegaDropdown({ visible, onMouseEnter, onMouseLeave }) {
  const panelRef = useRef(null);
  useEffect(() => {
    if (!panelRef.current) return;
    if (visible) {
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: -16, pointerEvents: "none" },
        { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.38, ease: "power3.out" }
      );
    } else {
      gsap.to(panelRef.current, { opacity: 0, y: -10, pointerEvents: "none", duration: 0.24, ease: "power2.in" });
    }
  }, [visible]);

  return (
    <div ref={panelRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
      style={{
        position: "fixed", top: "64px", left: 0, right: 0, zIndex: 140,
        background: "#0a0a09", borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)", opacity: 0, pointerEvents: "none",
        padding: "0 clamp(32px, 5vw, 80px)",
      }}
    >
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 320px",
        gap: "0 clamp(24px, 3vw, 56px)", maxWidth: "1400px", margin: "0 auto", alignItems: "stretch",
      }}>
        <div style={{
          gridColumn: "1 / 4", display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: "0 clamp(24px, 3vw, 56px)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          paddingRight: "clamp(24px, 3vw, 56px)",
        }}>
          {SERVICES.map((s, i) => <ServiceItem key={i} service={s} bottomBorder={i < 3} />)}
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "36px 0 36px clamp(24px, 2.5vw, 44px)" }}>
          <div style={{
            background: "#0d3320", borderRadius: "20px", padding: "36px 32px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            width: "100%", minHeight: "200px", border: "1px solid rgba(200,240,74,0.15)",
          }}>
            <p style={{
              color: "#c8f04a", fontSize: "0.92rem", fontWeight: 300,
              letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.5,
              fontFamily: "Akkurat, sans-serif", margin: 0,
            }}>Not sure what you need? Contact us.</p>
            <a href="#contact" style={{
              marginTop: "36px", display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "56px", height: "56px", borderRadius: "50%", background: "#c8f04a",
              textDecoration: "none", transition: "transform 0.22s, background 0.22s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.background = "#d8ff5a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#c8f04a"; }}
            >
              <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M11 5l4 4-4 4" stroke="#0a3a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Animated nav link ─────────────────────────────────────────
function AnimatedNavLink({ label, href, dimmed = false, onHoverStart, onHoverEnd, hasMega, megaOpen }) {
  const wrapRef = useRef(null), textRef = useRef(null), cloneRef = useRef(null), tlRef = useRef(null);
  useEffect(() => {
    const wrap = wrapRef.current, text = textRef.current, clone = cloneRef.current;
    if (!wrap || !text || !clone) return;
    const H = wrap.offsetHeight;
    gsap.set(clone, { y: H, opacity: 1 });
    gsap.set(text,  { y: 0, opacity: 1 });
    const onEnter = () => {
      tlRef.current?.kill();
      tlRef.current = gsap.timeline({ defaults: { duration: 0.52, ease: "power3.inOut" } });
      tlRef.current.to(text, { y: -H }, 0).to(clone, { y: 0 }, 0)
        .to(clone, { scale: 1.08, duration: 0.14, ease: "power1.out" }, 0.50)
        .to(clone, { scale: 1.0,  duration: 0.13, ease: "power1.inOut" }, 0.64);
    };
    const onLeave = () => {
      tlRef.current?.kill();
      tlRef.current = gsap.timeline({ defaults: { duration: 0.48, ease: "power3.inOut" } });
      tlRef.current.to(clone, { y: H }, 0).to(text, { y: 0 }, 0);
    };
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    return () => { wrap.removeEventListener("mouseenter", onEnter); wrap.removeEventListener("mouseleave", onLeave); tlRef.current?.kill(); };
  }, []);

  return (
    <a ref={wrapRef}
      href={hasMega ? undefined : href}
      onClick={hasMega ? (e) => e.preventDefault() : undefined}
      onMouseEnter={() => onHoverStart?.(label)}
      onMouseLeave={() => { if (!hasMega) onHoverEnd?.(); }}
      style={{
        position: "relative", overflow: "hidden",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: "8px 8px",
        color: dimmed ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.82)",
        fontSize: "0.67rem", fontWeight: 200, fontFamily: "Akkurat, sans-serif",
        letterSpacing: "0.13em", textTransform: "uppercase",
        textDecoration: "none", whiteSpace: "nowrap", cursor: "pointer",
        transition: "color 0.22s ease",
      }}
    >
      <span ref={textRef} style={{ display: "block", lineHeight: 1.15, whiteSpace: "nowrap" }}>
        {label}
        {hasMega && (
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ display: "inline-block", marginLeft: "5px", verticalAlign: "middle", transition: "transform 0.25s", transform: megaOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
            <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span ref={cloneRef} aria-hidden="true" style={{ display: "block", lineHeight: 1.15, whiteSpace: "nowrap", color: "#ffffff", position: "absolute" }}>
        {label}
        {hasMega && (
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ display: "inline-block", marginLeft: "5px", verticalAlign: "middle" }}>
            <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
    </a>
  );
}

// ── Animated CTA button ───────────────────────────────────────
function AnimatedCTAButton({ label, href, onClick }) {
  const wrapRef = useRef(null), textRef = useRef(null), cloneRef = useRef(null), tlRef = useRef(null);
  useEffect(() => {
    const wrap = wrapRef.current, text = textRef.current, clone = cloneRef.current;
    if (!wrap || !text || !clone) return;
    const H = wrap.offsetHeight;
    gsap.set(clone, { y: H, opacity: 1 });
    gsap.set(text,  { y: 0, opacity: 1 });
    const onEnter = () => {
      tlRef.current?.kill();
      gsap.to(wrap, { backgroundColor: "#0a0a09", borderColor: "#0a0a09", duration: 0.35, ease: "power2.out" });
      tlRef.current = gsap.timeline({ defaults: { duration: 0.52, ease: "power3.inOut" } });
      tlRef.current.to(text, { y: -H }, 0).to(clone, { y: 0 }, 0)
        .to(clone, { scale: 1.08, duration: 0.14, ease: "power1.out" }, 0.50)
        .to(clone, { scale: 1.0,  duration: 0.13, ease: "power1.inOut" }, 0.64);
    };
    const onLeave = () => {
      tlRef.current?.kill();
      gsap.to(wrap, { backgroundColor: "#ffffff", borderColor: "#ffffff", duration: 0.35, ease: "power2.out" });
      tlRef.current = gsap.timeline({ defaults: { duration: 0.48, ease: "power3.inOut" } });
      tlRef.current.to(clone, { y: H }, 0).to(text, { y: 0 }, 0);
    };
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    return () => { wrap.removeEventListener("mouseenter", onEnter); wrap.removeEventListener("mouseleave", onLeave); tlRef.current?.kill(); };
  }, []);

  return (
    <a ref={wrapRef}
      href={onClick ? undefined : href}
      onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined}
      style={{
        position: "relative", overflow: "hidden",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: "8px 16px",
        background: "#ffffff", border: "1px solid #ffffff", borderRadius: "7px",
        color: "#0a0a09", fontSize: "0.67rem", fontWeight: 700,
        fontFamily: "Akkurat, sans-serif", letterSpacing: "0.13em",
        textDecoration: "none", whiteSpace: "nowrap", cursor: "pointer",
      }}
    >
      <span ref={textRef} style={{ display: "block", lineHeight: 1, color: "#0a0a09", whiteSpace: "nowrap" }}>{label}</span>
      <span ref={cloneRef} aria-hidden="true" style={{ display: "block", lineHeight: 1, color: "#ffffff", whiteSpace: "nowrap", position: "absolute" }}>{label}</span>
    </a>
  );
}

// ── Animated mobile menu link ─────────────────────────────────
function AnimatedMobileMenuLink({ label, href, onClose }) {
  const wrapRef = useRef(null), textRef = useRef(null), cloneRef = useRef(null), tlRef = useRef(null);
  useEffect(() => {
    const wrap = wrapRef.current, text = textRef.current, clone = cloneRef.current;
    if (!wrap || !text || !clone) return;
    const H = wrap.offsetHeight;
    gsap.set(clone, { y: H, opacity: 0 });
    gsap.set(text,  { y: 0, opacity: 1 });
    const onEnter = () => {
      tlRef.current?.kill();
      tlRef.current = gsap.timeline({ defaults: { duration: 0.65, ease: "power4.inOut" } });
      tlRef.current.to(text, { y: -H, opacity: 0 }, 0).to(clone, { y: 0, opacity: 1 }, 0);
    };
    const onLeave = () => {
      tlRef.current?.kill();
      tlRef.current = gsap.timeline({ defaults: { duration: 0.55, ease: "power4.inOut" } });
      tlRef.current.to(clone, { y: H, opacity: 0 }, 0).to(text, { y: 0, opacity: 1 }, 0);
    };
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    return () => { wrap.removeEventListener("mouseenter", onEnter); wrap.removeEventListener("mouseleave", onLeave); tlRef.current?.kill(); };
  }, []);

  return (
    <a ref={wrapRef} href={href} onClick={onClose} style={{
      position: "relative", overflow: "hidden", display: "block",
      padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
      textDecoration: "none", cursor: "pointer",
    }}>
      <span ref={textRef} style={{
        display: "block", lineHeight: 1.1, whiteSpace: "nowrap",
        color: "rgba(255,255,255,0.82)",
        fontSize: "clamp(1.4rem, 4.05vw, 1.87rem)",
        fontWeight: 300, fontFamily: "Akkurat, sans-serif",
        letterSpacing: "-0.005em", textTransform: "uppercase",
      }}>{label}</span>
      <span ref={cloneRef} aria-hidden="true" style={{
        display: "block", lineHeight: 1.1, whiteSpace: "nowrap",
        color: "#ffffff", position: "absolute", top: "14px", left: 0,
        fontSize: "clamp(1.4rem, 4.05vw, 1.87rem)",
        fontWeight: 300, fontFamily: "Akkurat, sans-serif",
        letterSpacing: "-0.005em", textTransform: "uppercase",
      }}>{label}</span>
    </a>
  );
}

// ── Mobile menu ───────────────────────────────────────────────
function MobileMenu({ open, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(10,10,9,0.97)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      display: "flex", flexDirection: "column",
      padding: "80px 32px 48px",
      opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
      transform: open ? "translateY(0)" : "translateY(-12px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    }}>
      <button onClick={onClose} aria-label="Close menu" style={{
        position: "absolute", top: "20px", right: "24px",
        background: "none", border: "none",
        color: "rgba(255,255,255,0.6)", fontSize: "1.4rem",
        cursor: "pointer", lineHeight: 1, padding: "8px",
      }}>✕</button>
      <nav style={{ display: "flex", flexDirection: "column" }}>
        {[...NAV_ITEMS, { label: "Get a Quote", href: "#contact" }].map((item) => (
          <AnimatedMobileMenuLink key={item.label} label={item.label} href={item.href} onClose={onClose} />
        ))}
      </nav>
      <a href="#contact" onClick={onClose} style={{
        marginTop: "40px", display: "inline-block",
        padding: "14px 32px", border: "1px solid rgba(255,255,255,0.5)",
        borderRadius: "999px", color: "#fff", fontSize: "0.7rem",
        fontWeight: 700, letterSpacing: "0.14em", textDecoration: "none",
        textAlign: "center", transition: "background 0.2s, border-color 0.2s",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
      >GET A QUOTE</a>
    </div>
  );
}

// ── Burger icon ───────────────────────────────────────────────
function BurgerIcon({ open }) {
  return (
    <svg viewBox="0 0 14 7" fill="none" width="14" height="7">
      {[0,2,4,6,8,10,12].map((x, i) => (
        <circle key={`t${i}`} cx={x * 0.999 + 0.665} cy="0.665" r="0.665"
          fill={open ? "rgba(255,255,255,0.4)" : "white"} style={{ transition: "fill 0.2s" }} />
      ))}
      {[0,2,4,6,8,10,12].map((x, i) => (
        <circle key={`b${i}`} cx={x * 0.999 + 0.665} cy="5.692" r="0.665" fill="white" />
      ))}
    </svg>
  );
}

// ── Header ────────────────────────────────────────────────────
export default function Header({ quoteOpen = false, setQuoteOpen = () => {} }) {
  const headerRef                      = useRef(null);
  const closeTimerRef                  = useRef(null);
  const [scrolled,    setScrolled]     = useState(false);
  const [menuOpen,    setMenuOpen]     = useState(false);
  const [hoveredNav,  setHoveredNav]   = useState(null);
  const [megaOpen,    setMegaOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (menuOpen || quoteOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, quoteOpen]);

  useEffect(() => {
    const onClick = (e) => {
      if (!headerRef.current?.contains(e.target)) setMegaOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const openMega  = () => { clearTimeout(closeTimerRef.current); setMegaOpen(true); };
  const closeMega = () => { closeTimerRef.current = setTimeout(() => setMegaOpen(false), 140); };

  return (
    <>
      <header ref={headerRef} style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 150, height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px, 3vw, 40px)",
        background: scrolled || megaOpen
          ? "rgba(10,10,9,0.96)"
          : "linear-gradient(to bottom, rgba(10,10,9,0.55) 0%, transparent 100%)",
        backdropFilter: scrolled || megaOpen ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled || megaOpen ? "blur(14px)" : "none",
        borderBottom: scrolled || megaOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
      }}>
        <Link href="/" aria-label="ICOMAT — Back home"
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <WavesLogo />
          <IcomatWordmark />
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px, 1.5vw, 16px)" }}>
          <nav aria-label="Primary navigation" className="header-desktop-nav" style={{
            display: "flex", alignItems: "center",
            gap: "clamp(6px, 1.4vw, 22px)",
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px", padding: "8px 8px 8px 20px",
          }}>
            {NAV_ITEMS.map((item) => (
              <div key={item.label}
                onMouseEnter={() => { if (item.hasMega) openMega(); setHoveredNav(item.label); }}
                onMouseLeave={() => { if (item.hasMega) closeMega(); setHoveredNav(null); }}
                style={{ position: "relative" }}
              >
                <AnimatedNavLink
                  label={item.label}
                  href={item.href}
                  hasMega={item.hasMega}
                  megaOpen={item.hasMega && megaOpen}
                  dimmed={hoveredNav !== null && hoveredNav !== item.label}
                  onHoverStart={setHoveredNav}
                  onHoverEnd={() => setHoveredNav(null)}
                />
              </div>
            ))}
            <AnimatedCTAButton
              label="GET A QUOTE"
              href="#contact"
              onClick={() => setQuoteOpen(true)}
            />
          </nav>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-pressed={menuOpen}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="header-burger"
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "none", border: "none", cursor: "pointer", padding: "4px",
            }}
          >
            <span style={{
              fontSize: "0.6rem", fontWeight: 700,
              letterSpacing: "0.14em", color: "rgba(255,255,255,0.82)",
            }}>
              {menuOpen ? "CLOSE" : "MENU"}
            </span>
            <BurgerIcon open={menuOpen} />
          </button>
        </div>
      </header>

      <MegaDropdown visible={megaOpen} onMouseEnter={openMega} onMouseLeave={closeMega} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <QuoteDrawer open={quoteOpen} onClose={() => setQuoteOpen(false)} />

      <style>{`
        @media (max-width: 768px) { .header-desktop-nav { display: none !important; } }
        @media (min-width: 769px) { .header-burger      { display: none !important; } }

        /* ── Hide scrollbar on the quote drawer inner scroll area ── */
        .quote-scroll-inner          { scrollbar-width: none; }
        .quote-scroll-inner::-webkit-scrollbar { display: none; }

        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #162D24 inset !important;
          -webkit-text-fill-color: #f8f8f4 !important;
          caret-color: #c8f04a;
        }
      `}</style>
    </>
  );
}