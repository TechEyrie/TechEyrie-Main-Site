"use client";

export default function WorkCtaSection() {
  return (
    <section
      style={{
        background: "#dff07a",
        padding: "clamp(18px, 3vw, 28px) 16px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#0f3725",
          fontSize: "clamp(1rem, 1.3vw, 1.3rem)",
          fontWeight: 500,
        }}
      >
        Ready to start your WordPress project?
      </p>
      <div style={{ marginTop: "10px" }}>
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#0f3725",
            color: "#fff",
            borderRadius: "999px",
            padding: "7px 18px",
            textDecoration: "none",
            fontSize: "0.75rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Get a quote
          <span style={{ fontSize: "0.8rem" }}>→</span>
        </a>
      </div>
    </section>
  );
}

