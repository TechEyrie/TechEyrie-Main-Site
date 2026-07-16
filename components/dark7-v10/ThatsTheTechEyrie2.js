// ThatsTheTechEyrie2 – CSS sticky wrapper on desktop; static layout on mobile.
"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Dark7V10ScrollTrigger } from "./lenisScrollTrigger";
import {
  DARK7_GRADIENTS,
  DARK7_GRADIENT_NOISE_STYLE,
} from "./dark7PageGradients";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SCROLL_DISTANCE = "85vh";

const lightColors = { background: "#F9F7F0" };

function getBgStyle(theme) {
  return theme === "dark"
    ? { background: DARK7_GRADIENTS.lightBridge }
    : { backgroundColor: lightColors.background };
}

function getSurfaceClasses() {
  return {
    textPrimary: "text-[#162D24]",
    textBody: "text-[#162D24]",
    divider: "border-black/10",
  };
}

function SectionOverlays() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1]"
      style={DARK7_GRADIENT_NOISE_STYLE}
      aria-hidden="true"
    />
  );
}

function TechEyrieCtaLink({ className = "" }) {
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <Link
      href="/about"
      className={`hero-cta-btn inline-flex cursor-pointer items-center justify-center px-5 py-2.5 font-merriweather text-[16px] font-light tracking-[0.06em] transition-colors duration-300 md:px-6 md:py-3 md:text-[18px] ${className} ${
        ctaHovered ? "text-[#F7F3F0]" : "text-[#162D24]"
      }`}
      style={{
        backgroundColor: ctaHovered ? "#162D24" : "#EFECEA",
        borderRadius: "12px",
      }}
      onMouseEnter={() => setCtaHovered(true)}
      onMouseLeave={() => setCtaHovered(false)}
    >
      Learn More About Us
    </Link>
  );
}

