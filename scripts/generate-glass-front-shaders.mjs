/**
 * Regenerate glass front shader sources from Noomo bundle.
 * Run: node scripts/generate-glass-front-shaders.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const t = fs.readFileSync(path.join(root, "public/eagle-project/_nuxt/CbdjwYMp.js"), "utf8");

function extractBetween(marker, nextMarker) {
  const start = t.indexOf(marker);
  if (start < 0) return null;
  const bodyStart = start + marker.length;
  const next = nextMarker ? t.indexOf(nextMarker, bodyStart) : -1;
  const bodyEnd = next >= 0 ? t.lastIndexOf("`", next) : t.indexOf("`", bodyStart);
  return t.slice(bodyStart, bodyEnd);
}

function cleanShader(src) {
  return src
    .replace(/@sweet\s+alpha/g, "1.0")
    .replace(/@sweet[^;]*;/g, "")
    .replace(/@(?:Glass|Post|Env|ColorsMap|BlueNoise|Tick)\.\w+/g, "")
    .replace(/#pragma unroll_loop_start\n/g, "")
    .replace(/#pragma unroll_loop_end\n/g, "")
    .replace(/#define saturate\(x\) clamp\(x, 0\., 1\.\)\s*\n?/g, "");
}

const simple = cleanShader(extractBetween("var qte=`", ",x1=`"));
const dispersion = cleanShader(extractBetween(",x1=`", ",w1=`"));
const vertex = cleanShader(extractBetween(",w1=`", "`;class tk"));

const shaderDir = path.join(root, "components/native-eagle/shaders");
fs.mkdirSync(shaderDir, { recursive: true });

fs.writeFileSync(path.join(shaderDir, "glass-front-vertex.glsl"), vertex);
fs.writeFileSync(path.join(shaderDir, "glass-front-fragment-simple.glsl"), simple);
fs.writeFileSync(path.join(shaderDir, "glass-front-fragment-dispersion.glsl"), dispersion);

const outJs = `/** Auto-generated — run scripts/generate-glass-front-shaders.mjs */
export const GLASS_FRONT_VERTEX = ${JSON.stringify(vertex)};
export const GLASS_FRONT_FRAGMENT_SIMPLE = ${JSON.stringify(simple)};
export const GLASS_FRONT_FRAGMENT_DISPERSION = ${JSON.stringify(dispersion)};
`;

fs.writeFileSync(path.join(root, "components/native-eagle/glassFrontShaders.js"), outJs);

console.log("Generated glass front shaders:");
console.log("  vertex lines:", vertex.split("\n").length);
console.log("  simple lines:", simple.split("\n").length);
console.log("  dispersion lines:", dispersion.split("\n").length);
console.log("  vertex end:", vertex.slice(-80));
console.log("  simple end:", simple.slice(-100));
console.log("  dispersion end:", dispersion.slice(-100));
console.log("  simple uniforms sample:\n", simple.split("\n").slice(10, 45).join("\n"));
console.log("  dispersion uniforms sample:\n", dispersion.split("\n").slice(10, 50).join("\n"));
