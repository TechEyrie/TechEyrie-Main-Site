"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { services1ListingDarkSurface } from '../services1/services1ListingSurfaces';

gsap.registerPlugin(ScrollTrigger);

const industries = [

  {
    id: 1,
    title: "Artificial intelligence",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    link: "/services1/ai-product-development",
    slug: "ai-product-development",
    description: "We built strong AI-powered systems that will help your business grow faster. From automating tasks to analyzing insights, our AI-solutions are well-organized to help through decision-making, and elevate customer’s experience. Every system will help you to elevate efficiency, grow results and upgrade the business. "
  },
  {
    id: 2,
    title: "Automation",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80",
    link: "/services1/ai-agents-autonomous-systems",
    slug: "ai-agents-autonomous-systems",
    description: "We create automation to make your business look simple and save you time. We simplify operations by automating routine tasks and connecting tools allowing your team to focus on work that drives results.  "
  },
  {
    id: 3,
    title: "SaaS Development",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80",
    link: "/services1/generative-ai-llm-development",
    slug: "generative-ai-llm-development",
    description: "we design and craft custom SaaS platforms to help your business provide flawless cloud-based solutions to the clients. Our system ensures flawless user experience, robust security, and high performance while combining automation and analytics to optimize operations. Every system we craft is suitable for the business needs, designed for users and gives measurable results. "
  },
  {
    id: 4,
    title: "Web Development",
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&q=80",
    link: "/services1/custom-model-training-fine-tuning",
    slug: "custom-model-training-fine-tuning",
    description: "We craft websites and digital systems that work great and help the business grow. Every site we built is mobile-friendly, fast, and optimized for search engines, integrating automation tools that save your time smoothes your workflow. From designing to simple business to complex platforms our services are flawless, and attracts high-value clients"
  },
  {
    id: 5,
    title: "API Development",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
    link: "/services1/intelligent-process-automation",
    slug: "intelligent-process-automation",
    description: "Our API development system ensures that your data flows smoothly, processes are automated and digital systems work efficiently. Every API we create is reliable, secure and tailored to your business needs, helping you save time, reduce manual errors and boost your operations effortlessly"
  },
  {
    id: 6,
    title: "Web Design",
    image: "https://images.unsplash.com/photo-1581092919535-7146ff1a590b?w=1200&q=80",
    link: "/services1/robotic-process-automation-rpa",
    slug: "robotic-process-automation-rpa",
    description: "we build smart, digital systems and  build websites that will help to run a smooth business. Our websites aren’t just for looks, it actually works on you to automate tasks, capture leads, connect to the tools and ease your tasks. This will help you to focus on more business strategies, saving your time."
  },




  // {
  //   id: 1,
  //   title: "AI powered solutions",
  //   image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
  //   link: "/services1/ai-product-development",
  //   slug: "ai-product-development",
  //   description: "We transform your ideas into fully ready AI-solution that would analyze with precision to build designs that elevate your vision to strategic asset not just concept "
  // },
  // {
  //   id: 2,
  //   title: "Personalized AI Agents",
  //   image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80",
  //   link: "/services1/ai-agents-autonomous-systems",
  //   slug: "ai-agents-autonomous-systems",
  //   description: "At Tech Eyrie, AI agents don’t just give you answers, they question you, make conclusions, and deploy multiple tasks to free your team to focus on what really matters. "
  // },
  // {
  //   id: 3,
  //   title: "AI system and Language System Development",
  //   image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80",
  //   link: "/services1/generative-ai-llm-development",
  //   slug: "generative-ai-llm-development",
  //   description: "Our AI system will reflect your business, data and insights. It is curated with LLMs, RAG Pipelines, and integrated AI system to deliver powerful insights, elevate workflows and unleash innovations."
  // },
  // {
  //   id: 4,
  //   title: "Refined intelligence, Around your industry",
  //   image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&q=80",
  //   link: "/services1/custom-model-training-fine-tuning",
  //   slug: "custom-model-training-fine-tuning",
  //   description: "Every model is tuned to demonstrate your goals, workflows and logic, ensuring consistency and accuracy. Our AI models are curated to understand your context and perform reliably to meet clarity. "
  // },
  // {
  //   id: 5,
  //   title: "Smart workflow automation",
  //   image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
  //   link: "/services1/intelligent-process-automation",
  //   slug: "intelligent-process-automation",
  //   description: "By combining intelligent decision making and workflow automation we redesign, and plan your workflows, cutting costs, reducing human errors and eliminating inefficiency to move faster and smarter."
  // },
  // {
  //   id: 6,
  //   title: "RPA and Automation",
  //   image: "https://images.unsplash.com/photo-1581092919535-7146ff1a590b?w=1200&q=80",
  //   link: "/services1/robotic-process-automation-rpa",
  //   slug: "robotic-process-automation-rpa",
  //   description: "Our 24/7 RPA is designed to integrate into your workflow to elevate productivity without errors, resulting in a smooth, fast and efficient business. Which will help your team to focus on high-end work that truly matters. "
  // },
  // {
  //   id: 7,
  //   title: "NLP Solutions and personalized Engines",
  //   image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=1200&q=80",
  //   link: "/services1/nlp-recommendation-systems",
  //   slug: "nlp-recommendation-systems",
  //   description: "At Tech Eyrie, our systems are crafted in a way to understand your insights and deliver solutions accurately, our NLP system will help businesses to operate extensively using AI text analysis."
  // },
  // {
  //   id: 8,
  //   title: "Virtual Assistance and AI",
  //   image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80",
  //   link: "/services1/chatbots-conversational-ai",
  //   slug: "chatbots-conversational-ai",
  //   description: "Not just scripted answers, our chatbots work closely to integrate real world queries, understanding, adapting and delivering values that feel natural, personal and ideal. "
  // },
  // {
  //   id: 9,
  //   title: "Custom Web Solution",
  //   image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
  //   link: "/services1/web-design-development",
  //   slug: "web-design-development",
  //   description: "From interactive designs to scalable solutions,our web development team ensures flexible, intelligent and adaptable insights ensuring your digital presence is beautiful and strategically  effective."
  // },
  // {
  //   id: 10,
  //   title: "End-to-End web and Application Development",
  //   image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80",
  //   link: "/services1/full-stack-development",
  //   slug: "full-stack-development",
  //   description: "Our techniques are blended with elegant designs with attentive engineering creating platforms that remain reliable as per your needs, by giving end-to-end business solutions. At Tech Eyrie Stack development is a long-term success."
  // },
  // {
  //   id: 11,
  //   title: "Digital store solution",
  //   image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&q=80",
  //   link: "/services1/ecommerce-development",
  //   slug: "ecommerce-development",
  //   description: "At Tech Eyrie, our system is crafted with backend logic to ensure online stores are run smoothly with effortless checkout. We make sure every platform aligns perfectly with your strategic business insights values ensuring authenticity and excellence."
  // },
  // {
  //   id: 12,
  //   title: "Full Stack CMS & LMS Engineering",
  //   image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
  //   link: "/services1/cms-lms-development",
  //   slug: "cms-lms-development",
  //   description: "Every system is built with accuracy and flexibility of LMS and CMS to ensure that your content and learning operations remain structured as your organization develops, helping your team to focus on creating values not complexity."
  // },
  // {
  //   id: 13,
  //   title: "Cloud- Native solutions and Data platforms",
  //   image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
  //   link: "/services1/cloud-data-engineering",
  //   slug: "cloud-data-engineering",
  //   description: "We craft strong and flexible cloud infrastructure and design end-to-end pipelines to verify your data is clean, approachable and powering your ideas, enabling your team to elevate with confidence and speed."
  // },
  // {
  //   id: 14,
  //   title: "Predictive Analysis and Reporting",
  //   image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
  //   link: "/services1/business-intelligence-analytics",
  //   slug: "business-intelligence-analytics",
  //   description: "Our analytics are instruments that transform scattered information into interactive analytical dashboards and reports that ease decision- makers with clarity, speed and confidence. We craft data visualization paths for smarter decisions."
  // },
  // {
  //   id: 15,
  //   title: "Business platform integration system",
  //   image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1200&q=80",
  //   link: "/services1/enterprise-saas-integrations",
  //   slug: "enterprise-saas-integrations",
  //   description: "We combine your CRMs, ERPs, third-party platforms and internal tools into a high-performing network that develops decision making and operational efficiency and reduces manual errors. "
  // },
  // {
  //   id: 16,
  //   title: "Smart contract Engineering",
  //   image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&q=80",
  //   link: "/services1/blockchain-smart-contracts",
  //   slug: "blockchain-smart-contracts",
  //   description: "Securing audited smart contracts and decentralized applications that ensures trust, scalability and ideal to your business operations, eliminating mediators and unlocking new business models"
  // },
  // {
  //   id: 17,
  //   title: "DeFi & Asset Tokenization",
  //   image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&q=80",
  //   link: "/services1/defi-asset-tokenization",
  //   slug: "defi-asset-tokenization",
  //   description: "We build decentralized finance protocols and tokenize real-world assets - opening new revenue models and liquidity opportunities on Web3 infrastructure."
  // },
  // {
  //   id: 18,
  //   title: "Maintenance, SEO & Support",
  //   image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
  //   link: "/services1/maintenance-seo-support",
  //   slug: "maintenance-seo-support",
  //   description: "We keep your digital products healthy, fast, and discoverable - with proactive monitoring, performance tuning, and SEO that compounds over time."
  // }
];

