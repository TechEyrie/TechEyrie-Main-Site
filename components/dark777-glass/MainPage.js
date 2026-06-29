"use client";

import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import DeepJudge2 from "./DeepJudge2";
import AirvoirSection from "./AirvoirSection";
import AirplaneHero from "./AirplaneSection";
import ThatsTheTechEyrie2 from "./ThatsTheTechEyrie2";
import InfoSectionsCombined from "./InfoSectionsCombined";
import TestimonialsSection from "./TestimonialsSection";
import HeroProblemServicesCombined from "./HeroProblemServicesCombined";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "./MainPage.css";
import "./LuxuryHero.css";
import "./LuxuryPage.css";
import "./GlassHero.css";

const MainPage = () => {
  const [theme] = useState("dark");
  const [enableLenis, setEnableLenis] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      setEnableLenis(window.innerWidth >= 1024);
    };

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
      className="dark2-page dark777-luxury-page dark777-glass-page"
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
