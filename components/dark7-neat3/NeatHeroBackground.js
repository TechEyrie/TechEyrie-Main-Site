"use client";

import { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";

const LERP = 0.1;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Neat gradient — pointer shifts actual shader color params (no overlay, no camera move).
 */
export default function NeatHeroBackground({ containerRef, config }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef?.current;
    if (!canvas || !container) return;

    const base = {
      yOffset: config.yOffset ?? 0,
      horizontalPressure: config.horizontalPressure ?? 5,
      verticalPressure: config.verticalPressure ?? 5,
      colorBrightness: config.colorBrightness ?? 1,
      colorSaturation: config.colorSaturation ?? 0,
      highlights: config.highlights ?? 0,
      shadows: config.shadows ?? 0,
      colorBlending: config.colorBlending ?? 5,
      flowDistortionA: config.flowDistortionA ?? 0,
    };

    const gradient = new NeatGradient({
      ref: canvas,
      ...config,
    });

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let pointerActive = false;
    let rafId = 0;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      pointerActive = true;
    };

    const onPointerLeave = () => {
      pointerActive = false;
      targetX = 0;
      targetY = 0;
    };

    const updateScroll = () => {
      const rect = container.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const relativeScroll = Math.max(
        0,
        Math.min(window.scrollY - sectionTop, container.offsetHeight),
      );
      gradient.yOffset = base.yOffset + relativeScroll;
    };

    const tick = () => {
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;

      const influence = pointerActive
        ? clamp(Math.hypot(currentX, currentY), 0, 1)
        : 0;

      gradient.horizontalPressure = clamp(
        base.horizontalPressure + currentX * 2.2 * (0.35 + influence * 0.65),
        0,
        10,
      );
      gradient.verticalPressure = clamp(
        base.verticalPressure - currentY * 2.0 * (0.35 + influence * 0.65),
        0,
        10,
      );
      gradient.colorBrightness = base.colorBrightness + influence * 0.22;
      gradient.colorSaturation = base.colorSaturation + influence * 1.1;
      gradient.highlights = clamp(base.highlights + influence * 1.4, 0, 10);
      gradient.shadows = clamp(base.shadows - influence * 0.35, 0, 10);
      gradient.colorBlending = clamp(
        base.colorBlending + influence * 0.8,
        0,
        10,
      );
      gradient.flowDistortionA = base.flowDistortionA + currentX * 0.12 * influence;

      rafId = requestAnimationFrame(tick);
    };

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });

    updateScroll();
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      if (typeof gradient.destroy === "function") {
        gradient.destroy();
      }
    };
  }, [containerRef, config]);

  return (
    <canvas
      ref={canvasRef}
      id="gradient"
      className="dark7-neat-hero-canvas pointer-events-none absolute inset-0 z-[0]"
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}
