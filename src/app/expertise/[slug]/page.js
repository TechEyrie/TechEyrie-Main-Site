import { notFound } from "next/navigation";
import ExpertiseDetailView from "./ExpertiseDetailView";
import {
  getAllExpertiseSlugs,
  getExpertiseBySlug,
} from "../../../../components/expertiseDetail/expertiseDetailData";

export async function generateStaticParams() {
  return getAllExpertiseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const expertise = getExpertiseBySlug(slug);
  if (!expertise) {
    return { title: "Expertise" };
  }
  return {
    title: expertise.pageTitle,
    description: expertise.teaser,
    keywords: expertise.keywords,
    openGraph: {
      title: expertise.pageTitle,
      description: expertise.teaser,
    },
  };
}

export default async function ExpertiseDetailPage({ params }) {
  const { slug } = await params;
  if (!getExpertiseBySlug(slug)) {
    notFound();
  }
  return <ExpertiseDetailView slug={slug} />;
}
