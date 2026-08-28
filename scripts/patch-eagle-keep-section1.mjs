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

function firstObjectEnd(src, openBracketIndex) {
  let depth = 0;
  let inStr = null;
  let esc = false;
  let started = false;
  for (let i = openBracketIndex + 1; i < src.length; i++) {
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
    if (c === "{") {
      depth++;
      started = true;
    }
    if (c === "}") {
      depth--;
      if (started && depth === 0) return i;
    }
  }
  return -1;
}

const file = "public/eagle-project-1/_nuxt/FZFS71Nt.js";
let t = fs.readFileSync(file, "utf8");

// Restore from eagle-project if already partially patched (detect empty y)
if (t.includes("y=G(()=>[])") || t.includes("y=G(()=>[})")) {
  console.log("Looks already patched or broken — restoring from eagle-project first");
  t = fs.readFileSync("public/eagle-project/_nuxt/FZFS71Nt.js", "utf8");
  // re-apply click-to-start fix if present in source
  const old =
    't.isExperienceStarted||(t.setCursorTextState(!0),t.setCursorText("Click to start"))';
  const next =
    't.isExperienceStarted||(t.setCursorTextState(!1),t.setCursorText(""))';
  if (t.includes(old)) t = t.replace(old, next);
}

function keepFirstOnly(name) {
  const marker = `${name}=G(()=>[`;
  const start = t.indexOf(marker);
  if (start < 0) throw new Error(`missing ${marker}`);
  const open = start + marker.length - 1;
  const end = findArrayEnd(t, open);
  const firstEnd = firstObjectEnd(t, open);
  if (firstEnd < 0 || end < 0) throw new Error(`bounds fail for ${name}`);
  const first = t.slice(open + 1, firstEnd + 1);
  t = t.slice(0, open + 1) + first + t.slice(end);
  console.log(`kept first only for ${name}`);
}

function emptyComputed(name) {
  const marker = `${name}=G(()=>[`;
  const start = t.indexOf(marker);
  if (start < 0) throw new Error(`missing ${marker}`);
  const open = start + marker.length - 1;
  const end = findArrayEnd(t, open);
  t = t.slice(0, open + 1) + t.slice(end);
  console.log(`emptied ${name}`);
}

keepFirstOnly("p");
emptyComputed("y");
emptyComputed("g");
emptyComputed("w");

// Empty case crystals: const o=[{...}]
const oMarker = "const o=[";
const oStart = t.indexOf(oMarker);
if (oStart < 0) throw new Error("const o=[ not found");
const oOpen = oStart + oMarker.length - 1;
const oEnd = findArrayEnd(t, oOpen);
t = t.slice(0, oOpen + 1) + t.slice(oEnd);
console.log("emptied cases o");

fs.writeFileSync(file, t);
console.log("wrote", file);

// Verify
for (const name of ["p", "y", "g", "w"]) {
  const marker = `${name}=G(()=>[`;
  const start = t.indexOf(marker);
  const open = start + marker.length - 1;
  const end = findArrayEnd(t, open);
  const body = t.slice(open, end + 1);
  const texts = [...body.matchAll(/text:`([\s\S]*?)`/g)].map((m) =>
    m[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 70)
  );
  console.log(name, texts.length, texts);
}
const o2 = t.indexOf("const o=[");
console.log("o body", t.slice(o2, o2 + 20));
