// components/CursorTrail.jsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export default function CursorTrail({ children }) {
  const [triangles, setTriangles] = useState([]);
  const triangleIdRef = useRef(0);
  const containerRef = useRef(null);

  const createTriangle = useCallback((x, y) => {
    const id = triangleIdRef.current++;
    const size = Math.random() * 5 + 8;
    const rotation = Math.random() * 360;
    const greenShades = ['#74F5A1', '#5FE08D', '#4DD97F', '#3BC972'];
    const color = greenShades[Math.floor(Math.random() * greenShades.length)];

    const newTriangle = {
      id,
      x,
      y,
      size,
      rotation,
      color,
    };

    setTriangles((prev) => [...prev, newTriangle]);

    setTimeout(() => {
      setTriangles((prev) => prev.filter((t) => t.id !== id));
    }, 1050);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastTime = 0;
    const throttleDelay = 80; // Throttle to every 80ms

    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastTime < throttleDelay) return;
      lastTime = currentTime;

      // Get position relative to viewport
      const x = e.clientX;
      const y = e.clientY;

      createTriangle(x, y);
    };

    // Add to window for global tracking
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [createTriangle]);

  return (
    <div ref={containerRef} className="relative">
      {/* CURSOR TRAIL TRIANGLES - Fixed to viewport */}
      <div className="pointer-events-none fixed inset-0 z-[9999]">
        {triangles.map((triangle) => (
          <div
            key={triangle.id}
            className="absolute animate-triangle-fade"
            style={{
              left: `${triangle.x}px`,
              top: `${triangle.y}px`,
              width: '0',
              height: '0',
              borderLeft: `${triangle.size / 2}px solid transparent`,
              borderRight: `${triangle.size / 2}px solid transparent`,
              borderBottom: `${triangle.size}px solid ${triangle.color}`,
              transform: `translate(-50%, -50%) rotate(${triangle.rotation}deg)`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* Children content */}
      {children}
    </div>
  );
}
