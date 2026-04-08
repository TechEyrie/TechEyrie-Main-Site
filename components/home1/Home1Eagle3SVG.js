"use client";

import { useEffect, useRef, useCallback } from "react";

const N = [
  // ══ HEAD (0–45) ══
  { id:0,  x:0.615, y:0.272 }, // crown peak
  { id:1,  x:0.595, y:0.255 }, // forehead
  { id:2,  x:0.575, y:0.245 }, // brow front
  { id:3,  x:0.558, y:0.238 }, // brow tip
  { id:4,  x:0.635, y:0.280 }, // skull back top
  { id:5,  x:0.652, y:0.295 }, // skull back
  { id:6,  x:0.645, y:0.312 }, // nape
  { id:7,  x:0.628, y:0.265 }, // crown mid
  { id:8,  x:0.608, y:0.258 }, // crown front
  // brow ridge
  { id:9,  x:0.555, y:0.255 }, // brow outer
  { id:10, x:0.562, y:0.248 }, // brow peak
  { id:11, x:0.572, y:0.244 }, // brow inner
  // eye socket
  { id:12, x:0.545, y:0.265 }, // eye back top
  { id:13, x:0.555, y:0.260 }, // eye top-back
  { id:14, x:0.566, y:0.257 }, // eye top-mid
  { id:15, x:0.576, y:0.258 }, // eye top-front
  { id:16, x:0.582, y:0.265 }, // eye front top
  { id:17, x:0.584, y:0.274 }, // eye front
  { id:18, x:0.580, y:0.283 }, // eye front-low
  { id:19, x:0.572, y:0.288 }, // eye bottom-front
  { id:20, x:0.561, y:0.290 }, // eye bottom-mid
  { id:21, x:0.550, y:0.287 }, // eye bottom-back
  { id:22, x:0.544, y:0.278 }, // eye back-low
  { id:23, x:0.542, y:0.270 }, // eye back
  // iris
  { id:24, x:0.563, y:0.262 }, // iris top
  { id:25, x:0.572, y:0.268 }, // iris front
  { id:26, x:0.568, y:0.278 }, // iris bottom
  { id:27, x:0.558, y:0.273 }, // iris back
  { id:28, x:0.565, y:0.272 }, // pupil
  // cere & face
  { id:29, x:0.545, y:0.248 }, // cere top
  { id:30, x:0.532, y:0.245 }, // cere front
  { id:31, x:0.525, y:0.255 }, // cere low
  { id:32, x:0.535, y:0.262 }, // face mid
  { id:33, x:0.528, y:0.270 }, // face lower
  // upper beak
  { id:34, x:0.522, y:0.242 }, // culmen base
  { id:35, x:0.502, y:0.240 }, // culmen mid-upper
  { id:36, x:0.482, y:0.244 }, // culmen mid
  { id:37, x:0.462, y:0.252 }, // culmen lower-mid
  { id:38, x:0.445, y:0.262 }, // culmen near-tip
  { id:39, x:0.432, y:0.275 }, // hook top
  { id:40, x:0.424, y:0.290 }, // hook apex
  { id:41, x:0.428, y:0.304 }, // hook tip
  { id:42, x:0.436, y:0.312 }, // hook lower
  { id:43, x:0.510, y:0.248 }, // tomium upper
  { id:44, x:0.490, y:0.254 }, // tomium mid
  { id:45, x:0.468, y:0.264 }, // tomium lower
  // lower beak
  { id:46, x:0.525, y:0.268 }, // ramus base
  { id:47, x:0.510, y:0.272 }, // ramus mid
  { id:48, x:0.492, y:0.276 }, // lower mid
  { id:49, x:0.474, y:0.282 }, // gnathion
  { id:50, x:0.458, y:0.292 }, // lower tip
  { id:51, x:0.446, y:0.302 }, // lower hook
  // chin / throat
  { id:52, x:0.532, y:0.280 }, // chin
  { id:53, x:0.538, y:0.295 }, // throat upper
  { id:54, x:0.542, y:0.312 }, // throat mid
  { id:55, x:0.545, y:0.330 }, // throat lower

  // ══ NECK & BODY (56–105) ══
  // neck back
  { id:56, x:0.592, y:0.322 }, // neck back upper
  { id:57, x:0.578, y:0.340 }, // neck back mid
  { id:58, x:0.562, y:0.358 }, // neck back lower
  { id:59, x:0.548, y:0.375 }, // shoulder back
  // neck front
  { id:60, x:0.548, y:0.310 }, // neck front upper
  { id:61, x:0.542, y:0.328 }, // neck front mid
  { id:62, x:0.535, y:0.348 }, // neck front lower
  { id:63, x:0.528, y:0.365 }, // chest upper
  // chest
  { id:64, x:0.540, y:0.388 }, // chest left
  { id:65, x:0.555, y:0.395 }, // chest right
  { id:66, x:0.548, y:0.412 }, // chest center
  // belly
  { id:67, x:0.538, y:0.432 }, // belly upper-left
  { id:68, x:0.550, y:0.435 }, // belly upper-right
  { id:69, x:0.544, y:0.455 }, // belly mid
  { id:70, x:0.538, y:0.475 }, // belly lower-left
  { id:71, x:0.548, y:0.478 }, // belly lower-right
  { id:72, x:0.542, y:0.498 }, // lower body
  { id:73, x:0.536, y:0.518 }, // body base left
  { id:74, x:0.548, y:0.520 }, // body base right
  // body feather columns — left side
  { id:75, x:0.555, y:0.375 }, // scapular col-A top
  { id:76, x:0.558, y:0.395 }, // scapular col-A mid
  { id:77, x:0.562, y:0.415 }, // scapular col-A low
  { id:78, x:0.565, y:0.435 }, // back col-A
  { id:79, x:0.568, y:0.455 }, // back col-A low
  { id:80, x:0.570, y:0.475 }, // back col-A lower
  // body feather columns — right side
  { id:81, x:0.548, y:0.355 }, // chest col-B top
  { id:82, x:0.542, y:0.375 }, // chest col-B mid
  { id:83, x:0.536, y:0.395 }, // chest col-B low
  { id:84, x:0.530, y:0.415 }, // breast col-B
  { id:85, x:0.525, y:0.435 }, // breast col-B low
  { id:86, x:0.520, y:0.455 }, // belly col-B
  { id:87, x:0.515, y:0.475 }, // belly col-B low
  { id:88, x:0.510, y:0.495 }, // belly col-B lower
  { id:89, x:0.505, y:0.515 }, // belly col-B base
  // neck feather detail
  { id:90, x:0.558, y:0.325 }, // neck feather A
  { id:91, x:0.552, y:0.340 }, // neck feather B
  { id:92, x:0.545, y:0.355 }, // neck feather C
  { id:93, x:0.538, y:0.325 }, // neck feather D
  { id:94, x:0.532, y:0.342 }, // neck feather E
  { id:95, x:0.528, y:0.358 }, // neck feather F
  // extra chest rows
  { id:96, x:0.555, y:0.358 }, // chest extra 1
  { id:97, x:0.560, y:0.375 }, // chest extra 2
  { id:98, x:0.563, y:0.395 }, // chest extra 3
  { id:99, x:0.533, y:0.408 }, // breast extra 1
  { id:100,x:0.528, y:0.428 }, // breast extra 2
  { id:101,x:0.524, y:0.448 }, // breast extra 3
  { id:102,x:0.520, y:0.468 }, // breast extra 4
  { id:103,x:0.516, y:0.488 }, // breast extra 5
  { id:104,x:0.512, y:0.508 }, // breast extra 6
  { id:105,x:0.508, y:0.525 }, // breast extra 7

  // ══ LEFT WING — 11 primaries, dense coverts (106–215) ══
  // wing root
  { id:106,x:0.525, y:0.345 }, // wing root front
  { id:107,x:0.542, y:0.340 }, // wing root back
  // primary shaft bases (leading edge of wing)
  { id:108,x:0.508, y:0.322 }, // P-base 1
  { id:109,x:0.488, y:0.305 }, // P-base 2
  { id:110,x:0.465, y:0.290 }, // P-base 3
  { id:111,x:0.440, y:0.276 }, // P-base 4
  { id:112,x:0.415, y:0.263 }, // P-base 5
  { id:113,x:0.388, y:0.252 }, // P-base 6
  { id:114,x:0.360, y:0.242 }, // P-base 7
  { id:115,x:0.330, y:0.235 }, // P-base 8
  { id:116,x:0.298, y:0.230 }, // P-base 9
  { id:117,x:0.265, y:0.228 }, // P-base 10
  { id:118,x:0.232, y:0.230 }, // P-base 11
  // primary tips — spread upward dramatically
  { id:119,x:0.495, y:0.298 }, // P1 tip
  { id:120,x:0.472, y:0.274 }, // P2 tip
  { id:121,x:0.446, y:0.254 }, // P3 tip
  { id:122,x:0.419, y:0.237 }, // P4 tip
  { id:123,x:0.390, y:0.222 }, // P5 tip
  { id:124,x:0.360, y:0.210 }, // P6 tip
  { id:125,x:0.328, y:0.200 }, // P7 tip
  { id:126,x:0.294, y:0.192 }, // P8 tip
  { id:127,x:0.260, y:0.188 }, // P9 tip
  { id:128,x:0.225, y:0.185 }, // P10 tip
  { id:129,x:0.190, y:0.188 }, // P11 tip
  // primary mid-shafts (for feather detail)
  { id:130,x:0.502, y:0.310 }, // P1 mid
  { id:131,x:0.480, y:0.290 }, // P2 mid
  { id:132,x:0.456, y:0.272 }, // P3 mid
  { id:133,x:0.430, y:0.258 }, // P4 mid
  { id:134,x:0.402, y:0.245 }, // P5 mid
  { id:135,x:0.373, y:0.235 }, // P6 mid
  { id:136,x:0.343, y:0.226 }, // P7 mid
  { id:137,x:0.310, y:0.220 }, // P8 mid
  { id:138,x:0.278, y:0.216 }, // P9 mid
  { id:139,x:0.245, y:0.214 }, // P10 mid
  { id:140,x:0.212, y:0.215 }, // P11 mid
  // alula (bastard wing)
  { id:141,x:0.488, y:0.296 }, // alula base
  { id:142,x:0.475, y:0.280 }, // alula 1
  { id:143,x:0.462, y:0.265 }, // alula 2
  { id:144,x:0.448, y:0.255 }, // alula 3
  { id:145,x:0.435, y:0.250 }, // alula tip
  // primary upper coverts row
  { id:146,x:0.512, y:0.332 }, // PUC 1
  { id:147,x:0.494, y:0.318 }, // PUC 2
  { id:148,x:0.472, y:0.305 }, // PUC 3
  { id:149,x:0.450, y:0.292 }, // PUC 4
  { id:150,x:0.426, y:0.280 }, // PUC 5
  { id:151,x:0.400, y:0.269 }, // PUC 6
  { id:152,x:0.372, y:0.260 }, // PUC 7
  { id:153,x:0.342, y:0.253 }, // PUC 8
  { id:154,x:0.310, y:0.248 }, // PUC 9
  { id:155,x:0.278, y:0.245 }, // PUC 10
  // secondary coverts row 1
  { id:156,x:0.522, y:0.355 }, // SC1 1
  { id:157,x:0.504, y:0.345 }, // SC1 2
  { id:158,x:0.484, y:0.335 }, // SC1 3
  { id:159,x:0.462, y:0.325 }, // SC1 4
  { id:160,x:0.440, y:0.316 }, // SC1 5
  { id:161,x:0.416, y:0.308 }, // SC1 6
  { id:162,x:0.390, y:0.300 }, // SC1 7
  { id:163,x:0.362, y:0.292 }, // SC1 8
  { id:164,x:0.332, y:0.285 }, // SC1 9
  { id:165,x:0.300, y:0.280 }, // SC1 10
  // secondary tips row 1
  { id:166,x:0.518, y:0.370 }, // ST1 1
  { id:167,x:0.498, y:0.364 }, // ST1 2
  { id:168,x:0.476, y:0.358 }, // ST1 3
  { id:169,x:0.454, y:0.352 }, // ST1 4
  { id:170,x:0.430, y:0.345 }, // ST1 5
  { id:171,x:0.405, y:0.338 }, // ST1 6
  { id:172,x:0.378, y:0.330 }, // ST1 7
  { id:173,x:0.348, y:0.323 }, // ST1 8
  { id:174,x:0.316, y:0.318 }, // ST1 9
  { id:175,x:0.282, y:0.313 }, // ST1 10
  // greater coverts
  { id:176,x:0.524, y:0.382 }, // GC 1
  { id:177,x:0.505, y:0.376 }, // GC 2
  { id:178,x:0.484, y:0.370 }, // GC 3
  { id:179,x:0.460, y:0.364 }, // GC 4
  { id:180,x:0.436, y:0.357 }, // GC 5
  { id:181,x:0.410, y:0.350 }, // GC 6
  { id:182,x:0.382, y:0.343 }, // GC 7
  { id:183,x:0.352, y:0.336 }, // GC 8
  { id:184,x:0.320, y:0.330 }, // GC 9
  // median coverts
  { id:185,x:0.526, y:0.395 }, // MC 1
  { id:186,x:0.508, y:0.388 }, // MC 2
  { id:187,x:0.486, y:0.382 }, // MC 3
  { id:188,x:0.463, y:0.376 }, // MC 4
  { id:189,x:0.438, y:0.368 }, // MC 5
  { id:190,x:0.412, y:0.362 }, // MC 6
  { id:191,x:0.384, y:0.355 }, // MC 7
  { id:192,x:0.354, y:0.348 }, // MC 8
  // lesser coverts
  { id:193,x:0.528, y:0.408 }, // LC 1
  { id:194,x:0.510, y:0.402 }, // LC 2
  { id:195,x:0.488, y:0.396 }, // LC 3
  { id:196,x:0.464, y:0.389 }, // LC 4
  { id:197,x:0.438, y:0.382 }, // LC 5
  { id:198,x:0.410, y:0.375 }, // LC 6
  { id:199,x:0.380, y:0.368 }, // LC 7
  { id:200,x:0.350, y:0.362 }, // LC 8
  // wing trailing edge
  { id:201,x:0.530, y:0.420 }, // TE 1
  { id:202,x:0.512, y:0.416 }, // TE 2
  { id:203,x:0.490, y:0.410 }, // TE 3
  { id:204,x:0.465, y:0.402 }, // TE 4
  { id:205,x:0.438, y:0.395 }, // TE 5
  { id:206,x:0.410, y:0.388 }, // TE 6
  { id:207,x:0.380, y:0.380 }, // TE 7
  { id:208,x:0.348, y:0.372 }, // TE 8
  // winglet / outer trailing
  { id:209,x:0.318, y:0.365 }, // WL 1
  { id:210,x:0.286, y:0.358 }, // WL 2
  { id:211,x:0.255, y:0.352 }, // WL 3
  { id:212,x:0.224, y:0.347 }, // WL 4
  // wing tip connection row
  { id:213,x:0.245, y:0.310 }, // WT 1
  { id:214,x:0.215, y:0.300 }, // WT 2
  { id:215,x:0.185, y:0.295 }, // WT 3

  // ══ RIGHT WING (216–272) ══
  { id:216,x:0.568, y:0.352 }, // RW root front
  { id:217,x:0.580, y:0.365 }, // RW root back
  // right primaries base
  { id:218,x:0.585, y:0.338 }, // RP base 1
  { id:219,x:0.602, y:0.328 }, // RP base 2
  { id:220,x:0.618, y:0.320 }, // RP base 3
  { id:221,x:0.635, y:0.314 }, // RP base 4
  { id:222,x:0.650, y:0.308 }, // RP base 5
  // right primary tips
  { id:223,x:0.605, y:0.305 }, // RP1 tip
  { id:224,x:0.622, y:0.292 }, // RP2 tip
  { id:225,x:0.638, y:0.278 }, // RP3 tip
  { id:226,x:0.652, y:0.265 }, // RP4 tip
  { id:227,x:0.664, y:0.252 }, // RP5 tip
  { id:228,x:0.674, y:0.241 }, // RP6 tip
  // right primary mids
  { id:229,x:0.596, y:0.322 }, // RPM 1
  { id:230,x:0.613, y:0.310 }, // RPM 2
  { id:231,x:0.629, y:0.299 }, // RPM 3
  { id:232,x:0.644, y:0.288 }, // RPM 4
  { id:233,x:0.658, y:0.277 }, // RPM 5
  // right alula
  { id:234,x:0.600, y:0.316 }, // RA base
  { id:235,x:0.614, y:0.305 }, // RA 1
  { id:236,x:0.628, y:0.294 }, // RA 2
  { id:237,x:0.640, y:0.284 }, // RA tip
  // right secondary coverts
  { id:238,x:0.572, y:0.365 }, // RSC 1
  { id:239,x:0.585, y:0.375 }, // RSC 2
  { id:240,x:0.598, y:0.385 }, // RSC 3
  { id:241,x:0.610, y:0.395 }, // RSC 4
  { id:242,x:0.622, y:0.405 }, // RSC 5
  // right secondary tips
  { id:243,x:0.568, y:0.380 }, // RST 1
  { id:244,x:0.582, y:0.392 }, // RST 2
  { id:245,x:0.595, y:0.404 }, // RST 3
  { id:246,x:0.608, y:0.415 }, // RST 4
  { id:247,x:0.620, y:0.425 }, // RST 5
  // right greater coverts
  { id:248,x:0.575, y:0.390 }, // RGC 1
  { id:249,x:0.588, y:0.402 }, // RGC 2
  { id:250,x:0.602, y:0.414 }, // RGC 3
  { id:251,x:0.615, y:0.425 }, // RGC 4
  // right median coverts
  { id:252,x:0.579, y:0.400 }, // RMC 1
  { id:253,x:0.592, y:0.412 }, // RMC 2
  { id:254,x:0.605, y:0.424 }, // RMC 3
  // right lesser coverts
  { id:255,x:0.582, y:0.410 }, // RLC 1
  { id:256,x:0.595, y:0.422 }, // RLC 2
  { id:257,x:0.608, y:0.434 }, // RLC 3
  // right trailing edge
  { id:258,x:0.578, y:0.420 }, // RTE 1
  { id:259,x:0.592, y:0.432 }, // RTE 2
  { id:260,x:0.605, y:0.444 }, // RTE 3
  { id:261,x:0.618, y:0.455 }, // RTE 4

  // ══ TAIL (262–283) ══
  { id:262,x:0.546, y:0.532 }, // tail root R
  { id:263,x:0.528, y:0.528 }, // tail root L
  { id:264,x:0.555, y:0.555 }, // T1 base R
  { id:265,x:0.542, y:0.560 }, // T2 base
  { id:266,x:0.528, y:0.564 }, // T3 center
  { id:267,x:0.514, y:0.560 }, // T4 base
  { id:268,x:0.500, y:0.555 }, // T5 base L
  { id:269,x:0.560, y:0.582 }, // T1 mid R
  { id:270,x:0.546, y:0.588 }, // T2 mid
  { id:271,x:0.528, y:0.592 }, // T3 mid center
  { id:272,x:0.512, y:0.588 }, // T4 mid
  { id:273,x:0.498, y:0.582 }, // T5 mid L
  { id:274,x:0.562, y:0.608 }, // T1 tip R
  { id:275,x:0.547, y:0.615 }, // T2 tip
  { id:276,x:0.528, y:0.619 }, // T3 tip center
  { id:277,x:0.510, y:0.615 }, // T4 tip
  { id:278,x:0.495, y:0.608 }, // T5 tip L
  { id:279,x:0.486, y:0.595 }, // tail far L
  { id:280,x:0.570, y:0.592 }, // tail far R
  { id:281,x:0.565, y:0.568 }, // tail R outer
  { id:282,x:0.484, y:0.565 }, // tail L outer

  // ══ LEFT LEG & TALONS (283–332) ══
  { id:283,x:0.525, y:0.532 }, // L thigh top
  { id:284,x:0.520, y:0.552 }, // L thigh mid
  { id:285,x:0.514, y:0.572 }, // L thigh low
  { id:286,x:0.508, y:0.592 }, // L tarsus top
  { id:287,x:0.502, y:0.612 }, // L tarsus mid
  { id:288,x:0.498, y:0.632 }, // L tarsus low
  { id:289,x:0.494, y:0.652 }, // L ankle
  // leg feather detail
  { id:290,x:0.518, y:0.538 }, // LLF 1a
  { id:291,x:0.512, y:0.558 }, // LLF 1b
  { id:292,x:0.505, y:0.578 }, // LLF 1c
  { id:293,x:0.530, y:0.545 }, // LLF 2a
  { id:294,x:0.524, y:0.565 }, // LLF 2b
  { id:295,x:0.517, y:0.585 }, // LLF 2c
  { id:296,x:0.536, y:0.540 }, // LLF 3a
  { id:297,x:0.530, y:0.558 }, // LLF 3b
  // toes — 4 toes fully detailed
  { id:298,x:0.488, y:0.662 }, // T1 base (hallux)
  { id:299,x:0.478, y:0.674 }, // T1 mid
  { id:300,x:0.468, y:0.685 }, // T1 tip
  { id:301,x:0.495, y:0.664 }, // T2 base
  { id:302,x:0.492, y:0.680 }, // T2 mid
  { id:303,x:0.490, y:0.695 }, // T2 tip
  { id:304,x:0.502, y:0.662 }, // T3 base
  { id:305,x:0.505, y:0.678 }, // T3 mid
  { id:306,x:0.508, y:0.694 }, // T3 tip
  { id:307,x:0.510, y:0.660 }, // T4 base
  { id:308,x:0.515, y:0.675 }, // T4 mid
  { id:309,x:0.520, y:0.690 }, // T4 tip
  // claws — curved hooks
  { id:310,x:0.460, y:0.692 }, // C1 base
  { id:311,x:0.452, y:0.702 }, // C1 curve
  { id:312,x:0.448, y:0.713 }, // C1 tip
  { id:313,x:0.487, y:0.703 }, // C2 base
  { id:314,x:0.483, y:0.714 }, // C2 curve
  { id:315,x:0.480, y:0.724 }, // C2 tip
  { id:316,x:0.506, y:0.702 }, // C3 base
  { id:317,x:0.504, y:0.714 }, // C3 curve
  { id:318,x:0.502, y:0.724 }, // C3 tip
  { id:319,x:0.522, y:0.698 }, // C4 base
  { id:320,x:0.526, y:0.710 }, // C4 curve
  { id:321,x:0.528, y:0.720 }, // C4 tip

  // ══ RIGHT LEG & TALONS (322–358) ══
  { id:322,x:0.550, y:0.535 }, // R thigh top
  { id:323,x:0.555, y:0.555 }, // R thigh mid
  { id:324,x:0.560, y:0.575 }, // R thigh low
  { id:325,x:0.563, y:0.595 }, // R tarsus top
  { id:326,x:0.566, y:0.615 }, // R tarsus mid
  { id:327,x:0.568, y:0.635 }, // R tarsus low
  { id:328,x:0.570, y:0.652 }, // R ankle
  // right leg feathers
  { id:329,x:0.543, y:0.542 }, // RLF 1a
  { id:330,x:0.546, y:0.562 }, // RLF 1b
  { id:331,x:0.550, y:0.582 }, // RLF 1c
  // right toes
  { id:332,x:0.562, y:0.662 }, // RT1 base
  { id:333,x:0.558, y:0.676 }, // RT1 mid
  { id:334,x:0.554, y:0.690 }, // RT1 tip
  { id:335,x:0.570, y:0.660 }, // RT2 base
  { id:336,x:0.573, y:0.675 }, // RT2 mid
  { id:337,x:0.576, y:0.690 }, // RT2 tip
  { id:338,x:0.577, y:0.658 }, // RT3 base
  { id:339,x:0.581, y:0.672 }, // RT3 mid
  { id:340,x:0.584, y:0.686 }, // RT3 tip
  // right claws
  { id:341,x:0.550, y:0.698 }, // RC1 base
  { id:342,x:0.547, y:0.710 }, // RC1 curve
  { id:343,x:0.544, y:0.721 }, // RC1 tip
  { id:344,x:0.574, y:0.698 }, // RC2 base
  { id:345,x:0.577, y:0.710 }, // RC2 curve
  { id:346,x:0.579, y:0.721 }, // RC2 tip
  { id:347,x:0.583, y:0.694 }, // RC3 base
  { id:348,x:0.587, y:0.706 }, // RC3 curve
  { id:349,x:0.590, y:0.718 }, // RC3 tip
];

