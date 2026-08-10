"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import QuoteDrawer from "./QuoteDrawer";
import { getDark7V40ScrollTop } from "./lenisScrollTrigger";

const navItems = [
  { label: "Services", hasDropdown: true, type: "mega", href: "/services1" },
  { label: "Expertise", hasDropdown: true, type: "mega", href: "/expertise" },
  { label: "Cases", hasDropdown: false, href: "/case-studies" },
  { label: "Blog", hasDropdown: false, href: "/blog" },
  { label: "Industry", hasDropdown: false, href: "/industries" },
  { label: "About", hasDropdown: false, href: "/about" },
];

const SERVICES_ROW_1 = [
  {
    id: "content",
    title: "Content & Creative",
    description: "We'll make your prospects stop scrolling.",
    href: "/services/content-creative",
  },
  {
    id: "paid",
    title: "Paid Media & Performance",
    description: "Build, optimize and scale your performance marketing.",
    href: "/services/paid-media",
  },
  {
    id: "data",
    title: "Data & Measurement",
    description: "We make the invisible visible.",
    href: "/services/data-measurement",
  },
  {
    id: "services1",
    title: "Services",
    description: "Global qualitative research services.",
    href: "/services1",
  },
];

const SERVICES_ROW_2 = [
  {
    id: "demand-team",
    title: "Demand Team",
    description: "Your dedicated demand generation team.",
    href: "/services/demand-team",
  },
  {
    id: "demand-agency",
    title: "Demand Gen Agency",
    description: "Full-service demand generation partnership.",
    href: "/services/demand-gen-agency",
  },
];

const EXPERTISE_ITEMS = [
  {
    id: "b2b-saas",
    title: "B2B SaaS",
    description:
      "Specialized marketing strategies for SaaS companies looking to scale.",
    href: "/expertise/b2b-saas",
  },
  {
    id: "b2b-service",
    title: "B2B Service",
    description: "Drive demand for your professional services business.",
    href: "/expertise/b2b-service",
  },
  {
    id: "b2b-hardware",
    title: "B2B Hardware",
    description:
      "Marketing solutions for hardware and equipment manufacturers.",
    href: "/expertise/b2b-hardware",
  },
];

