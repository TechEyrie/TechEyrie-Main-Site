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
// import CursorTrail from './CursorTrail';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import './MainPage.css';
import RealProblemSection from './RealProblemSection';
import NewServicesSection from './NewServicesSection';
import ThatsTheTechEyrie from './ThatsTheTechEyrie';
import BuildOthersSection from './BuildOtherSection';
import AirvoirSection from './AirvoirSection';
import CardsServicesSection from './CardsServicesSection';
import FAQSection from './FAQSection';
import AirplaneHero from './AirplaneSection';
import BlogsSection from './BlogSection';

const MainPage = () => {
  const [theme] = useState('dark');
  const [enableLenis, setEnableLenis] = useState(false);

  // Track viewport width to only run Lenis on desktop-sized screens.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      setEnableLenis(window.innerWidth >= 1024);
    };

    update();
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Prevent browser scroll restoration fighting with Lenis/ScrollTrigger,
  // and always start the dark page at the top to avoid a big jump on refresh.
  useEffect(() => {
    if (!enableLenis || typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);
  }, [enableLenis]);

  useEffect(() => {
    return () => {
      // Kill all ScrollTriggers on unmount so no getBoundingClientRect runs during navigation
      if (typeof window !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize Lenis
    const lenis = new Lenis({
      // CONTROL SPEED HERE:
      duration: 3.5, // Keep the original slow, cinematic feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1, // Higher = Faster scroll per wheel tick. Default: 1
      smoothTouch: false, // Mobile usually desires native scroll
      touchMultiplier: 2,
    });

    // Integrate with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Ensure Lenis starts from the top and doesn't jump after browser refresh
    lenis.scrollTo(0, { immediate: true });

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return (
    // <CursorTrail theme={theme}>
      <div style={{ position: 'relative', zIndex: 1 }} data-theme={theme}>
        <Header theme={theme} />
        <HeroSection theme={theme} />
        <RealProblemSection theme={theme} />
        <NewServicesSection theme={theme} />
      
        {/* <BuildOthersSection theme={theme} /> */}
      
        
        {/* <StatsSection theme={theme} /> */}
       
        <DeepJudgeAnimation theme={theme} />
          <ThatsTheTechEyrie theme={theme} />
          {/* Keep sections in normal flow to avoid ScrollTrigger/Lenis jumps */}
          <AirvoirSection theme={theme} />
          <TestimonialsSection theme={theme} />
                  <CardsServicesSection theme={theme} />
                  <FAQSection theme={theme} />
                  <BlogsSection theme={theme} />
                  <AirplaneHero theme={theme} />
        {/* <ServicesSection theme={theme} /> */}
        {/* <DemandSection theme={theme} /> */}
        {/* <DemandTeamSection theme={theme} /> */}
        {/* <ResultsSection theme={theme} />
        <CompareSection theme={theme} />

        <TalkToExpertSection theme={theme} /> */}
        <Footer theme={theme} />
      </div>
    // </CursorTrail>
  );
};

export default MainPage;