const E = [
  // ── HEAD skull ──
  [0,1],[1,2],[2,3],[0,4],[4,5],[5,6],[0,7],[7,8],[8,1],[7,4],[8,2],
  // brow
  [3,9],[9,10],[10,11],[11,2],[9,12],[10,13],[11,14],
  // eye socket (full ring)
  [12,13],[13,14],[14,15],[15,16],[16,17],[17,18],[18,19],[19,20],[20,21],[21,22],[22,23],[23,12],
  // iris ring
  [24,25],[25,26],[26,27],[27,24],
  [28,24],[28,25],[28,26],[28,27],
  // brow to eye
  [9,12],[10,13],[11,14],[15,16],[16,17],[10,24],[11,25],[15,25],[14,24],
  [18,26],[19,26],[20,27],[21,27],[22,23],[13,27],[12,23],
  // cere
  [29,30],[30,31],[31,32],[32,33],[29,10],[30,9],[31,12],[32,22],[33,21],
  [29,34],[30,34],[31,46],[32,46],[33,52],
  // upper beak
  [34,35],[35,36],[36,37],[37,38],[38,39],[39,40],[40,41],[41,42],
  [34,43],[43,44],[44,45],[45,42],[45,41],[44,40],
  [35,43],[36,44],[37,45],[38,39],
  [30,34],[29,34],
  // lower mandible
  [46,47],[47,48],[48,49],[49,50],[50,51],[51,42],[50,41],
  [46,52],[52,33],[47,53],[48,53],[49,50],
  // throat
  [52,53],[53,54],[54,55],[55,60],
  [6,56],[5,56],[56,57],[57,58],[58,59],[59,65],
  [0,56],[4,56],[7,56],[8,56],

  // ── NECK & BODY ──
  [55,60],[60,61],[61,62],[62,63],[63,64],[64,67],[67,70],[70,73],
  [59,65],[65,66],[66,68],[68,71],[71,74],
  [63,65],[64,66],[66,67],[67,68],[68,69],[69,70],[70,71],[71,72],[72,73],[73,74],
  // neck feathers
  [56,90],[90,91],[91,92],[92,63],[57,90],[57,91],[58,92],
  [60,93],[93,94],[94,95],[95,63],[61,93],[61,94],[62,95],
  [90,93],[91,94],[92,95],
  // chest columns
  [59,75],[75,76],[76,77],[77,78],[78,79],[79,80],
  [63,81],[81,82],[82,83],[83,84],[84,85],[85,86],[86,87],[87,88],[88,89],
  [65,96],[96,97],[97,98],[66,96],[66,97],[67,98],
  [83,99],[84,100],[85,101],[86,102],[87,103],[88,104],[89,105],
  [99,100],[100,101],[101,102],[102,103],[103,104],[104,105],
  // cross bracing body
  [75,81],[76,82],[77,83],[78,84],[79,85],[80,86],
  [65,75],[66,76],[67,77],[68,78],[69,79],[70,80],
  [64,82],[66,83],[67,84],[68,85],[69,86],[70,87],[71,88],[72,89],
  [97,75],[98,76],[96,81],

  // ── LEFT WING primaries ──
  [106,108],[108,109],[109,110],[110,111],[111,112],[112,113],[113,114],[114,115],[115,116],[116,117],[117,118],
  // primary tip connections
  [108,119],[109,120],[110,121],[111,122],[112,123],[113,124],[114,125],[115,126],[116,127],[117,128],[118,129],
  // primary shafts (base→mid→tip)
  [108,130],[130,119],[109,131],[131,120],[110,132],[132,121],
  [111,133],[133,122],[112,134],[134,123],[113,135],[135,124],
  [114,136],[136,125],[115,137],[137,126],[116,138],[138,127],
  [117,139],[139,128],[118,140],[140,129],
  // tip-to-tip leading edge
  [119,120],[120,121],[121,122],[122,123],[123,124],[124,125],[125,126],[126,127],[127,128],[128,129],
  // alula
  [141,142],[142,143],[143,144],[144,145],
  [108,141],[109,142],[110,143],[111,144],[112,145],
  [141,108],[142,109],
  // primary upper coverts
  [146,147],[147,148],[148,149],[149,150],[150,151],[151,152],[152,153],[153,154],[154,155],
  [108,146],[109,147],[110,148],[111,149],[112,150],[113,151],[114,152],[115,153],[116,154],[117,155],
  [130,146],[131,147],[132,148],[133,149],[134,150],[135,151],[136,152],[137,153],[138,154],[139,155],
  // secondary coverts row1
  [156,157],[157,158],[158,159],[159,160],[160,161],[161,162],[162,163],[163,164],[164,165],
  [156,166],[157,167],[158,168],[159,169],[160,170],[161,171],[162,172],[163,173],[164,174],[165,175],
  [166,167],[167,168],[168,169],[169,170],[170,171],[171,172],[172,173],[173,174],[174,175],
  // greater coverts
  [176,177],[177,178],[178,179],[179,180],[180,181],[181,182],[182,183],[183,184],
  [166,176],[167,177],[168,178],[169,179],[170,180],[171,181],[172,182],[173,183],[174,184],
  [176,185],[177,186],[178,187],[179,188],[180,189],[181,190],[182,191],[183,192],
  // median coverts
  [185,186],[186,187],[187,188],[188,189],[189,190],[190,191],[191,192],
  // lesser coverts
  [193,194],[194,195],[195,196],[196,197],[197,198],[198,199],[199,200],
  [185,193],[186,194],[187,195],[188,196],[189,197],[190,198],[191,199],[192,200],
  // trailing edge
  [201,202],[202,203],[203,204],[204,205],[205,206],[206,207],[207,208],
  [193,201],[194,202],[195,203],[196,204],[197,205],[198,206],[199,207],[200,208],
  // winglet
  [208,209],[209,210],[210,211],[211,212],
  [200,209],[209,213],[213,214],[214,215],
  [129,213],[140,214],[140,215],
  [155,213],[155,214],
  // wing root to body
  [106,156],[106,176],[106,185],[106,193],[107,156],[107,176],
  [62,106],[63,106],[64,156],[64,176],[64,185],[64,193],
  [61,107],[62,107],

  // ── RIGHT WING ──
  [216,218],[218,219],[219,220],[220,221],[221,222],
  [218,223],[219,224],[220,225],[221,226],[222,227],[222,228],
  [223,224],[224,225],[225,226],[226,227],[227,228],
  // right primary mids
  [218,229],[229,223],[219,230],[230,224],[220,231],[231,225],[221,232],[232,226],[222,233],[233,227],
  // right alula
  [234,235],[235,236],[236,237],
  [219,234],[220,235],[221,236],[222,237],
  // right secondary coverts
  [238,239],[239,240],[240,241],[241,242],
  [238,243],[239,244],[240,245],[241,246],[242,247],
  [243,244],[244,245],[245,246],[246,247],
  // right greater coverts
  [248,249],[249,250],[250,251],
  [243,248],[244,249],[245,250],[246,251],
  // right median/lesser coverts
  [252,253],[253,254],[255,256],[256,257],
  [248,252],[249,253],[250,254],
  [252,255],[253,256],[254,257],
  // right trailing edge
  [258,259],[259,260],[260,261],
  [255,258],[256,259],[257,260],[261,257],
  // right wing root
  [216,238],[216,248],[216,252],[217,238],[217,248],
  [58,216],[59,216],[65,216],[65,238],[65,248],
  [58,217],[57,217],

  // ── TAIL ──
  [262,263],[262,264],[263,268],[263,267],[262,265],
  [264,281],[264,269],[265,270],[266,271],[267,272],[268,273],[268,282],
  [269,270],[270,271],[271,272],[272,273],
  [269,274],[270,275],[271,276],[272,277],[273,278],[273,279],[269,280],[280,281],
  [274,275],[275,276],[276,277],[277,278],[278,279],
  [281,280],[279,282],
  [74,262],[73,263],[262,264],[263,268],

  // ── LEFT LEG ──
  [283,284],[284,285],[285,286],[286,287],[287,288],[288,289],
  [283,290],[290,291],[291,292],[284,290],[285,291],[286,292],
  [283,293],[293,294],[294,295],[284,293],[285,294],[286,295],
  [283,296],[296,297],[284,296],[285,297],
  [73,283],[72,283],[74,322],
  // left toes
  [289,298],[289,301],[289,304],[289,307],
  [298,299],[299,300],[301,302],[302,303],[304,305],[305,306],[307,308],[308,309],
  [298,301],[301,304],[304,307],
  // left claws
  [300,310],[310,311],[311,312],
  [303,313],[313,314],[314,315],
  [306,316],[316,317],[317,318],
  [309,319],[319,320],[320,321],

  // ── RIGHT LEG ──
  [322,323],[323,324],[324,325],[325,326],[326,327],[327,328],
  [322,329],[329,330],[330,331],[323,329],[324,330],[325,331],
  [74,322],[71,322],[71,323],
  // right toes
  [328,332],[328,335],[328,338],
  [332,333],[333,334],[335,336],[336,337],[338,339],[339,340],
  [332,335],[335,338],
  // right claws
  [334,341],[341,342],[342,343],
  [337,344],[344,345],[345,346],
  [340,347],[347,348],[348,349],

  // ── BODY CROSS BRACING ──
  [55,81],[60,82],[61,83],[62,84],[63,85],[64,86],[67,87],[70,88],[72,89],
  [56,60],[57,61],[58,62],[59,63],
  [92,63],[95,62],[91,61],[90,60],
];

