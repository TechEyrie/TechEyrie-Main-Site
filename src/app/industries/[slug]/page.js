import { notFound } from "next/navigation";
import IndustriesDetailView from "./IndustriesDetailView";
import { getIndustryBySlug, getAllIndustrySlugs } from "../../../../components/industries/industriesData";

export async function generateStaticParams() {
  return getAllIndustrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) {
    return { title: "Industry" };
  }
  return {
    title: industry.pageTitle,
    description: industry.teaser,
    keywords: industry.keywords,
    openGraph: {
      title: industry.pageTitle,
      description: industry.teaser,
    },
  };
}

export default async function IndustryDetailPage({ params }) {
  const { slug } = await params;
  if (!getIndustryBySlug(slug)) {
    notFound();
  }
  return <IndustriesDetailView slug={slug} />;
}
