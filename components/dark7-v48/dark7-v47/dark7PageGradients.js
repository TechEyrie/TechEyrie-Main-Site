/**
 * Smooth multi-stop gradients + anti-banding noise for dark7-v48 page surfaces.
 */

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}

function lerpColor(from, to, amount) {
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  return rgbToHex(
    start[0] + (end[0] - start[0]) * amount,
    start[1] + (end[1] - start[1]) * amount,
    start[2] + (end[2] - start[2]) * amount,
  );
}

function srgbChannelToLinear(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function linearChannelToSrgb(channel) {
  const value =
    channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(255, Math.max(0, value * 255)));
}

function hexToOklab(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgbChannelToLinear);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

function oklabToHex(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return rgbToHex(
    linearChannelToSrgb(r),
    linearChannelToSrgb(g),
    linearChannelToSrgb(bl),
  );
}

function lerpColorOklab(from, to, amount) {
  const start = hexToOklab(from);
  const end = hexToOklab(to);
  return oklabToHex(
    start.L + (end.L - start.L) * amount,
    start.a + (end.a - start.a) * amount,
    start.b + (end.b - start.b) * amount,
  );
}

/** Build a banding-resistant linear gradient from sparse key stops. */
export function buildSmoothLinearGradient(
  stops,
  stepsPerSegment = 8,
  direction = "to bottom",
) {
  if (!stops.length) return "none";

  const parts = [];

  for (let index = 0; index < stops.length - 1; index += 1) {
    const start = stops[index];
    const end = stops[index + 1];
    const steps = index === stops.length - 2 ? stepsPerSegment + 1 : stepsPerSegment;

    for (let step = 0; step < steps; step += 1) {
      if (index > 0 && step === 0) continue;

      const progress = step / steps;
      const position = start.at + (end.at - start.at) * progress;
      parts.push(`${lerpColorOklab(start.color, end.color, progress)} ${position.toFixed(3)}%`);
    }
  }

  const last = stops[stops.length - 1];
  parts.push(`${last.color} ${last.at}%`);

  return `linear-gradient(${direction} in oklab, ${parts.join(", ")})`;
}

const ULTRA_GRADIENT_DENSITY = 20;
const TESTIMONIALS_GRADIENT_DENSITY = 32;
const FOOTER_GRADIENT_DENSITY = 48;

/** Expand sparse waypoints into dense key stops (monotonic paths only) */
function expandWaypointsToStops(waypoints, subdivisions = 4) {
  const stops = [];

  for (let index = 0; index < waypoints.length - 1; index += 1) {
    for (let step = 0; step < subdivisions; step += 1) {
      if (index > 0 && step === 0) continue;

      const progress = step / subdivisions;
      const position = ((index + progress) / (waypoints.length - 1)) * 100;
      stops.push({
        color: lerpColorOklab(waypoints[index], waypoints[index + 1], progress),
        at: position,
      });
    }
  }

  const last = waypoints[waypoints.length - 1];
  stops.push({ color: last, at: 100 });
  return stops;
}

/** Seam anchors between testimonials ? info ? blog */
export const DARK7_TESTIMONIALS_END = "#3d3f2a";
export const DARK7_BLOG_START = "#84a781";
export const DARK7_BLOG_END = "#f6f2ee";

function mergeZoneGradients(zoneAStops, zoneBStops, zoneAShare = 0.36) {
  const zoneBShare = 1 - zoneAShare;
  const boundary = zoneAShare * 100;

  const merged = zoneAStops.map((stop) => ({
    color: stop.color,
    at: (stop.at / 100) * boundary,
  }));

  zoneBStops.forEach((stop, index) => {
    if (index === 0) {
      const last = merged[merged.length - 1];
      if (
        last &&
        last.color.toLowerCase() === stop.color.toLowerCase() &&
        Math.abs(last.at - boundary) < 0.05
      ) {
        return;
      }
    }

    merged.push({
      color: stop.color,
      at: boundary + (stop.at / 100) * zoneBShare * 100,
    });
  });

  return merged;
}

