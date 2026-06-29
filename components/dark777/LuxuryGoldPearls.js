"use client";

import { useLayoutEffect, useRef } from "react";

const BASE_RIPPLE = 110;

function biasedSpawnX(width) {
  // ~78% of cubes on the right half, clustered toward the right edge
  if (Math.random() < 0.78) {
    return width * (0.48 + Math.random() * 0.5);
  }
  return width * (0.02 + Math.random() * 0.42);
}

function createPearl(width, height) {
  const size = 7 + Math.random() * 11;
  return {
    x: biasedSpawnX(width),
    y: height * (0.05 + Math.random() * 0.9),
    vx: 0,
    vy: 0,
    size,
    phase: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI,
    sway: 0.08 + Math.random() * 0.14,
    opacity: 0.72 + Math.random() * 0.28,
    shimmerPhase: Math.random() * Math.PI * 2,
  };
}

function buildPearls(width, height) {
  const count = Math.min(44, Math.max(22, Math.round((width * height) / 24000)));
  const pearls = new Array(count);
  for (let i = 0; i < count; i++) pearls[i] = createPearl(width, height);
  return pearls;
}

function scalePearls(pearls, sx, sy) {
  for (let i = 0; i < pearls.length; i++) {
    pearls[i].x *= sx;
    pearls[i].y *= sy;
    pearls[i].vx = 0;
    pearls[i].vy = 0;
  }
}

