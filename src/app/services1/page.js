"use client";
import React, { useEffect } from 'react';
import Header from '../../../components/dark7/Header';
import Services2Hero from '../../../components/services2/Services2Hero';
import Services2Industries from '../../../components/services2/Services2Industries';
import Services2Approach from '../../../components/services2/Services2Approach';
import Services2FAQs from '../../../components/services2/Services2FAQs';
import Services2CTA from '../../../components/services2/Services2CTA';
import Footer from '../../../components/dark7/Footer';
import '../../../components/dark7/MainPage.css';
import '../../../components/services1/services1ListingDark7Text.css';

export default function Services1Page() {
  const theme = 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <div
      className="dark2-page bg-[#162d24]"
      style={{ position: 'relative', zIndex: 1 }}
      data-theme={theme}
    >
      <Header theme={theme} />
      <Services2Hero
        theme={theme}
        dark7
        kicker="Services"
        titleLine1="Services that"
        titleLine2="ship in production"
        description="End-to-end capabilities from AI and automation to full-stack delivery — built for production, not demos."
      />
      <Services2Industries theme={theme} dark7 />
      <Services2Approach theme={theme} dark7 />
      <Services2FAQs theme={theme} dark7 />
      <Services2CTA theme={theme} dark7 />
      <Footer theme={theme} />
    </div>
  );
}

