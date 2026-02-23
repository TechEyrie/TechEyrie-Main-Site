"use client";
import React, { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../../../components/dark/Header';
import BlogSection from '../../../components/blog/BlogHero';
import BlogNewsletter from '../../../components/blog/BlogNewsletter';
import BlogTalkToExpert from '../../../components/blog/BlogTalkToExpert';
import Footer from '../../../components/dark/Footer';
import '../../../components/dark/MainPage.css';
import TalkToExpertSection from '../../../components/dark/TalkToExpertSection';
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
  const [theme, setTheme] = useState('light');
  const [blogPosts, setBlogPosts] = useState(DEMO_BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Refresh ScrollTrigger on mount/navigation
    ScrollTrigger.refresh();
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    // Fetch WordPress posts
    const loadPosts = async () => {
      setLoading(true);
      try {
        const wpPosts = await fetchWordPressPosts();
        
        if (wpPosts && wpPosts.length > 0) {
          // Use WordPress posts if available
          setBlogPosts(wpPosts);
        } else {
          // Fallback to demo content if WordPress API fails
          console.log('Using demo blog posts as fallback');
          setBlogPosts(DEMO_BLOG_POSTS);
        }
      } catch (error) {
        console.error('Error loading blog posts:', error);
        // Fallback to demo content on error
        setBlogPosts(DEMO_BLOG_POSTS);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div
      style={{ position: 'relative', zIndex: 1 }}
      data-theme={theme}
      className={theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}
    >
      {/* Theme Toggle Button */}
      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 2v2m0 12v2M4.22 4.22l1.42 1.42m8.72 8.72l1.42 1.42M2 10h2m12 0h2M4.22 15.78l1.42-1.42m8.72-8.72l1.42-1.42"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="10"
              cy="10"
              r="3"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        )}
      </button>

      <Header theme={theme} />
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh] sm:min-h-screen">
          <div className="text-center px-4">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#74F5A1]"></div>
            <p className={`mt-4 font-merriweather text-[14px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading blog posts...
            </p>
          </div>
        </div>
      ) : (
        <BlogSection theme={theme} blogPosts={blogPosts} />
      )}

      <BlogNewsletter theme={theme} />
      
      <TalkToExpertSection theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}

