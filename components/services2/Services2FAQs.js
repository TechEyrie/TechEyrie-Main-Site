"use client";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    id: 1,
    question: 'What industries does WeAreBrain specialise in?',
    answer: 'We specialise in FMCG, Transport & Logistics, NGOs and Non-Profit Organisations, Technology & Startups, Healthcare & Life Sciences, Financial Services, Retail & E-commerce, Education & EdTech, Manufacturing & Industrial, Hospitality & Tourism, Public Sector & Government, and Media & Entertainment.',
  },
  {
    id: 2,
    question: 'How do your solutions adapt to industry-specific needs?',
    answer: 'We tailor technology and design choices based on sector-specific challenges, regulations, user behaviour, and competitive dynamics. Our approach involves thorough research, stakeholder engagement, and iterative development to ensure solutions meet unique industry requirements.',
  },
  {
    id: 3,
    question: 'Can you share success stories or case studies by industry?',
    answer: 'Yes, we have extensive case studies across all our sectors. Each project showcases how we\'ve helped businesses transform their digital presence, streamline operations, and achieve measurable results tailored to their specific industry challenges.',
  },
  {
    id: 4,
    question: 'Do you have experience in regulated industries (e.g., finance, healthcare)?',
    answer: 'Absolutely. We have deep experience working with highly regulated industries. Our team understands compliance requirements, data protection regulations (GDPR, HIPAA), and industry standards, ensuring all solutions meet regulatory requirements while delivering exceptional experiences.',
  },
  {
    id: 5,
    question: 'How do you drive innovation in traditional sectors?',
    answer: 'We combine cutting-edge technology with deep industry knowledge to identify opportunities for innovation. Our approach focuses on understanding traditional workflows and pain points, then applying modern solutions that respect industry nuances while driving meaningful transformation.',
  },
  {
    id: 6,
    question: 'What kind of AI solutions are suitable for my industry?',
    answer: 'AI solutions vary by industry—from predictive analytics in healthcare, fraud detection in finance, inventory optimization in retail, to personalized learning in education. We assess your specific needs and recommend AI applications that deliver tangible ROI for your sector.',
  },
  {
    id: 7,
    question: 'Do you support digital transformation for NGOs and impact organisations?',
    answer: 'Yes, we\'re passionate about helping NGOs and impact organizations leverage technology for greater social good. We offer specialized solutions for donor management, campaign tracking, volunteer coordination, and impact measurement tailored to the non-profit sector.',
  },
];

export default function Services2FAQs({ theme = 'light' }) {
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
      className="relative py-16 md:py-20 lg:py-24"
      style={{ 
        background: isDark 
          ? 'linear-gradient(to bottom, #1a1a1a 0%, #0a0a0a 100%)'
          : 'linear-gradient(to bottom, #e8ddd3 0%, #d4c4b8 100%)'
      }}
    >
      {/* Section Header - Left Aligned */}
      <div className="px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 mb-12 md:mb-16">
        <div className="max-w-[1800px] mx-auto">
          <div className="max-w-[800px]">
            <h2
              ref={headingRef}
              className="font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] leading-[1.1] tracking-[-0.03em] mb-6"
              style={{ color: isDark ? '#FFFFFF' : '#7b2cbf' }}
            >
              FAQs
            </h2>
            <p
              ref={descRef}
              className="font-merriweather text-[14px] leading-relaxed"
              style={{ color: isDark ? '#B0B0B0' : '#7b2cbf' }}
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
              style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#7b2cbf' }}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full text-left py-6 md:py-8 flex items-start justify-between group"
              >
                <h3
                  className="font-italiana font-light text-[24px] md:text-[28px] lg:text-[32px] pr-8 transition-opacity duration-300 group-hover:opacity-70"
                  style={{ 
                    color: isDark ? '#FFFFFF' : '#7b2cbf',
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
                      stroke={isDark ? '#FFFFFF' : '#7b2cbf'}
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
                    className="font-merriweather text-[14px] leading-relaxed"
                    style={{ color: isDark ? '#B0B0B0' : '#5a5a5a' }}
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
