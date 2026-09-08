export const expertiseCatalog = [
  {
    slug: "blockchain",
    title: "Blockchain",
    shortTitle: "Blockchain",
    pageTitle: "Blockchain Expertise | Tech Eyrie",
    teaser:
      "Trust-layer systems—smart contracts, tokenization, and production Web3 infrastructure that turn transparency into measurable value.",
    keywords: [
      "Smart Contracts",
      "Tokenization",
      "DeFi",
      "Web3 Infrastructure",
      "On-chain Trust",
    ],
    image:
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1400&q=80",
    relatedServices: [
      "blockchain-smart-contracts",
      "defi-asset-tokenization",
      "enterprise-saas-integrations",
    ],
  },
  {
    slug: "full-stack",
    title: "Full Stack",
    shortTitle: "Full Stack",
    pageTitle: "Full Stack Expertise | Tech Eyrie",
    teaser:
      "End-to-end product engineering—interfaces people love, APIs that hold up, and data layers built for growth.",
    keywords: [
      "Product Engineering",
      "APIs & Backends",
      "Modern Frontends",
      "Scalable Architecture",
      "Secure Delivery",
    ],
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1400&q=80",
    relatedServices: [
      "full-stack-development",
      "web-design-development",
      "ecommerce-development",
    ],
  },
  {
    slug: "cloud-system-integration",
    title: "Cloud & System Integration Services",
    shortTitle: "Cloud & Integration",
    pageTitle: "Cloud & System Integration Expertise | Tech Eyrie",
    teaser:
      "Connected operations—cloud platforms, CRM/ERP bridges, and reliable data flows that remove friction across the enterprise.",
    keywords: [
      "Cloud Architecture",
      "ERP & CRM",
      "API Integration",
      "Data Pipelines",
      "Real-time Ops",
    ],
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80",
    relatedServices: [
      "cloud-data-engineering",
      "enterprise-saas-integrations",
      "business-intelligence-analytics",
    ],
  },
];

const serviceMeta = {
  "blockchain-smart-contracts": {
    title: "Blockchain & Smart Contracts",
    image:
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1400&q=80",
    description:
      "Secure smart contracts and decentralized apps for trust-driven workflows.",
  },
  "defi-asset-tokenization": {
    title: "DeFi & Asset Tokenization",
    image:
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1400&q=80",
    description:
      "DeFi products and tokenization systems for new digital value models.",
  },
  "enterprise-saas-integrations": {
    title: "Enterprise & SaaS Integrations",
    image:
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1400&q=80",
    description: "Unify platforms into connected systems with clean data flow.",
  },
  "full-stack-development": {
    title: "Full Stack Development",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1400&q=80",
    description:
      "Complete applications across frontend, backend, and data layers.",
  },
  "web-design-development": {
    title: "Web Design & Development",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1400&q=80",
    description:
      "High-performance websites optimized for conversion and experience.",
  },
  "ecommerce-development": {
    title: "eCommerce Development",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1400&q=80",
    description:
      "Conversion-focused commerce with robust operations behind the scenes.",
  },
  "cloud-data-engineering": {
    title: "Cloud & Data Engineering",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80",
    description: "Resilient cloud systems and reliable data pipelines.",
  },
  "business-intelligence-analytics": {
    title: "Business Intelligence & Analytics",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80",
    description:
      "Fragmented data turned into actionable dashboards and decision intelligence.",
  },
};

