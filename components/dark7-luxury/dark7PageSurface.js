/**
 * Noir Emerald surface — same structure as dark7, luxury palette
 */
export const dark7MainSurfaceStyle = {
  backgroundColor: "#0f2219",
  backgroundImage: `
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
    radial-gradient(
      ellipse at 72% 16%,
      rgba(42, 92, 72, 0.2) 0%,
      transparent 52%
    ),
    radial-gradient(
      ellipse at 18% 78%,
      rgba(10, 46, 50, 0.28) 0%,
      transparent 48%
    ),
    radial-gradient(
      ellipse at 58% 88%,
      rgba(30, 61, 48, 0.35) 0%,
      rgba(15, 34, 25, 0.94) 100%
    ),
    linear-gradient(160deg, #0a0a0a 0%, #0f2219 38%, #162d24 100%)
  `,
  backgroundBlendMode: "overlay, normal, soft-light, normal",
};
