"use client";
import React, { useState, useEffect, use } from 'react';
import Header from '../../../../components/dark/Header';
import Services2DetailHero from '../../../../components/services2/Services2DetailHero';
import Services2DetailContent from '../../../../components/services2/Services2DetailContent';
import Services2DetailServices from '../../../../components/services2/Services2DetailServices';
import Services2DetailResults from '../../../../components/services2/Services2DetailResults';
import Services2RelatedCases from '../../../../components/services2/Services2RelatedCases';
import Services2LatestInsights from '../../../../components/services2/Services2LatestInsights';
import Footer from '../../../../components/dark/Footer';
import '../../../../components/dark/MainPage.css';

// Industry data - can be moved to a separate file or database
const industryData = {
  healthcare: {
    title: "Healthcare",
    heroDescription: "We design and develop digital healthcare solutions that seamlessly fuse innovation with compassion. Digital transformation will revolutionise healthcare with the widespread adoption of electronic health records, telemedicine, AI diagnostics, and remote patient monitoring. We empower healthcare organisations with the tools of tomorrow.",
    contentTitle: "The future of healthcare",
    contentDescription: `
      <p>The latest innovations in technology are helping to revolutionise healthcare by providing increased accessibility and convenience. Telemedicine's ability to connect patients with healthcare professionals remotely is ushering in a new era of patient care and monitoring, offering unprecedented benefits.</p>
      <p>Data analytics and Artificial Intelligence (AI) provide real-time patient monitoring, empowering healthcare providers with informed decision-making capabilities. This blend of digital tools and patient care is resulting in more precise diagnoses, personalised treatment plans, and better patient outcomes.</p>
      <p>Technology-enabled wearable health devices and mobile apps are facilitating proactive health management by allowing patients to monitor their health and share real-time data with healthcare providers.</p>
      <p>Healthcare chatbots and electronic health records (EHR) streamline administrative tasks to boost efficiency and reduce the risk of human error for improved care coordination and enhanced patient safety. The future of healthcare will continue to evolve thanks to the advancements in technology-powered digital healthcare solutions.</p>
    `,
    contentImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=80",
    services: [
      "Electronic health records (EHR) implementation",
      "Telemedicine solutions",
      "AI-driven diagnostics and treatment planning",
      "Remote patient monitoring systems",
      "Health data interoperability solutions",
      "Healthcare analytics and predictive modelling",
      "Cybersecurity and data privacy solutions",
      "Patient engagement platforms",
      "Workflow optimisation and process automation"
    ],
    resultsTitle: "Optimised healthcare driven by data",
    resultsDescription: "We specialise in developing cutting-edge healthcare solutions designed to streamline administrative processes to drive operational efficiency where it matters. We've helped a healthcare group facilitate seamless practitioner onboarding by developing an innovative Enterprise Virtual Assistant tailored for the medical environment. Powered by AI and Natural Language Processing, we efficiently addressed specific healthcare administration challenges and simplified the information-sharing process across thousands of employees. We think outside the box to provide AI-driven diagnostics and remote patient monitoring. Our expertise in health data interoperability, predictive analytics, cybersecurity, and patient engagement platforms are all aimed at enhancing workflow efficiency and delivering unmatched healthcare services.",
    results: [
      "Enhanced patient care, efficient workflows, and improved healthcare outcomes",
      "Increased accessibility to healthcare through telemedicine",
      "Data-driven insights for proactive and personalized treatments",
      "Improved cybersecurity and protection of patient data",
      "Streamlined administrative processes and reduced paperwork"
    ]
  },
  // Add more industries here as needed
};

export default function Services2DetailPage({ params }) {
  const resolvedParams = use(params);
  const [theme, setTheme] = useState('light');
  const [industry, setIndustry] = useState(null);

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    // Get industry data based on slug
    const slug = resolvedParams?.slug || 'healthcare';
    const data = industryData[slug] || industryData.healthcare;
    setIndustry(data);
  }, [resolvedParams]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!industry) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ position: 'relative', zIndex: 1 }} data-theme={theme} className={theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}>
      {/* Theme Toggle Button */}
      <button 
        className="theme-toggle-btn" 
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" fill="currentColor"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2v2m0 12v2M4.22 4.22l1.42 1.42m8.72 8.72l1.42 1.42M2 10h2m12 0h2M4.22 15.78l1.42-1.42m8.72-8.72l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        )}
      </button>

      <Header theme={theme} />
      <Services2DetailHero title={industry.title} theme={theme} />
      
      <Services2RelatedCases theme={theme} />
      <Services2LatestInsights theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}

