/**
 * Phase 5 — unit tests for GlassFront shaders, defaults, and material factory.
 * Run: node scripts/phase5-test-glass.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as THREE from "three";
import {
  GLASS_FRONT_FRAGMENT_DISPERSION,
  GLASS_FRONT_FRAGMENT_SIMPLE,
  GLASS_FRONT_VERTEX,
} from "../components/native-eagle/glassFrontShaders.js";
import { createGlassFrontMaterial } from "../components/native-eagle/createGlassFrontMaterial.js";
import { GLASS_UNIFORM_DEFAULTS } from "../components/native-eagle/glassConfig.js";
import { LOW_FRONT_SAMPLES_COUNT } from "../components/native-eagle/constants.js";
import { normalizeGlassAttributes } from "../components/native-eagle/prepareGlassMesh.js";

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

const files = [
  "components/native-eagle/shaders/glass-front-vertex.glsl",
  "components/native-eagle/shaders/glass-front-fragment-simple.glsl",
  "components/native-eagle/shaders/glass-front-fragment-dispersion.glsl",
  "components/native-eagle/glassFrontShaders.js",
  "components/native-eagle/createGlassFrontMaterial.js",
  "scripts/generate-glass-front-shaders.mjs",
];

for (const rel of files) {
  assert(`file exists: ${rel}`, fs.existsSync(path.join(root, rel)));
}

assert("vertex has _thickness", GLASS_FRONT_VERTEX.includes("attribute float _thickness"));
assert("vertex has _peaks", GLASS_FRONT_VERTEX.includes("attribute float _peaks"));
assert("vertex has skinning", GLASS_FRONT_VERTEX.includes("#include <skinning_pars_vertex>"));
assert("vertex has peaksColor", GLASS_FRONT_VERTEX.includes("peaksColor"));
assert("dispersion samples loop", GLASS_FRONT_FRAGMENT_DISPERSION.includes("for (int i = 0; i < samplesCount"));
assert("dispersion uses noiseMap", GLASS_FRONT_FRAGMENT_DISPERSION.includes("noiseMap"));
assert("simple samples map", GLASS_FRONT_FRAGMENT_SIMPLE.includes("texture2D(map, uv)"));
assert("no @sweet tokens", !GLASS_FRONT_FRAGMENT_SIMPLE.includes("@sweet"));
assert("gl_FragColor complete", GLASS_FRONT_FRAGMENT_DISPERSION.includes("gl_FragColor = vec4(color, 1.0);"));
assert("envReflection default 1", GLASS_UNIFORM_DEFAULTS.envReflection === 1);
assert("decayFactor default 20", GLASS_UNIFORM_DEFAULTS.decayFactor === 20);
assert("lowFrontSamplesCount is 5", LOW_FRONT_SAMPLES_COUNT === 5);

const geo = new THREE.BufferGeometry();
geo.setAttribute("_THICKNESS", new THREE.BufferAttribute(new Float32Array([1, 2]), 1));
geo.setAttribute("_PEAKS", new THREE.BufferAttribute(new Float32Array([0.1, 0.2]), 1));
normalizeGlassAttributes(geo);
assert("aliases _THICKNESS → _thickness", geo.hasAttribute("_thickness"));
assert("aliases _PEAKS → _peaks", geo.hasAttribute("_peaks"));

const dummyTex = new THREE.Texture();
const mat = createGlassFrontMaterial({
  hasSkinning: true,
  normalMap: dummyTex,
  dispersion: true,
  textures: { colorsMap: dummyTex, blueNoise: dummyTex },
});

assert("material is ShaderMaterial", mat.isShaderMaterial);
assert("material name GlassFront", mat.name === "GlassFront");
assert("front side", mat.side === THREE.FrontSide);
assert("depthWrite false", mat.depthWrite === false);
assert("skinning enabled", mat.skinning === true);
assert("USE_SKINNING define", "USE_SKINNING" in mat.defines);
assert("USE_NORMAL_MAP define", "USE_NORMAL_MAP" in mat.defines);
assert("samplesCount define", mat.defines.samplesCount === "5");
assert("iorStart uniform", mat.uniforms.iorStart.value === 1.2);
assert("envReflection uniform", mat.uniforms.envReflection.value === 1);
assert("baseColor present", mat.uniforms.baseColor.value instanceof THREE.Color);
assert("peaksColor present", mat.uniforms.peaksColor.value instanceof THREE.Color);
assert("isGlassFrontShader flag", mat.isGlassFrontShader === true);
assert("dispersion flag", mat.glassFrontDispersion === true);

const simpleMat = createGlassFrontMaterial({ dispersion: false });
assert("simple fragment selected", simpleMat.fragmentShader.includes("vec3 refraction = refract"));
assert("simple lacks palAccum", !simpleMat.fragmentShader.includes("palAccum"));

console.log(`\nUnit tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
