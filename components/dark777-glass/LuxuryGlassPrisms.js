"use client";

import { useLayoutEffect, useRef } from "react";

const BASE_RIPPLE = 100;

function biasedSpawnX(width) {
  if (Math.random() < 0.78) return width * (0.48 + Math.random() * 0.5);
  return width * (0.02 + Math.random() * 0.42);
}

function createPrism(width, height) {
  const size = 8 + Math.random() * 14;
  return {
    x: biasedSpawnX(width),
    y: height * (0.05 + Math.random() * 0.9),
    vx: 0,
    vy: 0,
    size,
    phase: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI,
    sway: 0.06 + Math.random() * 0.12,
    opacity: 0.62 + Math.random() * 0.38,
    shimmerPhase: Math.random() * Math.PI * 2,
  };
}

function buildPrisms(width, height) {
  const count = Math.min(36, Math.max(18, Math.round((width * height) / 28000)));
  return Array.from({ length: count }, () => createPrism(width, height));
}

function scalePrisms(prisms, sx, sy) {
  for (const p of prisms) {
    p.x *= sx;
    p.y *= sy;
    p.vx = 0;
    p.vy = 0;
  }
}

function drawGlassPrism(ctx, x, y, size, rotation, intensity, specular) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  const w = size;
  const h = size * 1.45;

  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.lineTo(w / 2, 0);
  ctx.lineTo(0, h / 2);
  ctx.lineTo(-w / 2, 0);
  ctx.closePath();

  if (specular) {
    ctx.shadowColor = "rgba(255, 248, 230, 0.55)";
    ctx.shadowBlur = size * 1.2;
  }

  const grad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  grad.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.5})`);
  grad.addColorStop(0.3, `rgba(235, 228, 210, ${intensity * 0.28})`);
  grad.addColorStop(0.55, `rgba(212, 175, 95, ${intensity * 0.32})`);
  grad.addColorStop(1, `rgba(168, 132, 47, ${intensity * 0.18})`);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.75})`;
  ctx.lineWidth = 1;
  ctx.stroke();

  if (specular) {
    ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.65})`;
    ctx.beginPath();
    ctx.moveTo(-w * 0.08, -h * 0.32);
    ctx.lineTo(w * 0.12, -h * 0.18);
    ctx.lineTo(w * 0.02, -h * 0.08);
    ctx.lineTo(-w * 0.18, -h * 0.22);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function clampParticle(p, width, height) {
  const m = p.size + 8;
  if (p.x < m) { p.x = m; p.vx = Math.abs(p.vx) * 0.5; }
  else if (p.x > width - m) { p.x = width - m; p.vx = -Math.abs(p.vx) * 0.5; }
  if (p.y < m) { p.y = m; p.vy = Math.abs(p.vy) * 0.5; }
  else if (p.y > height - m) { p.y = height - m; p.vy = -Math.abs(p.vy) * 0.5; }
}

function updatePrism(p, state, time, width, height) {
  const { mousePx, mousePy, mouseActive, scrollShimmer } = state;

  if (!mouseActive) {
    p.x += Math.cos(time * p.sway + p.phase) * 0.018;
    p.y += Math.sin(time * p.sway * 0.85 + p.phase) * 0.018;
  } else {
    const dx = p.x - mousePx;
    const dy = p.y - mousePy;
    const dist = Math.max(Math.hypot(dx, dy), 0.001);
    const rippleR = BASE_RIPPLE + p.size * 2;
    if (dist < rippleR) {
      const nx = dx / dist;
      const ny = dy / dist;
      const wave = (1 - dist / rippleR) ** 1.7;
      const kick = 5 + wave * 36;
      p.vx += nx * kick;
      p.vy += ny * kick;
    }
  }

  const speed = Math.hypot(p.vx, p.vy);
  const maxV = 16;
  if (speed > maxV) {
    p.vx = (p.vx / speed) * maxV;
    p.vy = (p.vy / speed) * maxV;
  }

  p.x += p.vx;
  p.y += p.vy;
  p.vx *= 0.87;
  p.vy *= 0.87;
  clampParticle(p, width, height);

  const twinkle =
    0.8 +
    scrollShimmer * 0.15 +
    Math.sin(time * 1.6 + p.shimmerPhase) * 0.12;
  const intensity = Math.min(1, p.opacity * twinkle);

  return {
    drawX: p.x,
    drawY: p.y,
    spin: p.rotation + time * 0.06 + p.vx * 0.025,
    intensity,
    specular: p.size > 10,
  };
}

export default function LuxuryGlassPrisms({ className = "" }) {
  const layerRef = useRef(null);
  const canvasRef = useRef(null);
  const prismsRef = useRef([]);
  const stateRef = useRef({
    scrollShimmer: 0.55,
    mouseClientX: -9999,
    mouseClientY: -9999,
    mousePx: -9999,
    mousePy: -9999,
    mouseActive: false,
    time: 0,
    running: true,
    visible: true,
  });
  const rafRef = useRef(null);
  const bootRafRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const dprRef = useRef(1);

  useLayoutEffect(() => {
    stateRef.current.running = true;
    let disposed = false;
    let ctx = null;
    let ro = null;
    let started = false;
    let resizeTimer = 0;

    const onPointerMove = (e) => {
      stateRef.current.mouseClientX = e.clientX;
      stateRef.current.mouseClientY = e.clientY;
    };

    const onScroll = () => {
      const container = layerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = 1 - Math.min(1, Math.max(0, rect.bottom / vh));
      stateRef.current.scrollShimmer = 0.5 + progress * 0.35;
    };

    const resize = (rebuild = false) => {
      const container = layerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return false;
      const rect = container.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) return false;

      const prev = sizeRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      if (rebuild || prismsRef.current.length === 0 || prev.w < 20) {
        prismsRef.current = buildPrisms(rect.width, rect.height);
      } else if (prev.w !== rect.width || prev.h !== rect.height) {
        scalePrisms(prismsRef.current, rect.width / prev.w, rect.height / prev.h);
      }
      sizeRef.current = { w: rect.width, h: rect.height };
      return true;
    };

    const syncMouse = () => {
      const container = layerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const s = stateRef.current;
      const x = s.mouseClientX - rect.left;
      const y = s.mouseClientY - rect.top;
      s.mousePx = x;
      s.mousePy = y;
      s.mouseActive =
        s.mouseClientX > -500 &&
        x >= -80 && x <= rect.width + 80 &&
        y >= -80 && y <= rect.height + 80;
    };

    const tick = (t) => {
      rafRef.current = null;
      if (!stateRef.current.running || !ctx || !stateRef.current.visible) {
        if (stateRef.current.running && stateRef.current.visible) {
          rafRef.current = requestAnimationFrame(tick);
        }
        return;
      }

      stateRef.current.time = t * 0.001;
      syncMouse();

      const { w, h } = sizeRef.current;
      const canvasEl = canvasRef.current;
      const prisms = prismsRef.current;
      if (w > 0 && h > 0 && canvasEl && prisms.length > 0) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);

        const time = stateRef.current.time;
        for (const prism of prisms) {
          const { drawX, drawY, spin, intensity, specular } = updatePrism(
            prism,
            stateRef.current,
            time,
            w,
            h,
          );
          drawGlassPrism(ctx, drawX, drawY, prism.size, spin, intensity, specular);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (started) return true;
      const canvas = canvasRef.current;
      if (!canvas || !layerRef.current || disposed) return false;
      ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
      if (!ctx || !resize(true)) return false;

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      ro = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => resize(false), 120);
      });
      ro.observe(layerRef.current);
      rafRef.current = requestAnimationFrame(tick);
      started = true;
      return true;
    };

    const boot = () => {
      if (disposed) return;
      if (!start()) bootRafRef.current = requestAnimationFrame(boot);
    };
    boot();

    return () => {
      disposed = true;
      stateRef.current.running = false;
      clearTimeout(resizeTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (bootRafRef.current) cancelAnimationFrame(bootRafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      ro?.disconnect();
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className={`glass-prisms-layer pointer-events-none absolute inset-0 z-[7] ${className}`}
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
