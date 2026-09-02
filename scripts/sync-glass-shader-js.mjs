import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const shaderDir = path.join(root, "components/native-eagle/shaders");

function read(name) {
  return fs.readFileSync(path.join(shaderDir, name), "utf8");
}

const frontOut = `/** Auto-generated from .glsl — run scripts/sync-glass-shader-js.mjs */
export const GLASS_FRONT_VERTEX = ${JSON.stringify(read("glass-front-vertex.glsl"))};
export const GLASS_FRONT_FRAGMENT_SIMPLE = ${JSON.stringify(read("glass-front-fragment-simple.glsl"))};
export const GLASS_FRONT_FRAGMENT_DISPERSION = ${JSON.stringify(read("glass-front-fragment-dispersion.glsl"))};
`;

const backOut = `/** Auto-generated from .glsl — run scripts/sync-glass-shader-js.mjs */
export const GLASS_BACK_VERTEX = ${JSON.stringify(read("glass-back-vertex.glsl"))};
export const GLASS_BACK_FRAGMENT_SIMPLE = ${JSON.stringify(read("glass-back-fragment-simple.glsl"))};
export const GLASS_BACK_FRAGMENT_DISPERSION = ${JSON.stringify(read("glass-back-fragment-dispersion.glsl"))};
`;

fs.writeFileSync(path.join(root, "components/native-eagle/glassFrontShaders.js"), frontOut);
fs.writeFileSync(path.join(root, "components/native-eagle/glassBackShaders.js"), backOut);
console.log("Synced glass shader JS from .glsl");
