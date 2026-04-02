
"use client";
import { useEffect, useState } from "react";
import Footer from "../../../components/dark/Footer";
import Header from "../../../components/dark/Header";
import MainCaseStudy from "../../../components/real-case-studies/MainCaseStudy";
import { ScrollTrigger } from "gsap/all";
import { fetchWordPressCaseStudies } from "../../../utils/wordpress";

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

export default function Home() {
    const [theme, setTheme] = useState('light');
    const [projects, setProjects] = useState(DEMO_PROJECTS);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Refresh ScrollTrigger on mount/navigation
    if (typeof window !== 'undefined' && window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
    
    return () => {
      if (typeof window !== 'undefined' && window.ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    // Force ScrollTrigger refresh after theme change
    if (typeof window !== 'undefined' && window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  };

  return (
    <div
      style={{ position: 'relative', zIndex: 1 }}
      data-theme={theme}
      className={theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}
    >
      {/* Theme Toggle Button */}
      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 2v2m0 12v2M4.22 4.22l1.42 1.42m8.72 8.72l1.42 1.42M2 10h2m12 0h2M4.22 15.78l1.42-1.42m8.72-8.72l1.42-1.42"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="10"
              cy="10"
              r="3"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        )}
      </button>
  
    <div>
    <Header theme={theme} />
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#74F5A1]"></div>
            <p className={`mt-4 text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Loading case studies...
            </p>
          </div>
        </div>
      ) : (
        <MainCaseStudy theme={theme} projects={projects} />
      )}
      <Footer theme={theme} />
    </div>
    </div>
  )
}
