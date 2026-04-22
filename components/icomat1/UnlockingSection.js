"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

// ── SVG Icons ───────────────────────────────────────────────────
const IconWaves = () => (
  <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
    <path d="M4 12c3-3 6-3 9 0s6 3 9 0 6-3 9 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 18c3-3 6-3 9 0s6 3 9 0 6-3 9 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 24c3-3 6-3 9 0s6 3 9 0 6-3 9 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconLayers = () => (
  <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
    <path d="M18 5L32 12.5L18 20L4 12.5L18 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M4 19L18 26.5L32 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 25.5L18 33L32 25.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconBolt = () => (
  <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
    <path d="M20 4L8 20h10l-2 12L30 16H20L20 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const IconTarget = () => (
  <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="13" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="18" cy="18" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="18" cy="18" r="2" fill="currentColor"/>
    <path d="M18 5V2M18 34v-3M5 18H2M34 18h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconCog = () => (
  <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 4v4M18 28v4M4 18h4M28 18h4M7.5 7.5l2.8 2.8M25.7 25.7l2.8 2.8M7.5 28.5l2.8-2.8M25.7 10.3l2.8-2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ── Card data ───────────────────────────────────────────────────
const CARDS = [
  {
    id: "build",
    eyebrow: "Leading web design & development solutions in the USA",
    title: "Crafting premium, professional, and responsive WordPress websites tailored to your needs.",
    desc: null,
    icon: null,
    isHero: true,
  },
  {
    id: "steered",
    title: "Expert web designers & developers",
    desc: "Our team of skilled designers, developers, and specialists delivers innovative web solutions for businesses of all sizes.",
    icon: <IconWaves />,
  },
  {
    id: "lighter",
    title: "Custom web design services",
    desc: "As a leading studio, we specialize in designing custom websites that align with your brand identity.",
    icon: <IconLayers />,
  },
  {
    id: "speed",
    title: "Ecommerce & WooCommerce development",
    desc: "We provide cutting-edge ecommerce solutions, including WooCommerce integration and customization.",
    icon: <IconBolt />,
  },
  {
    id: "precision",
    title: "Fully managed web services",
    desc: "Our company offers managed website services, ensuring your WordPress site remains secure, up-to-date, and optimized.",
    icon: <IconTarget />,
  },
  {
    id: "integrated",
    title: "Consulting & strategic web solutions",
    desc: "We provide expert consulting services to help businesses navigate the digital landscape.",
    icon: <IconCog />,
  },
];

// ── Image link cards data ───────────────────────────────────────
const IMAGE_CARDS = [
  {
    id: "manifesto",
    label: "FEATURED PROJECTS",
    href: "https://freshysites.com/portfolio/",
    src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1400&q=80&fit=crop",
    alt: "Featured projects",
  },
  {
    id: "industries",
    label: "TESTIMONIALS",
    href: "https://freshysites.com/",
    src: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1400&q=80&fit=crop",
    alt: "Testimonials",
  },
];

// ── Feature card ────────────────────────────────────────────────
function FeatureCard({ card, animRef }) {
  const cardRef = useRef(null);

  const setRef = (el) => {
    cardRef.current = el;
    if (animRef) animRef(el);
  };

  useEffect(() => {
    if (card.isHero) return;
    const el = cardRef.current;
    if (!el) return;

    const iconEl  = el.querySelector(".card-icon");
    const titleEl = el.querySelector(".card-title");
    const descEl  = el.querySelector(".card-desc");

    const onEnter = () => {
      gsap.to(el, { backgroundColor: "#2d2d2b", duration: 0.45, ease: "power1.inOut" });
      gsap.to([iconEl, titleEl].filter(Boolean), {
        color: "#ffffff", duration: 0.6, ease: "power1.inOut", stagger: 0.06,
      });
      if (descEl) gsap.to(descEl, { color: "rgba(255,255,255,0.58)", duration: 0.6, ease: "power1.inOut" });
    };

    const onLeave = () => {
      gsap.to(el, { backgroundColor: "#efefed", duration: 0.65, ease: "power1.inOut" });
      gsap.to([iconEl, titleEl].filter(Boolean), {
        color: "rgba(0,0,0,0.75)", duration: 0.6, ease: "power1.inOut", stagger: 0.05,
      });
      if (descEl) gsap.to(descEl, { color: "rgba(0,0,0,0.42)", duration: 0.6, ease: "power1.inOut" });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [card.isHero]);

  // ── Hero card ────────────────────────────────────────────────
  if (card.isHero) {
    return (
      <div
        ref={setRef}
        style={{
          background: "#2d2d2b",
          borderRadius: "18px",
          padding: "clamp(28px, 3.5vw, 44px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "280px",
        }}
      >
        <div>
          <p style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "clamp(0.95rem, 1.1vw, 1.08rem)",
            fontWeight: 600,
            marginBottom: "8px",
          }}>
            {card.eyebrow}
          </p>
          <p style={{
            color: "rgba(255,255,255,0.88)",
            fontSize: "clamp(0.95rem, 1.1vw, 1.08rem)",
            fontWeight: 700,
            lineHeight: 1.4,
          }}>
            {card.title}
          </p>
        </div>
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            color: "rgba(255,255,255,0.7)",
            fontSize: "clamp(0.95rem, 1.1vw, 1.08rem)",
            fontWeight: 600,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
        >
          Learn more
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    );
  }

  // ── Feature card ─────────────────────────────────────────────
  return (
    <div
      ref={setRef}
      style={{
        background: "#efefed",
        borderRadius: "18px",
        padding: "clamp(28px, 3.5vw, 44px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "280px",
        cursor: "pointer",
        willChange: "background-color",
      }}
    >
      <div className="card-icon" style={{ color: "rgba(0,0,0,0.55)" }}>
        {card.icon}
      </div>
      <div style={{ marginTop: "28px" }}>
        <p
          className="card-title"
          style={{
            color: "rgba(0,0,0,0.82)",
            fontSize: "clamp(0.95rem, 1.1vw, 1.08rem)",
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: "10px",
          }}
        >
          {card.title}
        </p>
        {card.desc && (
          <p
            className="card-desc"
            style={{
              color: "rgba(0,0,0,0.42)",
              fontSize: "clamp(0.95rem, 1.1vw, 1.08rem)",
              fontWeight: 400,
              lineHeight: 1.68,
              margin: 0,
            }}
          >
            {card.desc}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Image link card ─────────────────────────────────────────────
function ImageLinkCard({ card, animRef }) {
  const cardRef = useRef(null);
  const imgRef  = useRef(null);
  const pillRef = useRef(null);

  const setRef = (el) => {
    cardRef.current = el;
    if (animRef) animRef(el);
  };

  useEffect(() => {
    const el   = cardRef.current;
    const img  = imgRef.current;
    const pill = pillRef.current;
    if (!el || !img) return;

    const onEnter = () => {
      gsap.to(img,  { scale: 1.05, duration: 0.7, ease: "power2.out" });
      gsap.to(pill, { backgroundColor: "rgba(40,38,36,0.88)", duration: 0.4, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(img,  { scale: 1,    duration: 0.7, ease: "power2.inOut" });
      gsap.to(pill, { backgroundColor: "rgba(60,58,54,0.68)", duration: 0.4, ease: "power2.inOut" });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <a
      ref={setRef}
      href={card.href}
      style={{
        position: "relative",
        display: "block",
        borderRadius: "18px",
        overflow: "hidden",
        height: "clamp(260px, 32vw, 480px)",
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      {/* Background image */}
      <img
        ref={imgRef}
        src={card.src}
        alt={card.alt}
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: "center",
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.22)",
          pointerEvents: "none",
        }}
      />

      {/* Frosted pill label — centered */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={pillRef}
          style={{
            backgroundColor: "rgba(60,58,54,0.68)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "999px",
            padding: "14px 44px",
            color: "rgba(255,255,255,0.88)",
            fontSize: "clamp(0.68rem, 0.8vw, 0.76rem)",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {card.label}
        </div>
      </div>
    </a>
  );
}

// ── Section ─────────────────────────────────────────────────────
export default function UnlockingSection() {
  const sectionRef   = useRef(null);
  const headingRef   = useRef(null);
  const gridRef      = useRef(null);
  const imageRowRef  = useRef(null);
  const cardAnimRefs = useRef([]);
  const imgCardRefs  = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Heading: scroll color-fill word by word ──────────────
      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: "words" });
        gsap.set(split.words, { color: "rgba(0,0,0,0.1)" });

        split.words.forEach((word) => {
          gsap.to(word, {
            color: "rgba(0,0,0,0.9)",
            ease: "none",
            scrollTrigger: {
              trigger: word,
              start: "top 88%",
              end: "top 55%",
              scrub: 0.8,
            },
          });
        });
      }

      // ── Feature cards: stagger fade-up ──────────────────────
      const cards = cardAnimRefs.current.filter(Boolean);
      gsap.set(cards, { opacity: 0, y: 50 });
      ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
          });
        },
      });

      // ── Image cards: fade-up ─────────────────────────────────
      const imgCards = imgCardRefs.current.filter(Boolean);
      gsap.set(imgCards, { opacity: 0, y: 40 });
      ScrollTrigger.create({
        trigger: imageRowRef.current,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(imgCards, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.15,
          });
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        background: "#f7f7f5",
        padding: "clamp(64px, 10vw, 130px) clamp(24px, 5vw, 80px)",
      }}
    >

      {/* ── Heading ───────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "clamp(52px, 7vw, 90px)" }}>
        <h2
          ref={headingRef}
          style={{
            fontWeight: 600,
            fontSize: "clamp(2.4rem, 4.5vw, 4.5rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            maxWidth: "820px",
            margin: "0 auto",
            color: "rgba(0,0,0,0.1)",
          }}
        >
          Leading WordPress web design and development solutions in the USA.
        </h2>
      </div>

      {/* ── Feature cards grid ────────────────────────────────── */}
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(12px, 1.4vw, 18px)",
          marginBottom: "clamp(12px, 1.4vw, 18px)",
        }}
      >
        {CARDS.map((card, i) => (
          <FeatureCard
            key={card.id}
            card={card}
            animRef={(el) => (cardAnimRefs.current[i] = el)}
          />
        ))}
      </div>

      {/* ── Image link row ────────────────────────────────────── */}
      <div
        ref={imageRowRef}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(12px, 1.4vw, 18px)",
        }}
      >
        {IMAGE_CARDS.map((card, i) => (
          <ImageLinkCard
            key={card.id}
            card={card}
            animRef={(el) => (imgCardRefs.current[i] = el)}
          />
        ))}
      </div>

    </section>
  );
}