const TESTIMONIALS_WAYPOINTS = [
  "#f5f1ee",
  "#f1ede6",
  "#ece8df",
  "#e6e3d8",
  "#e0ddd0",
  "#d9d6c8",
  "#d1cfc0",
  "#c7c8b8",
  "#bcc0b0",
  "#aeb4a4",
  "#9ea89a",
  "#8d978c",
  "#7a857a",
  "#677268",
  "#586456",
  "#4f564c",
  "#4a5248",
  "#464e42",
  "#424a3e",
  "#3f4638",
  "#3d422f",
  DARK7_TESTIMONIALS_END,
  DARK7_TESTIMONIALS_END,
];

const TESTIMONIALS_ZONE_STOPS = expandWaypointsToStops(TESTIMONIALS_WAYPOINTS, 6);

const testimonialsSectionGradient = buildSmoothLinearGradient(
  TESTIMONIALS_ZONE_STOPS,
  24,
);

const INFO_TO_BLOG_ZONE_STOPS = [
  { color: DARK7_TESTIMONIALS_END, at: 0 },
  { color: "#4a4a38", at: 6 },
  { color: "#5a5340", at: 10 },
  { color: "#6e6048", at: 14 },
  { color: "#907a52", at: 20 },
  { color: "#ac9063", at: 28 },
  { color: "#9a8258", at: 34 },
  { color: "#756848", at: 40 },
  { color: "#5a5340", at: 46 },
  { color: DARK7_TESTIMONIALS_END, at: 52 },
  { color: "#343f35", at: 56 },
  { color: "#2a3830", at: 60 },
  { color: "#223229", at: 64 },
  { color: "#1a2c24", at: 68 },
  { color: "#152b22", at: 72 },
  { color: "#1a3329", at: 76 },
  { color: "#234a38", at: 80 },
  { color: "#2f5544", at: 84 },
  { color: "#3d5c48", at: 88 },
  { color: "#5a7a62", at: 91 },
  { color: "#6d9074", at: 93 },
  { color: DARK7_BLOG_START, at: 95 },
  { color: "#9db098", at: 96.5 },
  { color: "#b5c0ae", at: 97.5 },
  { color: "#cdd0c6", at: 98.5 },
  { color: "#e3ded1", at: 99.2 },
  { color: "#efe7da", at: 99.6 },
  { color: DARK7_BLOG_END, at: 100 },
];

/** Shared seam — airplane section bottom + footer section top */
export const DARK7_AIRPLANE_FOOTER_SEAM = "#4C7363";
export const DARK7_AIRPLANE_END = DARK7_AIRPLANE_FOOTER_SEAM;

const AIRPLANE_ZONE_STOPS = [
  { color: DARK7_BLOG_END, at: 0 },
  { color: "#f4f1ec", at: 5 },
  { color: "#f0efe8", at: 10 },
  { color: "#eceee2", at: 15 },
  { color: "#e8ece0", at: 20 },
  { color: "#e2e8d8", at: 26 },
  { color: "#dce4ce", at: 32 },
  { color: "#d4dcc4", at: 38 },
  { color: "#ccd4b8", at: 44 },
  { color: "#c2cda8", at: 50 },
  { color: "#b8c49c", at: 55 },
  { color: "#b1bd94", at: 60 },
  { color: "#a8b490", at: 64 },
  { color: "#9eaa8c", at: 68 },
  { color: "#96a892", at: 72 },
  { color: "#8a9e88", at: 76 },
  { color: "#7f9888", at: 80 },
  { color: "#738a7e", at: 84 },
  { color: "#628374", at: 86 },
  { color: "#567a6c", at: 90 },
  { color: "#527a6a", at: 93 },
  { color: "#4f7767", at: 95 },
  { color: DARK7_AIRPLANE_FOOTER_SEAM, at: 97 },
  { color: DARK7_AIRPLANE_FOOTER_SEAM, at: 100 },
];

