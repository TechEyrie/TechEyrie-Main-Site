"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/all";
import Header from "../../../components/dark7/Header";
import Footer from "../../../components/dark7/Footer";
import TestimonialsPageContent from "../../../components/testimonials/TestimonialsPageContent";
import "../../../components/dark7/MainPage.css";

export default function TestimonialsPage() {
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
      className="dark2-page testimonials-route relative z-[1] min-h-screen font-merriweather"
      data-theme={theme}
    >
      <Header theme={theme} />
      <main className="relative">
        <TestimonialsPageContent />
      </main>
      <Footer theme={theme} />
    </div>
  );
}
