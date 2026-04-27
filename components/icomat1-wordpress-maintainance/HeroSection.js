"use client";

const STATS = [
  { value: "300+", label: "5-star Google reviews" },
  { value: "100%", label: "Satisfaction guaranteed" },
  { value: "30+", label: "Expert team members" },
];

export default function HeroSection() {
  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-end",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <video
        src="https://icomat.cdn.prismic.io/icomat/aWEfyAIvOtkhBOsl_ICOMAT-TECHHEROVIDEO_1.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.14) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 45%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          padding:
            "clamp(92px, 10vw, 140px) clamp(24px, 5vw, 80px) clamp(56px, 8vw, 100px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(28px, 4vw, 44px)",
        }}
      >
        <div style={{ maxWidth: "900px" }}>
          <h1
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.96)",
              fontSize: "clamp(2.2rem, 5.2vw, 5rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              fontWeight: 600,
              maxWidth: "13ch",
            }}
          >
            WordPress website development
          </h1>

          <p
            style={{
              margin: "20px 0 0",
              color: "rgba(255,255,255,0.8)",
              fontSize: "clamp(0.98rem, 1.2vw, 1.15rem)",
              lineHeight: 1.65,
              maxWidth: "56ch",
            }}
          >
            Our in-house team of expert WordPress developers bring decades of experience.
          </p>
        </div>

        <div
          className="wpd-stats-grid"
          style={{
            width: "min(100%, 1080px)",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "clamp(12px, 1.4vw, 20px)",
          }}
        >
          {STATS.map((item) => (
            <div
              key={item.label}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "16px",
                padding: "clamp(16px, 1.7vw, 22px) clamp(18px, 2vw, 26px)",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.34)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 24px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "clamp(2rem, 3.3vw, 3.3rem)",
                  lineHeight: 1,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  whiteSpace: "nowrap",
                }}
              >
                {item.value}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontSize: "clamp(1rem, 1.3vw, 1.65rem)",
                  lineHeight: 1.1,
                  fontWeight: 500,
                  maxWidth: "12ch",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .wpd-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 920px) {
          .wpd-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
