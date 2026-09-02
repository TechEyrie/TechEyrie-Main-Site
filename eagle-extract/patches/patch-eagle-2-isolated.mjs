/**
 * eagle-project-2: eagle-only scene (no UI/cursor/hover FX, no mountains bed).
 * White WebGL clear + CSS darken blend on embed removes the box; do NOT force alpha=null.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const file = path.join(root, "public/eagle-project-2/_nuxt/CbdjwYMp.js");

if (!fs.existsSync(file)) {
  console.error("Missing", file, "— run setup-eagle-project-2.mjs first");
  process.exit(1);
}

let t = fs.readFileSync(file, "utf8");
let n = 0;

const swaps = [
  // Match hero top (#162d24) so empty pixels don't read as lavender/white
  ["static background=new Re(15064825)", "static background=new Re(1453348)"],
  ["static background=new Re(16777215)", "static background=new Re(1453348)"],

  // No floating color spots
  [
    "ae.dispatch(Mn.addLayerEvent,this.spots);",
    "this.spots.visible=!1;/*eagle-2 no spots*/",
  ],

  // Hide fire-back glow sphere
  [
    "const t=new nh;ae.dispatch(Mn.addLayerEvent,t),Et(t.position",
    "const t=new nh;t.visible=!1;/*eagle-2*/ae.dispatch(Mn.addLayerEvent,t),Et(t.position",
  ],

  // Hide distant mountains — they paint a colored bed behind the bird
  [
    "this.mountains=new yte,ae.dispatch(Mn.addLayerEvent,this.mountains)",
    "this.mountains=new yte;this.mountains.visible=!1;/*eagle-2*/ae.dispatch(Mn.addLayerEvent,this.mountains)",
  ],

  // --- Liquid glass cursor (TestCursor) — render nothing ---
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
    "render=({ds:e})=>{return;/*eagle-2 no trail*/if($e(Xr.usePointerTrailProvider).value===0)return;",
  ],
  [
    "onPointer=()=>{const e=X.pointer.pointer3.z===1||!X.settings.isTouchdevice;ke(Xr.renderPointerProvider,e?1:0)};render=({ds:e})=>{return;/*eagle-2 no trail*/",
    "onPointer=()=>{ke(Xr.renderPointerProvider,0)};render=({ds:e})=>{return;/*eagle-2 no trail*/",
  ],

  // --- SimpleFluidSim ripple overlay ---
  [
    "onPointer=e=>{const t=X.pointer.pointer3.z===1||!X.settings.isTouchdevice;ke(Ws.renderPointerProvider,t?1:0)};render=({ds:e})=>{this.accumulator+=e;",
    "onPointer=e=>{ke(Ws.renderPointerProvider,0)};render=({ds:e})=>{return;/*eagle-2*/this.accumulator+=e;",
  ],

  // --- Bird mesh hover → fluid sim pointer ---
  [
    "onRaycaster=e=>{if(this.isBurning>.5)return;const t=e.intersectObject(this,!1);t.length>0&&t[0].uv&&X.fluidSimulation?.onPointer(t[0].uv)}",
    "onRaycaster=e=>{return;/*eagle-2 no hover fluid*/}",
  ],

  // --- Hover click sounds ---
  [
    'x==="playCubeSound"){if(!i.isSoundEnabled)return;',
    'x==="playCubeSound"){return;/*eagle-2*/if(!i.isSoundEnabled)return;',
  ],
];

for (const [from, to] of swaps) {
  if (from === to) continue;
  if (t.includes(from)) {
    t = t.replace(from, to);
    n++;
  } else if (t.includes(to.split("/*")[0]) || t.includes(to.slice(0, 40))) {
    console.log("already:", from.slice(0, 55));
  } else {
    console.warn("NOT FOUND:", from.slice(0, 70));
  }
}

fs.writeFileSync(file, t);
console.log("patched", file, "changes", n);
