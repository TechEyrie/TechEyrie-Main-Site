// components/ServicesSection.jsx
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function ServicesSection({ theme = "light", sharedBackground = false }) {
  const [activeCard, setActiveCard] = useState(0);
  const cardsRef = useRef([]);

  const services = [
    {
      id: 0,
      title: "SEO",
      subtitle: "(Search Engine Optimization)",
      description:
        "We research and select the most powerful keywords to elevate visibility for your business, connecting you with a high-intent audience through strategies built for lasting organic growth and measurable results.",
      tags: ["Keyword Analysis", "Content Optimization"],
      bgColor: theme === "dark" ? "#1a1a1a" : "#111111",
      textColor: "#f3f3f3",
      buttonBg: "#f3f3f3",
      buttonText: "#111111",
      isLightCard: false,
    },
    {
      id: 1,
      title: "SMM",
      subtitle: "",
      description:
        "It's not only about existence, it is all about influence. We design well-crafted, goal-driven social media systems that connect you to high-value audiences and turn engagement into meaningful brand momentum.",
      tags: [],
      bgColor: "#ffffff",
      textColor: "#111111",
      buttonBg: "#111111",
      buttonText: "#ffffff",
      isLightCard: true,
    },
    {
      id: 2,
      title: (
        <>
          Content<br />Marketing
        </>
      ),
      subtitle: "",
      description:
        "At Tech Eyrie we tailor content strategies, persuasive sales copy and promote digital presence turning technology into stories that repel to the right audience and drive measurable growth.",
      tags: [],
      bgColor: theme === "dark" ? "#1a1a1a" : "#E5E5E5",
      textColor: theme === "dark" ? "#f3f3f3" : "#111111",
      buttonBg: "#111111",
      buttonText: "#f3f3f3",
      isLightCard: false,
    },
    {
      id: 3,
      title: (
        <>
          Contextual<br />Advertising
        </>
      ),
      subtitle: "",
      description:
        "We turn attention into action. Here at Tech Eyrie we create data-driven advertisement campaigns, real-time monitoring and clear strategies which will deliver meaningful business outcomes and sustained performance.",
      tags: [],
      bgColor: "#ffffff",
      textColor: "#111111",
      buttonBg: "#111111",
      buttonText: "#ffffff",
      isLightCard: true,
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
      ? sharedBackground
        ? {
            backgroundColor: "transparent",
            backgroundImage: "none",
          }
        : {
            backgroundColor: "#162d24",
            backgroundImage: `
              url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
              radial-gradient(
                ellipse at 60% 80%,
                rgba(212, 175, 95, 0.5) 0%,
                rgba(27, 71, 50, 0.4) 40%,
                rgba(22, 45, 36, 0.92) 100%
              )
            `,
            backgroundBlendMode: "overlay, normal",
          }
      : { backgroundColor: lightColors.background };

  return (
    <section
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden transition-colors duration-500"
      style={bgStyle}
    >
      {theme === "dark" && !sharedBackground && (
        <>
          {/* Extra gradient padding so this band blends into neighbors,
              but keep it behind inner content and ahead of page bg. */}
          <div
            className="absolute inset-x-0 top-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[1]"
            style={{
              background:
                "linear-gradient(to bottom, #162d24 0%, rgba(22,45,36,0) 100%)",
            }}
          />
          {/* Bottom uses the shared soft teal so it matches FAQSection's top */}
          <div
            className="absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-48 pointer-events-none z-[1]"
            style={{
              background:
                "linear-gradient(to top, rgba(0,81,96,0.45) 0%, rgba(0,81,96,0) 100%)",
            }}
          />
        </>
      )}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Title */}
        <h2
          className={`font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] 3xl:text-[80px] tracking-[0.01em] mb-8 sm:mb-12 md:mb-16 transition-colors duration-500 ${
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
                          ? service.isLightCard
                            ? "#111111"
                            : "#E8FF6B"
                          : "transparent",
                      borderColor:
                        index === activeCard ? "transparent" : service.textColor,
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
                          ? service.isLightCard
                            ? "#ffffff"
                            : "#111111"
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
                    className="font-italiana font-light text-[29px] sm:text-[34px] md:text-[38px] lg:text-[45px] tracking-[0.01em] mb-2 min-h-[2.4em] leading-[1.1]"
                    style={{ color: service.textColor }}
                  >
                    {service.title}
                  </h3>

                  {service.subtitle ? (
                    <p
                      className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] mb-3 min-h-[1.25rem]"
                      style={{ color: service.textColor }}
                    >
                      {service.subtitle}
                    </p>
                  ) : (
                    <div className="mb-3 min-h-[1.25rem]" aria-hidden="true" />
                  )}

                  <p
                    className="font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] leading-relaxed mb-5 min-h-[5.5rem] sm:min-h-[5rem] md:min-h-[4.75rem] lg:min-h-[4.5rem]"
                    style={{ color: service.textColor }}
                  >
                    {service.description}
                  </p>

                  {/* Button - same style as RealProblemSection (font, color, style) */}
                  <button
                    type="button"
                    className="dark777-gold-cta mt-auto group inline-flex items-center justify-between w-full rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px]"
                  >
                    <span className="font-merriweather text-[13px] sm:text-[14px] md:text-[15px] font-bold tracking-wide">
                      SUBMIT REQUEST
                    </span>
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
