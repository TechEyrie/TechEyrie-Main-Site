/**
 * eagle-project-3: eagle on pure white — no lavender/pink scene bed.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const file = path.join(root, "public/eagle-project-3/_nuxt/CbdjwYMp.js");

if (!fs.existsSync(file)) {
  console.error("Missing", file, "— run setup-eagle-project-3.mjs first");
  process.exit(1);
}

let t = fs.readFileSync(file, "utf8");
let n = 0;

const swaps = [
  // Pure white (#ffffff) — replaces default lavender #e5def9 (15064825)
  ["static background=new Re(15064825)", "static background=new Re(16777215)"],
  ["static background=new Re(1453348)", "static background=new Re(16777215)"],

  // White env + iridescence — glass gaps must not pick up pink/lavender HDR
  [
    `vec3 getEnvColor(vec3 ray) {
  vec2 uv = vec2(atan(ray.x, ray.z) * 0.5, asin(ray.y));
  uv = uv * oneOverPi + 0.5;
  uv.x = fract(uv.x);
  vec3 color = texture2D(envMap, uv).rgb;
  color = 1. - exp(-0.1 * color);
  return color;
}`,
    `vec3 getEnvColor(vec3 ray) {
  return vec3(1.0);
}`,
  ],
  [
    `vec3 getIridescence(vec3 rd, vec3 n) {
  float thickness = 1. - abs(dot(n, rd));
  return texture2D(colorsMap, vec2(thickness * 0.3 + 0.08, 1.)).rgb;
}`,
    `vec3 getIridescence(vec3 rd, vec3 n) {
  return vec3(1.0);
}`,
  ],
  [
    `vec3 mixToColor(float f) {
  return texture2D(colorsMap, vec2(f, 0.)).rgb;
}`,
    `vec3 mixToColor(float f) {
  return vec3(1.0);
}`,
  ],

  // Timeline tween was forcing lavender #e5def9 — lock scene clear to white
  ['ck(this,"background","Env_background.position"),', ""],
  [
    "set background(e){ml.background.copy(e)}",
    "set background(e){ml.background.set(16777215)}",
  ],
  [
    "this.renderer.setClearColor(ml.background,this.clearAlpha)",
    "this.renderer.setClearColor(16777215,this.clearAlpha)",
  ],

  // Water fullscreen plane tints the whole scene pink/lavender
  [
    'X.settings.devMode&&(e.name="Water"),ae.dispatch(Mn.addLayerEvent,this),ae.on(Ot.raycasterEvent,this.onRaycaster',
    'X.settings.devMode&&(e.name="Water"),this.visible=!1,ke(dl.opacityProvider,0);/*eagle-3 no water*/ae.dispatch(Mn.addLayerEvent,this),ae.on(Ot.raycasterEvent,this.onRaycaster',
  ],

  // Pink haze particles around feather
  [
    "ae.dispatch(Mn.addLayerEvent,this.glow),ae.dispatch(Mn.addLayerEvent,this.trail)",
    "this.glow.visible=!1,this.trail.visible=!1;/*eagle-3*/ae.dispatch(Mn.addLayerEvent,this.glow),ae.dispatch(Mn.addLayerEvent,this.trail)",
  ],

  // No floating color spots (pink/purple orbs)
  [
    "ae.dispatch(Mn.addLayerEvent,this.spots);",
    "this.spots.visible=!1;/*eagle-3 no spots*/",
  ],

  // Hide fire-back glow sphere
  [
    "const t=new nh;ae.dispatch(Mn.addLayerEvent,t),Et(t.position",
    "const t=new nh;t.visible=!1;/*eagle-3*/ae.dispatch(Mn.addLayerEvent,t),Et(t.position",
  ],

  // Hide distant mountains — colored bed behind the bird
  [
    "this.mountains=new yte,ae.dispatch(Mn.addLayerEvent,this.mountains)",
    "this.mountains=new yte;this.mountains.visible=!1;/*eagle-3*/ae.dispatch(Mn.addLayerEvent,this.mountains)",
  ],

  // --- Liquid glass cursor — render nothing ---
  [
    'hideCursorWhileOver:{type:Boolean,default:!1}},setup(n){const e=so(),{isSafari:t,isFirefox:i}=qA()',
    'hideCursorWhileOver:{type:Boolean,default:!1}},setup(n){return()=>null;const e=so(),{isSafari:t,isFirefox:i}=qA()',
  ],

  // --- Pointer-trail frost overlay ---
  [
    "setPointerTrail=e=>{ke(Xr.usePointerTrailProvider,e)}",
    "setPointerTrail=e=>{ke(Xr.usePointerTrailProvider,0)}",
  ],
  [
    "render=({ds:e})=>{if($e(Xr.usePointerTrailProvider).value===0)return;",
    "render=({ds:e})=>{return;/*eagle-3 no trail*/if($e(Xr.usePointerTrailProvider).value===0)return;",
  ],
  [
    "onPointer=()=>{const e=X.pointer.pointer3.z===1||!X.settings.isTouchdevice;ke(Xr.renderPointerProvider,e?1:0)};render=({ds:e})=>{return;/*eagle-3 no trail*/",
    "onPointer=()=>{ke(Xr.renderPointerProvider,0)};render=({ds:e})=>{return;/*eagle-3 no trail*/",
  ],

  // --- SimpleFluidSim ripple overlay ---
  [
    "onPointer=e=>{const t=X.pointer.pointer3.z===1||!X.settings.isTouchdevice;ke(Ws.renderPointerProvider,t?1:0)};render=({ds:e})=>{this.accumulator+=e;",
    "onPointer=e=>{ke(Ws.renderPointerProvider,0)};render=({ds:e})=>{return;/*eagle-3*/this.accumulator+=e;",
  ],

  // --- Bird mesh hover → fluid sim pointer ---
  [
    "onRaycaster=e=>{if(this.isBurning>.5)return;const t=e.intersectObject(this,!1);t.length>0&&t[0].uv&&X.fluidSimulation?.onPointer(t[0].uv)}",
    "onRaycaster=e=>{return;/*eagle-3 no hover fluid*/}",
  ],

  // --- Hover click sounds ---
  [
    'x==="playCubeSound"){if(!i.isSoundEnabled)return;',
    'x==="playCubeSound"){return;/*eagle-3*/if(!i.isSoundEnabled)return;',
  ],
];

for (const [from, to] of swaps) {
  if (from === to) continue;
  if (t.includes(from)) {
    const count = t.split(from).length - 1;
    t = t.split(from).join(to);
    n += count;
  } else if (t.includes(to.split("/*")[0]) || t.includes(to.slice(0, 40))) {
    console.log("already:", from.slice(0, 55));
  } else {
    console.warn("NOT FOUND:", from.slice(0, 70));
  }
}

fs.writeFileSync(file, t);
console.log("patched", file, "changes", n);
