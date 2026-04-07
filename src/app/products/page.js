"use client";

import { useMemo, useState } from "react";
import Header from "../../../components/dark7/Header";
import Footer from "../../../components/dark7/Footer";
import { dark7MainSurfaceStyle } from "../../../components/dark7/dark7PageSurface";
import "../../../components/dark7/MainPage.css";

const PRODUCTS = [
  {
    id: "p1",
    title: "Online Store Editor",
    category: "Online storefront",
    builtFor: ["Business owners", "Developers"],
    featureTypes: ["Developer tools", "Marketing"],
    description:
      "Build your site by choosing a theme and modules, then publish with a conversion-ready storefront.",
    tag: "Popular",
  },
  {
    id: "p2",
    title: "Hydrogen & Oxygen",
    category: "Online storefront",
    builtFor: ["Developers"],
    featureTypes: ["Developer tools", "Global expansion"],
    description:
      "Build custom storefront experiences with modern developer workflows and global-ready commerce blocks.",
    tag: "Popular",
  },
  {
    id: "p3",
    title: "Shopify Checkout",
    category: "Checkout",
    builtFor: ["Business owners"],
    featureTypes: ["Checkout", "Automation"],
    description:
      "Fast, flexible, and optimized checkout flows designed to increase completion rate and trust.",
    tag: "Popular",
  },
  {
    id: "p4",
    title: "Shopify Shipping",
    category: "Shipping",
    builtFor: ["Business owners"],
    featureTypes: ["Automation", "Inventory management"],
    description:
      "Send orders faster with easy shipping automation, labels, tracking updates, and fulfillment rules.",
    tag: "Popular",
  },
  {
    id: "p5",
    title: "Shopify POS",
    category: "Point of sale",
    builtFor: ["Business owners"],
    featureTypes: ["B2B", "Financial management"],
    description:
      "Connect physical and online selling with synced inventory, customer profiles, and reporting.",
    tag: "Popular",
  },
  {
    id: "p6",
    title: "Fulfillment Network",
    category: "Order management",
    builtFor: ["Business owners"],
    featureTypes: ["Inventory management", "Global expansion"],
    description:
      "Scale operations with smart fulfillment, returns, and storage infrastructure for modern teams.",
    tag: "Popular",
  },
];

const BUILT_FOR = ["Business owners", "Developers"];
const FEATURE_TYPES = [
  "Analytics & reporting",
  "Automation",
  "B2B",
  "Checkout",
  "Developer tools",
  "Financial management",
  "Global expansion",
  "Inventory management",
  "Marketing",
];

