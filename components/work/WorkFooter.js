"use client";
import React from "react";

export default function WorkFooter({ theme = "light" }) {
  const isDark = theme === "dark";

  return (
    <footer
      className="w-full py-16 md:py-24"
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #0a0a0a 70%, #1e1310 100%)",
      }}
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Work With Us Section */}
        <div className="mb-16 md:mb-24">
          <a
            href="/contact"
            className="inline-flex items-center gap-3 group"
          >
            <h2 className="font-italiana font-light text-[32px] sm:text-[42px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-0.03em] border-b border-white/30 pb-1 text-white">
              Work with us
            </h2>
            <span className="text-white text-2xl md:text-3xl transition-transform group-hover:translate-x-2">
              →
            </span>
          </a>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-16 md:mb-24">
          {/* London */}
          <div>
            <h3 className="font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase text-white mb-1">
              London
            </h3>
            <p className="font-merriweather text-[14px] mb-4 text-white/50">
              {new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/London",
              })}{" "}
              pm
            </p>
            <div className="space-y-1">
              <a
                href="mailto:london@newgenre.studio"
                className="font-merriweather block text-[14px] hover:opacity-70 transition-opacity text-white/60"
              >
                london@newgenre.studio
              </a>
              <a
                href="tel:+442045728788"
                className="font-merriweather block text-[14px] hover:opacity-70 transition-opacity text-white/60"
              >
                +44 20 4572 8788
              </a>
            </div>
            <div className="mt-6 space-y-0.5">
              <p className="font-merriweather text-[14px] text-white/50">
                2 Appleby Yard,
              </p>
              <p className="font-merriweather text-[14px] text-white/50">
                Soames Walk,
              </p>
              <p className="font-merriweather text-[14px] text-white/50">
                London SE10 0BJ
              </p>
            </div>
          </div>

          {/* San Francisco */}
          <div>
            <h3 className="font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase text-white mb-1">
              San Francisco
            </h3>
            <p className="font-merriweather text-[14px] mb-4 text-white/50">
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/Los_Angeles",
              })}{" "}
              am
            </p>
            <div className="space-y-1">
              <a
                href="mailto:sf@newgenre.studio"
                className="font-merriweather block text-[14px] hover:opacity-70 transition-opacity text-white/60"
              >
                sf@newgenre.studio
              </a>
              <a
                href="tel:+18504688274"
                className="font-merriweather block text-[14px] hover:opacity-70 transition-opacity text-white/60"
              >
                +1 850 468 8274
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-8 border-t border-white/10">
          {/* Logo */}
          <div className="text-2xl text-white">
            ⚪⚪
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 md:gap-8 flex-wrap">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-merriweather text-[14px] hover:opacity-70 transition-opacity text-white/70"
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-merriweather text-[14px] hover:opacity-70 transition-opacity text-white/70"
            >
              Instagram
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-merriweather text-[14px] hover:opacity-70 transition-opacity text-white/70"
            >
              X
            </a>
            <a
              href="/careers"
              className="font-merriweather text-[14px] hover:opacity-70 transition-opacity text-white/70"
            >
              Join Us
            </a>
            <a
              href="/newsletter"
              className="font-merriweather text-[14px] hover:opacity-70 transition-opacity text-white/70"
            >
              Newsletter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
