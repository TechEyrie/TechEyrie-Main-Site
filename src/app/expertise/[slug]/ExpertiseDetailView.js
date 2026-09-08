"use client";

import React, { useEffect } from "react";
import Header from "../../../../components/dark7-v52/Header";
import Footer from "../../../../components/dark7/Footer";
import ExpertiseDetailTemplate from "../../../../components/expertiseDetail/ExpertiseDetailTemplate";
import "../../../../components/dark7/MainPage.css";

export default function ExpertiseDetailView({ slug }) {
  const theme = "dark";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

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
