// components/TechEyrieIntroSection.jsx
"use client";


import { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


export default function TechEyrieIntroSection({ theme = "light" }) {
  const sectionRef = useRef(null);
  const firstPartRef = useRef(null);
  const secondPartRef = useRef(null);
  const techEyrieTextRef = useRef(null);
  const thatsTheTextRef = useRef(null);


  const lightColors = {
    background: "#F9F7F0",
  };


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
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.015) 2px, rgba(0, 0, 0, 0.015) 4px)
    `,
  };


  useLayoutEffect(() => {
    const section = sectionRef.current;
    const firstPart = firstPartRef.current;
    const secondPart = secondPartRef.current;
    const techEyrieText = techEyrieTextRef.current;
    const thatsTheText = thatsTheTextRef.current;


    if (!section || !firstPart || !secondPart || !techEyrieText || !thatsTheText) return;


    const ctx = gsap.context(() => {
      // Initial entrance animations
      gsap.set([thatsTheText, techEyrieText], { opacity: 0, y: 30 });


      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: firstPart,
          start: "top 70%",
          end: "top 30%",
          once: true,
        },
      });


      entranceTl
        .to(thatsTheText, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        })
        .to(
          techEyrieText,
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.7"
        );


      // Wait for entrance animation
      setTimeout(() => {
        const targetTE = document.querySelector(".target-te-position");

        if (!targetTE) return;


        // Split the words into characters
        const techWord = techEyrieText.querySelector(".tech-word");
        const eyrieWord = techEyrieText.querySelector(".eyrie-word");

        if (!techWord || !eyrieWord) return;


        const techChars = techWord.textContent.split("");
        const eyrieChars = eyrieWord.textContent.split("");


        // Wrap each character in a span
        techWord.innerHTML = techChars
          .map((char, i) =>
            `<span class="char-${i}" style="display: inline-block;">${char === " " ? "&nbsp;" : char}</span>`
          )
          .join("");


        eyrieWord.innerHTML = eyrieChars
          .map((char, i) =>
            `<span class="char-${i}" style="display: inline-block;">${char === " " ? "&nbsp;" : char}</span>`
          )
          .join("");


        const techSpans = techWord.querySelectorAll("span");
        const eyrieSpans = eyrieWord.querySelectorAll("span");


        // Get T and E letters
        const tChar = techSpans[0];
        const eChar = eyrieSpans[0];


        // Create a fixed container for T and E
        const teContainer = document.createElement("div");
        teContainer.className = "te-container";
        teContainer.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          gap: 0;
          pointer-events: none;
          opacity: 0;
          z-index: 100;
          font-size: ${window.getComputedStyle(techEyrieText.querySelector('h2')).fontSize};
        `;

        const tClone = document.createElement("span");
        const eClone = document.createElement("span");

        tClone.textContent = "T";
        eClone.textContent = "E";

        tClone.className = techEyrieText.querySelector('h2').className;
        eClone.className = techEyrieText.querySelector('h2').className;

        tClone.style.cssText = `display: inline-block;`;
        eClone.style.cssText = `display: inline-block;`;

        teContainer.appendChild(tClone);
        teContainer.appendChild(eClone);
        document.body.appendChild(teContainer);


        // Main scroll-based transformation timeline
       const mainTl = gsap.timeline({
  scrollTrigger: {
    trigger: firstPart,
    start: "top top",
    end: "+=100%", // ✅ Reduced from 200% to 150%
    pin: true,
    scrub: 2,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    pinSpacing: true, // ✅ Make sure spacing is enabled
  },
});


        // Hide target TE initially
        gsap.set(targetTE, { opacity: 0 });


        // Calculate distances
        const getTargetDistances = () => {
          const targetRect = targetTE.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;

          return {
            x: (targetRect.left + targetRect.width / 2) - (viewportWidth / 2),
            y: targetRect.top - (viewportHeight * 0.5)
          };
        };


        // Animation sequence
        mainTl
          // Step 1: Fade out "That's the" (0 - 0.15)
          .to(
            thatsTheText,
            {
              opacity: 0,
              y: -20,
              duration: 0.15,
              ease: "none",
            },
            0
          )
          // Step 2: Fade out all characters except T and E (0.1 - 0.3)
          .to(
            [...Array.from(techSpans).slice(1), ...Array.from(eyrieSpans).slice(1)],
            {
              opacity: 0,
              scale: 0.8,
              duration: 0.2,
              ease: "none",
              stagger: 0.01,
            },
            0.1
          )
          // Step 3: Move T to center (0.25 - 0.45)
          .to(
            tChar,
            {
              x: () => {
                const tRect = tChar.getBoundingClientRect();
                const viewportCenterX = window.innerWidth / 2;
                const tCenterX = tRect.left + tRect.width / 2;
                return viewportCenterX - tCenterX - tRect.width / 2;
              },
              y: 0,
              duration: 0.2,
              ease: "none",
            },
            0.25
          )
          // Step 4: Move E to center next to T (0.25 - 0.45)
          .to(
            eChar,
            {
              x: () => {
                const tRect = tChar.getBoundingClientRect();
                const eRect = eChar.getBoundingClientRect();
                const viewportCenterX = window.innerWidth / 2;
                const eCenterX = eRect.left + eRect.width / 2;
                return viewportCenterX - eCenterX + tRect.width / 2 + 5;
              },
              y: 0,
              duration: 0.2,
              ease: "none",
            },
            0.25
          )
          // Step 5: Hold T and E together (0.45 - 0.6)
          .to({}, { duration: 0.15 }, 0.45)
          // Step 6: Transition to container (0.6 - 0.65)
          .to(
            [tChar, eChar],
            {
              opacity: 0,
              duration: 0.05,
              ease: "none",
            },
            0.6
          )
          .to(
            teContainer,
            {
              opacity: 1,
              duration: 0.05,
              ease: "none",
            },
            0.6
          )
          // Step 7: Move TE diagonally (LEFT + DOWN) to target position (0.65 - 1.8)
          .to(
            teContainer,
            {
              x: () => getTargetDistances().x,
              y: () => getTargetDistances().y,
              scale: () => {
                const targetRect = targetTE.getBoundingClientRect();
                const teHeight = parseFloat(window.getComputedStyle(teContainer).fontSize);
                return (targetRect.height / teHeight) * 0.9;
              },
              duration: 1.15,
              ease: "none",
            },
            0.65
          )
          // Step 8: Fade out and reveal target (1.8 - 1.9)
          .to(
            teContainer,
            {
              opacity: 0,
              duration: 0.1,
              ease: "none",
            },
            1.8
          )
          .to(
            targetTE,
            {
              opacity: 1,
              duration: 0.1,
              ease: "none",
            },
            1.8
          );


        // Cleanup
        return () => {
          if (teContainer && teContainer.parentNode) {
            teContainer.parentNode.removeChild(teContainer);
          }
        };
      }, 1500);


      // Second Part Animation
      gsap.set([".build-title-line", ".build-description", ".build-cta"], {
        opacity: 0,
        y: 40,
      });


      const buildTl = gsap.timeline({
        scrollTrigger: {
          trigger: secondPart,
          start: "top 65%",
          end: "top 25%",
          once: true,
        },
      });


      buildTl
        .to(".build-title-line", {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.15,
        })
        .to(
          ".build-description",
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.6"
        )
        .to(
          ".build-cta",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        );
    }, section);


    return () => ctx.revert();
  }, [theme]);


  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden transition-colors duration-500"
      style={bgStyle}
    >
      {theme === "dark" && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={noiseOverlayStyle}
        />
      )}


      <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8">
        {/* First Part: "That's the Tech Eyrie" */}
        <div
          ref={firstPartRef}
          className="relative py-32 sm:py-40 md:py-48 lg:py-56 xl:py-64 text-center min-h-screen flex items-center justify-center"
        >
          <div>
            {/* "That's the" */}
            <div ref={thatsTheTextRef} className="mb-4 sm:mb-6 md:mb-8">
              <span
                className={`font-playfair italic font-semibold text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[52px] transition-colors duration-500 ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                  }`}
              >
                That's the
              </span>
            </div>


            {/* "Tech Eyrie" */}
            <div ref={techEyrieTextRef} className="relative">
              <h2
                className={`font-italiana font-light text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] xl:text-[140px] 2xl:text-[160px] leading-[0.95] tracking-tight transition-colors duration-500 ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                  }`}
              >
                <span className="tech-word">Tech</span>{" "}
                <span className="eyrie-word">Eyrie</span>
              </h2>
            </div>
          </div>
        </div>


        {/* Second Part */}
        <div
          ref={secondPartRef}
          className="py-20 sm:py-24 md:py-32 lg:py-40 xl:py-48"
        >
          <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            <h2 className="leading-[1.05] tracking-tight">
              <div
                className={`build-title-line font-italiana font-light text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] xl:text-[84px] 2xl:text-[96px] transition-colors duration-500 ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                  }`}
              >
                <span className="target-te-position inline-block">TE</span> Build What
              </div>


              <div
                className={`build-title-line font-playfair italic font-semibold text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] xl:text-[84px] 2xl:text-[96px] transition-colors duration-500 ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                  }`}
              >
                Others Can't
              </div>


              <div
                className={`build-title-line font-playfair italic font-semibold text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] xl:text-[84px] 2xl:text-[96px] transition-colors duration-500 ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                  }`}
              >
                See Yet
              </div>
            </h2>
          </div>


          <div className="grid lg:grid-cols-[45%_55%] lg:-mt-40">
            <div></div>
            <div className="space-y-6">
              <p
                className={`build-description font-merriweather font-light text-[12px] lg:text-[15px] leading-relaxed transition-colors duration-500 ${theme === "dark" ? "text-[#d0d0d0]" : "text-[#212121]"
                  }`}
              >
                We're a technology studio focused on turning complexity into clarity. From AI-driven automation to high-performance digital platforms, we design systems that help businesses move faster, think smarter, and scale with confidence.
              </p>


              <p
                className={`build-description font-merriweather font-light text-[12px] lg:text-[15px] leading-relaxed transition-colors duration-500 ${theme === "dark" ? "text-[#d0d0d0]" : "text-[#212121]"
                  }`}
              >
                We don't chase trends — we engineer foundations built to last.
              </p>


              <div className="build-cta pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-5 py-2.5 text-[12px] font-light text-white bg-[#2D6A5A] hover:bg-[#245548] rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Learn More About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
