"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  DARK7_GRADIENTS,
  DARK7_GRADIENT_NOISE_STYLE,
  DARK7_AIRPLANE_END,
  dark7GradientSurfaceStyle,
} from "./dark7PageGradients";

function AirplaneCtaButton({
  href,
  type = "button",
  onClick,
  className = "",
  children,
}) {
  const [ctaHovered, setCtaHovered] = useState(false);

  const sharedClassName = `hero-cta-btn airplane-cta-btn group inline-flex cursor-pointer items-center justify-center px-5 py-2.5 font-merriweather text-[16px] font-light tracking-tight transition-colors duration-300 md:px-6 md:py-3 md:text-[18px] ${
    ctaHovered ? "text-[#F7F3F0]" : "text-[#162D24]"
  } ${className}`;

  const sharedStyle = {
    backgroundColor: ctaHovered ? "#162D24" : "#F0EDEA",
    borderRadius: "12px",
    color: ctaHovered ? "#F7F3F0" : "#162D24",
  };

  if (href) {
    return (
      <Link
        href={href}
        className={sharedClassName}
        style={sharedStyle}
        onMouseEnter={() => setCtaHovered(true)}
        onMouseLeave={() => setCtaHovered(false)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={sharedClassName}
      style={sharedStyle}
      onClick={onClick}
      onMouseEnter={() => setCtaHovered(true)}
      onMouseLeave={() => setCtaHovered(false)}
    >
      {children}
    </button>
  );
}

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function AirplaneHero({ theme = "dark", sharedBackground = false }) {
  const router = useRouter();
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const footerRef = useRef(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const sectionBgStyle = dark7GradientSurfaceStyle(DARK7_GRADIENTS.airplane, DARK7_AIRPLANE_END);
  const surfaceStyle =
    theme === "dark" && sharedBackground
      ? { background: "transparent", backgroundColor: "transparent" }
      : sectionBgStyle;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      gsap.set([textRef.current, buttonRef.current, footerRef.current], {
        opacity: 0,
        y: 20,
      });
      tl.to(textRef.current, { opacity: 1, y: 0, duration: 1.2 })
        .to(buttonRef.current, { opacity: 1, y: 0, duration: 1.0 }, "-=0.8")
        .to(footerRef.current, { opacity: 1, y: 0, duration: 1.0 }, "-=0.8");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleEnrollSubmit = (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Please enter your email.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    router.push(`/newsletter?email=${encodeURIComponent(trimmedEmail)}`);
  };

  return (
    <section
      ref={sectionRef}
      className="dark7-v25-airplane-hero relative w-full overflow-hidden"
      style={surfaceStyle}
    >
      {theme === "dark" && !sharedBackground && (
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={DARK7_GRADIENT_NOISE_STYLE}
          aria-hidden="true"
        />
      )}

      <div className="relative z-20 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16 px-6 sm:px-12 md:px-20 lg:px-32 pt-16 sm:pt-20 md:pt-24 pb-36 sm:pb-40 md:pb-48 lg:pb-56">
        <div className="max-w-xl lg:max-w-2xl shrink-0">
          <div ref={textRef}>
            <h1
              className="airplane-hero-heading font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] leading-[1.1] tracking-[0.01em]"
              style={{ color: "#162D24" }}
            >
              Your competitors are already building.
              <br />
              Are you?
            </h1>
          </div>
          <div ref={buttonRef} className="mt-8 md:mt-10">
            <AirplaneCtaButton href="/get-started">Get Started</AirplaneCtaButton>
          </div>
        </div>

        <div ref={footerRef} className="w-full min-w-0 lg:max-w-xl xl:max-w-2xl">
          <form onSubmit={handleEnrollSubmit} noValidate>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8">
              <div className="min-w-0 flex-1 border-b border-white/20 pb-1.5">
                <p className="airplane-enroll-label mb-1 font-merriweather text-[12px] sm:text-[13px] md:text-[14px] font-light tracking-[0.08em] text-[#F7F3F0] uppercase">
                  Enroll now
                </p>
                <label
                  htmlFor="airplane-enroll-email"
                  className="airplane-enroll-input-label block w-full cursor-text"
                >
                  <span className="airplane-enroll-email-hint mb-1 block font-merriweather text-[12px] sm:text-[13px] md:text-[14px] font-light text-[#F7F3F0]">
                    Enter your email
                  </span>
                  <input
                    id="airplane-enroll-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (emailError) setEmailError("");
                    }}
                    aria-invalid={emailError ? "true" : "false"}
                    aria-describedby={emailError ? "airplane-enroll-email-error" : undefined}
                    className="airplane-hero-input block w-full border-none bg-transparent py-0 font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] text-[#f6f2ee] transition-all focus:outline-none focus:ring-0"
                  />
                </label>
              </div>
              <AirplaneCtaButton type="submit" className="flex-shrink-0 gap-2">
                Get Started
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </AirplaneCtaButton>
            </div>
            {emailError ? (
              <p
                id="airplane-enroll-email-error"
                className="airplane-enroll-error mt-2 font-merriweather text-[12px] font-light text-[#f7a8a8]"
                role="alert"
              >
                {emailError}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
