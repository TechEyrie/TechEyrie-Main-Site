"use client";

import React, { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../../../components/dark7/Header";
import Footer from "../../../components/dark7/Footer";
import Services1Hero from "../../../components/services1/Services1Hero";
import Services1MainServices from "../../../components/services1/Services1MainServices";
import Services1ServiceDetails from "../../../components/services1/Services1ServiceDetails";
import Services1CTASection from "../../../components/services1/Services1CTASection";
import "../../../components/dark7/MainPage.css";
import "../../../components/services1/services1ListingDark7Text.css";

export default function ExpertisePage() {
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
      className="dark2-page expertise-route relative z-[1] min-h-screen overflow-x-hidden font-merriweather selection:bg-[#12685b]/35 selection:text-white"
      data-theme={theme}
    >
      <Header theme={theme} />
      <main className="relative expertise-page-root">
        <Services1Hero theme={theme} dark7 kicker="Expertise" />
        <Services1MainServices theme={theme} dark7 />
        <Services1ServiceDetails theme={theme} dark7 />
        <Services1CTASection theme={theme} dark7 />
      </main>
      <Footer theme={theme} />
    </div>
  );
}
