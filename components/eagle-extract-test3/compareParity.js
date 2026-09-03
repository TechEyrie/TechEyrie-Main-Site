/** Sample WebGL canvas for teal glass parity metrics. */
export function sampleCanvasGlassMetrics(canvas) {
  if (!canvas) return null;
  const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!ctx) return null;

  const w = canvas.width;
  const h = canvas.height;
  const pixels = new Uint8Array(w * h * 4);
  ctx.readPixels(0, 0, w, h, ctx.RGBA, ctx.UNSIGNED_BYTE, pixels);

  let teal = 0;
  let bright = 0;
  let maxG = 0;
  let maxRGB = [0, 0, 0];
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  const n = w * h;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    sumR += r;
    sumG += g;
    sumB += b;
    if (g > maxG) {
      maxG = g;
      maxRGB = [r, g, b];
    }
    if (g > 70 && g > r * 1.05 && g > b * 1.05) teal += 1;
    if (g > 120) bright += 1;
  }

  return {
    w,
    h,
    tealPct: Number(((teal / n) * 100).toFixed(1)),
    brightPct: Number(((bright / n) * 100).toFixed(1)),
    maxG,
    maxRGB,
    avgRGB: [
      Math.round(sumR / n),
      Math.round(sumG / n),
      Math.round(sumB / n),
    ],
  };
}
