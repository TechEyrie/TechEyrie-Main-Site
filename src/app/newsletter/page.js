"use client";

import React, { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../../../components/dark7/Header";
import Footer from "../../../components/dark7/Footer";
import "../../../components/dark7/MainPage.css";
import "../../../components/newsletter/newsletterLuxury.css";
import NewsletterSection from "../../../components/newsletter/NewsletterSection";
import TalkToExpertSection from "../../../components/dark7/TalkToExpertSection";

export default function NewsletterPage() {
  const theme = "dark";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      ScrollTrigger.refresh();
    }
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      className="dark2-page newsletter-route relative z-[1] min-h-screen overflow-x-hidden font-merriweather selection:bg-[#12685b]/35 selection:text-white"
      data-theme={theme}
    >
      <Header theme={theme} />
      <main className="relative">
        <NewsletterSection theme={theme} />
        <TalkToExpertSection theme={theme} dark7 />
      </main>
      <Footer theme={theme} />
    </div>
  );
}
