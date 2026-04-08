"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { dark7MainSurfaceStyle } from "../dark7/dark7PageSurface";

gsap.registerPlugin(ScrollTrigger);

export default function MainSection({ theme = "dark" }) {
  const isDark = theme === "dark";
  const sectionRef = useRef(null);
  const leftContentRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    message: "",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftContentRef.current?.children || [], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 20%",
        },
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(formRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const surfaceStyle = isDark
    ? dark7MainSurfaceStyle
    : { backgroundColor: "#F9F7F0" };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-stretch justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24 lg:py-28 pt-24 sm:pt-28 md:pt-32 lg:pt-36"
      style={surfaceStyle}
    >
      <div className="max-w-[1800px] w-full mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] gap-12 sm:gap-14 lg:gap-16 xl:gap-24 relative z-10">
        <div
          ref={leftContentRef}
          className="flex flex-col justify-between gap-12 lg:gap-16"
        >
          <div className="space-y-8 sm:space-y-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <span
                className="h-2 w-10 sm:w-12 rounded-full shrink-0"
                style={{ backgroundColor: "#a7b431" }}
                aria-hidden
              />
              <span
                className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.16em] ${
                  isDark ? "text-[#e0d1b6]" : "text-[#162d24]"
                }`}
              >
                Contact
              </span>
            </div>

            <h1
              className={`font-italiana font-light text-[2.15rem] min-[400px]:text-[2.65rem] sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-7xl 2xl:text-8xl leading-[1.05] tracking-[0.01em] ${
                isDark ? "text-[#e0d1b6]" : "text-[#162d24]"
              }`}
            >
              A strategic conversation 

              <span className="font-playfair italic font-semibold opacity-95">
                
              </span>
               <br></br>with the Experts 
            </h1>
          </div>

          <div className="space-y-8 lg:space-y-10">
            <p
              className={`font-merriweather font-light text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-relaxed max-w-xl ${
                isDark ? "text-[#d0d0d0]" : "text-[#374635]"
              }`}
            >
           When you book a meeting with us, you’ll talk directly to experts, not any ordinary person. Get actionable insights, explore tailored strategies, and align your growth goals from the very first conversation.

            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a
                href="mailto:hello@example.com"
                className={`contact-icon-btn inline-flex min-h-12 min-w-12 sm:min-h-14 sm:min-w-14 items-center justify-center rounded-[8px] border shadow-[0_8px_24px_rgba(0,0,0,0.15)] cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#74F5A1] focus-visible:ring-offset-2 ${
                  isDark
                    ? "border-white/15 bg-[#2A2A2A] text-white hover:bg-[#353535] hover:border-white/25 focus-visible:ring-offset-[#162d24]"
                    : "border-black/10 bg-white text-[#162d24] hover:bg-[#f5f5f5] focus-visible:ring-offset-white"
                }`}
                aria-label="Email us"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </a>
              <a
                href="tel:+10000000000"
                className={`contact-icon-btn inline-flex min-h-12 min-w-12 sm:min-h-14 sm:min-w-14 items-center justify-center rounded-[8px] border shadow-[0_8px_24px_rgba(0,0,0,0.15)] cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#74F5A1] focus-visible:ring-offset-2 ${
                  isDark
                    ? "border-white/15 bg-[#2A2A2A] text-white hover:bg-[#353535] hover:border-white/25 focus-visible:ring-offset-[#162d24]"
                    : "border-black/10 bg-white text-[#162d24] hover:bg-[#f5f5f5] focus-visible:ring-offset-white"
                }`}
                aria-label="Call us"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div
          ref={formRef}
          className={`rounded-2xl sm:rounded-3xl border p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 ${
            isDark
              ? "bg-[#101e27] border-[rgba(167,180,49,0.24)] shadow-[0_32px_80px_rgba(0,0,0,0.35)]"
              : "bg-white border-black/10 shadow-lg"
          }`}
        >
          <h2
            className={`font-italiana font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 sm:mb-10 leading-[1.08] tracking-[0.01em] ${
              isDark ? "text-[#e0d1b6]" : "text-[#162d24]"
            }`}
          >
            Get in touch
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
            <div>
              <label
                htmlFor="name"
                className={`contact-field-label block font-merriweather text-[13px] sm:text-[14px] font-semibold mb-2 ${
                  isDark ? "text-[#e0d1b6]" : "text-[#162d24]"
                }`}
              >
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className={`contact-input w-full rounded-xl border px-4 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-merriweather transition-shadow outline-none focus:ring-2 focus:ring-[#a7b431]/55 ${
                  isDark
                    ? "bg-[#0c1814] border-[rgba(167,180,49,0.2)] placeholder:text-[#a39a88]/55"
                    : "bg-[#f9f7f0] border-black/10 placeholder:text-gray-500"
                }`}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className={`contact-field-label block font-merriweather text-[13px] sm:text-[14px] font-semibold mb-2 ${
                  isDark ? "text-[#e0d1b6]" : "text-[#162d24]"
                }`}
              >
                Email address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
                className={`contact-input w-full rounded-xl border px-4 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-merriweather transition-shadow outline-none focus:ring-2 focus:ring-[#a7b431]/55 ${
                  isDark
                    ? "bg-[#0c1814] border-[rgba(167,180,49,0.2)] placeholder:text-[#a39a88]/55"
                    : "bg-[#f9f7f0] border-black/10 placeholder:text-gray-500"
                }`}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className={`contact-field-label block font-merriweather text-[13px] sm:text-[14px] font-semibold mb-2 ${
                  isDark ? "text-[#e0d1b6]" : "text-[#162d24]"
                }`}
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={`contact-input w-full rounded-xl border px-4 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-merriweather transition-shadow outline-none focus:ring-2 focus:ring-[#a7b431]/55 ${
                  isDark
                    ? "bg-[#0c1814] border-[rgba(167,180,49,0.2)] placeholder:text-[#a39a88]/55"
                    : "bg-[#f9f7f0] border-black/10 placeholder:text-gray-500"
                }`}
              />
            </div>

            <div>
              <label
                htmlFor="source"
                className={`contact-field-label block font-merriweather text-[13px] sm:text-[14px] font-semibold mb-2 ${
                  isDark ? "text-[#e0d1b6]" : "text-[#162d24]"
                }`}
              >
                How did you hear about us? <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="Referral, LinkedIn, search…"
                required
                className={`contact-input w-full rounded-xl border px-4 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-merriweather transition-shadow outline-none focus:ring-2 focus:ring-[#a7b431]/55 ${
                  isDark
                    ? "bg-[#0c1814] border-[rgba(167,180,49,0.2)] placeholder:text-[#a39a88]/55"
                    : "bg-[#f9f7f0] border-black/10 placeholder:text-gray-500"
                }`}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className={`contact-field-label block font-merriweather text-[13px] sm:text-[14px] font-semibold mb-2 ${
                  isDark ? "text-[#e0d1b6]" : "text-[#162d24]"
                }`}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Goals, timeline, anything we should know…"
                rows={5}
                className={`contact-input w-full rounded-xl border px-4 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-merriweather resize-y min-h-[120px] sm:min-h-[140px] transition-shadow outline-none focus:ring-2 focus:ring-[#a7b431]/55 ${
                  isDark
                    ? "bg-[#0c1814] border-[rgba(167,180,49,0.2)] placeholder:text-[#a39a88]/55"
                    : "bg-[#f9f7f0] border-black/10 placeholder:text-gray-500"
                }`}
              />
            </div>

            <p
              className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-semibold leading-relaxed ${
                isDark ? "text-[#c8c2ad]" : "text-gray-600"
              }`}
            >
              By sending a message you agree to our{" "}
              <a
                href="/terms-and-conditions"
                className={`underline underline-offset-2 ${
                  isDark
                    ? "text-[#a7b431] hover:text-[#c4d04a]"
                    : "text-[#1b4732] hover:opacity-80"
                }`}
              >
                Terms
              </a>
              .
            </p>

            {/* Same CTA as dark7 RealProblemSection ("Our services") */}
            <button
              type="submit"
              className={`contact-submit group inline-flex cursor-pointer items-center justify-center self-start rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px] mt-2 sm:mt-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#74F5A1] focus-visible:ring-offset-2 ${
                isDark
                  ? "focus-visible:ring-offset-[#101e27]"
                  : "focus-visible:ring-offset-white"
              }`}
              style={{ backgroundColor: "#12685b" }}
            >
              <span className="font-merriweather text-[13px] sm:text-[14px] md:text-[15px] font-semibold tracking-wide text-white">
                Send message
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
