"use client";
import React, { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../../../components/dark7/Header";
import Services2Hero from "../../../components/services2/Services2Hero";
import Services2Industries from "../../../components/services2/Services2Industries";
import Services2Approach from "../../../components/services2/Services2Approach";
import Services2FAQs from "../../../components/services2/Services2FAQs";
import Services2CTA from "../../../components/services2/Services2CTA";
import Footer from "../../../components/dark7/Footer";
import "../../../components/dark7/MainPage.css";
import "../../../components/services1/services1ListingDark7Text.css";

export default function Services1Page() {
  const theme = "dark";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
    return () => {
      if (typeof window !== "undefined" && window.ScrollTrigger) {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    };
  }, []);

  return (
    <div
      className="dark2-page bg-[#162d24]"
      style={{ position: 'relative', zIndex: 1 }}
      data-theme={theme}
    >
      <Header theme={theme} />
      <Services2Hero
        theme={theme}
        dark7
        kicker="Services"
        titleLine1="Unlock potential"
        titleLine2="with our Experts"
        description="At Tech Eyrie, we don't just enter industries—we elevate them by combining luxury UX design, AI automation, and intelligent systems that deliver high-impact solutions aligned with your brand."
      />
      <Services2Industries theme={theme} dark7 />
      <Services2Approach theme={theme} dark7 />
      <Services2FAQs theme={theme} dark7 />
      <Services2CTA theme={theme} dark7 />
      <Footer theme={theme} />
    </div>
  );
}

