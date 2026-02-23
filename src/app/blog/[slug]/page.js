"use client";
import React, { useState, useEffect, use } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../../../../components/dark/Header';
import BlogPostHero from '../../../../components/blog/post/HeroSection';
import BlogPostContent from '../../../../components/blog/post/ContentSection';
import BlogNewsletter from '../../../../components/blog/BlogNewsletter';
import ReadMoreBlogs from '../../../../components/blog/post/ReadMoreBlogs';

import Footer from '../../../../components/dark/Footer';
import '../../../../components/dark/MainPage.css';
import TalkToExpertSection from '../../../../components/dark/TalkToExpertSection';
import { fetchWordPressPostBySlug, fetchWordPressPosts } from '../../../../utils/wordpress';

// Demo blog posts data with full content (backup/fallback)
const DEMO_BLOG_POSTS_DATA = [
  {
    id: 1,
    title: "What Is Demand Generation? A Simple Guide for B2B Marketers",
    category: "Demand Generation",
    author: "Tycho Luijten",
    readTime: "8 min read",
    date: "August 15, 2025",
    slug: "what-is-demand-generation",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    content: `
      <p>Demand generation is a comprehensive marketing strategy focused on creating awareness and interest in your products or services among potential customers. Unlike lead generation, which focuses on capturing contact information, demand generation builds long-term relationships and brand awareness.</p>
      
      <h2>Why Demand Generation Matters</h2>
      <p>In today's competitive B2B landscape, buyers are more informed and have more options than ever. Demand generation helps you stand out by building trust and credibility before your prospects are even ready to buy.</p>
      
      <p>This approach is particularly effective because:</p>
      <ul>
        <li>It creates brand awareness among your target audience</li>
        <li>It builds trust and credibility over time</li>
        <li>It generates higher-quality leads</li>
        <li>It reduces the cost per acquisition</li>
        <li>It creates a sustainable pipeline</li>
      </ul>
      
      <h2>Key Components of Demand Generation</h2>
      <p>A successful demand generation strategy includes content marketing, thought leadership, SEO, social media engagement, and strategic partnerships. Each component works together to create a comprehensive approach that reaches your audience at every stage of their journey.</p>
    `,
  },
  {
    id: 2,
    title: "Why Brand Is Your Most Underrated Growth Channel",
    category: "Demand Generation",
    author: "Tycho Luijten",
    readTime: "5 min read",
    date: "August 21, 2025",
    slug: "why-brand-is-underrated-growth-channel",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    content: `
      <p>Want to grow your B2B brand in a competitive market? Then you probably need more people who already trust your brand before they even start looking. That is what brand awareness does. It puts you on the list before the buying process begins. It makes everything else in marketing work better. And yet, in most B2B teams, brand is still an afterthought.</p>
      
      <h2>Why does brand get ignored in B2B?</h2>
      <p>Because brand is hard to measure. And marketers are trained to prioritise what they can track. Paid ads, clicks, conversions, these are easy to report on. They make performance feel productive and accountable.</p>
      
      <p>Brand, on the other hand, does not show up in clean numbers. It shows up in:</p>
      <ul>
        <li>Branded search</li>
        <li>Direct traffic</li>
        <li>Faster sales cycles</li>
        <li>Higher trust in cold outreach</li>
      </ul>
      
      <p>Imagine a SaaS company that invests 90% of its marketing budget into Google Ads. The leads come in, but sales cycles remain long and win rates stay flat. When the ads stop, the pipeline dries up almost immediately.</p>
      
      <p>Because they never invested in brand, there is no memory or trust to fall back on. So brand gets overlooked, even though it quietly does the heavy lifting in the background.</p>
      
      <h2>What does brand awareness actually do?</h2>
      <p>Brand creates mental availability. It puts your name in the buyer's head before they start researching. When the need appears, they already know who you are, and you will be top of mind.</p>
      
      <p>That means:</p>
      <ul>
        <li>You get more clicks because your name is familiar</li>
        <li>Your conversion rates improve because trust is already built</li>
        <li>You get fewer objections in sales because credibility is established</li>
        <li>Your cost per lead drops because people come to you</li>
      </ul>
      
      <p>A study by LinkedIn's B2B Institute found that 96% of buyers are not in-market at any given time. That means if you only target in-market leads, you miss the majority. Brand awareness helps you reach that 96% before they are ready to buy.</p>
      
      <h2>What happens when you only invest in performance?</h2>
      <p>You might generate leads, but only as long as you keep spending. The moment you pause your ads, results begin to dry up. Without a strong brand, there is no momentum to carry you forward.</p>
      
      <p>Picture a B2B company that grows quickly through performance marketing alone. Their pipeline looks strong while the budget flows. But when cuts are made, traffic drops, inbound leads slow down, and lead quality declines.</p>
      
      <p>There is no brand equity to fall back on. The sales team is left chasing colder leads and working harder to close deals that used to come in warm. That is the risk. When you rely only on performance, your growth becomes vulnerable and unsustainable.</p>
      
      <h2>How do you build brand awareness without a massive budget?</h2>
      <p>You do not need millions of views or a huge ad budget. You need to be known and trusted by the few thousand people who matter most in your market.</p>
      
      <p>Start with sharp positioning. Know exactly who your ideal buyers are, what problems they face, and how your solution helps. Without clarity, even great content will miss the mark.</p>
      
      <p>Then create content that speaks directly to those challenges. This could include:</p>
      <ul>
        <li>Educational LinkedIn posts</li>
        <li>Expert interviews or podcasts</li>
        <li>Free tools or calculators</li>
        <li>Case studies and customer stories</li>
        <li>Opinion-led thought leadership</li>
      </ul>
      
      <p>Choose a few formats that suit your team and repeat them consistently. Share them through the channels your audience already uses and show up often.</p>
      
      <p>Brand is not built through reach. It is built through relevance, repetition and trust over time.</p>
      
      <h2>Why brand makes the rest of your marketing better</h2>
      <p>A strong brand makes every part of your marketing more effective. Paid ads tend to convert better, cold emails are more likely to get a response, and sales calls run smoother because buyers already know who you are and what you stand for.</p>
      
      <p>Brand reduces friction. It shifts your marketing from convincing to being the obvious choice, and it compounds over time. Each impression you make today increases the chance that buyers will choose you tomorrow.</p>
      
      <p>The more people trust your brand, the less you need to convince them.</p>
    `,
  },
  {
    id: 3,
    title: "What Is Thought Leadership in B2B Marketing?",
    category: "Demand Generation",
    author: "Tycho Luijten",
    readTime: "4 min read",
    date: "August 10, 2025",
    slug: "what-is-thought-leadership-b2b",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    content: `
      <p>Thought leadership in B2B marketing is about establishing your brand or key individuals as trusted experts in your industry. It goes beyond traditional marketing by providing valuable insights, perspectives, and solutions that help your audience solve problems and make better decisions.</p>
      
      <h2>The Power of Thought Leadership</h2>
      <p>When done right, thought leadership can transform your brand from just another vendor to a trusted advisor. It builds credibility, attracts high-quality leads, and positions you as the go-to resource in your niche.</p>
      
      <h2>How to Build Thought Leadership</h2>
      <p>Start by identifying the unique insights and perspectives your team brings to the table. Then, consistently share these through content, speaking engagements, and industry participation.</p>
    `,
  },
  {
    id: 4,
    title: "How to Build Brand Awareness in B2B Marketing Without a Big Budget",
    category: "Demand Generation",
    author: "Tycho Luijten",
    readTime: "4 min read",
    date: "August 5, 2025",
    slug: "build-brand-awareness-b2b",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    content: `
      <p>Building brand awareness doesn't require a massive budget. With the right strategy, you can make a significant impact even with limited resources.</p>
      
      <h2>Focus on Your Niche</h2>
      <p>Instead of trying to reach everyone, focus on the specific audience that matters most to your business. This targeted approach is more cost-effective and yields better results.</p>
      
      <h2>Leverage Content Marketing</h2>
      <p>Create valuable, educational content that addresses your audience's pain points. This builds trust and positions you as an expert in your field.</p>
    `,
  },
  {
    id: 5,
    title: "9 signs it's time to hire a marketing agency",
    category: "Other",
    author: "Eleni Zakof",
    readTime: "5 min read",
    date: "July 28, 2025",
    slug: "signs-hire-marketing-agency",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    content: `
      <p>Knowing when to hire a marketing agency can be challenging. Here are nine clear signs that it's time to bring in professional help.</p>
      
      <h2>Signs You Need a Marketing Agency</h2>
      <ul>
        <li>Your marketing efforts aren't generating results</li>
        <li>You lack expertise in key marketing areas</li>
        <li>Your team is overwhelmed with marketing tasks</li>
        <li>You need fresh perspectives and strategies</li>
        <li>Scaling your marketing efforts is challenging</li>
        <li>You want to focus on core business activities</li>
        <li>You need access to advanced tools and technologies</li>
        <li>Your current marketing is inconsistent</li>
        <li>You're missing opportunities in the market</li>
      </ul>
    `,
  },
  {
    id: 6,
    title: "What is the Niche Famous Framework?",
    category: "Demand Generation",
    author: "Tycho Luijten",
    readTime: "6 min read",
    date: "July 20, 2025",
    slug: "niche-famous-framework",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    content: `
      <p>The Niche Famous Framework is a strategic approach to building brand awareness and thought leadership within a specific niche market.</p>
      
      <h2>Understanding the Framework</h2>
      <p>This framework helps businesses become the go-to resource in their specific niche by focusing on targeted content, consistent messaging, and strategic positioning.</p>
    `,
  },
  {
    id: 7,
    title: "Top 10 Demand Generation Courses",
    category: "Demand Generation",
    author: "Eleni Zakof",
    readTime: "7 min read",
    date: "July 15, 2025",
    slug: "top-10-demand-generation-courses",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    content: `
      <p>Looking to improve your demand generation skills? Here are the top 10 courses that can help you master this essential marketing discipline.</p>
      
      <h2>Best Demand Generation Courses</h2>
      <p>These courses cover everything from strategy to execution, helping you build a comprehensive understanding of demand generation.</p>
    `,
  },
  {
    id: 8,
    title: "Mastering Inbound Marketing: get leads for free!",
    category: "Demand Generation",
    author: "Tessa Peterse",
    readTime: "8 min read",
    date: "July 10, 2025",
    slug: "mastering-inbound-marketing",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    content: `
      <p>Inbound marketing is one of the most cost-effective ways to generate leads. Learn how to master it and start getting leads for free.</p>
      
      <h2>The Inbound Marketing Approach</h2>
      <p>Inbound marketing focuses on attracting customers through valuable content and experiences, rather than interrupting them with traditional advertising.</p>
    `,
  },
  {
    id: 9,
    title: "Lead magnets: Rest in Peace - Unleashing Demand Generation",
    category: "Other",
    author: "Tessa Peterse",
    readTime: "9 min read",
    date: "July 5, 2025",
    slug: "lead-magnets-rest-in-peace",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    content: `
      <p>The traditional lead magnet approach is outdated. It's time to rethink how we generate demand and build relationships with prospects.</p>
      
      <h2>The New Approach to Demand Generation</h2>
      <p>Modern demand generation focuses on building trust and providing value upfront, rather than gating everything behind a form.</p>
    `,
  },
  {
    id: 10,
    title: "How to scale your business: growth guide",
    category: "Other",
    author: "Leon Stockmar",
    readTime: "8 min read",
    date: "June 28, 2025",
    slug: "how-to-scale-business-growth-guide",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    content: `
      <p>Scaling a business requires careful planning and execution. This comprehensive guide covers everything you need to know about sustainable growth.</p>
      
      <h2>Key Principles of Scaling</h2>
      <p>Understanding the fundamentals of scaling will help you grow your business sustainably and avoid common pitfalls.</p>
    `,
  },
];

