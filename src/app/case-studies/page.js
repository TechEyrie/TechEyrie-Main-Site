"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../../../components/dark7/Header";
import Footer from "../../../components/dark7/Footer";
import MainCaseStudy from "../../../components/real-case-studies/MainCaseStudy";
import { fetchWordPressCaseStudies } from "../../../utils/wordpress";
import "../../../components/dark7/MainPage.css";
import "../../../components/real-case-studies/caseStudiesDark7.css";

// Demo case studies data (fallback) - matches MainCaseStudy component structure
const DEMO_PROJECTS = [
  {
    id: 1,
    title: "Isora – optimizing governance, risk & compliance for top institutions",
    category: "web-app",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    tags: ["#UX AUDIT", "#PRODUCT REDESIGN", "#WEB DEVELOPMENT", "#TEAM EXTENTION"],
    badges: [
      { label: "SALTYCLOUD", flag: false },
      { label: "TEXAS, USA", flag: "🇺🇸" },
    ],
    techStack: "React, Python, AWS",
    timeline: "12 months, ongoing",
    results: [
      "2x faster user workflows",
      "50% shorter time-to-market",
      "Nominated for UX Design Award 2024",
    ],
    testimonial: {
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
      name: "Izek Lal",
      position: "Country manager",
      quote: "We have seen a significant improvement in terms of mobile friendliness and the general flow of the system. I believe this has contributed significantly to the growth of our business. Many thanks, Phenomenon.",
    },
    buttonText: "EXPLORE",
    buttonLink: "/case-studies/1",
  },
  {
    id: 2,
    title: "Mobile Banking App",
    category: "mobile-app",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
    tags: ["#MOBILE", "#FINTECH", "#UX DESIGN"],
    badges: [
      { label: "FINTECH CO", flag: false },
      { label: "NEW YORK, USA", flag: "🇺🇸" },
    ],
    techStack: "React Native, Node.js, Firebase",
    timeline: "8 months",
    results: [
      "3x increase in user engagement",
      "4.8 star rating on app stores",
      "Featured by Apple",
    ],
    buttonText: "VIEW PROJECT",
    buttonLink: "/case-studies/2",
  },
  {
    id: 3,
    title: "E-Commerce Platform Revolution",
    category: "web-app",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    tags: ["#E-COMMERCE", "#FULL-STACK", "#PAYMENT INTEGRATION"],
    badges: [
      { label: "SHOPIFY PLUS", flag: false },
      { label: "LONDON, UK", flag: "🇬🇧" },
    ],
    techStack: "Next.js, Stripe, PostgreSQL",
    timeline: "10 months",
    results: [
      "5x increase in conversion rate",
      "200% revenue growth",
      "Best E-Commerce Site 2025",
    ],
    testimonial: {
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      name: "Marcus Chen",
      position: "CEO & Founder",
      quote: "The team delivered beyond our expectations. The platform's performance and user experience are exceptional. Our revenue has tripled since launch.",
    },
    buttonText: "VIEW CASE",
    buttonLink: "/case-studies/3",
  },
];

export default function CaseStudiesListingPage() {
  const theme = "dark";
  const [projects, setProjects] = useState(DEMO_PROJECTS);
  const [loading, setLoading] = useState(true);

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
    // Fetch WordPress case studies
    const loadCaseStudies = async () => {
      setLoading(true);
      try {
        const wpCaseStudies = await fetchWordPressCaseStudies();
        
        if (wpCaseStudies && wpCaseStudies.length > 0) {
          // Transform WordPress data to match demo format
          const transformed = wpCaseStudies.map((cs, index) => ({
            id: cs.id || index + 1,
            title: cs.title,
            category: cs.category || 'web-app',
            image: cs.image,
            tags: cs.tags || [],
            badges: cs.badges || [],
            techStack: cs.techStack || '',
            timeline: cs.timeline || '',
            results: cs.results || [],
            testimonial: cs.testimonial || null,
            buttonText: cs.buttonText || 'VIEW PROJECT',
            buttonLink: cs.buttonLink || `/case-studies/${cs.slug}`,
            wordpressUrl: cs.wordpressUrl || '',
            slug: cs.slug, // Include slug for drawer fetching
          }));
          setProjects(transformed);
        } else {
          // Fallback to demo data
          console.log('No WordPress case studies found, using demo data');
          setProjects(DEMO_PROJECTS);
        }
      } catch (error) {
        console.error('Error loading case studies:', error);
        // Fallback to demo data on error
        setProjects(DEMO_PROJECTS);
      } finally {
        setLoading(false);
      }
    };

    loadCaseStudies();
  }, []);

  return (
    <div
      className="dark2-page case-studies-route relative z-[1] min-h-screen overflow-x-hidden font-merriweather selection:bg-[#12685b]/35 selection:text-white"
      data-theme={theme}
    >
      <Header theme={theme} />
      <main className="relative case-studies-page-root">
        {loading ? (
          <div className="flex min-h-screen items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[#74F5A1] border-t-transparent" />
              <p className="mt-6 font-merriweather text-[15px] text-[#c8c2ad]">
                Loading case studies…
              </p>
            </div>
          </div>
        ) : (
          <MainCaseStudy theme={theme} projects={projects} />
        )}
      </main>
      <Footer theme={theme} />
    </div>
  );
}
