// components/RealProblemSection.jsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function RealProblemSection({ theme = "light" }) {
  const containerRef = useRef(null);
  const titleContainerRef = useRef(null);
  const hasAnimatedInViewport = useRef(false);

  // Triangle animation effects
  const [triangles, setTriangles] = useState([]);
  const triangleIdRef = useRef(0);

  // Color Palettes
  const lightColors = {
    primary: "#013825",
    secondary: "#9E8F72",
    tertiary: "#CEC8B0",
    background: "#F9F7F0",
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

  // --- ELECTRIC ANIMATION LOGIC (ONCE PER VIEWPORT ENTRY) ---

  const triggerElectricalAnimation = useCallback(() => {
    const titleLines = document.querySelectorAll(".real-problem-title-line");

    const originalColor = theme === "dark" ? "#f3f3f3" : "#111111";
    const electricColor = theme === "dark" ? "#74F5A1" : "#3BC972";
    const brightElectricColor = theme === "dark" ? "#FFFFFF" : "#FFFFFF";

    const tl = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
      },
    });

    titleLines.forEach((line, lineIndex) => {
      const text = line.textContent;

      if (!line.querySelector(".char")) {
        const chars = text
          .split("")
          .map(
            (char, i) =>
              `<span class="char" style="color: ${originalColor}; display: inline-block; position: relative;" data-index="${i}">${
                char === " " ? "&nbsp;" : char
              }</span>`
          )
          .join("");
        line.innerHTML = chars;
      }

      const chars = line.querySelectorAll(".char");
      chars.forEach((char, charIndex) => {
        const baseDelay = lineIndex * 0.5 + charIndex * 0.06;
        const randomDelay = Math.random() * 0.1;
        const totalDelay = baseDelay + randomDelay;

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

  // --- INTERSECTION OBSERVER FOR VIEWPORT DETECTION ---
  useEffect(() => {
    const titleContainer = titleContainerRef.current;
    if (!titleContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animation when entering viewport
            setTimeout(() => {
              triggerElectricalAnimation();
            }, 300);
            hasAnimatedInViewport.current = true;
          } else {
            // Reset flag when leaving viewport so it can animate again on re-entry
            hasAnimatedInViewport.current = false;
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: "0px",
      }
    );

    observer.observe(titleContainer);

    return () => {
      if (titleContainer) {
        observer.unobserve(titleContainer);
      }
    };
  }, [triggerElectricalAnimation]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes subtle-glitch {
        0%, 100% { transform: translateX(0); }
        94% { transform: translateX(0); }
        95% { transform: translateX(1px); }
        96% { transform: translateX(-1px); }
        97% { transform: translateX(0); }
      }
      .char {
        transition: color 0.15s ease, transform 0.15s ease;
        will-change: color, transform;
        animation: subtle-glitch 10s infinite;
      }
      .char:nth-child(3n) { animation-delay: 0.5s; }
      .char:nth-child(3n+1) { animation-delay: 1s; }
      .char:nth-child(3n+2) { animation-delay: 1.5s; }
      .word { white-space: nowrap; display: inline-block; }

      .bg-transition {
        transition: background-color 0.5s ease, border-color 0.5s ease;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // --- END ELECTRIC ANIMATION LOGIC ---

  const createTriangle = useCallback((x, y) => {
    const id = triangleIdRef.current++;
    const size = Math.random() * 12 + 20;
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

  useEffect(() => {
    const section = containerRef.current?.closest("section");
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
        ref={containerRef}
        className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 2xl:py-48 bg-transition"
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

        <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col justify-center min-h-full">
          {/* Label above everything */}
          <div className="mb-6 sm:mb-7 md:mb-8 lg:mb-10 flex items-center gap-2 sm:gap-3">
            <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-[#74F5A1]" />
            <span
              className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] lg:text-[16px] font-semibold tracking-[0.16em]  ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
              }`}
            >
              The real problem is
            </span>
          </div>

          {/* Heading left, copy/CTA right */}
          <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div ref={titleContainerRef}>
              <h2
                className={`leading-[1.02] tracking-tight ${
                  theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                }`}
              >
                <span className="real-problem-title-line block font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] 2xl:text-[82px]">
                  Most businesses don&apos;t
                </span>
                <span className="real-problem-title-line block font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] 2xl:text-[82px]">
                  have a tool problem,
                </span>
                <span className="real-problem-title-line block font-playfair font-semibold italic text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] 2xl:text-[82px]">
                  they have a systems
                </span>
                <span className="real-problem-title-line block font-playfair font-semibold italic text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] 2xl:text-[82px]">
                  problem
                </span>
              </h2>
            </div>

            <div className="flex flex-col gap-5 sm:gap-6 md:gap-7 lg:max-w-[600px] mt-4 sm:mt-6 md:mt-8 lg:mt-16">
              <p
                className={`font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-normal leading-relaxed ${
                  theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"
                }`}
              >
                Too many businesses invest in the latest tools and platforms, expecting them to solve their growth challenges. But without the right systems in place, those tools become expensive distractions rather than drivers of real results.
              </p>

              <p
                className={`font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-normal leading-relaxed ${
                  theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"
                }`}
              >
                We build the frameworks, processes, and workflows that turn your tech stack into a high-performing marketing engine. Strategy comes first, tools follow.
              </p>

              <Link
                href="/services"
                className="group inline-flex items-center justify-center self-start rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px] mt-2 sm:mt-3"
                style={{ backgroundColor: '#12685b' }}
              >
                <span className="font-merriweather text-[13px] sm:text-[14px] md:text-[15px] font-semibold tracking-wide text-white">
                  Our services
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}