export default function IndustriesGrid({ theme = 'light', dark7 = false }) {
  const isDark = theme === 'dark';
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial positions for all cards to ensure alignment
      gsap.set(cardsRef.current, {
        opacity: 0,
        y: 60,
      });

      // Stagger animation for cards on scroll
      gsap.to(cardsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none none',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleBookmark = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle bookmark logic here
    console.log(`Bookmarked industry: ${id}`);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-16 md:py-20 lg:py-24 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 transition-colors duration-500"
      style={
        isDark && dark7
          ? services1ListingDarkSurface
          : isDark
            ? { background: 'linear-gradient(to bottom, #1a1a1a 0%, #0a0a0a 100%)' }
            : { background: 'linear-gradient(to bottom, #e8ddd3 0%, #d4c4b8 100%)' }
      }
    >
      <div className="max-w-[1800px] mx-auto">
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-start">
          {industries.map((industry, index) => (
            <a
              key={industry.id}
              href={industry.link}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative block aspect-[16/11] overflow-hidden rounded-xl cursor-pointer transition-transform duration-300 hover:scale-[1.02] w-full"
              style={{
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={industry.image}
                  alt={industry.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              </div>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

              {/* Bookmark Icon */}
              <button
                onClick={(e) => handleBookmark(e, industry.id)}
                className="absolute top-5 left-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                aria-label={`Bookmark ${industry.title}`}
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>

              {/* Title + Hover Description */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <h3 className="font-italiana text-white text-[22px] sm:text-[24px] md:text-[26px] lg:text-[30px] font-light leading-tight" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                  {industry.title}
                </h3>
                <p className="mt-3 max-h-0 overflow-hidden opacity-0 translate-y-2 transition-all duration-500 ease-out group-hover:max-h-32 group-hover:opacity-100 group-hover:translate-y-0 font-merriweather text-[13px] md:text-[14px] leading-relaxed text-white/90 pr-1">
                  {industry.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
