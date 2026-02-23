"use client";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BlogNewsletter({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Refresh ScrollTrigger on mount
    ScrollTrigger.refresh();
    
    if (sectionRef.current) {
      gsap.set(sectionRef.current, { opacity: 1 });
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onComplete: () => {
          if (sectionRef.current) {
            gsap.set(sectionRef.current, { opacity: 1 });
          }
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
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
      className={`relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden ${
        isDark ? 'bg-[#0a0a0a]' : 'bg-[#F5F5F5]'
      }`}
    >
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8 lg:px-12">
        <div className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 relative ${
          isDark ? 'bg-[#1a1a1a]' : 'bg-[#191919]'
        }`}>
          
          {/* Grid Layout - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">
            
            {/* LEFT SIDE - Content & Decorative Shapes */}
            <div className="relative">
              {/* Heading */}
              <h2 className="font-italiana font-light text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] leading-[1.1] text-white mb-6 sm:mb-8">
                Receive weekly <span className="italic font-playfair font-light">growth</span> tips
              </h2>
            </div>

            {/* RIGHT SIDE - Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="newsletter-name"
                    className="block mb-2 font-merriweather text-[13px] font-semibold text-white"
                  >
                    Name <span className="text-[#74F5A1]">*</span>
                  </label>
                  <input
                    type="text"
                    id="newsletter-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl font-merriweather text-[14px] border text-white placeholder:text-white/40 focus:border-[#74F5A1] focus:outline-none transition-all ${
                      isDark 
                        ? 'bg-[#0a0a0a] border-white/10' 
                        : 'bg-[#111111] border-white/10'
                    }`}
                    placeholder="Your name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="newsletter-email"
                    className="block mb-2 font-merriweather text-[13px] font-semibold text-white"
                  >
                    Email Address <span className="text-[#74F5A1]">*</span>
                  </label>
                  <input
                    type="email"
                    id="newsletter-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl font-merriweather text-[14px] border text-white placeholder:text-white/40 focus:border-[#74F5A1] focus:outline-none transition-all ${
                      isDark 
                        ? 'bg-[#0a0a0a] border-white/10' 
                        : 'bg-[#111111] border-white/10'
                    }`}
                    placeholder="johndoe@gmail.com"
                  />
                </div>

                {/* Terms Text */}
                <p className="font-merriweather text-[14px] text-white/60 leading-relaxed">
                  By clicking 'Subscribe' you're confirming that you agree with our{' '}
                  <a href="#" className="underline hover:text-[#74F5A1] transition-colors">
                    Terms and Conditions
                  </a>
                  .
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-merriweather text-[14px] font-semibold bg-[#74F5A1] text-[#0a0a0a] hover:bg-[#5FE08D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  <svg 
                    className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="p-4 rounded-xl bg-[#74F5A1]/20 text-[#74F5A1] text-center font-merriweather text-[14px]">
                    Success! We'll be in touch soon.
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