const detailBySlug = {
  blockchain: {
    headline: "Trust you can ship—on-chain systems built for real business.",
    supportingLine:
      "We translate blockchain from buzzword to operating advantage: audited contracts, resilient infrastructure, and token models that create clarity instead of complexity.",
    problemStatement:
      "Most blockchain initiatives stall between whitepaper and production. Fragile contracts, unclear custody flows, and integrations that ignore compliance leave teams with demos instead of durable systems. Trust breaks when the architecture cannot survive real users, real money, and real audits.",
    whatWeDo:
      "Tech Eyrie designs and delivers blockchain systems that earn confidence—smart contracts with rigorous review, token and asset flows that map to business rules, and Web3 infrastructure wired into the platforms you already run. We prioritize security, observability, and measurable outcomes over speculative novelty.",
    keyOfferings: [
      "Smart contract design, development, and audit-ready delivery",
      "Asset tokenization and on-chain ownership workflows",
      "DeFi product modules with risk-aware architecture",
      "Wallet, custody, and identity integration patterns",
      "Cross-chain bridges and interoperability planning",
      "Enterprise Web3 adapters for ERP, CRM, and internal APIs",
    ],
    process: [
      {
        step: 1,
        title: "Discover",
        description:
          "Map use cases, regulatory constraints, and success metrics before writing a line of Solidity.",
      },
      {
        step: 2,
        title: "Architect",
        description:
          "Choose networks, custody models, and security boundaries that fit your risk profile.",
      },
      {
        step: 3,
        title: "Build",
        description:
          "Ship contracts and services with tests, reviews, and staged environments.",
      },
      {
        step: 4,
        title: "Harden",
        description:
          "Stress paths for abuse, upgradeability, monitoring, and incident response.",
      },
      {
        step: 5,
        title: "Operate",
        description:
          "Launch with runbooks, observability, and a clear path to iterate safely.",
      },
    ],
    technologies: [
      { name: "Solidity", logo: "https://skillicons.dev/icons?i=solidity", role: "Smart contracts" },
      { name: "Rust", logo: "https://skillicons.dev/icons?i=rust", role: "High-perf chains" },
      { name: "TypeScript", logo: "https://skillicons.dev/icons?i=typescript", role: "dApp logic" },
      { name: "JavaScript", logo: "https://skillicons.dev/icons?i=js", role: "Web3 clients" },
      { name: "React", logo: "https://skillicons.dev/icons?i=react", role: "Wallet UX" },
      { name: "Node.js", logo: "https://skillicons.dev/icons?i=nodejs", role: "Indexers & APIs" },
      { name: "GraphQL", logo: "https://skillicons.dev/icons?i=graphql", role: "Chain data APIs" },
      { name: "PostgreSQL", logo: "https://skillicons.dev/icons?i=postgres", role: "Off-chain state" },
      { name: "Redis", logo: "https://skillicons.dev/icons?i=redis", role: "Caching & queues" },
      { name: "Docker", logo: "https://skillicons.dev/icons?i=docker", role: "Node packaging" },
      { name: "AWS", logo: "https://skillicons.dev/icons?i=aws", role: "Secure hosting" },
      { name: "Linux", logo: "https://skillicons.dev/icons?i=linux", role: "Validator ops" },
    ],
    techCoreLabel: "On-chain & application",
    techPlatformLabel: "Indexing, data & infrastructure",
    techIntro:
      "Contracts, dApp interfaces, and the off-chain systems that keep blockchain products reliable in production.",
    audience: [
      "Fintech and marketplace teams tokenizing assets or settling on-chain.",
      "Enterprises needing provenance, audit trails, and shared ledgers.",
      "Product leaders launching Web3 experiences without sacrificing security.",
    ],
    stats: ["99.9% Uptime Targets", "Audit-Ready Delivery", "4x Faster Settlements"],
    caseStudies: [
      {
        title: "Tokenized Settlement Layer",
        image:
          "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1400&q=80",
        outcome: "Settlement Cycle Cut 70%",
        summary:
          "Replaced multi-day reconciliations with an audited contract flow and operational dashboards for finance leadership.",
      },
      {
        title: "Enterprise Provenance Chain",
        image:
          "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1400&q=80",
        outcome: "Full Traceability Live",
        summary:
          "Connected supply events to an immutable ledger while keeping ERP as the system of record.",
      },
      {
        title: "DeFi Product Launch Pad",
        image:
          "https://images.unsplash.com/photo-1642104704074-907c2567b945?w=1400&q=80",
        outcome: "Zero Critical Findings",
        summary:
          "Shipped a staged DeFi module with formal review gates and continuous monitoring from day one.",
      },
    ],
    faqs: [
      {
        q: "Do you only work on public chains?",
        a: "No. We evaluate public, private, and hybrid models based on trust requirements, latency, cost, and compliance—not ideology.",
      },
      {
        q: "How do you approach smart contract security?",
        a: "Threat modeling, test coverage, peer review, staging drills, and optional third-party audits before mainnet exposure.",
      },
      {
        q: "Can blockchain integrate with our existing stack?",
        a: "Yes. We treat chain components as services—connected through APIs, event streams, and identity layers your teams already understand.",
      },
      {
        q: "What does a typical engagement look like?",
        a: "A discovery sprint, architecture decision record, MVP contracts or modules, hardening, then production support with clear ownership.",
      },
      {
        q: "Is tokenization right for every asset?",
        a: "Not always. We pressure-test legal, operational, and liquidity assumptions before recommending a token model.",
      },
    ],
    ctaHeading: "Ready to turn trust into infrastructure?",
    ctaSub:
      "Tell us the outcome you need—settlement, provenance, or a new digital asset model—and we will map the path to production.",
  },
  "full-stack": {
    headline: "Products that feel inevitable—from first click to last query.",
    supportingLine:
      "We engineer cohesive systems: expressive interfaces, disciplined APIs, and data layers that stay fast as you grow—so your product ships with confidence, not patches.",
    problemStatement:
      "Fragmented stacks create slow releases and fragile user journeys. Frontends drift from backends, APIs sprawl without contracts, and data models accumulate debt until every feature feels expensive. Teams burn cycles on integration glue instead of differentiation.",
    whatWeDo:
      "Tech Eyrie builds full-stack products as one composition—UX, application logic, and infrastructure aligned to business outcomes. We design for clarity: clean domain boundaries, observable services, and interfaces that convert. The result is software your team can extend without fear.",
    keyOfferings: [
      "Product UX and high-performance frontend engineering",
      "API design, microservices, and modular monoliths",
      "Secure auth, roles, and multi-tenant foundations",
      "Real-time features, search, and event-driven flows",
      "Database modeling, caching, and performance tuning",
      "CI/CD, environments, and production observability",
    ],
    process: [
      {
        step: 1,
        title: "Discover",
        description:
          "Clarify users, journeys, constraints, and the outcomes that define success.",
      },
      {
        step: 2,
        title: "Blueprint",
        description:
          "Shape information architecture, API contracts, and delivery milestones.",
      },
      {
        step: 3,
        title: "Build",
        description:
          "Ship vertical slices with reviews, automated tests, and demos every week.",
      },
      {
        step: 4,
        title: "Launch",
        description:
          "Harden performance, security, and rollout plans before users arrive.",
      },
      {
        step: 5,
        title: "Evolve",
        description:
          "Instrument, learn, and iterate so the product compounds after release.",
      },
    ],
    technologies: [
      { name: "React", logo: "https://skillicons.dev/icons?i=react", role: "UI components" },
      { name: "Next.js", logo: "https://skillicons.dev/icons?i=nextjs", role: "Web apps & SSR" },
      { name: "TypeScript", logo: "https://skillicons.dev/icons?i=typescript", role: "Typed product code" },
      { name: "Node.js", logo: "https://skillicons.dev/icons?i=nodejs", role: "API services" },
      { name: "NestJS", logo: "https://skillicons.dev/icons?i=nestjs", role: "Backend structure" },
      { name: "GraphQL", logo: "https://skillicons.dev/icons?i=graphql", role: "Flexible APIs" },
      { name: "PostgreSQL", logo: "https://skillicons.dev/icons?i=postgres", role: "Relational data" },
      { name: "MongoDB", logo: "https://skillicons.dev/icons?i=mongodb", role: "Document data" },
      { name: "Redis", logo: "https://skillicons.dev/icons?i=redis", role: "Sessions & cache" },
      { name: "Prisma", logo: "https://skillicons.dev/icons?i=prisma", role: "Database access" },
      { name: "Docker", logo: "https://skillicons.dev/icons?i=docker", role: "Consistent deploys" },
      { name: "AWS", logo: "https://skillicons.dev/icons?i=aws", role: "App hosting" },
    ],
    techCoreLabel: "Frontend & backend",
    techPlatformLabel: "Data layer & deployment",
    techIntro:
      "The languages, frameworks, and data tools we use to build complete products—from the interface to the database.",
    audience: [
      "Founders shipping MVPs that must look and feel production-ready.",
      "Product teams modernizing legacy apps without a big-bang rewrite.",
      "Operators who need reliable platforms for customers and internal staff.",
    ],
    stats: ["2.8x Delivery Speed", "40% Fewer Defects", "Sub-second UX Goals"],
    caseStudies: [
      {
        title: "Platform Rebuild Without Downtime",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=80",
        outcome: "Zero-Downtime Cutover",
        summary:
          "Strangled a legacy monolith into modular services while keeping customers online throughout migration.",
      },
      {
        title: "Conversion-First Web Product",
        image:
          "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1400&q=80",
        outcome: "+35% Qualified Signups",
        summary:
          "Redesigned critical funnels and backend latency paths to turn traffic into pipeline.",
      },
      {
        title: "Multi-Tenant SaaS Core",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80",
        outcome: "Tenant Isolation Hardened",
        summary:
          "Delivered auth, billing hooks, and data isolation patterns ready for enterprise buyers.",
      },
    ],
    faqs: [
      {
        q: "Do you build only greenfield products?",
        a: "No. We regularly modernize existing systems—strangler patterns, API layers, and UX upgrades that reduce risk.",
      },
      {
        q: "Which stack do you prefer?",
        a: "We default to proven modern stacks (React/Next, Node, Postgres) and adapt when your ecosystem or compliance requires it.",
      },
      {
        q: "How do you keep quality high under speed?",
        a: "Contract-first APIs, automated tests on critical paths, design reviews, and demoable increments every sprint.",
      },
      {
        q: "Will our team own the codebase?",
        a: "Always. You receive clean repositories, documentation, and a structured handoff—not a black box.",
      },
      {
        q: "Can you support after launch?",
        a: "Yes. We offer maintenance windows, performance tuning, and roadmap partnership as you scale.",
      },
    ],
    ctaHeading: "Ready to ship a product that holds together?",
    ctaSub:
      "Share the experience you want users to feel—and we will engineer the stack that delivers it.",
  },
  "cloud-system-integration": {
    headline: "One operating picture—systems that finally speak the same language.",
    supportingLine:
      "We connect cloud platforms, CRMs, ERPs, and custom services into reliable pipelines so your teams stop reconciling spreadsheets and start acting on live truth.",
    problemStatement:
      "Growth multiplies tools faster than it multiplies clarity. Data stalls in silos, integrations break silently, and leaders wait on reports that are already stale. Manual handoffs become the real system of record—expensive, fragile, and impossible to scale.",
    whatWeDo:
      "Tech Eyrie architects cloud and integration layers that make operations feel continuous. We design event flows, APIs, and data platforms that keep CRM, ERP, analytics, and custom apps synchronized—with monitoring, retries, and ownership models built in from the start.",
    keyOfferings: [
      "Cloud landing zones and scalable infrastructure design",
      "CRM, ERP, and SaaS integration blueprints",
      "API gateways, webhooks, and event-driven orchestration",
      "ETL/ELT pipelines and warehouse readiness",
      "Identity, access, and secure connectivity patterns",
      "Observability, alerting, and integration runbooks",
    ],
    process: [
      {
        step: 1,
        title: "Map",
        description:
          "Inventory systems, data contracts, failure modes, and the decisions that depend on them.",
      },
      {
        step: 2,
        title: "Design",
        description:
          "Define integration topology, cloud services, and security boundaries.",
      },
      {
        step: 3,
        title: "Connect",
        description:
          "Implement adapters, pipelines, and transformation logic with staged rollouts.",
      },
      {
        step: 4,
        title: "Validate",
        description:
          "Prove latency, correctness, and recovery under real operational load.",
      },
      {
        step: 5,
        title: "Govern",
        description:
          "Hand over dashboards, ownership, and a roadmap for continuous improvement.",
      },
    ],
    technologies: [
      { name: "AWS", logo: "https://skillicons.dev/icons?i=aws", role: "Primary cloud" },
      { name: "Azure", logo: "https://skillicons.dev/icons?i=azure", role: "Enterprise cloud" },
      { name: "GCP", logo: "https://skillicons.dev/icons?i=gcp", role: "Data & scale" },
      { name: "Terraform", logo: "https://skillicons.dev/icons?i=terraform", role: "Infra as code" },
      { name: "Kubernetes", logo: "https://skillicons.dev/icons?i=kubernetes", role: "Container orchestration" },
      { name: "Docker", logo: "https://skillicons.dev/icons?i=docker", role: "Service packaging" },
      { name: "Python", logo: "https://skillicons.dev/icons?i=python", role: "ETL & scripts" },
      { name: "Node.js", logo: "https://skillicons.dev/icons?i=nodejs", role: "Integration APIs" },
      { name: "PostgreSQL", logo: "https://skillicons.dev/icons?i=postgres", role: "System of record" },
      { name: "Redis", logo: "https://skillicons.dev/icons?i=redis", role: "Fast buffers" },
      { name: "Kafka", logo: "https://skillicons.dev/icons?i=kafka", role: "Event streams" },
      { name: "Nginx", logo: "https://skillicons.dev/icons?i=nginx", role: "Gateways & routing" },
    ],
    techCoreLabel: "Cloud platforms & runtime",
    techPlatformLabel: "Integration, data & networking",
    techIntro:
      "Cloud providers, automation, and integration tools that connect CRMs, ERPs, and data flows into one operating picture.",
    audience: [
      "Operations leaders drowning in disconnected SaaS and legacy ERPs.",
      "Data teams that need trustworthy pipelines before dashboards can matter.",
      "CTOs consolidating cloud spend while improving reliability and speed.",
    ],
    stats: ["80% Less Manual Sync", "Near Real-Time Feeds", "99.5% Job Success"],
    caseStudies: [
      {
        title: "CRM ↔ ERP Sync Fabric",
        image:
          "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1400&q=80",
        outcome: "Orders Synced in Minutes",
        summary:
          "Replaced nightly CSV drops with resilient event sync and reconciliation alerts for finance and sales.",
      },
      {
        title: "Cloud Data Platform Lift",
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80",
        outcome: "Single Source of Truth",
        summary:
          "Stood up warehouse-ready pipelines with lineage and quality checks executives could trust.",
      },
      {
        title: "Multi-SaaS Orchestration Hub",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80",
        outcome: "12 Tools Unified",
        summary:
          "Centralized webhooks and retries so customer journeys no longer stalled between systems.",
      },
    ],
    faqs: [
      {
        q: "Do you replace our ERP or CRM?",
        a: "Usually no. We make your existing platforms work together—unless a replacement is clearly the better investment.",
      },
      {
        q: "Which clouds do you support?",
        a: "AWS and Azure are common; we also work with hybrid setups and can align to your preferred provider.",
      },
      {
        q: "How do you prevent brittle integrations?",
        a: "Idempotent handlers, schema contracts, dead-letter queues, monitoring, and ownership for every critical path.",
      },
      {
        q: "Can you start with one high-pain sync?",
        a: "Yes. Many engagements begin with a single mission-critical flow, then expand once reliability is proven.",
      },
      {
        q: "What about security and compliance?",
        a: "We design least-privilege access, encryption in transit, and audit-friendly logging as non-negotiables.",
      },
    ],
    ctaHeading: "Ready for systems that stay in sync?",
    ctaSub:
      "Show us the friction between your tools—and we will design the cloud and integration layer that removes it.",
  },
};

export function getAllExpertiseSlugs() {
  return expertiseCatalog.map((item) => item.slug);
}

export function getExpertiseBySlug(slug) {
  return expertiseCatalog.find((item) => item.slug === slug) || null;
}

export function getExpertiseDetailData(slug) {
  const base = getExpertiseBySlug(slug);
  if (!base) return null;
  const detail = detailBySlug[slug];
  if (!detail) return null;

  const relatedExpertise = expertiseCatalog
    .filter((item) => item.slug !== slug)
    .map((item) => ({
      slug: item.slug,
      title: item.shortTitle,
      pageTitle: item.title,
      image: item.image,
      teaser: item.teaser,
    }));

  const related = base.relatedServices.map((serviceSlug) => ({
    slug: serviceSlug,
    ...(serviceMeta[serviceSlug] || {
      title: serviceSlug,
      image: base.image,
      description: "Related service offering.",
    }),
  }));

  return {
    ...base,
    ...detail,
    heroImage: base.image,
    related,
    relatedExpertise,
  };
}
