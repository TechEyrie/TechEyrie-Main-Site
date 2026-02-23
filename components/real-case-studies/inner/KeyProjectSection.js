"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function KeyProjectSection({ theme = "light" }) {
  const [activeFeature, setActiveFeature] = useState(0);
  const featureRefs = useRef([]);
  const isDark = theme === "dark";

  // Sample data - replace with actual props
  const content = {
    label: "PROJECT",
    title: "Key project's features",
    features: [
      {
        title: "Assessment management",
        description:
          "Users struggled with navigating and interpreting the information due to a lack of clear structure and visual prioritization, leading to inefficiencies in managing assessments.",
        subheading: "What we've done:",
        points: [
          "Introduced an intuitive layout for effortless navigation",
          "Implemented visual hierarchy to highlight critical information",
          "Streamlined workflows to reduce complexity",
          "Added quick filters and search functionality",
        ],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80",
      },
      {
        title: "Compliance tracking",
        description:
          "Complex compliance requirements were difficult to track and manage, with users losing sight of key deadlines and regulatory changes across multiple frameworks.",
        subheading: "What we've done:",
        points: [
          "Created a centralized compliance dashboard",
          "Implemented automated alerts for upcoming deadlines",
          "Designed visual indicators for compliance status",
          "Integrated multi-framework support in one view",
        ],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
      },
      {
        title: "Risk visualization",
        description:
          "Risk data was presented in dense tables and text-heavy formats that made it challenging for stakeholders to quickly understand the organization's risk landscape.",
        subheading: "What we've done:",
        points: [
          "Developed interactive risk heatmaps and dashboards",
          "Implemented color-coded severity indicators",
          "Created drill-down capabilities for detailed analysis",
          "Added export functionality for reporting",
        ],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80",
      },
      {
        title: "Collaboration tools",
        description:
          "Team members had limited ability to collaborate effectively on assessments, with no clear visibility into who was working on what or how to share feedback.",
        subheading: "What we've done:",
        points: [
          "Built real-time collaboration features",
          "Added commenting and annotation capabilities",
          "Implemented role-based access controls",
          "Created activity feeds for transparency",
        ],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
      },
    ],
  };

  // Intersection Observer to detect which feature is in view
  useEffect(() => {
    const observers = featureRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveFeature(index);
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: "-20% 0px -50% 0px",
        }
      );

      if (ref) observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <section className={`w-full ${isDark ? "bg-[#1a1a1a]" : "bg-white"}`}>
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24 lg:py-28">
        {/* Label */}
        <p
          className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-6 sm:mb-8 ${
            isDark ? "text-gray-500" : "text-gray-600"
          }`}
        >
          {content.label}
        </p>

        {/* Title */}
        <h2
          className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] mb-16 sm:mb-20 md:mb-24 leading-tight tracking-[-0.03em] ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {content.title}
        </h2>

        {/* Sticky Image + Scrolling Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24">
          {/* Left Side - Sticky Image */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
              {content.features.map((feature, index) => (
                <Image
                  key={index}
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className={`object-cover transition-opacity duration-500 ${
                    activeFeature === index ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
              ))}
            </div>
          </div>

          {/* Right Side - Scrolling Features */}
          <div className="space-y-24 sm:space-y-28 md:space-y-32 lg:space-y-40">
            {content.features.map((feature, index) => (
              <div
                key={index}
                ref={(el) => (featureRefs.current[index] = el)}
                className="min-h-[400px]"
              >
                {/* Feature Title */}
                <h3
                  className={`font-italiana font-light text-[24px] sm:text-[28px] md:text-[32px] lg:text-[38px] mb-6 sm:mb-8 tracking-[-0.03em] ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className={`font-merriweather text-[14px] leading-relaxed mb-8 sm:mb-10 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {feature.description}
                </p>

                {/* Subheading */}
                <h4
                  className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-4 sm:mb-6 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {feature.subheading}
                </h4>

                {/* Points List */}
                <ul className="space-y-3 sm:space-y-4">
                  {feature.points.map((point, pointIndex) => (
                    <li
                      key={pointIndex}
                      className={`font-merriweather text-[14px] leading-relaxed flex items-start ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <span className="mr-3 mt-1.5">–</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
