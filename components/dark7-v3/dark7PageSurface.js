/**
 * Page surface under HeroProblemServicesCombined <main>.
 * Solid base + noise only — hero/portfolio paint their own smooth gradients on top.
 */
import { DARK7_GRADIENT_NOISE_STYLE } from "./dark7PageGradients";

export const dark7MainSurfaceStyle = {
  backgroundColor: "#162d24",
  backgroundImage: DARK7_GRADIENT_NOISE_STYLE.backgroundImage,
  backgroundSize: DARK7_GRADIENT_NOISE_STYLE.backgroundSize,
  backgroundBlendMode: "overlay",
};
