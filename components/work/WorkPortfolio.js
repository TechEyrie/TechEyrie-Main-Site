"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { gsap } from "gsap";
import WorkCard from "./WorkCard";

// Sample project data (replace with real data later)
const sampleProjects = [
  {
    id: 1,
    title: "Sylvera",
    category: "Strategy",
    year: "2025",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 2,
    title: "Knotel",
    category: "Design",
    year: "2024",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 3,
    title: "Follio",
    category: "Development",
    year: "2024",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 4,
    title: "Nubank",
    category: "Experience",
    year: "2023",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 5,
    title: "Vercel",
    category: "Strategy",
    year: "2023",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 6,
    title: "Linear",
    category: "Design",
    year: "2023",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 7,
    title: "Stripe",
    category: "Development",
    year: "2024",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 8,
    title: "Notion",
    category: "Experience",
    year: "2024",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 9,
    title: "Figma",
    category: "Strategy",
    year: "2023",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 10,
    title: "Airbnb",
    category: "Design",
    year: "2025",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 11,
    title: "Spotify",
    category: "Development",
    year: "2025",
    image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 12,
    title: "Uber",
    category: "Experience",
    year: "2024",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 13,
    title: "Netflix",
    category: "Strategy",
    year: "2024",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 14,
    title: "Shopify",
    category: "Design",
    year: "2023",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 15,
    title: "Slack",
    category: "Development",
    year: "2023",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 16,
    title: "Discord",
    category: "Experience",
    year: "2025",
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 17,
    title: "Coinbase",
    category: "Strategy",
    year: "2025",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 18,
    title: "Zoom",
    category: "Design",
    year: "2024",
    image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 19,
    title: "Dropbox",
    category: "Development",
    year: "2024",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 20,
    title: "Tesla",
    category: "Experience",
    year: "2023",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
  {
    id: 21,
    title: "Apple",
    category: "Strategy",
    year: "2023",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "#",
  },
];

const categories = ["All", "Strategy", "Design", "Development", "Experience"];

export default function WorkPortfolio({ theme = "light" }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [layout, setLayout] = useState("grid"); // 'grid' or 'list'
  const [activeProject, setActiveProject] = useState(null);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const cursorRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const isDark = theme === "dark";

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return sampleProjects;
    return sampleProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // GSAP cursor following effect
  useEffect(() => {
    let xTo, yTo;

    if (cursorRef.current) {
      xTo = gsap.quickTo(cursorRef.current, "x", {
        duration: 0.6,
        ease: "power3.out",
      });
      yTo = gsap.quickTo(cursorRef.current, "y", {
        duration: 0.6,
        ease: "power3.out",
      });
    }

    const handleMouseMove = (e) => {
      if (isCardVisible && xTo && yTo) {
        xTo(e.clientX);
        yTo(e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isCardVisible]);

  const handleListHover = (project, e) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    setActiveProject(project);

    if (!isCardVisible) {
      setIsCardVisible(true);

      if (cursorRef.current) {
        gsap.set(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          scale: 0,
          opacity: 0,
        });

        gsap.to(cursorRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
        });
      }
    }
  };

  const handleListLeave = (e) => {
    const related = e.relatedTarget;
    if (related && e.currentTarget.contains(related)) return;

    hideTimeoutRef.current = setTimeout(() => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            setIsCardVisible(false);
            setActiveProject(null);
          },
        });
      }
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      className="w-full py-12 md:py-16 relative"
      style={{
        backgroundColor: isDark ? "#1a1a1a" : "#f8f8f8",
      }}
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Filter Bar */}
        <div
          className="flex items-center justify-between pb-6 mb-8 border-b"
          style={{
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        >
          {/* Category Filters */}
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            {categories.map((cat, index) => (
              <React.Fragment key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`font-merriweather text-[14px] font-semibold tracking-[0.16em] uppercase transition-all duration-300 ${activeCategory === cat ? (isDark ? 'text-white' : 'text-[#1a1a1a]') : (isDark ? 'text-white/40' : 'text-black/40')}`}
                >
                  {cat}
                </button>
                {index < categories.length - 1 && (
                  <span
                    className="text-[0.8rem] hidden md:inline"
                    style={{
                      color: isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.2)",
                    }}
                  >
                    —
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center gap-3">
            {/* Grid Icon */}
            <button
              onClick={() => setLayout("grid")}
              className="p-2 transition-opacity duration-300"
              style={{
                opacity: layout === "grid" ? 1 : 0.4,
              }}
              aria-label="Grid layout"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0"
                  y="0"
                  width="5"
                  height="5"
                  rx="1"
                  fill={isDark ? "#ffffff" : "#1a1a1a"}
                />
                <rect
                  x="6.5"
                  y="0"
                  width="5"
                  height="5"
                  rx="1"
                  fill={isDark ? "#ffffff" : "#1a1a1a"}
                />
                <rect
                  x="13"
                  y="0"
                  width="5"
                  height="5"
                  rx="1"
                  fill={isDark ? "#ffffff" : "#1a1a1a"}
                />
                <rect
                  x="0"
                  y="6.5"
                  width="5"
                  height="5"
                  rx="1"
                  fill={isDark ? "#ffffff" : "#1a1a1a"}
                />
                <rect
                  x="6.5"
                  y="6.5"
                  width="5"
                  height="5"
                  rx="1"
                  fill={isDark ? "#ffffff" : "#1a1a1a"}
                />
                <rect
                  x="13"
                  y="6.5"
                  width="5"
                  height="5"
                  rx="1"
                  fill={isDark ? "#ffffff" : "#1a1a1a"}
                />
                <rect
                  x="0"
                  y="13"
                  width="5"
                  height="5"
                  rx="1"
                  fill={isDark ? "#ffffff" : "#1a1a1a"}
                />
                <rect
                  x="6.5"
                  y="13"
                  width="5"
                  height="5"
                  rx="1"
                  fill={isDark ? "#ffffff" : "#1a1a1a"}
                />
                <rect
                  x="13"
                  y="13"
                  width="5"
                  height="5"
                  rx="1"
                  fill={isDark ? "#ffffff" : "#1a1a1a"}
                />
              </svg>
            </button>

            {/* List Icon */}
            <button
              onClick={() => setLayout("list")}
              className="p-2 transition-opacity duration-300"
              style={{
                opacity: layout === "list" ? 1 : 0.4,
              }}
              aria-label="List layout"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0"
                  y="2"
                  width="18"
                  height="2"
                  rx="1"
                  fill={isDark ? "#ffffff" : "#1a1a1a"}
                />
                <rect
                  x="0"
                  y="8"
                  width="18"
                  height="2"
                  rx="1"
                  fill={isDark ? "#ffffff" : "#1a1a1a"}
                />
                <rect
                  x="0"
                  y="14"
                  width="18"
                  height="2"
                  rx="1"
                  fill={isDark ? "#ffffff" : "#1a1a1a"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {layout === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project) => (
              <WorkCard
                key={project.id}
                project={project}
                theme={theme}
                layout="grid"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredProjects.map((project) => (
              <WorkCard
                key={project.id}
                project={project}
                theme={theme}
                layout="list"
                onListHover={handleListHover}
                onListLeave={handleListLeave}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className={`font-merriweather text-[14px] text-center py-16 opacity-50 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
            No projects found in this category.
          </div>
        )}
      </div>

      {/* Floating Hover Card */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: 0, top: 0 }}
      >
        {activeProject && (
          <div className="relative w-[500px] h-[320px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={activeProject.image}
              alt={activeProject.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6"
            >
              <h3 className="font-italiana font-light text-white text-[24px] md:text-[28px] mb-1">
                {activeProject.title}
              </h3>
              <p className="font-merriweather text-white/70 text-[14px]">{activeProject.category}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


