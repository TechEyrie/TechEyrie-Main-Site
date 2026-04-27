"use client";

import { useEffect, useState } from "react";

import Header from "../../../../../components/icomat1/Header";
import FooterSection from "../../../../../components/icomat1/FooterSection";
import HeroSection from "../../../../../components/icomat1-wordpress-design/HeroSection";
import OurAdvantageSection from "../../../../../components/icomat1-wordpress-design/OurAdvantageSection";
import EndToEndSection from "../../../../../components/icomat1/EndToEndSection";
import CustomersSection from "../../../../../components/icomat1-wordpress-design/CustomerSection";
import UnlockingSection from "../../../../../components/icomat1-wordpress-design/UnlockingSection";
import CTASection from "../../../../../components/icomat1/CTASection";

export default function IcomatWordpressDesignPage() {
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
      <OurAdvantageSection onQuoteClick={() => setQuoteOpen(true)} />
      <EndToEndSection />
      <CustomersSection />
      <UnlockingSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
