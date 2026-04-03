import { dark7MainSurfaceStyle } from "../dark7/dark7PageSurface";

/** Dark7 luxury surface for case study listing + detail sections (theme dark). */
export function caseStudySectionSurface(isDark) {
  return isDark ? dark7MainSurfaceStyle : undefined;
}

export function caseStudySectionShell(isDark) {
  return `w-full relative overflow-hidden ${isDark ? "" : "bg-white"}`;
}
