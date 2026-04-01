import { getIndustryBySlug, industriesCatalog } from "../industries/industriesData";

export function getIndustryDetailData(slug) {
  const base = getIndustryBySlug(slug);
  if (!base) return null;

  const related = industriesCatalog.filter((i) => i.slug !== base.slug).slice(0, 3);
  const kwLine = base.keywords.join("; ");

  return {
    ...base,
    title: base.name,
    headline: base.pageTitle,
    supportingLine: base.teaser,
    problemStatement: `${base.name} buyers compare multiple vendors from search. If your site reads like a generic brochure, you lose on trust before anyone evaluates your proof. Sector vocabulary, credential placement, and intent-led headings are how you earn the click—and the inquiry.`,
    whatWeDo: `We design and build web experiences for ${base.name} with your keyword themes (${kwLine}) guiding modules, internal links, and metadata. You get a production-ready experience in the Dark7 system: deep forest surfaces, mint and teal accents, and editorial type that signals craft—not a template reseller.`,
    offerings: [
      `SEO-led structure and on-page patterns around: ${base.keywords[0]}.`,
      base.keywords[1] ? `UX and narrative support for ${base.keywords[1]}.` : `Conversion paths tuned to ${base.name} consideration cycles.`,
      base.keywords[2] ? `Focused modules for ${base.keywords[2]}.` : "Schema, internal linking, and crawl clarity baked into the build.",
      "Performance, accessibility, and analytics events so marketing can attribute leads to the right sector story.",
    ],
    process: [
      {
        step: 1,
        title: "Intent map",
        description: `We map how ${base.name} prospects search, who they benchmark, and what objections stall them.`,
      },
      {
        step: 2,
        title: "IA & story",
        description: "Wireframes align proof, services, and keyword clusters—without stuffing or thin pages.",
      },
      {
        step: 3,
        title: "Design & build",
        description: "Dark7 visual language, fast UI, forms and integrations wired to your stack.",
      },
      {
        step: 4,
        title: "Launch & learn",
        description: "Measurement baselines, Search Console hooks, and a refresh cadence for sector freshness.",
      },
    ],
    related,
    faqs: [
      {
        q: `What makes ${base.name} websites different from a general corporate site?`,
        a: "Buyers expect sector fluency: terminology, proof types, and risk reducers that match real decisions. We mirror those signals in layout and messaging—not just swapping hero photos.",
      },
      {
        q: "Do you only build, or also help with copy?",
        a: "We can deliver SEO-aware copy, collaborate with your team, or stress-test yours. Components are built so keywords and proof blocks stay flexible as you iterate.",
      },
      {
        q: "How long does a sector page typically take?",
        a: "Many landings move from kickoff to launch in 4–8 weeks, depending on brand assets, compliance review, and CMS constraints.",
      },
      {
        q: "Can this stack extend to more industries later?",
        a: "Yes. Routes stay consistent; we swap structured data per vertical so your library scales without fragmenting the brand.",
      },
    ],
  };
}
