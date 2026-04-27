"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    id: 1,
    question: "What is WordPress website maintenance & management?",
    answer:
      "WordPress maintenance and management covers everything needed to keep your site secure, fast, and up to date. This includes plugin and theme updates, WordPress core upgrades, daily backups, uptime monitoring, security scanning, and performance optimisation. A managed WordPress service means you never have to worry about the technical side of running your site.",
  },
  {
    id: 2,
    question: "Why is WordPress management important?",
    answer:
      "Without regular maintenance, WordPress sites become vulnerable to security exploits, suffer performance degradation, and risk data loss. Outdated plugins are the number one cause of WordPress hacks. Proactive management ensures your site stays protected, loads fast, and provides a consistently great experience for your visitors.",
  },
  {
    id: 3,
    question: "What's typically included in the paid WordPress management plan?",
    answer:
      "Paid WordPress management plans typically include regular core, plugin, and theme updates, automated daily or weekly backups with offsite storage, uptime monitoring, malware scanning and removal, performance audits, and priority support. Higher-tier plans often add developer hours for custom changes, monthly reports, and WooCommerce-specific care.",
  },
  {
    id: 4,
    question: "How often will my WordPress site be updated?",
    answer:
      "Most managed WordPress plans perform updates on a weekly basis at minimum, with security patches applied immediately as they are released. Critical vulnerabilities are addressed within 24 hours. You will receive a report after every update cycle detailing exactly what was changed and the current status of your site.",
  },
  {
    id: 5,
    question: "Will I lose any data or content during maintenance?",
    answer:
      "No. Before any updates or changes are applied, a full backup of your site is created and stored securely off-site. If anything unexpected occurs during the update process, we can restore your site to its previous state within minutes. Data loss during routine maintenance is extremely rare with a proper backup strategy in place.",
  },
  {
    id: 6,
    question: "Do you support WooCommerce and eCommerce sites?",
    answer:
      "Yes. We have deep experience managing WooCommerce stores, including product catalogue maintenance, payment gateway updates, order management support, and performance tuning for high-traffic stores. eCommerce sites require extra care due to the transactional nature of the platform, and our plans are specifically designed to address those needs.",
  },
  {
    id: 7,
    question: "Can I upgrade or downgrade my maintenance plan?",
    answer:
      "Absolutely. You can change your plan at any time with no lock-in contracts. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle. We are happy to discuss which plan best suits your current stage and scale up as your business grows.",
  },
  {
    id: 8,
    question: "What happens if my site goes down?",
    answer:
      "Our uptime monitoring checks your site every minute from multiple global locations. If a downtime event is detected, our team is alerted instantly and begins investigating. For clients on premium plans, we aim to have sites restored within one hour. You will be notified by email and a full incident report is provided once the issue is resolved.",
  },
];

// ── Single FAQ accordion item ─────────────────────────────────
function FAQItem({ faq, index, isOpen, onToggle }) {
  const answerRef   = useRef(null);
  const arrowRef    = useRef(null);
  const itemRef     = useRef(null);
  const isOpenRef   = useRef(false);

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(
      itemRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: index * 0.055,
        scrollTrigger: {
          trigger: itemRef.current,
          start: "top 92%",
          once: true,
        },
      }
    );
  }, []);

  // Open / close accordion
  useEffect(() => {
    const el    = answerRef.current;
    const arrow = arrowRef.current;
    if (!el) return;

    if (isOpen && !isOpenRef.current) {
      // Open
      gsap.set(el, { height: "auto", opacity: 1 });
      const h = el.offsetHeight;
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: h, opacity: 1, duration: 0.45, ease: "power3.out" }
      );
      gsap.to(arrow, { rotation: 180, duration: 0.38, ease: "power2.inOut" });
      isOpenRef.current = true;
    } else if (!isOpen && isOpenRef.current) {
      // Close
      gsap.to(el,    { height: 0, opacity: 0, duration: 0.38, ease: "power3.inOut" });
      gsap.to(arrow, { rotation: 0,   duration: 0.38, ease: "power2.inOut" });
      isOpenRef.current = false;
    }
  }, [isOpen]);

  return (
    <div
      ref={itemRef}
      style={{ opacity: 0 }}
    >
      {/* ── Question row ── */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "clamp(22px, 2.8vw, 32px) 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontWeight: 500,
            fontSize: "clamp(0.98rem, 1.2vw, 1.1rem)",
            color: "rgba(255,255,255,0.95)",
            lineHeight: 1.4,
            flex: 1,
          }}
        >
          {faq.question}
        </span>

        {/* Lime-green circle arrow button */}
        <div
          style={{
            flexShrink: 0,
            width:  "clamp(36px, 3vw, 46px)",
            height: "clamp(36px, 3vw, 46px)",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            ref={arrowRef}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ display: "block" }}
          >
            <path
              d="M8 3v10M3 8l5 5 5-5"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* ── Answer panel ── */}
      <div
        ref={answerRef}
        style={{
          height: 0,
          overflow: "hidden",
          opacity: 0,
        }}
      >
        <p
          style={{
            fontWeight: 400,
            fontSize: "clamp(0.95rem, 1.05vw, 1rem)",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.78,
            margin: 0,
            paddingBottom: "clamp(20px, 2.5vw, 30px)",
            maxWidth: "820px",
          }}
        >
          {faq.answer}
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.14)",
        }}
      />
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────
export default function FAQSection() {
  const [openId, setOpenId] = useState(null);
  const headingRef  = useRef(null);
  const subtitleRef = useRef(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  // Header entrance
  useEffect(() => {
    gsap.fromTo(
      [headingRef.current, subtitleRef.current],
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 88%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <section
      style={{
        width: "100%",
        backgroundColor: "#162D24",
        boxSizing: "border-box",
        padding: "clamp(72px, 9vw, 120px) clamp(80px, 12vw, 200px)",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "clamp(48px, 6vw, 80px)",
            maxWidth: "680px",
          }}
        >
          <h2
            ref={headingRef}
            style={{
              fontWeight: 600,
              fontSize: "clamp(2rem, 3.5vw, 3.4rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "#ffffff",
              margin: "0 0 clamp(16px, 2vw, 22px)",
              opacity: 0,
            }}
          >
            Questions? We have answers
          </h2>
          <p
            ref={subtitleRef}
            style={{
              fontWeight: 400,
              fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.72,
              margin: 0,
              opacity: 0,
            }}
          >
            Our team has decades of WordPress management experience under their
            belts, so we've heard it all. See some of our frequently asked
            questions below.
          </p>
        </div>

        {/* ── FAQ list ── */}
        <div style={{ width: "100%" }}>
          {/* Top divider */}
          <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(255,255,255,0.14)" }} />

          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              index={i}
              isOpen={openId === faq.id}
              onToggle={() => toggle(faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}