"use client";

import { useEffect, useRef, useCallback } from "react";

const N = [
  // ── HEAD — proper eagle profile facing forward, hooked beak (0–38) ──
  { id:0,  x:0.500, y:0.030 }, // crown peak
  { id:1,  x:0.472, y:0.042 }, // left crown
  { id:2,  x:0.528, y:0.042 }, // right crown
  { id:3,  x:0.450, y:0.058 }, // left skull upper
  { id:4,  x:0.500, y:0.052 }, // skull top center
  { id:5,  x:0.550, y:0.058 }, // right skull upper
  { id:6,  x:0.438, y:0.075 }, // left brow ridge
  { id:7,  x:0.562, y:0.075 }, // right brow ridge
  { id:8,  x:0.432, y:0.092 }, // left brow outer
  { id:9,  x:0.568, y:0.092 }, // right brow outer

  // eye sockets
  { id:10, x:0.445, y:0.095 }, // left eye top-outer
  { id:11, x:0.462, y:0.088 }, // left eye top-inner
  { id:12, x:0.478, y:0.090 }, // left eye inner
  { id:13, x:0.448, y:0.110 }, // left eye bottom-outer
  { id:14, x:0.465, y:0.108 }, // left eye bottom-inner
  { id:15, x:0.522, y:0.088 }, // right eye top-inner
  { id:16, x:0.538, y:0.095 }, // right eye top-outer
  { id:17, x:0.552, y:0.110 }, // right eye bottom-outer
  { id:18, x:0.535, y:0.108 }, // right eye bottom-inner
  { id:19, x:0.522, y:0.090 }, // right eye inner

  // cheeks / face structure
  { id:20, x:0.440, y:0.125 }, // left cheek upper
  { id:21, x:0.560, y:0.125 }, // right cheek upper
  { id:22, x:0.448, y:0.142 }, // left cheek lower
  { id:23, x:0.552, y:0.142 }, // right cheek lower
  { id:24, x:0.458, y:0.158 }, // left jaw
  { id:25, x:0.542, y:0.158 }, // right jaw
  { id:26, x:0.468, y:0.172 }, // left pre-beak
  { id:27, x:0.532, y:0.172 }, // right pre-beak

  // hooked beak — upper mandible
  { id:28, x:0.474, y:0.178 }, // beak base left
  { id:29, x:0.526, y:0.178 }, // beak base right
  { id:30, x:0.466, y:0.195 }, // upper beak left
  { id:31, x:0.534, y:0.195 }, // upper beak right
  { id:32, x:0.472, y:0.215 }, // upper beak mid-left
  { id:33, x:0.528, y:0.215 }, // upper beak mid-right
  { id:34, x:0.480, y:0.235 }, // beak curve left
  { id:35, x:0.520, y:0.235 }, // beak curve right
  { id:36, x:0.490, y:0.252 }, // hook left
  { id:37, x:0.510, y:0.252 }, // hook right
  { id:38, x:0.500, y:0.268 }, // beak tip point

  // lower mandible / chin
  { id:39, x:0.478, y:0.205 }, // lower beak left
  { id:40, x:0.522, y:0.205 }, // lower beak right
  { id:41, x:0.484, y:0.222 }, // chin left
  { id:42, x:0.516, y:0.222 }, // chin right

  // ── NECK & BODY (43–58) ──
  { id:43, x:0.468, y:0.285 }, // neck left
  { id:44, x:0.532, y:0.285 }, // neck right
  { id:45, x:0.452, y:0.318 }, // shoulder left
  { id:46, x:0.548, y:0.318 }, // shoulder right
  { id:47, x:0.500, y:0.332 }, // chest top
  { id:48, x:0.462, y:0.368 }, // chest left
  { id:49, x:0.538, y:0.368 }, // chest right
  { id:50, x:0.500, y:0.388 }, // chest center
  { id:51, x:0.470, y:0.428 }, // belly left
  { id:52, x:0.530, y:0.428 }, // belly right
  { id:53, x:0.500, y:0.452 }, // belly center
  { id:54, x:0.475, y:0.498 }, // lower belly left
  { id:55, x:0.525, y:0.498 }, // lower belly right
  { id:56, x:0.500, y:0.525 }, // body base
  { id:57, x:0.485, y:0.568 }, // tail root left
  { id:58, x:0.515, y:0.568 }, // tail root right

  // ── TAIL — long dramatic fan (59–74) ──
  { id:59, x:0.465, y:0.612 },
  { id:60, x:0.500, y:0.618 },
  { id:61, x:0.535, y:0.612 },
  { id:62, x:0.442, y:0.658 },
  { id:63, x:0.468, y:0.665 },
  { id:64, x:0.500, y:0.670 },
  { id:65, x:0.532, y:0.665 },
  { id:66, x:0.558, y:0.658 },
  { id:67, x:0.450, y:0.705 },
  { id:68, x:0.474, y:0.715 },
  { id:69, x:0.500, y:0.720 },
  { id:70, x:0.526, y:0.715 },
  { id:71, x:0.550, y:0.705 },
  { id:72, x:0.462, y:0.752 },
  { id:73, x:0.500, y:0.762 },
  { id:74, x:0.538, y:0.752 },
  { id:75, x:0.478, y:0.792 },
  { id:76, x:0.500, y:0.800 },
  { id:77, x:0.522, y:0.792 },
  { id:78, x:0.500, y:0.828 }, // tail tip

  // ── LEFT WING LAYER 1 (79–91) ──
  { id:79, x:0.430, y:0.310 },
  { id:80, x:0.395, y:0.290 },
  { id:81, x:0.362, y:0.302 },
  { id:82, x:0.330, y:0.290 },
  { id:83, x:0.408, y:0.332 },
  { id:84, x:0.372, y:0.322 },
  { id:85, x:0.338, y:0.315 },
  { id:86, x:0.305, y:0.305 },
  { id:87, x:0.385, y:0.352 },
  { id:88, x:0.348, y:0.345 },
  { id:89, x:0.312, y:0.335 },
  { id:90, x:0.278, y:0.325 },

  // ── LEFT WING LAYER 2 (91–103) ──
  { id:91, x:0.418, y:0.375 },
  { id:92, x:0.382, y:0.382 },
  { id:93, x:0.345, y:0.375 },
  { id:94, x:0.310, y:0.365 },
  { id:95, x:0.275, y:0.355 },
  { id:96, x:0.242, y:0.345 },
  { id:97, x:0.395, y:0.405 },
  { id:98, x:0.358, y:0.402 },
  { id:99, x:0.320, y:0.392 },
  { id:100,x:0.285, y:0.382 },
  { id:101,x:0.252, y:0.372 },
  { id:102,x:0.220, y:0.362 },

  // ── LEFT WING LAYER 3 (103–114) ──
  { id:103,x:0.240, y:0.322 },
  { id:104,x:0.208, y:0.328 },
  { id:105,x:0.178, y:0.335 },
  { id:106,x:0.148, y:0.342 },
  { id:107,x:0.222, y:0.355 },
  { id:108,x:0.192, y:0.362 },
  { id:109,x:0.162, y:0.370 },
  { id:110,x:0.135, y:0.378 },
  { id:111,x:0.205, y:0.388 },
  { id:112,x:0.175, y:0.395 },
  { id:113,x:0.148, y:0.402 },

  // ── LEFT WINGTIP (114–127) ──
  { id:114,x:0.120, y:0.328 },
  { id:115,x:0.092, y:0.315 },
  { id:116,x:0.065, y:0.325 },
  { id:117,x:0.040, y:0.338 },
  { id:118,x:0.018, y:0.352 },
  { id:119,x:0.098, y:0.352 },
  { id:120,x:0.072, y:0.362 },
  { id:121,x:0.048, y:0.372 },
  { id:122,x:0.026, y:0.382 },
  { id:123,x:0.105, y:0.382 },
  { id:124,x:0.080, y:0.392 },
  { id:125,x:0.056, y:0.400 },
  { id:126,x:0.035, y:0.408 },

  // ── RIGHT WING LAYER 1 (127–139) ──
  { id:127,x:0.570, y:0.310 },
  { id:128,x:0.605, y:0.290 },
  { id:129,x:0.638, y:0.302 },
  { id:130,x:0.670, y:0.290 },
  { id:131,x:0.592, y:0.332 },
  { id:132,x:0.628, y:0.322 },
  { id:133,x:0.662, y:0.315 },
  { id:134,x:0.695, y:0.305 },
  { id:135,x:0.615, y:0.352 },
  { id:136,x:0.652, y:0.345 },
  { id:137,x:0.688, y:0.335 },
  { id:138,x:0.722, y:0.325 },

  // ── RIGHT WING LAYER 2 (139–151) ──
  { id:139,x:0.582, y:0.375 },
  { id:140,x:0.618, y:0.382 },
  { id:141,x:0.655, y:0.375 },
  { id:142,x:0.690, y:0.365 },
  { id:143,x:0.725, y:0.355 },
  { id:144,x:0.758, y:0.345 },
  { id:145,x:0.605, y:0.405 },
  { id:146,x:0.642, y:0.402 },
  { id:147,x:0.680, y:0.392 },
  { id:148,x:0.715, y:0.382 },
  { id:149,x:0.748, y:0.372 },
  { id:150,x:0.780, y:0.362 },

  // ── RIGHT WING LAYER 3 (151–162) ──
  { id:151,x:0.760, y:0.322 },
  { id:152,x:0.792, y:0.328 },
  { id:153,x:0.822, y:0.335 },
  { id:154,x:0.852, y:0.342 },
  { id:155,x:0.778, y:0.355 },
  { id:156,x:0.808, y:0.362 },
  { id:157,x:0.838, y:0.370 },
  { id:158,x:0.865, y:0.378 },
  { id:159,x:0.795, y:0.388 },
  { id:160,x:0.825, y:0.395 },
  { id:161,x:0.852, y:0.402 },

  // ── RIGHT WINGTIP (162–175) ──
  { id:162,x:0.880, y:0.328 },
  { id:163,x:0.908, y:0.315 },
  { id:164,x:0.935, y:0.325 },
  { id:165,x:0.960, y:0.338 },
  { id:166,x:0.982, y:0.352 },
  { id:167,x:0.902, y:0.352 },
  { id:168,x:0.928, y:0.362 },
  { id:169,x:0.952, y:0.372 },
  { id:170,x:0.972, y:0.382 },
  { id:171,x:0.895, y:0.382 },
  { id:172,x:0.920, y:0.392 },
  { id:173,x:0.944, y:0.400 },
  { id:174,x:0.965, y:0.408 },
];

