"use client";

/**
 * Dark7-style static section background (radial teal → green + subtle noise).
 * Edges dissolve into page bed (#162d24) so adjacent sections don't hard-cut.
 */
export function AboutLuxuryStaticBg({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, #1b4732 0%, #17382c 42%, #162d24 78%, #162d24 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          background:
            "radial-gradient(ellipse at 18% 22%, rgba(0, 81, 96, 0.45) 0%, transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.025) 1px, rgba(255, 255, 255, 0.025) 2px),
            repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.025) 1px, rgba(255, 255, 255, 0.025) 2px),
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.012) 2px, rgba(255, 255, 255, 0.012) 4px)
          `,
        }}
      />
      {/* Edge dissolve into continuous page color */}
      <div className="about-seam-fade about-seam-fade--top" />
      <div className="about-seam-fade about-seam-fade--bottom" />
    </div>
  );
}
