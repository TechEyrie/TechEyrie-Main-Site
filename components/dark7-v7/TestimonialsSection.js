"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  dark7TestimonialsSectionSurfaceStyle,
  DARK7_GRADIENT_NOISE_STYLE,
} from "./dark7PageGradients";
import {
  Dark7V7ScrollTrigger,
  refreshDark7V7ScrollTriggers,
  subscribeAfterScrollLayout,
} from "./lenisScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    id: 1,
    company: "TECHFLOW",
    name: "Sarah Johnson",
    role: "CTO at TechFlow",
    content: "The adoption rate has been remarkable, with more than 80% of TechFlow's engineering team incorporating it into their workflow and a level of engagement that is unparalleled compared with other dev tools.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: 2,
    company: "STARTUPX",
    name: "Michael Chen",
    role: "Founder",
    content: "We've seen a dramatic shift in how we handle our search infrastructure. The precision and speed are exactly what we needed to scale our operations effectively.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: 3,
    company: "CREATIVECORP",
    name: "Emily Davis",
    role: "Product Manager",
    content: "It's rare to find a tool that balances power with simplicity so well. My team was able to integrate it within days and the results were immediate.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: 4,
    company: "BRANDIFY",
    name: "David Wilson",
    role: "Director of Marketing",
    content: "The insights we gather now are far more actionable. It's not just about search, it's about understanding our data in a way we couldn't before.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: 5,
    company: "INNOVATEDAILY",
    name: "Jessica Brown",
    role: "CEO",
    content: "A game changer for our legal tech stack. The accuracy is impressive, and the support team has been fantastic to work with throughout the process.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

function TestimonialArrowButton({ name }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      className="testimonials-arrow-btn hero-cta-btn inline-flex flex-shrink-0 cursor-pointer items-center justify-center border p-2.5 transition-colors duration-300 sm:p-3"
      style={{
        backgroundColor: hovered ? "#F7F3F0" : "#162D24",
        borderColor: "#F7F3F0",
        borderRadius: "12px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Read more about ${name}`}
    >
      <ArrowRight
        className={`h-4 w-4 sm:h-[18px] sm:w-[18px] md:h-5 md:w-5 transition-colors duration-300 ${
          hovered ? "text-[#162D24]" : "text-[#F7F3F0]"
        }`}
        strokeWidth={1.8}
      />
    </button>
  );
}

export default function TestimonialsSection({ theme, sharedBackground = false }) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef(null);

  const isDark = theme === "dark";

  const lightColors = {
    primary: "#013825",
    secondary: "#9E8F72",
    tertiary: "#CEC8B0",
    background: "#F9F7F0",
  };

  const bgColorStyle = isDark
    ? sharedBackground
      ? { background: "transparent", backgroundColor: "transparent" }
      : dark7TestimonialsSectionSurfaceStyle()
    : { backgroundColor: lightColors.background };
  const textColor = isDark ? "text-[#f3f3f3]" : "text-slate-900";
  const cardBgStyle = { backgroundColor: "#162D24" };
  const cardShadow = isDark ? "shadow-xl" : "shadow-[0_8px_30px_rgb(0,0,0,0.04)]";

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;
    if (!section || !heading || !cards) return;

    let tween = null;

    gsap.set(heading, { autoAlpha: 1 });

    const setup = () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      ScrollTrigger.getById("dark7-v7-testimonials-heading-opacity")?.kill();

      // Fade 1 → 0 as cards rise into view; hold at 0 for the rest of the section.
      // (Previous |progress-0.5|*2 curve made the heading reappear at the end.)
      tween = gsap.fromTo(
        heading,
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: Dark7V7ScrollTrigger({
            id: "dark7-v7-testimonials-heading-opacity",
            trigger: cards,
            start: "top 12%",
            end: "top -35%",
            scrub: 0.55,
            invalidateOnRefresh: true,
          }),
        },
      );

      refreshDark7V7ScrollTriggers(true);
    };

    const unsubLayout = subscribeAfterScrollLayout(setup);

    return () => {
      unsubLayout();
      tween?.scrollTrigger?.kill();
      tween?.kill();
      ScrollTrigger.getById("dark7-v7-testimonials-heading-opacity")?.kill();
      gsap.set(heading, { clearProps: "opacity,visibility" });
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`dark7-v7-testimonials relative min-h-[150vh] -mb-px ${textColor} selection:bg-indigo-500/30 transition-colors duration-500`}
      style={bgColorStyle}
    >
        {isDark && sharedBackground && (
          <>
            <div
              className="pointer-events-none absolute inset-0 z-[1]"
              style={dark7TestimonialsSectionSurfaceStyle()}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 z-[1]"
              style={DARK7_GRADIENT_NOISE_STYLE}
              aria-hidden="true"
            />
          </>
        )}
        <div className="relative z-[2]">
            <div className="sticky top-0 z-[1] h-screen flex flex-col items-center justify-center overflow-hidden px-4">
                <h1
                  ref={headingRef}
                  className="testimonials-heading pointer-events-none text-center leading-[1.02] tracking-[0.01em] text-[#162D24] will-change-[opacity]"
                  style={{ color: "#162D24" }}
                >
                  <span className="real-problem-title-line block font-italiana font-light tracking-[0.01em]">
                    What people say
                  </span>
                  <span className="real-problem-title-line block font-italiana font-light tracking-[0.01em]">
                    about TechEyerie
                  </span>
                </h1>
            </div>

            <div
              ref={cardsRef}
              className="relative z-10 flex flex-col items-center gap-4 sm:gap-5 md:gap-6 pb-16 sm:pb-20 md:pb-24 lg:pb-32 pt-10 sm:pt-[18vh] md:pt-[20vh] px-4 sm:px-6 w-full"
            >
                {testimonials.map((t) => (
                    <div 
                        key={t.id} 
                        className={`testimonials-card w-full max-w-full sm:max-w-lg md:max-w-xl bg-[#162D24] p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-xl sm:rounded-2xl ${cardShadow} transition-all duration-300 hover:scale-[1.01]`}
                        style={cardBgStyle}
                    >
                        <div className="mb-4 sm:mb-6 md:mb-8">
                            <p className="testimonials-card-text font-merriweather text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] tracking-[0.2em] uppercase text-[#F7F3F0]">{t.company}</p>
                        </div>

                        <blockquote className="testimonials-card-text font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] leading-relaxed mb-8 sm:mb-10 md:mb-12 text-[#F7F3F0]">
                            "{t.content}"
                        </blockquote>

                        <div className="flex items-center justify-between border-t border-[#F7F3F0]/20 pt-5 sm:pt-6 md:pt-8">
                            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                <img 
                                    src={t.image} 
                                    alt={t.name} 
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover grayscale"
                                />
                                <div>
                                    <p className="testimonials-card-text font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] text-[#F7F3F0]">{t.name}</p>
                                    <p className="testimonials-card-text testimonials-card-role font-merriweather text-[12px] sm:text-[13px] md:text-[14px] text-[#F7F3F0]">{t.role}</p>
                                </div>
                            </div>
                            
                            <TestimonialArrowButton name={t.name} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
