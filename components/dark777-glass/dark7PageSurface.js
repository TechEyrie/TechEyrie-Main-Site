/**
 * Single source of truth for the dark7 page surface (HeroProblemServicesCombined <main>).
 * Same paint must show through the hero video fade and the portfolio block for a seamless seam.
 */
export const dark7MainSurfaceStyle = {
  backgroundColor: "#162d24",
  backgroundImage: `
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
    radial-gradient(
      ellipse at 72% 18%,
      rgba(212, 175, 95, 0.14) 0%,
      transparent 52%
    ),
    radial-gradient(
      ellipse at 60% 80%,
      rgba(212, 175, 95, 0.22) 0%,
      rgba(27, 71, 50, 0.38) 40%,
      rgba(22, 45, 36, 0.92) 100%
    ),
    linear-gradient(135deg, #162d24 0%, #1b4732 18%, #005160 55%, #162d24 100%)
  `,
  backgroundBlendMode: "overlay, normal, soft-light",
};

/** Glass page — champagne crystal surface (hero + portfolio seam) */
export const glass7MainSurfaceStyle = {
  backgroundColor: "#142820",
  backgroundImage: `
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
    radial-gradient(
      ellipse at 82% 14%,
      rgba(212, 175, 95, 0.18) 0%,
      transparent 54%
    ),
    radial-gradient(
      ellipse at 14% 72%,
      rgba(190, 215, 235, 0.1) 0%,
      transparent 48%
    ),
    radial-gradient(
      ellipse at 58% 88%,
      rgba(212, 175, 95, 0.16) 0%,
      rgba(27, 71, 50, 0.28) 42%,
      rgba(20, 40, 32, 0.94) 100%
    ),
    linear-gradient(155deg, #142820 0%, #162d24 38%, #101e27 100%)
  `,
  backgroundBlendMode: "overlay, normal, soft-light",
};
