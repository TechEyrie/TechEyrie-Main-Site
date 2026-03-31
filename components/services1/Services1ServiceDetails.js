"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const serviceDetails = [
  {
    id: 'international-recruitment',
    title: 'AI-Native Systems',
    description: "At Tech Eyrie, we don't just build systems, we craft with precision to learn, evolve and adapt in real-time. Our approach is technical and strategic, unleashing new stages of efficiency, creating a long-lasting impression. ",
    imageAlt: 'Diverse group of research participants from different ethnicities, ages, and backgrounds representing MindMarket\'s global respondent recruitment network',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop'
  },
  {
    id: 'screener-design',
    title: 'Advanced language AI system',
    description: 'From intelligent assistants to designing, customizing and deploying advanced Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG) systems, resulting in not only powerful AI but that aligns with your data, workflows and ambition. ',
    imageAlt: 'Researchers collaborating on screener questionnaire design with documents spread on table',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop'
  },
  {
    id: 'study-design',
    title: 'Automated Decision system',
    description: "At Tech Eyrie automation is empowerment, from workflow planning to complex decision automation we craft end-to-end solutions that’s unique, smarter, adaptive and innovative. Not just automating tasks, we redefine your business. ",
    imageAlt: 'Two researchers planning study design with laptop and research documents in professional setting',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
  },
  {
    id: 'discussion-guide',
    title: 'Conversational AI models',
    description: 'We design agents that don’t just respond, but they reason out, make decisions and implement workflows. Each model focuses on flawless operations, elevating insights, developing productivity and customer satisfaction.',
    imageAlt: 'Professional researcher preparing discussion guide for focus group moderation',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop'
  },
  {
    id: 'desk-research',
    title: 'Intelligent Data Transformation',
    description: 'We gather, organize and refine data from your business, transforming data into clarity. Our business solutions provide analytics, insights and dashboards that would stand out your business. Data isn’t just an asset but a competitive advantage.',
    imageAlt: 'Research team conducting desk research and analysing existing data on laptop',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
  },
  {
    id: 'analysis-reporting',
    title: 'Full-stack Development',
    description: 'At Tech Eyrie, we design web and mobile applications that are secured, flexible and modern from elegant and user-centric to powerful backend architecture. Our approach is not only about building, but ideal for business impact. ',
    imageAlt: 'Research analyst holding report folder with insights and recommendations',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
  },
  {
    id: 'translation-transcripts',
    title: 'Cloud & System Integration Services',
    description: 'As Cloud and enterprise integration are the backbone of our business we connect CRMs, ERPs, and services into perfect operation reducing friction, boost collaboration and elevate real-time insights to your organization. ',
    imageAlt: 'Professional linguist wearing headphones transcribing focus group recordings at laptop',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop'
  },
  {
    id: 'analysis-reporting1',
    title: 'Blockchain powered Systems',
    description: 'It is all about trust, value and transparency. We bring practical application across smart contracts, decentralized finance, asset tokenization, and web3 infrastructure across blockchain networks, unlocking complex concepts into measurable values.  ',
    imageAlt: 'Research analyst holding report folder with insights and recommendations',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
  },
];

export default function Services1ServiceDetails({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const imageRefs = useRef([]);

  useEffect(() => {
    imageRefs.current.forEach((image, index) => {
      if (!image) return;

      // Alternate tilt: even indices tilt right, odd tilt left
      const tiltDirection = index % 2 === 0 ? 12 : -12;

      gsap.to(image, {
        scrollTrigger: {
          trigger: image,
          start: 'top 70%',
          end: 'top 20%',
          scrub: 1.5,
          toggleActions: 'play reverse play reverse',
          // markers: true, // Uncomment to debug
        },
        y: 0,
        rotation: 0,
        scale: 1,
        ease: 'none',
        from: {
          y: 120,
          rotation: tiltDirection,
          scale: 0.95,
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className={`relative rounded-[32px] py-20 md:py-28 lg:py-60 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#D9D4CA]'}`}>
      <div className="mx-auto max-w-[1800px] px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="space-y-28 md:space-y-36 lg:space-y-44 xl:space-y-52">
          {serviceDetails.map((service, index) => (
            <React.Fragment key={service.id}>
              <div className="grid gap-8 md:gap-12 lg:gap-16 xl:gap-20 md:grid-cols-2 items-center">
                {/* Text Content - Always on Left */}
                <div className="max-w-[550px]">
                  <h3 className={`font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] leading-[1.15] tracking-[-0.01em] mb-5 md:mb-6 lg:mb-7 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
                    {service.title}
                  </h3>
                  <p className={`font-merriweather text-[14px] leading-[1.7] ${isDark ? 'text-[#b0b0b0]' : 'text-[#3a3a3a]'}`}>
                    {service.description}
                  </p>
                </div>

                {/* Image - Always on Right */}
                <div 
                  ref={(el) => (imageRefs.current[index] = el)}
                  className="relative"
                  style={{
                    transform: 'translateY(120px) rotate(' + (index % 2 === 0 ? '12deg' : '-12deg') + ') scale(0.95)'
                  }}
                >
                  <div className={`relative w-full h-[380px] md:h-[460px] lg:h-[540px] xl:h-[600px] rounded-[20px] md:rounded-[24px] lg:rounded-[28px] overflow-hidden shadow-lg ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#e8e4dc]'}`}>
                    <Image
                      src={service.imageUrl}
                      alt={service.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>

              {/* Divider Line - Show between items, not after last */}
              {index < serviceDetails.length - 1 && (
                <div className={`w-full h-[1px] opacity-40 ${isDark ? 'bg-white/20' : 'bg-[#b8b3a8]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