export default function BlogPostPage({ params }) {
  // Unwrap params Promise using React.use()
  const resolvedParams = use(params);
  const [theme, setTheme] = useState('light');
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState(DEMO_BLOG_POSTS_DATA);
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
    let currentSlug = '';
    
    // Get slug from resolved params
    if (resolvedParams && typeof resolvedParams === 'object' && resolvedParams.slug) {
      currentSlug = resolvedParams.slug;
    }
    
    // Fallback: get from URL (most reliable for client components)
    if (!currentSlug && typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      currentSlug = pathParts[pathParts.length - 1] || '';
    }

    // Fetch the post from WordPress API
    const loadPost = async () => {
      if (!currentSlug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch all posts for ReadMoreBlogs component
        const wpPosts = await fetchWordPressPosts();
        if (wpPosts && wpPosts.length > 0) {
          setAllPosts(wpPosts);
        }

        // Try to fetch the specific post from WordPress first
        const wpPost = await fetchWordPressPostBySlug(currentSlug);
        
        if (wpPost) {
          setPost(wpPost);
        } else {
          // Fallback to demo content
          const foundPost = DEMO_BLOG_POSTS_DATA.find(p => p.slug === currentSlug);
          setPost(foundPost);
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
        // Fallback to demo content on error
        const foundPost = DEMO_BLOG_POSTS_DATA.find(p => p.slug === currentSlug);
        setPost(foundPost);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [resolvedParams]);

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
      className={`overflow-x-hidden w-full ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}
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
        <div className={`flex items-center justify-center min-h-[60vh] sm:min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
          <div className="text-center px-4">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#74F5A1]"></div>
            <p className={`mt-4 font-merriweather text-[14px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading blog post...
            </p>
          </div>
        </div>
      ) : post ? (
        <>
          <BlogPostHero theme={theme} post={post} />
          <BlogPostContent theme={theme} post={post} />
          <BlogNewsletter theme={theme} />
          <ReadMoreBlogs posts={allPosts} currentSlug={post.slug} theme={theme} />
          <TalkToExpertSection theme={theme} />
          <Footer theme={theme} />
        </>
      ) : (
        <div className={`flex items-center justify-center min-h-[60vh] sm:min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
          <div className="text-center px-4">
            <h1 className={`font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#111111]'}`}>
              Post not found
            </h1>
            <a href="/blog" className="font-merriweather text-[14px] text-[#74F5A1] hover:underline">
              Back to blog
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

