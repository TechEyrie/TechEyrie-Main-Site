// components/AirplaneHero.jsx
"use client";

import { useRef, useLayoutEffect, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

// ─────────────────────────────────────────────────────────────────────────────
// NODES — pixel-traced from the Tech Eyrie logo image
// All offsets are in "design units" relative to eagle center
// n(dx, dy) maps to canvas: x = CX + dx*S,  y = CY + dy*S
// ─────────────────────────────────────────────────────────────────────────────
const CX = 0.68;   // eagle center x on canvas (right half)
const CY = 0.44;   // eagle center y on canvas (slightly above mid)
const S  = 0.88;   // scale — eagle fills the right half comfortably

const n = (dx, dy) => ({ x: CX + dx * S, y: CY + dy * S });

const N = [
  // ── HEAD (0–6) ──
  n( 0.000, -0.175),  // 0  crown top
  n(-0.012, -0.158),  // 1  head L
  n( 0.012, -0.158),  // 2  head R
  n(-0.022, -0.136),  // 3  face L
  n( 0.022, -0.136),  // 4  face R
  n(-0.010, -0.116),  // 5  beak/chin L
  n( 0.010, -0.116),  // 6  beak/chin R

  // ── NECK & UPPER BODY (7–14) ──
  n( 0.000, -0.100),  // 7  throat
  n( 0.000, -0.080),  // 8  chest top
  n(-0.026, -0.066),  // 9  chest L
  n( 0.026, -0.066),  // 10 chest R
  n(-0.038, -0.007),  // 11 wing-body junction L  ← from logo
  n( 0.044, -0.007),  // 12 wing-body junction R  ← from logo
  n(-0.018,  0.005),  // 13 belly L
  n( 0.018,  0.005),  // 14 belly R

  // ── MID BODY (15–19) ──
  n( 0.000,  0.016),  // 15 body center
  n(-0.028,  0.032),  // 16 belly L
  n( 0.028,  0.032),  // 17 belly R
  n(-0.016,  0.055),  // 18 lower belly L
  n( 0.016,  0.055),  // 19 lower belly R

  // ── LOWER BODY (20–22) ──
  n( 0.000,  0.068),  // 20 body base
  n(-0.010,  0.085),  // 21 tail root L
  n( 0.010,  0.085),  // 22 tail root R

  // ── TAIL (23–36) ──
  n( 0.000,  0.100),  // 23 tail top C
  n(-0.020,  0.110),  // 24 tail upper L
  n( 0.020,  0.110),  // 25 tail upper R
  n(-0.036,  0.135),  // 26 tail mid L
  n( 0.036,  0.135),  // 27 tail mid R
  n(-0.014,  0.150),  // 28 tail low L
  n( 0.014,  0.150),  // 29 tail low R
  n( 0.000,  0.160),  // 30 tail low C
  n(-0.042,  0.158),  // 31 tail fan L
  n( 0.042,  0.158),  // 32 tail fan R
  n(-0.024,  0.185),  // 33 tip L outer
  n(-0.008,  0.203),  // 34 tip L inner
  n( 0.008,  0.203),  // 35 tip R inner
  n( 0.024,  0.185),  // 36 tip R outer

  // ─────────────────────────────────────────────────────────────
  // LEFT WING — 7 primary "finger" feathers + coverts
  // Pixel-traced from logo. Wings sweep upward ~30deg
  // ─────────────────────────────────────────────────────────────

  // Inner wing panel (37–43) — connects body to outer primaries
  n(-0.058, -0.060),  // 37 LW panel 1 top
  n(-0.085, -0.048),  // 38 LW panel 2 ← logo (0.3768, 0.4111)
  n(-0.068, -0.030),  // 39 LW panel 1 bot
  n(-0.096,  0.000),  // 40 LW panel 2 bot ← logo trailing
  n(-0.126, -0.096),  // 41 LW mid top ← logo (0.3195, 0.3444)
  n(-0.134, -0.005),  // 42 LW trailing far ← logo (0.3095, 0.4711)
  n(-0.118, -0.052),  // 43 LW mid connector

  // Secondary coverts (44–49)
  n(-0.108, -0.080),  // 44
  n(-0.130, -0.068),  // 45
  n(-0.152, -0.055),  // 46
  n(-0.138, -0.028),  // 47
  n(-0.158, -0.018),  // 48
  n(-0.176, -0.010),  // 49

  // Primary feather BASES — where fingers emerge from wing leading edge
  n(-0.126, -0.096),  // 50 = same as 41, P-root
  n(-0.152, -0.092),  // 51 P2 root
  n(-0.169, -0.079),  // 52 P3 root ← logo cluster (0.2607, 0.3686) sz=89
  n(-0.184, -0.085),  // 53 P4 root ← logo cluster (0.2389, 0.3600) sz=77
  n(-0.193, -0.059),  // 54 P5 root ← logo (0.2264, 0.3961) sz=62
  n(-0.197, -0.080),  // 55 P5 top root

  // Primary finger TIPS — 7 feathers fanning upward
  // Traced from the logo's distinct separated finger tips
  n(-0.130, -0.125),  // 56 P1 tip  (innermost)
  n(-0.152, -0.130),  // 57 P2 tip
  n(-0.163, -0.125),  // 58 P3 tip  ← around logo (0.2973, 0.3183) sz=44
  n(-0.172, -0.119),  // 59 P4 tip  ← logo (0.2498, 0.3245) sz=61
  n(-0.181, -0.112),  // 60 P5 tip  ← logo (0.2336, 0.3322) sz=37 / (0.2227, 0.3294) sz=36
  n(-0.184, -0.102),  // 61 P6 tip  ← logo (0.2209, 0.3533) sz=21
  n(-0.153, -0.119),  // 62 P7 tip (outermost) ← logo (0.2824, 0.3123) sz=202 BIGGEST NODE
  // The big node at 0.2824 is actually the outermost tip cluster
  // Lower fan edge — bottom of each primary
  n(-0.145, -0.112),  // 63 P1 base-tip
  n(-0.161, -0.115),  // 64 P2 base-tip
  n(-0.177, -0.107),  // 65 P3 base-tip
  n(-0.186, -0.095),  // 66 P4 base-tip
  n(-0.193, -0.085),  // 67 P5 base-tip
  n(-0.196, -0.073),  // 68 P6 base-tip

  // Outermost fan arc — the curved outer edge of all primaries
  n(-0.140, -0.119),  // 69  arc inner
  n(-0.153, -0.126),  // 70  arc mid-inner   (= approx 62)
  n(-0.165, -0.130),  // 71  arc mid
  n(-0.176, -0.127),  // 72  arc mid-outer
  n(-0.185, -0.120),  // 73  arc outer
  n(-0.191, -0.110),  // 74  arc far-outer
  n(-0.193, -0.097),  // 75  arc bottom

  // ─────────────────────────────────────────────────────────────
  // RIGHT WING — exact mirror of left
  // ─────────────────────────────────────────────────────────────

  n( 0.058, -0.060),  // 76 = mirror 37
  n( 0.085, -0.048),  // 77 = mirror 38
  n( 0.068, -0.030),  // 78 = mirror 39
  n( 0.096,  0.000),  // 79 = mirror 40
  n( 0.126, -0.096),  // 80 = mirror 41
  n( 0.134, -0.005),  // 81 = mirror 42
  n( 0.118, -0.052),  // 82 = mirror 43

  n( 0.108, -0.080),  // 83 = mirror 44
  n( 0.130, -0.068),  // 84 = mirror 45
  n( 0.152, -0.055),  // 85 = mirror 46
  n( 0.138, -0.028),  // 86 = mirror 47
  n( 0.158, -0.018),  // 87 = mirror 48
  n( 0.176, -0.010),  // 88 = mirror 49

  n( 0.126, -0.096),  // 89 = mirror 50
  n( 0.152, -0.092),  // 90 = mirror 51
  n( 0.169, -0.079),  // 91 = mirror 52
  n( 0.184, -0.085),  // 92 = mirror 53
  n( 0.193, -0.059),  // 93 = mirror 54
  n( 0.197, -0.080),  // 94 = mirror 55

  n( 0.130, -0.125),  // 95 = mirror 56
  n( 0.152, -0.130),  // 96 = mirror 57
  n( 0.163, -0.125),  // 97 = mirror 58
  n( 0.172, -0.119),  // 98 = mirror 59
  n( 0.181, -0.112),  // 99 = mirror 60
  n( 0.184, -0.102),  // 100 = mirror 61
  n( 0.153, -0.119),  // 101 = mirror 62

  n( 0.145, -0.112),  // 102 = mirror 63
  n( 0.161, -0.115),  // 103 = mirror 64
  n( 0.177, -0.107),  // 104 = mirror 65
  n( 0.186, -0.095),  // 105 = mirror 66
  n( 0.193, -0.085),  // 106 = mirror 67
  n( 0.196, -0.073),  // 107 = mirror 68

  n( 0.140, -0.119),  // 108 = mirror 69
  n( 0.153, -0.126),  // 109 = mirror 70
  n( 0.165, -0.130),  // 110 = mirror 71
  n( 0.176, -0.127),  // 111 = mirror 72
  n( 0.185, -0.120),  // 112 = mirror 73
  n( 0.191, -0.110),  // 113 = mirror 74
  n( 0.193, -0.097),  // 114 = mirror 75

  // ── CONSTELLATION RING — 16 pts around center, r=0.240 (115–130) ──
  n( 0.000, -0.240),  // 115 top
  n( 0.092, -0.219),  // 116
  n( 0.170, -0.165),  // 117
  n( 0.220, -0.082),  // 118
  n( 0.240,  0.012),  // 119 right
  n( 0.220,  0.106),  // 120
  n( 0.170,  0.165),  // 121
  n( 0.092,  0.200),  // 122
  n( 0.000,  0.215),  // 123 bottom
  n(-0.092,  0.200),  // 124
  n(-0.170,  0.165),  // 125
  n(-0.220,  0.106),  // 126
  n(-0.240,  0.012),  // 127 left
  n(-0.220, -0.082),  // 128
  n(-0.170, -0.165),  // 129
  n(-0.092, -0.219),  // 130
];

// ─────────────────────────────────────────────────────────────────────────────
// EDGES
// ─────────────────────────────────────────────────────────────────────────────
const E = [
  // Head
  [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,6],[5,6],
  [5,7],[6,7],[0,7],[1,5],[2,6],

  // Neck + upper body
  [7,8],[8,9],[8,10],[9,10],[9,11],[10,12],
  [11,13],[12,14],[13,14],[13,15],[14,15],
  [9,13],[10,14],[8,15],[11,15],[12,15],

  // Mid body
  [15,16],[15,17],[16,17],[16,18],[17,19],[18,19],
  [18,20],[19,20],[20,21],[20,22],[21,22],
  [13,16],[14,17],[16,20],[17,20],

  // Tail
  [21,23],[22,23],[21,24],[22,25],[24,25],[23,24],[23,25],
  [24,26],[25,27],[26,27],[26,28],[27,29],[28,29],[28,30],[29,30],
  [26,31],[27,32],[30,31],[30,32],
  [31,33],[28,33],[30,33],[30,34],[33,34],
  [30,35],[29,35],[32,35],[32,36],[35,36],
  [21,28],[22,29],[18,21],[19,22],

  // ── LEFT wing inner panels ──
  [11,37],[37,38],[38,41],[41,43],[43,37],  // top panel
  [37,39],[39,40],[40,42],[38,39],          // bottom panel
  [11,39],[39,43],[43,44],[44,45],
  [38,43],[40,42],[42,47],[47,48],[48,49],
  [11,40],[40,47],[45,46],[46,47],
  [13,40],[16,42],[16,40],
  // covert connections
  [41,44],[44,50],[45,51],[46,52],
  [47,53],[48,54],[49,54],
  [43,45],[45,52],[52,53],
  [38,44],[39,47],[40,48],[40,49],

  // ── LEFT primary feathers — 7 fingers ──
  // Each finger: base → mid → tip, with cross-bracing
  [50,56],[56,69],[69,63],[63,50],           // P1 finger quad
  [51,57],[57,70],[70,64],[64,51],           // P2 finger quad
  [52,58],[58,71],[71,65],[65,52],           // P3 finger quad
  [53,59],[59,72],[72,66],[66,53],           // P4 finger quad
  [54,60],[60,73],[73,67],[67,55],[55,54],   // P5 finger quad
  [55,61],[61,74],[74,68],[68,54],           // P6 finger quad
  [62,75],[75,68],[68,62],                   // P7 outermost
  // Arc connecting all tips
  [69,70],[70,71],[71,72],[72,73],[73,74],[74,75],
  // Arc connecting all bases
  [63,64],[64,65],[65,66],[66,67],[67,68],
  // Base rail
  [50,51],[51,52],[52,53],[53,55],[55,54],
  // Diagonals
  [56,70],[57,71],[58,72],[59,73],[60,74],
  [63,70],[64,71],[65,72],[66,73],[67,74],[68,75],

  // Wing to body connections
  [9,37],[11,37],[11,39],[13,40],[16,42],
  [37,41],[41,50],[50,56],

  // ── RIGHT wing inner panels (mirrors) ──
  [12,76],[76,77],[77,80],[80,82],[82,76],
  [76,78],[78,79],[79,81],[77,78],
  [12,78],[78,82],[82,83],[83,84],
  [77,82],[79,81],[81,86],[86,87],[87,88],
  [12,79],[79,86],[84,85],[85,86],
  [14,79],[17,81],[17,79],
  [80,83],[83,89],[84,90],[85,91],
  [86,92],[87,93],[88,93],
  [82,84],[84,91],[91,92],
  [77,83],[78,86],[79,87],[79,88],

  // ── RIGHT primary feathers (mirrors) ──
  [89,95],[95,108],[108,102],[102,89],
  [90,96],[96,109],[109,103],[103,90],
  [91,97],[97,110],[110,104],[104,91],
  [92,98],[98,111],[111,105],[105,92],
  [93,99],[99,112],[112,106],[106,94],[94,93],
  [94,100],[100,113],[113,107],[107,93],
  [101,114],[114,107],[107,101],
  [108,109],[109,110],[110,111],[111,112],[112,113],[113,114],
  [102,103],[103,104],[104,105],[105,106],[106,107],
  [89,90],[90,91],[91,92],[92,94],[94,93],
  [95,109],[96,110],[97,111],[98,112],[99,113],
  [102,109],[103,110],[104,111],[105,112],[106,113],[107,114],

  // Wing to body (right)
  [10,76],[12,76],[12,78],[14,79],[17,81],
  [76,80],[80,89],[89,95],

  // ── Constellation ring ──
  [115,116],[116,117],[117,118],[118,119],[119,120],[120,121],
  [121,122],[122,123],[123,124],[124,125],[125,126],[126,127],
  [127,128],[128,129],[129,130],[130,115],
  // alternating skip-1 diagonals
  [115,117],[117,119],[119,121],[121,123],[123,125],[125,127],[127,129],[129,115],
  [116,118],[118,120],[120,122],[122,124],[124,126],[126,128],[128,130],[130,116],
  // ring spokes → eagle
  [115,0],[116,2],[117,77],[118,80],[119,89],
  [120,86],[121,88],[122,17],[123,22],[124,16],
  [125,46],[126,11],[127,41],[128,38],[129,37],[130,1],
];

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS COMPONENT — unchanged animation logic
// ─────────────────────────────────────────────────────────────────────────────
function EagleCanvas({ sectionRef }) {
  const canvasRef   = useRef(null);
  const segRef      = useRef([]);
  const targetMouse = useRef({ x: -9999, y: -9999 });
  const smoothMouse = useRef({ x: -9999, y: -9999 });
  const velocity    = useRef({ x: 0, y: 0 });
  const trail       = useRef([]);
  const rafRef      = useRef(null);
  const resizeTimer = useRef(null);
  const frameRef    = useRef(0);
  const TRAIL_LEN   = 62;

  const buildSegments = useCallback((W, H) => {
    const nodes = N.map(nd => ({ x: nd.x * W, y: nd.y * H }));
    return E.map(([ai, bi]) => {
      const na = nodes[ai], nb = nodes[bi];
      if (!na || !nb) return null;
      return { na, nb };
    }).filter(Boolean);
  }, []);

  const draw = useCallback((ctx, W, H, segs, mx, my, vx, vy, trailPts, frame) => {
    ctx.clearRect(0, 0, W, H);

    const REVEAL  = W * 0.20;
    const GLOW    = W * 0.10;
    const pulse   = 0.90 + Math.sin(frame * 0.008) * 0.10;
    const speed   = Math.sqrt(vx * vx + vy * vy);
    const hasSp   = speed > 0.5;
    const nvx     = hasSp ? vx / speed : 0;
    const nvy     = hasSp ? vy / speed : 0;
    const dBias   = Math.min(speed / 18, 1.0);
    const breathe = 0.038 + Math.sin(frame * 0.014) * 0.012;

    for (const { na, nb } of segs) {
      const mid = { x: (na.x + nb.x) * 0.5, y: (na.y + nb.y) * 0.5 };
      const pts = [na, mid, nb];

      let tA = 0, tG = 0;
      for (let ti = 0; ti < trailPts.length; ti++) {
        const tp  = trailPts[ti];
        const age = ti / trailPts.length;
        const tr  = REVEAL * (1 - age * 0.45);
        const tf  = (1 - age) * (1 - age);
        for (const p of pts) {
          const d = Math.hypot(p.x - tp.x, p.y - tp.y);
          if (d >= tr) continue;
          const a2 = ((1 - Math.cos((1 - d / tr) * Math.PI)) / 2) * tf * pulse;
          if (a2 > tA) tA = a2;
          const gr = GLOW * (1 - age * 0.4);
          if (d < gr) {
            const g = ((1 - Math.cos((1 - d / gr) * Math.PI)) / 2) * tf * pulse;
            if (g > tG) tG = g;
          }
        }
      }

      let cA = 0, cG = 0;
      for (const p of pts) {
        const d = Math.hypot(p.x - mx, p.y - my);
        if (d >= REVEAL) continue;
        let alpha = (1 - Math.cos((1 - d / REVEAL) * Math.PI)) / 2;
        if (hasSp && dBias > 0.05) {
          const dx2 = mx - p.x, dy2 = my - p.y;
          const dd  = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
          const dot = (dx2 / dd) * nvx + (dy2 / dd) * nvy;
          alpha *= (1 - dBias) + dBias * (0.35 + 0.65 * Math.max(0, (dot + 1) / 2));
        }
        const fa = alpha * pulse;
        if (fa > cA) cA = fa;
        if (d < GLOW) {
          const g = ((1 - Math.cos((1 - d / GLOW) * Math.PI)) / 2) * pulse;
          if (g > cG) cG = g;
        }
      }

      const fa = Math.max(tA, cA);
      const fg = Math.max(tG, cG);

      // Ambient ghost
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = `rgba(215, 205, 190, ${breathe})`;
      ctx.lineWidth   = 0.75;
      ctx.lineCap     = "round";
      ctx.stroke();
      for (const nd of [na, nb]) {
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215, 205, 190, ${breathe * 1.5})`;
        ctx.fill();
      }

      if (fa < 0.004) continue;

      // Glow bloom
      if (fg > 0.008) {
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = `rgba(210, 130, 55, ${fg * 0.45})`;
        ctx.lineWidth   = 16;
        ctx.lineCap     = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = `rgba(100, 50, 200, ${fg * 0.32})`;
        ctx.lineWidth   = 8;
        ctx.lineCap     = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = `rgba(240, 180, 90, ${fg * 0.40})`;
        ctx.lineWidth   = 3.5;
        ctx.lineCap     = "round";
        ctx.stroke();
      }

      // Sharp reveal line
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = `rgba(248, 236, 218, ${breathe + fa * (1 - breathe)})`;
      ctx.lineWidth   = 1.5;
      ctx.lineCap     = "round";
      ctx.stroke();

      // Growing node dots
      if (fa > 0.10) {
        const dotR = 1.1 + fa * 2.2;
        for (const nd of [na, nb]) {
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, dotR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(252, 242, 224, ${fa * 0.92})`;
          ctx.fill();
        }
      }
    }
  }, []);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    let W, H;

    const setup = () => {
      W = section.offsetWidth;
      H = section.offsetHeight;
      canvas.width        = W * window.devicePixelRatio;
      canvas.height       = H * window.devicePixelRatio;
      canvas.style.width  = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      segRef.current = buildSegments(W, H);
    };

    const tick = () => {
      frameRef.current++;
      const sm = smoothMouse.current;
      const tm = targetMouse.current;
      if (tm.x < 0) {
        sm.x += (-9999 - sm.x) * 0.03;
        sm.y += (-9999 - sm.y) * 0.03;
        velocity.current = { x: 0, y: 0 };
        trail.current    = [];
      } else {
        const px = sm.x, py = sm.y;
        sm.x += (tm.x - sm.x) * 0.06;
        sm.y += (tm.y - sm.y) * 0.06;
        velocity.current.x += ((sm.x - px) - velocity.current.x) * 0.18;
        velocity.current.y += ((sm.y - py) - velocity.current.y) * 0.18;
        if (sm.x > 0) {
          trail.current.unshift({ x: sm.x, y: sm.y });
          if (trail.current.length > TRAIL_LEN) trail.current.length = TRAIL_LEN;
        }
      }
      if (W && H) {
        draw(ctx, W, H, segRef.current,
          sm.x, sm.y,
          velocity.current.x, velocity.current.y,
          trail.current, frameRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove  = (e) => {
      const r = section.getBoundingClientRect();
      targetMouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave  = () => { targetMouse.current = { x: -9999, y: -9999 }; };
    const onResize = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(setup, 100);
    };

    setup();
    rafRef.current = requestAnimationFrame(tick);
    section.addEventListener("mousemove",  onMove,  { passive: true });
    section.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize",      onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer.current);
      section.removeEventListener("mousemove",  onMove);
      section.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize",      onResize);
    };
  }, [buildSegments, draw, sectionRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />;

}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HERO
// ─────────────────────────────────────────────────────────────────────────────
export default function AirplaneHero({ theme = "dark" }) {
  const sectionRef = useRef(null);
  const textRef    = useRef(null);
  const buttonRef  = useRef(null);
  const footerRef  = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      gsap.set([textRef.current, buttonRef.current, footerRef.current], {
        opacity: 0, y: 20,
      });
      tl.to(textRef.current,   { opacity: 1, y: 0, duration: 1.2 })
        .to(buttonRef.current, { opacity: 1, y: 0, duration: 1.0 }, "-=0.8")
        .to(footerRef.current, { opacity: 1, y: 0, duration: 1.0 }, "-=0.8");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black flex flex-col justify-between overflow-hidden"
      style={{ cursor: "crosshair" }}
    >
      <div className="absolute inset-0 z-0">
        <Image src="/airplane-bg.jpg" alt="Airplane" fill priority
          className="object-cover object-center opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a2f] via-[#152820]/70 to-[#1e3a2f]" />
      </div>

      <EagleCanvas sectionRef={sectionRef} />

      <div className="relative z-20 flex-1 flex flex-col justify-start pt-24 md:pt-32 px-6 sm:px-12 md:px-20 lg:px-32">
        <div ref={textRef} className="max-w-xl lg:max-w-2xl">
          <h1 className="font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] text-[#f3f3f3] leading-[1.1] tracking-[0.01em]">
            Your competitors are already building.
            <br />
            Are you?
          </h1>
        </div>
        <div ref={buttonRef} className="mt-8 md:mt-12">
          <Link href="/get-started"
            className="group inline-flex items-center justify-center self-start rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px]"
            style={{ backgroundColor: "#2d5244" }}>
            <span className="font-merriweather text-[13px] sm:text-[14px] md:text-[15px] font-semibold tracking-wide text-white">
              Get Started
            </span>
          </Link>
        </div>
      </div>

      <div ref={footerRef} className="relative z-20 w-full px-6 sm:px-12 md:px-20 lg:px-32 pb-12">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/20 pb-8">
          <div className="w-full md:w-2/3">
            <input type="email" placeholder="Enter your email"
              className="w-full bg-transparent border-none text-[#f3f3f3] font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] placeholder:text-[#a0a0a0] focus:outline-none focus:ring-0 transition-all" />
          </div>
          <Link href="/get-started"
            className="group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px]"
            style={{ backgroundColor: "#2d5244" }}>
            <span className="font-merriweather text-[13px] sm:text-[14px] md:text-[15px] font-semibold tracking-wide text-white">
              Get Started
            </span>
            <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}