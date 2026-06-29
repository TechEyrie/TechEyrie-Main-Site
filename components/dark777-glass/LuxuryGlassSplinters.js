"use client";

import { useLayoutEffect, useRef } from "react";

const BASE_RIPPLE = 130;

function biasedSpawnX(width) {
  if (Math.random() < 0.72) return width * (0.5 + Math.random() * 0.48);
  return width * (0.02 + Math.random() * 0.4);
}

function createSplinter(width, height) {
  const length = 18 + Math.random() * 32;
  return {
    x: biasedSpawnX(width),
    y: height * (0.04 + Math.random() * 0.92),
    vx: 0,
    vy: 0,
    length,
    width: 2 + Math.random() * 3.5,
    phase: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    sway: 0.05 + Math.random() * 0.1,
    opacity: 0.45 + Math.random() * 0.45,
    specularOffset: Math.random(),
    shimmerPhase: Math.random() * Math.PI * 2,
  };
}

function buildSplinters(width, height) {
  const count = Math.min(40, Math.max(20, Math.round((width * height) / 26000)));
  return Array.from({ length: count }, () => createSplinter(width, height));
}

function scaleSplinters(splinters, sx, sy) {
  for (const s of splinters) {
    s.x *= sx;
    s.y *= sy;
    s.vx = 0;
    s.vy = 0;
  }
}

function drawSplinter(ctx, x, y, length, width, rotation, intensity, specularT) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  const halfL = length / 2;

  const body = ctx.createLinearGradient(0, -halfL, 0, halfL);
  body.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.15})`);
  body.addColorStop(0.25, `rgba(220, 240, 255, ${intensity * 0.35})`);
  body.addColorStop(0.5, `rgba(212, 175, 95, ${intensity * 0.55})`);
  body.addColorStop(0.75, `rgba(0, 120, 140, ${intensity * 0.3})`);
  body.addColorStop(1, `rgba(255, 255, 255, ${intensity * 0.12})`);

  ctx.beginPath();
  ctx.rect(-width / 2, -halfL, width, length);
  ctx.fillStyle = body;
  ctx.fill();

  ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.65})`;
  ctx.lineWidth = 0.8;
  ctx.stroke();

  const sweepPos = (specularT % 1) * length - halfL;
  const sweepGrad = ctx.createLinearGradient(0, sweepPos - 8, 0, sweepPos + 8);
  sweepGrad.addColorStop(0, "rgba(255,255,255,0)");
  sweepGrad.addColorStop(0.5, `rgba(255,255,255,${intensity * 0.85})`);
  sweepGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sweepGrad;
  ctx.fillRect(-width, sweepPos - 10, width * 2, 20);

  ctx.restore();
}

function clampSplinter(s, w, h) {
  const m = s.length * 0.5 + 6;
  if (s.x < m) { s.x = m; s.vx = Math.abs(s.vx) * 0.5; }
  else if (s.x > w - m) { s.x = w - m; s.vx = -Math.abs(s.vx) * 0.5; }
  if (s.y < m) { s.y = m; s.vy = Math.abs(s.vy) * 0.5; }
  else if (s.y > h - m) { s.y = h - m; s.vy = -Math.abs(s.vy) * 0.5; }
}

function updateSplinter(s, state, time, width, height) {
  const { mousePx, mousePy, mouseActive, scrollShimmer } = state;

  if (!mouseActive) {
    s.x += Math.cos(time * s.sway + s.phase) * 0.015;
    s.y += Math.sin(time * s.sway * 0.8 + s.phase) * 0.015;
    s.rotation += Math.sin(time * 0.4 + s.phase) * 0.002;
  } else {
    const dx = s.x - mousePx;
    const dy = s.y - mousePy;
    const dist = Math.max(Math.hypot(dx, dy), 0.001);
    const rippleR = BASE_RIPPLE + s.length * 0.35;

    if (dist < rippleR) {
      const nx = dx / dist;
      const ny = dy / dist;
      const wave = (1 - dist / rippleR) ** 1.6;
      const kick = 4 + wave * 32;
      s.vx += nx * kick;
      s.vy += ny * kick;

      // Light-bend: subtle perpendicular drift near cursor
      const bend = wave * 6;
      s.vx += -ny * bend * 0.35;
      s.vy += nx * bend * 0.35;
      s.rotation += wave * 0.04;
    }
  }

  const speed = Math.hypot(s.vx, s.vy);
  const maxV = 14;
  if (speed > maxV) {
    s.vx = (s.vx / speed) * maxV;
    s.vy = (s.vy / speed) * maxV;
  }

  s.x += s.vx;
  s.y += s.vy;
  s.vx *= 0.88;
  s.vy *= 0.88;
  clampSplinter(s, width, height);

  const twinkle =
    0.75 +
    scrollShimmer * 0.2 +
    Math.sin(time * 2 + s.shimmerPhase) * 0.1;
  const intensity = Math.min(1, s.opacity * twinkle);
  const specularT = s.specularOffset + time * 0.35 + scrollShimmer * 0.8;

  return { drawX: s.x, drawY: s.y, intensity, specularT };
}

export default function LuxuryGlassSplinters({ className = "" }) {
  const layerRef = useRef(null);
  const canvasRef = useRef(null);
  const splintersRef = useRef([]);
  const stateRef = useRef({
    scrollShimmer: 0.5,
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
      stateRef.current.scrollShimmer = 0.45 + progress * 0.45;
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

      if (rebuild || splintersRef.current.length === 0 || prev.w < 20) {
        splintersRef.current = buildSplinters(rect.width, rect.height);
      } else if (prev.w !== rect.width || prev.h !== rect.height) {
        scaleSplinters(splintersRef.current, rect.width / prev.w, rect.height / prev.h);
      }
      sizeRef.current = { w: rect.width, h: rect.height };
      return true;
    };

    const syncMouse = () => {
      const container = layerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const s = stateRef.current;
      s.mousePx = s.mouseClientX - rect.left;
      s.mousePy = s.mouseClientY - rect.top;
      s.mouseActive =
        s.mouseClientX > -500 &&
        s.mousePx >= -100 && s.mousePx <= rect.width + 100 &&
        s.mousePy >= -100 && s.mousePy <= rect.height + 100;
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
      const splinters = splintersRef.current;
      if (w > 0 && h > 0 && canvasEl && splinters.length > 0) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);

        const time = stateRef.current.time;
        for (const splinter of splinters) {
          const { drawX, drawY, intensity, specularT } = updateSplinter(
            splinter,
            stateRef.current,
            time,
            w,
            h,
          );
          drawSplinter(
            ctx,
            drawX,
            drawY,
            splinter.length,
            splinter.width,
            splinter.rotation,
            intensity,
            specularT,
          );
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
      className={`glass-splinters-layer pointer-events-none absolute inset-0 z-[7] ${className}`}
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
