"use client";

import React, { useEffect } from "react";
import Header from "../../../../components/dark7/Header";
import Footer from "../../../../components/dark7/Footer";
import IndustriesDetailTemplate from "../../../../components/industriesDetail/IndustriesDetailTemplate";
import "../../../../components/dark7/MainPage.css";

export default function IndustriesDetailView({ slug }) {
  const theme = "dark";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  return (
    <div
      className="dark2-page bg-[#162d24]"
      style={{ position: "relative", zIndex: 1 }}
      data-theme={theme}
    >
      <Header theme={theme} />
      <IndustriesDetailTemplate slug={slug} theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}