function drawCube(ctx, x, y, half, rotation, intensity, glow) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  if (glow) {
    ctx.shadowColor = "rgba(255, 200, 80, 0.85)";
    ctx.shadowBlur = half * 2;
  }

  const face = ctx.createLinearGradient(-half, -half, half, half);
  face.addColorStop(0, `rgba(255, 252, 235, ${intensity})`);
  face.addColorStop(0.5, `rgba(245, 205, 95, ${intensity})`);
  face.addColorStop(1, `rgba(180, 135, 45, ${intensity * 0.72})`);

  ctx.fillStyle = face;
  ctx.fillRect(-half, -half, half * 2, half * 2);

  ctx.shadowBlur = 0;
  ctx.strokeStyle = `rgba(255, 248, 220, ${intensity * 0.85})`;
  ctx.lineWidth = 1;
  ctx.strokeRect(-half, -half, half * 2, half * 2);

  const shine = Math.max(2.5, half * 0.28);
  ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.92})`;
  ctx.fillRect(-half + 1.5, -half + 1.5, shine, shine);

  ctx.restore();
}

function clampPearl(pearl, width, height) {
  const m = pearl.size + 6;
  if (pearl.x < m) {
    pearl.x = m;
    pearl.vx = Math.abs(pearl.vx) * 0.5;
  } else if (pearl.x > width - m) {
    pearl.x = width - m;
    pearl.vx = -Math.abs(pearl.vx) * 0.5;
  }
  if (pearl.y < m) {
    pearl.y = m;
    pearl.vy = Math.abs(pearl.vy) * 0.5;
  } else if (pearl.y > height - m) {
    pearl.y = height - m;
    pearl.vy = -Math.abs(pearl.vy) * 0.5;
  }
}

/** Strip any velocity component that points toward the cursor */
function blockAttraction(pearl, mousePx, mousePy) {
  const toMouseX = mousePx - pearl.x;
  const toMouseY = mousePy - pearl.y;
  const distSq = toMouseX * toMouseX + toMouseY * toMouseY;
  if (distSq < 1) return;

  const dot = pearl.vx * toMouseX + pearl.vy * toMouseY;
  if (dot > 0) {
    const inv = dot / distSq;
    pearl.vx -= toMouseX * inv;
    pearl.vy -= toMouseY * inv;
  }
}

function updatePearl(pearl, state, time, width, height) {
  const { mousePx, mousePy, mouseActive, mouseSpeed, scrollShimmer } = state;

  if (!mouseActive) {
    pearl.x += Math.cos(time * pearl.sway + pearl.phase) * 0.02;
    pearl.y += Math.sin(time * pearl.sway * 0.9 + pearl.phase) * 0.02;
  } else {
    const dx = pearl.x - mousePx;
    const dy = pearl.y - mousePy;
    const distSq = dx * dx + dy * dy;
    const rippleR = BASE_RIPPLE + pearl.size * 2 + Math.min(mouseSpeed * 0.85, 90);
    const rSq = rippleR * rippleR;

    if (distSq < rSq) {
      const dist = Math.max(Math.sqrt(distSq), 0.001);
      const nx = dx / dist;
      const ny = dy / dist;
      const wave = (1 - dist / rippleR) ** 1.8;

      // Pure repulsion only — flee away from cursor, never toward it
      const kick = 6 + wave * 42;
      pearl.vx += nx * kick;
      pearl.vy += ny * kick;

      // Hard shove when cursor gets too close (prevents sticking)
      if (dist < 48) {
        const shove = ((48 - dist) / 48) * 28;
        pearl.vx += nx * shove;
        pearl.vy += ny * shove;
      }

      blockAttraction(pearl, mousePx, mousePy);
    }
  }

  const maxV = 18;
  let speed = Math.hypot(pearl.vx, pearl.vy);
  if (speed > maxV) {
    pearl.vx = (pearl.vx / speed) * maxV;
    pearl.vy = (pearl.vy / speed) * maxV;
    speed = maxV;
  }

  pearl.x += pearl.vx;
  pearl.y += pearl.vy;
  pearl.vx *= 0.86;
  pearl.vy *= 0.86;

  if (mouseActive) blockAttraction(pearl, mousePx, mousePy);

  clampPearl(pearl, width, height);

  const twinkle =
    0.84 +
    scrollShimmer * 0.12 +
    Math.sin(time * 1.8 + pearl.shimmerPhase) * 0.1;
  const intensity = Math.min(1, pearl.opacity * twinkle);
  const half = pearl.size * 0.88;
  const spin = pearl.rotation + time * 0.09 + pearl.vx * 0.03;

  return {
    drawX: pearl.x,
    drawY: pearl.y,
    half,
    spin,
    intensity,
    glow: half > 9,
  };
}

export default function LuxuryGoldPearls({ className = "" }) {
  const layerRef = useRef(null);
  const canvasRef = useRef(null);
  const pearlsRef = useRef([]);
  const stateRef = useRef({
    scrollShimmer: 0.55,
    mouseClientX: -9999,
    mouseClientY: -9999,
    mousePx: -9999,
    mousePy: -9999,
    prevMousePx: -9999,
    prevMousePy: -9999,
    mouseSpeed: 0,
    mouseActive: false,
    time: 0,
    running: true,
    visible: true,
  });
  const rafRef = useRef(null);
  const bootRafRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const dprRef = useRef(1);
  const reducedMotionRef = useRef(false);

  useLayoutEffect(() => {
    stateRef.current.running = true;
    let disposed = false;
    let ctx = null;
    let ro = null;
    let started = false;
    let resizeTimer = 0;

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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

    const onVisibility = () => {
      stateRef.current.visible = document.visibilityState === "visible";
      if (stateRef.current.visible && started && !rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
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

      if (
        rebuild ||
        pearlsRef.current.length === 0 ||
        prev.w < 20 ||
        prev.h < 20
      ) {
        pearlsRef.current = buildPearls(rect.width, rect.height);
      } else if (prev.w !== rect.width || prev.h !== rect.height) {
        scalePearls(
          pearlsRef.current,
          rect.width / prev.w,
          rect.height / prev.h,
        );
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
      const pad = 120;

      s.mouseSpeed = Math.hypot(x - s.prevMousePx, y - s.prevMousePy);
      s.prevMousePx = x;
      s.prevMousePy = y;
      s.mousePx = x;
      s.mousePy = y;
      s.mouseActive =
        s.mouseClientX > -500 &&
        x >= -pad &&
        x <= rect.width + pad &&
        y >= -pad &&
        y <= rect.height + pad;
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
      const pearls = pearlsRef.current;
      const reduced = reducedMotionRef.current;

      if (w > 0 && h > 0 && canvasEl && pearls.length > 0) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);

        const state = stateRef.current;
        const time = reduced ? 0 : state.time;

        for (let i = 0; i < pearls.length; i++) {
          const pearl = pearls[i];
          const { drawX, drawY, half, spin, intensity, glow } = updatePearl(
            pearl,
            state,
            time,
            w,
            h,
          );
          drawCube(
            ctx,
            drawX,
            drawY,
            half,
            reduced ? pearl.rotation : spin,
            intensity,
            glow,
          );
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (started) return true;
      const canvas = canvasRef.current;
      const container = layerRef.current;
      if (!canvas || !container || disposed) return false;

      ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
      if (!ctx) return false;

      if (!resize(true)) return false;

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      onScroll();

      ro = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => resize(false), 120);
      });
      ro.observe(container);

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
      document.removeEventListener("visibilitychange", onVisibility);
      ro?.disconnect();
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className={`dark777-gold-pearls-layer pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="dark777-gold-pearls-canvas block h-full w-full"
      />
    </div>
  );
}
