"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import PhoneCountryField from "../quote/PhoneCountryField";
import { lockBackgroundScroll } from "../quote/lockBackgroundScroll";
import "./QuoteDrawer.css";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  project: "",
  website: "",
};

function validateForm(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Required";
  else if (form.fullName.trim().length < 2) errors.fullName = "Name must be at least 2 characters";
  if (!form.email.trim()) errors.email = "Required";
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email address";
  if (!form.company.trim()) errors.company = "Required";
  if (!form.project.trim()) errors.project = "Required";
  else if (form.project.trim().length < 10) errors.project = "Please provide a bit more detail";
  return errors;
}

function fieldStyle(name, focused, errors, isTextarea = false) {
  return {
    width: "100%",
    background: focused === name ? "rgba(200,240,74,0.05)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${
      errors[name]
        ? "rgba(255,90,70,0.55)"
        : focused === name
          ? "rgba(200,240,74,0.35)"
          : "rgba(255,255,255,0.1)"
    }`,
    borderRadius: "10px",
    padding: isTextarea ? "15px 17px" : "13px 17px",
    color: "#f8f8f4",
    fontSize: "0.875rem",
    fontFamily: "Inter, Arial, sans-serif",
    fontWeight: 300,
    lineHeight: isTextarea ? 1.65 : 1,
    outline: "none",
    resize: isTextarea ? "none" : undefined,
    minHeight: isTextarea ? "120px" : undefined,
    transition: "border-color 0.25s, background 0.25s",
    caretColor: "#c8f04a",
    boxSizing: "border-box",
    display: "block",
  };
}

const labelStyle = {
  display: "block",
  color: "rgba(255,255,255,0.4)",
  fontSize: "0.62rem",
  fontFamily: "Inter, Arial, sans-serif",
  fontWeight: 500,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  marginBottom: "8px",
};

const errorStyle = {
  display: "block",
  color: "rgba(255,100,80,0.9)",
  fontSize: "0.64rem",
  fontFamily: "Inter, Arial, sans-serif",
  fontWeight: 400,
  marginTop: "5px",
  letterSpacing: "0.03em",
};

export default function QuoteDrawer({ open, onClose }) {
  const overlayRef = useRef(null);
  const drawerRef = useRef(null);
  const tlRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [focused, setFocused] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setForm(INITIAL_FORM);
        setErrors({});
        setSubmitted(false);
        setSubmitting(false);
        setServerError("");
        setFocused(null);
      }, 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    return lockBackgroundScroll();
  }, [open]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const drawer = drawerRef.current;
    if (!overlay || !drawer) return undefined;

    tlRef.current?.kill();
    tlRef.current = gsap.timeline();

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (open) {
      gsap.set(overlay, { display: "block" });
      gsap.set(drawer, { display: "flex", clearProps: "transform" });

      if (isMobile) {
        gsap.set(drawer, { x: 0, y: "100%" });
        tlRef.current
          .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
          .fromTo(drawer, { y: "100%" }, { y: "0%", duration: 0.5, ease: "power4.out" }, 0);
      } else {
        gsap.set(drawer, { x: "110%", y: 0 });
        tlRef.current
          .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
          .fromTo(drawer, { x: "110%" }, { x: "0%", duration: 0.58, ease: "power4.out" }, 0);
      }
    } else if (isMobile) {
      tlRef.current
        .to(drawer, { y: "100%", duration: 0.42, ease: "power4.inOut" }, 0)
        .to(overlay, { opacity: 0, duration: 0.38, ease: "power2.in" }, 0.05)
        .set([overlay, drawer], { display: "none", clearProps: "transform" });
    } else {
      tlRef.current
        .to(drawer, { x: "110%", duration: 0.45, ease: "power4.inOut" }, 0)
        .to(overlay, { opacity: 0, duration: 0.38, ease: "power2.in" }, 0.05)
        .set([overlay, drawer], { display: "none", clearProps: "transform" });
    }

    return () => tlRef.current?.kill();
  }, [open]);

  const handleChange = useCallback(
    (field) => (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      if (errors[field]) {
        setErrors((current) => {
          const next = { ...current };
          delete next[field];
          return next;
        });
      }
    },
    [errors],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    const nextErrors = validateForm(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quote",
          name: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          company: form.company.trim(),
          message: form.project.trim(),
          website: form.website,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        if (data.errors) {
          const mapped = {};
          if (data.errors.name) mapped.fullName = data.errors.name;
          if (data.errors.email) mapped.email = data.errors.email;
          if (data.errors.company) mapped.company = data.errors.company;
          if (data.errors.message) mapped.project = data.errors.message;
          if (data.errors.phone) mapped.phone = data.errors.phone;
          setErrors(mapped);
        }
        setServerError(data.error || "Failed to send message. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setSubmitting(false);
    } catch {
      setServerError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        ref={overlayRef}
        className="quote-drawer-overlay"
        onClick={onClose}
        aria-hidden={!open}
      />

      <div
        ref={drawerRef}
        className="quote-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Get a quote"
        data-lenis-prevent
        data-lenis-prevent-touch
        data-lenis-prevent-wheel
      >
        <div className="quote-drawer-glow" aria-hidden="true" />

        <div className="quote-scroll-inner">
          <div className="quote-drawer-header">
            <Image
              src="/logo/techeyrie_logo.png"
              alt="TechEyrie"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
            />
            <button type="button" className="quote-drawer-close-btn" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>

          <div className="quote-drawer-intro">
            <h2 className="quote-drawer-title">Get a quote</h2>
            <p className="quote-drawer-subtitle">
              Tell us about your project and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="quote-drawer-divider" />
          </div>

          <div className="quote-drawer-body">
            {submitted ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  paddingTop: "40px",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "rgba(200,240,74,0.12)",
                    border: "1px solid rgba(200,240,74,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 32px rgba(200,240,74,0.12)",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 12l5 5L20 7"
                      stroke="#c8f04a"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    style={{
                      color: "#f8f8f4",
                      fontSize: "1.1rem",
                      fontWeight: 400,
                      fontFamily: "Inter, Arial, sans-serif",
                      margin: "0 0 8px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Message sent!
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: "0.82rem",
                      fontFamily: "Inter, Arial, sans-serif",
                      fontWeight: 300,
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    We&apos;ll be in touch within 24 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    marginTop: "8px",
                    padding: "13px 36px",
                    background: "#c8f04a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#0a3a1a",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    fontFamily: "Inter, Arial, sans-serif",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "background 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = "#d8ff5a";
                    event.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = "#c8f04a";
                    event.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
                >
                  <label>
                    Website
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={handleChange("website")}
                    />
                  </label>
                </div>

                <div>
                  <label style={labelStyle}>
                    Full name <span style={{ color: "#c8f04a" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Jane Smith"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    onFocus={() => setFocused("fullName")}
                    onBlur={() => setFocused(null)}
                    style={fieldStyle("fullName", focused, errors)}
                  />
                  {errors.fullName && <span style={errorStyle}>{errors.fullName}</span>}
                </div>

                <div className="quote-form-row-2">
                  <div>
                    <label style={labelStyle}>
                      Email <span style={{ color: "#c8f04a" }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="jane@company.com"
                      value={form.email}
                      onChange={handleChange("email")}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      style={fieldStyle("email", focused, errors)}
                    />
                    {errors.email && <span style={errorStyle}>{errors.email}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <PhoneCountryField
                      key={open ? "open" : "closed"}
                      value={form.phone}
                      onChange={(full) => setForm((current) => ({ ...current, phone: full }))}
                      focused={focused === "phone"}
                      onFocus={() => setFocused("phone")}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    Company <span style={{ color: "#c8f04a" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Acme Ltd."
                    value={form.company}
                    onChange={handleChange("company")}
                    onFocus={() => setFocused("company")}
                    onBlur={() => setFocused(null)}
                    style={fieldStyle("company", focused, errors)}
                  />
                  {errors.company && <span style={errorStyle}>{errors.company}</span>}
                </div>

                <div>
                  <label style={labelStyle}>
                    Project details <span style={{ color: "#c8f04a" }}>*</span>
                  </label>
                  <textarea
                    name="project"
                    placeholder="Describe your goals, timeline, budget..."
                    value={form.project}
                    onChange={handleChange("project")}
                    onFocus={() => setFocused("project")}
                    onBlur={() => setFocused(null)}
                    style={fieldStyle("project", focused, errors, true)}
                  />
                  {errors.project && <span style={errorStyle}>{errors.project}</span>}
                </div>

                {serverError ? <span style={errorStyle}>{serverError}</span> : null}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    marginTop: "6px",
                    width: "100%",
                    padding: "16px 24px",
                    background: "#c8f04a",
                    border: "none",
                    borderRadius: "10px",
                    color: "#0a2a12",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    fontFamily: "Inter, Arial, sans-serif",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                    boxShadow: "0 4px 20px rgba(200,240,74,0.2)",
                  }}
                  onMouseEnter={(event) => {
                    if (submitting) return;
                    event.currentTarget.style.background = "#d8ff5a";
                    event.currentTarget.style.transform = "translateY(-2px)";
                    event.currentTarget.style.boxShadow = "0 8px 28px rgba(200,240,74,0.32)";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = "#c8f04a";
                    event.currentTarget.style.transform = "translateY(0)";
                    event.currentTarget.style.boxShadow = "0 4px 20px rgba(200,240,74,0.2)";
                  }}
                  onMouseDown={(event) => {
                    if (submitting) return;
                    event.currentTarget.style.transform = "translateY(1px)";
                  }}
                  onMouseUp={(event) => {
                    if (submitting) return;
                    event.currentTarget.style.transform = "translateY(-2px)";
                  }}
                >
                  {submitting ? "Sending…" : "Send message"}
                  {!submitting ? (
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path
                      d="M3 9h12M11 5l4 4-4 4"
                      stroke="#0a2a12"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  ) : null}
                </button>

                <p
                  style={{
                    color: "rgba(255,255,255,0.2)",
                    fontSize: "0.62rem",
                    fontFamily: "Inter, Arial, sans-serif",
                    fontWeight: 300,
                    lineHeight: 1.7,
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  By submitting you agree to our{" "}
                  <Link
                    href="/privacy-policy"
                    style={{
                      color: "rgba(200,240,74,0.45)",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                    }}
                  >
                    Privacy Policy
                  </Link>
                  . We&apos;ll never share your data.
                </p>
              </form>
            )}
          </div>

          <div className="quote-drawer-footer">
            <span
              style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: "0.57rem",
                fontFamily: "Inter, Arial, sans-serif",
                fontWeight: 400,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              COMPANY REG NO. 11771620
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: "0.57rem",
                fontFamily: "Inter, Arial, sans-serif",
                fontWeight: 400,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              VAT REG. NO. 326574685
            </span>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
