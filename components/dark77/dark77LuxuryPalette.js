/**
 * Tech Eyrie dark77 — warm forest luxury with cream + champagne lift.
 */

export const LUX = {
  bgDeep: "#152820",
  bgBase: "#1e3a2f",
  bgSurface: "#234a3a",
  bgElevated: "#2a5544",
  bgCard: "#1f4235",
  bgFooterCard: "#1a382c",

  cream: "#F8F3E8",
  creamWarm: "#F5EFE3",
  creamMuted: "#EBE3D4",
  creamDeep: "#E0D5C4",

  sage: "#7AAB88",
  sageLight: "#9BC4A6",
  sageSoft: "#5C8A6A",

  champagne: "#F0E6D4",
  champagneBright: "#FAF4EA",
  gold: "#D4B876",
  goldSoft: "#E0C992",

  textPrimary: "#FFFCF7",
  textSecondary: "#F0E8DC",
  textMuted: "#C4B8A4",
  textOnCream: "#152820",

  cta: "#2d5244",
  ctaHover: "#3a6b58",

  borderCream: "rgba(248, 243, 232, 0.35)",
  borderGold: "rgba(212, 184, 118, 0.55)",
  glowWarm: "rgba(250, 244, 234, 0.55)",
  glowSage: "rgba(155, 196, 166, 0.38)",
};

export const dark77NoiseSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`;

export const dark77MainSurfaceStyle = {
  backgroundColor: LUX.bgBase,
  backgroundImage: `
    ${dark77NoiseSvg},
    radial-gradient(
      ellipse at 70% 85%,
      rgba(212, 184, 118, 0.14) 0%,
      rgba(155, 196, 166, 0.32) 30%,
      rgba(45, 82, 68, 0.5) 52%,
      rgba(30, 58, 46, 0.94) 100%
    ),
    radial-gradient(
      ellipse at 12% 8%,
      rgba(250, 244, 234, 0.12) 0%,
      rgba(30, 58, 46, 0) 50%
    )
  `,
  backgroundBlendMode: "overlay, normal, normal",
};

export const dark77CreamSurfaceStyle = {
  backgroundColor: LUX.cream,
  backgroundImage: `
    ${dark77NoiseSvg},
    linear-gradient(
      165deg,
      rgba(255, 255, 255, 0.55) 0%,
      rgba(245, 239, 227, 0) 45%,
      rgba(224, 213, 196, 0.15) 100%
    )
  `,
  backgroundBlendMode: "overlay, normal",
};

export const dark77OrbGradient =
  "radial-gradient(circle at center, rgba(250,244,234,0.62) 0%, rgba(122,171,136,0.38) 35%, rgba(30,58,46,0) 72%)";

export const dark77SectionRadial =
  "radial-gradient(ellipse at 20% 24%, #3a6b58 0%, #2a5544 42%, #1e3a2f 100%)";

export const dark77CreamBandGradient =
  "linear-gradient(180deg, #FAF4EA 0%, #F8F3E8 28%, #F0E6D4 62%, #F8F3E8 100%)";

export const dark77TealFadeTop =
  "linear-gradient(to bottom, rgba(45,82,68,0.35) 0%, rgba(45,82,68,0) 100%)";

export const dark77TealFadeBottom =
  "linear-gradient(to top, rgba(26,50,40,0.75) 0%, rgba(26,50,40,0) 100%)";
