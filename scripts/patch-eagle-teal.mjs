import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const only = process.argv.includes("--target")
  ? process.argv[process.argv.indexOf("--target") + 1]
  : null;

const targets = only
  ? [path.join(root, `public/${only}/_nuxt/CbdjwYMp.js`)]
  : [
      path.join(root, "public/eagle-project/_nuxt/CbdjwYMp.js"),
      path.join(
        root,
        "eagle-project/storytelling.noomoagency.com - Copy/_nuxt/CbdjwYMp.js",
      ),
    ];

// Greener emerald-teal (matches reference cyan-green wing)
// HSL hue ~0.38–0.46 = green → teal (was ~0.48–0.55 cyan)
const RAND_VARIANTS = [
  // original Noomo
  "randomize=()=>{const e=Math.random(),t=Math.random(),i=1-t*t*t,r=Math.random(),s=1-r*r;this.value.setHSL(e,i,s),this.dispatch()}",
  // prior cyan-teal patch
  "randomize=()=>{const e=.48+Math.random()*.07,t=Math.random()*.4,i=.55+(.45)*(1-t*t*t),r=Math.random()*.5,s=.42+(.4)*(1-r*r);this.value.setHSL(e,i,s),this.dispatch()}",
];
const NEW_RAND =
  "randomize=()=>{const e=.38+Math.random()*.08,t=Math.random()*.35,i=.62+(.38)*(1-t*t*t),r=Math.random()*.45,s=.38+(.4)*(1-r*r);this.value.setHSL(e,i,s),this.dispatch()}";

const COLOR_VARIANTS = [
  // Glass.color
  [
    [
      '"Glass.color","Glass_color.position","#ffffff"',
      '"Glass.color","Glass_color.position","#2dd4bf"',
    ],
    '"Glass.color","Glass_color.position","#12c48a"',
  ],
  // peaks
  [
    [
      '"Glass.peaksColor","Glass_peaksColor.position","#ffffff"',
      '"Glass.peaksColor","Glass_peaksColor.position","#5eead4"',
    ],
    '"Glass.peaksColor","Glass_peaksColor.position","#6ee7b7"',
  ],
  // fringe
  [
    [
      '"Glass.fringeColor","Glass_fringeColor.position","#b0b0b0"',
      '"Glass.fringeColor","Glass_fringeColor.position","#0f766e"',
    ],
    '"Glass.fringeColor","Glass_fringeColor.position","#047857"',
  ],
];

for (const file of targets) {
  if (!fs.existsSync(file)) {
    console.warn("skip missing", file);
    continue;
  }
  let t = fs.readFileSync(file, "utf8");
  let changed = 0;

  for (const oldRand of RAND_VARIANTS) {
    if (t.includes(oldRand)) {
      t = t.replace(oldRand, NEW_RAND);
      changed += 1;
      break;
    }
  }
  if (t.includes(NEW_RAND) && changed === 0) {
    console.log("rand already greenish:", path.basename(file));
  } else if (changed === 0 && !t.includes(NEW_RAND)) {
    console.warn("rand NOT FOUND:", path.basename(file));
  }

  for (const [olds, next] of COLOR_VARIANTS) {
    let done = false;
    if (t.includes(next)) {
      console.log("already:", path.basename(file), next.slice(0, 50));
      continue;
    }
    for (const old of olds) {
      if (t.includes(old)) {
        t = t.replace(old, next);
        changed += 1;
        done = true;
        break;
      }
    }
    if (!done) console.warn("color NOT FOUND:", path.basename(file), next.slice(0, 50));
  }

  fs.writeFileSync(file, t);
  console.log("patched", file, "replacements", changed);
}
