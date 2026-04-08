"use client";

import { useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────
// Eagle Head — side profile, facing right
// Meticulously traced from reference image
// 200+ nodes across: skull, brow, eye, beak, feather layers, chest
// Coords normalized 0→1, eagle occupies center of canvas
// ─────────────────────────────────────────────────────────────────────

const N = [
  // ── SKULL OUTLINE (0–14) ──
  { id:0,  x:0.420, y:0.048 }, // crown back-top
  { id:1,  x:0.480, y:0.032 }, // crown peak
  { id:2,  x:0.548, y:0.038 }, // forehead top
  { id:3,  x:0.598, y:0.055 }, // forehead front
  { id:4,  x:0.628, y:0.078 }, // brow front
  { id:5,  x:0.638, y:0.102 }, // brow ridge front
  { id:6,  x:0.385, y:0.062 }, // skull back upper
  { id:7,  x:0.358, y:0.088 }, // skull back mid
  { id:8,  x:0.345, y:0.118 }, // skull back lower
  { id:9,  x:0.352, y:0.148 }, // occiput
  { id:10, x:0.368, y:0.175 }, // nape upper
  { id:11, x:0.390, y:0.198 }, // nape mid
  { id:12, x:0.415, y:0.218 }, // nape lower
  { id:13, x:0.445, y:0.235 }, // neck back upper
  { id:14, x:0.478, y:0.248 }, // neck back mid

  // ── CROWN FEATHER LAYERS (15–34) ──
  { id:15, x:0.438, y:0.058 }, // crown layer 1a
  { id:16, x:0.462, y:0.045 }, // crown layer 1b
  { id:17, x:0.498, y:0.042 }, // crown layer 1c
  { id:18, x:0.528, y:0.048 }, // crown layer 1d
  { id:19, x:0.558, y:0.058 }, // crown layer 1e
  { id:20, x:0.422, y:0.072 }, // crown layer 2a
  { id:21, x:0.448, y:0.062 }, // crown layer 2b
  { id:22, x:0.475, y:0.055 }, // crown layer 2c
  { id:23, x:0.510, y:0.058 }, // crown layer 2d
  { id:24, x:0.540, y:0.068 }, // crown layer 2e
  { id:25, x:0.565, y:0.078 }, // crown layer 2f
  { id:26, x:0.408, y:0.082 }, // crown layer 3a
  { id:27, x:0.435, y:0.075 }, // crown layer 3b
  { id:28, x:0.462, y:0.070 }, // crown layer 3c
  { id:29, x:0.492, y:0.072 }, // crown layer 3d
  { id:30, x:0.522, y:0.080 }, // crown layer 3e
  { id:31, x:0.548, y:0.092 }, // crown layer 3f
  { id:32, x:0.570, y:0.105 }, // crown layer 3g
  { id:33, x:0.398, y:0.095 }, // crown base left
  { id:34, x:0.428, y:0.090 }, // crown base right

  // ── BROW RIDGE & SUPRAORBITAL (35–42) ──
  { id:35, x:0.572, y:0.112 }, // supraorbital front
  { id:36, x:0.560, y:0.122 }, // brow inner
  { id:37, x:0.542, y:0.118 }, // brow mid
  { id:38, x:0.522, y:0.112 }, // brow outer
  { id:39, x:0.505, y:0.108 }, // brow back
  { id:40, x:0.488, y:0.105 }, // brow back outer
  { id:41, x:0.470, y:0.102 }, // postorbital
  { id:42, x:0.452, y:0.098 }, // postorbital back

  // ── EYE (43–58) ──
  { id:43, x:0.545, y:0.132 }, // eye front upper
  { id:44, x:0.528, y:0.125 }, // eye top mid-front
  { id:45, x:0.510, y:0.122 }, // eye top center
  { id:46, x:0.492, y:0.124 }, // eye top mid-back
  { id:47, x:0.475, y:0.130 }, // eye back upper
  { id:48, x:0.468, y:0.142 }, // eye back mid
  { id:49, x:0.472, y:0.155 }, // eye back lower
  { id:50, x:0.485, y:0.162 }, // eye bottom back
  { id:51, x:0.502, y:0.165 }, // eye bottom center
  { id:52, x:0.520, y:0.162 }, // eye bottom front
  { id:53, x:0.535, y:0.155 }, // eye front lower
  { id:54, x:0.544, y:0.145 }, // eye front mid
  // iris ring
  { id:55, x:0.515, y:0.132 }, // iris top
  { id:56, x:0.530, y:0.142 }, // iris front
  { id:57, x:0.525, y:0.155 }, // iris bottom
  { id:58, x:0.508, y:0.150 }, // iris back
  // pupil
  { id:59, x:0.520, y:0.142 }, // pupil center

  // ── FACE / CERE (60–68) ──
  { id:60, x:0.600, y:0.115 }, // cere upper
  { id:61, x:0.618, y:0.128 }, // cere front
  { id:62, x:0.610, y:0.142 }, // cere lower
  { id:63, x:0.590, y:0.135 }, // cere back
  { id:64, x:0.578, y:0.122 }, // face front upper
  { id:65, x:0.570, y:0.138 }, // face front mid
  { id:66, x:0.562, y:0.152 }, // face front lower
  { id:67, x:0.552, y:0.165 }, // cheek upper
  { id:68, x:0.545, y:0.178 }, // cheek lower

  // ── BEAK — upper mandible (69–86) ──
  { id:69, x:0.628, y:0.112 }, // culmen base
  { id:70, x:0.652, y:0.125 }, // culmen mid-upper
  { id:71, x:0.672, y:0.142 }, // culmen mid
  { id:72, x:0.688, y:0.162 }, // culmen lower-mid
  { id:73, x:0.698, y:0.182 }, // culmen near-tip
  { id:74, x:0.702, y:0.205 }, // beak tip upper
  { id:75, x:0.695, y:0.225 }, // hook apex
  { id:76, x:0.680, y:0.238 }, // hook curve
  { id:77, x:0.662, y:0.245 }, // hook lower
  { id:78, x:0.642, y:0.242 }, // hook base lower
  { id:79, x:0.638, y:0.155 }, // tomium upper front
  { id:80, x:0.648, y:0.172 }, // tomium upper mid
  { id:81, x:0.655, y:0.192 }, // tomium upper lower
  { id:82, x:0.658, y:0.212 }, // tomium near tip
  { id:83, x:0.618, y:0.145 }, // culmen ridge inner
  { id:84, x:0.632, y:0.162 }, // culmen ridge mid
  { id:85, x:0.638, y:0.182 }, // culmen ridge lower
  { id:86, x:0.640, y:0.202 }, // culmen ridge near-tip

  // ── BEAK — lower mandible (87–96) ──
  { id:87, x:0.622, y:0.185 }, // ramus base
  { id:88, x:0.638, y:0.195 }, // ramus front
  { id:89, x:0.650, y:0.210 }, // gnathion
  { id:90, x:0.655, y:0.225 }, // tip lower
  { id:91, x:0.648, y:0.238 }, // lower tip
  { id:92, x:0.610, y:0.198 }, // lower tomium back
  { id:93, x:0.625, y:0.208 }, // lower tomium mid
  { id:94, x:0.605, y:0.215 }, // chin
  { id:95, x:0.592, y:0.228 }, // gular upper
  { id:96, x:0.578, y:0.242 }, // gular lower

  // ── THROAT & NECK FRONT (97–108) ──
  { id:97,  x:0.565, y:0.195 }, // throat upper
  { id:98,  x:0.555, y:0.215 }, // throat mid
  { id:99,  x:0.548, y:0.238 }, // throat lower
  { id:100, x:0.540, y:0.262 }, // neck front upper
  { id:101, x:0.532, y:0.285 }, // neck front mid
  { id:102, x:0.525, y:0.312 }, // neck front lower
  { id:103, x:0.518, y:0.342 }, // chest front upper
  { id:104, x:0.512, y:0.372 }, // chest front mid
  { id:105, x:0.508, y:0.405 }, // chest front lower
  { id:106, x:0.505, y:0.438 }, // breast upper
  { id:107, x:0.502, y:0.472 }, // breast mid
  { id:108, x:0.500, y:0.510 }, // breast lower

  // ── NECK BACK & SHOULDER (109–118) ──
  { id:109, x:0.495, y:0.265 }, // neck back upper
  { id:110, x:0.485, y:0.295 }, // neck back mid
  { id:111, x:0.475, y:0.325 }, // neck back lower
  { id:112, x:0.462, y:0.358 }, // shoulder upper
  { id:113, x:0.448, y:0.392 }, // shoulder mid
  { id:114, x:0.435, y:0.428 }, // shoulder lower
  { id:115, x:0.422, y:0.462 }, // wing fold upper
  { id:116, x:0.410, y:0.498 }, // wing fold mid
  { id:117, x:0.398, y:0.535 }, // wing fold lower
  { id:118, x:0.385, y:0.572 }, // back lower

  // ── NECK FEATHER LAYERS — back of neck (119–145) ──
  { id:119, x:0.478, y:0.258 }, // nape feather 1a
  { id:120, x:0.465, y:0.272 }, // nape feather 1b
  { id:121, x:0.452, y:0.285 }, // nape feather 1c
  { id:122, x:0.440, y:0.265 }, // nape feather 2a
  { id:123, x:0.428, y:0.278 }, // nape feather 2b
  { id:124, x:0.418, y:0.295 }, // nape feather 2c
  { id:125, x:0.408, y:0.312 }, // nape feather 2d
  { id:126, x:0.450, y:0.305 }, // collar feather 1a
  { id:127, x:0.438, y:0.322 }, // collar feather 1b
  { id:128, x:0.425, y:0.338 }, // collar feather 1c
  { id:129, x:0.412, y:0.355 }, // collar feather 1d
  { id:130, x:0.462, y:0.325 }, // collar feather 2a
  { id:131, x:0.450, y:0.345 }, // collar feather 2b
  { id:132, x:0.438, y:0.365 }, // collar feather 2c
  { id:133, x:0.425, y:0.382 }, // collar feather 2d
  { id:134, x:0.472, y:0.348 }, // mantle feather 1a
  { id:135, x:0.460, y:0.368 }, // mantle feather 1b
  { id:136, x:0.448, y:0.388 }, // mantle feather 1c
  { id:137, x:0.435, y:0.408 }, // mantle feather 1d
  { id:138, x:0.482, y:0.375 }, // mantle feather 2a
  { id:139, x:0.470, y:0.398 }, // mantle feather 2b
  { id:140, x:0.458, y:0.418 }, // mantle feather 2c
  { id:141, x:0.445, y:0.438 }, // mantle feather 2d
  { id:142, x:0.492, y:0.402 }, // scapular 1a
  { id:143, x:0.480, y:0.425 }, // scapular 1b
  { id:144, x:0.468, y:0.448 }, // scapular 1c
  { id:145, x:0.455, y:0.468 }, // scapular 1d

  // ── CHEST FEATHER LAYERS (146–178) ──
  { id:146, x:0.522, y:0.298 }, // chest feather 1a
  { id:147, x:0.515, y:0.318 }, // chest feather 1b
  { id:148, x:0.510, y:0.338 }, // chest feather 1c
  { id:149, x:0.505, y:0.358 }, // chest feather 1d
  { id:150, x:0.498, y:0.328 }, // chest feather 2a
  { id:151, x:0.492, y:0.348 }, // chest feather 2b
  { id:152, x:0.488, y:0.368 }, // chest feather 2c
  { id:153, x:0.484, y:0.388 }, // chest feather 2d
  { id:154, x:0.510, y:0.385 }, // breast feather 1a
  { id:155, x:0.505, y:0.408 }, // breast feather 1b
  { id:156, x:0.500, y:0.432 }, // breast feather 1c
  { id:157, x:0.495, y:0.455 }, // breast feather 1d
  { id:158, x:0.488, y:0.478 }, // breast feather 1e
  { id:159, x:0.498, y:0.415 }, // breast feather 2a
  { id:160, x:0.493, y:0.438 }, // breast feather 2b
  { id:161, x:0.488, y:0.462 }, // breast feather 2c
  { id:162, x:0.482, y:0.485 }, // breast feather 2d
  { id:163, x:0.475, y:0.508 }, // breast feather 2e
  { id:164, x:0.505, y:0.445 }, // lower breast 1a
  { id:165, x:0.500, y:0.468 }, // lower breast 1b
  { id:166, x:0.495, y:0.492 }, // lower breast 1c
  { id:167, x:0.490, y:0.515 }, // lower breast 1d
  { id:168, x:0.485, y:0.538 }, // lower breast 1e
  { id:169, x:0.478, y:0.528 }, // lower breast 2a
  { id:170, x:0.472, y:0.552 }, // lower breast 2b
  { id:171, x:0.465, y:0.575 }, // lower breast 2c
  { id:172, x:0.458, y:0.598 }, // lower breast 2d
  { id:173, x:0.452, y:0.620 }, // lower breast 2e
  { id:174, x:0.470, y:0.545 }, // belly feather 1a
  { id:175, x:0.462, y:0.568 }, // belly feather 1b
  { id:176, x:0.455, y:0.592 }, // belly feather 1c
  { id:177, x:0.448, y:0.615 }, // belly feather 1d
  { id:178, x:0.440, y:0.638 }, // belly feather 1e
];

const E = [
  // ── SKULL OUTLINE ──
  [0,1],[1,2],[2,3],[3,4],[4,5],[0,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],
  [1,15],[15,16],[16,17],[17,18],[18,19],[0,15],[6,20],

  // ── CROWN FEATHER LAYERS ──
  [15,20],[16,21],[17,22],[18,23],[19,24],[19,25],[5,25],
  [20,26],[21,27],[22,28],[23,29],[24,30],[25,31],[5,32],[4,32],
  [26,33],[27,34],[20,33],[21,34],[26,34],[33,34],
  [28,29],[29,30],[30,31],[31,32],[27,28],[34,27],
  [26,7],[33,8],[20,8],[6,26],

  // ── BROW RIDGE ──
  [4,35],[5,35],[35,36],[36,37],[37,38],[38,39],[39,40],[40,41],[41,42],
  [35,64],[36,65],[37,43],[38,44],[39,45],[40,46],[41,47],[42,48],
  [31,38],[32,35],[30,39],[29,40],[28,41],[27,42],

  // ── EYE SOCKET ──
  [43,44],[44,45],[45,46],[46,47],[47,48],[48,49],[49,50],[50,51],[51,52],[52,53],[53,54],[54,43],
  // iris
  [55,56],[56,57],[57,58],[58,55],
  [55,45],[56,53],[57,51],[58,47],
  // pupil to iris
  [59,55],[59,56],[59,57],[59,58],
  // brow to eye
  [43,35],[43,36],[44,36],[45,37],[46,38],[47,39],[48,40],[54,65],[53,66],[52,67],

  // ── CERE & FACE ──
  [60,61],[61,62],[62,63],[63,64],[64,60],[60,69],[61,69],[62,79],[63,65],
  [64,65],[65,66],[66,67],[67,68],[65,43],[66,54],[67,53],[68,52],
  [5,60],[4,60],[35,64],[36,65],

  // ── UPPER MANDIBLE ──
  [69,70],[70,71],[71,72],[72,73],[73,74],[74,75],[75,76],[76,77],[77,78],
  [69,79],[79,80],[80,81],[81,82],[82,78],[82,77],
  [69,83],[83,84],[84,85],[85,86],[86,82],
  [79,83],[80,84],[81,85],[82,86],
  [70,79],[71,80],[72,81],[73,82],
  [61,69],[62,79],[63,83],

  // ── LOWER MANDIBLE ──
  [87,88],[88,89],[89,90],[90,91],[91,78],[90,82],
  [87,92],[92,93],[93,89],[93,90],
  [87,94],[94,95],[95,96],[96,99],
  [92,94],[93,95],[88,93],[87,88],
  [68,87],[67,92],[66,94],[65,97],

  // ── THROAT & NECK FRONT ──
  [96,97],[97,98],[98,99],[99,100],[100,101],[101,102],[102,103],[103,104],[104,105],[105,106],[106,107],[107,108],
  [68,97],[67,98],[66,99],
  [97,100],[98,101],[99,102],[100,103],[101,104],[102,105],[103,106],[104,107],[105,108],

  // ── NECK BACK ──
  [14,109],[109,110],[110,111],[111,112],[112,113],[113,114],[114,115],[115,116],[116,117],[117,118],
  [13,109],[12,119],[11,120],[10,121],

  // ── NAPE FEATHERS ──
  [14,119],[119,120],[120,121],[13,119],[12,120],[11,121],
  [13,122],[122,123],[123,124],[124,125],[12,122],[11,123],[10,124],[9,125],
  [119,122],[120,123],[121,124],
  [121,126],[126,127],[127,128],[128,129],[122,126],[123,127],[124,128],[125,129],
  [109,126],[110,127],[111,128],[112,129],

  // ── COLLAR FEATHERS ──
  [110,130],[130,131],[131,132],[132,133],[111,130],[112,131],[113,132],[114,133],
  [126,130],[127,131],[128,132],[129,133],

  // ── MANTLE FEATHERS ──
  [111,134],[134,135],[135,136],[136,137],[112,134],[113,135],[114,136],[115,137],
  [130,134],[131,135],[132,136],[133,137],
  [112,138],[138,139],[139,140],[140,141],[113,138],[114,139],[115,140],[116,141],
  [134,138],[135,139],[136,140],[137,141],

  // ── SCAPULAR FEATHERS ──
  [113,142],[142,143],[143,144],[144,145],[114,142],[115,143],[116,144],[117,145],
  [138,142],[139,143],[140,144],[141,145],

  // ── CHEST FEATHERS ──
  [102,146],[146,147],[147,148],[148,149],[103,146],[104,147],[105,148],[106,149],
  [101,150],[150,151],[151,152],[152,153],[102,150],[103,151],[104,152],[105,153],
  [146,150],[147,151],[148,152],[149,153],

  // ── BREAST FEATHERS ──
  [105,154],[154,155],[155,156],[156,157],[157,158],[106,154],[107,155],[108,156],
  [106,159],[159,160],[160,161],[161,162],[162,163],[107,159],[108,160],
  [154,159],[155,160],[156,161],[157,162],[158,163],
  [149,154],[153,159],[152,155],[151,150],

  // ── LOWER BREAST & BELLY ──
  [107,164],[164,165],[165,166],[166,167],[167,168],[108,164],
  [108,169],[169,170],[170,171],[171,172],[172,173],
  [164,169],[165,170],[166,171],[167,172],[168,173],
  [163,169],[162,170],[161,171],[160,172],

  // ── BELLY FEATHERS ──
  [168,174],[174,175],[175,176],[176,177],[177,178],
  [173,174],[172,175],[171,176],[170,177],
  [169,174],[170,175],[171,176],[172,177],[173,178],

  // ── CROSS STRUCTURE ──
  [109,119],[110,122],[111,126],[112,130],[113,134],[114,138],[115,142],
  [100,109],[101,110],[102,111],[103,112],[104,113],[105,114],[106,115],[107,116],[108,117],
  [100,146],[101,150],[102,146],[103,154],[104,159],[105,164],[106,169],[107,174],
];

export default function EagleHeadReveal() {
  const canvasRef   = useRef(null);
  const targetMouse = useRef({ x: -9999, y: -9999 });
  const smoothMouse = useRef({ x: -9999, y: -9999 });
  const velocity    = useRef({ x: 0, y: 0 });
  const trail       = useRef([]);
  const rafRef      = useRef(null);
  const resizeTimer = useRef(null);
  const frameRef    = useRef(0);
  const TRAIL_LEN   = 36;

  const buildEdges = useCallback((W, H) => {
    // Head fills 80% width, centered slightly left (profile faces right)
    const scaleX = W * 0.78;
    const scaleY = H * 0.88;
    const offX   = W * 0.11;
    const offY   = H * 0.04;

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
      const steps = Math.max(8, Math.ceil(len / 4));
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
    const REVEAL = minDim * 0.32;
    const GLOW   = minDim * 0.18;
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
        const fa = a*pulse;
        if (fa > cA) cA = fa;
        if (d < GLOW) {
          const g = ((1-Math.cos((1-d/GLOW)*Math.PI))/2)*pulse;
          if (g > cG) cG = g;
        }
      }

      const fa = Math.max(tA, cA);
      const fg = Math.max(tG, cG);
      if (fa < 0.004) continue;

      // Outer glow
      if (fg > 0.01) {
        ctx.beginPath(); ctx.moveTo(na.x,na.y); ctx.lineTo(nb.x,nb.y);
        ctx.strokeStyle = `rgba(140,80,255,${fg*0.50})`;
        ctx.lineWidth = 5.5; ctx.lineCap = "round"; ctx.stroke();
      }

      // Core line
      ctx.beginPath(); ctx.moveTo(na.x,na.y); ctx.lineTo(nb.x,nb.y);
      ctx.strokeStyle = `rgba(228,198,255,${fa*0.95})`;
      ctx.lineWidth = 1.0; ctx.lineCap = "round"; ctx.stroke();

      // Nodes
      if (fa > 0.18) {
        for (const nd of [na, nb]) {
          ctx.beginPath(); ctx.arc(nd.x,nd.y,2.2,0,Math.PI*2);
          ctx.fillStyle = `rgba(215,185,255,${fa*0.85})`; ctx.fill();
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
      canvas.width = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      edges = buildEdges(W, H);
    };

    const tick = () => {
      frameRef.current += 1;
      const sm = smoothMouse.current, tm = targetMouse.current;
      if (tm.x < 0) {
        sm.x += (-9999-sm.x)*0.04; sm.y += (-9999-sm.y)*0.04;
        velocity.current = {x:0,y:0}; trail.current = [];
      } else {
        const px = sm.x, py = sm.y;
        sm.x += (tm.x-sm.x)*0.10; sm.y += (tm.y-sm.y)*0.10;
        velocity.current.x += ((sm.x-px)-velocity.current.x)*0.25;
        velocity.current.y += ((sm.y-py)-velocity.current.y)*0.25;
        if (sm.x > 0) {
          trail.current.unshift({x:sm.x, y:sm.y});
          if (trail.current.length > TRAIL_LEN) trail.current.length = TRAIL_LEN;
        }
      }
      draw(ctx,W,H,edges,sm.x,sm.y,velocity.current.x,velocity.current.y,trail.current,frameRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      targetMouse.current = {x: e.clientX-r.left, y: e.clientY-r.top};
    };
    const onLeave = () => { targetMouse.current = {x:-9999, y:-9999}; };
    const onResize = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => { ctx.setTransform(1,0,0,1,0,0); setup(); }, 120);
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
  }, [buildEdges, draw]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse 70% 80% at 55% 40%, #0c0618 0%, #060410 45%, #020208 100%)",
      }}
    >
      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "radial-gradient(ellipse 90% 90% at 55% 45%, transparent 35%, rgba(0,0,0,0.72) 100%)" }}
      />

      {/* Label */}
      <div className="pointer-events-none absolute bottom-8 left-0 right-0 z-20 flex justify-center">
        <span className="font-ppneue text-[11px] tracking-[0.25em] text-white/25 uppercase">
          Move cursor to reveal
        </span>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[2] h-full w-full"
        style={{ cursor: "default" }}
      />
    </section>
  );
}