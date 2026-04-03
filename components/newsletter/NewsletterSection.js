"use client";

import { useState } from "react";
import { dark7MainSurfaceStyle } from "../dark7/dark7PageSurface";

export default function NewsletterSection({ theme = "light" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setFormData({ name: "", email: "", agreedToTerms: false });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = theme === "dark";

  const mailingBenefits = [
    "Learn product development AI for real-world applications and scalable solutions",
    "Explore B2B systems, enterprise platforms, SaaS architecture, and AI-driven solutions",
    "Master SEO-driven content and strategies that elevate your brand visibility.",
    "Discover AI agents and automation systems that simplify complex workflows.",
    "Responsive web design and development for seamless cross-device experiences.",
  ];

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 pb-8 pt-28 md:px-6 lg:px-8"
      style={isDark ? dark7MainSurfaceStyle : { backgroundColor: "#f5e8d1" }}
    >
      <div className="w-full max-w-[1800px]">
        <div
          className={`grid grid-cols-1 gap-0 overflow-hidden rounded-3xl lg:grid-cols-2 ${
            isDark
              ? "shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              : "shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
          }`}
        >
          {/* Left Column */}
          <div
            className={`flex flex-col justify-center p-8 md:p-12 lg:p-16 xl:p-20 ${
              isDark ? "bg-[#132920]" : "bg-[#f5e8d1]"
            }`}
          >
            <div className="mb-10 flex items-center gap-3">
              <span className="inline-flex h-5 w-5 flex-shrink-0 rounded-sm bg-[#74F5A1]" />
              <span
                className={`font-merriweather text-[14px] font-semibold uppercase tracking-[0.16em] md:text-[16px] ${
                  isDark ? "nl-mint" : "nl-forest"
                }`}
              >
                Newsletter
              </span>
            </div>

            <h1 className="mb-10 font-italiana font-normal leading-[1.06] tracking-[-0.02em] sm:mb-12">
              <span
                className={`block text-[2.125rem] font-normal sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem] xl:text-[4.125rem] ${
                  isDark ? "nl-cream" : "nl-forest"
                }`}
              >
                Why sign up to
              </span>
              <span
                className={`mt-1 block text-[2.125rem] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem] xl:text-[4.125rem] ${
                  isDark ? "nl-cream" : "nl-forest"
                }`}
              >
                <span
                  className={`font-playfair font-light italic ${
                    isDark ? "nl-e8" : "nl-forest"
                  }`}
                >
                  Tech Eyrie
                </span>{" "}
                <span className="font-normal">weekly mailing?</span>
              </span>
            </h1>

            <div>
              <h2
                className={`mb-8 max-w-2xl font-italiana text-[1.25rem] font-normal leading-snug md:text-[1.4rem] lg:text-[1.55rem] ${
                  isDark ? "nl-cream" : "nl-forest"
                }`}
              >
                What can you expect from Tech Eyrie to grow your business, made
                effortless
              </h2>

              <ul className="space-y-5">
                {mailingBenefits.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="mt-1.5 inline-flex h-5 w-5 flex-shrink-0 rounded-sm bg-[#74F5A1]" />
                    <span
                      className={`font-merriweather text-[19px] font-normal leading-relaxed md:text-[20px] lg:text-[21px] ${
                        isDark ? "nl-e0" : "nl-forest"
                      }`}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column — ivory gradient + soft light well (dark7 luxury) */}
          <div
            className={`relative flex flex-col justify-center overflow-hidden p-8 md:p-12 lg:p-16 xl:p-20 ${
              isDark
                ? "border-t border-[rgba(224,209,182,0.2)] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] lg:border-l lg:border-t-0 lg:border-[rgba(224,209,182,0.22)]"
                : "bg-[#101e27]"
            }`}
            style={
              isDark
                ? {
                    backgroundColor: "#f3f1ec",
                    backgroundImage: `
                      radial-gradient(ellipse 90% 60% at 10% -5%, rgba(255,255,255,0.85), transparent 50%),
                      radial-gradient(ellipse 75% 50% at 105% 100%, rgba(18,104,91,0.09), transparent 52%),
                      linear-gradient(168deg, #fcfcfa 0%, #efeae3 48%, #e3ddd3 100%)
                    `,
                  }
                : undefined
            }
          >
            {isDark && (
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    -12deg,
                    transparent,
                    transparent 2px,
                    rgba(22, 45, 36, 0.02) 2px,
                    rgba(22, 45, 36, 0.02) 3px
                  )`,
                }}
                aria-hidden
              />
            )}
            <div className="relative z-[1]">
            <div className="mb-12">
              <h2 className="font-italiana font-normal leading-[1.15] tracking-[-0.01em]">
                <span
                  className={`block text-[32px] italic sm:text-[36px] md:text-[42px] lg:text-[48px] ${
                    isDark ? "font-playfair nl-forest" : "font-playfair nl-cream"
                  }`}
                >
                  Sign up for
                </span>
                <span
                  className={`mt-2 block text-[28px] font-normal leading-[1.18] sm:text-[32px] md:text-[36px] lg:text-[40px] xl:text-[44px] ${
                    isDark ? "nl-forest" : "nl-cream"
                  }`}
                >
                  refined and premium strategic business insights and values
                </span>
              </h2>
            </div>

            <div className="mb-12 flex items-center gap-4">
              <div
                className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full ring-1 ${
                  isDark
                    ? "bg-white/55 ring-[#162d24]/12 shadow-sm"
                    : "bg-[#162d24] ring-transparent"
                }`}
              >
                <div
                  className={`absolute inset-0 flex items-center justify-center font-merriweather text-xl font-bold ${
                    isDark ? "nl-forest" : "nl-cream"
                  }`}
                >
                  NN
                </div>
              </div>
              <div>
                <h3
                  className={`font-merriweather text-[17px] font-bold md:text-[18px] ${
                    isDark ? "nl-forest" : "nl-cream"
                  }`}
                >
                  Nasick Nadeer
                </h3>
                <p
                  className={`font-merriweather text-[14px] font-normal md:text-[15px] ${
                    isDark ? "nl-forest-muted" : "nl-a8"
                  }`}
                >
                  Founder of Tech Eyrie
                </p>
              </div>
            </div>

            {isSuccess && (
              <div className="mb-6 rounded-lg bg-[#74F5A1] p-4 text-center">
                <p className="font-merriweather text-[15px] font-semibold text-[#162d24]">
                  Successfully subscribed! Check your email for confirmation.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className={`mb-2 block font-merriweather text-[14px] font-semibold md:text-[15px] ${
                    isDark ? "nl-label-light" : "nl-label-dark"
                  }`}
                >
                  Name <span className="text-[#e57373]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={`w-full rounded-lg px-5 py-4 font-merriweather text-[15px] transition-all duration-200 focus:outline-none md:text-[16px] ${
                    isDark ? "nl-input-light" : "nl-input-dark"
                  } ${errors.name ? "ring-2 ring-[#e57373]" : ""}`}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-2 font-merriweather text-[13px] text-[#e57373]">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className={`mb-2 block font-merriweather text-[14px] font-semibold md:text-[15px] ${
                    isDark ? "nl-label-light" : "nl-label-dark"
                  }`}
                >
                  Email Address <span className="text-[#e57373]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="johndoe@gmail.com"
                  className={`w-full rounded-lg px-5 py-4 font-merriweather text-[15px] transition-all duration-200 focus:outline-none md:text-[16px] ${
                    isDark ? "nl-input-light" : "nl-input-dark"
                  } ${errors.email ? "ring-2 ring-[#e57373]" : ""}`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-2 font-merriweather text-[13px] text-[#e57373]">
                    {errors.email}
                  </p>
                )}
              </div>

              <p
                className={`font-merriweather text-[13px] font-normal leading-relaxed md:text-[14px] ${
                  isDark ? "nl-legal-light" : "nl-legal-dark"
                }`}
              >
                By clicking &apos;Subscribe&apos; you&apos;re confirming that you agree with our{" "}
                <a href="/terms-and-conditions" className="nl-legal-link underline transition-colors duration-200">
                  Terms and Conditions
                </a>
                .
              </p>

              {errors.submit && (
                <p className="font-merriweather text-[14px] text-[#e57373]">
                  {errors.submit}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="nl-submit group inline-flex min-h-[52px] items-center gap-3 rounded-xl px-9 py-3.5 hover:gap-4 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="font-merriweather text-[15px] font-semibold md:text-[16px]">
                  {isSubmitting ? "Subscribing…" : "Subscribe"}
                </span>
                {!isSubmitting && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                )}
              </button>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
