"use client";

import React, { useEffect } from "react";
import Header from "../../../components/dark7/Header";
import Footer from "../../../components/dark7/Footer";
import IndustriesListingHero from "../../../components/industries/IndustriesListingHero";
import IndustriesShowcaseFlow from "../../../components/industries/IndustriesShowcaseFlow";
import IndustriesListingMosaic from "../../../components/industries/IndustriesListingMosaic";
import IndustriesSignalsSection from "../../../components/industries/IndustriesSignalsSection";
import IndustriesPageFAQs from "../../../components/industries/IndustriesPageFAQs";
import IndustriesPageCTA from "../../../components/industries/IndustriesPageCTA";
import "../../../components/dark7/MainPage.css";
import "../../../components/industries/industriesListingDark7.css";

export default function IndustriesPage() {
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
      <IndustriesListingHero theme={theme} />
      <IndustriesShowcaseFlow theme={theme} />
      <IndustriesListingMosaic theme={theme} />
      <IndustriesSignalsSection theme={theme} />
      <IndustriesPageFAQs theme={theme} />
      <IndustriesPageCTA theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}