export default function ProductsPage() {
  const theme = "dark";
  const [query, setQuery] = useState("");
  const [builtForSelected, setBuiltForSelected] = useState([]);
  const [featureSelected, setFeatureSelected] = useState([]);

  const toggle = (value, current, setter) => {
    setter(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesQuery =
        !q ||
        product.title.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);

      const matchesBuiltFor =
        builtForSelected.length === 0 ||
        builtForSelected.some((item) => product.builtFor.includes(item));

      const matchesFeature =
        featureSelected.length === 0 ||
        featureSelected.some((item) => product.featureTypes.includes(item));

      return matchesQuery && matchesBuiltFor && matchesFeature;
    });
  }, [query, builtForSelected, featureSelected]);

  return (
    <div
      className="dark2-page min-h-screen font-merriweather"
      data-theme={theme}
      style={{ ...dark7MainSurfaceStyle, position: "relative", zIndex: 1 }}
    >
      <Header theme={theme} />

      <main className="relative">
        <section className="relative min-h-[100svh] flex flex-col px-6 sm:px-8 md:px-12 lg:px-16">
          <div
            className="pointer-events-none absolute inset-0 z-[1] opacity-40 mix-blend-soft-light"
            style={{
              background: `
                radial-gradient(ellipse 85% 55% at 15% 10%, rgba(167, 180, 49, 0.12), transparent 52%),
                radial-gradient(ellipse 70% 50% at 88% 75%, rgba(116, 245, 161, 0.08), transparent 48%),
                radial-gradient(ellipse 45% 35% at 55% 40%, rgba(18, 104, 91, 0.18), transparent 55%)
              `,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.028) 1px, rgba(255, 255, 255, 0.028) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.028) 1px, rgba(255, 255, 255, 0.028) 2px), repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.012) 2px, rgba(255, 255, 255, 0.012) 4px)",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-48 sm:h-56 md:h-64 pointer-events-none z-[1]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,81,96,0.5) 0%, rgba(0,81,96,0.12) 50%, rgba(0,81,96,0) 100%)",
            }}
          />
          <div className="absolute inset-x-0 top-[42%] h-px max-w-5xl mx-auto opacity-30 pointer-events-none z-[1]" aria-hidden />
          <div className="pointer-events-none absolute -right-24 top-28 h-[460px] w-[460px] rounded-full z-[1] opacity-[0.16] blur-[40px] bg-[radial-gradient(circle,rgba(116,245,161,0.5)_0%,transparent_62%)]" />
          <div className="pointer-events-none absolute -left-32 bottom-36 h-[380px] w-[380px] rounded-full z-[1] opacity-[0.13] blur-[44px] bg-[radial-gradient(circle,rgba(0,81,96,0.72)_0%,transparent_65%)]" />
          <div className="pointer-events-none absolute right-[18%] bottom-[12%] h-[280px] w-[280px] rounded-full z-[1] opacity-[0.11] blur-[36px] bg-[radial-gradient(circle,rgba(224,209,182,0.22)_0%,transparent_68%)]" />

          <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-center pt-28 pb-20 sm:pt-32 sm:pb-24 md:pt-36 md:pb-28 lg:pt-40">
            <div className="mb-10 h-px w-full max-w-lg origin-left bg-gradient-to-r from-[#74F5A1] via-[#a7b431]/70 to-transparent sm:mb-12" />
            <div className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-7">
              <span className="inline-flex h-[2px] w-10 shrink-0 bg-gradient-to-r from-[#a7b431] to-[#74F5A1] sm:w-14" />
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="inline-flex h-3 w-3 shrink-0 rotate-45 border border-[#74F5A1]/80 bg-[#74F5A1]/20 sm:h-3.5 sm:w-3.5" />
                <span className="font-merriweather text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-semibold uppercase tracking-[0.16em] text-[#f3f3f3]">
                  Products
                </span>
              </div>
              <span className="hidden sm:inline font-playfair text-[12px] italic text-[#a7b431]/75">
                Premium product stack
              </span>
            </div>

            <h1 className="max-w-5xl font-italiana font-light leading-[1.05] tracking-[0.012em] text-[#f3f3f3]">
              <span className="block text-[36px] sm:text-[46px] md:text-[58px] lg:text-[70px] xl:text-[82px] 2xl:text-[92px]">
                Premium products.
              </span>
              <span className="block font-playfair font-semibold italic text-[36px] sm:text-[46px] md:text-[58px] lg:text-[70px] xl:text-[82px] 2xl:text-[92px] text-[#e8e4dc]">
                Built to launch, scale, and convert.
              </span>
            </h1>

            <p className="mt-10 max-w-xl border-l border-[#a7b431]/35 pl-6 font-merriweather text-[13px] sm:text-[14px] md:text-[15px] leading-[1.9] text-[#c8c2ad]">
              This is your products command center: explore tools by use case, compare capabilities fast, and move from
              shortlist to decision with complete clarity.
            </p>
          </div>

          <div className="relative z-10 -mt-8 md:-mt-10 lg:-mt-12 pb-20 md:pb-24">
          <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-8">
            <aside className="rounded-2xl border border-[#a7b431]/25 bg-[rgba(9,24,19,0.82)] p-5 md:p-6 h-fit sticky top-24">
              <h2 className="font-italiana text-[30px] leading-none text-[#f3f3f3] mb-6">
                Filters
              </h2>

              <div className="space-y-7">
                <div>
                  <p className="font-merriweather text-[12px] uppercase tracking-[0.14em] text-[#74F5A1] mb-3">
                    Built for
                  </p>
                  <div className="space-y-2.5">
                    {BUILT_FOR.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2.5 text-[#e0d1b6] text-[13px] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={builtForSelected.includes(item)}
                          onChange={() =>
                            toggle(item, builtForSelected, setBuiltForSelected)
                          }
                          className="h-4 w-4 accent-[#74F5A1]"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#a7b431]/20 pt-6">
                  <p className="font-merriweather text-[12px] uppercase tracking-[0.14em] text-[#74F5A1] mb-3">
                    Feature type
                  </p>
                  <div className="space-y-2.5 max-h-[320px] overflow-auto pr-1">
                    {FEATURE_TYPES.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2.5 text-[#e0d1b6] text-[13px] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={featureSelected.includes(item)}
                          onChange={() =>
                            toggle(item, featureSelected, setFeatureSelected)
                          }
                          className="h-4 w-4 accent-[#74F5A1]"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="rounded-2xl border border-[#a7b431]/25 bg-[rgba(9,24,19,0.72)] p-4 md:p-6">
              <div className="flex items-center gap-2 rounded-full border border-[#a7b431]/30 bg-[#132c24]/80 px-4 py-2.5 mb-5">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a product"
                  className="w-full bg-transparent outline-none font-merriweather text-[14px] text-[#f3f3f3] placeholder:text-[#c8c2ad]/65"
                />
                <span className="text-[#74F5A1]">⌕</span>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-2xl border border-[#a7b431]/25 bg-[rgba(20,43,35,0.82)] p-4 md:p-5 min-h-[360px] md:min-h-[390px] flex flex-col hover:-translate-y-0.5 transition-transform"
                  >
                    <span className="inline-flex self-start rounded-full bg-[#a7b431] text-[#132c24] px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase">
                      {product.tag}
                    </span>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.13em] text-[#74F5A1] font-semibold">
                      {product.category}
                    </p>
                    <h3 className="mt-1 font-italiana text-[34px] leading-[1.02] text-[#f3f3f3]">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#e0d1b6]/85">
                      {product.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {product.builtFor.concat(product.featureTypes).map((tag) => (
                        <span
                          key={`${product.id}-${tag}`}
                          className="inline-flex rounded-full border border-[#a7b431]/22 bg-[#0f241d] px-2 py-1 text-[10px] uppercase tracking-wide text-[#c8c2ad]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="mt-auto pt-5 text-[#74F5A1] text-[13px] underline underline-offset-2 hover:text-[#9dffbe] transition-colors"
                    >
                      Explore
                    </button>
                  </article>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <p className="py-10 text-center text-[#e0d1b6]/80">
                  No products match your filters yet. Try clearing a filter or
                  search term.
                </p>
              )}
            </div>
          </div>
          </div>
        </section>
      </main>

      <Footer theme={theme} />
    </div>
  );
}
