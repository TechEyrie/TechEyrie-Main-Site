"use client";

import { useEffect, useState } from "react";

import Header from "../../../../../components/icomat1/Header";
import FooterSection from "../../../../../components/icomat1/FooterSection";
import HeroSection from "../../../../../components/icomat1-wordpress-maintainance/HeroSection";
import OurAdvantageSection from "../../../../../components/icomat1-wordpress-maintainance/OurAdvantageSection";
import EndToEndSection from "../../../../../components/icomat1/EndToEndSection";
import CustomersSection from "../../../../../components/icomat1-wordpress-maintainance/CustomerSection";
import UnlockingSection from "../../../../../components/icomat1-wordpress-maintainance/UnlockingSection";
import CTASection from "../../../../../components/icomat1/CTASection";
import BenefitsSection from "../../../../../components/icomat1-wordpress-maintainance/BenefitsSection";
import FAQSection from "../../../../../components/icomat1-wordpress-maintainance/FAQSection";
import IcomatSolutionSection from "../../../../../components/icomat1/IcomatSolutionsSection";


export default function IcomatWordpressMaintainancePage() {
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
      <BenefitsSection />
      <EndToEndSection />
      <CustomersSection />
      <UnlockingSection />
      <FAQSection />
      <IcomatSolutionSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
