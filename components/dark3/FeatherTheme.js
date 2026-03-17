"use client";
import { useRef, useEffect } from "react";

export default function FeatherCanvas({ theme }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const isDark = theme === "dark";

    // Deterministic variation per petal
    const vary = (i, seed) => Math.sin(i * 91.3 + seed * 47.7) * 0.5 + 0.5;

    const drawFeather = (cx, cy, angle, length, maxWidth, petalIndex, time) => {
      // --- LAYER 1: Wide soft glow body ---
      const bodyWidth = maxWidth * (0.9 + vary(petalIndex, 2) * 0.2);
      const perp = angle + Math.PI / 2;
      const px = Math.cos(perp);
      const py = Math.sin(perp);

      // Tip
      const tipX = cx + Math.cos(angle) * length;
      const tipY = cy + Math.sin(angle) * length;

      // Mid-point bulge for feather body shape
      const midDist = length * 0.45;
      const midX = cx + Math.cos(angle) * midDist;
      const midY = cy + Math.sin(angle) * midDist;

      // Left and right edges at widest point
      const lx = midX + px * bodyWidth;
      const ly = midY + py * bodyWidth;
      const rx = midX - px * bodyWidth;
      const ry = midY - py * bodyWidth;

      // Soft glow body path
      const bodyGrad = ctx.createLinearGradient(cx, cy, tipX, tipY);
      if (isDark) {
        // Deep blue-teal core with transparent edges
        bodyGrad.addColorStop(0,    "hsla(210, 70%, 12%, 0)");
        bodyGrad.addColorStop(0.05, "hsla(210, 65%, 22%, 0.6)");
        bodyGrad.addColorStop(0.3,  "hsla(205, 60%, 30%, 0.45)");
        bodyGrad.addColorStop(0.65, "hsla(200, 55%, 22%, 0.25)");
        bodyGrad.addColorStop(1,    "hsla(200, 50%, 12%, 0)");
      } else {
        bodyGrad.addColorStop(0,    "hsla(155, 50%, 8%, 0)");
        bodyGrad.addColorStop(0.05, "hsla(155, 45%, 15%, 0.3)");
        bodyGrad.addColorStop(0.4,  "hsla(155, 40%, 20%, 0.18)");
        bodyGrad.addColorStop(1,    "hsla(155, 35%, 10%, 0)");
      }

      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = isDark ? 0.9 : 0.5;
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(lx, ly, tipX, tipY);
      ctx.quadraticCurveTo(rx, ry, cx, cy);
      ctx.closePath();
      ctx.fill();

      // --- LAYER 2: Bright central spine ---
      const spineWidth = 1.5 + vary(petalIndex, 3) * 2;
      const spineGrad = ctx.createLinearGradient(cx, cy, tipX, tipY);
      if (isDark) {
        spineGrad.addColorStop(0,    "hsla(200, 80%, 70%, 0)");
        spineGrad.addColorStop(0.06, "hsla(200, 80%, 80%, 0.9)");
        spineGrad.addColorStop(0.4,  "hsla(205, 75%, 65%, 0.7)");
        spineGrad.addColorStop(0.75, "hsla(210, 70%, 50%, 0.3)");
        spineGrad.addColorStop(1,    "hsla(215, 60%, 30%, 0)");
      } else {
        spineGrad.addColorStop(0,    "hsla(160, 60%, 25%, 0)");
        spineGrad.addColorStop(0.08, "hsla(160, 55%, 35%, 0.5)");
        spineGrad.addColorStop(0.5,  "hsla(160, 50%, 28%, 0.3)");
        spineGrad.addColorStop(1,    "hsla(160, 45%, 15%, 0)");
      }

      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = isDark ? 0.85 : 0.45;
      ctx.strokeStyle = spineGrad;
      ctx.lineWidth = spineWidth;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      // Slight organic S-curve on the spine
      const sCurve = (vary(petalIndex, 6) - 0.5) * bodyWidth * 0.3;
      const scx1 = cx + Math.cos(angle) * length * 0.25 + px * sCurve;
      const scy1 = cy + Math.sin(angle) * length * 0.25 + py * sCurve;
      const scx2 = cx + Math.cos(angle) * length * 0.6 - px * sCurve * 0.5;
      const scy2 = cy + Math.sin(angle) * length * 0.6 - py * sCurve * 0.5;
      ctx.bezierCurveTo(scx1, scy1, scx2, scy2, tipX, tipY);
      ctx.stroke();

      // --- LAYER 3: Edge highlight (left side brighter) ---
      const edgeGrad = ctx.createLinearGradient(cx, cy, tipX, tipY);
      if (isDark) {
        edgeGrad.addColorStop(0,   "hsla(195, 90%, 75%, 0)");
        edgeGrad.addColorStop(0.1, "hsla(195, 85%, 80%, 0.45)");
        edgeGrad.addColorStop(0.5, "hsla(200, 80%, 65%, 0.2)");
        edgeGrad.addColorStop(1,   "hsla(205, 70%, 40%, 0)");
      } else {
        edgeGrad.addColorStop(0,   "hsla(160, 50%, 20%, 0)");
        edgeGrad.addColorStop(0.1, "hsla(160, 45%, 28%, 0.2)");
        edgeGrad.addColorStop(1,   "hsla(160, 40%, 12%, 0)");
      }

      const edgeOffset = bodyWidth * 0.55;
      ctx.globalAlpha = isDark ? 0.6 : 0.3;
      ctx.strokeStyle = edgeGrad;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(
        midX + px * edgeOffset,
        midY + py * edgeOffset,
        tipX, tipY
      );
      ctx.stroke();
    };

    const draw = (time) => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      const cx = W * 0.5;
      const cy = H * 0.7;

      const COUNT = 22;
      const spreadRad = (155 * Math.PI) / 180;
      const startAngle = -Math.PI / 2 - spreadRad / 2;
      const baseLen = Math.min(W * 0.48, H * 0.68);
      const baseWidth = baseLen * 0.09;

      for (let i = 0; i < COUNT; i++) {
        const t = i / (COUNT - 1);
        // Slight natural angle drift per feather
        const angleDrift = (Math.sin(i * 73.1) * 0.5 + 0.5 - 0.5) * 0.035;
        const slowSway = Math.sin(time * 0.00025 + i * 0.6) * 0.006;
        const angle = startAngle + t * spreadRad + angleDrift + slowSway;

        // Center feathers longer and wider
        const centerBoost = 1 - Math.pow(Math.abs(t - 0.5) * 2, 2) * 0.28;
        const len = baseLen * centerBoost * (0.88 + (Math.sin(i * 31.7) * 0.5 + 0.5) * 0.15);
        const width = baseWidth * centerBoost * (0.7 + (Math.sin(i * 53.1) * 0.5 + 0.5) * 0.5);

        drawFeather(cx, cy, angle, len, width, i, time);
      }

      // Atmospheric glow at base — teal hint, very soft
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      const pulse = 1 + Math.sin(time * 0.0008) * 0.06;
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120 * pulse);
      if (isDark) {
        gr.addColorStop(0,   "rgba(60, 160, 140, 0.22)");
        gr.addColorStop(0.3, "rgba(20,  80,  70, 0.1)");
        gr.addColorStop(1,   "rgba(1,   56,  37, 0)");
      } else {
        gr.addColorStop(0,   "rgba(1, 56, 37, 0.1)");
        gr.addColorStop(1,   "rgba(1, 56, 37, 0)");
      }
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, cy, 120 * pulse, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (time) => {
      draw(time);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      ro.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 2,
        opacity: theme === "dark" ? 0.72 : 0.38,
        mixBlendMode: "screen",
      }}
    />
  );
}