const FOOTER_WAYPOINTS = [
  DARK7_AIRPLANE_FOOTER_SEAM,
  DARK7_AIRPLANE_FOOTER_SEAM,
  "#4b7262",
  "#4a7161",
  "#486f5f",
  "#466d5d",
  "#446b5b",
  "#426959",
  "#406757",
  "#3e6555",
  "#3c6353",
  "#3a6151",
  "#385f4f",
  "#365d4d",
  "#345b4b",
  "#325949",
  "#305747",
  "#2e5545",
  "#2c5343",
  "#2a5141",
  "#284f3f",
  "#264d3d",
  "#244b3b",
  "#224939",
  "#204737",
  "#1e4535",
  "#1c4333",
  "#1a4131",
  "#183f2f",
  "#173c2c",
  "#163929",
  "#153626",
  "#143324",
  "#133022",
  "#132d20",
  "#132a1e",
  "#13271c",
  "#132419",
];

const FOOTER_ZONE_STOPS = expandWaypointsToStops(FOOTER_WAYPOINTS, 10);

export const DARK7_FOOTER_START = DARK7_AIRPLANE_FOOTER_SEAM;
export const DARK7_FOOTER_END = "#132419";

const footerSectionGradient = buildSmoothLinearGradient(
  FOOTER_ZONE_STOPS,
  FOOTER_GRADIENT_DENSITY,
);

/**
 * Info + blog ˜ 75% of lower block; airplane ˜ 25%.
 * Same key colors as before — only denser OKLab samples between them.
 */
const INFO_AIRPLANE_ZONE_SHARE = 0.75;

const infoToAirplaneBridgeStops = mergeZoneGradients(
  INFO_TO_BLOG_ZONE_STOPS,
  AIRPLANE_ZONE_STOPS,
  INFO_AIRPLANE_ZONE_SHARE,
);

const infoToAirplaneGradient = buildSmoothLinearGradient(
  infoToAirplaneBridgeStops,
  FOOTER_GRADIENT_DENSITY,
);

/** Testimonials + info block ˜ 80% of scroll; airplane ˜ 20% */
const TESTIMONIALS_INFO_ZONE_SHARE = 0.8;

const testimonialsToBlogBridgeStops = mergeZoneGradients(
  TESTIMONIALS_ZONE_STOPS,
  INFO_TO_BLOG_ZONE_STOPS,
  0.36,
);

const testimonialsToAirplaneBridgeStops = mergeZoneGradients(
  testimonialsToBlogBridgeStops,
  AIRPLANE_ZONE_STOPS,
  TESTIMONIALS_INFO_ZONE_SHARE,
);

const testimonialsToAirplaneGradient = buildSmoothLinearGradient(
  testimonialsToAirplaneBridgeStops,
  ULTRA_GRADIENT_DENSITY,
);

const testimonialsToBlogGradient = buildSmoothLinearGradient(
  testimonialsToBlogBridgeStops,
  ULTRA_GRADIENT_DENSITY,
);

export const DARK7_GRADIENT_NOISE_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='800' height='800' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`,
  backgroundSize: "800px 800px",
  backgroundRepeat: "repeat",
  opacity: 0.03,
  mixBlendMode: "soft-light",
};

/** Extra grain for light midtones — overlay only, does not change gradient stops */
export const DARK7_GRADIENT_DITHER_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='d'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23d)' opacity='0.5'/%3E%3C/svg%3E")`,
  backgroundSize: "200px 200px",
  backgroundRepeat: "repeat",
  opacity: 0.09,
  mixBlendMode: "soft-light",
};

function dark7UnifiedGradientStyle(gradient, backgroundColor = DARK7_AIRPLANE_END) {
  return {
    backgroundColor,
    backgroundImage: gradient,
  };
}

/** Info ? Cards ? FAQ ? Blog ? Airplane (starts at testimonials seam #3d3f2a) */
export function dark7InfoToAirplaneContainerStyle() {
  return dark7UnifiedGradientStyle(infoToAirplaneGradient);
}

/** Dedicated full-height gradient for the testimonials section only */
export function dark7TestimonialsSectionSurfaceStyle() {
  return dark7UnifiedGradientStyle(
    testimonialsSectionGradient,
    DARK7_TESTIMONIALS_END,
  );
}

