// components/FAQSection.jsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const FAQ_ITEMS = [
  {
    question: 'What services does Tech Eyrie provide?',
    answer: 'At Tech Eyrie, we redefine business and digital transformation.(High competition) We deliver seamless systems and end-to-end business solutions, tailoring strategies to elevate and engage your tech brand. From strategic planning to targeted promotion, we ensure your message reaches the right audience at the right time.',
  },
  {
    question: 'How to engage with Tech Eyrie?',
    answer: 'Connect with us seamlessly, At Tech Eyrie we take every step to transform your business into an effortless, strategic and unforgettable journey. We got you covered with 24/7 support, online consultation and personalized guidance. Get connected and feel the difference.'
  },
  {
    question: 'What type of solutions are available?',
    answer: 'Tech Eyrie provides a diverse range of tech solutions to meet your business needs. We offer intelligent systems with AI-driven automation, High-performance platforms to ensure a stable growth, Data and Analytical solutions with advanced tools and tailored systems to connect with your infrastructure.  ',
  },
  {
    question: 'Can I customize my Technology solution?',
    answer: 'That’s the best about Tech Eyrie, we customize your business needs by working closely with you. Our team can customize you, AI-driven workflow automation to match your operations, selecting the best platform features to support your business objectives, integration and Deployment with seamless alignment, and customized dashboards and insights to track your performance. We tailor technology experiences that are unique to your business.',
  },
  {
    question: 'How Does Tech Eyrie Ensure Quality and Security?',
    answer: 'At Tech Eyrie, our main focus is on reliability and security. Every system we deliver goes through testing and quality assurance to ensure a perfect performance, adhere to industry standards to ensure your business runs smoothly and continuous monitoring. We don’t just deliver technology, we tailor your systems to perform reliably, securely and at highest performance.',
  },
  {
    question: 'Do You Offer Membership or Partnership Programs?',
    answer: 'Tech Eyrie offers premium memberships and offers with benefits for the audience. Early access to the latest solutions, customizing packages according to your business needs, one single contact to guide your business journey to flow without pause, and a flexible and engaged team to ensure  your needs are met. It is not only about the membership, we focus on innovations, authenticity and a long-term business journey.  ',
  },
];

