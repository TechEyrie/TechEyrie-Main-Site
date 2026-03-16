// components/StatsSection.jsx
"use client";

import {
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const COMPANY_CARDS = [
  {
    id: "cpp",
    logoSrc:
      "https://cdn.prod.website-files.com/67bd789ea8377ea95b1724ad/6839717b11fb3bf978dc6a90_Focus-on%20logo.avif",
    logoAlt: "CPP",
    metrics: [
      { value: "200%", label: "More inbound sales calls" },
      { value: "53%", label: "More qualified pipeline" },
    ],
  },
  {
    id: "bluebird",
    logoSrc:
      "https://cdn.prod.website-files.com/67bd789ea8377ea95b1724ad/6839717b11fb3bf978dc6a90_Focus-on%20logo.avif",
    logoAlt: "Bluebird",
    metrics: [
      { value: "60+", label: "Inbound Leads" },
      { value: "66%", label: "Win rate" },
    ],
  },
  {
    id: "focus-on",
    logoSrc:
      "https://cdn.prod.website-files.com/67bd789ea8377ea95b1724ad/6839717b11fb3bf978dc6a90_Focus-on%20logo.avif",
    logoAlt: "FOCUS-ON",
    metrics: [
      { value: "12%", label: "More Leads" },
      { value: "400%", label: "High-intent Downloads" },
    ],
  },
  {
    id: "reviewstudio",
    logoSrc:
      "https://cdn.prod.website-files.com/67bd789ea8377ea95b1724ad/6839717b11fb3bf978dc6a90_Focus-on%20logo.avif",
    logoAlt: "reviewstudio",
    metrics: [
      { value: "350+", label: "Signups in 4 months" },
      { value: "$70", label: "Cost of a sign up" },
    ],
  },
];

gsap.registerPlugin(ScrollTrigger);

export default function StatsSection({ theme = "light" }) {
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const titleContainerRef = useRef(null);
  const animationRef = useRef(null);
  const dragState = useRef({
    isDown: false,
    startX: 0,
    currentScroll: 0,
    targetScroll: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
    isButtonScrolling: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Add triangle animation effects (similar to hero section)
  const [triangles, setTriangles] = useState([]);
  const triangleIdRef = useRef(0);

  // Add electrical animation state
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationIntervalRef = useRef(null);

  // Color Palettes
  const lightColors = {
    primary: "#013825",      // Deep Forest Green
    secondary: "#9E8F72",    // Golden Brown (updated)
    tertiary: "#CEC8B0",     // Light Beige/Tan (updated)
    background: "#F9F7F0",   // Very light neutral for section background
  };

  // Background styles based on theme
  const bgStyle =
    theme === "dark"
      ? {
          backgroundColor: "#2b2b2b",
          backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
          radial-gradient(ellipse at top left, rgba(60, 60, 60, 0.3), transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(50, 50, 50, 0.2), transparent 50%)
        `,
          backgroundBlendMode: "overlay, normal, normal",
        }
      : { backgroundColor: lightColors.background };

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px)
    `,
  };

  const createTriangle = useCallback((x, y) => {
    const id = triangleIdRef.current++;
    const size = Math.random() * 5 + 8;
    const rotation = Math.random() * 360;
    const greenShades = ["#74F5A1", "#5FE08D", "#4DD97F", "#3BC972"];
    const color = greenShades[Math.floor(Math.random() * greenShades.length)];

    const newTriangle = {
      id,
      x,
      y,
      size,
      rotation,
      color,
    };

    setTriangles((prev) => [...prev, newTriangle]);

    setTimeout(() => {
      setTriangles((prev) => prev.filter((t) => t.id !== id));
    }, 1050);
  }, []);

  // Function to create smooth electrical hover effect
  const triggerElectricalAnimation = useCallback(() => {
    const titleLines = document.querySelectorAll(".stats-title-line");

    // Define colors based on theme
    const originalColor = theme === "dark" ? "#f3f3f3" : "#111111";
    const electricColor = theme === "dark" ? "#74F5A1" : "#3BC972";
    const brightElectricColor = theme === "dark" ? "#FFFFFF" : "#FFFFFF";

    // Create a single timeline for all lines
    const tl = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
      },
    });

    // Animate each line with an electrical sweep effect
    titleLines.forEach((line, lineIndex) => {
      // Get the text content
      const text = line.textContent;

      // Split text into spans for character-by-character animation
      // First, check if we need to split
      const words = text.split(/(\s+)/);
      
      // Wrap each word in a span to prevent line breaks within words
      if (!line.querySelector(".word")) {
        const wordSpans = words
          .map(
            (word, i) =>
              `<span class="word" style="white-space: nowrap; display: inline-block;">${word}</span>`
          )
          .join("");
        line.innerHTML = wordSpans;
      }

      // Now split each word into characters
      const wordsInLine = line.querySelectorAll(".word");
      wordsInLine.forEach((wordElement, wordIndex) => {
        const wordText = wordElement.textContent;
        
        // Split word into characters
        const chars = wordText
          .split("")
          .map(
            (char, charIndex) =>
              `<span class="char" style="color: ${originalColor}; display: inline-block; position: relative;" data-index="${charIndex}">${
                char === " " ? "&nbsp;" : char
              }</span>`
          )
          .join("");
        
        // Replace word with characters
        wordElement.innerHTML = chars;
      });

      // Now animate all characters
      const chars = line.querySelectorAll(".char");
      chars.forEach((char, charIndex) => {
        // Randomize timing slightly for electrical feel
        const baseDelay = lineIndex * 0.5 + charIndex * 0.06;
        const randomDelay = Math.random() * 0.1;
        const totalDelay = baseDelay + randomDelay;

        // Electrical flicker effect
        tl.to(
          char,
          {
            duration: 0.12,
            color: brightElectricColor,
            scale: 1.05,
            delay: totalDelay,
            ease: "power2.out",
          },
          0
        )
          .to(
            char,
            {
              duration: 0.18,
              color: electricColor,
              scale: 1.02,
              delay: totalDelay + 0.12,
              ease: "sine.inOut",
            },
            0
          )
          .to(
            char,
            {
              duration: 0.3,
              color: originalColor,
              scale: 1,
              delay: totalDelay + 0.3,
              ease: "power2.in",
            },
            0
          );
      });
    });
  }, [theme]);

  // Function to start continuous animation
  const startElectricalAnimation = useCallback(() => {
    // Clear any existing interval
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    // Trigger first animation immediately
    setTimeout(() => {
      triggerElectricalAnimation();
    }, 800);

    // Then repeat every 10 seconds
    animationIntervalRef.current = setInterval(() => {
      triggerElectricalAnimation();
    }, 10000);
  }, [triggerElectricalAnimation]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let lastTime = 0;
    const throttleDelay = 100;

    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastTime < throttleDelay) return;
      lastTime = currentTime;

      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      createTriangle(x, y);
    };

    section.addEventListener("mousemove", handleMouseMove);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
    };
  }, [createTriangle]);

  // GSAP Scroll Animation for heading
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const titleContainer = titleContainerRef.current;

    if (!section || !titleContainer) return;

    const ctx = gsap.context(() => {
      // Clear any existing animations first
      gsap.killTweensOf(".stats-title-line");

      // Set initial state - text is fully visible
      gsap.set(".stats-title-line", {
        opacity: 1,
        y: 0,
      });

      // Set up the reveal animation timeline for scroll
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: titleContainer,
          start: "top 85%",
          end: "top 50%",
          once: true,
          onEnter: () => {
            setHasAnimated(true);
            // Start electrical animation after scroll reveal
            setTimeout(() => {
              startElectricalAnimation();
            }, 1000);
          },
          markers: false,
        },
      });

      // Animate each line with a staggered reveal
      revealTl.fromTo(
        ".stats-title-line",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.15,
        }
      );

      // Original animations for stats cards
      gsap.from(".stats-card", {
        scrollTrigger: {
          trigger: section,
          start: "top 20%",
          once: true,
        },
        y: 150,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.25,
      });
    }, section);

    return () => ctx.revert();
  }, [theme, startElectricalAnimation]);

  // Start electrical animation on mount
  useEffect(() => {
    // Start animation after initial load
    const timer = setTimeout(() => {
      if (!hasAnimated) {
        startElectricalAnimation();
      }
    }, 1500);

    // Clean up on unmount
    return () => {
      clearTimeout(timer);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [startElectricalAnimation, hasAnimated]);

  // Add CSS for the electrical effects
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
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

      @keyframes subtle-glitch {
        0%, 100% {
          transform: translateX(0);
        }
        94% {
          transform: translateX(0);
        }
        95% {
          transform: translateX(1px);
        }
        96% {
          transform: translateX(-1px);
        }
        97% {
          transform: translateX(0);
        }
      }

      .animate-triangle-fade {
        animation: triangle-fade 1.05s ease-out forwards;
      }

      /* Smooth transition for electrical effects */
      .char {
        transition: color 0.15s ease, transform 0.15s ease;
        will-change: color, transform;
        animation: subtle-glitch 10s infinite;
      }

      /* Different glitch timing for each character */
      .char:nth-child(3n) {
        animation-delay: 0.5s;
      }
      .char:nth-child(3n+1) {
        animation-delay: 1s;
      }
      .char:nth-child(3n+2) {
        animation-delay: 1.5s;
      }

      /* Keep words together */
      .word {
        white-space: nowrap;
        display: inline-block;
      }

      /* Fellix font styling for headings */
      .font-fellix {
        font-family: 'Fellix', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      /* Smooth theme transition for title */
      .stats-title-line {
        transition: color 0.4s ease;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const updateScrollState = () => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const left = track.scrollLeft;

    setCanScrollPrev(left > 4);
    setCanScrollNext(left < maxScroll - 4);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();
    const handle = () => updateScrollState();

    track.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);

    return () => {
      track.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, []);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    const state = dragState.current;
    if (!track) return;

    const card = track.querySelector("[data-card]");
    if (!card) return;

    const cardWidth = card.getBoundingClientRect().width;
    const gap = 24;
    const scrollAmount =
      direction === "next" ? cardWidth + gap : -(cardWidth + gap);

    state.isButtonScrolling = true;
    track.style.scrollSnapType = "none";

    track.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });

    setTimeout(() => {
      track.style.scrollSnapType = "x mandatory";
      state.isButtonScrolling = false;
      state.targetScroll = track.scrollLeft;
      state.currentScroll = track.scrollLeft;
      updateScrollState();
    }, 500);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const state = dragState.current;

    const smoothScroll = () => {
      if (!state.isButtonScrolling) {
        if (!state.isDown) {
          if (Math.abs(state.velocity) > 0.1) {
            state.targetScroll += state.velocity;
            state.velocity *= 0.95;
          }
        }

        const ease = 0.1;
        state.currentScroll +=
          (state.targetScroll - state.currentScroll) * ease;

        if (state.isDown || Math.abs(state.velocity) > 0.1) {
          track.scrollLeft = state.currentScroll;
        }

        const maxScroll = track.scrollWidth - track.clientWidth;
        if (state.currentScroll < 0) {
          state.currentScroll = 0;
          state.targetScroll = 0;
          state.velocity = 0;
        } else if (state.currentScroll > maxScroll) {
          state.currentScroll = maxScroll;
          state.targetScroll = maxScroll;
          state.velocity = 0;
        }
      }

      animationRef.current = requestAnimationFrame(smoothScroll);
    };

    animationRef.current = requestAnimationFrame(smoothScroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const state = dragState.current;

    const onMouseDown = (e) => {
      if (e.target.closest("a") || e.target.closest("button")) {
        return;
      }

      state.isDown = true;
      state.isButtonScrolling = false;
      state.startX = e.pageX;
      state.currentScroll = track.scrollLeft;
      state.targetScroll = track.scrollLeft;
      state.lastX = e.pageX;
      state.lastTime = Date.now();
      state.velocity = 0;

      track.classList.add("dragging");
      track.style.scrollSnapType = "none";
      track.style.cursor = "grabbing";
    };

    const onMouseMove = (e) => {
      if (!state.isDown) return;
      e.preventDefault();

      const currentTime = Date.now();
      const deltaX = e.pageX - state.startX;
      const timeDelta = currentTime - state.lastTime;

      state.targetScroll = state.currentScroll - deltaX;

      if (timeDelta > 0) {
        const moveX = e.pageX - state.lastX;
        state.velocity = (moveX / timeDelta) * -16;
      }

      state.lastX = e.pageX;
      state.lastTime = currentTime;
    };

    const onMouseUp = () => {
      if (state.isDown) {
        state.isDown = false;
        track.classList.remove("dragging");
        track.style.cursor = "grab";

        setTimeout(() => {
          if (!state.isButtonScrolling) {
            track.style.scrollSnapType = "x mandatory";
            updateScrollState();
          }
        }, 500);
      }
    };

    const onMouseLeave = () => {
      if (state.isDown) {
        onMouseUp();
      }
    };

    track.addEventListener("mousedown", onMouseDown);
    track.addEventListener("mousemove", onMouseMove);
    track.addEventListener("mouseup", onMouseUp);
    track.addEventListener("mouseleave", onMouseLeave);

    return () => {
      track.removeEventListener("mousedown", onMouseDown);
      track.removeEventListener("mousemove", onMouseMove);
      track.removeEventListener("mouseup", onMouseUp);
      track.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <>
      <style jsx>{`
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
          animation: triangle-fade 1.05s ease-out forwards;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24"
        style={bgStyle}
      >
        {/* Noise texture overlay */}
        {theme === "dark" && (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={noiseOverlayStyle}
          />
        )}

        {/* CURSOR TRAIL TRIANGLES */}
        {triangles.map((triangle) => (
          <div
            key={triangle.id}
            className="pointer-events-none absolute z-[5] animate-triangle-fade"
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
        ))}

        <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8">
          {/* TOP ROW */}
          <div className="grid items-start gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)] mb-20 sm:mb-28 md:mb-32 lg:mb-40">
            <div ref={titleContainerRef}>
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-5 w-5 rounded-sm" style={{ backgroundColor: theme === "dark" ? "#74F5A1" : "#013825" }} />
                <p
                  className={`font-[Helvetica Now Text,Arial,sans-serif] text-[13px] md:text-[14px] font-semibold tracking-[0.16em] uppercase ${
                    theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"
                  }`}
                >
                  Results
                </p>
              </div>

              {/* Title with FELLIX font and electrical animation */}
              <h2 className="font-fellix leading-[1.05] tracking-tight">
                {/* Line 1 */}
                <div
                  className={`stats-title-line text-[28px] sm:text-[34px] md:text-[42px] lg:text-[80px] ${
                    theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                  }`}
                >
                  <span className="font-normal">100+ B2B companies trusted us</span>
                </div>
                {/* Line 2 */}
                <div
                  className={`stats-title-line text-[28px] sm:text-[34px] md:text-[42px] lg:text-[80px] ${
                    theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                  }`}
                >
                  <span className="font-normal">to improve their </span>
                  <span className="font-fellix italic font-normal tracking-[0.03em]">
                    marketing
                  </span>
                </div>
              </h2>
            </div>

            <div className="max-w-full lg:max-w-[520px] lg:ml-auto lg:mt-10">
              <p
                className={`font-[Helvetica Now Text,Arial,sans-serif] text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] xl:text-[19px] font-semibold leading-relaxed ${
                  theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"
                }`}
              >
                More than 100 B2B Companies worldwide trusted us to improve
                their marketing engine and marketing ROI.
              </p>

              <Link
                href="#cases"
                className={`group mt-4 sm:mt-6 inline-flex items-center gap-2 rounded-[8px] sm:rounded-[10px] border ${
                  theme === "dark"
                    ? "border-white/10 bg-[#2a2a2a]"
                    : "border-black/10 bg-white"
                } px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.10] hover:-translate-y-[1px]`}
              >
                <span
                  className={`font-[Helvetica Now Text,Arial,sans-serif] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] font-semibold tracking-tight ${
                    theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"
                  }`}
                >
                  Explore all results
                </span>

                <span
                  className={`relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center overflow-hidden rounded-[4px] ${
                    theme === "dark"
                      ? "bg-[#74F5A1] group-hover:bg-white"
                      : "bg-[#74F5A1] group-hover:bg-black"
                  } transition-colors duration-500`}
                >
                  <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-x-3 group-hover:-translate-y-3 group-hover:opacity-0">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 14 14"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 13L13 1M13 1H5M13 1V9"
                        fill="none"
                        stroke={theme === "dark" ? "#111111" : "#212121"}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <span className="absolute inset-0 flex items-center justify-center translate-x-[-10px] translate-y-[10px] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 14 14"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 13L13 1M13 1H5M13 1V9"
                        fill="none"
                        stroke={theme === "dark" ? "#111111" : "#74F5A1"}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </Link>
            </div>
          </div>

          {/* SLIDER ROW */}
          <div className="mt-14 pt-2">
            <div className="relative">
              {/* Desktop slider buttons */}
              <div className="absolute -top-12 right-0 hidden gap-2 lg:flex">
                <button
                  type="button"
                  onClick={() => scrollByCard("prev")}
                  disabled={!canScrollPrev}
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-[6px] text-white transition",
                    canScrollPrev
                      ? theme === "dark"
                        ? "bg-[#3a3a3a] hover:bg-[#4a4a4a] cursor-pointer"
                        : "bg-[#111111] hover:bg-black cursor-pointer"
                      : theme === "dark"
                      ? "bg-[#3a3a3a]/50 cursor-not-allowed"
                      : "bg-[#D3D3D3] cursor-not-allowed",
                  ].join(" ")}
                  aria-label="Previous results"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M9.5 4L5.5 8L9.5 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => scrollByCard("next")}
                  disabled={!canScrollNext}
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-[6px] text-white transition",
                    canScrollNext
                      ? theme === "dark"
                        ? "bg-[#3a3a3a] hover:bg-[#4a4a4a] cursor-pointer"
                        : "bg-[#111111] hover:bg-black cursor-pointer"
                      : theme === "dark"
                      ? "bg-[#3a3a3a]/50 cursor-not-allowed"
                      : "bg-[#D3D3D3] cursor-not-allowed",
                  ].join(" ")}
                  aria-label="Next results"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M6.5 4L10.5 8L6.5 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Track with smooth drag-to-scroll */}
              <div
                ref={trackRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 cursor-grab snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {COMPANY_CARDS.map((card) => {
                  const isHovered = hoveredCardId === card.id;

                  return (
                    <article
                      key={card.id}
                      data-card
                      onMouseEnter={() => setHoveredCardId(card.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                      className={`stats-card snap-start shrink-0 w-[85vw] sm:w-[340px] md:w-[380px] lg:w-[420px] xl:w-[520px] flex flex-col rounded-lg border ${
                        theme === "dark"
                          ? "border-white/10 bg-[#2a2a2a]"
                          : "border-black/[0.06] bg-white"
                      } shadow-[0_10px_35px_rgba(0,0,0,0.08)] select-none transition-shadow duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)]`}
                    >
                      {/* Logo section */}
                      <div className="relative h-[120px] sm:h-[140px] md:h-[170px] lg:h-[190px] xl:h-[220px] px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6">
                        <div className="relative flex h-7 sm:h-8 md:h-9 lg:h-10 w-auto items-center">
                          {card.logoSrc ? (
                            <Image
                              src={card.logoSrc}
                              alt={card.logoAlt}
                              fill
                              className="object-contain object-left pointer-events-none"
                              sizes="300px"
                            />
                          ) : (
                            <span
                              className={`font-[Helvetica Now Text,Arial,sans-serif] text-[20px] font-bold ${
                                theme === "dark"
                                  ? "text-[#f3f3f3]"
                                  : "text-[#111111]"
                              }`}
                            >
                              {card.logoAlt}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Metrics section with 3-column grid */}
                      <div
                        className={`border-t ${
                          theme === "dark"
                            ? "border-white/[0.05]"
                            : "border-black/[0.05]"
                        } px-3 sm:px-4 pb-3 sm:pb-4 pt-2 sm:pt-3`}
                      >
                        <div
                          className="grid gap-2 sm:gap-3 transition-all duration-500 ease-out"
                          style={{
                            gridTemplateColumns: isHovered
                              ? "1fr 1fr auto"
                              : "1fr 1fr 0fr",
                          }}
                        >
                          {/* Metric columns */}
{card.metrics.map((metric) => (
  <div
    key={metric.value + metric.label}
    className={`rounded-md px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 ${
      theme === "dark"
        ? "bg-[#3a3a3a]"
        : "bg-[#F4F4F4]"
    }`}
  >
    <p
      className={`font-[Helvetica Now Text,Arial,sans-serif] text-[18px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[28px] font-bold tracking-tight ${
        theme === "dark"
          ? "text-[#f3f3f3]"
          : "text-[#111111]"
      }`}
    >
      {metric.value}
    </p>
    <p
      className={`mt-0.5 sm:mt-1 font-[Helvetica Now Text,Arial,sans-serif] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] font-semibold leading-snug overflow-hidden text-ellipsis whitespace-nowrap ${
        theme === "dark"
          ? "text-[#a0a0a0]"
          : "text-[#444444]"
      }`}
      title={metric.label}
    >
      {metric.label}
    </p>
  </div>
))}


                          {/* 3rd column: Full button (appears on hover) */}
                          <div
                            className="overflow-hidden transition-all duration-500 ease-out"
                            style={{
                              width: isHovered ? "70px" : "0px",
                              opacity: isHovered ? 1 : 0,
                            }}
                          >
                            <Link
                              href={`#case-${card.id}`}
                              aria-label={`View ${card.logoAlt} case study`}
                              className="group/arrow flex h-full w-full items-center justify-center rounded-md bg-[#74F5A1] transition-all duration-500 ease-out hover:bg-black hover:scale-105"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Default arrow */}
                              <span className="absolute flex items-center justify-center transition-all duration-500 ease-out group-hover/arrow:translate-x-2 group-hover/arrow:-translate-y-2 group-hover/arrow:opacity-0">
                                <svg
                                  width="16"
                                  height="16"
                                  className="sm:w-5 sm:h-5"
                                  viewBox="0 0 14 14"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M1 13L13 1M13 1H5M13 1V9"
                                    fill="none"
                                    stroke="#212121"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>

                              {/* New arrow */}
                              <span className="absolute flex items-center justify-center translate-x-[-10px] translate-y-[10px] opacity-0 transition-all duration-500 ease-out group-hover/arrow:translate-x-0 group-hover/arrow:translate-y-0 group-hover/arrow:opacity-100">
                                <svg
                                  width="16"
                                  height="16"
                                  className="sm:w-5 sm:h-5"
                                  viewBox="0 0 14 14"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M1 13L13 1M13 1H5M13 1V9"
                                    fill="none"
                                    stroke="#74F5A1"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Mobile / tablet buttons */}
              <div className="mt-4 sm:mt-6 flex justify-center gap-2 sm:gap-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => scrollByCard("prev")}
                  disabled={!canScrollPrev}
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-[6px] text-white transition",
                    canScrollPrev
                      ? theme === "dark"
                        ? "bg-[#3a3a3a] hover:bg-[#4a4a4a] cursor-pointer"
                        : "bg-[#111111] hover:bg-black cursor-pointer"
                      : theme === "dark"
                      ? "bg-[#3a3a3a]/50 cursor-not-allowed"
                      : "bg-[#D3D3D3] cursor-not-allowed",
                  ].join(" ")}
                  aria-label="Previous results"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M9.5 4L5.5 8L9.5 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCard("next")}
                  disabled={!canScrollNext}
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-[6px] text-white transition",
                    canScrollNext
                      ? theme === "dark"
                        ? "bg-[#3a3a3a] hover:bg-[#4a4a4a] cursor-pointer"
                        : "bg-[#111111] hover:bg-black cursor-pointer"
                      : theme === "dark"
                      ? "bg-[#3a3a3a]/50 cursor-not-allowed"
                      : "bg-[#D3D3D3] cursor-not-allowed",
                  ].join(" ")}
                  aria-label="Next results"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M6.5 4L10.5 8L6.5 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}