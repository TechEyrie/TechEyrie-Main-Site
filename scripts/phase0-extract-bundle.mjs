/**
 * Phase 0 — extract inventory from CbdjwYMp.js
 * Run: node scripts/phase0-extract-bundle.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const bundlePath = path.join(root, "public/eagle-project/_nuxt/CbdjwYMp.js");
const outDir = path.join(root, "docs/native-eagle");
const shaderDir = path.join(outDir, "shaders/original");

fs.mkdirSync(shaderDir, { recursive: true });

const t = fs.readFileSync(bundlePath, "utf8");

const assets = [...new Set([...t.matchAll(/assetsManager\.get\("([^"]+)"\)/g)].map((m) => m[1]))].sort();
const glassUniforms = [...new Set([...t.matchAll(/@Glass\.(\w+)/g)].map((m) => m[1]))].sort();
const postUniforms = [...new Set([...t.matchAll(/@Post\.(\w+)/g)].map((m) => m[1]))].sort();
const meshNames = [...new Set([...t.matchAll(/"(wing-[^"]+|neck-[^"]+|tail-[^"]+|body|belly|chest|back|legs|trail)"/g)].map((m) => m[1]))].sort();

const sampleCounts = {};
for (const k of ["lowFrontSamplesCount", "frontSamplesCount", "backSamplesCount", "hyperSamplesCount"]) {
  const m = t.match(new RegExp(`${k}[:=](\\d+)`));
  if (m) sampleCounts[k] = Number(m[1]);
}

function extractGlassConfig() {
  const start = t.indexOf("glassConfig:{");
  if (start < 0) return null;
  let depth = 0;
  let end = start;
  for (let i = start + 12; i < t.length; i++) {
    if (t[i] === "{") depth++;
    if (t[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  const raw = `{${t.slice(start + 13, end)}`;
  // eslint-disable-next-line no-eval
  return eval(`(${raw})`);
}

function parseJsArrayLiteral(src) {
  if (!src) return null;
  return JSON.parse(src);
}

function extractSettingsBlock() {
  const clipMatch = t.match(/glassAnimationIdToClipName:(\[[^\]]+\])/);
  const speedMatch = t.match(/glassAnimationIdToSpeed:(\[[^\]]+\])/);
  const timelinesMatch = t.match(/timelines:(\[[^\]]+\])/);
  const fovMatch = t.match(/camera:\{fov:(\d+),near:([\d.]+),far:(\d+)\}/);
  if (!clipMatch) return null;
  return {
    glassAnimationIdToClipName: parseJsArrayLiteral(clipMatch[1]),
    glassAnimationIdToSpeed: speedMatch ? parseJsArrayLiteral(speedMatch[1]) : null,
    timelines: timelinesMatch ? parseJsArrayLiteral(timelinesMatch[1]) : null,
    camera: fovMatch ? { fov: Number(fovMatch[1]), near: Number(fovMatch[2]), far: Number(fovMatch[3]) } : null,
  };
}

const shaderVars = [
  ["y1", "glass-back-vertex.glsl"],
  ["b1", "glass-back-fragment-dispersion.glsl"],
  ["_1", "glass-back-fragment-simple.glsl"],
  ["w1", "glass-front-vertex.glsl"],
  ["x1", "glass-front-fragment-dispersion.glsl"],
  ["qte", "glass-front-fragment-simple.glsl"],
];

function cleanShader(src) {
  return src
    .replace(/@sweet[^;]*;/g, "")
    .replace(/@Glass\.(\w+)/g, "uGlass_$1")
    .replace(/@Post\.(\w+)/g, "uPost_$1")
    .replace(/@Env\.(\w+)/g, "uEnv_$1")
    .replace(/@ColorsMap\.(\w+)/g, "uColorsMap_$1")
    .replace(/@BlueNoise\.(\w+)/g, "uBlueNoise_$1")
    .replace(/@Tick\.(\w+)/g, "uTick_$1");
}

const extractedShaders = {};
for (const [varName, fileName] of shaderVars) {
  const re = new RegExp(`(?:var\\s+|,)${varName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=\`([\\s\\S]*?)\`;`);
  const m = t.match(re);
  if (m) {
    const cleaned = cleanShader(m[1]);
    fs.writeFileSync(path.join(shaderDir, fileName), cleaned);
    extractedShaders[fileName] = cleaned.split("\n").length;
  }
}

const glassConfig = extractGlassConfig();
const settings = extractSettingsBlock();

const glassDefaults = {};
if (glassConfig) {
  for (const [key, cfg] of Object.entries(glassConfig)) {
    const short = key.replace("Glass.", "");
    glassDefaults[short] = cfg.default ?? cfg.value;
  }
}

const heroAssets = {
  critical: [
    { key: "bird", path: "/eagle-project/models/v20.glb", role: "Phoenix rig + glass meshes" },
    { key: "cam", path: "/eagle-project/timelines/cam.glb", role: "Desktop scroll camera timeline" },
    { key: "camMob", path: "/eagle-project/timelines/cam-mob.glb", role: "Mobile camera timeline" },
    { key: "iceNormal", path: "/eagle-project/textures/icen.jpg", role: "Glass normal map (assetsManager key: iceNormal)" },
    { key: "colorsMap", path: "/eagle-project/textures/LDR_RG01_0.png", role: "Iridescence LUT (loaded via shader, not assetsManager)" },
    { key: "env", path: "/eagle-project/textures/wooden_studio_19_1k.hdr", role: "Environment map" },
  ],
  heroVfx: [
    { key: "feather", path: "/eagle-project/models/feather.glb", role: "Feather prop + trail VFX" },
    { key: "featherTrail", path: "/eagle-project/textures/ftrail.jpg", role: "Trail texture" },
    { key: "fairy", path: "/eagle-project/textures/sprite.png", role: "Fairy tail particles" },
    { key: "noises", path: "/eagle-project/textures/noises.jpg", role: "Feather trail noise" },
  ],
  heroEnvironment: [
    { key: "mountains", path: "/eagle-project/textures/mountains.png", role: "Background bed (hero visible)" },
    { key: "waves", path: "/eagle-project/textures/waves.jpg", role: "Water floor normal" },
  ],
  laterSections: ["crystal0-6", "ice", "iceDisplace", "contact", "404", "logo", "dev", "blueNoise"],
};

const inventory = {
  generatedAt: new Date().toISOString(),
  bundleFile: "public/eagle-project/_nuxt/CbdjwYMp.js",
  bundleSizeBytes: fs.statSync(bundlePath).size,
  assetsManagerKeys: assets,
  glassUniforms,
  postUniforms,
  meshNamesFromSorter: meshNames,
  sampleCounts,
  settings,
  glassConfig,
  glassDefaults,
  extractedShaders,
  heroAssets,
  keyClasses: {
    prepareGlassMesh: "nk()",
    glassFront: "tk (GlassFront)",
    glassBack: "ek (GlassBack)",
    renderPipeline: "nn (RenderingPipeline)",
    layerController: "Mn (LayerController)",
    glassSorter: "Jte (GlassSorter)",
    glassSupport: "as (GlassSupport)",
    phoenixAnimation: "ene (PhoenixAnimation)",
  },
  defaultGlassColors: {
    color: "#12c48a",
    peaksColor: "#6ee7b7",
    fringeColor: "#047857",
  },
};

fs.writeFileSync(path.join(outDir, "PHASE-0-INVENTORY.json"), JSON.stringify(inventory, null, 2));
console.log("Wrote PHASE-0-INVENTORY.json");
console.log("Assets:", assets.length, "| Glass uniforms:", glassUniforms.length);
console.log("Shaders extracted:", Object.keys(extractedShaders).join(", "));
console.log("Glass config params:", glassConfig ? Object.keys(glassConfig).length : 0);
