// components/Footer.jsx — essential links variant (full multi-column nav backup: Footer.backup.js)
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  DARK7_GRADIENTS,
  DARK7_GRADIENT_NOISE_STYLE,
  DARK7_FOOTER_START,
  dark7GradientSurfaceStyle,
} from './dark7PageGradients';

const FOOTER_CREAM = '#F7F3F0';
const FOOTER_CARD_BG = 'transparent';
const FOOTER_BORDER = 'rgba(247, 243, 240, 0.2)';

const ESSENTIAL_LINK_GROUPS = [
  {
    title: 'Tools & proof',
    links: [
      { href: '/pricing-calculator', label: 'Pricing calculator' },
      { href: '/testimonials', label: 'Testimonials' },
      { href: '/newsletter', label: 'Newsletter' },
    ],
  },
  {
    title: 'Legal & help',
    links: [
      { href: '/terms-and-conditions', label: 'Terms and conditions' },
      { href: '/privacy-policy', label: 'Privacy policy' },
      { href: '/faqs', label: 'FAQs' },
    ],
  },
];

export default function Footer({ theme = 'light' }) {
  // Keep existing footer UI; only map colors to dark5 palette.
  const lightColors = {
    primary: '#013825',
    secondary: '#9E8F72',
    tertiary: '#CEC8B0',
    background: '#F9F7F0',
    text: '#111111',
  };

  const footerBgStyle =
    theme === 'dark'
      ? {
          /* Seam color under the ramp so the top edge matches AirplaneHero */
          ...dark7GradientSurfaceStyle(DARK7_GRADIENTS.footer, DARK7_FOOTER_START),
          backgroundColor: DARK7_FOOTER_START,
        }
      : { backgroundColor: lightColors.background };

  const cardBg = theme === 'dark' ? FOOTER_CARD_BG : lightColors.tertiary;
  const textColor = theme === 'dark' ? FOOTER_CREAM : lightColors.text;
  const secondaryTextColor = theme === 'dark' ? FOOTER_CREAM : '#444444';
  const borderColor = theme === 'dark' ? FOOTER_BORDER : 'rgba(0, 0, 0, 0.1)';

  return (
    <>
      <style jsx global>{`
        .dark7-v45-footer.dark5-footer {
          background-color: #4c7363 !important;
          background-image: ${DARK7_GRADIENTS.footer} !important;
          background-repeat: no-repeat !important;
          background-size: 100% 100% !important;
        }

        .dark7-v45-footer .dark5-footer-card {
          background-color: transparent !important;
          border-color: rgba(247, 243, 240, 0.2) !important;
          box-shadow: 0 24px 40px -12px rgba(0, 0, 0, 0.35) !important;
        }

        .dark7-v45-footer .dark5-footer-text,
        .dark7-v45-footer .dark5-footer-subtext:not(.blogs-section-description),
        .dark7-v45-footer .footer-link-underline:not(.blogs-section-description),
        .dark7-v45-footer .footer-link-underline:not(.blogs-section-description):hover,
        .dark7-v45-footer p,
        .dark7-v45-footer span,
        .dark7-v45-footer a:not(.social-icon-animate):not(.blogs-section-description) {
          color: #f7f3f0 !important;
        }

        .dark7-v45-footer .footer-section-label {
          letter-spacing: 0.12em !important;
        }

        .dark7-v45-footer .dark5-footer-border {
          border-color: rgba(247, 243, 240, 0.2) !important;
        }

        .dark5-footer {
          background-color: #122218 !important;
          background-image: ${DARK7_GRADIENTS.footer} !important;
        }

        .dark5-footer-card {
          background-color: #122a21 !important;
          border-color: rgba(167, 180, 49, 0.24) !important;
        }

        .dark5-footer-text {
          color: #e0d1b6 !important;
        }

        .dark5-footer-subtext:not(.blogs-section-description) {
          color: #c8c2ad !important;
        }

        .dark5-footer-accent {
          color: #a7b431 !important;
        }

        .dark5-footer-border {
          border-color: rgba(167, 180, 49, 0.24) !important;
        }

        .footer-link-underline {
          position: relative;
          display: block;
          width: fit-content;
          padding-bottom: 2px;
        }

        .dark7-v45-footer .footer-link-underline::after {
          background-color: #f7f3f0;
        }

        .footer-link-underline::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #a7b431;
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

        .dark5-footer .footer-link-underline:not(.blogs-section-description),
        .dark5-footer .footer-link-underline:not(.blogs-section-description):hover {
          color: #c8c2ad !important;
        }

        .dark7-v45-footer .social-icon-animate {
          background-color: #162d24 !important;
          color: #f7f3f0 !important;
        }

        .dark7-v45-footer .social-icon-animate:hover {
          box-shadow: 0 8px 25px rgba(22, 45, 36, 0.45);
        }

        .social-icon-animate {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dark5-footer .social-icon-animate {
          background-color: #a7b431 !important;
          color: #162d24 !important;
        }

        .social-icon-animate:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(167, 180, 49, 0.35);
        }

        [data-theme="light"] .social-icon-animate:hover {
          box-shadow: 0 8px 25px rgba(1, 56, 37, 0.3);
        }
      `}</style>

      <footer
        className={`dark5-footer dark7-v45-footer relative overflow-hidden pt-3 sm:pt-4 md:pt-5 pb-4 sm:pb-5 md:pb-6 px-4 sm:px-5 md:px-6 lg:px-8 ${
          theme === 'dark' ? '-mt-[2px]' : ''
        }`}
        style={footerBgStyle}
      >
        {theme === 'dark' && (
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{ ...DARK7_GRADIENT_NOISE_STYLE, opacity: 0.045 }}
            aria-hidden="true"
          />
        )}
        <div
          className="dark5-footer-card relative z-[1] mx-auto max-w-[1920px] rounded-lg sm:rounded-xl md:rounded-2xl shadow-[0_24px_40px_-12px_rgba(0,0,0,0.35)] px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 pt-4 sm:pt-5 md:pt-6 pb-4 sm:pb-5 md:pb-6"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`,
          }}
        >
          <div
            className="grid gap-8 sm:gap-9 md:gap-10 grid-cols-1 lg:grid-cols-7 border-b pb-4 sm:pb-5 md:pb-6"
            style={{ borderColor }}
          >
            <div className="space-y-4 sm:space-y-5 sm:col-span-2 md:col-span-3 lg:col-span-3">
              <h3
                className="footer-section-label dark5-footer-text font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-light tracking-[0.12em] uppercase"
                style={{ color: textColor }}
              >
                Studios &amp; contact
              </h3>
              <div className="grid gap-6 sm:gap-7 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                <div className="space-y-1 sm:space-y-1.5">
                  <p
                    className="footer-item-heading font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-light tracking-[0.04em]"
                    style={{ color: textColor }}
                  >
                    Dapper Lisbon
                  </p>
                  <p className="dark5-footer-subtext font-merriweather text-[11px] sm:text-[11px] md:text-[12px] font-light leading-relaxed tracking-[0.03em]" style={{ color: secondaryTextColor }}>
                    Av. Duque de Loulé 12,
                    <br />
                    1050-093 Lisbon
                  </p>
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <p
                    className="footer-item-heading font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-light tracking-[0.04em]"
                    style={{ color: textColor }}
                  >
                    Dapper Rotterdam
                  </p>
                  <p className="dark5-footer-subtext font-merriweather text-[11px] sm:text-[11px] md:text-[12px] font-light leading-relaxed tracking-[0.03em]" style={{ color: secondaryTextColor }}>
                    Weena 70, 13th floor
                    <br />
                    3012 CM Rotterdam
                  </p>
                </div>

                <div className="space-y-1 sm:space-y-1.5 sm:col-span-2 md:col-span-1">
                  <p
                    className="footer-item-heading font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-light tracking-[0.04em]"
                    style={{ color: textColor }}
                  >
                    Contact Tycho
                  </p>
                  <div className="space-y-0.5 sm:space-y-1">
                    <a
                      href="mailto:hello@dapper.agency"
                      className="dark5-footer-subtext footer-link-underline block font-merriweather text-[11px] sm:text-[11px] md:text-[12px] font-light tracking-[0.03em] transition-colors break-all"
                      style={{ color: secondaryTextColor }}
                    >
                      hello@dapper.agency
                    </a>
                    <a
                      href="tel:+31103076707"
                      className="dark5-footer-subtext footer-link-underline block font-merriweather text-[11px] sm:text-[11px] md:text-[12px] font-light tracking-[0.03em] transition-colors whitespace-nowrap"
                      style={{ color: secondaryTextColor }}
                    >
                      +31 10 307 6707
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5 sm:space-y-6 sm:col-span-2 md:col-span-3 lg:col-span-4 lg:pl-4 xl:pl-8 lg:border-l" style={{ borderColor }}>
              <h3
                className="footer-section-label dark5-footer-text font-merriweather text-[11px] sm:text-[12px] md:text-[13px] font-light tracking-[0.12em] uppercase"
                style={{ color: textColor }}
              >
                Essential links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-x-10 sm:gap-y-0">
                {ESSENTIAL_LINK_GROUPS.map((group) => (
                  <div key={group.title} className="space-y-2 sm:space-y-2.5">
                    <h4
                      className="footer-item-heading font-merriweather text-[11px] sm:text-[12px] font-light tracking-[0.04em]"
                      style={{ color: textColor }}
                    >
                      {group.title}
                    </h4>
                    <nav className="flex flex-col gap-y-0.5 sm:gap-y-1">
                      {group.links.map((item) => (
                        <FooterLink key={item.href} href={item.href} theme={theme}>
                          {item.label}
                        </FooterLink>
                      ))}
                    </nav>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dark5-footer-border flex items-end border-b py-3 sm:py-4 md:py-4" style={{ borderColor }}>
            <div className="flex items-end gap-4 sm:gap-5 md:gap-6">
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

          <div className="flex flex-col gap-2 sm:gap-3 py-2 sm:py-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-1.5">
              <span className="dark5-footer-subtext font-merriweather text-[11px] sm:text-[11px] md:text-[12px] font-light tracking-[0.03em] whitespace-nowrap" style={{ color: secondaryTextColor }}>
                © 2026 TechEyrie
              </span>
            </div>

            <div className="dark5-footer-subtext flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-1.5 text-[11px] sm:text-[11px] md:text-[12px] font-merriweather font-light tracking-[0.03em] whitespace-nowrap" style={{ color: secondaryTextColor }}>
              <span>Design by Nasick</span>
              <span>Code by Ahmad</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <SocialIcon href="https://instagram.com" label="Instagram" type="instagram" theme={theme} />
              <SocialIcon href="https://linkedin.com" label="LinkedIn" type="linkedin" theme={theme} />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterLink({ href, children, theme = 'light' }) {
  const textColor = theme === 'dark' ? FOOTER_CREAM : '#444444';

  return (
    <Link
      href={href}
      className="blogs-section-description footer-link-underline dark7-v45-footer-menu-link block font-merriweather font-light leading-snug tracking-normal transition-colors whitespace-nowrap"
      style={{ color: textColor }}
    >
      {children}
    </Link>
  );
}

function SocialIcon({ href, label, type, theme = 'light' }) {
  const socialBg = theme === 'dark' ? '#162D24' : '#181818';
  const socialColor = theme === 'dark' ? '#F7F3F0' : '#FFFFFF';

  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="social-icon-animate flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-[8px] sm:rounded-[10px] transition-all"
      style={{
        backgroundColor: socialBg,
        color: socialColor,
      }}
    >
      {type === 'instagram' ? (
        <svg width="14" height="14" className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 3.066a6.771 6.771 0 1 0 0 13.542 6.771 6.771 0 0 0 0-13.542zm7.2-1.596a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
        </svg>
      ) : (
        <svg width="14" height="14" className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5C4.98 4.604 4.088 5.5 2.99 5.5 1.89 5.5 1 4.604 1 3.5 1 2.398 1.89 1.5 2.99 1.5c1.098 0 1.99.898 1.99 2zm.02 4H1V22h4V7.5zm7.982 0H9V22h4v-7.7c0-4.066 5-3.113 5 0V22h4v-8.994C22 7.64 14.89 7.812 12.982 11V7.5z" />
        </svg>
      )}
    </a>
  );
}