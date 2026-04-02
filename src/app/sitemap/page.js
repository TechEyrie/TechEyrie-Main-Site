"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Map, ChevronRight, Home, Search } from "lucide-react";
import Header from "../../../components/dark/Header";
import Footer from "../../../components/dark/Footer";
import "../../../components/dark/MainPage.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin();
}

// Sitemap data organized by categories
const SITEMAP_DATA = {
  main: [
    { title: "Home", href: "/", description: "Main landing page" },
    { title: "About", href: "/about", description: "Learn about our company" },
    { title: "Contact", href: "/contact", description: "Get in touch with us" },
    { title: "Contact 1", href: "/contact1", description: "Alternative contact page" },
    { title: "Dark Theme", href: "/dark", description: "Dark theme showcase page" },
  ],
  services: [
    { title: "Services Overview", href: "/services1", description: "All our services" },
    { title: "Services 2", href: "/services2", description: "Alternative services page" },
    { title: "Service Details", href: "/services2/[slug]", description: "Individual service detail pages", isDynamic: true },
    { title: "Content & Creative", href: "/services/content-creative", description: "Content creation services" },
  ],
  expertise: [
    { title: "Expertise Overview", href: "/expertise", description: "Our areas of expertise" },
    { title: "Expertise 1", href: "/expertise1", description: "Alternative expertise page" },
    { title: "Expertise Details", href: "/expertise/[slug]", description: "Individual expertise pages", isDynamic: true },
  ],
  portfolio: [
    { title: "Case Studies", href: "/case-studies", description: "View our case studies" },
    { title: "Case Study Details", href: "/case-studies/[slug]", description: "Individual case study pages", isDynamic: true },
    { title: "Case Studies 1", href: "/case-studies1", description: "Alternative case studies page" },
    { title: "Case Study 1 Details", href: "/case-studies1/[slug]", description: "Individual case study 1 pages", isDynamic: true },
    { title: "Portfolio", href: "/portfolio", description: "View our portfolio" },
    { title: "Showcase", href: "/showcase", description: "Our work showcase" },
    { title: "Work", href: "/work", description: "Our portfolio and work" },
    { title: "Testimonials", href: "/testimonials", description: "Client testimonials" },
  ],
  resources: [
    { title: "Blog", href: "/blog", description: "Read our latest articles" },
    { title: "Blog Post", href: "/blog/[slug]", description: "Individual blog posts", isDynamic: true },
    { title: "Newsletter", href: "/newsletter", description: "Subscribe to our newsletter" },
  ],
  aiAgents: [
    { title: "AI Agents", href: "/ai-agents", description: "Browse AI agents" },
    { title: "AI Agent Details", href: "/ai-agents/[slug]", description: "Individual AI agent pages", isDynamic: true },
  ],
  wordpress: [
    { title: "WordPress Pages", href: "/wordpress-pages", description: "WordPress content pages" },
    { title: "WordPress Page Details", href: "/wordpress-pages/[slug]", description: "Individual WordPress pages", isDynamic: true },
  ],
  tools: [
    { title: "Pricing Calculator", href: "/pricing-calculator", description: "Calculate pricing for services" },
    { title: "GSAP Animation", href: "/gsap-animation", description: "GSAP animation showcase" },
  ],
  special: [
    { title: "Ironhill", href: "/ironhill", description: "Ironhill project page" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/privacy-policy", description: "Privacy policy and data protection" },
    { title: "Terms and Conditions", href: "/terms-and-conditions", description: "Website and services terms" },
  ],
  other: [
    { title: "Sitemap", href: "/sitemap", description: "This page" },
  ],
};

export default function SitemapPage() {
  const [theme, setTheme] = useState("light");
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const searchRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      // Animate search bar
      if (searchRef.current) {
        gsap.from(searchRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
        });
      }

      // Animate sections
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          gsap.from(section, {
            y: 40,
            opacity: 0,
            duration: 0.6,
            delay: 0.4 + index * 0.1,
            ease: "power3.out",
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [theme, searchQuery]);

  const isDark = theme === "dark";

  // Filter pages based on search query
  const filterPages = (pages) => {
    if (!searchQuery) return pages;
    const query = searchQuery.toLowerCase();
    return pages.filter(
      (page) =>
        page.title.toLowerCase().includes(query) ||
        page.description.toLowerCase().includes(query) ||
        page.href.toLowerCase().includes(query)
    );
  };

  // Get all pages for search
  const allPages = Object.values(SITEMAP_DATA).flat();

  // Filter all pages for search results
  const filteredAllPages = searchQuery
    ? allPages.filter(
        (page) =>
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.href.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div
      style={{ position: "relative", zIndex: 1 }}
      data-theme={theme}
      className={isDark ? "bg-[#0a0a0a]" : "bg-white"}
    >
      {/* Theme Toggle Button */}
      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
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

      <Header theme={theme} />

      <main
        ref={containerRef}
        className={`relative min-h-screen py-20 md:py-24 overflow-hidden ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-20 left-10 w-64 h-64 rounded-full ${
              isDark ? "bg-[#74F5A1]/5" : "bg-[#3BC972]/5"
            } blur-3xl animate-pulse`}
          />
          <div
            className={`absolute bottom-20 right-10 w-96 h-96 rounded-full ${
              isDark ? "bg-[#74F5A1]/3" : "bg-[#3BC972]/3"
            } blur-3xl animate-pulse`}
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(${
                isDark ? "#74F5A1" : "#3BC972"
              } 1px, transparent 1px), linear-gradient(90deg, ${
                isDark ? "#74F5A1" : "#3BC972"
              } 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <div
              ref={titleRef}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <Map
                className={`w-8 h-8 md:w-10 md:h-10 ${
                  isDark ? "text-[#74F5A1]" : "text-[#3BC972]"
                }`}
              />
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
                style={{
                  fontFamily: "Fellix, -apple-system, sans-serif",
                }}
              >
                Sitemap
              </h1>
            </div>
            <p
              className={`text-lg md:text-xl max-w-2xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
              style={{
                fontFamily: "Helvetica Now Text, Helvetica, Arial, sans-serif",
              }}
            >
              Navigate through all pages on our website
            </p>
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="mb-12 max-w-2xl mx-auto">
            <div
              className={`relative flex items-center gap-3 px-4 py-3 rounded-[4px] border transition-all ${
                isDark
                  ? "bg-black/40 border-white/20 focus-within:border-[#74F5A1]/50"
                  : "bg-white/80 border-black/20 focus-within:border-[#3BC972]/50"
              }`}
            >
              <Search
                className={`w-5 h-5 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 bg-transparent outline-none ${
                  isDark ? "text-white placeholder-gray-400" : "text-black placeholder-gray-500"
                }`}
                style={{
                  fontFamily: "Helvetica Now Text, Helvetica, Arial, sans-serif",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`text-sm ${
                    isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"
                  }`}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mb-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{
                  fontFamily: "Fellix, -apple-system, sans-serif",
                }}
              >
                Search Results ({filteredAllPages.length})
              </h2>
              <div className="grid gap-4">
                {filteredAllPages.map((page, index) => {
                  const isDynamic = page.isDynamic || page.href.includes("[");
                  const parentHref = isDynamic
                    ? page.href.split("/[")[0]
                    : page.href;

                  if (isDynamic) {
                    return (
                      <div
                        key={`search-${index}`}
                        className={`flex items-center justify-between p-4 rounded-[4px] border ${
                          isDark
                            ? "bg-black/20 border-white/5"
                            : "bg-gray-50 border-black/5"
                        }`}
                      >
                        <div>
                          <h3
                            className="font-semibold mb-1"
                            style={{
                              fontFamily:
                                "Helvetica Now Text, Helvetica, Arial, sans-serif",
                            }}
                          >
                            {page.title}
                            <span
                              className={`ml-2 text-xs px-2 py-0.5 rounded ${
                                isDark
                                  ? "bg-[#74F5A1]/20 text-[#74F5A1]"
                                  : "bg-[#3BC972]/20 text-[#3BC972]"
                              }`}
                            >
                              Dynamic Route
                            </span>
                          </h3>
                          <p
                            className={`text-sm mb-1 ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                            style={{
                              fontFamily:
                                "Helvetica Now Text, Helvetica, Arial, sans-serif",
                            }}
                          >
                            {page.description}
                          </p>
                          <p
                            className={`text-xs mt-1 font-mono ${
                              isDark ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {page.href}
                          </p>
                          <Link
                            href={parentHref}
                            className={`text-xs mt-2 inline-block ${
                              isDark
                                ? "text-[#74F5A1] hover:text-[#5FE08D]"
                                : "text-[#3BC972] hover:text-[#2FA85F]"
                            } underline`}
                          >
                            View parent page →
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={`search-${index}`}
                      href={page.href}
                      className={`group flex items-center justify-between p-4 rounded-[4px] border transition-all ${
                        isDark
                          ? "bg-black/40 border-white/10 hover:bg-black/60 hover:border-[#74F5A1]/30"
                          : "bg-white/80 border-black/10 hover:bg-white hover:border-[#3BC972]/30"
                      }`}
                    >
                      <div>
                        <h3
                          className="font-semibold mb-1"
                          style={{
                            fontFamily:
                              "Helvetica Now Text, Helvetica, Arial, sans-serif",
                          }}
                        >
                          {page.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                          style={{
                            fontFamily:
                              "Helvetica Now Text, Helvetica, Arial, sans-serif",
                          }}
                        >
                          {page.description}
                        </p>
                        <p
                          className={`text-xs mt-1 font-mono ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          {page.href}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sitemap Sections */}
          {!searchQuery &&
            Object.entries(SITEMAP_DATA).map(([category, pages], categoryIndex) => {
              const filteredPages = filterPages(pages);
              if (filteredPages.length === 0) return null;

              const categoryTitles = {
                main: "Main Pages",
                services: "Services",
                expertise: "Expertise",
                portfolio: "Portfolio & Work",
                resources: "Resources",
                aiAgents: "AI Agents",
                wordpress: "WordPress Pages",
                tools: "Tools & Calculators",
                special: "Special Pages",
                legal: "Legal",
                other: "Other",
              };

              return (
                <div
                  key={category}
                  ref={(el) => (sectionsRef.current[categoryIndex] = el)}
                  className="mb-12"
                >
                  <h2
                    className={`text-2xl md:text-3xl font-bold mb-6 pb-3 border-b ${
                      isDark ? "border-white/10" : "border-black/10"
                    }`}
                    style={{
                      fontFamily: "Fellix, -apple-system, sans-serif",
                    }}
                  >
                    {categoryTitles[category]}
                  </h2>
                  <div className="grid gap-3 md:gap-4">
                    {filteredPages.map((page, index) => {
                      const isDynamic = page.isDynamic || page.href.includes("[");
                      const parentHref = isDynamic
                        ? page.href.split("/[")[0]
                        : page.href;

                      if (isDynamic) {
                        return (
                          <div
                            key={`${category}-${index}`}
                            className={`flex items-center justify-between p-4 rounded-[4px] border ${
                              isDark
                                ? "bg-black/20 border-white/5"
                                : "bg-gray-50 border-black/5"
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3
                                  className="font-semibold"
                                  style={{
                                    fontFamily:
                                      "Helvetica Now Text, Helvetica, Arial, sans-serif",
                                  }}
                                >
                                  {page.title}
                                </h3>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded ${
                                    isDark
                                      ? "bg-[#74F5A1]/20 text-[#74F5A1]"
                                      : "bg-[#3BC972]/20 text-[#3BC972]"
                                  }`}
                                >
                                  Dynamic Route
                                </span>
                              </div>
                              <p
                                className={`text-sm mb-1 ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                                style={{
                                  fontFamily:
                                    "Helvetica Now Text, Helvetica, Arial, sans-serif",
                                }}
                              >
                                {page.description}
                              </p>
                              <p
                                className={`text-xs font-mono mb-2 ${
                                  isDark ? "text-gray-500" : "text-gray-400"
                                }`}
                              >
                                {page.href}
                              </p>
                              <Link
                                href={parentHref}
                                className={`text-xs ${
                                  isDark
                                    ? "text-[#74F5A1] hover:text-[#5FE08D]"
                                    : "text-[#3BC972] hover:text-[#2FA85F]"
                                } underline`}
                              >
                                View parent page →
                              </Link>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={`${category}-${index}`}
                          href={page.href}
                          className={`group flex items-center justify-between p-4 rounded-[4px] border transition-all ${
                            isDark
                              ? "bg-black/40 border-white/10 hover:bg-black/60 hover:border-[#74F5A1]/30"
                              : "bg-white/80 border-black/10 hover:bg-white hover:border-[#3BC972]/30"
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className="font-semibold"
                                style={{
                                  fontFamily:
                                    "Helvetica Now Text, Helvetica, Arial, sans-serif",
                                }}
                              >
                                {page.title}
                              </h3>
                            </div>
                            <p
                              className={`text-sm mb-1 ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                              style={{
                                fontFamily:
                                  "Helvetica Now Text, Helvetica, Arial, sans-serif",
                              }}
                            >
                              {page.description}
                            </p>
                            <p
                              className={`text-xs font-mono ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              {page.href}
                            </p>
                          </div>
                          <ChevronRight
                            className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {/* Stats Footer */}
          <div
            className={`mt-16 pt-8 border-t text-center ${
              isDark ? "border-white/10 text-gray-400" : "border-black/10 text-gray-500"
            }`}
          >
            <p
              className="text-sm"
              style={{
                fontFamily: "Helvetica Now Text, Helvetica, Arial, sans-serif",
              }}
            >
              Total Pages: {allPages.length} | Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>

      <Footer theme={theme} />
    </div>
  );
}

