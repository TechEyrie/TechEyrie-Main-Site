"use client";

import { useEffect, useRef, useCallback } from "react";

export default function CursorRevealStar() {
  const canvasRef    = useRef(null);
  const targetMouse  = useRef({ x: -9999, y: -9999 });
  const smoothMouse  = useRef({ x: -9999, y: -9999 });
  const velocity     = useRef({ x: 0, y: 0 });
  const prevSmooth   = useRef({ x: -9999, y: -9999 });
  const trail        = useRef([]); // array of { x, y, age }
  const rafRef       = useRef(null);
  const resizeTimer  = useRef(null);
  const frameRef     = useRef(0);

  const TRAIL_LENGTH = 28; // how many past positions to keep

  const buildPaths = useCallback((W, H) => {
    const cx    = W / 2;
    const cy    = H / 2;
    const R     = Math.min(W, H) * 0.88;
    const r     = Math.min(W, H) * 0.18;
    const arms  = 6;
    const paths = [];

    for (let i = 0; i < arms; i++) {
      const angle = (i / arms) * Math.PI * 2 - Math.PI / 2;
      const perp  = angle + Math.PI / 2;
      const ox    = cx + Math.cos(angle) * R;
      const oy    = cy + Math.sin(angle) * R;
      const ix    = cx + Math.cos(angle) * r;
      const iy    = cy + Math.sin(angle) * r;
      const bulge = R * 0.32;
      const midX  = cx + Math.cos(angle) * R * 0.50;
      const midY  = cy + Math.sin(angle) * R * 0.50;

      const lineCount = 12;
      const maxSpread = R * 0.13;

      for (let l = 0; l < lineCount; l++) {
        const frac      = (l / (lineCount - 1)) * 2 - 1;
        const spread    = frac * maxSpread;
        const tipSpread = spread * 0.06;
        const baseSpr   = spread * 1.0;
        const midSpr    = spread * 0.52;

        const startX = ix + Math.cos(perp) * baseSpr;
        const startY = iy + Math.sin(perp) * baseSpr;
        const endX   = ox + Math.cos(perp) * tipSpread;
        const endY   = oy + Math.sin(perp) * tipSpread;

        const cp1x = midX + Math.cos(perp) * (midSpr + bulge * 0.45 * frac);
        const cp1y = midY + Math.sin(perp) * (midSpr + bulge * 0.45 * frac);
        const cp2x = midX + Math.cos(perp) * (midSpr - bulge * 0.28 * frac);
        const cp2y = midY + Math.sin(perp) * (midSpr - bulge * 0.28 * frac);

        const isSpine = l === Math.floor(lineCount / 2) || l === Math.ceil(lineCount / 2);
        const weight  = 1 - Math.abs(frac) * 0.4;

        paths.push({
          points: sampleCubic(startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY, 220),
          isSpine,
          weight,
        });
      }
    }
    return paths;
  }, []);

  function sampleCubic(x0, y0, cx1, cy1, cx2, cy2, x1, y1, n) {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t  = i / n;
      const mt = 1 - t;
      pts.push({
        x: mt*mt*mt*x0 + 3*mt*mt*t*cx1 + 3*mt*t*t*cx2 + t*t*t*x1,
        y: mt*mt*mt*y0 + 3*mt*mt*t*cy1 + 3*mt*t*t*cy2 + t*t*t*y1,
      });
    }
    return pts;
  }

  const draw = useCallback((ctx, W, H, paths, mx, my, vx, vy, trailPts, frame) => {
    ctx.clearRect(0, 0, W, H);

    const minDim        = Math.min(W, H);
    const REVEAL_RADIUS = minDim * 0.46;
    const GLOW_RADIUS   = minDim * 0.24;
    const pulse         = 0.92 + Math.sin(frame * 0.010) * 0.08;

    // Speed magnitude — used to scale directional bias
    const speed    = Math.sqrt(vx * vx + vy * vy);
    const hasSpeed = speed > 0.8;

    // Normalised velocity direction
    const normVx = hasSpeed ? vx / speed : 0;
    const normVy = hasSpeed ? vy / speed : 0;

    // How strongly direction matters — ramps up with speed, caps at 1
    const dirBias = Math.min(speed / 14, 1.0);

    for (const path of paths) {
      const { points: pts, isSpine, weight } = path;
      if (pts.length < 2) continue;

      for (let i = 0; i < pts.length - 1; i++) {
        const p    = pts[i];
        const nx   = pts[i + 1];

        // ── Trail pass: check each historical position ──
        let trailAlpha = 0;
        let trailGlow  = 0;

        for (let t = 0; t < trailPts.length; t++) {
          const tp      = trailPts[t];
          const tAge    = t / trailPts.length;        // 0 = newest, 1 = oldest
          const tDist   = Math.hypot(p.x - tp.x, p.y - tp.y);
          const tRadius = REVEAL_RADIUS * (1 - tAge * 0.55); // trail fades smaller

          if (tDist > tRadius) continue;

          const tT    = 1 - tDist / tRadius;
          const tFade = (1 - tAge) * (1 - tAge); // quadratic fade along trail
          const tA    = ((1 - Math.cos(tT * Math.PI)) / 2) * tFade * weight * pulse;

          trailAlpha = Math.max(trailAlpha, tA);
          if (tDist < GLOW_RADIUS * (1 - tAge * 0.4)) {
            const gT = 1 - tDist / (GLOW_RADIUS * (1 - tAge * 0.4));
            trailGlow = Math.max(trailGlow, ((1 - Math.cos(gT * Math.PI)) / 2) * tFade * weight * pulse);
          }
        }

        // ── Current cursor pass ──
        const dist = Math.hypot(p.x - mx, p.y - my);
        let curAlpha = 0;
        let curGlow  = 0;

        if (dist < REVEAL_RADIUS) {
          const rawT = 1 - dist / REVEAL_RADIUS;
          let   cosA = (1 - Math.cos(rawT * Math.PI)) / 2;

          // Directional bias: dot product of (segment→cursor) with velocity
          if (hasSpeed && dirBias > 0.05) {
            const toCursorX = mx - p.x;
            const toCursorY = my - p.y;
            const toDist    = Math.sqrt(toCursorX * toCursorX + toCursorY * toCursorY) || 1;
            // Dot of segment-to-cursor direction with movement direction
            const dot = (toCursorX / toDist) * normVx + (toCursorY / toDist) * normVy;
            // dot: 1 = segment is ahead of cursor (in direction of travel) → boost
            //      -1 = segment is behind cursor → suppress
            const dirFactor = 0.3 + 0.7 * Math.max(0, (dot + 1) / 2);
            cosA *= (1 - dirBias) + dirBias * dirFactor;
          }

          curAlpha = cosA * weight * pulse;
          if (dist < GLOW_RADIUS) {
            const gT = 1 - dist / GLOW_RADIUS;
            curGlow  = ((1 - Math.cos(gT * Math.PI)) / 2) * weight * pulse;
          }
        }

        const finalAlpha = Math.max(trailAlpha, curAlpha);
        const finalGlow  = Math.max(trailGlow,  curGlow);

        if (finalAlpha < 0.005) continue;

        // Glow halo — tight, hugs line
        if (finalGlow > 0.01) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(nx.x, nx.y);
          ctx.strokeStyle = `rgba(150, 85, 255, ${finalGlow * 0.60})`;
          ctx.lineWidth   = isSpine ? 5 : 3.5;
          ctx.lineCap     = "round";
          ctx.stroke();
        }

        // Core line
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx.x, nx.y);
        ctx.strokeStyle = `rgba(230, 200, 255, ${finalAlpha * 0.95})`;
        ctx.lineWidth   = isSpine ? 1.8 : 1.0;
        ctx.lineCap     = "round";
        ctx.stroke();
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, paths;

    const setup = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      paths = buildPaths(W, H);
    };

    const tick = () => {
      frameRef.current += 1;

      const sm = smoothMouse.current;
      const tm = targetMouse.current;
      const ps = prevSmooth.current;

      if (tm.x < 0) {
        sm.x += (-9999 - sm.x) * 0.04;
        sm.y += (-9999 - sm.y) * 0.04;
        velocity.current = { x: 0, y: 0 };
        trail.current = [];
      } else {
        const prevX = sm.x;
        const prevY = sm.y;

        sm.x += (tm.x - sm.x) * 0.10;
        sm.y += (tm.y - sm.y) * 0.10;

        // Raw velocity from smooth pos delta
        const rawVx = sm.x - prevX;
        const rawVy = sm.y - prevY;

        // Lerp velocity for smoothness
        velocity.current.x += (rawVx - velocity.current.x) * 0.25;
        velocity.current.y += (rawVy - velocity.current.y) * 0.25;

        // Push to trail
        if (sm.x > 0) {
          trail.current.unshift({ x: sm.x, y: sm.y });
          if (trail.current.length > TRAIL_LENGTH) {
            trail.current.length = TRAIL_LENGTH;
          }
        }
      }

      ps.x = sm.x;
      ps.y = sm.y;

      draw(
        ctx, W, H, paths,
        sm.x, sm.y,
        velocity.current.x, velocity.current.y,
        trail.current,
        frameRef.current
      );
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onLeave = () => {
      targetMouse.current = { x: -9999, y: -9999 };
    };

    const onResize = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        setup();
      }, 120);
    };

    setup();
    rafRef.current = requestAnimationFrame(tick);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer.current);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [buildPaths, draw]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse 80% 70% at 50% 50%, #0a0614 0%, #050408 50%, #020203 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-start px-8 pt-8 sm:px-14 sm:pt-12">
        <div className="grid grid-cols-2 gap-y-3 sm:gap-y-4 w-fit">
          {["Projects","Events","Research","Contact","Network","Privacy policies","Impressum","Work with us"].map((item) => (
            <span
              key={item}
              className="pointer-events-auto font-ppneue cursor-pointer text-[15px] sm:text-[18px] font-light tracking-[0.02em] text-white/70 transition-colors duration-300 hover:text-white pr-20"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[2] h-full w-full"
        style={{ cursor: "default" }}
      />
    </section>
  );
}