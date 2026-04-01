"use client";
import React, { useState, useEffect } from 'react';
import Header from '../../../components/dark/Header';
import Services2Hero from '../../../components/services2/Services2Hero';
import Services2Industries from '../../../components/services2/Services2Industries';
import Services2Approach from '../../../components/services2/Services2Approach';
import Services2FAQs from '../../../components/services2/Services2FAQs';
import Services2CTA from '../../../components/services2/Services2CTA';
import Footer from '../../../components/dark/Footer';
import '../../../components/dark/MainPage.css';

export default function ExpertisePage() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div style={{ position: 'relative', zIndex: 1 }} data-theme={theme} className={theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}>
      {/* Theme Toggle Button */}
      <button 
        className="theme-toggle-btn" 
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          // Moon icon for dark mode
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" fill="currentColor"/>
          </svg>
        ) : (
          // Sun icon for light mode
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2v2m0 12v2M4.22 4.22l1.42 1.42m8.72 8.72l1.42 1.42M2 10h2m12 0h2M4.22 15.78l1.42-1.42m8.72-8.72l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        )}
      </button>

      <Header theme={theme} />
      <Services2Hero theme={theme} />
      <Services2Industries theme={theme} />
      <Services2Approach theme={theme} />
      <Services2FAQs theme={theme} />
      <Services2CTA theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}

