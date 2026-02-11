"use client";
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BlogPostContent({ theme = 'light', post }) {
  const isDark = theme === 'dark';
  const contentRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);

  // Parse WordPress HTML content into structured format
  const parseWordPressContent = (htmlContent) => {
    if (!htmlContent || typeof window === 'undefined') return [];
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const elements = Array.from(doc.body.children);
      
      return elements.map((el) => {
        const tagName = el.tagName.toLowerCase();
        
        if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4') {
          return {
            type: 'heading',
            text: el.textContent || ''
          };
        } else if (tagName === 'p') {
          return {
            type: 'paragraph',
            text: el.textContent || ''
          };
        } else if (tagName === 'ul' || tagName === 'ol') {
          const items = Array.from(el.querySelectorAll('li')).map(li => li.textContent || '');
          return {
            type: 'list',
            items: items
          };
        } else if (tagName === 'blockquote') {
          return {
            type: 'paragraph',
            text: el.textContent || '',
            isQuote: true
          };
        } else if (tagName === 'div' && el.querySelector('img')) {
          // Handle images
          const img = el.querySelector('img');
          return {
            type: 'image',
            src: img?.src || '',
            alt: img?.alt || ''
          };
        }
        
        return {
          type: 'paragraph',
          text: el.textContent || ''
        };
      }).filter(item => item.text || item.items || item.src);
    } catch (error) {
      console.error('Error parsing WordPress content:', error);
      return [];
    }
  };

  // Default demo content
  const defaultContent = [
    {
      type: 'heading',
      text: 'Why does brand get ignored in B2B?'
    },
    {
      type: 'paragraph',
      text: 'Want to grow your B2B brand in a competitive market?'
    },
    {
      type: 'paragraph',
      text: 'Then you probably need more people who already trust your brand before they even start looking. That is what brand awareness does. It puts you on the list before the buying process begins. It makes everything else in marketing work better. And yet, in most B2B teams, brand is still an afterthought.'
    },
    {
      type: 'paragraph',
      text: 'Most B2B companies focus exclusively on demand capture - targeting people who are already searching for solutions. While this generates quick results, it creates a constant battle for attention in an increasingly crowded marketplace. Without brand awareness, you are always competing on price and features alone.'
    },
    {
      type: 'paragraph',
      text: 'The reality is that buyers are doing more research independently than ever before. By the time they reach out to sales, they have already formed opinions about which brands they trust. If your brand is not part of that consideration set, you have already lost the deal.'
    },
    {
      type: 'heading',
      text: 'What does brand awareness actually do?'
    },
    {
      type: 'paragraph',
      text: 'Brand awareness helps you earn attention, trust, and preference before your buyer is even in the market. It is harder to measure than performance, but often more powerful.'
    },
    {
      type: 'paragraph',
      text: 'In this blog, you will learn how brand awareness works, why it matters for B2B growth, and how to build it without a massive budget.'
    },
    {
      type: 'paragraph',
      text: 'Think of brand awareness as the foundation of your go-to-market strategy. When done right, it compounds over time, making every other marketing channel more effective. Your paid ads get higher click-through rates. Your content gets more organic reach. Your sales team gets warmer leads.'
    },
    {
      type: 'paragraph',
      text: 'Companies with strong brand awareness also benefit from pricing power. When buyers recognize and trust your brand, they are less likely to shop around purely on price. They see you as the premium choice worth paying for.'
    },
    {
      type: 'heading',
      text: 'What happens when you only invest in performance?'
    },
    {
      type: 'paragraph',
      text: 'Performance marketing is great for capturing demand that already exists. But if nobody knows who you are, your conversion rates will suffer and your cost per acquisition will stay high.'
    },
    {
      type: 'paragraph',
      text: 'Brand awareness creates demand before people start searching. It makes your performance marketing more efficient by increasing trust and recognition.'
    },
    {
      type: 'paragraph',
      text: 'When you rely only on performance marketing, you are essentially renting attention. The moment you stop spending, your pipeline dries up. There is no compounding effect, no lasting value created. You are stuck on a treadmill, constantly needing to spend more to maintain the same results.'
    },
    {
      type: 'paragraph',
      text: 'Additionally, performance-only strategies put you in direct competition with every other company bidding on the same keywords. As competition increases, costs rise and margins shrink. Without brand differentiation, you become commoditized.'
    },
    {
      type: 'heading',
      text: 'How do you build brand awareness without a massive budget?'
    },
    {
      type: 'paragraph',
      text: 'You do not need a Super Bowl ad to build brand awareness. You need consistency, authenticity, and the right channels.'
    },
    {
      type: 'paragraph',
      text: 'The key is to show up consistently where your audience already spends time. This might be LinkedIn, industry publications, podcasts, or community forums. Pick one or two channels and commit to showing up every single week.'
    },
    {
      type: 'list',
      items: [
        'Create valuable content that educates your audience and solves real problems',
        'Show up consistently where your buyers spend time - quality over quantity',
        'Build thought leadership through your team members and executives',
        'Focus on community and relationships, not just reach and impressions',
        'Share your perspective and point of view, not just product features',
        'Engage authentically in conversations instead of just broadcasting'
      ]
    },
    {
      type: 'paragraph',
      text: 'Remember, brand building is a marathon, not a sprint. The companies that win are the ones that show up consistently over years, not months. Start small, but start now.'
    },
    {
      type: 'heading',
      text: 'Why brand makes the rest of your marketing better'
    },
    {
      type: 'paragraph',
      text: 'When people recognize and trust your brand, everything else works better. Your ads get higher click-through rates. Your sales conversations are warmer. Your retention improves because customers bought into your vision from the start.'
    },
    {
      type: 'paragraph',
      text: 'Brand awareness acts as a multiplier for all your marketing efforts. A well-known brand can achieve the same results with half the ad spend. Your content gets more engagement. Your emails get higher open rates. Your events get better attendance.'
    },
    {
      type: 'paragraph',
      text: 'Perhaps most importantly, strong brand awareness reduces your dependency on any single channel. If algorithm changes hurt your SEO or social reach, you have built-in resilience through direct relationships and brand loyalty. Your audience will seek you out.'
    },
    {
      type: 'paragraph',
      text: 'Strong brands also attract better talent and partners. When your company is recognized in the market, top performers want to work with you. Strategic partners reach out. Investors take notice. Brand awareness opens doors that paid marketing cannot.'
    },
    {
      type: 'heading',
      text: 'Want to build a brand that fuels your growth?'
    },
    {
      type: 'paragraph',
      text: 'Brand is not just for enterprise companies. It is a growth lever that compounds over time. Start small, stay consistent, and focus on building trust with your ideal customers.'
    },
    {
      type: 'paragraph',
      text: 'The best time to start building your brand was five years ago. The second best time is today. Every piece of content you create, every conversation you have, every interaction you make is either building or eroding your brand.'
    },
    {
      type: 'paragraph',
      text: 'Make a commitment to show up consistently for your audience. Share your unique perspective. Educate and inspire. Over time, you will build the recognition and trust that makes everything else in your business easier.'
    },
    {
      type: 'heading',
      text: 'Summary'
    },
    {
      type: 'paragraph',
      text: 'Brand awareness helps you earn attention, trust, and preference before your buyer is even in the market. It is harder to measure than performance, but often more powerful.'
    },
    {
      type: 'paragraph',
      text: 'In this blog, you will learn:'
    },
    {
      type: 'list',
      items: [
        'Why brand gets ignored in B2B marketing strategies',
        'What brand awareness actually does for your business',
        'The risks of only investing in performance marketing',
        'How to build brand awareness without a massive budget',
        'Why brand makes all your other marketing more effective'
      ]
    },
    {
      type: 'paragraph',
      text: 'Start building your brand today. The compound effects will surprise you.'
    }
  ];

  // Use WordPress content if available, otherwise use default
  const content = post?.content 
    ? parseWordPressContent(post.content)
    : defaultContent;

  // Extract headings for TOC with proper indexing
  const sections = content
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter(item => item.type === 'heading');

  useEffect(() => {
    // Refresh ScrollTrigger on mount
    ScrollTrigger.refresh();
    
    // Set up scroll tracking for active section
    const headingElements = document.querySelectorAll('.content-heading');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index'));
            setActiveSection(index);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    );

    headingElements.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      headingElements.forEach((heading) => {
        observer.unobserve(heading);
      });
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const scrollToSection = (index) => {
    const heading = document.querySelector(`[data-index="${index}"]`);
    if (!heading) return;
    try {
      const offset = 120;
      const top = heading.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    } catch (_) {
      // Guard: element may be detached during navigation
    }
  };

  return (
    <section 
      className={`relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-x-hidden ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#F5F5F5]'}`}
    >
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[380px_1fr] gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-start">
          
          {/* LEFT SIDEBAR - Table of Contents (Sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start order-2 lg:order-1">
            <div className={`rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 ${
              isDark ? 'bg-[#1a1a1a]' : 'bg-white'
            }`}>
              <h3 className={`font-[Helvetica_Now_Text,Helvetica,Arial,sans-serif] text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 ${
                isDark ? 'text-white' : 'text-[#111111]'
              }`}>
                In this article:
              </h3>
              
              <nav className="space-y-1.5 sm:space-y-2">
                {sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(index)}
                    className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-[Helvetica_Now_Text,Helvetica,Arial,sans-serif] text-sm sm:text-base transition-all duration-300 group ${
                      activeSection === index
                        ? isDark
                          ? 'bg-white/10 text-white'
                          : 'bg-[#111111] text-white'
                        : isDark
                        ? 'text-white/70 hover:bg-white/5 hover:text-white'
                        : 'text-[#666666] hover:bg-[#f0f0f0] hover:text-[#111111]'
                    }`}
                  >
                    <svg 
                      className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-transform duration-300 ${
                        activeSection === index ? 'translate-x-1' : 'group-hover:translate-x-1'
                      }`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="font-medium line-clamp-2">{section.text}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* RIGHT SIDE - Main Content */}
          <article ref={contentRef} className="order-1 lg:order-2 w-full max-w-full">
            {content.map((section, index) => {
              // Calculate heading index for this item
              const headingIndex = content.slice(0, index).filter(s => s.type === 'heading').length;
              
              if (section.type === 'heading') {
                return (
                  <h2 
                    key={index}
                    data-index={headingIndex}
                    className={`content-heading font-[Helvetica_Now_Text,Helvetica,Arial,sans-serif] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] font-bold mb-6 sm:mb-8 mt-10 sm:mt-12 md:mt-16 first:mt-0 scroll-mt-20 sm:scroll-mt-24 leading-tight text-center lg:text-left ${
                      isDark ? 'text-white' : 'text-[#111111]'
                    }`}
                  >
                    {section.text}
                  </h2>
                );
              }
              
              if (section.type === 'paragraph') {
                return (
                  <p 
                    key={index}
                    className={`font-[Helvetica_Now_Text,Helvetica,Arial,sans-serif] text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-6 sm:mb-8 text-center lg:text-left ${
                      section.isQuote 
                        ? `pl-4 sm:pl-6 border-l-4 ${isDark ? 'border-[#74F5A1] text-white/80' : 'border-[#74F5A1] text-[#666666]'} italic`
                        : isDark ? 'text-white/90' : 'text-[#1a1a1a]'
                    }`}
                  >
                    {section.text}
                  </p>
                );
              }

              if (section.type === 'image') {
                return (
                  <div key={index} className="my-6 sm:my-8 md:my-10">
                    {section.src && section.src.trim() !== "" ? (
                      <img 
                        src={section.src} 
                        alt={section.alt || 'Blog post image'}
                        className="w-full rounded-xl sm:rounded-2xl"
                        loading="lazy"
                      />
                    ) : (
                      <div className={`w-full h-[200px] sm:h-[300px] md:h-[400px] rounded-xl sm:rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-200'} flex items-center justify-center`}>
                        <svg className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              }
              
              if (section.type === 'list') {
                return (
                  <ul 
                    key={index}
                    className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 md:mb-10"
                  >
                    {section.items?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3">
                        {/* Green Checkmark Icon */}
                        <span className="flex-shrink-0 mt-1 sm:mt-1.5">
                          <svg 
                            width="18" 
                            height="18" 
                            className="sm:w-5 sm:h-5 text-[#74F5A1]"
                            viewBox="0 0 20 20" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              d="M16.6668 5L7.50016 14.1667L3.3335 10" 
                              stroke="currentColor" 
                              strokeWidth="2.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className={`font-[Helvetica_Now_Text,Helvetica,Arial,sans-serif] text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed ${
                          isDark ? 'text-white/90' : 'text-[#1a1a1a]'
                        }`}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                );
              }
              
              return null;
            })}
          </article>

        </div>
      </div>
    </section>
  );
}
