"use client";
import React, { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../../../components/dark7-v52/Header';
import BlogSection from '../../../components/blog/BlogHero';
import BlogNewsletter from '../../../components/blog/BlogNewsletter';
import Footer from '../../../components/dark7/Footer';
import '../../../components/dark7/MainPage.css';
import '../../../components/blog/blogDark7Text.css';
import TalkToExpertSection from '../../../components/dark7/TalkToExpertSection';
import { fetchWordPressPosts } from '../../../utils/wordpress';

// Demo blog posts data (backup/fallback)
const DEMO_BLOG_POSTS = [
  {
    id: 1,
    title: "What Is Demand Generation? A Simple Guide for B2B Marketers",
    category: "Demand Generation",
    author: "Tycho Luijten",
    readTime: "8 min read",
    slug: "what-is-demand-generation",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    id: 2,
    title: "Why Brand Is Your Most Underrated Growth Channel",
    category: "Demand Generation",
    author: "Tycho Luijten",
    readTime: "5 min read",
    slug: "why-brand-is-underrated-growth-channel",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  {
    id: 3,
    title: "What Is Thought Leadership in B2B Marketing?",
    category: "Demand Generation",
    author: "Tycho Luijten",
    readTime: "4 min read",
    slug: "what-is-thought-leadership-b2b",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
  },
  {
    id: 4,
    title: "How to Build Brand Awareness in B2B Marketing Without a Big Budget",
    category: "Demand Generation",
    author: "Tycho Luijten",
    readTime: "4 min read",
    slug: "build-brand-awareness-b2b",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  {
    id: 5,
    title: "9 signs it's time to hire a marketing agency",
    category: "Other",
    author: "Eleni Zakof",
    readTime: "5 min read",
    slug: "signs-hire-marketing-agency",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  },
  {
    id: 6,
    title: "What is the Niche Famous Framework?",
    category: "Demand Generation",
    author: "Tycho Luijten",
    readTime: "6 min read",
    slug: "niche-famous-framework",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  {
    id: 7,
    title: "Top 10 Demand Generation Courses",
    category: "Demand Generation",
    author: "Eleni Zakof",
    readTime: "7 min read",
    slug: "top-10-demand-generation-courses",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  },
  {
    id: 8,
    title: "Mastering Inbound Marketing: get leads for free!",
    category: "Demand Generation",
    author: "Tessa Peterse",
    readTime: "8 min read",
    slug: "mastering-inbound-marketing",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
  },
  {
    id: 9,
    title: "Lead magnets: Rest in Peace - Unleashing Demand Generation",
    category: "Other",
    author: "Tessa Peterse",
    readTime: "9 min read",
    slug: "lead-magnets-rest-in-peace",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    id: 10,
    title: "How to scale your business: growth guide",
    category: "Other",
    author: "Leon Stockmar",
    readTime: "8 min read",
    slug: "how-to-scale-business-growth-guide",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  },
];

export default function BlogPage() {
  const theme = 'dark';
  const [blogPosts, setBlogPosts] = useState(DEMO_BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ScrollTrigger.refresh();
    }
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const wpPosts = await fetchWordPressPosts();

        if (wpPosts && wpPosts.length > 0) {
          setBlogPosts(wpPosts);
        } else {
          console.log('Using demo blog posts as fallback');
          setBlogPosts(DEMO_BLOG_POSTS);
        }
      } catch (error) {
        console.error('Error loading blog posts:', error);
        setBlogPosts(DEMO_BLOG_POSTS);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div
      className="dark2-page blog-route relative z-[1] min-h-screen overflow-x-hidden bg-[#162d24] font-merriweather selection:bg-[#12685b]/35 selection:text-white"
      style={{ position: 'relative', zIndex: 1 }}
      data-theme={theme}
    >
      <Header theme={theme} />
      <main className="relative blog-page-root">
        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center sm:min-h-screen">
            <div className="px-4 text-center">
              <div className="mx-auto inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-[#74F5A1] sm:h-12 sm:w-12" />
              <p className="blog-desc mt-4 font-merriweather text-[14px] text-[#c8c2ad]">
                Loading blog posts...
              </p>
            </div>
          </div>
        ) : (
          <BlogSection theme={theme} blogPosts={blogPosts} />
        )}

        <BlogNewsletter theme={theme} />
        <TalkToExpertSection theme={theme} dark7 />
      </main>
      <Footer theme={theme} />
    </div>
  );
}

