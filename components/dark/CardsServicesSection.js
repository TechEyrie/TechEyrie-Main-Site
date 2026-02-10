// components/ServicesSection.jsx
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function ServicesSection({ theme = "light" }) {
  const [activeCard, setActiveCard] = useState(0);
  const cardsRef = useRef([]);

  const services = [
    {
      id: 0,
      title: "SEO",
      subtitle: "(Search Engine Optimization)",
      description: "Research and selection of the most effective keywords for your business.",
      tags: ["Keyword Analysis", "Content Optimization"],
      bgColor: theme === "dark" ? "#1a1a1a" : "#111111",
      textColor: "#f3f3f3",
      buttonBg: "#f3f3f3",
      buttonText: "#111111",
    },
    {
      id: 1,
      title: "SMM",
      subtitle: "",
      description: "Strategy development and presence in social networks that aligns with your goals.",
      tags: [],
      bgColor: "#E8FF6B",
      textColor: "#111111",
      buttonBg: "#111111",
      buttonText: "#E8FF6B",
    },
    {
      id: 2,
      title: (
        <>
          Content<br />Marketing
        </>
      ),
      subtitle: "",
      description: "Development of content strategies, writing sales texts and content promotion.",
      tags: [],
      // In dark theme, match the first card's background
      bgColor: theme === "dark" ? "#1a1a1a" : "#E5E5E5",
      // Make title/description light in dark theme
      textColor: theme === "dark" ? "#f3f3f3" : "#111111",
      buttonBg: "#111111",
      buttonText: "#f3f3f3",
    },
    {
      id: 3,
      title: (
        <>
          Contextual<br />Advertising
        </>
      ),
      subtitle: "",
      description: "Creating advertising campaigns, constant monitoring and optimization.",
      tags: [],
      bgColor: "#E8FF6B",
      textColor: "#111111",
      buttonBg: "#111111",
      buttonText: "#E8FF6B",
    },
  ];

  // Add will-change on mount for better performance
  useEffect(() => {
    cardsRef.current.forEach((card) => {
      if (card) {
        card.style.willChange = "flex";
      }
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) {
          card.style.willChange = "auto";
        }
      });
    };
  }, []);

  const handleCardHover = (index) => {
    setActiveCard(index);

    cardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.to(card, {
          flex: i === index ? 1.5 : 0.7,
          duration: 0.6,
          ease: "power1.out",
          overwrite: "auto",
        });
      }
    });
  };

  const lightColors = {
    background: "#F9F7F0",
  };

  const bgStyle =
    theme === "dark"
      ? {
          backgroundColor: "#2b2b2b",
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
            radial-gradient(ellipse at top left, rgba(60, 60, 60, 0.3), transparent 50%),
            radial-gradient(ellipse at bottom right, rgba(50, 50, 50, 0.2), transparent 50%)
          `,
          backgroundBlendMode: "overlay, normal, normal",
        }
      : { backgroundColor: lightColors.background };

  return (
    <section
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden transition-colors duration-500"
      style={bgStyle}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Title */}
        <h2
          className={`font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] mb-8 sm:mb-12 md:mb-16 transition-colors duration-500 ${
            theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
          }`}
        >
          Our Services
        </h2>

        {/* Cards Container - 20% smaller (480px) */}
        <div className="flex flex-col lg:flex-row gap-3 md:gap-5 min-h-[480px]">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (cardsRef.current[index] = el)}
              onMouseEnter={() => handleCardHover(index)}
              className="relative rounded-[20px] overflow-hidden cursor-pointer"
              style={{
                backgroundColor: service.bgColor,
                flex: index === activeCard ? 1.5 : 0.7,
                transition: "none",
              }}
            >
              {/* Card Content */}
              <div className="relative h-full flex flex-col">
                {/* Top Section - Tags and Arrow - with padding */}
                <div className="flex items-start justify-between px-5 sm:px-6 md:px-8 pt-5 sm:pt-6 md:pt-8 pb-3">
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full border text-[12px] sm:text-[13px] lg:text-[16px] font-medium font-playfair"
                        style={{
                          borderColor: "#E8FF6B",
                          color: "#E8FF6B",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Arrow Icon - Changes when active */}
                  <div
                    className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                      index === activeCard
                        ? "w-14 h-14 sm:w-16 sm:h-16"
                        : "w-10 h-10 sm:w-11 sm:h-11 border-2 border-dashed hover:rotate-45"
                    }`}
                    style={{
                      backgroundColor: 
                        index === activeCard 
                          ? (service.bgColor === "#E8FF6B" ? "#111111" : "#E8FF6B")
                          : "transparent",
                      borderColor: index === activeCard ? "transparent" : service.textColor,
                    }}
                  >
                    <svg
                      className={`transition-all duration-300 ${
                        index === activeCard
                          ? "w-6 h-6 sm:w-7 sm:h-7"
                          : "w-4 h-4 sm:w-5 sm:h-5"
                      }`}
                      fill="none"
                      stroke={
                        index === activeCard
                          ? (service.bgColor === "#E8FF6B" ? "#E8FF6B" : "#111111")
                          : service.textColor
                      }
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      {index === activeCard ? (
                        // Right arrow when active
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      ) : (
                        // Diagonal arrow when inactive
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 17L17 7M17 7H7M17 7V17"
                        />
                      )}
                    </svg>
                  </div>
                </div>

                {/* Image - Full Width - 20% smaller */}
                <div className="relative w-full h-[136px] sm:h-[160px] md:h-[184px] mb-4">
                  <Image
                    src="/horizontal-shit.png"
                    alt={typeof service.title === 'string' ? service.title : 'Service'}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Text Content - with padding */}
                <div className="flex-1 flex flex-col px-5 sm:px-6 md:px-8 pb-5 sm:pb-6 md:pb-8">
                  <h3
                    className="font-italiana font-light text-[29px] sm:text-[34px] md:text-[38px] lg:text-[45px] mb-2"
                    style={{ color: service.textColor }}
                  >
                    {service.title}
                  </h3>

                  {service.subtitle && (
                    <p
                      className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] mb-3"
                      style={{ color: service.textColor }}
                    >
                      {service.subtitle}
                    </p>
                  )}

                  <p
                    className="font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] leading-relaxed mb-5"
                    style={{ color: service.textColor }}
                  >
                    {service.description}
                  </p>

                  {/* Button - Increased height and font size */}
                  <button
                    className="mt-auto inline-flex items-center justify-between px-6 py-4 text-[13px] sm:text-[14px] md:text-[15px] font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg w-full"
                    style={{
                      backgroundColor: service.buttonBg,
                      color: service.buttonText,
                    }}
                  >
                    <span>SUBMIT REQUEST</span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
