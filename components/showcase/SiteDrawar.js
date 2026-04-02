"use client";

import { useState, useEffect, useRef } from "react";
import DrawerHeader from "./drawer/DrawerHeader";
import DrawerPreview from "./drawer/DrawerPreview";
import DrawerHighlights from "./drawer/DrawerHighlights";
import DrawerColorPalette from "./drawer/DrawerColorPalette";
import DrawerTechnologies from "./drawer/DrawerTechnologies";
import DrawerDescription from "./drawer/DrawerDescription";
import DrawerInsideLook from "./drawer/DrawerInsideLook";
import DrawerScore from "./drawer/DrawerScore";
import DrawerVotes from "./drawer/DrawerVotes";
import DrawerCollections from "./drawer/DrawerCollections";
import DrawerNavigation from "./drawer/DrawerNavigation";
import DrawerCloseButton from "./drawer/DrawerCloseButton";

export default function SiteDrawer({ isOpen, selectedItem, onClose, theme = 'light' }) {
  const isDark = theme === 'dark';
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSection, setActiveSection] = useState("highlights");
  
  // Section refs
  const highlightsRef = useRef(null);
  const colorPaletteRef = useRef(null);
  const technologiesRef = useRef(null);
  const descriptionRef = useRef(null);
  const insideLookRef = useRef(null);
  const scoreRef = useRef(null);
  const votesRef = useRef(null);
  const collectionsRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const refs = {
      highlights: highlightsRef,
      colorPalette: colorPaletteRef,
      technologies: technologiesRef,
      description: descriptionRef,
      insideLook: insideLookRef,
      score: scoreRef,
      votes: votesRef,
      collections: collectionsRef,
    };

    const ref = refs[sectionId];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  };

  // Track scroll position to update active section
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isOpen) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollTop + 150;

      const sections = [
        { id: "highlights", ref: highlightsRef },
        { id: "colorPalette", ref: colorPaletteRef },
        { id: "technologies", ref: technologiesRef },
        { id: "description", ref: descriptionRef },
        { id: "insideLook", ref: insideLookRef },
        { id: "score", ref: scoreRef },
        { id: "votes", ref: votesRef },
        { id: "collections", ref: collectionsRef },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current) {
          const sectionTop = section.ref.current.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(section.id);
            break;
          }
        }
      }
      
      if (scrollPosition < 100) {
        setActiveSection("highlights");
      }
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  if (!isOpen || !selectedItem) return null;

  // Extract data from selectedItem or use defaults
  const highlights = selectedItem.highlights || [
    {
      id: 1,
      title: "Smooth transitions",
      subtitle: "Animation",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    },
    {
      id: 2,
      title: "Micro interactions",
      subtitle: "UX Design",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    },
    {
      id: 3,
      title: "Typography system",
      subtitle: "Typography",
      image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80",
    },
    {
      id: 4,
      title: "Color palette",
      subtitle: "Design System",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
    },
    {
      id: 5,
      title: "Responsive layout",
      subtitle: "Development",
      image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80",
    },
    {
      id: 6,
      title: "Dark mode support",
      subtitle: "UI Design",
      image: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800&q=80",
    },
  ];

  const colorPalette = selectedItem.colorPalette || [
    { hex: "#020202", name: "Black" },
    { hex: "#FFFFFF", name: "White" },
  ];

  const technologies = selectedItem.technologies || [
    "Design Agencies",
    "Clean",
    "Colorful",
    "Parallax",
    "3D",
    "Interaction Design",
    "GSAP",
    "Prismic",
    "Astro",
    "React",
    "TypeScript",
    "Next.js",
  ];

  // Use the provided images if they exist and have items, otherwise use defaults
  const defaultInsideLookImages = [
    {
      id: 1,
      title: "Mobile thumbnail",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&q=80",
    },
    {
      id: 2,
      title: "Desktop thumbnail",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80",
    },
  ];
  
  const insideLookImages = (selectedItem.insideLookImages && 
                           Array.isArray(selectedItem.insideLookImages) && 
                           selectedItem.insideLookImages.length > 0) 
    ? selectedItem.insideLookImages 
    : defaultInsideLookImages;

  const evaluationMetrics = selectedItem.evaluationMetrics || [
    {
      category: "Design",
      weight: "40%",
      score: "7.25",
      maxScore: "10",
    },
    {
      category: "Usability",
      weight: "30%",
      score: "7.09",
      maxScore: "10",
    },
    {
      category: "Creativity",
      weight: "20%",
      score: "7.42",
      maxScore: "10",
    },
    {
      category: "Content",
      weight: "10%",
      score: "7.31",
      maxScore: "10",
    },
  ];

  const overallScore = selectedItem.rating || "7.24";
  const description = selectedItem.description || "New brand home and portfolio for Estrela - A people-first digital studio based in Cape Town, South Africa";
  const date = selectedItem.date || "Site of the Day - Jan 9, 2026";
  
  const juryMembers = selectedItem.juryMembers || [
    {
      name: "Eugene Sokolovski",
      country: "Belarus",
      role: "web designer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      scores: {
        semantics: "7",
        animations: "7",
        accessibility: "7",
        wpo: "7",
        responsiveDesign: "7",
        markup: "7",
      },
      overall: "7.00",
    },
    {
      name: "Denys Koloskov",
      country: "Ukraine",
      role: "UX/UI designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      scores: {
        semantics: "7",
        animations: "8",
        accessibility: "8",
        wpo: "8",
        responsiveDesign: "7",
        markup: "8",
      },
      overall: "7.60",
    },
  ];

  const collections = selectedItem.collections || [
    {
      title: "Pastel colors",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
      type: "Collection",
      subtitle: "Inspiration",
      showFollowedBy: true,
      followers: [
        { avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
        { avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
        { avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
      ],
      followerCount: 135,
    },
    {
      title: "Handy Tools and Apps for De...",
      customContent: (
        <div className="text-center">
          <h3 className="font-italiana font-light text-white text-[32px] mb-1">HANDY TOOLS</h3>
          <h3 className="font-italiana font-light text-white text-[32px] mb-3">AND APPS</h3>
          <p className="font-merriweather text-white text-[11px] uppercase tracking-[0.16em]">COLLECTION</p>
        </div>
      ),
      type: "Collection",
      subtitle: "Inspiration",
      showFollowedBy: true,
      followers: [
        { avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
        { avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
        { avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" },
      ],
      followerCount: 978,
    },
    {
      title: "CSS Animations",
      customContent: (
        <div className="relative w-full h-full p-8">
          <div className="absolute top-8 left-8">
            <span className="font-italiana font-light text-[120px] text-gray-900 leading-none">HE</span>
          </div>
          <div className="absolute top-8 right-8">
            <span className="font-italiana font-light text-[120px] text-gray-900 leading-none">R</span>
          </div>
          <div className="absolute bottom-8 left-8">
            <span className="font-italiana font-light text-[120px] text-gray-900 leading-none">V</span>
          </div>
          <div className="absolute bottom-8 right-8">
            <span className="font-italiana font-light text-[120px] text-gray-900 leading-none">É</span>
          </div>
        </div>
      ),
      type: "Collection",
      subtitle: "Inspiration",
      showFollowedBy: true,
      followers: [
        { avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&q=80" },
        { avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80" },
        { avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80" },
      ],
      followerCount: 425,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 cursor-pointer transition-opacity duration-400 ease-in-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Drawer Content */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl h-[85vh] sm:h-[90vh] overflow-hidden transition-transform duration-400 ease-in-out ${
          isDark ? 'bg-[#1a1a1a]' : 'bg-[#E8E8E8]'
        } ${isAnimating ? "translate-y-0" : "translate-y-full"}`}
      >
        <DrawerCloseButton onClose={handleClose} theme={theme} />

        {/* Scrollable Content Wrapper */}
        <div ref={scrollContainerRef} className="h-full overflow-y-auto pb-20 sm:pb-24">
          <DrawerHeader
            selectedItem={selectedItem}
            onClose={handleClose}
            rating={overallScore}
            date={date}
            theme={theme}
          />

          <DrawerPreview image={selectedItem.image} title={selectedItem.title} />

          <DrawerHighlights ref={highlightsRef} highlights={highlights} theme={theme} />

          <DrawerColorPalette ref={colorPaletteRef} colorPalette={colorPalette} theme={theme} />

          <DrawerTechnologies ref={technologiesRef} technologies={technologies} theme={theme} />

          <DrawerDescription ref={descriptionRef} description={description} theme={theme} />

          <DrawerInsideLook ref={insideLookRef} insideLookImages={insideLookImages} theme={theme} />

          <DrawerScore
            ref={scoreRef}
            overallScore={overallScore}
            evaluationMetrics={evaluationMetrics}
            theme={theme}
          />

          <DrawerVotes ref={votesRef} juryMembers={juryMembers} theme={theme} />

          <DrawerCollections ref={collectionsRef} collections={collections} theme={theme} />

          {/* Bottom Padding */}
          <div className={`h-12 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#E8E8E8]'}`} />
        </div>

        <DrawerNavigation
          activeSection={activeSection}
          onSectionClick={scrollToSection}
          theme={theme}
          visitUrl={selectedItem?.url}
        />
      </div>
    </>
  );
}
