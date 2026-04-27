"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    number: "1",
    title: "Peace of mind",
    body: "Select the best WordPress website maintenance package for your specific needs. Our team provides a range of recurring WordPress maintenance plans tailored for premium management projects, ideal for businesses, agencies, and firms across the USA.",
  },
  {
    number: "2",
    title: "Improve performance",
    body: "You'll meet with our expert WordPress management team to discuss your project and our ongoing optimization and development strategies. Our tailored approach ensures premium performance, whether managing standard WordPress sites or specialized WooCommerce development.",
  },
  {
    number: "3",
    title: "Reliable support",
    body: "Get access to a dedicated support team that monitors your site around the clock. We handle updates, security patches, and backups so you can focus entirely on growing your business.",
  },
  {
    number: "4",
    title: "Scalable solutions",
    body: "Whether you're a startup or an established enterprise, our maintenance packages scale with your needs. We offer flexible plans that grow alongside your website traffic and business goals.",
  },
];

function NumberBadge({ number }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width:  "clamp(58px, 5.5vw, 76px)",
        height: "clamp(58px, 5.5vw, 76px)",
        borderRadius: "16px",
        backgroundColor: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.28)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontWeight: 600,
          fontSize: "clamp(1.5rem, 2.2vw, 2rem)",
          color: "#ffffff",
          lineHeight: 1,
        }}
      >
        {number}
      </span>
    </div>
  );
}

function BenefitItem({ item, index }) {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(16px, 2vw, 24px)",
        paddingBottom: "clamp(52px, 7vw, 96px)",
        borderBottom:
          index < ITEMS.length - 1
            ? "1px solid rgba(255,255,255,0.14)"
            : "none",
        marginBottom:
          index < ITEMS.length - 1 ? "clamp(52px, 7vw, 96px)" : 0,
        opacity: 0,
      }}
    >
      <NumberBadge number={item.number} />

      {/* ── Fix 2 + 3: item title — bigger, semi-bold ── */}
      <h3
        style={{
          fontWeight: 600,
          fontSize: "clamp(1.4rem, 2vw, 1.85rem)",
          color: "rgba(255,255,255,0.95)",
          margin: 0,
          lineHeight: 1.18,
          letterSpacing: "-0.01em",
        }}
      >
        {item.title}
      </h3>

      {/* ── Fix 2: body text — bigger ── */}
      <p
        style={{
          fontWeight: 400,
          fontSize: "clamp(1rem, 1.15vw, 1.1rem)",
          color: "rgba(255,255,255,0.72)",
          lineHeight: 1.75,
          margin: 0,
          maxWidth: "580px",
        }}
      >
        {item.body}
      </p>
    </div>
  );
}

export default function BenefitsSection() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, x: -24 },
      {
        opacity: 1,
        x: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 88%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        backgroundColor: "#162D24",
        boxSizing: "border-box",
        padding: "clamp(72px, 9vw, 120px) clamp(80px, 12vw, 200px)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: "clamp(48px, 7vw, 112px)",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: "clamp(80px, 10vw, 120px)",
            flex: "0 0 clamp(240px, 34%, 420px)",
            alignSelf: "flex-start",
          }}
        >
          <h2
            ref={titleRef}
            style={{
              fontWeight: 600,
              fontSize: "clamp(2.4rem, 3.6vw, 4rem)",
              lineHeight: 1.07,
              letterSpacing: "-0.025em",
              color: "#ffffff",
              margin: 0,
              opacity: 0,
            }}
          >
            Benefits of our WordPress maintenance packages
          </h2>
        </div>

        <div
          style={{
            flex: "1 1 0",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {ITEMS.map((item, i) => (
            <BenefitItem key={item.number} item={item} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .benefits-inner {
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  );
}