"use client";

/**
 * Dark7-style static section background (radial teal → green + subtle noise).
 * Use only where there is no canvas / scrub / animated SVG backdrop.
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
            "radial-gradient(ellipse at 15% 20%, #005160 0%, #1b4732 45%, #162d24 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
            repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px)
          `,
        }}
      />
    </div>
  );
}
