"use client";

import React, { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "../../../components/about/Hero";
import MissionSection from "../../../components/about/Mission";
import Values from "../../../components/about/Values";
import Leaders from "../../../components/about/Leaders";
import Investors from "../../../components/about/Investors";
import Backing from "../../../components/about/Backing";
import AdvisoryBoard from "../../../components/about/AdvisoryBoard";
import JoinTeam from "../../../components/about/JoinTeam";
import YardFuture from "../../../components/about/YardFuture";
import Header from "../../../components/dark7/Header";
import Footer from "../../../components/dark7/Footer";
import "../../../components/dark7/MainPage.css";

export default function AboutPage() {
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
      className="dark2-page about-route relative z-[1] min-h-screen w-full overflow-x-hidden font-merriweather selection:bg-[#12685b]/35 selection:text-white"
      data-theme={theme}
    >
      <Header theme={theme} />
      <main className="relative about-page-root">
        <Hero theme={theme} />
        <MissionSection theme={theme} />
        <Values theme={theme} />
        <Leaders theme={theme} />
        <Investors theme={theme} />
        <Backing theme={theme} />
        <AdvisoryBoard theme={theme} />
        <JoinTeam theme={theme} />
        <YardFuture theme={theme} />
      </main>
      <Footer theme={theme} />
    </div>
  );
}
