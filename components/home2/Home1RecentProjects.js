"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FILTERS = ["ALL", "REAL ESTATE", "LOGISTICS", "PORTFOLIO", "PRODUCT", "WEB3 & NFT"];

const PROJECTS = [
  {
    id: 1,
    title: "MILK & DVASH",
    category: "REAL ESTATE",
    year: "2026",
    status: null,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 2,
    title: "FAMILIA",
    category: "PRODUCT",
    year: null,
    status: "COMING SOON",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 3,
    title: "AXIOM",
    category: "PRODUCT",
    year: null,
    status: "COMING SOON",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 4,
    title: "GREENPATH",
    category: "LOGISTICS",
    year: "2025",
    status: null,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 5,
    title: "NOVA STUDIO",
    category: "PORTFOLIO",
    year: "2025",
    status: null,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 6,
    title: "CRYPTEX",
    category: "WEB3 & NFT",
    year: "2024",
    status: null,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 7,
    title: "LANDVAULT",
    category: "REAL ESTATE",
    year: "2024",
    status: null,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 8,
    title: "SWIFTLOG",
    category: "LOGISTICS",
    year: "2024",
    status: null,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&auto=format&fit=crop",
    href: "#",
  },
];

const HEADING_LINES = ["RECENT", "PROJECTS"];

// ── Single project card ───────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useGSAP(
    () => {
      gsap.set(cardRef.current, { autoAlpha: 0, y: 40 });
      gsap.to(cardRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out",
        delay: (index % 2) * 0.15,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: cardRef }
  );

  return (
    <a
      ref={cardRef}
      href={project.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative block w-full overflow-hidden bg-neutral-800"
      style={{ willChange: "transform, opacity", aspectRatio: "3/2" }}
    >
      {/* Background image */}
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out"
        style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.30) 50%, rgba(0,0,0,0.22) 100%)",
          opacity: hovered ? 0.95 : 0.85,
        }}
      />

      {/* Top row: category + year/status */}
      <div className="absolute left-0 right-0 top-0 flex items-start justify-between px-5 pt-5">
        <span className="font-ppneue text-[13px] sm:text-[14px] font-light tracking-[0.07em] text-white/90 uppercase">
          {project.category}
        </span>
        <span className="font-ppneue text-[13px] sm:text-[14px] font-light tracking-[0.07em] text-white/90 uppercase">
          {project.status ?? project.year}
        </span>
      </div>

      {/* Bottom: project title */}
      <div className="absolute bottom-0 left-0 px-5 pb-5">
        <h3 className="font-ppneue text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-semibold leading-none tracking-[-0.01em] text-white">
          {project.title}
        </h3>
      </div>

      {/* Hover arrow */}
      <div
        className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/50 transition-all duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scale(1)" : "scale(0.8)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 12L12 2M12 2H5M12 2V9"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </a>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function Home4Projects() {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const headingLineRefs = useRef([]);
  const filtersRef = useRef(null);
  const filterRefs = useRef([]);

  const filtered =
    activeFilter === "ALL"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  // ── Heading reveal ──
  useGSAP(
    () => {
      const lines = headingLineRefs.current.filter(Boolean);
      if (!lines.length) return;

      gsap.set(lines, {
        yPercent: 110,
        scaleY: 0.62,
        autoAlpha: 0,
        filter: "blur(6px)",
        transformOrigin: "center bottom",
      });

      gsap.to(lines, {
        yPercent: 0,
        scaleY: 1,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1.3,
        ease: "power3.out",
        stagger: 0.18,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  // ── Filter pills reveal ──
  useGSAP(
    () => {
      const pills = filterRefs.current.filter(Boolean);
      if (!pills.length) return;

      gsap.set(pills, { autoAlpha: 0, y: 14 });
      gsap.to(pills, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: filtersRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#f0ede6] px-6 py-24 sm:px-10 md:px-14 lg:px-16"
    >
      <div className="mx-auto max-w-[1200px]">

        {/* ── Heading ── */}
        <div ref={headingRef} className="mb-8 text-center">
          <h2 className="font-ppneue text-[52px] sm:text-[68px] md:text-[84px] lg:text-[96px] xl:text-[108px] font-semibold leading-[0.88] tracking-[-0.03em] text-[#1a1a1a] uppercase">
            {HEADING_LINES.map((line, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  overflow: "hidden",
                  paddingBottom: "0.1em",
                }}
              >
                <span
                  ref={(el) => (headingLineRefs.current[i] = el)}
                  style={{
                    display: "block",
                    transformOrigin: "center bottom",
                    willChange: "transform, opacity, filter",
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* ── Filter pills ── */}
        <div
          ref={filtersRef}
          className="mb-10 flex flex-wrap items-center justify-center gap-[4px]"
        >
          {FILTERS.map((filter, i) => (
            <button
              key={filter}
              ref={(el) => (filterRefs.current[i] = el)}
              onClick={() => setActiveFilter(filter)}
              className="font-ppneue cursor-pointer rounded-full px-4 py-[6px] text-[13px] sm:text-[14px] font-medium tracking-[0.04em] uppercase transition-all duration-300"
              style={{
                background: activeFilter === filter ? "#1a1a1a" : "transparent",
                color: activeFilter === filter ? "#ffffff" : "#1a1a1a",
                border: "1.5px solid #1a1a1a",
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* ── Projects grid ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}