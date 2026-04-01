export const servicesCatalog = [
  { title: "AI Product Development", slug: "ai-product-development", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&q=80", description: "We turn AI ideas into fully functional, production-ready products for real-world impact." },
  { title: "AI Agents & Autonomous Systems", slug: "ai-agents-autonomous-systems", image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1400&q=80", description: "We build reasoning agents that complete complex tasks with minimal human intervention." },
  { title: "Generative AI & LLM Development", slug: "generative-ai-llm-development", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1400&q=80", description: "We design and deploy business-ready LLM systems, RAG pipelines, and private AI stacks." },
  { title: "Custom Model Training & Fine-Tuning", slug: "custom-model-training-fine-tuning", image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1400&q=80", description: "We adapt foundation models to your domain for precise, reliable production performance." },
  { title: "Intelligent Process Automation", slug: "intelligent-process-automation", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=80", description: "We automate high-cost workflows with AI systems that improve speed, quality, and scalability." },
  { title: "Robotic Process Automation (RPA)", slug: "robotic-process-automation-rpa", image: "https://images.unsplash.com/photo-1581092919535-7146ff1a590b?w=1400&q=80", description: "We deploy software robots for repetitive rule-based tasks to free teams for strategic work." },
  { title: "NLP & Recommendation Systems", slug: "nlp-recommendation-systems", image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=1400&q=80", description: "We build language systems and recommendation engines for personalization at scale." },
  { title: "Chatbots & Conversational AI", slug: "chatbots-conversational-ai", image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1400&q=80", description: "We create conversational assistants that resolve real queries and improve continuously." },
  { title: "Web Design & Development", slug: "web-design-development", image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1400&q=80", description: "We craft high-performance websites optimized for conversion and user experience." },
  { title: "Full Stack Development", slug: "full-stack-development", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1400&q=80", description: "We build complete applications across frontend, backend, and data layers." },
  { title: "eCommerce Development", slug: "ecommerce-development", image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1400&q=80", description: "We engineer conversion-focused commerce experiences with robust operations behind the scenes." },
  { title: "CMS & LMS Development", slug: "cms-lms-development", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&q=80", description: "We build scalable content and learning systems tailored to your internal operations." },
  { title: "Cloud & Data Engineering", slug: "cloud-data-engineering", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80", description: "We architect resilient cloud systems and reliable data pipelines." },
  { title: "Business Intelligence & Analytics", slug: "business-intelligence-analytics", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80", description: "We transform fragmented data into actionable dashboards and decision intelligence." },
  { title: "Enterprise & SaaS Integrations", slug: "enterprise-saas-integrations", image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1400&q=80", description: "We unify your platforms into connected systems with clean data flow." },
  { title: "Blockchain & Smart Contracts", slug: "blockchain-smart-contracts", image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1400&q=80", description: "We build secure smart contracts and decentralized apps for trust-driven workflows." },
  { title: "DeFi & Asset Tokenization", slug: "defi-asset-tokenization", image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1400&q=80", description: "We design DeFi products and tokenization systems for new digital value models." },
  { title: "Maintenance, SEO & Support", slug: "maintenance-seo-support", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=80", description: "We maintain, optimize, and grow your digital products with proactive technical support." }
];

const aiOfferings = [
  "RAG Pipeline Development - Connect models to your internal knowledge base.",
  "Private Model Deployment - Run AI inside your secure infrastructure.",
  "Fine-Tuning Workflows - Improve accuracy with domain-specific data.",
  "AI API Integration - Embed intelligence into existing products.",
  "Model Evaluation - Track output quality, safety, and reliability."
];

const engineeringOfferings = [
  "Solution Architecture - Define a scalable technical blueprint.",
  "Modular Build System - Ship features fast with maintainable foundations.",
  "Integration Layer - Connect APIs, databases, and internal tools.",
  "Performance Engineering - Optimize speed, resilience, and cost.",
  "Security Hardening - Build with compliance and governance in mind."
];

const automationOfferings = [
  "Process Mapping - Identify costly manual bottlenecks.",
  "Workflow Orchestration - Automate multi-step business operations.",
  "RPA Bot Development - Deploy bots for repetitive rule-based work.",
  "Exception Handling - Build guardrails for edge-case scenarios.",
  "Monitoring Dashboard - Track productivity and quality gains."
];

const getServiceType = (slug = "") => {
  if (slug.includes("ai") || slug.includes("llm") || slug.includes("nlp") || slug.includes("chatbot") || slug.includes("model")) return "ai";
  if (slug.includes("automation") || slug.includes("rpa")) return "automation";
  if (slug.includes("cloud") || slug.includes("analytics") || slug.includes("integration") || slug.includes("stack") || slug.includes("web") || slug.includes("cms") || slug.includes("ecommerce")) return "engineering";
  if (slug.includes("blockchain") || slug.includes("defi")) return "engineering";
  return "engineering";
};

const offeringsByType = {
  ai: aiOfferings,
  engineering: engineeringOfferings,
  automation: automationOfferings,
};

const technologiesByType = {
  ai: [
    { name: "Python", logo: "https://skillicons.dev/icons?i=python" },
    { name: "PyTorch", logo: "https://skillicons.dev/icons?i=pytorch" },
    { name: "TensorFlow", logo: "https://skillicons.dev/icons?i=tensorflow" },
    { name: "OpenAI API", logo: "https://skillicons.dev/icons?i=ai" },
    { name: "LangChain", logo: "https://skillicons.dev/icons?i=typescript" },
    { name: "Docker", logo: "https://skillicons.dev/icons?i=docker" },
    { name: "AWS", logo: "https://skillicons.dev/icons?i=aws" },
    { name: "PostgreSQL", logo: "https://skillicons.dev/icons?i=postgres" }
  ],
  engineering: [
    { name: "React", logo: "https://skillicons.dev/icons?i=react" },
    { name: "Next.js", logo: "https://skillicons.dev/icons?i=nextjs" },
    { name: "Node.js", logo: "https://skillicons.dev/icons?i=nodejs" },
    { name: "TypeScript", logo: "https://skillicons.dev/icons?i=typescript" },
    { name: "MongoDB", logo: "https://skillicons.dev/icons?i=mongodb" },
    { name: "PostgreSQL", logo: "https://skillicons.dev/icons?i=postgres" },
    { name: "Docker", logo: "https://skillicons.dev/icons?i=docker" },
    { name: "AWS", logo: "https://skillicons.dev/icons?i=aws" }
  ],
  automation: [
    { name: "Python", logo: "https://skillicons.dev/icons?i=python" },
    { name: "Node.js", logo: "https://skillicons.dev/icons?i=nodejs" },
    { name: "Selenium", logo: "https://skillicons.dev/icons?i=selenium" },
    { name: "Docker", logo: "https://skillicons.dev/icons?i=docker" },
    { name: "AWS", logo: "https://skillicons.dev/icons?i=aws" },
    { name: "PostgreSQL", logo: "https://skillicons.dev/icons?i=postgres" }
  ]
};

export function getServiceDetailData(slug) {
  const current = servicesCatalog.find((item) => item.slug === slug) || servicesCatalog[0];
  const type = getServiceType(current.slug);
  const related = servicesCatalog.filter((item) => item.slug !== current.slug).slice(0, 3);
  const caseStudies = [
    {
      title: `${current.title} Rollout`,
      image: current.image,
      outcome: "42% Workflow Time Saved",
      summary: "Production deployment across core operations with measurable speed and quality gains."
    },
    {
      title: `${related[0]?.title || "Platform"} Integration`,
      image: related[0]?.image || current.image,
      outcome: "2.8x Delivery Velocity",
      summary: "Unified legacy systems and modern tooling into one scalable service architecture."
    },
    {
      title: `${related[1]?.title || "Growth"} Optimization`,
      image: related[1]?.image || current.image,
      outcome: "63% Cost Reduction",
      summary: "Automated repetitive flows and improved decision quality with data-backed orchestration."
    }
  ];

  return {
    ...current,
    heroImage: current.image,
    caseImage: related[0]?.image || current.image,
    headline: `We Build ${current.title} That Delivers Real Business Outcomes.`,
    supportingLine: "From strategy to deployment, we build production-ready systems that compound value from day one.",
    problemStatement:
      "Most teams are overloaded with disconnected tools, manual processes, and data they cannot operationalize. Growth stalls not because effort is missing, but because systems are not intelligent enough to scale decisions.",
    whatWeDo:
      "We begin with business intent, then design the technical path that turns complexity into repeatable outcomes. Our team blends product strategy, architecture, and implementation to build systems that fit your workflows, reduce friction, and perform reliably in production - not in isolated prototypes.",
    keyOfferings: offeringsByType[type],
    process: [
      { step: 1, title: "Discovery", description: "We understand your goals, systems, and pain points." },
      { step: 2, title: "Architecture", description: "We design the technical blueprint for your stack." },
      { step: 3, title: "Build", description: "We engineer the solution with regular checkpoints." },
      { step: 4, title: "Deploy", description: "We launch and integrate into production." },
      { step: 5, title: "Support", description: "Ongoing monitoring, optimization, and support." }
    ],
    technologies: technologiesByType[type],
    audience: [
      "Startups launching new digital products that must scale quickly.",
      "Enterprise teams reducing manual overhead across operations.",
      "Product leaders needing measurable outcomes from existing data."
    ],
    stats: ["3x Faster Processing", "60% Cost Reduction", "10x ROI in 6 Months"],
    caseStudies,
    faqs: [
      { q: "How long does a typical project take?", a: "Most projects take 6-16 weeks depending on scope, integrations, and deployment complexity." },
      { q: "Do you work with our existing tech stack?", a: "Yes. We audit your current stack and design an approach that reuses what already works." },
      { q: "Do we need to provide training data?", a: "If applicable, yes. We also help prepare, clean, and structure your data for production use." },
      { q: "What does handoff look like after deployment?", a: "You get documentation, code walkthroughs, and a structured transition plan with support windows." },
      { q: "Can we start small and scale later?", a: "Absolutely. We can begin with a focused pilot and expand once outcomes are validated." }
    ],
    related
  };
}
