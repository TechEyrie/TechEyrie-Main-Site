// ThatsTheTechEyrie2 – CSS sticky wrapper on desktop; static layout on mobile.
"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SCROLL_DISTANCE = "85vh";

const lightColors = { background: "#F9F7F0" };

function getBgStyle(theme) {
  return theme === "dark"
    ? {
        backgroundColor: "#162d24",
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
          radial-gradient(
            ellipse at 80% 60%,
            #005160 0%,
            #1b4732 45%,
            #162d24 100%
          )
        `,
        backgroundBlendMode: "overlay, normal",
      }
    : { backgroundColor: lightColors.background };
}

const noiseOverlayStyle = {
  backgroundImage: `
    repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
    repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
    repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.015) 2px, rgba(0, 0, 0, 0.015) 4px)
  `,
};

function SectionOverlays({ theme }) {
  if (theme !== "dark") return null;
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={noiseOverlayStyle}
      />
      <div
        className="absolute inset-x-0 top-0 h-28 sm:h-36 pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(22,45,36,0.7) 0%, rgba(22,45,36,0) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 sm:h-32 pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,81,96,0.45) 0%, rgba(0,81,96,0) 100%)",
        }}
      />
    </>
  );
}

function MobileTechEyrieSection({ theme }) {
  const bgStyle = getBgStyle(theme);
  const textPrimary = theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]";
  const textBody = theme === "dark" ? "text-[#d0d0d0]" : "text-[#212121]";
  const divider = theme === "dark" ? "border-white/10" : "border-black/10";

  return (
    <div className="relative w-full max-w-full min-w-0 overflow-x-clip">
      <section
        className="relative overflow-hidden transition-colors duration-500"
        style={bgStyle}
      >
        <SectionOverlays theme={theme} />

        <div className="relative z-10 w-full min-w-0">
          {/* Phase 1 */}
          <div className="mx-auto w-full min-w-0 max-w-[1800px] px-4 sm:px-6">
            <div className="py-14 sm:py-20 text-center">
              <div className="mb-4 sm:mb-6">
                <span
                  className={`font-playfair italic font-semibold text-[26px] sm:text-[32px] transition-colors duration-500 ${textPrimary}`}
                >
                  That&apos;s the
                </span>
              </div>
              <h2
                className={`font-italiana font-light text-[44px] sm:text-[56px] leading-[0.95] tracking-[0.01em] break-words transition-colors duration-500 ${textPrimary}`}
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
                  className={`font-italiana font-light text-[32px] sm:text-[40px] transition-colors duration-500 ${textPrimary}`}
                >
                  <span className="inline-block">TE</span> Build What
                </div>
                <div
                  className={`font-playfair italic font-semibold text-[32px] sm:text-[40px] transition-colors duration-500 ${textPrimary}`}
                >
                  Others Can&apos;t
                </div>
                <div
                  className={`font-playfair italic font-semibold text-[32px] sm:text-[40px] transition-colors duration-500 ${textPrimary}`}
                >
                  See Yet
                </div>
              </h2>

              <div className="mt-8 sm:mt-10 space-y-5 max-w-[600px] mx-auto sm:mx-0">
                <p
                  className={`font-merriweather font-light text-[14px] sm:text-[15px] leading-relaxed transition-colors duration-500 ${textBody}`}
                >
                  In the fast moving world where technology becomes complex,
                  clarity is your biggest success. Here in Tech Eyrie we built
                  systems that dive through complexity combining AI- driven
                  automation, data and high- performance platforms into flawless
                  digital experiences.
                </p>
                <p
                  className={`font-merriweather font-light text-[14px] sm:text-[15px] leading-relaxed transition-colors duration-500 ${textBody}`}
                >
                  No trends, only intelligent systems that lasts long.
                </p>
                <div className="pt-2 flex justify-center sm:justify-start">
                  <Link
                    href="/about"
                    className="group inline-flex items-center justify-center rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px]"
                    style={{ backgroundColor: "#12685b" }}
                  >
                    <span className="font-merriweather text-[13px] sm:text-[14px] font-semibold tracking-wide text-white">
                      Learn More About Us
                    </span>
                  </Link>
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
      tClone.className = techEyrieText
        .querySelector("h2")
        .className.replace("text-[56px]", "")
        .replace("sm:text-[72px]", "")
        .replace("md:text-[96px]", "")
        .replace("lg:text-[120px]", "")
        .replace("xl:text-[140px]", "")
        .replace("2xl:text-[160px]", "");
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
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: `top+=${SCROLL_DISTANCE} top`,
          scrub: 3,
          onUpdate: (self) => {
            const p = self.progress();
            if (p >= 0.92 && teContainer.parentNode !== section) moveTEToSection();
            else if (p < 0.92 && teContainer.parentNode === section) moveTEToBody();
          },
        },
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

  const textPrimary = theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]";
  const textBody = theme === "dark" ? "text-[#d0d0d0]" : "text-[#212121]";

  return (
    <div ref={wrapperRef} className="relative" style={{ height: "185vh" }}>
      <section
        ref={sectionRef}
        className="relative overflow-hidden transition-colors duration-500 sticky top-0 h-screen"
        style={{ ...bgStyle, minHeight: "100vh" }}
      >
        <SectionOverlays theme={theme} />

        <div className="relative z-10">
          <div ref={firstPartRef} className="absolute inset-0 w-full h-full">
            <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8 h-full">
              <div className="py-0 text-center min-h-screen flex items-center justify-center">
                <div>
                  <div ref={thatsTheTextRef} className="mb-4 sm:mb-6 md:mb-8">
                    <span
                      className={`font-playfair italic font-semibold text-[48px] xl:text-[52px] transition-colors duration-500 ${textPrimary}`}
                    >
                      That&apos;s the
                    </span>
                  </div>
                  <div ref={techEyrieTextRef} className="relative">
                    <h2
                      className={`font-italiana font-light text-[120px] xl:text-[140px] 2xl:text-[160px] leading-[0.95] tracking-[0.01em] transition-colors duration-500 ${textPrimary}`}
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
                      className={`build-title-line font-italiana font-light tracking-[0.01em] text-[72px] xl:text-[84px] 2xl:text-[96px] transition-colors duration-500 ${textPrimary}`}
                    >
                      <span className="target-te-position inline-block opacity-0">
                        TE
                      </span>{" "}
                      Build What
                    </div>
                    <div
                      className={`build-title-line font-playfair italic font-semibold text-[72px] xl:text-[84px] 2xl:text-[96px] transition-colors duration-500 ${textPrimary}`}
                    >
                      Others Can&apos;t
                    </div>
                    <div
                      className={`build-title-line font-playfair italic font-semibold text-[72px] xl:text-[84px] 2xl:text-[96px] transition-colors duration-500 ${textPrimary}`}
                    >
                      See Yet
                    </div>
                  </h2>
                </div>
                <div className="grid grid-cols-[45%_55%] -mt-40">
                  <div />
                  <div className="space-y-6 max-w-[600px]">
                    <p
                      className={`build-description font-merriweather font-light text-[15px] leading-relaxed transition-colors duration-500 ${textBody}`}
                    >
                      In the fast moving world where technology becomes complex,
                      clarity is your biggest success. Here in Tech Eyrie we built
                      systems that dive through complexity combining AI- driven
                      automation, data and high- performance platforms into flawless
                      digital experiences.
                    </p>
                    <p
                      className={`build-description font-merriweather font-light text-[15px] leading-relaxed transition-colors duration-500 ${textBody}`}
                    >
                      No trends, only intelligent systems that lasts long.
                    </p>
                    <div className="build-cta pt-2">
                      <Link
                        href="/about"
                        className="group inline-flex items-center justify-center self-start rounded-full px-6 py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px] mt-3"
                        style={{ backgroundColor: "#12685b" }}
                      >
                        <span className="font-merriweather text-[15px] font-semibold tracking-wide text-white">
                          Learn More About Us
                        </span>
                      </Link>
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
