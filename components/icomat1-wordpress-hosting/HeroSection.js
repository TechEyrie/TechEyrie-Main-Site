"use client";

export default function HeroSection({ onQuoteClick }) {
  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        background:
          "linear-gradient(140deg, #162D24 0%, #1B3A2D 45%, #204433 100%)",
        display: "flex",
        alignItems: "flex-end",
        padding: "clamp(92px, 10vw, 140px) clamp(24px, 5vw, 80px) clamp(56px, 8vw, 100px)",
      }}
    >
      <div style={{ maxWidth: "900px" }}>
        <p
          style={{
            margin: 0,
            color: "rgba(200,240,74,0.9)",
            fontSize: "clamp(0.66rem, 0.75vw, 0.75rem)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          WordPress Hosting
        </p>

        <h1
          style={{
            margin: "14px 0 0",
            color: "rgba(255,255,255,0.96)",
            fontSize: "clamp(2.2rem, 5.2vw, 5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            fontWeight: 600,
            maxWidth: "14ch",
          }}
        >
          Managed WordPress hosting built for speed and reliability.
        </h1>

        <p
          style={{
            margin: "20px 0 0",
            color: "rgba(255,255,255,0.72)",
            fontSize: "clamp(0.98rem, 1.2vw, 1.15rem)",
            lineHeight: 1.65,
            maxWidth: "62ch",
          }}
        >
          We host, monitor, and maintain your site with enterprise-grade uptime,
          performance tuning, and security best practices from day one.
        </p>

        <button
          type="button"
          onClick={onQuoteClick}
          style={{
            marginTop: "32px",
            padding: "14px 24px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.32)",
            background: "rgba(255,255,255,0.12)",
            color: "#ffffff",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Get a Quote
        </button>
      </div>
    </section>
  );
}
