"use client";
import React, { useEffect, useRef } from "react";

export const GridAnimation = ({ className = "", theme = "light" }) => {
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement("canvas");
    }
    const offCanvas = offscreenCanvasRef.current;

    const ctx = canvas.getContext("2d", { alpha: true });
    const offCtx = offCanvas.getContext("2d", { alpha: true });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const gridSizePx = 70;
    const dotRadius = 2.5;
    const gap = 12;
    const MAX_PULSES = 36;
    const PULSE_SPAWN_MS = 600;

    const drawStaticGrid = (context, width, height) => {
      const cols = Math.ceil(width / gridSizePx) + 4;
      const rows = Math.ceil(height / gridSizePx) + 4;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#000000";
      context.strokeStyle = "#000000";
      context.lineWidth = 1.0;

      for (let i = 0; i < cols; i++) {
        const x = (i - 1) * gridSizePx;
        for (let j = 0; j < rows; j++) {
          const y = (j - 1) * gridSizePx;

          context.beginPath();
          context.arc(x, y, dotRadius, 0, Math.PI * 2);
          context.fill();

          if (j < rows - 1) {
            context.beginPath();
            context.moveTo(x + gap, y);
            context.lineTo(x + gridSizePx - gap, y);
            context.stroke();

            context.beginPath();
            context.moveTo(x + gap, y + gridSizePx);
            context.lineTo(x + gridSizePx - gap, y + gridSizePx);
            context.stroke();
          }

          if (i < cols - 1) {
            context.beginPath();
            context.moveTo(x, y + gap);
            context.lineTo(x, y + gridSizePx - gap);
            context.stroke();

            context.beginPath();
            context.moveTo(x + gridSizePx, y + gap);
            context.lineTo(x + gridSizePx, y + gridSizePx - gap);
            context.stroke();
          }
        }
      }
    };

    const resize = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      if (width < 1 || height < 1) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      offCanvas.width = Math.floor(width * dpr);
      offCanvas.height = Math.floor(height * dpr);
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      drawStaticGrid(offCtx, width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    const yellowPulses = [];
    let animationId = null;
    let pulseIntervalId = null;
    let isVisible = false;

    const stopWhenHidden = () => {
      if (pulseIntervalId !== null) {
        clearInterval(pulseIntervalId);
        pulseIntervalId = null;
      }
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      yellowPulses.length = 0;
    };

    const createYellowPulse = () => {
      if (!isVisible || canvas.offsetWidth < 1) return;

      const cols = Math.ceil(canvas.offsetWidth / gridSizePx) + 4;
      const rows = Math.ceil(canvas.offsetHeight / gridSizePx) + 4;
      const room = Math.max(0, MAX_PULSES - yellowPulses.length);
      const desired = 3 + Math.floor(Math.random() * 4);
      const numLines = Math.min(desired, room);
      if (numLines <= 0) return;

      for (let k = 0; k < numLines; k++) {
        const isHorizontal = Math.random() < 0.5;
        let gridIndex;

        if (isHorizontal) {
          gridIndex = Math.floor(Math.random() * Math.max(1, rows - 1));
        } else {
          const minCol = 1;
          const maxCol = Math.max(minCol, cols - 2);
          gridIndex =
            minCol + Math.floor(Math.random() * (maxCol - minCol + 1));
        }

        yellowPulses.push({
          isHorizontal,
          gridIndex,
          startFrac: Math.random() * 0.5,
          fraction: 3 + Math.random() * 3,
          progress: -0.2 + Math.random() * 0.4,
          speed: 0.003 + Math.random() * 0.003,
          life: 0,
        });
      }
    };

    const startWhenVisible = () => {
      if (pulseIntervalId === null) {
        pulseIntervalId = setInterval(createYellowPulse, PULSE_SPAWN_MS);
        createYellowPulse();
      }
      if (animationId === null) {
        animationId = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      if (!isVisible) {
        animationId = null;
        return;
      }

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      if (width < 1 || height < 1) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(offCanvas, 0, 0, width, height);

      const waveWidth = 1200;
      const fullCycle = width + waveWidth * 2;
      const cycleTime = fullCycle / 1.2;
      const t = (time / cycleTime) % 2;
      const pingPong = t <= 1 ? t : 2 - t;
      const waveX = -waveWidth + pingPong * fullCycle;

      const gradient = ctx.createLinearGradient(
        waveX,
        0,
        waveX + waveWidth,
        0
      );

      const isDark = theme === "dark";
      const r = isDark ? 255 : 0;
      const g = isDark ? 255 : 0;
      const b = isDark ? 255 : 0;
      const a = (val) => (isDark ? Math.min(1, val * 2.5) : val);

      gradient.addColorStop(0.0, `rgba(${r}, ${g}, ${b}, ${a(0.0)})`);
      gradient.addColorStop(0.08, `rgba(${r}, ${g}, ${b}, ${a(0.04)})`);
      gradient.addColorStop(0.2, `rgba(${r}, ${g}, ${b}, ${a(0.1)})`);
      gradient.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${a(0.2)})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${a(0.32)})`);
      gradient.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, ${a(0.2)})`);
      gradient.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, ${a(0.1)})`);
      gradient.addColorStop(0.92, `rgba(${r}, ${g}, ${b}, ${a(0.04)})`);
      gradient.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, ${a(0.0)})`);

      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      const cols = Math.ceil(width / gridSizePx) + 4;
      const rows = Math.ceil(height / gridSizePx) + 4;

      ctx.save();
      ctx.lineCap = "round";

      const activePulses = [];

      yellowPulses.forEach((pulse) => {
        pulse.progress += pulse.speed;
        pulse.life += 0.01;

        if (pulse.progress > 1.2 || pulse.life > 1) {
          return;
        }

        activePulses.push(pulse);

        const opacity = Math.sin(pulse.life * Math.PI);
        const totalPulseLength = pulse.fraction * gridSizePx;

        if (pulse.isHorizontal) {
          const y = pulse.gridIndex * gridSizePx;
          const startX = pulse.startFrac * gridSizePx;
          const currentHeadX =
            startX +
            pulse.progress * (width + totalPulseLength) -
            totalPulseLength;
          const currentTailX = currentHeadX - totalPulseLength;

          for (let i = 0; i < cols; i++) {
            const segX = (i - 1) * gridSizePx;
            const segStart = segX + gap;
            const segEnd = segX + gridSizePx - gap;

            const overlapStart = Math.max(segStart, currentTailX);
            const overlapEnd = Math.min(segEnd, currentHeadX);

            if (overlapStart < overlapEnd) {
              const pulseCenter = (currentHeadX + currentTailX) / 2;
              const segCenter = (overlapStart + overlapEnd) / 2;
              const dist = Math.abs(segCenter - pulseCenter);
              const maxDist = totalPulseLength / 2;
              const segOpacity = Math.max(0, 1 - dist / maxDist);
              ctx.strokeStyle = `rgba(251, 191, 36, ${opacity * segOpacity})`;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(overlapStart, y);
              ctx.lineTo(overlapEnd, y);
              ctx.stroke();
            }
          }
        } else {
          const x = pulse.gridIndex * gridSizePx;
          const startY = pulse.startFrac * gridSizePx;
          const currentHeadY =
            startY +
            pulse.progress * (height + totalPulseLength) -
            totalPulseLength;
          const currentTailY = currentHeadY - totalPulseLength;

          for (let j = 0; j < rows; j++) {
            const segY = (j - 1) * gridSizePx;
            const segStart = segY + gap;
            const segEnd = segY + gridSizePx - gap;

            const overlapStart = Math.max(segStart, currentTailY);
            const overlapEnd = Math.min(segEnd, currentHeadY);

            if (overlapStart < overlapEnd) {
              const pulseCenter = (currentHeadY + currentTailY) / 2;
              const segCenter = (overlapStart + overlapEnd) / 2;
              const dist = Math.abs(segCenter - pulseCenter);
              const maxDist = totalPulseLength / 2;
              const segOpacity = Math.max(0, 1 - dist / maxDist);
              ctx.strokeStyle = `rgba(251, 191, 36, ${opacity * segOpacity})`;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(x, overlapStart);
              ctx.lineTo(x, overlapEnd);
              ctx.stroke();
            }
          }
        }
      });

      ctx.restore();

      yellowPulses.length = 0;
      yellowPulses.push(...activePulses);

      time++;
      animationId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const next = entry?.isIntersecting ?? false;
        if (next === isVisible) return;
        isVisible = next;
        if (isVisible) {
          startWhenVisible();
        } else {
          stopWhenHidden();
        }
      },
      { threshold: 0, rootMargin: "80px" }
    );

    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", resize);
      stopWhenHidden();
      observer.disconnect();
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};
