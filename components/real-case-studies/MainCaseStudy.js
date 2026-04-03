"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteDrawer from "../showcase/SiteDrawar";
import { fetchWordPressCaseStudyBySlug } from "../../utils/wordpress";
import { caseStudySectionShell, caseStudySectionSurface } from "./caseStudySectionProps";

function getCaseStudySlugForFetch(project) {
  if (project?.slug) return project.slug;
  const link = project?.buttonLink;
  if (!link || typeof link !== "string") return null;
  if (/^https?:\/\//i.test(link)) {
    try {
      const pathname = new URL(link).pathname;
      const m = pathname.match(/\/case-studies\/([^/]+)/i);
      if (m) return decodeURIComponent(m[1]);
    } catch {
      return null;
    }
    return null;
  }
  const tail = link.replace(/^.*\/case-studies\//, "").replace(/^\//, "");
  return tail.split("/")[0] || null;
}

const CATEGORIES = [
  { id: "all", label: "ALL PROJECTS" },
  { id: "web-app", label: "WEB APP" },
  { id: "mobile-app", label: "MOBILE APP" },
  { id: "website", label: "WEBSITE" },
  { id: "branding", label: "BRANDING" },
];

const PROJECTS = [
  {
    id: 1,
    title: "Isora – optimizing governance, risk & compliance for top institutions",
    category: "web-app",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    tags: ["#UX AUDIT", "#PRODUCT REDESIGN", "#WEB DEVELOPMENT", "#TEAM EXTENTION"],
    badges: [
      { label: "SALTYCLOUD", flag: false },
      { label: "TEXAS, USA", flag: "🇺🇸" },
    ],
    techStack: "React, Python, AWS",
    timeline: "12 months, ongoing",
    results: [
      "2x faster user workflows",
      "50% shorter time-to-market",
      "Nominated for UX Design Award 2024",
    ],
    testimonial: {
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
      name: "Izek Lal",
      position: "Country manager",
      quote: "We have seen a significant improvement in terms of mobile friendliness and the general flow of the system. I believe this has contributed significantly to the growth of our business. Many thanks, Phenomenon.",
    },
    buttonText: "EXPLORE",
    buttonLink: "/case-studies/1",
  },
  {
    id: 2,
    title: "Mobile Banking App",
    category: "mobile-app",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
    tags: ["#MOBILE", "#FINTECH", "#UX DESIGN"],
    badges: [
      { label: "FINTECH CO", flag: false },
      { label: "NEW YORK, USA", flag: "🇺🇸" },
    ],
    techStack: "React Native, Node.js, Firebase",
    timeline: "8 months",
    results: [
      "3x increase in user engagement",
      "4.8 star rating on app stores",
      "Featured by Apple",
    ],
    buttonText: "VIEW PROJECT",
    buttonLink: "/case-studies/2",
  },
  {
    id: 3,
    title: "E-Commerce Platform Revolution",
    category: "web-app",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    tags: ["#E-COMMERCE", "#FULL-STACK", "#PAYMENT INTEGRATION"],
    badges: [
      { label: "SHOPIFY PLUS", flag: false },
      { label: "LONDON, UK", flag: "🇬🇧" },
    ],
    techStack: "Next.js, Stripe, PostgreSQL",
    timeline: "10 months",
    results: [
      "5x increase in conversion rate",
      "200% revenue growth",
      "Best E-Commerce Site 2025",
    ],
    testimonial: {
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      name: "Marcus Chen",
      position: "CEO & Founder",
      quote: "The team delivered beyond our expectations. The platform's performance and user experience are exceptional. Our revenue has tripled since launch.",
    },
    buttonText: "VIEW CASE",
    buttonLink: "/case-studies/3",
  },
  {
    id: 4,
    title: "Corporate Brand Identity",
    category: "branding",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
    tags: ["#BRANDING", "#DESIGN SYSTEM", "#VISUAL IDENTITY"],
    badges: [
      { label: "GLOBAL CORP", flag: false },
      { label: "DUBAI, UAE", flag: "🇦🇪" },
    ],
    techStack: "Figma, Adobe Suite, Design Tokens",
    timeline: "6 months",
    results: [
      "Complete brand overhaul",
      "40+ design components",
      "Red Dot Design Award",
    ],
    buttonText: "SEE MORE",
    buttonLink: "/case-studies/4",
  },
  {
    id: 5,
    title: "Healthcare Management Platform",
    category: "web-app",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
    tags: ["#HEALTHCARE", "#SAAS", "#DATA VISUALIZATION"],
    badges: [
      { label: "MEDICARE SYSTEMS", flag: false },
      { label: "TORONTO, CANADA", flag: "🇨🇦" },
    ],
    techStack: "Vue.js, Django, MongoDB",
    timeline: "14 months",
    results: [
      "60% reduction in admin time",
      "HIPAA compliant architecture",
      "10,000+ active users",
    ],
    testimonial: {
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&q=80",
      name: "Dr. Sarah Mitchell",
      position: "Chief Medical Officer",
      quote: "The platform has revolutionized how we manage patient data. The intuitive interface and robust security features make it indispensable for our operations.",
    },
    buttonText: "VIEW PROJECT",
    buttonLink: "/case-studies/5",
  },
  {
    id: 6,
    title: "Fitness Tracking Mobile App",
    category: "mobile-app",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
    tags: ["#FITNESS", "#MOBILE", "#WEARABLES"],
    badges: [
      { label: "FITLIFE", flag: false },
      { label: "SYDNEY, AUSTRALIA", flag: "🇦🇺" },
    ],
    techStack: "Flutter, Firebase, HealthKit",
    timeline: "9 months",
    results: [
      "500K+ downloads in first month",
      "4.9 star rating",
      "Apple App of the Day",
    ],
    buttonText: "EXPLORE",
    buttonLink: "/case-studies/6",
  },
  {
    id: 7,
    title: "Luxury Fashion E-Commerce",
    category: "website",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
    tags: ["#E-COMMERCE", "#LUXURY", "#3D VISUALIZATION"],
    badges: [
      { label: "HAUTE COUTURE", flag: false },
      { label: "PARIS, FRANCE", flag: "🇫🇷" },
    ],
    techStack: "Next.js, Shopify Plus, Three.js",
    timeline: "11 months",
    results: [
      "300% increase in online sales",
      "Award-winning 3D product views",
      "Featured in Vogue Tech",
    ],
    testimonial: {
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      name: "Isabelle Dubois",
      position: "Creative Director",
      quote: "The digital experience perfectly captures our brand's elegance. The 3D visualization feature has been a game-changer for our online presence.",
    },
    buttonText: "VIEW CASE",
    buttonLink: "/case-studies/7",
  },
  {
    id: 8,
    title: "Educational Learning Platform",
    category: "web-app",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
    tags: ["#EDUCATION", "#LMS", "#GAMIFICATION"],
    badges: [
      { label: "EDUWORLD", flag: false },
      { label: "BERLIN, GERMANY", flag: "🇩🇪" },
    ],
    techStack: "React, Node.js, PostgreSQL",
    timeline: "16 months",
    results: [
      "50,000+ active students",
      "95% course completion rate",
      "Top EdTech Platform 2024",
    ],
    buttonText: "SEE MORE",
    buttonLink: "/case-studies/8",
  },
  {
    id: 9,
    title: "Food Delivery Mobile App",
    category: "mobile-app",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
    tags: ["#FOOD", "#MOBILE", "#REAL-TIME TRACKING"],
    badges: [
      { label: "QUICKBITE", flag: false },
      { label: "MUMBAI, INDIA", flag: "🇮🇳" },
    ],
    techStack: "React Native, Node.js, Socket.io",
    timeline: "7 months",
    results: [
      "1M+ orders processed",
      "Average 25-minute delivery",
      "4.7 star rating",
    ],
    testimonial: {
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      name: "Rajesh Kumar",
      position: "Founder & CEO",
      quote: "The app's real-time tracking and seamless payment integration have made us the preferred choice for food delivery in the region.",
    },
    buttonText: "VIEW PROJECT",
    buttonLink: "/case-studies/9",
  },
  {
    id: 10,
    title: "Real Estate Portfolio Website",
    category: "website",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    tags: ["#REAL ESTATE", "#PORTFOLIO", "#VIRTUAL TOURS"],
    badges: [
      { label: "PREMIER PROPERTIES", flag: false },
      { label: "SINGAPORE", flag: "🇸🇬" },
    ],
    techStack: "Next.js, Strapi, WebGL",
    timeline: "8 months",
    results: [
      "200% increase in inquiries",
      "Interactive 360° property tours",
      "Best Real Estate Website Award",
    ],
    buttonText: "EXPLORE",
    buttonLink: "/case-studies/10",
  },
  {
    id: 11,
    title: "Startup Brand Identity & Website",
    category: "branding",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80",
    tags: ["#BRANDING", "#WEBSITE", "#STARTUP"],
    badges: [
      { label: "TECHNOVATE", flag: false },
      { label: "SAN FRANCISCO, USA", flag: "🇺🇸" },
    ],
    techStack: "Figma, Webflow, After Effects",
    timeline: "5 months",
    results: [
      "Complete brand identity system",
      "Modern responsive website",
      "Series A funding success",
    ],
    buttonText: "VIEW CASE",
    buttonLink: "/case-studies/11",
  },
  {
    id: 12,
    title: "Cryptocurrency Trading Platform",
    category: "web-app",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80",
    tags: ["#CRYPTO", "#FINANCE", "#BLOCKCHAIN"],
    badges: [
      { label: "CRYPTOEX", flag: false },
      { label: "ZURICH, SWITZERLAND", flag: "🇨🇭" },
    ],
    techStack: "React, Python, Blockchain API",
    timeline: "18 months",
    results: [
      "100K+ registered users",
      "99.9% uptime",
      "ISO 27001 certified",
    ],
    testimonial: {
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
      name: "Michael Schneider",
      position: "CTO",
      quote: "The platform's security and user experience set a new standard in crypto trading. Our users trust us with their assets because of the robust architecture.",
    },
    buttonText: "SEE MORE",
    buttonLink: "/case-studies/12",
  },
];

export default function CaseStudiesPage({ projects = PROJECTS, theme = "light" }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleImages, setVisibleImages] = useState(new Set());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const imageRefs = useRef([]);
  const observerRef = useRef(null);
  const isDark = theme === "dark";

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  // Intersection Observer for image reveal animation
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setVisibleImages((prev) => {
              const newSet = new Set(prev);
              newSet.add(index);
              return newSet;
            });
          } else {
            // Remove from visible set when scrolling out of view to allow animation replay
            setVisibleImages((prev) => {
              const newSet = new Set(prev);
              newSet.delete(index);
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    // Observe all image refs
    const currentRefs = imageRefs.current.filter(Boolean);
    currentRefs.forEach((ref) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [filteredProjects]);

  // Reset visible images when category changes
  useEffect(() => {
    setVisibleImages(new Set());
  }, [activeCategory]);

  // Handle image click to open drawer
  const handleImageClick = async (project) => {
    // First, set basic drawer item to show drawer immediately
    const basicDrawerItem = {
      id: project.id,
      title: project.title,
      image: project.image,
      url: project.wordpressUrl || project.buttonLink,
      badges: project.tags?.map(tag => tag.replace('#', '').toUpperCase()) || [],
      isPro: true,
      category: project.category === 'web-app' ? 'Web App' : 
                project.category === 'mobile-app' ? 'Mobile App' : 
                project.category === 'website' ? 'Website' : 
                project.category === 'branding' ? 'Branding' : 'Project',
      technology: project.techStack?.split(',')[0] || 'React',
      country: project.badges?.find(b => b.flag)?.label?.split(',')[0] || 'USA',
      rating: '8.5', // Default rating
      date: 'Site of the Day',
      description: project.title,
      creators: [
        { name: project.badges?.[0]?.label || 'Client', type: 'PRO', avatar: project.badges?.[0]?.label?.[0] || 'C' },
      ],
    };
    setSelectedItem(basicDrawerItem);
    setIsDrawerOpen(true);

    // Fetch full WordPress case study data
    try {
      const slug = getCaseStudySlugForFetch(project);
      
      if (slug) {
        const wpCaseStudy = await fetchWordPressCaseStudyBySlug(slug);
        
        if (wpCaseStudy) {
          // Debug: Log full WordPress fetched data
          console.log('=== WORDPRESS CASE STUDY DATA ===');
          console.log('Full WordPress Case Study:', JSON.stringify(wpCaseStudy, null, 2));
          console.log('WordPress highlights:', wpCaseStudy.highlights);
          console.log('=== END WORDPRESS DATA ===');
          
          // WordPress data is already transformed by transformWordPressCaseStudy
          // Extract detail page fields
          const highlights = (wpCaseStudy.highlights || []).map((h, idx) => ({
            id: idx + 1,
            title: h.title || '',
            subtitle: h.subtitle || '',
            icon: h.icon || '⚡',
            // Use highlight's own image if available, otherwise fallback to project image
            image: h.image || project.image,
          }));

          // Transform color palette
          const colorPalette = (wpCaseStudy.colorPalette || []).map(c => ({
            hex: c.hex || '#000000',
            name: c.name || 'Color',
            rgb: c.rgb || '0, 0, 0',
          }));

          // Transform technologies
          const technologies = wpCaseStudy.technologies || [];

          // Transform inside look images
          // WordPress already sends: [{ image: "url", title: "title" }, ...]
          // Just add id, preserve the image URL
          const insideLookImages = (wpCaseStudy.insideLookImages || []).map((img, idx) => {
            // img.image should already be a string URL from WordPress transformation
            const imageUrl = img?.image || project.image;
            
            return {
              id: idx + 1,
              title: img?.title || `Screenshot ${idx + 1}`,
              image: imageUrl,
            };
          });

          // Transform evaluation metrics
          const evaluationMetrics = (wpCaseStudy.evaluationMetrics || []).map((m, idx) => {
            const weights = ['40%', '30%', '20%', '10%'];
            return {
              category: m.category || 'Category',
              score: m.score?.toString() || '7.0',
              weight: weights[idx % weights.length] || '10%',
              maxScore: '10',
            };
          });

          // Transform jury members
          // WordPress sends: [{ name, country, role, avatar, vote, scores: { semantics, animations, ... } }, ...]
          const juryMembers = (wpCaseStudy.juryMembers || []).map(j => {
            // Extract scores from WordPress data, use defaults if not available
            const scores = j.scores || {};
            
            // Handle avatar - could be string URL or object
            let avatarUrl = '';
            if (j.avatar) {
              if (typeof j.avatar === 'string') {
                avatarUrl = j.avatar;
              } else if (typeof j.avatar === 'object') {
                avatarUrl = j.avatar.url || j.avatar.source_url || j.avatar.sizes?.large?.url || '';
              }
            }
            
            return {
              name: j.name || '',
              country: j.country || 'Unknown',
              role: j.role || '',
              avatar: avatarUrl,
              scores: {
                semantics: scores.semantics?.toString() || '7',
                animations: scores.animations?.toString() || '7',
                accessibility: scores.accessibility?.toString() || '7',
                wpo: scores.wpo?.toString() || '7',
                responsiveDesign: scores.responsiveDesign?.toString() || '7',
                markup: scores.markup?.toString() || '7',
              },
              overall: j.overall?.toString() || 
                      scores.overall?.toString() || 
                      (j.vote === 'up' ? '8.0' : (j.vote === 'down' ? '6.0' : '7.0')),
            };
          });
          
          // Debug: Log jury members transformation
          console.log('=== JURY MEMBERS DEBUG ===');
          console.log('Raw WordPress juryMembers:', wpCaseStudy.juryMembers);
          console.log('Transformed juryMembers:', juryMembers);
          console.log('=== END JURY MEMBERS DEBUG ===');

          // Transform collections
          const collections = (wpCaseStudy.collections || []).map(c => ({
            title: c.title || '',
            image: c.image || '',
            type: c.type || 'Collection',
            subtitle: c.subtitle || 'Inspiration',
            showFollowedBy: false,
          }));

          // Update drawer item with WordPress data
          const enrichedDrawerItem = {
            ...basicDrawerItem,
            url: wpCaseStudy.wordpressUrl || basicDrawerItem.url,
            rating: wpCaseStudy.rating || wpCaseStudy.overallScore || '8.5',
            date: wpCaseStudy.launchDate || 'Site of the Day',
            description: wpCaseStudy.shortDescription || wpCaseStudy.excerpt || project.title,
            highlights: highlights.length > 0 ? highlights : undefined,
            colorPalette: colorPalette.length > 0 ? colorPalette : undefined,
            technologies: technologies.length > 0 ? technologies : undefined,
            insideLookImages: insideLookImages && insideLookImages.length > 0 ? insideLookImages : undefined,
            evaluationMetrics: evaluationMetrics.length > 0 ? evaluationMetrics : undefined,
            juryMembers: juryMembers.length > 0 ? juryMembers : undefined,
            collections: collections.length > 0 ? collections : undefined,
          };

          setSelectedItem(enrichedDrawerItem);
        }
      }
    } catch (error) {
      console.error('Error fetching WordPress case study for drawer:', error);
      // Keep the basic drawer item if WordPress fetch fails
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedItem(null);
  };

  return (
    <section
      className={`${caseStudySectionShell(isDark)} min-h-screen pt-16 sm:pt-20 md:pt-24 lg:pt-32`}
      style={caseStudySectionSurface(isDark)}
    >
      {/* Header Section */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20">
        <p className={`font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase mb-6 sm:mb-8 ${isDark ? "text-[#74F5A1]" : "text-black/80"}`}>
          Case studies
        </p>
        <h1
          className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.05] tracking-[-0.03em] mb-8 sm:mb-12 md:mb-16 ${
            isDark ? "text-[#f3f3f3]" : "text-black"
          }`}
        >
          <span className="block">Explore our</span>
          <span className="block -mt-[0.2rem] sm:-mt-[0.3rem] md:-mt-[0.4rem] lg:-mt-[0.5rem] xl:-mt-[0.6rem] 2xl:-mt-[0.7rem] text-[32px] sm:text-[42px] md:text-[58px] lg:text-[72px] xl:text-[88px] 2xl:text-[104px]">projects</span>
        </h1>

        {/* Category Filters */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6
                    font-merriweather text-[14px] font-semibold
                    tracking-[0.16em] uppercase rounded-lg
                    transition-all duration-300 ease-out
                    active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
                    ${
                      isActive
                        ? isDark
                          ? "cs-filter-active focus:ring-[#e8e4dc]"
                          : "bg-black text-white focus:ring-black"
                        : isDark
                        ? "cs-filter-idle focus:ring-[#74F5A1]/40"
                        : "bg-transparent text-black hover:bg-gray-200 focus:ring-gray-400"
                    }
                  `}
                  aria-pressed={isActive}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add CSS for scale and rotate animation */}
      <style jsx>{`
        @keyframes revealImage {
          0% {
            clip-path: circle(0% at 50% 50%);
            transform: rotate(-8deg) scale(0.8);
            opacity: 0;
          }
          50% {
            transform: rotate(-4deg) scale(0.95);
            opacity: 0.8;
          }
          100% {
            clip-path: circle(100% at 50% 50%);
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
        }

        .image-reveal {
          animation: revealImage 1.4s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }

        .image-hidden {
          clip-path: circle(0% at 50% 50%);
          transform: rotate(-8deg) scale(0.8);
          opacity: 0;
        }

        .image-hidden,
        .image-reveal {
          position: relative;
          width: 100%;
          height: 100%;
          background: transparent !important;
        }

        .image-hidden img,
        .image-reveal img {
          position: absolute !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          background: transparent !important;
        }

        .image-hidden span,
        .image-reveal span {
          background: transparent !important;
        }

        .image-hidden span img,
        .image-reveal span img {
          background: transparent !important;
        }

        /* Ensure Next.js Image wrapper and all nested elements are transparent */
        .image-hidden > *,
        .image-reveal > * {
          background: transparent !important;
        }

        .image-hidden > * > *,
        .image-reveal > * > * {
          background: transparent !important;
        }

        /* Ensure the parent container is also transparent */
        .group {
          background: transparent !important;
        }

        /* Make the aspect-ratio container transparent */
        .aspect-\\[4\\/3\\] {
          background: transparent !important;
        }

        /* Ensure all parent containers are transparent */
        [data-index] > div {
          background: transparent !important;
        }

        /* Make sure rounded container is transparent */
        .rounded-2xl {
          background: transparent !important;
        }

        /* Ensure overflow container doesn't add background */
        .overflow-hidden {
          background: transparent !important;
        }
      `}</style>

      {/* Projects List */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="space-y-24 sm:space-y-32 md:space-y-40 lg:space-y-48">
          {filteredProjects.map((project, index) => (
            <div
              key={`${project.id}-${activeCategory}`}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start relative"
            >
              {/* Left Side - Project Image with Scale and Rotate Animation */}
              <div 
                className="order-1 lg:order-1 lg:sticky lg:top-8 lg:self-start"
                ref={(el) => (imageRefs.current[index] = el)}
                data-index={index}
              >
                <div
                  className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ 
                    background: isDark ? 'transparent' : 'transparent',
                    backgroundColor: 'transparent',
                    boxShadow: 'none'
                  }}
                  onClick={() => handleImageClick(project)}
                >
                  {project.image ? (
                    <div
                      className={`relative w-full h-full ${
                        visibleImages.has(index) ? "image-reveal" : "image-hidden"
                      }`}
                      style={{ background: 'transparent', backgroundColor: 'transparent' }}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{ background: 'transparent' }}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        unoptimized
                        priority={index < 2}
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        isDark ? "bg-[#101e27]/80 border border-[#e0d1b6]/10" : "bg-gray-200"
                      }`}
                    >
                      <svg
                        className={`w-16 h-16 ${
                          isDark ? "text-[#5c6b62]" : "text-gray-400"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Project Details */}
              <div className={`order-2 lg:order-2 ${isDark ? "text-[#f3f3f3]" : "text-black"}`}>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                  {project.tags?.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`font-merriweather text-[13px] md:text-[14px] font-semibold uppercase tracking-[0.16em] ${
                        isDark ? "text-[#a8a498]" : "text-gray-600"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2
                  className={`font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] mb-8 leading-tight tracking-[-0.03em] ${
                    isDark ? "text-[#f3f3f3]" : "text-black"
                  }`}
                >
                  {project.title}
                </h2>

                {/* Badges */}
                <div className="flex flex-wrap gap-4 mb-10">
                  {project.badges?.map((badge, badgeIndex) => (
                    <div
                      key={badgeIndex}
                      className={`px-8 sm:px-10 md:px-12 py-3 rounded-lg font-merriweather text-[14px] flex items-center gap-2.5 ${
                        isDark
                          ? "border border-[#e0d1b6]/15 bg-[#101e27]/90 text-[#f3f3f3]"
                          : "bg-black text-white"
                      }`}
                    >
                      {badge.flag && <span className="text-[18px]">{badge.flag}</span>}
                      {badge.label}
                    </div>
                  ))}
                </div>

                {/* Tech Stack & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                  <div>
                    <h3
                      className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-3 ${
                        isDark ? "text-[#a8a498]" : "text-gray-600"
                      }`}
                    >
                      TECH STACK
                    </h3>
                    <p
                      className={`font-merriweather text-[14px] ${
                        isDark ? "text-[#e8e4dc]" : "text-black"
                      }`}
                    >
                      {project.techStack}
                    </p>
                  </div>
                  <div>
                    <h3
                      className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-3 ${
                        isDark ? "text-[#a8a498]" : "text-gray-600"
                      }`}
                    >
                      TIMELINE
                    </h3>
                    <p
                      className={`font-merriweather text-[14px] ${
                        isDark ? "text-[#e8e4dc]" : "text-black"
                      }`}
                    >
                      {project.timeline}
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div className="mb-10">
                  <h3
                    className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-5 ${
                      isDark ? "text-[#a8a498]" : "text-gray-600"
                    }`}
                  >
                    RESULTS
                  </h3>
                  <div className="space-y-4">
                    {project.results?.map((result, resultIndex) => (
                      <p
                        key={resultIndex}
                        className={`font-merriweather text-[14px] ${
                          isDark ? "text-[#c8c2ad]" : "text-black"
                        }`}
                      >
                        {result}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleImageClick(project)}
                  className="cs-cta-primary inline-flex items-center gap-3 px-8 py-4 font-merriweather text-[14px] font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 mb-10 cursor-pointer"
                >
                  {project.buttonText}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                {/* Testimonial (if exists) */}
                {project.testimonial && (
                  <div
                    className={`rounded-2xl p-6 sm:p-8 ${
                      isDark
                        ? "border border-[#e0d1b6]/12 bg-[#101e27]/80"
                        : "bg-gray-50"
                    }`}
                  >
                    {/* Avatar and Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={project.testimonial.avatar}
                          alt={project.testimonial.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h4
                          className={`font-merriweather text-[14px] font-semibold ${
                            isDark ? "text-[#f3f3f3]" : "text-black"
                          }`}
                        >
                          {project.testimonial.name}
                        </h4>
                        <p
                          className={`font-merriweather text-[13px] md:text-[14px] ${
                            isDark ? "text-[#a8a498]" : "text-gray-600"
                          }`}
                        >
                          {project.testimonial.position}
                        </p>
                      </div>
                    </div>

                    {/* Quote */}
                    <p
                      className={`font-merriweather text-[14px] font-normal leading-relaxed ${
                        isDark ? "text-[#c8c2ad]" : "text-gray-700"
                      }`}
                    >
                      {project.testimonial.quote}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 px-4">
          <p className={`font-merriweather text-[14px] ${isDark ? "text-[#c8c2ad]" : "text-gray-600"}`}>
            No projects found in this category.
          </p>
        </div>
      )}

      {/* Bottom Spacing */}
      <div className="h-24 sm:h-32 md:h-40 lg:h-48"></div>

      {/* Showcase Drawer */}
      <SiteDrawer 
        isOpen={isDrawerOpen} 
        selectedItem={selectedItem} 
        onClose={closeDrawer}
        theme={theme}
      />
    </section>
  );
}
