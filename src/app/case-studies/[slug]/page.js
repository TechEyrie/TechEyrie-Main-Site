"use client";

import { useEffect, useState, use } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../../../../components/dark7/Header";
import Footer from "../../../../components/dark7/Footer";
import InnerHeroSection from "../../../../components/real-case-studies/inner/InnerHeroSection";
import OverviewSection from "../../../../components/real-case-studies/inner/OverviewSection";
import AwardsSection from "../../../../components/real-case-studies/inner/AwardsSection";
import BusinessNeeds from "../../../../components/real-case-studies/inner/BusinessNeeds";
import ChallengesSolutions from "../../../../components/real-case-studies/inner/ChallengesSection";
import ResearchSection from "../../../../components/real-case-studies/inner/ResearchSection";
import DocumentationSection from "../../../../components/real-case-studies/inner/DocumentationSection";
import UXAuditSection from "../../../../components/real-case-studies/inner/UXAuditSection";
import InformationArchitectureSection from "../../../../components/real-case-studies/inner/InformationArchitecture";
import ProductDesignSection from "../../../../components/real-case-studies/inner/ProductDesign";
import DesignDirectionSection from "../../../../components/real-case-studies/inner/DesignDirectionSection";
import UIDesignSection from "../../../../components/real-case-studies/inner/UIDesignSection";
import DesignSystemSection from "../../../../components/real-case-studies/inner/DesignSystemSection";
import KeyProjectSection from "../../../../components/real-case-studies/inner/KeyProjectSection";
import ProductDevelopmentSection from "../../../../components/real-case-studies/inner/ProductDevelopmentSection";
import { fetchWordPressCaseStudyBySlug } from "../../../../utils/wordpress";
import { CASE_STUDIES } from "../../../../components/case-studies/SingleCaseStudy";
import "../../../../components/dark7/MainPage.css";
import "../../../../components/real-case-studies/caseStudiesDark7.css";

export default function CaseStudyDetailPage({ params }) {
  const theme = "dark";
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || resolvedParams;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      ScrollTrigger.refresh();
    }
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    const loadCaseStudy = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const wpCaseStudy = await fetchWordPressCaseStudyBySlug(slug);
        if (wpCaseStudy) {
          setCaseStudy(wpCaseStudy);
        } else {
          setCaseStudy(CASE_STUDIES[slug] || CASE_STUDIES["vitacare"]);
        }
      } catch (error) {
        console.error("Error loading case study:", error);
        setCaseStudy(CASE_STUDIES[slug] || CASE_STUDIES["vitacare"]);
      } finally {
        setLoading(false);
      }
    };
    loadCaseStudy();
  }, [slug]);

  return (
    <div
      className="dark2-page case-studies-route relative z-[1] min-h-screen overflow-x-hidden font-merriweather selection:bg-[#12685b]/35 selection:text-white"
      data-theme={theme}
    >
      <Header theme={theme} />
      <main className="relative case-studies-detail-root">
        {loading ? (
          <div className="flex min-h-screen items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[#74F5A1] border-t-transparent" />
              <p className="mt-6 font-merriweather text-[15px] text-[#c8c2ad]">
                Loading case study…
              </p>
            </div>
          </div>
        ) : (
          <>
            <InnerHeroSection theme={theme} caseStudy={caseStudy} />
            <OverviewSection theme={theme} caseStudy={caseStudy} />
            <AwardsSection theme={theme} caseStudy={caseStudy} />
            <BusinessNeeds theme={theme} caseStudy={caseStudy} />
            <ChallengesSolutions theme={theme} caseStudy={caseStudy} />
            <ResearchSection theme={theme} caseStudy={caseStudy} />
            <DocumentationSection theme={theme} caseStudy={caseStudy} />
            <UXAuditSection theme={theme} caseStudy={caseStudy} />
            <InformationArchitectureSection theme={theme} caseStudy={caseStudy} />
            <ProductDesignSection theme={theme} caseStudy={caseStudy} />
            <DesignDirectionSection theme={theme} caseStudy={caseStudy} />
            <UIDesignSection theme={theme} caseStudy={caseStudy} />
            <DesignSystemSection theme={theme} caseStudy={caseStudy} />
            <KeyProjectSection theme={theme} caseStudy={caseStudy} />
            <ProductDevelopmentSection theme={theme} caseStudy={caseStudy} />
          </>
        )}
      </main>
      <Footer theme={theme} />
    </div>
  );
}
