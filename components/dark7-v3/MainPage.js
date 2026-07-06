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
import {
  dark7InfoToAirplaneContainerStyle,
  DARK7_GRADIENT_NOISE_STYLE,
} from "./dark7PageGradients";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "./MainPage.css";
import HeroProblemServicesCombined from "./HeroProblemServicesCombined";
import {
  initDark7V3LenisScroll,
  destroyDark7V3LenisScroll,
  refreshDark7V3ScrollTriggers,
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

    initDark7V3LenisScroll(lenis);
    lenis.scrollTo(0, { immediate: true });

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refreshTimers = [
      window.setTimeout(() => refreshDark7V3ScrollTriggers(true), 100),
      window.setTimeout(() => refreshDark7V3ScrollTriggers(true), 500),
      window.setTimeout(() => refreshDark7V3ScrollTriggers(true), 1200),
    ];

    const onLoad = () => refreshDark7V3ScrollTriggers(true);
    window.addEventListener("load", onLoad);

    return () => {
      refreshTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("load", onLoad);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      destroyDark7V3LenisScroll(lenis);
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
      <TestimonialsSection theme={theme} sharedBackground={theme === "dark"} />
      <div
        className="relative -mt-px"
        style={theme === "dark" ? dark7InfoToAirplaneContainerStyle() : undefined}
      >
        {theme === "dark" && (
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={DARK7_GRADIENT_NOISE_STYLE}
            aria-hidden="true"
          />
        )}
        <div className="relative z-[1]">
          <InfoSectionsCombined theme={theme} sharedBackground={theme === "dark"} />
          <AirplaneHero theme={theme} sharedBackground={theme === "dark"} />
        </div>
      </div>
      <Footer theme={theme} />
    </div>
  );
};

export default MainPage;
