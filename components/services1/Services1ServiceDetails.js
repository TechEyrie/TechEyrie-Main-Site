"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const serviceDetails = [
  {
    id: 'international-recruitment',
    title: 'International Respondent Recruitment',
    description: "Finding right people for the research isn't complicated with us, through our global network you can get high-quality participants across the market via a single contact. We got you covered with consumers for any niche like healthcare specialist, user interviews and B2B experts, ensuring every participant is engaged, authentic and aligned to the goals. The insights you gain are trusted and representative of your audience. ",
    imageAlt: 'Diverse group of research participants from different ethnicities, ages, and backgrounds representing MindMarket\'s global respondent recruitment network',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop'
  },
  {
    id: 'screener-design',
    title: 'Screener Design',
    description: 'For brands with a luxury market, an error should never exist, every insight must be carefully studied, experienced, influenced, and integrated with the industry. We research deeper into your expectations, and build screeners to refine your luxury product. It’s not about how you reach the company, but how accurately you reach them. In Tech Eyrie insights start with the right voice and choice. ',
    imageAlt: 'Researchers collaborating on screener questionnaire design with documents spread on table',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop'
  },
  {
    id: 'study-design',
    title: 'Study/Research Design',
    description: "At Tech Eyrie, insights are made with intelligent designs built with precision, purpose and a powerful vision. If you are new to the market, or making high-end decisions, our research team will guide you in methodologies, objectives and execution to move forward with confidence, speed and consistency. Tech Eyrie doesn't just make designs, it designs the foundation for a smarter future.",
    imageAlt: 'Two researchers planning study design with laptop and research documents in professional setting',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
  },
  {
    id: 'discussion-guide',
    title: 'Discussion Guide Development',
    description: 'At Tech Eyrie, we engage in a deep discussion to understand your objectives, timeline, and expectations. Our team will begin with warm up questions, to perspectives to the  clarity of your business. Tech Eyrie values your insights and conversations, it is all about well structured conversion and strategic advancement.',
    imageAlt: 'Professional researcher preparing discussion guide for focus group moderation',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop'
  },
  {
    id: 'desk-research',
    title: 'Desk Research',
    description: 'Tech Eyrie is built on primary research, but when the clients need extra guidance, we summarise the existing information into narrative format to support their objectives. Gathering data, refining,  connecting and boosting it for a meaningful result. At Tech Eyrie we make sure to build a sharper, deeper and stronger understanding of your market.',
    imageAlt: 'Research team conducting desk research and analysing existing data on laptop',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
  },
  {
    id: 'analysis-reporting',
    title: 'Analysis & Reporting',
    description: 'We don’t just guide you, we focus on the objectives, challenges and your growth as a team. Tech Eyrie gathers data, uncover insights, dive deeper into observations and derives into positive outcomes. Our team is involved in your full project, from preparing summaries to tailoring the outputs according to your needs. We help you reach the goal with confidence and direction.',
    imageAlt: 'Research analyst holding report folder with insights and recommendations',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
  },
  {
    id: 'translation-transcripts',
    title: 'Translation and Transcripts',
    description: 'Whether you need stimuli translated or the full transcripts of focus group recordings, MindMarket works with a global network of professional linguists, which allows us to offer quicker turnaround times than most agencies. Our researchers can then use the collected insights for their analysis and reporting.',
    imageAlt: 'Professional linguist wearing headphones transcribing focus group recordings at laptop',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop'
  }
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
