// components/Footer.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer({ theme = 'light' }) {
  // Color Palettes
  const lightColors = {
    primary: "#013825",      // Deep Forest Green
    secondary: "#9E8F72",    // Golden Brown (updated)
    tertiary: "#CEC8B0",     // Light Beige/Tan (updated)
    background: "#F9F7F0",   // Very light neutral for main background
    text: "#111111",
  };

  const darkColors = {
    primary: "#74F5A1",
    secondary: "#5FE08D",
    tertiary: "#3BC972",
    background: "#2A2A2A",
    text: "#FFFFFF",
  };

  // Theme-based styles
  const footerBg = theme === 'dark' ? '#1A1A1A' : lightColors.background;
  const cardBg = theme === 'dark' ? '#111111' : lightColors.tertiary; // Tertiary on cards / inner band
  const textColor = theme === 'dark' ? '#f3f3f3' : lightColors.text;
  const secondaryTextColor = theme === 'dark' ? '#d0d0d0' : '#444444';
  const borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const socialBg = theme === 'dark' ? '#181818' : '#F5F5F5';
  
  // Background pattern for dark theme
  const bgPatternStyle = theme === 'dark' ? {
    backgroundImage: `
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"),
      radial-gradient(ellipse at top left, rgba(0, 0, 0, 0.02), transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 0.01), transparent 50%)
    `,
    backgroundBlendMode: 'overlay, normal, normal',
  } : {};

  return (
    <>
      <style jsx global>{`
        @keyframes underlineSlideIn {
          0% {
            transform: scaleX(0);
            transform-origin: left;
          }
          50% {
            transform: scaleX(1);
            transform-origin: left;
          }
          51% {
            transform-origin: right;
          }
          100% {
            transform: scaleX(0);
            transform-origin: right;
          }
        }
        
        @keyframes underlineHover {
          0% {
            transform: scaleX(0);
            transform-origin: left;
          }
          100% {
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        .footer-link-underline {
          position: relative;
          display: inline-block;
          padding-bottom: 2px;
        }

        .footer-link-underline::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #74F5A1;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        [data-theme="light"] .footer-link-underline::after {
          background-color: #013825;
        }

        .footer-link-underline:hover::after {
          transform: scaleX(1);
        }

        /* Animation for hover effect */
        .footer-link-underline:hover {
          animation: none;
        }

        .footer-link-underline:hover::after {
          animation: underlineHover 0.3s ease forwards;
        }

        /* Social icon hover animation */
        .social-icon-animate {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .social-icon-animate:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(116, 245, 161, 0.3);
        }
        
        [data-theme="light"] .social-icon-animate:hover {
          box-shadow: 0 8px 25px rgba(1, 56, 37, 0.3);
        }
      `}</style>

      <footer 
        className="pt-3 sm:pt-4 md:pt-5 pb-4 sm:pb-5 md:pb-6 px-4 sm:px-5 md:px-6 lg:px-8"
        style={{ backgroundColor: footerBg, ...bgPatternStyle }}
      >
        {/* Floating footer card */}
        <div 
          className="mx-auto max-w-[1920px] rounded-lg sm:rounded-xl md:rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 pt-4 sm:pt-5 md:pt-6 pb-4 sm:pb-5 md:pb-6"
          style={{ 
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`
          }}
        >
          {/* TOP: 7 COLUMNS IN ONE ROW ON DESKTOP */}
          <div className="grid gap-6 sm:gap-7 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 border-b pb-4 sm:pb-5 md:pb-6" style={{ borderColor }}>
            {/* Dapper Lisbon */}
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-semibold tracking-tight ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
                Dapper Lisbon
              </h3>
              <p 
                className="font-merriweather text-[11px] sm:text-[11px] md:text-[12px] font-semibold leading-relaxed"
                style={{ color: secondaryTextColor }}
              >
                Av. Duque de Loulé 12,
                <br />
                1050-093 Lisbon
              </p>
            </div>

            {/* Dapper Rotterdam */}
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-semibold tracking-tight ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
                Dapper Rotterdam
              </h3>
              <p 
                className="font-merriweather text-[11px] sm:text-[11px] md:text-[12px] font-semibold leading-relaxed"
                style={{ color: secondaryTextColor }}
              >
                Weena 70, 13th floor
                <br />
                3012 CM Rotterdam
              </p>
            </div>

            {/* Contact Tycho */}
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-semibold tracking-tight ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
                Contact Tycho
              </h3>
              <div className="space-y-0.5 sm:space-y-1">
                <a
                  href="mailto:hello@dapper.agency"
                  className="footer-link-underline block font-merriweather text-[11px] sm:text-[11px] md:text-[12px] font-semibold transition-colors break-all"
                  style={{ color: secondaryTextColor }}
                >
                  hello@dapper.agency
                </a>
                <a
                  href="tel:+31103076707"
                  className="footer-link-underline block font-merriweather text-[11px] sm:text-[11px] md:text-[12px] font-semibold transition-colors whitespace-nowrap"
                  style={{ color: secondaryTextColor }}
                >
                  +31 10 307 6707
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-semibold tracking-tight ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
                Services
              </h3>
              <nav className="space-y-0.5 sm:space-y-1">
                <FooterLink href="/services/content-creative" theme={theme}>
                  Content &amp; Creative
                </FooterLink>
                <FooterLink href="/services/paid-media" theme={theme}>
                  Paid Media &amp; Performance
                </FooterLink>
                <FooterLink href="/services/data-measurement" theme={theme}>
                  Data &amp; Measurement
                </FooterLink>
                <FooterLink href="/services/demand-team" theme={theme}>
                  Demand Team
                </FooterLink>
                <FooterLink href="/services/demand-gen-agency" theme={theme}>
                  Demand Gen Agency
                </FooterLink>
                <FooterLink href="/services/demand-gen-training" theme={theme}>
                  Demand Gen Training
                </FooterLink>
              </nav>
            </div>

            {/* Expertise */}
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-semibold tracking-tight ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
                Expertise
              </h3>
              <nav className="space-y-0.5 sm:space-y-1">
                <FooterLink href="/expertise/b2b-saas" theme={theme}>
                  B2B SaaS
                </FooterLink>
                <FooterLink href="/expertise/b2b-service" theme={theme}>
                  B2B Service
                </FooterLink>
                <FooterLink href="/expertise/b2b-hardware" theme={theme}>
                  B2B Hardware
                </FooterLink>
              </nav>
            </div>

            {/* Resources */}
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-semibold tracking-tight ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
                Resources
              </h3>
              <nav className="space-y-0.5 sm:space-y-1">
                <FooterLink href="/cases" theme={theme}>Cases</FooterLink>
                <FooterLink href="/blog" theme={theme}>Blog</FooterLink>
                <FooterLink href="/newsletter" theme={theme}>Newsletter</FooterLink>
              </nav>
            </div>

            {/* Company */}
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className={`font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-semibold tracking-tight ${theme === 'dark' ? 'text-[#f3f3f3]' : 'text-[#111111]'}`}>
                Company
              </h3>
              <nav className="space-y-0.5 sm:space-y-1">
                <FooterLink href="/about" theme={theme}>About</FooterLink>
                <FooterLink href="/careers" theme={theme}>Careers</FooterLink>
                <FooterLink href="/contact" theme={theme}>Contact</FooterLink>
              </nav>
            </div>
          </div>

          {/* LOGO BAND */}
          <div className="flex items-end border-b py-3 sm:py-4 md:py-4" style={{ borderColor }}>
            <div className="flex items-end gap-4 sm:gap-5 md:gap-6">
              {/* Logo */}
              <div className="relative h-[48px] w-auto sm:h-[60px] md:h-[72px]">
                <Image
                  src="/logo/techeyrie_logo.png"
                  alt="TechEyrie Logo"
                  width={360}
                  height={144}
                  className="h-full w-auto object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="flex flex-col gap-2 sm:gap-3 py-2 sm:py-3 md:flex-row md:items-center md:justify-between">
            {/* Left: copyright + legal */}
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-1.5">
              <span 
                className="font-merriweather text-[11px] sm:text-[11px] md:text-[12px] font-semibold whitespace-nowrap"
                style={{ color: secondaryTextColor }}
              >
                © 2025 Dapper
              </span>
              <Link
                href="/privacy-policy"
                className="footer-link-underline font-merriweather text-[11px] sm:text-[11px] md:text-[12px] font-semibold transition-colors whitespace-nowrap"
                style={{ color: secondaryTextColor }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="footer-link-underline font-merriweather text-[11px] sm:text-[11px] md:text-[12px] font-semibold transition-colors whitespace-nowrap"
                style={{ color: secondaryTextColor }}
              >
                Terms and Conditions
              </Link>
            </div>

            {/* Middle: credits */}
            <div 
              className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-1.5 text-[11px] sm:text-[11px] md:text-[12px] font-merriweather font-semibold whitespace-nowrap"
              style={{ color: secondaryTextColor }}
            >
              <span>Design by Nasick</span>
              <span>Code by Ahmad</span>
            </div>

            {/* Right: social icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <SocialIcon
                href="https://instagram.com"
                label="Instagram"
                type="instagram"
                theme={theme}
              />
              <SocialIcon
                href="https://linkedin.com"
                label="LinkedIn"
                type="linkedin"
                theme={theme}
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterLink({ href, children, theme = 'light' }) {
  const textColor = theme === 'dark' ? '#d0d0d0' : '#444444';
  
  return (
    <Link
      href={href}
      className="footer-link-underline block font-merriweather text-[11px] sm:text-[11px] md:text-[12px] font-semibold transition-colors whitespace-nowrap"
      style={{ color: textColor }}
    >
      {children}
    </Link>
  );
}

function SocialIcon({ href, label, type, theme = 'light' }) {
  const socialBg = theme === 'dark' ? '#F5F5F5' : '#181818';
  const socialColor = theme === 'dark' ? '#111111' : '#FFFFFF';
  
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="social-icon-animate flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-[8px] sm:rounded-[10px] transition-all"
      style={{ 
        backgroundColor: socialBg,
        color: socialColor
      }}
    >
      {type === 'instagram' ? (
        <svg width="14" height="14" className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 3.066a6.771 6.771 0 1 0 0 13.542 6.771 6.771 0 0 0 0-13.542zm7.2-1.596a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
        </svg>
      ) : (
        <svg width="14" height="14" className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5C4.98 4.604 4.088 5.5 2.99 5.5 1.89 5.5 1 4.604 1 3.5 1 2.398 1.89 1.5 2.99 1.5c1.098 0 1.99.898 1.99 2zm.02 4H1V22h4V7.5zm7.982 0H9V22h4v-7.7c0-4.066 5-3.113 5 0V22h4v-8.994C22 7.64 14.89 7.812 12.982 11V7.5z" />
        </svg>
      )}
    </a>
  );
}