"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  dark7CardsServicesBgStyle,
  DARK7_GRADIENT_NOISE_STYLE,
} from "./dark7PageGradients";

function CardCtaButton({ label = "Submit Request", isDarkCard = false }) {
  const [ctaHovered, setCtaHovered] = useState(false);
  // Card surface −6/−5/−4 RGB (same step as Real Problem #F5F1EE → #EFECEA)
  const idleBg = isDarkCard ? "#102820" : "#F1EEEC";
  const idleText = isDarkCard ? "#F7F3F0" : "#162D24";

  return (
    <button
      type="button"
      className={`hero-cta-btn cards-services-cta mt-auto inline-flex cursor-pointer items-center justify-center self-start px-5 py-2.5 font-merriweather text-[16px] font-light tracking-tight transition-colors duration-300 md:px-6 md:py-3 md:text-[18px] ${
        ctaHovered ? "text-[#F7F3F0]" : isDarkCard ? "text-[#F7F3F0]" : "text-[#162D24]"
      }`}
      style={{
        backgroundColor: ctaHovered ? "#162D24" : idleBg,
        borderRadius: "12px",
        color: ctaHovered ? "#F7F3F0" : idleText,
      }}
      onMouseEnter={() => setCtaHovered(true)}
      onMouseLeave={() => setCtaHovered(false)}
    >
      {label}
    </button>
  );
}

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
      bgColor: "#162D24",
      textColor: "#F7F3F0",
      isDarkCard: true,
    },
    {
      id: 1,
      title: "SMM",
      subtitle: "",
      description:
        "It's not only about existence, it is all about influence. We design well-crafted, goal-driven social media systems that connect you to high-value audiences and turn engagement into meaningful brand momentum.",
      bgColor: "#F7F3F0",
      textColor: "#162D24",
      isDarkCard: false,
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
      bgColor: "#162D24",
      textColor: "#F7F3F0",
      isDarkCard: true,
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
      bgColor: "#F7F3F0",
      textColor: "#162D24",
      isDarkCard: false,
    },
  ];

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

  const sectionBgStyle = dark7CardsServicesBgStyle();

  const bgStyle =
    theme === "dark"
      ? sharedBackground
        ? { background: "transparent", backgroundColor: "transparent" }
        : sectionBgStyle
      : { backgroundColor: lightColors.background };

  return (
    <section
      className="dark7-v35-cards-services relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden transition-colors duration-500"
      style={bgStyle}
    >
      {theme === "dark" && !sharedBackground && (
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={DARK7_GRADIENT_NOISE_STYLE}
          aria-hidden="true"
        />
      )}
      <div className="relative z-[2] max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-8 sm:mb-12 md:mb-16 flex items-center gap-2 sm:gap-3">
          <Image
            src="/feather-heading.png"
            alt=""
            width={40}
            height={40}
            className="cards-services-feather h-5 w-auto shrink-0 sm:h-6 md:h-7 lg:h-8"
            aria-hidden
          />
          <h2
            className={`cards-services-heading font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] 3xl:text-[80px] tracking-[0.01em] transition-colors duration-500 ${
              theme === "dark" ? "text-[#f5f1ee]" : "text-[#111111]"
            }`}
          >
            Our Services
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 md:gap-5 min-h-[480px]">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (cardsRef.current[index] = el)}
              onMouseEnter={() => handleCardHover(index)}
              className={`cards-services-card relative rounded-[20px] overflow-hidden cursor-pointer${
                service.isDarkCard ? " dark7-services-dark-card" : " dark7-services-light-card"
              }`}
              style={{
                backgroundColor: service.bgColor,
                flex: index === activeCard ? 1.5 : 0.7,
                transition: "none",
              }}
            >
              <div className="relative h-full flex flex-col">
                <div className="relative w-full shrink-0 pb-4 sm:pb-5 md:pb-6">
                  <Image
                    src="/horizontal-shit.png"
                    alt={typeof service.title === "string" ? service.title : "Service"}
                    width={600}
                    height={400}
                    className="block h-auto w-full max-w-none"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>

                <div className="flex-1 flex flex-col px-5 sm:px-6 md:px-8 pb-5 sm:pb-6 md:pb-8">
                  <h3
                    className={`cards-services-card-title font-light text-[29px] sm:text-[34px] md:text-[38px] lg:text-[45px] tracking-[0.01em] mb-2 min-h-[2.4em] leading-[1.1] ${
                      service.isDarkCard
                        ? "cards-services-dark-title font-merriweather"
                        : "font-italiana"
                    }`}
                    style={{ color: service.textColor }}
                  >
                    {service.title}
                  </h3>

                  {service.subtitle ? (
                    <p
                      className="cards-services-card-text font-merriweather font-light text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] mb-3 min-h-[1.25rem]"
                      style={{ color: service.textColor }}
                    >
                      {service.subtitle}
                    </p>
                  ) : (
                    <div className="mb-3 min-h-[1.25rem]" aria-hidden="true" />
                  )}

                  <p className="cards-services-card-description font-merriweather font-light leading-snug tracking-[0.02em] mb-5 min-h-[5.5rem] sm:min-h-[5rem] md:min-h-[4.75rem] lg:min-h-[4.5rem]">
                    {service.description}
                  </p>

                  <CardCtaButton isDarkCard={service.isDarkCard} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
