"use client";

import React, { useEffect } from "react";
import Header from "../../../components/dark7/Header";
import Footer from "../../../components/dark7/Footer";
import ServiceAreasHero from "../../../components/serviceAreas/ServiceAreasHero";
import ServiceAreasMarquee from "../../../components/serviceAreas/ServiceAreasMarquee";
import ServiceAreasSpotlight from "../../../components/serviceAreas/ServiceAreasSpotlight";
import ServiceAreasGrid from "../../../components/serviceAreas/ServiceAreasGrid";
import ServiceAreasCTA from "../../../components/serviceAreas/ServiceAreasCTA";
import "../../../components/dark7/MainPage.css";
import "../../../components/serviceAreas/serviceAreasDark7.css";

export default function ServiceAreasPage() {
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
      <ServiceAreasHero />
      <ServiceAreasMarquee />
      <ServiceAreasSpotlight />
      <ServiceAreasGrid />
      <ServiceAreasCTA />
      <Footer theme={theme} />
    </div>
  );
}
