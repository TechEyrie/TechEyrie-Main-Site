"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import DeepJudge2 from "./DeepJudge2";
import ThatsTheTechEyrie2 from "./ThatsTheTechEyrie2";
import AirvoirSection from "./AirvoirSection";
import AirplaneHero from "./AirplaneSection";
import InfoSectionsCombined from "./InfoSectionsCombined";
import TestimonialsSection from "./TestimonialsSection";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "./MainPage.css";
import HeroProblemServicesCombined from "./HeroProblemServicesCombined";
import {
  initDark7V2LenisScroll,
  destroyDark7V2LenisScroll,
  refreshDark7V2ScrollTriggers,
} from "./lenisScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MainPage = () => {
  const [theme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.scrollBehavior = "auto";

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    };
  }, []);

  // useLayoutEffect so Lenis + scrollerProxy run before child useLayoutEffects
  // (DeepJudge pin, hero eagle pin, etc.) register ScrollTriggers.
  useLayoutEffect(() => {
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

    initDark7V2LenisScroll(lenis);
    lenis.scrollTo(0, { immediate: true });

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refreshTimers = [
      window.setTimeout(() => refreshDark7V2ScrollTriggers(true), 100),
      window.setTimeout(() => refreshDark7V2ScrollTriggers(true), 500),
      window.setTimeout(() => refreshDark7V2ScrollTriggers(true), 1200),
    ];

    const onLoad = () => refreshDark7V2ScrollTriggers(true);
    window.addEventListener("load", onLoad);

    return () => {
      refreshTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("load", onLoad);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      destroyDark7V2LenisScroll(lenis);
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return (
    <div className="dark2-page" style={{ position: "relative", zIndex: 1 }} data-theme={theme}>
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