export default function FAQSection({ theme = 'light', sharedBackground = false }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false); // ✅ Track if animation has played

  // Color Palettes
  const lightColors = {
    background: "#F9F7F0",
  };

  // Background styles based on theme
  const bgStyle = theme === 'dark' 
    ? (sharedBackground
        ? { background: "transparent" }
        : {
            background:
              "radial-gradient(ellipse at 15% 20%, #0a2e32 0%, #1b4732 45%, #162d24 100%)",
          })
    : { backgroundColor: lightColors.background };

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px)
    `,
  };

  // ✅ Electrical animation function - runs only once
  const triggerElectricalAnimation = useCallback(() => {
    if (hasAnimated) return; // Don't run if already animated

    const titleLines = document.querySelectorAll(".faq-title-line");
    if (!titleLines.length) return;

    const originalColor = theme === "dark" ? "#f3f3f3" : "#111111";
    const electricColor = theme === "dark" ? "#c8c4bc" : "#2a5c48";
    const brightElectricColor = theme === "dark" ? "#FFFFFF" : "#FFFFFF";

    const tl = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
      },
      onComplete: () => {
        setHasAnimated(true); // ✅ Mark as animated after completion
      }
    });

    titleLines.forEach((line, lineIndex) => {
      const text = line.textContent;

      if (!line.querySelector(".char")) {
        const chars = text
          .split("")
          .map(
            (char, i) =>
              `<span class="char" style="color: ${originalColor}; display: inline-block; position: relative;" data-index="${i}">${
                char === " " ? "&nbsp;" : char
              }</span>`
          )
          .join("");
        line.innerHTML = chars;
      }

      const chars = line.querySelectorAll(".char");
      chars.forEach((char, charIndex) => {
        const baseDelay = lineIndex * 0.5 + charIndex * 0.06;
        const randomDelay = Math.random() * 0.1;
        const totalDelay = baseDelay + randomDelay;

        tl.to(
          char,
          {
            duration: 0.12,
            color: brightElectricColor,
            scale: 1.05,
            delay: totalDelay,
            ease: "power2.out",
          },
          0
        )
          .to(
            char,
            {
              duration: 0.18,
              color: electricColor,
              scale: 1.02,
              delay: totalDelay + 0.12,
              ease: "sine.inOut",
            },
            0
          )
          .to(
            char,
            {
              duration: 0.3,
              color: originalColor,
              scale: 1,
              delay: totalDelay + 0.3,
              ease: "power2.in",
            },
            0
          );
      });
    });
  }, [theme, hasAnimated]);

  // ✅ Update colors on theme change (if already animated)
  useEffect(() => {
    if (!hasAnimated) return;

    const titleLines = document.querySelectorAll(".faq-title-line");
    if (!titleLines.length) return;

    const originalColor = theme === "dark" ? "#f3f3f3" : "#111111"; // Main text

    titleLines.forEach(line => {
      const chars = line.querySelectorAll(".char");
      chars.forEach(char => {
        char.style.color = originalColor;
      });
    });

  }, [theme, hasAnimated]);

  // ✅ IntersectionObserver for title - triggers electrical animation once
  useEffect(() => {
    if (typeof window === 'undefined' || hasAnimated) return;

    const titleEl = titleRef.current;
    if (!titleEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          // Trigger electrical animation after a short delay
          setTimeout(() => {
            triggerElectricalAnimation();
          }, 300);

          observer.unobserve(titleEl); // ✅ Stop observing after first trigger
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of title is visible
        rootMargin: '0px 0px -100px 0px', // Adjust viewport margin
      }
    );

    observer.observe(titleEl);
    return () => observer.disconnect();
  }, [triggerElectricalAnimation, hasAnimated]);

  // ✅ IntersectionObserver for FAQ items stagger animation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.unobserve(sectionEl);
        }
      },
      {
        threshold: 0.45,
        rootMargin: '50px 0px',
      }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, []);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Stagger timing (ms)
  const STAGGER = 140;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32"
      style={bgStyle}
    >
      {/* Noise texture overlay */}
      {theme === 'dark' && !sharedBackground && (
        <>
          <div 
            className="absolute inset-0 pointer-events-none z-[1]"
            style={noiseOverlayStyle}
          />
          {/* Top uses the same soft teal as CardsServicesSection bottom so the seam shares one color */}
          <div
            className="absolute inset-x-0 top-0 h-32 sm:h-40 md:h-48 pointer-events-none z-[1]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,46,50,0.45) 0%, rgba(10,46,50,0) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 pointer-events-none z-[1]"
            style={{
              background:
                "linear-gradient(to top, #162d24 0%, rgba(22,45,36,0) 100%)",
            }}
          />
        </>
      )}

      {/* Decorative shapes - right */}
      <div className="pointer-events-none absolute right-0 top-20 hidden lg:block">
        <svg width="140" height="200" viewBox="0 0 140 200" fill="none">
          <rect x="0" y="0" width="70" height="70" rx="8" fill="#c8c4bc" />
          <rect x="70" y="0" width="70" height="70" rx="8" fill={theme === 'dark' ? '#3a3a3a' : '#E8E8E8'} />
          <rect x="70" y="70" width="70" height="70" rx="8" fill="#c8c4bc" />
          <rect x="0" y="140" width="70" height="70" rx="8" fill="#c8c4bc" />
          <rect x="70" y="140" width="70" height="70" rx="8" fill={theme === 'dark' ? '#3a3a3a' : '#E8E8E8'} />
        </svg>
      </div>

      {/* Decorative shapes - left */}
      <div className="pointer-events-none absolute left-0 bottom-32 hidden lg:block">
        <svg width="100" height="160" viewBox="0 0 100 160" fill="none">
          <rect x="0" y="0" width="50" height="50" rx="6" fill="#c8c4bc" />
          <rect x="0" y="60" width="50" height="50" rx="6" fill={theme === 'dark' ? '#3a3a3a' : '#E8E8E8'} />
          <rect x="0" y="120" width="50" height="50" rx="6" fill="#c8c4bc" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8">
        {/* Label */}
        <div className="mb-6 sm:mb-8 md:mb-10 flex items-center justify-center gap-2 sm:gap-3">
          <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-sm bg-[#c8c4bc]" />
          <span className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-semibold tracking-[0.16em] uppercase ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
            FAQ
          </span>
        </div>

        {/* Heading */}
        <h2 
          ref={titleRef}
          className={`mx-auto mb-6 sm:mb-8 md:mb-10 max-w-5xl text-center font-italiana leading-[1.08] tracking-[0.01em] ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}
        >
          <span className="faq-title-line block text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] 3xl:text-[80px] font-light">
            Frequently Asked Questions
          </span>
        </h2>

        {/* Subheading */}
        <p className={`mx-auto mb-10 sm:mb-14 md:mb-16 lg:mb-20 xl:mb-24 max-w-3xl text-center font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-regular leading-relaxed tracking-tight ${theme === 'dark' ? 'text-[#a0a0a0]' : 'text-[#444444]'}`}>
        Are you curious about what we do? We’ve got you covered. Check out the most FAQs to unleash what Tech Eyrie can do to make your business grow and shine.
        </p>

        {/* FAQ Items - Centered Column */}
        <div className="mx-auto max-w-4xl">
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className={[
                  'rounded-lg sm:rounded-xl md:rounded-2xl border overflow-hidden',
                  theme === 'dark' 
                    ? 'border-[#c8c4bc]/30 bg-[#c8c4bc]/[0.12]' 
                    : 'border-[#c8c4bc]/30 bg-[#c8c4bc]/[0.08]',
                  'transition-all duration-600 ease-out',
                  hasEntered
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4',
                ].join(' ')}
                style={{
                  transitionDelay: hasEntered ? `${index * STAGGER}ms` : '0ms',
                }}
              >
                {/* Question - Icon on LEFT */}
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full flex items-center gap-4 px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-7 text-left transition-colors duration-300 hover:bg-black/5"
                >
                  <div 
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex-shrink-0 items-center justify-center rounded-lg transition-transform duration-300 ${
                      openIndex === index ? 'rotate-45' : 'rotate-0'
                    }`}
                    style={{ backgroundColor: '#c8c4bc' }}
                  >
                    <svg
                      width="14"
                      height="14"
                      className="sm:w-[16px] sm:h-[16px]"
                      viewBox="0 0 22 22"
                      fill="none"
                      aria-hidden="true"
                    >
                      <line
                        x1="11"
                        y1="0"
                        x2="11"
                        y2="22"
                        stroke="#111111"
                        strokeWidth="3"
                      />
                      <line
                        x1="0"
                        y1="11"
                        x2="22"
                        y2="11"
                        stroke="#111111"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                  <span className={`flex-1 font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] font-light leading-snug ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
                    {item.question}
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6 lg:px-8 lg:pb-7 pt-0 pl-16 sm:pl-[4.5rem] md:pl-20 lg:pl-24">
                    <p className={`font-playfair text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] leading-relaxed ${theme === 'dark' ? 'text-[#d0d0d0]' : 'text-[#444444]'}`}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}