"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services1ListingDarkSurface } from "../services1/services1ListingSurfaces";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "Do you create unique copy per industry or reuse blocks?",
    a: "Each of the twenty sector routes has its own H1, keyword-led modules, and CTA paths. Shared components keep the experience fast; the wording is vertical-specific.",
  },
  {
    q: "Can these pages plug into our broader services funnel?",
    a: "Yes. Industry pages can deep-link to relevant /services1 capabilities—so searchers land on sector context, then convert into productized offers.",
  },
  {
    q: "How do you handle regulated industries like legal, finance, or healthcare?",
    a: "We design information architecture for disclaimers, peer proof, and compliant forms while keeping UX friction low. Technical SEO stays conservative and accurate.",
  },
  {
    q: "Will you help maintain rankings after launch?",
    a: "We can ship with measurement (Search Console, events) and an editorial calendar for sector updates—so freshness signals match your go-to-market.",
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