const E = [
  // ── HEAD ──
  [0,1],[0,2],[1,2],[0,4],[1,3],[2,5],[3,4],[4,5],
  [3,6],[5,7],[4,6],[4,7],[6,7],[6,8],[7,9],[8,9],

  // left eye socket — tight triangulation
  [8,10],[10,11],[11,12],[12,14],[14,13],[13,10],[10,13],[11,14],
  // right eye socket
  [9,16],[15,16],[16,17],[17,18],[18,19],[19,15],[16,18],[15,17],

  // cheek structure
  [8,20],[13,20],[20,21],[9,21],[17,21],
  [20,22],[21,23],[22,23],[22,24],[23,25],[24,25],
  [24,26],[25,27],[26,27],[20,26],[21,27],

  // upper beak
  [26,28],[27,29],[28,29],
  [28,30],[29,31],[30,31],
  [30,32],[31,33],[32,33],
  [32,34],[33,35],[34,35],
  [34,36],[35,37],[36,37],
  [36,38],[37,38],

  // lower mandible
  [28,39],[29,40],[39,40],
  [39,41],[40,42],[41,42],
  [41,36],[42,37],

  // face triangulation
  [6,11],[7,15],[10,20],[13,22],[11,26],[12,26],[14,26],
  [3,8],[5,9],[0,4],[4,11],[4,15],

  // ── NECK → BODY ──
  [24,43],[25,44],[26,43],[27,44],[38,43],[38,44],[43,44],
  [43,45],[44,46],[45,46],[43,47],[44,47],[45,47],[46,47],
  [45,48],[46,49],[47,48],[47,49],[48,49],[48,50],[49,50],
  [48,51],[49,52],[50,51],[50,52],[51,52],[51,53],[52,53],
  [51,54],[52,55],[53,54],[53,55],[54,55],[54,56],[55,56],[53,56],
  [56,57],[56,58],[57,58],[54,57],[55,58],

  // ── TAIL — long dramatic fan ──
  [57,59],[58,61],[57,60],[58,60],[59,60],[60,61],
  [59,62],[59,63],[60,63],[60,64],[61,65],[61,66],
  [62,63],[63,64],[64,65],[65,66],
  [62,67],[63,67],[63,68],[64,68],[64,69],[65,69],[65,70],[66,70],[66,71],
  [67,68],[68,69],[69,70],[70,71],
  [67,72],[68,72],[69,73],[70,74],[71,74],
  [72,73],[73,74],
  [72,75],[73,75],[73,76],[74,76],[74,77],
  [75,76],[76,77],[75,78],[76,78],[77,78],

  // ── LEFT WING L1 ──
  [45,79],[45,80],[79,80],[79,83],[80,81],[81,82],[80,84],[81,84],
  [82,85],[82,86],[83,84],[84,85],[85,86],[83,87],[84,87],[84,88],
  [85,88],[86,89],[87,88],[88,89],[89,90],[86,90],[48,83],[48,87],

  // ── LEFT WING L2 ──
  [87,91],[88,92],[89,93],[90,94],[91,92],[92,93],[93,94],[94,95],[95,96],
  [91,97],[92,97],[92,98],[93,98],[93,99],[94,99],[94,100],[95,100],[95,101],[96,101],[96,102],
  [97,98],[98,99],[99,100],[100,101],[101,102],
  [51,91],[51,97],[48,91],

  // ── LEFT WING L3 ──
  [96,103],[102,103],[103,104],[104,105],[105,106],
  [102,107],[103,107],[104,107],[104,108],[105,108],[105,109],[106,109],[106,110],
  [107,108],[108,109],[109,110],
  [107,111],[108,111],[108,112],[109,112],[109,113],[110,113],
  [111,112],[112,113],

  // ── LEFT WINGTIP ──
  [106,114],[110,114],[113,114],[114,115],[115,116],[116,117],[117,118],
  [114,119],[115,119],[115,120],[116,120],[116,121],[117,121],[117,122],[118,122],
  [119,120],[120,121],[121,122],
  [119,123],[120,123],[120,124],[121,124],[121,125],[122,125],[122,126],
  [123,124],[124,125],[125,126],

  // ── RIGHT WING L1 ──
  [46,127],[46,128],[127,128],[127,131],[128,129],[129,130],[128,132],[129,132],
  [130,133],[130,134],[131,132],[132,133],[133,134],[131,135],[132,135],[132,136],
  [133,136],[134,137],[135,136],[136,137],[137,138],[134,138],[49,131],[49,135],

  // ── RIGHT WING L2 ──
  [135,139],[136,140],[137,141],[138,142],[139,140],[140,141],[141,142],[142,143],[143,144],
  [139,145],[140,145],[140,146],[141,146],[141,147],[142,147],[142,148],[143,148],[143,149],[144,149],[144,150],
  [145,146],[146,147],[147,148],[148,149],[149,150],
  [52,139],[52,145],[49,139],

  // ── RIGHT WING L3 ──
  [144,151],[150,151],[151,152],[152,153],[153,154],
  [150,155],[151,155],[152,155],[152,156],[153,156],[153,157],[154,157],[154,158],
  [155,156],[156,157],[157,158],
  [155,159],[156,159],[156,160],[157,160],[157,161],[158,161],
  [159,160],[160,161],

  // ── RIGHT WINGTIP ──
  [154,162],[158,162],[161,162],[162,163],[163,164],[164,165],[165,166],
  [162,167],[163,167],[163,168],[164,168],[164,169],[165,169],[165,170],[166,170],
  [167,168],[168,169],[169,170],
  [167,171],[168,171],[168,172],[169,172],[169,173],[170,173],[170,174],
  [171,172],[172,173],[173,174],

  // ── WING-BODY BRACING ──
  [45,127],[46,79],[47,79],[47,127],[47,80],[47,128],
];

