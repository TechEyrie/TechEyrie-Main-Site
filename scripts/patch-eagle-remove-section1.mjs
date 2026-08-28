import fs from "fs";

function findArrayEnd(src, openBracketIndex) {
  let depth = 0;
  let inStr = null;
  let esc = false;
  for (let i = openBracketIndex; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) {
        esc = false;
        continue;
      }
      if (c === "\\") {
        esc = true;
        continue;
      }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c;
      continue;
    }
    if (c === "[") depth++;
    if (c === "]") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

const file = "public/eagle-project-1/_nuxt/FZFS71Nt.js";
let t = fs.readFileSync(file, "utf8");

const marker = "p=G(()=>[";
const start = t.indexOf(marker);
if (start < 0) throw new Error("p=G not found");
const open = start + marker.length - 1;
const end = findArrayEnd(t, open);
t = t.slice(0, open + 1) + t.slice(end);
fs.writeFileSync(file, t);

const verifyStart = t.indexOf(marker);
const verifyOpen = verifyStart + marker.length - 1;
const verifyEnd = findArrayEnd(t, verifyOpen);
const body = t.slice(verifyOpen, verifyEnd + 1);
console.log("p body:", body.slice(0, 40));
console.log("text entries:", [...body.matchAll(/text:`/g)].length);
