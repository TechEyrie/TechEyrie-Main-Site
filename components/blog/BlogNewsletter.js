"use client";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BlogNewsletter({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 1, y: 0 });

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onComplete: () => {
          gsap.set(el, { opacity: 1, y: 0 });
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { opacity: 1, y: 0 });
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setEmail('');
      setName('');
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1000);
  };

  return (
    <section
      ref={sectionRef}
      className={`blog-section-shell relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 ${
        isDark ? '' : 'bg-[#F5F5F5]'
      }`}
      style={{ opacity: 1 }}
    >
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8 lg:px-12">
        <div
          className={`blog-newsletter-card relative rounded-2xl p-6 sm:rounded-3xl sm:p-8 md:p-12 lg:p-16 ${
            isDark ? 'bg-[#122a21]' : 'bg-[#191919]'
          }`}
        >
          <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="relative">
              <h2 className="blog-newsletter-title mb-6 font-italiana text-[24px] font-light leading-[1.1] text-white sm:mb-8 sm:text-[32px] md:text-[40px] lg:text-[56px]">
                Receive weekly <span className="font-playfair italic font-light">growth</span> tips
              </h2>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    htmlFor="newsletter-name"
                    className="blog-newsletter-label mb-2 block font-merriweather text-[13px] font-semibold text-white"
                  >
                    Name <span className="blog-newsletter-req">*</span>
                  </label>
                  <input
                    type="text"
                    id="newsletter-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="blog-newsletter-input w-full rounded-lg border border-white/10 bg-[#0a1a14] px-4 py-3 font-merriweather text-[14px] text-white placeholder:text-white/40 transition-all focus:border-[#74F5A1] focus:outline-none sm:rounded-xl sm:px-5 sm:py-4"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="newsletter-email"
                    className="blog-newsletter-label mb-2 block font-merriweather text-[13px] font-semibold text-white"
                  >
                    Email Address <span className="blog-newsletter-req">*</span>
                  </label>
                  <input
                    type="email"
                    id="newsletter-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="blog-newsletter-input w-full rounded-lg border border-white/10 bg-[#0a1a14] px-4 py-3 font-merriweather text-[14px] text-white placeholder:text-white/40 transition-all focus:border-[#74F5A1] focus:outline-none sm:rounded-xl sm:px-5 sm:py-4"
                    placeholder="johndoe@gmail.com"
                  />
                </div>

                <p className="blog-desc font-merriweather text-[14px] leading-relaxed text-white/80">
                  By clicking &apos;Subscribe&apos; you&apos;re confirming that you agree with our{' '}
                  <a href="#" className="underline transition-colors hover:text-[#74F5A1]">
                    Terms and Conditions
                  </a>
                  .
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="blog-newsletter-submit group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#74F5A1] px-6 py-3 font-merriweather text-[14px] font-semibold text-[#162d24] transition-all duration-300 hover:bg-[#5FE08D] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:gap-3 sm:rounded-xl sm:px-8 sm:py-4"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </button>

                {submitStatus === 'success' && (
                  <div className="blog-newsletter-success rounded-xl bg-[#74F5A1]/20 p-4 text-center font-merriweather text-[14px] text-[#74F5A1]">
                    Success! We&apos;ll be in touch soon.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
