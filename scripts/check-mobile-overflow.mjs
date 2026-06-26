import { chromium } from "playwright";

const URL = process.env.URL || "http://localhost:3000/dark7";
const VIEWPORT = { width: 390, height: 844 };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: VIEWPORT });
await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);

const measure = async (label) => {
  return page.evaluate((lbl) => {
    const doc = document.documentElement;
    const body = document.body;
    const offenders = [];
    for (const el of document.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      if (r.right > window.innerWidth + 1 || r.left < -1) {
        const id = el.id ? `#${el.id}` : "";
        const cls = el.className && typeof el.className === "string"
          ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}`
          : "";
        offenders.push({
          tag: el.tagName.toLowerCase(),
          sel: `${el.tagName.toLowerCase()}${id}${cls}`,
          right: Math.round(r.right),
          left: Math.round(r.left),
          width: Math.round(r.width),
        });
      }
    }
    return {
      label: lbl,
      innerWidth: window.innerWidth,
      scrollWidth: doc.scrollWidth,
      bodyScrollWidth: body.scrollWidth,
      overflow: doc.scrollWidth > window.innerWidth,
      offenders: offenders.slice(0, 15),
    };
  }, label);
};

let result = await measure("top");
console.log(JSON.stringify(result, null, 2));

// scroll through page
const total = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < total; y += 400) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await page.waitForTimeout(300);
  result = await measure(`scroll-${y}`);
  if (result.overflow) {
    console.log("OVERFLOW DETECTED:");
    console.log(JSON.stringify(result, null, 2));
    break;
  }
}

if (!result.overflow) {
  console.log("PASS: No horizontal overflow detected at 390px width.");
}

await browser.close();
process.exit(result.overflow ? 1 : 0);
