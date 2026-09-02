/**
 * Phase 4 — unit tests for GlassBack shaders, defaults, and material factory.
 * Run: node scripts/phase4-test-glass.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as THREE from "three";
import {
  GLASS_BACK_FRAGMENT_DISPERSION,
  GLASS_BACK_FRAGMENT_SIMPLE,
  GLASS_BACK_VERTEX,
} from "../components/native-eagle/glassBackShaders.js";
import { createGlassBackMaterial } from "../components/native-eagle/createGlassBackMaterial.js";
import { GLASS_UNIFORM_DEFAULTS } from "../components/native-eagle/glassConfig.js";
import { BACK_SAMPLES_COUNT } from "../components/native-eagle/constants.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    passed += 1;
    console.log("PASS:", label);
  } else {
    failed += 1;
    console.error("FAIL:", label);
  }
}

const shaderFiles = [
  "components/native-eagle/shaders/glass-back-vertex.glsl",
  "components/native-eagle/shaders/glass-back-fragment-simple.glsl",
  "components/native-eagle/shaders/glass-back-fragment-dispersion.glsl",
  "components/native-eagle/glassBackShaders.js",
  "components/native-eagle/createGlassBackMaterial.js",
  "components/native-eagle/createGlassPipeline.js",
  "components/native-eagle/loadGlassTextures.js",
  "components/native-eagle/glassConfig.js",
];

for (const rel of shaderFiles) {
  assert(`file exists: ${rel}`, fs.existsSync(path.join(root, rel)));
}

assert("vertex shader has skinning include", GLASS_BACK_VERTEX.includes("#include <skinning_pars_vertex>"));
assert("vertex shader has _dist attribute", GLASS_BACK_VERTEX.includes("attribute float _dist"));
assert("dispersion samples loop", GLASS_BACK_FRAGMENT_DISPERSION.includes("for (int i = 0; i < samplesCount"));
assert("dispersion uses noiseMap", GLASS_BACK_FRAGMENT_DISPERSION.includes("noiseMap"));
assert("simple uses map sampler", GLASS_BACK_FRAGMENT_SIMPLE.includes("texture2D(map, uv)"));
assert("no @sweet tokens remain", !GLASS_BACK_FRAGMENT_SIMPLE.includes("@sweet"));
assert("gl_FragColor complete", GLASS_BACK_FRAGMENT_DISPERSION.includes("gl_FragColor = vec4(color, 1.0);"));

assert("glass iorStart default 1.2", GLASS_UNIFORM_DEFAULTS.iorStart === 1.2);
assert("glass iorDelta default 0.3", GLASS_UNIFORM_DEFAULTS.iorDelta === 0.3);
assert("glass fringeCurve default 5", GLASS_UNIFORM_DEFAULTS.fringeCurve === 5);
assert("backSamplesCount is 5", BACK_SAMPLES_COUNT === 5);

const dummyTex = new THREE.Texture();
const mat = createGlassBackMaterial({
  hasSkinning: true,
  defaultDist: true,
  normalMap: dummyTex,
  dispersion: true,
  textures: { colorsMap: dummyTex, blueNoise: dummyTex },
});

assert("material is ShaderMaterial", mat.isShaderMaterial);
assert("material name GlassBack", mat.name === "GlassBack");
assert("back side", mat.side === THREE.BackSide);
assert("depthTest false", mat.depthTest === false);
assert("depthWrite false", mat.depthWrite === false);
assert("skinning enabled", mat.skinning === true);
assert("USE_SKINNING define", "USE_SKINNING" in mat.defines);
assert("USE_DEFAULT_DIST define", "USE_DEFAULT_DIST" in mat.defines);
assert("USE_NORMAL_MAP define", "USE_NORMAL_MAP" in mat.defines);
assert("samplesCount define", mat.defines.samplesCount === "5");
assert("iorStart uniform", mat.uniforms.iorStart.value === 1.2);
assert("isGlassBackShader flag", mat.isGlassBackShader === true);
assert("dispersion flag", mat.glassBackDispersion === true);

const simpleMat = createGlassBackMaterial({ dispersion: false });
assert("simple fragment selected", simpleMat.fragmentShader.includes("vec3 refraction = refract"));
assert("simple lacks noiseMap uniform use in loop", !simpleMat.fragmentShader.includes("palAccum"));

console.log(`\nUnit tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