function MobileTechEyrieSection({ theme }) {
  const bgStyle = getBgStyle(theme);
  const { textPrimary, divider } = getSurfaceClasses(theme);

  return (
    <div className="relative w-full max-w-full min-w-0 overflow-x-clip">
      <section
        className="dark7-v10-tech-eyrie relative overflow-hidden transition-colors duration-500"
        style={bgStyle}
      >
        <SectionOverlays />

        <div className="relative z-10 w-full min-w-0">
          {/* Phase 1 */}
          <div className="mx-auto w-full min-w-0 max-w-[1800px] px-4 sm:px-6">
            <div className="py-14 sm:py-20 text-center">
              <div className="mb-4 sm:mb-6">
                <span
                  className={`tech-eyrie-kicker font-playfair italic font-semibold transition-colors duration-500 ${textPrimary}`}
                >
                  That&apos;s the
                </span>
              </div>
              <h2
                className={`real-problem-title-line font-italiana font-light leading-[0.95] tracking-[0.01em] break-words transition-colors duration-500 ${textPrimary}`}
              >
                Tech Eyrie
              </h2>
            </div>
          </div>

          <div className={`mx-4 sm:mx-6 border-t ${divider}`} />

          {/* Phase 2 */}
          <div className="mx-auto w-full min-w-0 max-w-[1800px] px-4 sm:px-6">
            <div className="py-14 sm:py-20">
              <h2 className="leading-[1.05] tracking-[0.01em] text-center sm:text-left">
                <div
                  className={`real-problem-title-line font-italiana font-light transition-colors duration-500 ${textPrimary}`}
                >
                  <span className="inline-block">TE</span> Build What
                </div>
                <div
                  className={`real-problem-title-line font-playfair italic font-light transition-colors duration-500 ${textPrimary}`}
                >
                  Others Can&apos;t
                </div>
                <div
                  className={`real-problem-title-line font-playfair italic font-light transition-colors duration-500 ${textPrimary}`}
                >
                  See Yet
                </div>
              </h2>

              <div className="mt-6 sm:mt-8 space-y-5 max-w-3xl sm:max-w-4xl mx-auto sm:mx-0">
                <p
                  className={`build-description font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-light leading-relaxed text-[#162D24] transition-colors duration-500`}
                >
                  In the fast moving world where technology becomes complex,
                  clarity is your biggest success. Here in Tech Eyrie we built
                  systems that dive through complexity combining AI- driven
                  automation, data and high- performance platforms into flawless
                  digital experiences.
                </p>
                <p
                  className={`build-description font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-light leading-relaxed text-[#162D24] transition-colors duration-500`}
                >
                  No trends, only intelligent systems that lasts long.
                </p>
                <div className="pt-2 flex justify-center sm:justify-start">
                  <TechEyrieCtaLink className="mt-2 sm:mt-3 self-start" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DesktopTechEyrieSection({ theme }) {
  const wrapperRef = useRef(null);
  const sectionRef = useRef(null);
  const firstPartRef = useRef(null);
  const secondPartRef = useRef(null);
  const techEyrieTextRef = useRef(null);
  const thatsTheTextRef = useRef(null);

  const bgStyle = getBgStyle(theme);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const firstPart = firstPartRef.current;
    const secondPart = secondPartRef.current;
    const techEyrieText = techEyrieTextRef.current;
    const thatsTheText = thatsTheTextRef.current;

    if (!wrapper || !section || !firstPart || !secondPart || !techEyrieText || !thatsTheText)
      return;

    const ctx = gsap.context(() => {
      const techWord = techEyrieText.querySelector(".tech-word");
      const eyrieWord = techEyrieText.querySelector(".eyrie-word");
      if (!techWord || !eyrieWord) return;

      const techChars = techWord.textContent.split("");
      const eyrieChars = eyrieWord.textContent.split("");

      techWord.innerHTML = techChars
        .map((char, i) =>
          `<span class="tech-char-${i}" style="display: inline-block; position: relative;">${char === " " ? "&nbsp;" : char}</span>`
        )
        .join("");

      eyrieWord.innerHTML = eyrieChars
        .map((char, i) =>
          `<span class="eyrie-char-${i}" style="display: inline-block; position: relative;">${char === " " ? "&nbsp;" : char}</span>`
        )
        .join("");

      const techSpans = techWord.querySelectorAll("span");
      const eyrieSpans = eyrieWord.querySelectorAll("span");
      const tChar = techSpans[0];
      const eChar = eyrieSpans[0];

      const teContainer = document.createElement("div");
      teContainer.className = "te-floating-container";
      teContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        gap: 0;
        pointer-events: none;
        opacity: 0;
        z-index: 1000;
        font-size: ${window.getComputedStyle(techEyrieText.querySelector("h2")).fontSize};
      `;

      const tClone = document.createElement("span");
      const eClone = document.createElement("span");
      tClone.textContent = "T";
      eClone.textContent = "E";
      tClone.className = techEyrieText.querySelector("h2").className;
      eClone.className = tClone.className;
      tClone.style.cssText = "display: inline-block; line-height: 1;";
      eClone.style.cssText = "display: inline-block; line-height: 1;";
      teContainer.appendChild(tClone);
      teContainer.appendChild(eClone);
      document.body.appendChild(teContainer);

      const getGapToClose = () => {
        if (!tChar || !eChar) return { tMove: 0, eMove: 0 };
        const tRect = tChar.getBoundingClientRect();
        const eRect = eChar.getBoundingClientRect();
        const currentGap = eRect.left - tRect.right;
        const desiredGap = 5;
        return {
          tMove: (currentGap - desiredGap) / 2,
          eMove: -(currentGap - desiredGap) / 2,
        };
      };

      const moveTEToSection = () => {
        if (!section || !secondPart || !teContainer) return;
        const targetTE = secondPart.querySelector(".target-te-position");
        if (!targetTE) return;
        gsap.set(teContainer, { opacity: 0, visibility: "hidden" });
        const targetRect = targetTE.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const finalTop = targetRect.top - sectionRect.top + targetRect.height / 2;
        const finalLeft = targetRect.left - sectionRect.left + targetRect.width / 2;
        const currentTransform = window.getComputedStyle(teContainer).transform;
        let currentScale = 1;
        if (currentTransform && currentTransform !== "none") {
          const matrix = currentTransform.match(/matrix\((.+)\)/);
          if (matrix) {
            const values = matrix[1].split(", ");
            currentScale = parseFloat(values[0]);
          }
        }
        gsap.set(teContainer, {
          position: "absolute",
          top: finalTop,
          left: finalLeft,
          xPercent: -50,
          yPercent: -50,
          transform: `translate(-50%, -50%) scale(${currentScale})`,
        });
        if (teContainer.parentNode !== section) section.appendChild(teContainer);
      };

      const moveTEToBody = () => {
        if (!secondPart || !teContainer) return;
        const targetTE = secondPart.querySelector(".target-te-position");
        if (!targetTE || teContainer.parentNode !== section) return;
        const targetRect = targetTE.getBoundingClientRect();
        gsap.set(teContainer, {
          position: "fixed",
          top: "50%",
          left: targetRect.left + targetRect.width / 2,
          xPercent: -50,
          yPercent: -155,
          visibility: "visible",
        });
        document.body.appendChild(teContainer);
      };

      const mainTl = gsap.timeline({
        scrollTrigger: Dark7V10ScrollTrigger({
          trigger: wrapper,
          start: "top top",
          end: `top+=${SCROLL_DISTANCE} top`,
          scrub: 3,
          onUpdate: (self) => {
            const p = self.progress();
            if (p >= 0.92 && teContainer.parentNode !== section) moveTEToSection();
            else if (p < 0.92 && teContainer.parentNode === section) moveTEToBody();
          },
        }),
      });

      mainTl
        .to(thatsTheText, { opacity: 0, y: -30, duration: 0.1, ease: "power2.out" }, 0)
        .to(
          [...Array.from(techSpans).slice(1), ...Array.from(eyrieSpans).slice(1)],
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.1,
            ease: "power2.out",
            stagger: 0.003,
          },
          0.05
        )
        .to(
          tChar,
          { x: () => getGapToClose().tMove, duration: 0.2, ease: "power2.inOut" },
          0.15
        )
        .to(
          eChar,
          { x: () => getGapToClose().eMove, duration: 0.2, ease: "power2.inOut" },
          0.15
        )
        .to({}, { duration: 0.1 }, 0.35)
        .set(
          teContainer,
          {
            opacity: 1,
            top: () => {
              const tRect = tChar.getBoundingClientRect();
              return tRect.top + tRect.height / 2;
            },
            left: () => {
              const tRect = tChar.getBoundingClientRect();
              const eRect = eChar.getBoundingClientRect();
              return (tRect.left + eRect.right) / 2;
            },
            xPercent: -50,
            yPercent: -50,
          },
          0.45
        )
        .set([tChar, eChar], { opacity: 0 }, 0.45)
        .to(secondPart, { opacity: 1, duration: 0.15, ease: "power2.out" }, 0.8)
        .to(firstPart, { opacity: 0, duration: 0.15, ease: "power2.in" }, 0.8)
        .to(
          teContainer,
          {
            top: () => {
              if (!secondPart) return "50%";
              const targetTE = secondPart.querySelector(".target-te-position");
              if (!targetTE) return "50%";
              const r = targetTE.getBoundingClientRect();
              return r.top + r.height / 2;
            },
            left: () => {
              if (!secondPart) return "50%";
              const targetTE = secondPart.querySelector(".target-te-position");
              if (!targetTE) return "50%";
              const r = targetTE.getBoundingClientRect();
              return r.left + r.width / 2;
            },
            xPercent: -50,
            yPercent: -50,
            scale: () => {
              if (!secondPart || !teContainer) return 1;
              const targetTE = secondPart.querySelector(".target-te-position");
              if (!targetTE) return 1;
              const currentSize = parseFloat(
                window.getComputedStyle(teContainer).fontSize
              );
              const targetSize = parseFloat(
                window.getComputedStyle(targetTE).fontSize
              );
              return targetSize / currentSize;
            },
            duration: 0.2,
            ease: "power2.inOut",
          },
          0.65
        )
        .set(teContainer, { opacity: 0 }, 0.85)
        .set(".target-te-position", { opacity: 1 }, 0.85)
        .to(
          ".build-title-line",
          {
            opacity: 1,
            y: 0,
            duration: 0.08,
            ease: "power3.out",
            stagger: 0.015,
          },
          0.85
        )
        .to(
          ".build-description",
          {
            opacity: 1,
            y: 0,
            duration: 0.06,
            ease: "power3.out",
            stagger: 0.01,
          },
          0.88
        )
        .to(
          ".build-cta",
          { opacity: 1, y: 0, duration: 0.04, ease: "power3.out" },
          0.91
        );

      return () => {
        if (teContainer?.parentNode) teContainer.parentNode.removeChild(teContainer);
      };
    }, section);

    return () => ctx.revert();
  }, [theme]);

  const { textPrimary } = getSurfaceClasses(theme);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: "185vh", background: bgStyle.background || bgStyle.backgroundColor }}
    >
      <section
        ref={sectionRef}
        className="dark7-v10-tech-eyrie relative overflow-hidden transition-colors duration-500 sticky top-0 h-screen"
        style={{ ...bgStyle, minHeight: "100vh" }}
      >
        <SectionOverlays />

        <div className="relative z-10">
          <div ref={firstPartRef} className="absolute inset-0 w-full h-full">
            <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8 h-full">
              <div className="py-0 text-center min-h-screen flex items-center justify-center">
                <div>
                  <div ref={thatsTheTextRef} className="mb-4 sm:mb-6 md:mb-8">
                    <span
                      className={`tech-eyrie-kicker font-playfair italic font-semibold transition-colors duration-500 ${textPrimary}`}
                    >
                      That&apos;s the
                    </span>
                  </div>
                  <div ref={techEyrieTextRef} className="relative">
                    <h2
                      className={`real-problem-title-line font-italiana font-light leading-[0.95] tracking-[0.01em] transition-colors duration-500 ${textPrimary}`}
                    >
                      <span className="tech-word">Tech</span>{" "}
                      <span className="eyrie-word">Eyrie</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={secondPartRef}
            className="absolute inset-0 w-full h-full opacity-0"
          >
            <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8 h-full">
              <div className="py-0 min-h-screen flex flex-col justify-center">
                <div className="mb-24">
                  <h2 className="leading-[1.05] tracking-[0.01em]">
                    <div
                      className={`build-title-line real-problem-title-line font-italiana font-light tracking-[0.01em] transition-colors duration-500 ${textPrimary}`}
                    >
                      <span className="target-te-position inline-block opacity-0">
                        TE
                      </span>{" "}
                      Build What
                    </div>
                    <div
                      className={`build-title-line real-problem-title-line font-playfair italic font-light transition-colors duration-500 ${textPrimary}`}
                    >
                      Others Can&apos;t
                    </div>
                    <div
                      className={`build-title-line real-problem-title-line font-playfair italic font-light transition-colors duration-500 ${textPrimary}`}
                    >
                      See Yet
                    </div>
                  </h2>
                </div>
                <div className="grid grid-cols-[38%_62%] -mt-48">
                  <div />
                  <div className="space-y-6 max-w-full pr-4 xl:pr-8">
                    <p
                      className="build-description font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-light leading-relaxed text-[#162D24] transition-colors duration-500"
                    >
                      In the fast moving world where technology becomes complex,
                      clarity is your biggest success. Here in Tech Eyrie we built
                      systems that dive through complexity combining AI- driven
                      automation, data and high- performance platforms into flawless
                      digital experiences.
                    </p>
                    <p
                      className="build-description font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-light leading-relaxed text-[#162D24] transition-colors duration-500"
                    >
                      No trends, only intelligent systems that lasts long.
                    </p>
                    <div className="build-cta pt-2">
                      <TechEyrieCtaLink className="mt-3 self-start" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ThatsTheTechEyrie2({ theme = "light" }) {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      setIsDesktop(mq.matches);
      if (!mq.matches) {
        document.querySelectorAll(".te-floating-container").forEach((el) => el.remove());
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!isDesktop) {
    return <MobileTechEyrieSection theme={theme} />;
  }

  return <DesktopTechEyrieSection theme={theme} />;
}