export default function DivingEagleReveal() {
  const canvasRef   = useRef(null);
  const targetMouse = useRef({ x:-9999, y:-9999 });
  const smoothMouse = useRef({ x:-9999, y:-9999 });
  const velocity    = useRef({ x:0, y:0 });
  const trail       = useRef([]);
  const rafRef      = useRef(null);
  const resizeTimer = useRef(null);
  const frameRef    = useRef(0);
  const TRAIL_LEN   = 38;

  const buildEdges = useCallback((W, H) => {
    const scaleX = W * 0.94;
    const scaleY = H * 0.92;
    const offX   = W * 0.03;
    const offY   = H * 0.03;
    const nodes  = N.map(n => ({
      x: offX + n.x * scaleX,
      y: offY + n.y * scaleY,
    }));
    return E.map(([a, b]) => {
      const na = nodes[a], nb = nodes[b];
      if (!na || !nb) return null;
      const dx = nb.x - na.x, dy = nb.y - na.y;
      const len = Math.sqrt(dx*dx + dy*dy);
      const steps = Math.max(8, Math.ceil(len / 3.5));
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        pts.push({ x: na.x + dx*t, y: na.y + dy*t });
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
    const speed  = Math.sqrt(vx*vx + vy*vy);
    const hasSp  = speed > 0.8;
    const nvx    = hasSp ? vx/speed : 0;
    const nvy    = hasSp ? vy/speed : 0;
    const dBias  = Math.min(speed / 14, 1.0);

    for (const edge of edges) {
      const { pts, na, nb } = edge;
      let tA = 0, tG = 0;
      for (let ti = 0; ti < trailPts.length; ti++) {
        const tp  = trailPts[ti];
        const age = ti / trailPts.length;
        const tr  = REVEAL * (1 - age * 0.55);
        const tf  = (1-age) * (1-age);
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
        const fa = a * pulse;
        if (fa > cA) cA = fa;
        if (d < GLOW) {
          const g = ((1-Math.cos((1-d/GLOW)*Math.PI))/2)*pulse;
          if (g > cG) cG = g;
        }
      }
      const fa = Math.max(tA, cA);
      const fg = Math.max(tG, cG);
      if (fa < 0.004) continue;

      if (fg > 0.01) {
        ctx.beginPath(); ctx.moveTo(na.x,na.y); ctx.lineTo(nb.x,nb.y);
        ctx.strokeStyle = `rgba(140,80,255,${fg*0.52})`;
        ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(na.x,na.y); ctx.lineTo(nb.x,nb.y);
      ctx.strokeStyle = `rgba(228,198,255,${fa*0.95})`;
      ctx.lineWidth = 1.0; ctx.lineCap = "round"; ctx.stroke();
      if (fa > 0.16) {
        for (const nd of [na, nb]) {
          ctx.beginPath(); ctx.arc(nd.x,nd.y,2.3,0,Math.PI*2);
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
        const px=sm.x, py=sm.y;
        sm.x += (tm.x-sm.x)*0.10; sm.y += (tm.y-sm.y)*0.10;
        velocity.current.x += ((sm.x-px)-velocity.current.x)*0.25;
        velocity.current.y += ((sm.y-py)-velocity.current.y)*0.25;
        if (sm.x > 0) {
          trail.current.unshift({x:sm.x,y:sm.y});
          if (trail.current.length > TRAIL_LEN) trail.current.length = TRAIL_LEN;
        }
      }
      draw(ctx,W,H,edges,sm.x,sm.y,velocity.current.x,velocity.current.y,trail.current,frameRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    const onMove  = (e) => { const r=canvas.getBoundingClientRect(); targetMouse.current={x:e.clientX-r.left,y:e.clientY-r.top}; };
    const onLeave = () => { targetMouse.current={x:-9999,y:-9999}; };
    const onResize= () => { clearTimeout(resizeTimer.current); resizeTimer.current=setTimeout(()=>{ ctx.setTransform(1,0,0,1,0,0); setup(); },120); };
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
        background: "radial-gradient(ellipse 75% 80% at 52% 42%, #0c0618 0%, #060410 45%, #020208 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background:"radial-gradient(ellipse 90% 90% at 52% 45%, transparent 30%, rgba(0,0,0,0.78) 100%)" }}
      />
      <div className="pointer-events-none absolute bottom-8 left-0 right-0 z-20 flex justify-center">
        <span className="text-[11px] tracking-[0.28em] text-white/20 uppercase">
          move cursor to reveal
        </span>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 z-[2] h-full w-full" style={{cursor:"default"}} />
    </section>
  );
}