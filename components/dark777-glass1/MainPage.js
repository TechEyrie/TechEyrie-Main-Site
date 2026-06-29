"use client";

import React, { useState, useEffect } from "react";
import Header from "../dark777-glass/Header";
import Footer from "../dark777-glass/Footer";
import DeepJudge2 from "../dark777-glass/DeepJudge2";
import AirvoirSection from "../dark777-glass/AirvoirSection";
import AirplaneHero from "../dark777-glass/AirplaneSection";
import ThatsTheTechEyrie2 from "../dark777-glass/ThatsTheTechEyrie2";
import InfoSectionsCombined from "../dark777-glass/InfoSectionsCombined";
import TestimonialsSection from "../dark777-glass/TestimonialsSection";
import HeroProblemServicesCombined from "./HeroProblemServicesCombined";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "../dark777-glass/MainPage.css";
import "../dark777-glass/LuxuryHero.css";
import "../dark777-glass/LuxuryPage.css";
import "../dark777-glass/GlassHero.css";

const MainPage = () => {
  const [theme] = useState("dark");
  const [enableLenis, setEnableLenis] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setEnableLenis(window.innerWidth >= 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  useEffect(() => {
    if (!enableLenis || typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, [enableLenis]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 3.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);
    lenis.scrollTo(0, { immediate: true });

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return (
    <div
      className="dark2-page dark777-luxury-page dark777-glass-page dark777-glass1-page"
      style={{ position: "relative", zIndex: 1 }}
      data-theme={theme}
    >
      <Header theme={theme} />
      <HeroProblemServicesCombined theme={theme} />
      <DeepJudge2 theme={theme} />
      <ThatsTheTechEyrie2 theme={theme} />
      <AirvoirSection theme={theme} />
      <TestimonialsSection theme={theme} />
      <InfoSectionsCombined theme={theme} />
      <AirplaneHero theme={theme} />
      <Footer theme={theme} />
    </div>
  );
};

export default MainPage;