/** @deprecated Prefer dark7InfoToAirplaneContainerStyle + dark7TestimonialsSectionSurfaceStyle */
export function dark7TestimonialsToAirplaneContainerStyle() {
  return dark7UnifiedGradientStyle(testimonialsToAirplaneGradient);
}

/** @deprecated Use dark7TestimonialsToAirplaneContainerStyle */
export function dark7TestimonialsToBlogContainerStyle() {
  return dark7UnifiedGradientStyle(testimonialsToBlogGradient);
}

export function dark7GradientSurfaceStyle(gradient, backgroundColor) {
  return backgroundColor
    ? { backgroundColor, backgroundImage: gradient }
    : { background: gradient };
}

/** Hero sage end — matches portfolio top seam */
export const DARK7_HERO_END = "#8EAC85";

/**
 * Embedded eagle pin length (EagleScrollScene `end: "+=500"`).
 * Shared hero+portfolio paint must cover this or the seam drifts off #8EAC85.
 */
const HERO_EAGLE_PIN_EXTRA = "500px";
const HERO_SHARED_BLOCK_HEIGHT = `calc(100svh + ${HERO_EAGLE_PIN_EXTRA})`;

/** Hero: #162d24 plateau ? mid greens ? #8EAC85 (same as v20) */
const HERO_EAGLE_STOPS = [
  { color: "#162d24", at: 0 },
  { color: "#162d24", at: 45 },
  { color: "#3d5644", at: 62 },
  { color: "#658068", at: 78 },
  { color: DARK7_HERO_END, at: 100 },
];

const HERO_GRADIENT_DENSITY = 16;

const heroEagleGradient = buildSmoothLinearGradient(
  HERO_EAGLE_STOPS,
  HERO_GRADIENT_DENSITY,
);

/** Portfolio continues from hero end #8EAC85 ? cream #f6f2ed */
const PORTFOLIO_STOPS = [
  { color: DARK7_HERO_END, at: 0 },
  { color: "#a8b99a", at: 22 },
  { color: "#c8c9b0", at: 38 },
  { color: "#e2dac3", at: 55 },
  { color: "#ece8e2", at: 78 },
  { color: "#f6f2ed", at: 100 },
];

export function dark7HeroSurfaceStyle() {
  return {
    backgroundColor: "#162d24",
    backgroundImage: heroEagleGradient,
  };
}

/** One paint for hero (+ eagle pin) + portfolio — no seam at #8EAC85 */
export function dark7HeroPortfolioContainerStyle() {
  return {
    backgroundColor: DARK7_HERO_END,
    backgroundImage: `${buildSmoothLinearGradient(PORTFOLIO_STOPS, HERO_GRADIENT_DENSITY)}, ${heroEagleGradient}`,
    backgroundSize: `100% calc(100% - ${HERO_SHARED_BLOCK_HEIGHT}), 100% ${HERO_SHARED_BLOCK_HEIGHT}`,
    backgroundPosition: "center bottom, center top",
    backgroundRepeat: "no-repeat, no-repeat",
  };
}

