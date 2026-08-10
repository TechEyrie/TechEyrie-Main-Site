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
  DARK7_GRADIENT_DITHER_STYLE,
} from "./dark7PageGradients";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "./MainPage.css";
import HeroProblemServicesCombined from "./HeroProblemServicesCombined";
import {
  initDark7V35LenisScroll,
  destroyDark7V35LenisScroll,
  refreshDark7V35ScrollTriggers,
  markDark7V35ScrollLayoutSettled,
  hasActiveDark7V35Pin,
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
  // (DeepJudge pin, hero scroll morph, etc.) register ScrollTriggers.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 2.69,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.3,
      smoothTouch: false,
      touchMultiplier: 2.6,
    });

    initDark7V35LenisScroll(lenis);
    lenis.scrollTo(0, { immediate: true });

    const onRefresh = () => {
      // Resizing Lenis while a pin is active remaps the scroll range and ejects Airvoir.
      if (hasActiveDark7V35Pin() || lenis.isScrolling) return;
      lenis.resize();
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const onWindowResize = () => {
      if (hasActiveDark7V35Pin() || lenis.isScrolling) return;
      lenis.resize();
      refreshDark7V35ScrollTriggers(false);
    };
    window.addEventListener("resize", onWindowResize);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refreshTimers = [
      window.setTimeout(() => refreshDark7V35ScrollTriggers(true), 100),
      window.setTimeout(() => refreshDark7V35ScrollTriggers(true), 500),
      window.setTimeout(() => {
        refreshDark7V35ScrollTriggers(true);
        // After late layout settles, later hard refreshes become pin-safe.
        markDark7V35ScrollLayoutSettled();
      }, 1200),
    ];

    const onLoad = () => {
      refreshDark7V35ScrollTriggers(true);
      markDark7V35ScrollLayoutSettled();
    };
    window.addEventListener("load", onLoad);

    return () => {
      refreshTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", onWindowResize);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      destroyDark7V35LenisScroll(lenis);
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return (
    <div className="dark2-page dark7-v35-page" style={{ position: "relative", zIndex: 1 }} data-theme={theme}>
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
          <>
            <div
              className="pointer-events-none absolute inset-0 z-0"
              style={DARK7_GRADIENT_NOISE_STYLE}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 z-0"
              style={DARK7_GRADIENT_DITHER_STYLE}
              aria-hidden="true"
            />
          </>
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
