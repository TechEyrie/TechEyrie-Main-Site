"use client";

import { useEffect, useState } from "react";

import Header from "../../../../../components/icomat1/Header";
import FooterSection from "../../../../../components/icomat1/FooterSection";
import HeroSection from "../../../../../components/icomat1-wordpress-hosting/HeroSection";

export default function IcomatWordpressHostingPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  return (
    <div
      data-theme="dark"
      className="icomat1-laygrotesk"
      style={{ backgroundColor: "#162D24", minHeight: "100vh" }}
    >
      <Header quoteOpen={quoteOpen} setQuoteOpen={setQuoteOpen} />
      <HeroSection onQuoteClick={() => setQuoteOpen(true)} />
      <FooterSection />
    </div>
  );
}