export const DARK7_GRADIENTS = {
  heroEagle: heroEagleGradient,

  portfolio: buildSmoothLinearGradient(PORTFOLIO_STOPS, HERO_GRADIENT_DENSITY),

  eagleEmbed: heroEagleGradient,

  realProblem: buildSmoothLinearGradient([
    { color: "#f6f2ed", at: 0 },
    { color: "#f5f1ee", at: 100 },
  ]),

  newServices: buildSmoothLinearGradient([
    { color: "#f5f1ee", at: 0 },
    { color: "#f0ebe3", at: 18 },
    { color: "#e8dfd2", at: 34 },
    { color: "#ded1bc", at: 50 },
    { color: "#d4c4a8", at: 66 },
    { color: "#cab896", at: 82 },
    { color: "#c6af8d", at: 100 },
  ]),

  deepJudge: buildSmoothLinearGradient([
    { color: "#c6af8d", at: 0 },
    { color: "#c4a97f", at: 18 },
    { color: "#c0a274", at: 34 },
    { color: "#b69668", at: 50 },
    { color: "#c0a274", at: 66 },
    { color: "#d4c8b4", at: 82 },
    { color: "#f5f1ee", at: 100 },
  ]),

  testimonials: testimonialsSectionGradient,

  faq: buildSmoothLinearGradient([
    { color: DARK7_TESTIMONIALS_END, at: 0 },
    { color: "#323f34", at: 12 },
    { color: "#283830", at: 24 },
    { color: "#203228", at: 36 },
    { color: "#1a2c24", at: 48 },
    { color: "#152b22", at: 58 },
    { color: "#1a3329", at: 68 },
    { color: "#284a3c", at: 78 },
    { color: "#3d5c48", at: 86 },
    { color: "#5f8168", at: 92 },
    { color: DARK7_BLOG_START, at: 100 },
  ], ULTRA_GRADIENT_DENSITY),

  cardsServicesLinear: buildSmoothLinearGradient([
    { color: "#3d3f2a", at: 0 },
    { color: "#5a5340", at: 18 },
    { color: "#756848", at: 34 },
    { color: "#907a52", at: 50 },
    { color: "#ac9063", at: 66 },
    { color: "#907a52", at: 78 },
    { color: "#756848", at: 88 },
    { color: "#3d3f2a", at: 100 },
  ]),

  cardsServicesRadial: `radial-gradient(ellipse at 50% 48%, rgba(228, 210, 170, 0.82) 0%, rgba(196, 168, 120, 0.48) 22%, rgba(172, 144, 99, 0.18) 44%, rgba(172, 144, 99, 0) 68%)`,

  blog: buildSmoothLinearGradient([
    { color: DARK7_BLOG_START, at: 0 },
    { color: "#93ad92", at: 8 },
    { color: "#9db098", at: 14 },
    { color: "#aab5a4", at: 20 },
    { color: "#b5c0ae", at: 28 },
    { color: "#c3c9b8", at: 36 },
    { color: "#cdd0c6", at: 44 },
    { color: "#d8dbd0", at: 52 },
    { color: "#e3ded1", at: 60 },
    { color: "#ebe5d8", at: 68 },
    { color: "#efe7da", at: 76 },
    { color: "#f2ece3", at: 84 },
    { color: "#f4efea", at: 92 },
    { color: DARK7_BLOG_END, at: 100 },
  ], ULTRA_GRADIENT_DENSITY),

  airplane: buildSmoothLinearGradient(
    AIRPLANE_ZONE_STOPS,
    FOOTER_GRADIENT_DENSITY,
  ),

  footer: footerSectionGradient,

  /** Nearly flat bridge between DeepJudge and Testimonials */
  lightBridge: buildSmoothLinearGradient([
    { color: "#f5f1ee", at: 0 },
    { color: "#f4f0eb", at: 50 },
    { color: "#f5f1ee", at: 100 },
  ]),
};

/** Radial glow overlay for DeepJudge — separate layer; does not modify DARK7_GRADIENTS.deepJudge. */
export const DARK7_DEEP_JUDGE_RADIAL_STYLE = {
  backgroundImage: `radial-gradient(
    ellipse 105% 78% at 52% 66%,
    rgba(148, 108, 58, 0.72) 0%,
    rgba(168, 124, 72, 0.52) 28%,
    rgba(188, 148, 96, 0.32) 48%,
    transparent 72%
  )`,
  mixBlendMode: "multiply",
  opacity: 0.9,
  /* Only fade the last strip so the seam stays clean (v5) without killing the glow. */
  maskImage: "linear-gradient(to bottom, #000 0%, #000 82%, transparent 96%)",
  WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 82%, transparent 96%)",
};

/** Bottom seam — keeps DeepJudge exit at #f5f1ee over radial only; linear gradient unchanged. */
export const DARK7_DEEP_JUDGE_BOTTOM_BLEND_STYLE = {
  background: "linear-gradient(to top, #f5f1ee 0%, rgba(245, 241, 238, 0) 72%)",
};

export function dark7CardsServicesBgStyle() {
  return {
    backgroundColor: "#ac9063",
    backgroundImage: `${DARK7_GRADIENTS.cardsServicesRadial}, ${DARK7_GRADIENTS.cardsServicesLinear}`,
  };
}
