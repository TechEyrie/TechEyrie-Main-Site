"use client";

export default function PortfolioCard({ project }) {
  return (
    <article
      style={{
        background: "#f3eee5",
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          minHeight: "220px",
        }}
        className="icomat1-work-card"
      >
        <div
          style={{
            background: project.accent,
            padding: "10px",
          }}
        >
          <div
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              loading="lazy"
            />
          </div>
        </div>

        <div
          style={{
            padding: "16px 16px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                color: "#0f3725",
                fontSize: "clamp(1rem, 1.25vw, 1.25rem)",
                lineHeight: 1.2,
                fontWeight: 600,
              }}
            >
              {project.title}
            </h3>
            <p
              style={{
                margin: "8px 0 0",
                color: "rgba(15,55,37,0.85)",
                fontSize: "clamp(0.75rem, 0.85vw, 0.88rem)",
                lineHeight: 1.45,
              }}
            >
              {project.description}
            </p>
          </div>

          <a
            href="#"
            style={{
              alignSelf: "flex-start",
              background: "#b7ed2f",
              color: "#10452f",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.03em",
              borderRadius: "999px",
              padding: "7px 14px",
            }}
          >
            View case study
          </a>
        </div>
      </div>
    </article>
  );
}

