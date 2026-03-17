"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function FeatherSilhouette({ isDark }) {
  const fillMain = isDark ? "rgba(243,243,243,0.16)" : "rgba(1,56,37,0.10)";
  const fillSoft = isDark ? "rgba(208,208,208,0.08)" : "rgba(158,143,114,0.08)";
  const vein = isDark ? "rgba(243,243,243,0.20)" : "rgba(1,56,37,0.16)";

  return (
    <svg viewBox="0 0 120 260" className="w-full h-full" aria-hidden="true">
      <g>
        <path
          d="
            M60 12
            C90 32 108 74 103 126
            C98 176 77 218 60 248
            C43 218 22 176 17 126
            C12 74 30 32 60 12Z
          "
          fill={fillSoft}
        />
        <path
          d="
            M60 18
            C82 34 95 72 91 121
            C87 164 73 203 60 228
            C47 203 33 164 29 121
            C25 72 38 34 60 18Z
          "
          fill={fillMain}
        />
        <path
          d="M60 20 C62 60 62 110 60 228"
          fill="none"
          stroke={vein}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M60 55 C74 49 82 44 90 36" fill="none" stroke={vein} strokeWidth="2" strokeLinecap="round" />
        <path d="M60 78 C74 72 85 64 94 54" fill="none" stroke={vein} strokeWidth="2" strokeLinecap="round" />
        <path d="M60 102 C75 96 87 88 96 77" fill="none" stroke={vein} strokeWidth="2" strokeLinecap="round" />
        <path d="M60 126 C74 121 86 113 95 103" fill="none" stroke={vein} strokeWidth="2" strokeLinecap="round" />
        <path d="M60 150 C73 146 83 139 91 130" fill="none" stroke={vein} strokeWidth="2" strokeLinecap="round" />
        <path d="M60 55 C46 49 38 44 30 36" fill="none" stroke={vein} strokeWidth="2" strokeLinecap="round" />
        <path d="M60 78 C46 72 35 64 26 54" fill="none" stroke={vein} strokeWidth="2" strokeLinecap="round" />
        <path d="M60 102 C45 96 33 88 24 77" fill="none" stroke={vein} strokeWidth="2" strokeLinecap="round" />
        <path d="M60 126 C46 121 34 113 25 103" fill="none" stroke={vein} strokeWidth="2" strokeLinecap="round" />
        <path d="M60 150 C47 146 37 139 29 130" fill="none" stroke={vein} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function DeepJudgeAnimation({ theme }) {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const circleBgRefs = useRef([]);
  const circleContentRefs = useRef([]);
  const centerOrbRef = useRef(null);
  const searchFieldRef = useRef(null);
  const heading1Ref = useRef(null);
  const heading2Ref = useRef(null);
  const description2Ref = useRef(null);
  const heading3Ref = useRef(null);
  const description3Ref = useRef(null);

  const featherLayerRef = useRef(null);
  const featherOuterRefs = useRef([]);
  const featherInnerRefs = useRef([]);

  const isDark = theme === "dark";

  const lightColors = {
    primary: "#013825",
    secondary: "#9E8F72",
    tertiary: "#CEC8B0",
    background: "#F9F7F0",
    cardBg: "#F4F2EF",
    cardShadow: "#DCDAD7",
  };

  const textColor = isDark ? "text-[#f3f3f3]" : "text-slate-900";
  const subtitleColor = isDark ? "text-[#a0a0a0]" : "text-slate-600";
  const circleBlobColor = isDark ? "bg-neutral-800/80 border-neutral-700/50" : "";
  const circleBlobStyle = isDark
    ? {}
    : {
        backgroundColor: `${lightColors.tertiary}B3`,
        borderColor: `${lightColors.tertiary}66`,
      };
  const subTextColor = isDark ? "text-[#a0a0a0]" : "text-slate-600";
  const cardBg = isDark ? "bg-neutral-900/95 border-neutral-800" : "bg-white/95 border-gray-200";
  const cardBgStyle = isDark
    ? {}
    : {
        backgroundColor: `${lightColors.background}F2`,
        borderColor: `${lightColors.tertiary}80`,
      };
  const cardTitle = isDark ? "text-[#f3f3f3]" : "text-slate-900";
  const cardDesc = isDark ? "text-[#d0d0d0]" : "text-slate-500";
  const badgeBg = isDark ? "bg-neutral-800 text-white" : "";
  const badgeBgStyle = isDark ? {} : { backgroundColor: lightColors.tertiary, color: "#1a1a1a" };

  const featherItems = [
    { left: "4%", top: "10%", size: 28, rotate: -26, opacity: 0.07, scale: 0.72, depth: 1 },
    { left: "9%", top: "22%", size: 40, rotate: -18, opacity: 0.1, scale: 0.86, depth: 2 },
    { left: "6%", top: "42%", size: 32, rotate: 14, opacity: 0.08, scale: 0.75, depth: 1 },
    { left: "14%", top: "64%", size: 54, rotate: -12, opacity: 0.14, scale: 1.0, depth: 3 },
    { left: "10%", top: "84%", size: 30, rotate: 18, opacity: 0.07, scale: 0.72, depth: 1 },

    { left: "20%", top: "14%", size: 34, rotate: 22, opacity: 0.08, scale: 0.78, depth: 1 },
    { left: "24%", top: "30%", size: 46, rotate: -8, opacity: 0.12, scale: 0.92, depth: 2 },
    { left: "28%", top: "50%", size: 38, rotate: 12, opacity: 0.09, scale: 0.82, depth: 1 },
    { left: "23%", top: "74%", size: 58, rotate: -24, opacity: 0.15, scale: 1.06, depth: 3 },

    { left: "34%", top: "12%", size: 42, rotate: 10, opacity: 0.1, scale: 0.88, depth: 2 },
    { left: "38%", top: "24%", size: 26, rotate: -16, opacity: 0.06, scale: 0.68, depth: 1 },
    { left: "42%", top: "44%", size: 36, rotate: 20, opacity: 0.08, scale: 0.8, depth: 1 },
    { left: "36%", top: "68%", size: 52, rotate: -20, opacity: 0.13, scale: 0.98, depth: 2 },
    { left: "44%", top: "86%", size: 30, rotate: 14, opacity: 0.07, scale: 0.7, depth: 1 },

    { left: "50%", top: "8%", size: 48, rotate: -10, opacity: 0.11, scale: 0.94, depth: 2 },
    { left: "56%", top: "22%", size: 62, rotate: 16, opacity: 0.16, scale: 1.1, depth: 3 },
    { left: "52%", top: "54%", size: 34, rotate: -14, opacity: 0.08, scale: 0.78, depth: 1 },
    { left: "58%", top: "76%", size: 44, rotate: 24, opacity: 0.1, scale: 0.88, depth: 2 },

    { left: "66%", top: "14%", size: 30, rotate: 18, opacity: 0.07, scale: 0.72, depth: 1 },
    { left: "70%", top: "34%", size: 56, rotate: -22, opacity: 0.14, scale: 1.02, depth: 3 },
    { left: "64%", top: "58%", size: 38, rotate: 8, opacity: 0.09, scale: 0.82, depth: 1 },
    { left: "72%", top: "84%", size: 32, rotate: -12, opacity: 0.07, scale: 0.74, depth: 1 },

    { left: "80%", top: "18%", size: 40, rotate: 26, opacity: 0.1, scale: 0.86, depth: 2 },
    { left: "86%", top: "42%", size: 50, rotate: -18, opacity: 0.12, scale: 0.96, depth: 2 },
    { left: "82%", top: "68%", size: 28, rotate: 12, opacity: 0.06, scale: 0.68, depth: 1 },

    { left: "92%", top: "12%", size: 34, rotate: 30, opacity: 0.08, scale: 0.76, depth: 1 },
    { left: "95%", top: "28%", size: 46, rotate: -14, opacity: 0.11, scale: 0.9, depth: 2 },
    { left: "90%", top: "56%", size: 36, rotate: 16, opacity: 0.08, scale: 0.8, depth: 1 },
    { left: "94%", top: "82%", size: 54, rotate: -24, opacity: 0.14, scale: 1.0, depth: 3 },
  ];

  useLayoutEffect(() => {
    let cleanupPointer = () => {};
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add(
        {
          isDesktop: "(min-width: 810px)",
          isTablet: "(min-width: 630px) and (max-width: 809px)",
          isMobile: "(max-width: 629px)",
        },
        (context) => {
          const { isDesktop, isTablet, isMobile } = context.conditions;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top top",
              end: "+=4000",
              scrub: 1,
              pin: true,
            },
          });

          const calculatePosition = (i) => {
            let x = 0;
            let y = 0;

            if (isDesktop) {
              const isTop = i < 4;
              const colIndex = i % 4;
              const spread = 280;
              const xOffset = -420 + colIndex * spread;
              const yBase = isTop ? -300 : 280;
              const isOuter = colIndex === 0 || colIndex === 3;
              const push = 120;
              let yOffset = yBase;

              if (isTop) {
                if (isOuter) yOffset += push;
              } else {
                if (isOuter) yOffset -= push;
              }

              x = xOffset;
              y = yOffset;
            } else if (isTablet) {
              const angleDeg = i * (360 / 8) - 90;
              const angleRad = (angleDeg * Math.PI) / 180;
              const rx = 180;
              const ry = 450;
              x = Math.cos(angleRad) * rx;
              y = Math.sin(angleRad) * ry;

              if (i === 2) {
                x = 260;
                y = -200;
              } else if (i === 6) {
                x = -260;
                y = -200;
              }
            } else {
              const angleDeg = i * (360 / 8) - 90;
              const angleRad = (angleDeg * Math.PI) / 180;
              const rx = 140;
              const ry = 400;
              x = Math.cos(angleRad) * rx;
              y = Math.sin(angleRad) * ry;

              if (i === 2) {
                x = 220;
                y = -160;
              } else if (i === 6) {
                x = -220;
                y = -160;
              }
            }

            return { x, y };
          };

          circleBgRefs.current.forEach((el, i) => {
            if (!el) return;
            const pos = calculatePosition(i);
            gsap.set(el, { x: pos.x, y: pos.y, scale: 1, opacity: 1 });
          });

          circleContentRefs.current.forEach((el, i) => {
            if (!el) return;
            const pos = calculatePosition(i);
            gsap.set(el, { x: pos.x, y: pos.y, scale: 1, opacity: 1 });
          });

          featherOuterRefs.current.forEach((el, i) => {
            if (!el) return;
            const item = featherItems[i];
            const depthScale = isMobile ? item.scale * 0.92 : item.scale;

            gsap.set(el, {
              xPercent: -50,
              yPercent: -50,
              x: 0,
              y: 0,
              rotate: item.rotate,
              scale: depthScale,
              opacity: item.opacity,
              transformOrigin: "50% 50%",
              willChange: "transform, opacity",
            });
          });

          featherInnerRefs.current.forEach((el, i) => {
            if (!el) return;
            const item = featherItems[i];
            const dir = i % 2 === 0 ? 1 : -1;

            const floatY =
              item.depth === 3 ? (isMobile ? 12 : 20) :
              item.depth === 2 ? (isMobile ? 8 : 14) :
              (isMobile ? 5 : 9);

            const floatX =
              item.depth === 3 ? (isMobile ? 5 : 9) :
              item.depth === 2 ? (isMobile ? 4 : 7) :
              (isMobile ? 3 : 5);

            const rot =
              item.depth === 3 ? (isMobile ? 5 : 8) :
              item.depth === 2 ? (isMobile ? 4 : 6) :
              (isMobile ? 2 : 4);

            const duration =
              item.depth === 3 ? 4.8 + (i % 3) * 0.5 :
              item.depth === 2 ? 4.0 + (i % 3) * 0.45 :
              3.4 + (i % 3) * 0.4;

            gsap.to(el, {
              y: dir * floatY,
              x: -dir * floatX,
              rotate: dir * rot,
              duration,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });

          gsap.to(featherOuterRefs.current, {
            y: (i) => {
              const item = featherItems[i];
              const drift =
                item.depth === 3
                  ? isMobile
                    ? 95
                    : isTablet
                    ? 130
                    : 170
                  : item.depth === 2
                  ? isMobile
                    ? 68
                    : isTablet
                    ? 95
                    : 120
                  : isMobile
                  ? 42
                  : isTablet
                  ? 56
                  : 74;

              return drift + ((i % 3) - 1) * (isMobile ? 10 : 18);
            },
            x: (i) => {
              const item = featherItems[i];
              const drift =
                item.depth === 3 ? (isMobile ? 16 : 30) :
                item.depth === 2 ? (isMobile ? 11 : 20) :
                (isMobile ? 7 : 12);

              return i % 2 === 0 ? drift : -drift;
            },
            rotate: (i) => {
              const item = featherItems[i];
              const driftRot =
                item.depth === 3 ? (isMobile ? 14 : 22) :
                item.depth === 2 ? (isMobile ? 10 : 16) :
                (isMobile ? 6 : 10);

              return item.rotate + (i % 2 === 0 ? driftRot : -driftRot);
            },
            opacity: (i) => {
              const item = featherItems[i];
              return Math.min(
                item.opacity + (item.depth === 3 ? 0.06 : item.depth === 2 ? 0.04 : 0.025),
                0.24
              );
            },
            ease: "none",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top top",
              end: "+=4000",
              scrub: 1,
            },
          });

          tl.to(circleContentRefs.current, { opacity: 0, scale: 0.5, duration: 1 }, "stage1")
            .to(
              circleBgRefs.current,
              {
                x: 0,
                y: 0,
                scale: 0.2,
                duration: 2,
                ease: "power2.inOut",
              },
              "stage1"
            )
            .to(heading1Ref.current, { opacity: 0, y: -50, duration: 1 }, "stage1")
            .to(circleBgRefs.current, { opacity: 0, duration: 0.1 }, "stage1+=1.9")
            .fromTo(
              centerOrbRef.current,
              { width: 0, height: 0, opacity: 1, backgroundColor: "#FFFFFF" },
              { width: 20, height: 20, opacity: 1, duration: 0.2 },
              "stage1+=1.9"
            );

          tl.to({}, { duration: 0.5 });

          const fieldWidth = isDesktop ? "600px" : "85vw";
          const headingY = isDesktop ? -120 : -220;
          const descriptionY = isDesktop ? -120 : -90;
          const fieldY = isDesktop ? 140 : 100;

          tl.fromTo(
            heading2Ref.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: headingY, duration: 1 },
            "stage2"
          );

          tl.fromTo(
            description2Ref.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: descriptionY, duration: 1 },
            "stage2+=0.3"
          );

          tl.to(
            centerOrbRef.current,
            {
              width: fieldWidth,
              height: "64px",
              borderRadius: "32px",
              backgroundColor: "#FFFFFF",
              y: fieldY,
              duration: 1.5,
              ease: "power2.inOut",
            },
            "stage2"
          ).to(searchFieldRef.current, { opacity: 1, duration: 0.5 }, "stage2+=1.2");

          tl.to({}, { duration: 1 });

          tl.to(searchFieldRef.current, { opacity: 0, duration: 0.5 }, "stage3")
            .to(
              centerOrbRef.current,
              {
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                y: 0,
                duration: 1,
                ease: "power3.inOut",
              },
              "stage3"
            )
            .to(
              [heading2Ref.current, description2Ref.current],
              { opacity: 0, y: -150, duration: 1 },
              "stage3"
            );

          const cardWidth = isDesktop ? "280px" : isTablet ? "260px" : "85vw";
          const cardHeight = isDesktop ? "320px" : isTablet ? "300px" : "280px";
          const heading3Y = isDesktop ? -200 : -320;
          const description3Y = isDesktop ? -200 : -200;

          tl.fromTo(
            heading3Ref.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: heading3Y, duration: 1 },
            "stage4"
          );

          tl.fromTo(
            description3Ref.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: description3Y, duration: 1 },
            "stage4+=0.3"
          );

          tl.to(centerOrbRef.current, { width: 30, height: 30, duration: 0.2 }, "stage4");

          const cards = gsap.utils.toArray(".feature-card");

          tl.set(cards, { opacity: 1, scale: 0.2 }, "stage4+=0.1").to(
            centerOrbRef.current,
            { opacity: 0, duration: 0.1 },
            "stage4+=0.2"
          );

          tl.to(
            cards,
            {
              width: cardWidth,
              height: cardHeight,
              borderRadius: "16px",
              backgroundColor: isDark ? "rgba(23, 23, 23, 0.95)" : "rgba(255, 255, 255, 0.95)",
              scale: 1,
              left: (i) => {
                if (isMobile) return "50%";
                if (isTablet) return i % 2 === 0 ? "30%" : "70%";
                const positions = ["15%", "32.5%", "50%", "67.5%", "85%"];
                return positions[i];
              },
              top: (i) => {
                if (isMobile) {
                  const startTop = 20;
                  return `${startTop + i * 16}%`;
                }
                if (isTablet) {
                  const row = Math.floor(i / 2);
                  const startTop = 35;
                  return `${startTop + row * 28}%`;
                }
                return "65%";
              },
              xPercent: -50,
              yPercent: -50,
              duration: 1.5,
              stagger: 0.1,
              ease: "expo.out",
            },
            "stage4+=0.2"
          );

          tl.to(".card-content", { opacity: 1, duration: 0.5 }, "stage4+=1");
        }
      );

      const container = containerRef.current;
      const featherLayer = featherLayerRef.current;

      if (container && featherLayer && window.matchMedia("(pointer:fine)").matches) {
        const xTo = gsap.quickTo(featherLayer, "x", { duration: 0.8, ease: "power3.out" });
        const yTo = gsap.quickTo(featherLayer, "y", { duration: 0.8, ease: "power3.out" });

        const handleMove = (e) => {
          const rect = container.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          xTo(px * 20);
          yTo(py * 20);
        };

        const handleLeave = () => {
          xTo(0);
          yTo(0);
        };

        container.addEventListener("pointermove", handleMove);
        container.addEventListener("pointerleave", handleLeave);

        cleanupPointer = () => {
          container.removeEventListener("pointermove", handleMove);
          container.removeEventListener("pointerleave", handleLeave);
        };
      }
    }, containerRef);

    return () => {
      cleanupPointer();
      mm.revert();
      ctx.revert();
    };
  }, [isDark]);

  const circleItems = [
    {
      text: "Artificial Intelligence",
      barcode:
        "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8f96866dde7aebec6949e_DeepJudge%20Frame%20634185.svg",
    },
    {
      text: "Automation",
      barcode:
        "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8fd519a08abfc193a45b1_DeepJudge%20Frame%20634185%20(1).svg",
    },
    {
      text: "ERP",
      barcode:
        "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8fe569ae8d17d933a3c60_DeepJudge%20Frame%20634185%20(2).svg",
    },
    {
      text: "Cloud API's",
      barcode:
        "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8f96866dde7aebec6949e_DeepJudge%20Frame%20634185.svg",
    },
    {
      text: "Web",
      barcode:
        "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8fd519a08abfc193a45b1_DeepJudge%20Frame%20634185%20(1).svg",
    },
    {
      text: "Email",
      barcode:
        "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8fe569ae8d17d933a3c60_DeepJudge%20Frame%20634185%20(2).svg",
    },
    {
      text: "Data",
      barcode:
        "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8f96866dde7aebec6949e_DeepJudge%20Frame%20634185.svg",
    },
    {
      text: "Deep Search",
      barcode:
        "https://cdn.prod.website-files.com/67bdd03200678df04ba07593/67f8fd519a08abfc193a45b1_DeepJudge%20Frame%20634185%20(1).svg",
    },
  ];

  const bgStyle =
    theme === "dark"
      ? {
          backgroundColor: "#162d24",
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
            radial-gradient(
              ellipse at 60% 80%,
              rgba(117, 133, 53, 0.5) 0%,
              rgba(27, 71, 50, 0.4) 40%,
              rgba(22, 45, 36, 0.92) 100%
            )
          `,
          backgroundBlendMode: "overlay, normal",
        }
      : { backgroundColor: lightColors.background };

  return (
    <main
      ref={containerRef}
      style={bgStyle}
      className="relative min-h-screen overflow-x-hidden transition-colors duration-500"
    >
      {theme === "dark" && (
        <>
          <div
            className="absolute inset-x-0 top-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[2]"
            style={{
              background: "linear-gradient(to bottom, #162d24 0%, rgba(22,45,36,0) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[2]"
            style={{
              background: "linear-gradient(to top, #162d24 0%, rgba(22,45,36,0) 100%)",
            }}
          />
        </>
      )}

      <div
        ref={wrapperRef}
        className="h-screen w-full relative flex items-center justify-center overflow-hidden"
      >
        <div
          ref={featherLayerRef}
          className="absolute inset-0 z-[3] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {featherItems.map((item, i) => (
            <div
              key={`feather-${i}`}
              className="absolute"
              style={{
                left: item.left,
                top: item.top,
                width: `${item.size}px`,
                height: `${Math.round(item.size * 2.15)}px`,
              }}
            >
              <div
                ref={(el) => (featherOuterRefs.current[i] = el)}
                className="w-full h-full"
              >
                <div
                  ref={(el) => (featherInnerRefs.current[i] = el)}
                  className="w-full h-full"
                  style={{
                    filter:
                      item.depth === 3
                        ? isDark
                          ? "drop-shadow(0 0 24px rgba(243,243,243,0.08))"
                          : "drop-shadow(0 0 20px rgba(1,56,37,0.06))"
                        : item.depth === 2
                        ? isDark
                          ? "drop-shadow(0 0 16px rgba(243,243,243,0.05))"
                          : "drop-shadow(0 0 12px rgba(1,56,37,0.04))"
                        : "none",
                  }}
                >
                  <FeatherSilhouette isDark={isDark} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[25] px-4 sm:px-6">
          <div className="text-center">
            <h1
              ref={heading1Ref}
              className={`font-italiana font-light text-[22px] sm:text-[28px] md:text-[34px] lg:text-[39px] xl:text-[45px] ${textColor} tracking-[0.01em] leading-[1.1] max-w-5xl transition-colors duration-500`}
            >
              <span className="font-normal">
                Your business runs on
                <br />
                systems and data
              </span>
              <br />
              <span className="font-playfair italic font-semibold">
                But they're fragmented,
                <br />
                manual, and under-utilized
              </span>
            </h1>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1
              ref={heading2Ref}
              className={`font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] text-center ${textColor} tracking-[0.01em] leading-[1.15] opacity-0 transition-colors duration-500 z-[26] px-4 max-w-4xl`}
            >
              <span className="font-normal">
                Design systems that work the
                <br />
                way your{" "}
              </span>
              <span className="font-playfair italic font-semibold">business works</span>
            </h1>

            <p
              ref={description2Ref}
              className={`font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] ${subtitleColor} opacity-0 max-w-3xl px-6 leading-relaxed transition-colors duration-500 z-[26] text-center mt-8 sm:mt-10 md:mt-12`}
            >
              Empower your organization with intelligent platforms built around your real workflows not generic tools.
              Tech Eyrie designs and engineers AI-powered systems, automation, and digital platforms that connect your
              data, processes, and people into one scalable foundation. No unnecessary complexity. No rigid templates.
              Just thoughtfully engineered solutions built for clarity, speed, and growth.
            </p>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1
              ref={heading3Ref}
              className={`font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] text-center ${textColor} tracking-[0.01em] leading-[1.15] opacity-0 transition-colors duration-500 z-[26] px-4 max-w-4xl`}
            >
              <span className="font-normal">We don't jump straight into </span>
              <span className="font-playfair italic font-semibold">building.</span>
            </h1>

            <p
              ref={description3Ref}
              className={`font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] ${subtitleColor} opacity-0 max-w-3xl px-6 leading-relaxed transition-colors duration-500 z-[26] text-center mt-8 sm:mt-10 md:mt-12`}
            >
              Our process is designed to understand your business, architect the right solution, and engineer systems
              that evolve as you grow — powered by AI, automation, and modern technology.
            </p>
          </div>
        </div>

        <div className="relative w-full h-full z-10">
          {circleItems.map((item, i) => (
            <React.Fragment key={i}>
              <div
                ref={(el) => (circleBgRefs.current[i] = el)}
                className={`circle-bg absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 ${circleBlobColor} backdrop-blur-xl shadow-xl rounded-xl sm:rounded-2xl z-[5] transition-colors duration-500 border`}
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  ...circleBlobStyle,
                }}
              />

              <div
                ref={(el) => (circleContentRefs.current[i] = el)}
                className="circle-content absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex flex-col items-center justify-center z-[15] gap-1 sm:gap-2 pointer-events-none px-1"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span
                  className={`text-[8px] sm:text-[9px] md:text-[12px] font-bold ${subTextColor} text-center leading-tight uppercase tracking-wide`}
                >
                  {item.text}
                </span>
                <img
                  src={item.barcode}
                  alt=""
                  className="w-10 h-4 sm:w-12 sm:h-5 md:w-14 md:h-6 object-contain"
                />
              </div>
            </React.Fragment>
          ))}

          <div
            ref={centerOrbRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-30 flex items-center justify-center overflow-hidden shadow-2xl"
            style={{
              width: "0px",
              height: "0px",
              opacity: 0,
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div ref={searchFieldRef} className="flex items-center w-full px-3 sm:px-4 md:px-5 lg:px-6 opacity-0">
              <Search
                className="text-[#a0a0a0] mr-2 sm:mr-3 md:mr-4 shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                size={24}
              />
              <span className="font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] text-[#a0a0a0] font-normal truncate">
                Ask anything about your data...
              </span>
            </div>
          </div>

          {[
            {
              title: "Discovery",
              desc: "We analyze your workflows, pain points, and business goals to understand what you really need.",
            },
            {
              title: "Architecture",
              desc: "We design scalable, secure systems tailored to your operations — no one-size-fits-all templates.",
            },
            {
              title: "Engineering",
              desc: "We build AI-powered platforms, automation workflows, and custom solutions using modern technology.",
            },
            {
              title: "Integration",
              desc: "We connect your tools, data sources, and teams into unified, intelligent systems.",
            },
            {
              title: "Evolution",
              desc: "We ensure your systems adapt and scale as your business grows, with ongoing support and optimization.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`feature-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${cardBg} shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden backdrop-blur-sm z-20 transition-colors duration-500 border`}
              style={{
                width: "0px",
                height: "0px",
                opacity: 0,
                borderRadius: "50%",
                ...cardBgStyle,
              }}
            >
              <div className="card-content opacity-0 p-5 sm:p-6 md:p-7 flex flex-col h-full">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 ${badgeBg} rounded-xl flex items-center justify-center font-bold mb-4 sm:mb-5 shrink-0 text-lg sm:text-xl`}
                  style={badgeBgStyle}
                >
                  {i + 1}
                </div>
                <h3 className={`font-italiana font-light text-[18px] sm:text-[20px] md:text-[22px] ${cardTitle} mb-3 sm:mb-4`}>
                  {card.title}
                </h3>
                <p className={`font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] leading-relaxed ${cardDesc}`}>
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
