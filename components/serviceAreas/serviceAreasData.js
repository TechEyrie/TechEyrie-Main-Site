export const serviceAreas = [
  {
    country: "Qatar",
    accent: "#74F5A1",
    accentSoft: "#a8ffd0",
    cities: ["Doha", "Lusail"],
    blurb:
      "We craft conversation-led Arabic-English storytelling that doesn't just translate but transforms.",
    image:
      "https://images.pexels.com/photos/31718067/pexels-photo-31718067.jpeg?auto=compress&cs=tinysrgb&w=900&q=80",
  },
  {
    country: "Sri Lanka",
    accent: "#67bfda",
    accentSoft: "#9ee8ff",
    cities: ["Colombo", "Kandy"],
    blurb:
      "We create High-converting service pages for island markets, fixing local trust signals to build credibility and drive results.",
    image:
      "https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=900&q=80",
  },
  {
    country: "UAE",
    accent: "#99f6cf",
    accentSoft: "#d4ffea",
    cities: ["Dubai", "Abu Dhabi", "Sharjah"],
    blurb:
      "Emirates-level launches with refined polish without slowing your audience's journey.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80",
  },
  {
    country: "Oxfordshire UK",
    accent: "#b6f7d1",
    accentSoft: "#e4fff0",
    cities: ["Oxford", "Banbury", "Bicester", "Abingdon", "Didcot", "Witney", "Henley-on-Thames"],
    blurb:
      "Local expertise, global standards: SEO, AI-powered editorial and scalable B2B funnels.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&q=80",
  },
];

/** Flat list for marquee / motion */
export const allServiceCities = serviceAreas.flatMap((a) => a.cities);
