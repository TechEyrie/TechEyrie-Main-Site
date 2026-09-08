"use client";
import React, { use } from 'react';
import Header from '../../../../components/dark7-v52/Header';
import Services1DetailTemplate from '../../../../components/services1Detail/Services1DetailTemplate';
import Footer from '../../../../components/dark7/Footer';
import '../../../../components/dark7/MainPage.css';

export default function Services2DetailPage({ params }) {
  const resolvedParams = use(params);
  const theme = 'dark';

  return (
    <div
      style={{ position: 'relative', zIndex: 1 }}
      data-theme={theme}
      className="dark2-page services1-detail-route bg-[#162d24] relative z-[1] min-h-screen overflow-x-hidden font-merriweather selection:bg-[#12685b]/35 selection:text-white"
    >
      <Header theme={theme} />
      <Services1DetailTemplate slug={resolvedParams?.slug} theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}