// Contact Form Popup Component
function ContactPopup({ isOpen, onClose, type }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="dark7-quote-popup bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className="font-italiana font-light text-[24px] md:text-[32px] tracking-[-0.03em] mb-4 text-gray-900">
          {type === "contact" ? "Talk to Us" : "Get a Quote"}
        </h2>
        <p className="font-merriweather text-[14px] text-gray-600 mb-6">
          {type === "contact"
            ? "Let's discuss your project"
            : "Tell us about your requirements"}
        </p>

        <form className="space-y-4">
          <div>
            <label className="block font-merriweather text-[13px] font-semibold tracking-[0.16em] uppercase text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-merriweather text-[14px]"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block font-merriweather text-[13px] font-semibold tracking-[0.16em] uppercase text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-merriweather text-[14px]"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block font-merriweather text-[13px] font-semibold tracking-[0.16em] uppercase text-gray-700 mb-1">
              Message
            </label>
            <textarea
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-merriweather text-[14px]"
              placeholder="Tell us about your project..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#013825] text-white py-3 rounded-lg font-merriweather text-[14px] font-semibold hover:bg-[#024d33] transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

const MOBILE_SERVICE_LINKS = [...SERVICES_ROW_1, ...SERVICES_ROW_2];

function ChevronIcon({ open, color }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M1 1L5 5L9 1"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header({ theme = "light" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isCompactNav, setIsCompactNav] = useState(false);
  const lastScrollYRef = useRef(0);
  const [contactPopupOpen, setContactPopupOpen] = useState(false);
  const [quotePopupOpen, setQuotePopupOpen] = useState(false);

  useEffect(() => {
    const openQuoteDrawer = () => setQuotePopupOpen(true);
    window.addEventListener("open-quote-drawer", openQuoteDrawer);
    return () => window.removeEventListener("open-quote-drawer", openQuoteDrawer);
  }, []);

  // Triangle animation effects - only for light theme (original)
  // const [triangles, setTriangles] = useState([]);
  // const triangleIdRef = useRef(0);

  // Refs for Get a Quote button animation
  const getQuoteBtnRef = useRef(null);
  const getQuoteOverlayRef = useRef(null);
  const faceIconRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const smileRef = useRef(null);
  const faceContainerRef = useRef(null);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, []);

  // Hide header on scroll down; on scroll up show compact nav (no logo) outside hero
  useEffect(() => {
    const updateHeaderOnScroll = () => {
      if (mobileOpen) return;

      const currentScrollY = getDark7V40ScrollTop();
      const lastScrollY = lastScrollYRef.current;
      const heroEl = document.querySelector(".dark7-v40-hero");
      const inHero = heroEl
        ? heroEl.getBoundingClientRect().bottom > 100
        : currentScrollY < window.innerHeight;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
        setIsCompactNav(!inHero && currentScrollY > 10);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsCompactNav(false);
        setActiveDropdown(null);
      } else if (currentScrollY > 10) {
        setIsCompactNav(!inHero);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("dark7-v40-scroll", updateHeaderOnScroll);
    window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
    updateHeaderOnScroll();

    return () => {
      window.removeEventListener("dark7-v40-scroll", updateHeaderOnScroll);
      window.removeEventListener("scroll", updateHeaderOnScroll);
    };
  }, [mobileOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const handleMouseEnter = (label) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setHoveredCard(null);
    }, 180);
  };

  // const createTriangle = useCallback(
  //   (x, y) => {
  //     if (theme === "light") {
  //       const id = triangleIdRef.current++;
  //       const size = Math.random() * 5 + 8;
  //       const rotation = Math.random() * 360;
  //       const greenShades = ["#013825", "#295E4C", "#9E8F72", "#CEC8B0"];
  //       const color =
  //         greenShades[Math.floor(Math.random() * greenShades.length)];

  //       const newTriangle = {
  //         id,
  //         x,
  //         y,
  //         size,
  //         rotation,
  //         color,
  //       };

  //       setTriangles((prev) => [...prev, newTriangle]);

  //       setTimeout(() => {
  //         setTriangles((prev) => prev.filter((t) => t.id !== id));
  //       }, 800);
  //     }
  //   },
  //   [theme]
  // );

  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     if (activeDropdown && theme === "light") {
  //       const dropdown = document.querySelector(
  //         `[data-dropdown="${activeDropdown}"]`
  //       );
  //       if (dropdown) {
  //         const rect = dropdown.getBoundingClientRect();
  //         if (
  //           e.clientX >= rect.left &&
  //           e.clientX <= rect.right &&
  //           e.clientY >= rect.top &&
  //           e.clientY <= rect.bottom
  //         ) {
  //           const x = e.clientX - rect.left;
  //           const y = e.clientY - rect.top;
  //           createTriangle(x, y);
  //         }
  //       }
  //     }
  //   };

  //   let lastTime = 0;
  //   const throttleDelay = 80;

  //   const throttledMouseMove = (e) => {
  //     const currentTime = Date.now();
  //     if (currentTime - lastTime < throttleDelay) return;
  //     lastTime = currentTime;
  //     handleMouseMove(e);
  //   };

  //   document.addEventListener("mousemove", throttledMouseMove);

  //   return () => {
  //     document.removeEventListener("mousemove", throttledMouseMove);
  //     if (dropdownTimeoutRef.current) {
  //       clearTimeout(dropdownTimeoutRef.current);
  //     }
  //   };
  // }, [activeDropdown, createTriangle, theme]);

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // GSAP animation for Get a Quote button
  useEffect(() => {
    const btn = getQuoteBtnRef.current;
    const overlay = getQuoteOverlayRef.current;
    const leftEye = leftEyeRef.current;
    const rightEye = rightEyeRef.current;
    const smile = smileRef.current;
    const faceContainer = faceContainerRef.current;
    const faceIcon = faceIconRef.current;

    if (!btn || !overlay) return;

    gsap.set(overlay, {
      scaleY: 0,
      transformOrigin: "bottom center",
    });

    if (faceContainer) {
      gsap.set(faceContainer, {
        rotation: 0,
        transformOrigin: "center center",
      });
    }

    const handleGlobalMouseMove = (e) => {
      try {
        const fc = faceContainerRef.current;
        const fi = faceIconRef.current;
        if (!fc || !fi) return;
        const rect = fi.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      const limitedAngle = Math.max(-25, Math.min(25, angle));
      
      gsap.to(fc, {
        rotation: limitedAngle,
        duration: 0.4,
        ease: "power2.out",
      });

      if (leftEye && rightEye) {
        const eyeOffset = Math.max(-2, Math.min(2, deltaX * 0.1));
        
        gsap.to(leftEye, {
          x: eyeOffset,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(rightEye, {
          x: eyeOffset,
          duration: 0.3,
          ease: "power2.out",
        });
      }
      } catch (_) {
        // Guard: refs may be null during navigation/unmount
      }
    };

    const handleMouseEnter = () => {
      gsap.to(overlay, {
        scaleY: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      if (leftEye && rightEye) {
        gsap.to([leftEye, rightEye], {
          scale: 1.2,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      }

      if (smile) {
        gsap.to(smile, {
          scaleY: 1.3,
          scaleX: 1.1,
          transformOrigin: "center center",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(overlay, {
        scaleY: 0,
        duration: 0.4,
        ease: "power2.out",
      });

      if (leftEye && rightEye) {
        gsap.to([leftEye, rightEye], {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (smile) {
        gsap.to(smile, {
          scaleY: 1,
          scaleX: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    btn.addEventListener("mouseenter", handleMouseEnter);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      btn.removeEventListener("mouseenter", handleMouseEnter);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Color Palettes
  const lightColors = {
    primary: "#013825",
    secondary: "#9E8F72",
    tertiary: "#CEC8B0",
    background: "#F9F7F0",
    text: "#111111",
    hoverBg: "#E8E8E8",
  };

  const darkColors = {
    primary: "#74F5A1",
    secondary: "#5FE08D",
    tertiary: "#3BC972",
    background: "#1A1A1A",
    text: "#FFFFFF",
    hoverBg: "rgba(255, 255, 255, 0.1)",
    navPillBg: "rgb(247 243 240 / 6%)",
    navPillHoverBg: "rgb(247 243 240 / 12%)",
    dropdownBg: "#162D24",
    dropdownCardBg: "rgb(247 243 240 / 6%)",
    dropdownCardHoverBg: "rgb(247 243 240 / 16%)",
    arrowBg: "#162D24",
    arrowBgHover: "#F7F3F0",
  };

  // Theme-based styles
  const headerBg = theme === "dark" ? darkColors.navPillBg : lightColors.tertiary;
  const textColor = theme === "dark" ? darkColors.text : lightColors.text;
  const hoverBg = theme === "dark" ? darkColors.navPillHoverBg : lightColors.hoverBg;
  const dropdownBg = theme === "dark" ? darkColors.dropdownBg : lightColors.tertiary;
  const dropdownBorder =
    theme === "dark" ? "rgba(247, 243, 240, 0.12)" : "rgba(0, 0, 0, 0.06)";
  const cardBg = theme === "dark" ? darkColors.dropdownCardBg : lightColors.background;
  const cardHoverBg =
    theme === "dark" ? darkColors.dropdownCardHoverBg : lightColors.hoverBg;
  const cardText = theme === "dark" ? "#F7F3F0" : lightColors.text;
  const cardDesc = theme === "dark" ? "rgba(247, 243, 240, 0.75)" : "#444444";
  const arrowStroke = theme === "dark" ? "#F7F3F0" : "#111111";
  const arrowStrokeHover = theme === "dark" ? "#162D24" : "#74F5A1";
  const arrowBtnClass =
    theme === "dark"
      ? "dark7-v40-header-arrow-btn"
      : "bg-[#74F5A1] group-hover:bg-black";
  const navPillBg = isCompactNav
    ? "#162D24"
    : theme === "dark"
      ? darkColors.navPillBg
      : headerBg;
  const navPillBorder = isCompactNav
    ? "1px solid rgba(247, 243, 240, 0.12)"
    : theme === "dark"
      ? "1px solid rgba(247, 243, 240, 0.12)"
      : "none";
  const mobilePanelBg = theme === "dark" ? darkColors.background : lightColors.tertiary;
  const mobilePanelText = theme === "dark" ? darkColors.text : lightColors.text;
  const mobileBorder =
    theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";

  return (
    <>
      <style jsx global>{`
        @keyframes triangle-fade {
          0% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }

        .animate-triangle-fade {
          animation: triangle-fade 0.8s ease-out forwards;
        }

        /* Mobile menu button animation */
        .mobile-menu-btn span {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Card hover — keep transitions on shadow/color only so grid expand stays smooth */
        .dropdown-card {
          transition:
            box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1),
            background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
            border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 0;
        }

        .dark7-v40-header-arrow-btn {
          background-color: #162d24;
          transition:
            background-color 0.5s ease,
            transform 0.5s ease;
        }

        .group:hover .dark7-v40-header-arrow-btn,
        .dropdown-card:hover .dark7-v40-header-arrow-btn {
          background-color: #f7f3f0;
        }

        /* Get a Quote button overlay */
        .get-quote-btn {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .get-quote-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #74F5A1;
          z-index: 0;
          pointer-events: none;
          border-radius: 14px;
        }

        .get-quote-btn-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>

      {/* Contact Popups */}
      <ContactPopup
        isOpen={contactPopupOpen}
        onClose={() => setContactPopupOpen(false)}
        type="contact"
      />
      <QuoteDrawer open={quotePopupOpen} onClose={() => setQuotePopupOpen(false)} />

      <header
        className={`fixed left-0 right-0 top-0 z-[80] w-full max-w-full min-w-0 overflow-visible antialiased transition-transform duration-300 ${
          isCompactNav ? "dark7-v40-header--compact" : ""
        } ${
          mobileOpen ? "flex h-dvh max-h-dvh flex-col overflow-hidden lg:block lg:h-auto lg:max-h-none lg:overflow-visible" : ""
        }`}
        style={{
          transform: isVisible || mobileOpen ? "translateY(0)" : "translateY(-150%)",
          backgroundColor:
            mobileOpen && theme === "dark"
              ? "#162d24"
              : mobileOpen
                ? lightColors.background
                : "transparent",
        }}
      >
        {/* Top bar */}
        <div
          className={`mx-auto flex w-full min-w-0 max-w-[1800px] shrink-0 items-center gap-3 px-5 py-3.5 sm:px-6 lg:px-8 lg:py-3 ${
            isCompactNav ? "justify-end" : "justify-between"
          } ${mobileOpen ? "border-b border-white/10 lg:border-b-0" : ""}`}
        >
          <Link
            href="/dark7"
            className={`flex min-w-0 shrink-0 items-center transition-all duration-300 ${
              isCompactNav && !mobileOpen
                ? "pointer-events-none w-0 min-w-0 overflow-hidden opacity-0"
                : ""
            }`}
          >
            <div className="relative flex h-12 w-auto sm:h-[52px] lg:h-[86px] items-center justify-center">
              <Image
                src="/logo/techeyrie_logo.png"
                alt="TechEyrie Logo"
                width={172}
                height={172}
                className="h-full w-auto max-w-[148px] sm:max-w-[168px] lg:max-w-none object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop nav + CTAs */}
          <div className="hidden min-w-0 items-center gap-3 lg:flex">
            <div
              className="dark7-v40-header-nav-pill flex h-[45px] items-center gap-4 rounded-[14px] px-4 lg:px-5 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
              style={{
                backgroundColor: navPillBg,
                border: navPillBorder,
              }}
            >
              {/* Desktop NAV */}
              <nav className="flex h-full items-center gap-1 lg:gap-1.5">
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative flex h-full items-center"
                    onMouseEnter={() =>
                      item.hasDropdown && handleMouseEnter(item.label)
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="dark7-v40-header-nav-link flex h-full items-center gap-1.5 rounded-[8px] px-3.5 lg:px-4 font-merriweather text-[13px] font-light leading-none tracking-[0.04em] transition-all duration-200 cursor-pointer"
                        style={{
                          color: theme === "dark" ? "#F7F3F0" : textColor,
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = hoverBg;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <span>{item.label}</span>
                        {item.hasDropdown && (
                          <svg
                            width="9"
                            height="5"
                            viewBox="0 0 10 6"
                            aria-hidden="true"
                            className={`transition-transform duration-300 ${
                              activeDropdown === item.label ? "rotate-180" : ""
                            }`}
                          >
                            <path
                              d="M1 1L5 5L9 1"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="dark7-v40-header-nav-link flex h-full items-center gap-1.5 rounded-[8px] px-3.5 lg:px-4 font-merriweather text-[13px] font-light leading-none tracking-[0.04em] transition-all duration-200 cursor-pointer"
                        style={{
                          color: theme === "dark" ? "#F7F3F0" : textColor,
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = hoverBg;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <span>{item.label}</span>
                        {item.hasDropdown && (
                          <svg
                            width="9"
                            height="5"
                            viewBox="0 0 10 6"
                            aria-hidden="true"
                            className={`transition-transform duration-300 ${
                              activeDropdown === item.label ? "rotate-180" : ""
                            }`}
                          >
                            <path
                              d="M1 1L5 5L9 1"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </nav>

              {/* Desktop CTA */}
              <div className="flex h-full flex-shrink-0 items-center pl-2">
                {/* Talk to us Button */}
                <button
                  onClick={() => setContactPopupOpen(true)}
                  className="dark7-v40-header-nav-link group flex h-full cursor-pointer items-center gap-2"
                >
                  <span
                    className="font-merriweather text-[13px] font-light leading-none tracking-[0.04em]"
                    style={{ color: theme === "dark" ? "#F7F3F0" : textColor }}
                  >
                    Talk to us
                  </span>

                  <span
                    className={`relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-[4px] transition-colors duration-500 ${arrowBtnClass}`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 14 14"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 13L13 1M13 1H5M13 1V9"
                          fill="none"
                          stroke={arrowStroke}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center translate-x-[-10px] translate-y-[10px] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 14 14"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 13L13 1M13 1H5M13 1V9"
                          fill="none"
                          stroke={arrowStrokeHover}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <button
              ref={getQuoteBtnRef}
              onClick={() => setQuotePopupOpen(true)}
              className="dark7-v40-header-quote-btn get-quote-btn group flex h-[45px] flex-shrink-0 items-center gap-2 rounded-[14px] px-5 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
              style={{
                backgroundColor: navPillBg,
                border: navPillBorder,
              }}
            >
              <div
                ref={getQuoteOverlayRef}
                className="get-quote-overlay"
                style={{
                  backgroundColor: navPillBg,
                }}
              />
              <div className="get-quote-btn-content">
                <span
                  className="font-merriweather text-[13px] font-light leading-none tracking-[0.04em]"
                  style={{ color: theme === "dark" ? "#F7F3F0" : textColor }}
                >
                  Get a quote
                </span>
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileOpen((o) => {
                if (o) setMobileExpanded(null);
                return !o;
              });
            }}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            className="mobile-menu-btn flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border transition-colors lg:hidden"
            style={{
              borderColor:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(0, 0, 0, 0.1)",
              backgroundColor: theme === "dark" ? "#1A1A1A" : headerBg,
              color: textColor,
            }}
          >
            <div className="relative h-4 w-5">
              <span
                className={`absolute left-0 h-[2px] w-full rounded transition-all duration-300 ${
                  mobileOpen ? "top-1/2 translate-y-[-50%] rotate-45" : "top-0"
                }`}
                style={{ backgroundColor: textColor }}
              />
              <span
                className={`absolute left-0 h-[2px] w-full rounded transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : "top-1/2 -translate-y-1/2"
                }`}
                style={{ backgroundColor: textColor }}
              />
              <span
                className={`absolute left-0 h-[2px] w-full rounded transition-all duration-300 ${
                  mobileOpen ? "top-1/2 translate-y-[-50%] -rotate-45" : "bottom-0"
                }`}
                style={{ backgroundColor: textColor }}
              />
            </div>
          </button>
        </div>

        {mobileOpen && (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-10 pt-4 sm:px-6 lg:hidden">
            <nav>
              {navItems.map((item) => {
                const isExpanded = mobileExpanded === item.label;

                if (item.hasDropdown) {
                  const subLinks =
                    item.label === "Services"
                      ? MOBILE_SERVICE_LINKS
                      : EXPERTISE_ITEMS;

                  return (
                    <div
                      key={item.label}
                      className={`border-b ${theme === "dark" ? "border-white/10" : "border-black/10"}`}
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between py-4 text-left font-italiana text-[26px] leading-none tracking-tight transition-colors sm:text-[28px]"
                        style={{ color: mobilePanelText }}
                        onClick={() =>
                          setMobileExpanded(isExpanded ? null : item.label)
                        }
                      >
                        <span>{item.label}</span>
                        <ChevronIcon open={isExpanded} color={mobilePanelText} />
                      </button>

                      {isExpanded && (
                        <div className="space-y-1 pb-4 pl-1">
                          {item.href && (
                            <Link
                              href={item.href}
                              className="block py-2 font-merriweather text-[14px] font-semibold"
                              style={{ color: theme === "dark" ? "#74F5A1" : lightColors.primary }}
                              onClick={closeMobileMenu}
                            >
                              View all {item.label}
                            </Link>
                          )}
                          {subLinks.map((link) => (
                            <Link
                              key={link.id}
                              href={link.href}
                              className="block py-2 font-merriweather text-[14px] leading-snug"
                              style={{ color: cardDesc }}
                              onClick={closeMobileMenu}
                            >
                              {link.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center border-b py-4 font-italiana text-[26px] leading-none tracking-tight transition-colors sm:text-[28px] ${theme === "dark" ? "border-white/10" : "border-black/10"}`}
                    style={{ color: mobilePanelText }}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3 pt-8">
              <button
                type="button"
                onClick={() => {
                  setContactPopupOpen(true);
                  closeMobileMenu();
                }}
                className="group flex w-full items-center justify-between rounded-[12px] px-4 py-3.5 font-merriweather text-[15px] font-semibold"
                style={{
                  color: mobilePanelText,
                  backgroundColor: theme === "dark" ? "#1A1A1A" : lightColors.background,
                  border: `1px solid ${mobileBorder}`,
                }}
              >
                <span>Talk to us</span>
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-[4px] ${arrowBtnClass}`}
                >
                  <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                      d="M1 13L13 1M13 1H5M13 1V9"
                      fill="none"
                      stroke={arrowStroke}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setQuotePopupOpen(true);
                  closeMobileMenu();
                }}
                className="group flex w-full items-center justify-between rounded-[12px] px-4 py-3.5 font-merriweather text-[15px] font-semibold"
                style={{
                  color: "#ffffff",
                  backgroundColor: "#12685b",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span>Get a quote</span>
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-[4px] ${arrowBtnClass}`}
                >
                  <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                      d="M1 13L13 1M13 1H5M13 1V9"
                      fill="none"
                      stroke={arrowStroke}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        )}

        {/* MEGA MENU DROPDOWN - Services */}
        <div
          data-dropdown="Services"
          className={`dark7-v40-mega-menu hidden lg:block absolute left-0 right-0 top-full z-[90] -mt-4 pt-1 transition-all duration-300 ${
            activeDropdown === "Services"
              ? "opacity-100 translate-y-0 pointer-events-auto visible"
              : "opacity-0 -translate-y-2 pointer-events-none invisible"
          }`}
          onMouseEnter={() => handleMouseEnter("Services")}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex justify-center px-2 md:px-4">
            <div
              className="relative w-full max-w-[960px] rounded-[14px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
              style={{
                backgroundColor: dropdownBg,
                border: `1px solid ${dropdownBorder}`,
              }}
            >
              {/* Triangle animations - only for light theme */}
              {/* {theme === "light" &&
                triangles.map((triangle) => (
                  <div
                    key={triangle.id}
                    className="pointer-events-none absolute animate-triangle-fade"
                    style={{
                      left: `${triangle.x}px`,
                      top: `${triangle.y}px`,
                      width: "0",
                      height: "0",
                      borderLeft: `${triangle.size / 2}px solid transparent`,
                      borderRight: `${triangle.size / 2}px solid transparent`,
                      borderBottom: `${triangle.size}px solid ${triangle.color}`,
                      transform: `translate(-50%, -50%) rotate(${triangle.rotation}deg)`,
                      opacity: 0.7,
                    }}
                  />
                ))} */}

              {/* Row 1: 4 Cards */}
              <div
                className="grid gap-4 mb-4 transition-all duration-500 ease-out"
                style={{
                  gridTemplateColumns:
                    hoveredCard === "content"
                      ? "1.28fr 0.86fr 0.86fr 0.86fr"
                      : hoveredCard === "paid"
                      ? "0.86fr 1.28fr 0.86fr 0.86fr"
                      : hoveredCard === "data"
                      ? "0.86fr 0.86fr 1.28fr 0.86fr"
                      : hoveredCard === "services1"
                      ? "0.86fr 0.86fr 0.86fr 1.28fr"
                      : "1fr 1fr 1fr 1fr",
                }}
              >
                {SERVICES_ROW_1.map((service) => (
                  <Link
                    key={service.id}
                    href={service.href}
                    onMouseEnter={() => setHoveredCard(service.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="dropdown-card group relative flex min-h-[180px] min-w-0 cursor-pointer flex-col justify-between rounded-xl border px-6 py-6 transition-[box-shadow,background-color] duration-500 ease-out hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)]"
                    style={{
                      borderColor:
                        theme === "dark"
                          ? "rgba(247, 243, 240, 0.12)"
                          : "rgba(0, 0, 0, 0.06)",
                      backgroundColor:
                        hoveredCard === service.id ? cardHoverBg : cardBg,
                    }}
                  >
                    <div>
                      <h3
                        className="font-[Helvetica Now Text,Arial,sans-serif] text-[16px] font-semibold tracking-tight mb-2"
                        style={{ color: cardText }}
                      >
                        {service.title}
                      </h3>
                      <p
                        className="font-[Helvetica Now Text,Arial,sans-serif] text-[13px] font-regular leading-snug"
                        style={{ color: cardDesc }}
                      >
                        {service.description}
                      </p>
                    </div>

                    <div className="flex justify-end mt-4">
                      <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center">
                        <span
                          className={`relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-[4px] transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-[1px] ${arrowBtnClass}`}
                        >
                          <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 14 14"
                              aria-hidden="true"
                            >
                              <path
                                d="M1 13L13 1M13 1H5M13 1V9"
                                fill="none"
                                stroke={arrowStroke}
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center translate-x-[-10px] translate-y-[10px] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 14 14"
                              aria-hidden="true"
                            >
                              <path
                                d="M1 13L13 1M13 1H5M13 1V9"
                                fill="none"
                                stroke={arrowStrokeHover}
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Row 2: 2 Cards */}
              <div
                className="grid gap-4 transition-all duration-500 ease-out"
                style={{
                  gridTemplateColumns:
                    hoveredCard === "demand-team"
                      ? "1.28fr 0.72fr"
                      : hoveredCard === "demand-agency"
                      ? "0.72fr 1.28fr"
                      : "1fr 1fr",
                }}
              >
                {SERVICES_ROW_2.map((service) => (
                  <Link
                    key={service.id}
                    href={service.href}
                    onMouseEnter={() => setHoveredCard(service.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="dropdown-card group relative flex min-h-[180px] min-w-0 cursor-pointer flex-col justify-between rounded-xl border px-6 py-6 transition-[box-shadow,background-color] duration-500 ease-out hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)]"
                    style={{
                      borderColor:
                        theme === "dark"
                          ? "rgba(247, 243, 240, 0.12)"
                          : "rgba(0, 0, 0, 0.06)",
                      backgroundColor:
                        hoveredCard === service.id ? cardHoverBg : cardBg,
                    }}
                  >
                    <div>
                      <h3
                        className="font-[Helvetica Now Text,Arial,sans-serif] text-[16px] font-semibold tracking-tight mb-2"
                        style={{ color: cardText }}
                      >
                        {service.title}
                      </h3>
                      <p
                        className="font-[Helvetica Now Text,Arial,sans-serif] text-[13px] font-regular leading-snug"
                        style={{ color: cardDesc }}
                      >
                        {service.description}
                      </p>
                    </div>

                    <div className="flex justify-end mt-4">
                      <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center">
                        <span
                          className={`relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-[4px] transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-[1px] ${arrowBtnClass}`}
                        >
                          <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 14 14"
                              aria-hidden="true"
                            >
                              <path
                                d="M1 13L13 1M13 1H5M13 1V9"
                                fill="none"
                                stroke={arrowStroke}
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center translate-x-[-10px] translate-y-[10px] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 14 14"
                              aria-hidden="true"
                            >
                              <path
                                d="M1 13L13 1M13 1H5M13 1V9"
                                fill="none"
                                stroke={arrowStrokeHover}
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MEGA MENU DROPDOWN - Expertise */}
        <div
          data-dropdown="Expertise"
          className={`dark7-v40-mega-menu hidden lg:block absolute left-0 right-0 top-full z-[90] -mt-4 pt-1 transition-all duration-300 ${
            activeDropdown === "Expertise"
              ? "opacity-100 translate-y-0 pointer-events-auto visible"
              : "opacity-0 -translate-y-2 pointer-events-none invisible"
          }`}
          onMouseEnter={() => handleMouseEnter("Expertise")}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex justify-center px-2 md:px-4">
            <div
              className="relative w-full max-w-[960px] rounded-[14px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
              style={{
                backgroundColor: dropdownBg,
                border: `1px solid ${dropdownBorder}`,
              }}
            >
              {/* Triangle animations */}
              {/* {theme === "light" &&
                triangles.map((triangle) => (
                  <div
                    key={triangle.id}
                    className="pointer-events-none absolute animate-triangle-fade"
                    style={{
                      left: `${triangle.x}px`,
                      top: `${triangle.y}px`,
                      width: "0",
                      height: "0",
                      borderLeft: `${triangle.size / 2}px solid transparent`,
                      borderRight: `${triangle.size / 2}px solid transparent`,
                      borderBottom: `${triangle.size}px solid ${triangle.color}`,
                      transform: `translate(-50%, -50%) rotate(${triangle.rotation}deg)`,
                      opacity: 0.7,
                    }}
                  />
                ))} */}

              <div
                className="grid gap-4 transition-all duration-500 ease-out"
                style={{
                  gridTemplateColumns:
                    hoveredCard === "b2b-saas"
                      ? "1.28fr 0.86fr 0.86fr"
                      : hoveredCard === "b2b-service"
                      ? "0.86fr 1.28fr 0.86fr"
                      : hoveredCard === "b2b-hardware"
                      ? "0.86fr 0.86fr 1.28fr"
                      : "1fr 1fr 1fr",
                }}
              >
                {EXPERTISE_ITEMS.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="dropdown-card group relative flex min-h-[180px] min-w-0 cursor-pointer flex-col justify-between rounded-xl border px-6 py-6 transition-[box-shadow,background-color] duration-500 ease-out hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)]"
                    style={{
                      borderColor:
                        theme === "dark"
                          ? "rgba(247, 243, 240, 0.12)"
                          : "rgba(0, 0, 0, 0.06)",
                      backgroundColor:
                        hoveredCard === item.id ? cardHoverBg : cardBg,
                    }}
                  >
                    <div>
                      <h3
                        className="font-[Helvetica Now Text,Arial,sans-serif] text-[16px] font-semibold tracking-tight mb-2"
                        style={{ color: cardText }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="font-[Helvetica Now Text,Arial,sans-serif] text-[13px] font-regular leading-snug"
                        style={{ color: cardDesc }}
                      >
                        {item.description}
                      </p>
                    </div>

                    <div className="flex justify-end mt-4">
                      <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center">
                        <span
                          className={`relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-[4px] transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-[1px] ${arrowBtnClass}`}
                        >
                          <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-0">
                            <svg width="10" height="10" viewBox="0 0 14 14">
                              <path
                                d="M1 13L13 1M13 1H5M13 1V9"
                                fill="none"
                                stroke={arrowStroke}
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center translate-x-[-10px] translate-y-[10px] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
                            <svg width="10" height="10" viewBox="0 0 14 14">
                              <path
                                d="M1 13L13 1M13 1H5M13 1V9"
                                fill="none"
                                stroke={arrowStrokeHover}
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </header>
    </>
  );
}
