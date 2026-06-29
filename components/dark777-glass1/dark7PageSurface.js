/**
 * Liquid Light surface for /dark777-glass1 (hero + portfolio seam).
 */
export const glass7LiquidSurfaceStyle = {
  backgroundColor: "#0c1814",
  backgroundImage: `
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
    radial-gradient(
      ellipse at 22% 28%,
      rgba(0, 130, 150, 0.22) 0%,
      transparent 54%
    ),
    radial-gradient(
      ellipse at 78% 18%,
      rgba(212, 175, 95, 0.2) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 55% 88%,
      rgba(22, 80, 60, 0.32) 0%,
      rgba(12, 24, 20, 0.96) 100%
    ),
    linear-gradient(155deg, #0c1814 0%, #101e27 42%, #0a1410 100%)
  `,
  backgroundBlendMode: "overlay, normal, soft-light, normal",
};