export default function EagleReveal() {
  const canvasRef   = useRef(null);
  const targetMouse = useRef({ x: -9999, y: -9999 });
  const smoothMouse = useRef({ x: -9999, y: -9999 });
  const velocity    = useRef({ x: 0, y: 0 });
  const trail       = useRef([]);
  const rafRef      = useRef(null);
  const resizeTimer = useRef(null);
  const frameRef    = useRef(0);
  const TRAIL_LEN   = 32;

  const buildEdges = useCallback((W, H) => {
    // ✅ scaleY 0.94 — much taller body, fills almost full viewport height
    const scaleX = W * 0.96;
    const scaleY = H * 0.94;
    const offX   = W * 0.02;
    const offY   = H * 0.02;

    const nodes = N.map(n => ({
      x: offX + n.x * scaleX,
      y: offY + n.y * scaleY,
    }));

    return E.map(([a, b]) => {
      const na = nodes[a];
      const nb = nodes[b];
      if (!na || !nb) return null;
      const dx    = nb.x - na.x;
      const dy    = nb.y - na.y;
      const len   = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(10, Math.ceil(len / 5));
      const pts   = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        pts.push({ x: na.x + dx * t, y: na.y + dy * t });
      }
      return { pts, na, nb };
    }).filter(Boolean);
  }, []);

  const draw = useCallback((ctx, W, H, edges, mx, my, vx, vy, trailPts, frame) => {
    ctx.clearRect(0, 0, W, H);

    const minDim = Math.min(W, H);
    const REVEAL = minDim * 0.38;
    const GLOW   = minDim * 0.20;
    const pulse  = 0.92 + Math.sin(frame * 0.009) * 0.08;

    const speed = Math.sqrt(vx*vx + vy*vy);
    const hasSp = speed > 0.8;
    const nvx   = hasSp ? vx/speed : 0;
    const nvy   = hasSp ? vy/speed : 0;
    const dBias = Math.min(speed/14, 1.0);

    for (const edge of edges) {
      const { pts, na, nb } = edge;
      let tA = 0, tG = 0;

      for (let ti = 0; ti < trailPts.length; ti++) {
        const tp  = trailPts[ti];
        const age = ti / trailPts.length;
        const tr  = REVEAL * (1 - age * 0.55);
        const tf  = (1 - age) * (1 - age);
        for (const p of pts) {
          const d = Math.hypot(p.x-tp.x, p.y-tp.y);
          if (d > tr) continue;
          const a = ((1-Math.cos((1-d/tr)*Math.PI))/2)*tf*pulse;
          if (a > tA) tA = a;
          const gr = GLOW*(1-age*0.4);
          if (d < gr) {
            const g = ((1-Math.cos((1-d/gr)*Math.PI))/2)*tf*pulse;
            if (g > tG) tG = g;
          }
        }
      }

      let cA = 0, cG = 0;
      for (const p of pts) {
        const d = Math.hypot(p.x-mx, p.y-my);
        if (d > REVEAL) continue;
        let a = (1-Math.cos((1-d/REVEAL)*Math.PI))/2;
        if (hasSp && dBias > 0.05) {
          const dx2=mx-p.x, dy2=my-p.y;
          const dd=Math.sqrt(dx2*dx2+dy2*dy2)||1;
          const dot=(dx2/dd)*nvx+(dy2/dd)*nvy;
          a *= (1-dBias)+dBias*(0.3+0.7*Math.max(0,(dot+1)/2));
        }
        const fa=a*pulse;
        if (fa>cA) cA=fa;
        if (d<GLOW) {
          const g=((1-Math.cos((1-d/GLOW)*Math.PI))/2)*pulse;
          if (g>cG) cG=g;
        }
      }

      const fa=Math.max(tA,cA);
      const fg=Math.max(tG,cG);
      if (fa<0.004) continue;

      if (fg>0.01) {
        ctx.beginPath(); ctx.moveTo(na.x,na.y); ctx.lineTo(nb.x,nb.y);
        ctx.strokeStyle=`rgba(140,80,255,${fg*0.52})`;
        ctx.lineWidth=5.5; ctx.lineCap="round"; ctx.stroke();
      }

      ctx.beginPath(); ctx.moveTo(na.x,na.y); ctx.lineTo(nb.x,nb.y);
      ctx.strokeStyle=`rgba(228,198,255,${fa*0.95})`;
      ctx.lineWidth=1.1; ctx.lineCap="round"; ctx.stroke();

      if (fa>0.20) {
        for (const nd of [na,nb]) {
          ctx.beginPath(); ctx.arc(nd.x,nd.y,2.5,0,Math.PI*2);
          ctx.fillStyle=`rgba(215,185,255,${fa*0.88})`; ctx.fill();
        }
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, edges;

    const setup = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width=W*window.devicePixelRatio;
      canvas.height=H*window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
      edges = buildEdges(W,H);
    };

    const tick = () => {
      frameRef.current += 1;
      const sm=smoothMouse.current, tm=targetMouse.current;
      if (tm.x<0) {
        sm.x+= (-9999-sm.x)*0.04; sm.y+=(-9999-sm.y)*0.04;
        velocity.current={x:0,y:0}; trail.current=[];
      } else {
        const px=sm.x, py=sm.y;
        sm.x+=(tm.x-sm.x)*0.10; sm.y+=(tm.y-sm.y)*0.10;
        velocity.current.x+=((sm.x-px)-velocity.current.x)*0.25;
        velocity.current.y+=((sm.y-py)-velocity.current.y)*0.25;
        if (sm.x>0) {
          trail.current.unshift({x:sm.x,y:sm.y});
          if (trail.current.length>TRAIL_LEN) trail.current.length=TRAIL_LEN;
        }
      }
      draw(ctx,W,H,edges,sm.x,sm.y,velocity.current.x,velocity.current.y,trail.current,frameRef.current);
      rafRef.current=requestAnimationFrame(tick);
    };

    const onMove=(e)=>{ const r=canvas.getBoundingClientRect(); targetMouse.current={x:e.clientX-r.left,y:e.clientY-r.top}; };
    const onLeave=()=>{ targetMouse.current={x:-9999,y:-9999}; };
    const onResize=()=>{ clearTimeout(resizeTimer.current); resizeTimer.current=setTimeout(()=>{ ctx.setTransform(1,0,0,1,0,0); setup(); },120); };

    setup();
    rafRef.current=requestAnimationFrame(tick);
    canvas.addEventListener("mousemove",onMove);
    canvas.addEventListener("mouseleave",onLeave);
    window.addEventListener("resize",onResize);
    return ()=>{
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer.current);
      canvas.removeEventListener("mousemove",onMove);
      canvas.removeEventListener("mouseleave",onLeave);
      window.removeEventListener("resize",onResize);
    };
  },[buildEdges,draw]);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight:"100vh", background:"radial-gradient(ellipse 80% 70% at 50% 50%, #0a0614 0%, #050408 50%, #020203 100%)" }}>
      <div className="pointer-events-none absolute inset-0 z-[1]" style={{ background:"radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)" }} />
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-start px-8 pt-8 sm:px-14 sm:pt-12">
        <div className="grid grid-cols-2 gap-y-3 sm:gap-y-4 w-fit">
          {["Projects","Events","Research","Contact","Network","Privacy policies","Impressum","Work with us"].map(item=>(
            <span key={item} className="pointer-events-auto font-ppneue cursor-pointer text-[15px] sm:text-[18px] font-light tracking-[0.02em] text-white/70 transition-colors duration-300 hover:text-white pr-20">{item}</span>
          ))}
        </div>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 z-[2] h-full w-full" style={{cursor:"default"}} />
    </section>
  );
}