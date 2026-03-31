"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const industries = [
  {
    id: 1,
    title: "AI Product Development",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    link: "/services1/ai-product-development",
    slug: "ai-product-development",
    description: "We turn AI ideas into fully functional, production-ready products - from intelligent recommendation engines to computer vision systems built for real-world impact."
  },
  {
    id: 2,
    title: "AI Agents & Autonomous Systems",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80",
    link: "/services1/ai-agents-autonomous-systems",
    slug: "ai-agents-autonomous-systems",
    description: "We build AI agents that don't just answer questions - they reason, make decisions, and complete complex multi-step tasks without human hand-holding."
  },
  {
    id: 3,
    title: "Generative AI & LLM Development",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80",
    link: "/services1/generative-ai-llm-development",
    slug: "generative-ai-llm-development",
    description: "We design, fine-tune, and deploy large language models tailored to your business - including RAG pipelines, private LLMs, and deep custom AI integrations."
  },
  {
    id: 4,
    title: "Custom Model Training & Fine-Tuning",
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&q=80",
    link: "/services1/custom-model-training-fine-tuning",
    slug: "custom-model-training-fine-tuning",
    description: "We take powerful foundation models and make them yours - trained on your data, aligned to your domain, and optimized for production performance."
  },
  {
    id: 5,
    title: "Intelligent Process Automation",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
    link: "/services1/intelligent-process-automation",
    slug: "intelligent-process-automation",
    description: "We map, redesign, and automate your most expensive workflows using AI-driven automation that cuts costs, reduces errors, and scales without limits."
  },
  {
    id: 6,
    title: "Robotic Process Automation (RPA)",
    image: "https://images.unsplash.com/photo-1581092919535-7146ff1a590b?w=1200&q=80",
    link: "/services1/robotic-process-automation-rpa",
    slug: "robotic-process-automation-rpa",
    description: "We deploy software robots that silently handle your repetitive, rule-based tasks 24/7 - freeing your team to focus on work that actually needs them."
  },
  {
    id: 7,
    title: "NLP & Recommendation Systems",
    image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=1200&q=80",
    link: "/services1/nlp-recommendation-systems",
    slug: "nlp-recommendation-systems",
    description: "We build language processing tools and smart recommendation engines that understand your users and deliver hyper-personalized experiences at scale."
  },
  {
    id: 8,
    title: "Chatbots & Conversational AI",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80",
    link: "/services1/chatbots-conversational-ai",
    slug: "chatbots-conversational-ai",
    description: "We design intelligent assistants that go beyond scripted responses - handling real queries, integrating with your systems, and improving over time."
  },
  {
    id: 9,
    title: "Web Design & Development",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
    link: "/services1/web-design-development",
    slug: "web-design-development",
    description: "We craft fast, modern, and visually refined websites built for performance, conversion, and seamless user experience across every device."
  },
  {
    id: 10,
    title: "Full Stack Development",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80",
    link: "/services1/full-stack-development",
    slug: "full-stack-development",
    description: "From pixel-perfect frontends to bulletproof backends and databases - we build complete, scalable applications engineered to grow with your business."
  },
  {
    id: 11,
    title: "eCommerce Development",
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&q=80",
    link: "/services1/ecommerce-development",
    slug: "ecommerce-development",
    description: "We build and migrate high-converting stores with custom functionality, smooth checkout experiences, and the backend logic your business model demands."
  },
  {
    id: 12,
    title: "CMS & LMS Development",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
    link: "/services1/cms-lms-development",
    slug: "cms-lms-development",
    description: "We develop flexible content and learning platforms that are easy to manage, built to scale, and tailored to how your team actually works."
  },
  {
    id: 13,
    title: "Cloud & Data Engineering",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    link: "/services1/cloud-data-engineering",
    slug: "cloud-data-engineering",
    description: "We architect reliable, scalable cloud infrastructure and data pipelines that ensure your data is clean, accessible, and always working for you."
  },
  {
    id: 14,
    title: "Business Intelligence & Analytics",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    link: "/services1/business-intelligence-analytics",
    slug: "business-intelligence-analytics",
    description: "We transform scattered data into sharp, interactive dashboards and reports that give decision-makers the clarity they need to act fast and confidently."
  },
  {
    id: 15,
    title: "Enterprise & SaaS Integrations",
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1200&q=80",
    link: "/services1/enterprise-saas-integrations",
    slug: "enterprise-saas-integrations",
    description: "We connect your CRMs, ERPs, third-party platforms, and internal tools into one unified ecosystem - eliminating silos and manual data juggling."
  },
  {
    id: 16,
    title: "Blockchain & Smart Contracts",
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&q=80",
    link: "/services1/blockchain-smart-contracts",
    slug: "blockchain-smart-contracts",
    description: "We develop secure, audited smart contracts and decentralized applications that automate trust and remove the need for intermediaries."
  },
  {
    id: 17,
    title: "DeFi & Asset Tokenization",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&q=80",
    link: "/services1/defi-asset-tokenization",
    slug: "defi-asset-tokenization",
    description: "We build decentralized finance protocols and tokenize real-world assets - opening new revenue models and liquidity opportunities on Web3 infrastructure."
  },
  {
    id: 18,
    title: "Maintenance, SEO & Support",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    link: "/services1/maintenance-seo-support",
    slug: "maintenance-seo-support",
    description: "We keep your digital products healthy, fast, and discoverable - with proactive monitoring, performance tuning, and SEO that compounds over time."
  }
];

export default function IndustriesGrid({ theme = 'light' }) {
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
      className="relative w-full py-16 md:py-20 lg:py-24 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20"
      style={{ 
        background: isDark 
          ? 'linear-gradient(to bottom, #1a1a1a 0%, #0a0a0a 100%)'
          : 'linear-gradient(to bottom, #e8ddd3 0%, #d4c4b8 100%)'
      }}
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
