"use client";

import React, { useEffect, useLayoutEffect } from "react";
import Header from "../../../../components/dark7-v52/Header";
import Footer from "../../../../components/dark7/Footer";
import ExpertiseDetailTemplate from "../../../../components/expertiseDetail/ExpertiseDetailTemplate";
import "../../../../components/dark7/MainPage.css";

function scrollExpertisePageToTop() {
  if (typeof window === "undefined") return;
  const behavior =
    "scrollBehavior" in document.documentElement.style ? "auto" : undefined;
  window.scrollTo({ top: 0, left: 0, behavior: behavior || "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function ExpertiseDetailView({ slug }) {
  const theme = "dark";

  useLayoutEffect(() => {
    scrollExpertisePageToTop();
  }, [slug]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    scrollExpertisePageToTop();
    const frame = requestAnimationFrame(() => scrollExpertisePageToTop());
    const timer = window.setTimeout(() => scrollExpertisePageToTop(), 50);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [slug]);

  return (
    <div
      className="dark2-page bg-[#162d24] expertise-detail-route relative z-[1] min-h-screen overflow-x-hidden font-merriweather selection:bg-[#12685b]/35 selection:text-white"
      style={{ position: "relative", zIndex: 1 }}
      data-theme={theme}
    >
      <Header theme={theme} />
      <ExpertiseDetailTemplate slug={slug} theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}
