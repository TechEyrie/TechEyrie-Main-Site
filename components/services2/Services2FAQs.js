"use client";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { services1ListingDarkSurface } from '../services1/services1ListingSurfaces';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    id: 1,
    question: 'What industries does Tech Eyrie specialise in?',
    answer: 'We specialise in AI-driven, automation-first digital solutions that transform operations and elevate experiences across a wide range of industries — from technology and startups to retail, healthcare, finance, manufacturing, NGOs, and beyond.',
  },
  {
    id: 2,
    question: 'How do your solutions adapt to industry-specific needs?',
    answer: 'We understand that every business has its own challenges, insights, and pace. Our AI-driven solutions tailor design, workflow automation, and technology to match each client\'s needs and complexity. Our AI-powered automation is never one-size-fits-all.',
  },
  {
    id: 3,
    question: 'Can you share success stories or case studies by industry?',
    answer: 'Absolutely. We have a portfolio of case studies across multiple sectors demonstrating how AI, smart automation, and digital strategies have elevated businesses. Each project highlights results tailored to specific industries with unique needs and challenges.',
  },
  {
    id: 4,
    question: 'Do you have experience in regulated industries (e.g., finance, healthcare)?',
    answer: 'Yes. At Tech Eyrie, we deliver AI-powered automated solutions to highly regulated sectors, elevating user experiences through intelligent automation, secure workflows, and data-driven insights — all while meeting industry compliance standards.',
  },
  {
    id: 5,
    question: 'How do you drive innovation in traditional sectors?',
    answer: 'We combine cutting-edge AI, automation, and digital technologies with deep industry expertise to unlock opportunities in traditional sectors. By understanding existing workflows, challenges, and legacy systems, we deliver innovations that are both practical and reliable.',
  },
  {
    id: 6,
    question: 'What kind of AI solutions are suitable for my industry?',
    answer: 'At Tech Eyrie, we provide industry-specific AI solutions by working closely with you to assess your needs and deliver targeted insights. Tech Eyrie isn\'t just technology — it\'s a strategic advantage built around your sector\'s unique demands.',
  },
  {
    id: 7,
    question: 'Do you support digital transformation for NGOs and impact organisations?',
    answer: 'Absolutely. Tech Eyrie is passionate about empowering NGOs to harness AI, automation, and intelligent digital systems. We help transform workflows, streamline operations, and deliver results that amplify your mission and maximise impact.',
  },
];

export default function Services2FAQs({ theme = 'light', dark7 = false }) {
  const isDark = theme === 'dark';
  const [openFAQ, setOpenFAQ] = useState(null);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const faqsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from(descRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });

      faqsRef.current.forEach((faq, index) => {
        if (faq) {
          gsap.from(faq, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: faq,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.08,
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-20 lg:py-24 transition-colors duration-500"
      style={
        isDark && dark7
          ? services1ListingDarkSurface
          : isDark
            ? { background: 'linear-gradient(to bottom, #1a1a1a 0%, #0a0a0a 100%)' }
            : { background: 'linear-gradient(to bottom, #e8ddd3 0%, #d4c4b8 100%)' }
      }
    >
      {/* Section Header - Left Aligned */}
      <div className="px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 mb-12 md:mb-16">
        <div className="max-w-[1800px] mx-auto">
          <div className="max-w-[800px]">
            <h2
              ref={headingRef}
              className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.1] tracking-[-0.03em] mb-6 ${isDark && dark7 ? 's2-faq-title' : ''}`}
              style={{ color: !isDark ? '#7b2cbf' : dark7 ? undefined : '#FFFFFF' }}
            >
              FAQs
            </h2>
            <p
              ref={descRef}
              className={`font-merriweather text-[14px] leading-relaxed ${isDark && dark7 ? 's2-faq-desc' : ''}`}
              style={{ color: !isDark ? '#7b2cbf' : dark7 ? undefined : '#B0B0B0' }}
            >
              Frequently asked questions about our sector expertise. Answered clearly, directly, from experience.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs List - Centered */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              ref={(el) => (faqsRef.current[index] = el)}
              className="border-b"
              style={{ borderColor: isDark ? (dark7 ? 'rgba(116, 245, 161, 0.28)' : 'rgba(255, 255, 255, 0.1)') : '#7b2cbf' }}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full text-left py-6 md:py-8 flex items-start justify-between group"
              >
                <h3
                  className={`font-italiana font-light text-[24px] md:text-[28px] lg:text-[32px] pr-8 transition-opacity duration-300 group-hover:opacity-70 ${isDark && dark7 ? 's2-faq-question' : ''}`}
                  style={{ 
                    color: !isDark ? '#7b2cbf' : dark7 ? undefined : '#FFFFFF',
                    lineHeight: '1.3'
                  }}
                >
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 pt-1">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    className="transition-transform duration-300"
                    style={{
                      transform: openFAQ === faq.id ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    <path
                      d="M16 8V24M8 16H24"
                      stroke={isDark ? (dark7 ? '#74F5A1' : '#FFFFFF') : '#7b2cbf'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
              
              <div
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{
                  maxHeight: openFAQ === faq.id ? '600px' : '0',
                  opacity: openFAQ === faq.id ? 1 : 0,
                }}
              >
                <div className="pb-6 md:pb-8 pr-12">
                  <p
                    className={`font-merriweather text-[14px] leading-relaxed ${isDark && dark7 ? 's2-faq-answer' : ''}`}
                    style={{ color: !isDark ? '#5a5a5a' : dark7 ? undefined : '#B0B0B0' }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
