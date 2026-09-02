/** Phase 1 asset paths — mirrors Noomo eagle-project layout (also in public/models). */
export const DRACO_DECODER_PATH = "/draco/gltf/";

export const BIRD_GLB = "/models/v20.glb";
export const CAM_GLB = "/models/cam.glb";
export const CAM_MOB_GLB = "/models/cam-mob.glb";
export const HDR_ENV = "/models/wooden_studio_19_1k.hdr";
export const MOUNTAINS_TEX = "/eagle-project/textures/mountains.png";
export const WAVES_TEX = "/eagle-project/textures/waves.jpg";
export const ICE_NORMAL_TEX = "/eagle-project/textures/icen.jpg";
export const COLORS_MAP_TEX = "/eagle-project/textures/LDR_RG01_0.png";
export const NOISES_TEX = "/eagle-project/textures/noises.jpg";

/** Noomo X.settings sample counts */
export const BACK_SAMPLES_COUNT = 5;
export const LOW_FRONT_SAMPLES_COUNT = 5;
export const FRONT_SAMPLES_COUNT = 12;
export const HYPER_SAMPLES_COUNT = 16;

/** Noomo Env.background = 15064825 → #E5DEF9 */
export const ENV_BACKGROUND = 15064825;

/** Swappable hero backgrounds (Phase 7 / Phase 9) */
export const BACKGROUND_PRESETS = {
  noomo: 15064825, // #E5DEF9
  white: 0xffffff,
  offwhite: 0xf7f4fb,
  /** eagle-project-2 WebGL clear (patched #162d24) — white CSS stage + darken blend */
  eagle2Clear: 1453348,
};

/** Phase 9 — locked reference for v60 parity */
export const EAGLE_PROJECT_2_REFERENCE_SRC = "/eagle-project-2/";
export const EAGLE_PROJECT_2_HERO_PROGRESS = 0;

/** Lateral lookAt offset — wing close-up framing for eagle-project-2 compare. */
export const EAGLE2_SCREEN_PAN_RIGHT = 0.64;

/** Optional local offset on bird root for eagle2 compare. */
export const EAGLE2_BIRD_LOCAL_OFFSET = { x: 0, y: 0, z: 0 };

/** dev.glb — Glass_* timeline dummy nodes (cam.glb uses project* aliases). */
export const DEV_TIMELINE_GLB = "/eagle-project/timelines/dev.glb";

/** From X.settings.reflectorY */
export const REFLECTOR_Y = -2.35;
export const REFLECTOR_SIZE = [200, 200];
export const REFLECTOR_RESOLUTION = 1024;

/** Mountains half-cylinder (Noomo yte / CylinderGeometry) */
export const MOUNTAINS_GEOMETRY = {
  radiusTop: 100,
  radiusBottom: 100,
  height: 12.5,
  radialSegments: 64,
  heightSegments: 1,
  openEnded: true,
  thetaStart: 0,
  thetaLength: Math.PI,
};

export const TIMELINE_DURATION = 20;
export const HERO_ANIMATION_ID = 2;

/** Phase 2 hero gate checkpoints — scroll progress → timeline seconds */
export const HERO_CAMERA_CHECKPOINTS = [
  { progress: 0, timelineTime: 0 },
  { progress: 0.05, timelineTime: 1 },
  { progress: 0.1, timelineTime: 2 },
];

export const CAMERA_POSE_TOLERANCE = {
  positionMaxDelta: 0.05,
  quaternionMinDot: 0.9995,
};

/** Default pinned hero scroll height (vh) — matches dark7-v60-style hero pin */
export const HERO_PIN_HEIGHT_VH = 500;
export const GLASS_ANIMATION_CLIPS = [
  "Idle_MainPose_flying",
  "Float_WingPulse",
  "Wing_CloseUp",
  "Idle_MainPose_gliding",
];

export const CAMERA_SETTINGS = {
  fov: 25,
  near: 0.1,
  far: 500,
};

export const GLASS_COLORS = {
  color: "#12c48a",
  peaksColor: "#6ee7b7",
  fringeColor: "#047857",
};

/** Reference eagle-project-2 teal / cyan / lime crystalline glass (PHASE-0 inventory + lift) */
export const EAGLE2_GLASS_COLORS = {
  color: "#10d890",
  peaksColor: "#90ffe0",
  fringeColor: "#059669",
};

/** Teal / lime refraction sources only — no warm/white spots that gray-out glass */
export const EAGLE2_REFRACTION_SPOT_COLORS = [
  0x00ffc8, 0x2dd4a8, 0x64ffda, 0x4ade80, 0x6ee7b7, 0x34d399, 0x5eead4, 0xa7f3d0,
];

export const EAGLE2_REFRACTION_SPOT_COUNT = 36;
export const EAGLE2_REFRACTION_SPOT_RADIUS = 32;
export const EAGLE2_REFRACTION_SPOT_LAYER = 1;

/** Meshes handled by GlassSorter (Noomo Jte) — trail excluded. */
export const GLASS_SORTER_MESHES = new Set([
  "back",
  "belly",
  "body",
  "chest",
  "legs",
  "neck-bottom",
  "neck-top",
  "tail-bottom",
  "tail-center",
  "tail-top",
  "wing-left-bottom",
  "wing-left-center-bottom",
  "wing-left-center-top",
  "wing-left-pole",
  "wing-left-top",
  "wing-right-bottom",
  "wing-right-center-bottom",
  "wing-right-center-top",
  "wing-right-pole",
  "wing-right-top",
]);

export const DEBUG_HOOK = "__NATIVE_EAGLE_DEBUG__";
