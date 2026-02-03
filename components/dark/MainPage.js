"use client"
// components/MainPage.jsx
import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import Header from './Header';
import StatsSection from './StatsSection';
import ServicesSection from './ServicesSection';
import DemandSection from './DemandGen';
import DemandTeamSection from './DemandTeam';
import ResultsSection from './ResultsSection';
import CompareSection from './CompareSection';
import TalkToExpertSection from './TalkToExpertSection';
import Footer from './Footer';
import DeepJudgeAnimation from './DeepJudgeAnimation';
import TestimonialsSection from './TestimonialsSection';
import CursorTrail from './CursorTrail';
import './MainPage.css';
import RealProblemSection from './RealProblemSection';
import NewServicesSection from './NewServicesSection';
import ThatsTheTechEyrie from './ThatsTheTechEyrie';
import BuildOthersSection from './BuildOtherSection';

const MainPage = () => {
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
    <CursorTrail theme={theme}>
      <div style={{ position: 'relative', zIndex: 1 }} data-theme={theme}>
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
        <HeroSection theme={theme} />
        <RealProblemSection theme={theme} />
        <NewServicesSection theme={theme} />
      
        {/* <BuildOthersSection theme={theme} /> */}
      
        
        {/* <StatsSection theme={theme} /> */}
       
        <DeepJudgeAnimation theme={theme} />
          <ThatsTheTechEyrie theme={theme} />
        <ServicesSection theme={theme} />
        <DemandSection theme={theme} />
        {/* <DemandTeamSection theme={theme} /> */}
        <ResultsSection theme={theme} />
        <CompareSection theme={theme} />
        <TestimonialsSection theme={theme} />
        <TalkToExpertSection theme={theme} />
        <Footer theme={theme} />
      </div>
    </CursorTrail>
  );
};

export default MainPage;
