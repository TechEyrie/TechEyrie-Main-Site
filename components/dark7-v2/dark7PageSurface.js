/**
 * Single source of truth for the dark7 page surface (HeroProblemServicesCombined <main>).
 * Same paint must show through the hero video fade and the portfolio block for a seamless seam.
 */
export const dark7MainSurfaceStyle = {
  backgroundColor: "#162d24",
  backgroundImage: `
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
    radial-gradient(
      ellipse at 60% 80%,
      rgba(117, 133, 53, 0.5) 0%,
      rgba(27, 71, 50, 0.4) 40%,
      rgba(22, 45, 36, 0.92) 100%
    )
  `,
  backgroundBlendMode: "overlay, normal",
};
