import fs from "fs";

const htmlPath = "public/eagle-project-1/index.html";
let html = fs.readFileSync(htmlPath, "utf8");

// Inject CSS once: hide footer / contacts overlay leftovers on this experiment copy
const cssMarker = "/* eagle-project-1: keep section 1 only */";
if (!html.includes(cssMarker)) {
  const styleTag = `    <style>
      ${cssMarker}
      footer { display: none !important; visibility: hidden !important; }
    </style>\n`;
  html = html.replace("</head>", styleTag + "</head>");
  console.log("added hide-footer CSS");
}

// Clamp scroll to first 2 segments (enough for "In a world..." beat)
const clampFn = `
        function getSceneStore() {
          return document
            .querySelector("#__nuxt")
            ?.__vue_app__?.config?.globalProperties?.$pinia?._s?.get("sceneId");
        }

        function clampToSection1(store) {
          if (!store?.scrollSections || store.scrollSections.length <= 2) return;
          try {
            store.scrollSections = store.scrollSections.slice(0, 2);
            // Refresh scroll distance if Lenis/GSAP helpers expose it
            store.getScroll?.resize?.();
            window.dispatchEvent(new Event("resize"));
          } catch (_) {}
        }
`;

if (!html.includes("clampToSection1")) {
  html = html.replace(
    "function applyTealGlass(store) {",
    clampFn + "\n        function applyTealGlass(store) {",
  );
  html = html.replace(
    "applyTealGlass(s);\n              if (++tries < 4) setTimeout(kick, 500);",
    "applyTealGlass(s);\n              clampToSection1(s);\n              if (++tries < 4) setTimeout(kick, 500);",
  );
  html = html.replace(
    "store?.getScroll?.paused?.(false);",
    "store?.getScroll?.paused?.(false);\n            clampToSection1(store);",
  );
  console.log("added scroll clamp");
}

// Also trim NUXT payload scrollSections list to first 2 for early init
const oldList = `[
          20, 23, 26, 29, 31, 34, 36, 39, 41, 44, 46, 49, 52, 55, 58, 60, 62,
          65, 68, 70
        ]`;
const newList = `[
          20, 23
        ]`;
if (html.includes(oldList)) {
  html = html.replace(oldList, newList);
  console.log("trimmed NUXT scrollSections index list");
} else if (html.includes("20, 23, 26, 29")) {
  console.log("list format differs, trying loose replace");
  html = html.replace(
    /\[\s*20,\s*23,\s*26,\s*29,\s*31,\s*34,\s*36,\s*39,\s*41,\s*44,\s*46,\s*49,\s*52,\s*55,\s*58,\s*60,\s*62,\s*65,\s*68,\s*70\s*\]/,
    "[20, 23]",
  );
  console.log("loose replace done?", html.includes("[20, 23]"));
}

fs.writeFileSync(htmlPath, html);
console.log("updated", htmlPath);
