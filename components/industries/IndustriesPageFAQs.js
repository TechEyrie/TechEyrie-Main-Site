"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services1ListingDarkSurface } from "../services1/services1ListingSurfaces";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "Do you create unique copy per industry or reuse blocks?",
    a: "Every sector is powered by AI-informed insights with its own H1, keyword-led modules, and CTA path. Shared components speed delivery, but copy remains vertical-specific, ensuring the message is SEO-optimized and aligned with buyer intent.",
  },
  {
    q: "Can these pages plug into our broader services funnel?",
    a: "Absolutely. Each industry is crafted to deep-link seamlessly to relevant services. Clients land on sector-specific pages, then are guided to productized offers, creating a comfortable, AI-optimized conversation path.",
  },
  {
    q: "How do you handle regulated industries like legal, finance, or healthcare?",
    a: "We craft information that balances compliance and user experience, with connected disclaimers, forms, and peer proof. Our SEO is carefully crafted to be accurate, conservative, and effective for search visibility, ensuring sector pages are safe and professional.",
  },
  {
    q: "Will you help maintain rankings after launch?",
    a: "Yes, we launch with measurement tools, event tracking, and Google Search Console, ensuring the content stays fresh, aligns with buyer intent, and supports your market strategy and SEO performance.",
  },
];

export default function IndustriesPageFAQs({ theme = "dark" }) {
  const isDark = theme === "dark";
  const [open, setOpen] = useState(0);
  const sectionRef = useRef(null);
  const contentRefs = useRef([]);
  const [heights, setHeights] = useState([]);

  useEffect(() => {
    const measure = () => {
      setHeights(faqs.map((_, i) => contentRefs.current[i]?.scrollHeight || 0));
    };
    requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ind-faq-item", {
        opacity: 0,
        y: 28,
        duration: 0.65,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 px-6 sm:px-8 md:px-12 lg:px-16"
      style={isDark ? services1ListingDarkSurface : { background: "#f5e8d1" }}
    >
      <div className="max-w-[900px] mx-auto">
        <h2 className="font-italiana text-[36px] md:text-[52px] leading-tight mb-3 text-[#f3f3f3]">
          FAQs
        </h2>
        <p className="font-merriweather text-[14px] md:text-[16px] text-[#e0d1b6]/85 mb-10">
          Practical questions teams ask before commissioning sector-focused web and SEO work.
        </p>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={faq.q}
                className={`ind-faq-item rounded-xl overflow-hidden border ${
                  isDark ? "bg-[#17382e]/70 border-[#74F5A1]/22" : "bg-white border-[#d8d3c8]"
                }`}
              >
                <button
                  type="button"
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-white/[0.03]"
                  onClick={() => setOpen(isOpen ? -1 : idx)}
                >
                  <span className="font-merriweather text-[14px] md:text-[15px] text-[#f3f3f3]">{faq.q}</span>
                  <span className={`text-[#74F5A1] text-xl transition-transform shrink-0 ${isOpen ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                  style={{
                    maxHeight: isOpen ? `${heights[idx] || 0}px` : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div ref={(el) => (contentRefs.current[idx] = el)}>
                    <p className="px-5 pb-5 font-merriweather text-[14px] leading-[1.8] text-[#e0d1b6]/88">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
