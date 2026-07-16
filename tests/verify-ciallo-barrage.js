const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const js = fs.readFileSync(path.join(root, "js", "main.js"), "utf8");
const css = fs.readFileSync(path.join(root, "css", "styles-final.css"), "utf8");

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    failed = true;
  } else {
    console.log(`PASS ${message}`);
  }
}

assert(js.includes("function triggerCialloBarrage"), "main.js defines ciallo barrage trigger");
assert(js.includes('normalizedQuery !== "ciallo"'), "ciallo is the exact normalized trigger");
assert(js.includes("cialloBarrageCount"), "main.js controls dense barrage count");
assert(js.includes("ciallo-barrage__item"), "main.js creates barrage items");
assert(js.includes("triggerCialloBarrage(query)"), "search input invokes ciallo trigger");

assert(css.includes(".ciallo-barrage"), "CSS defines barrage overlay");
assert(css.includes(".ciallo-barrage__item"), "CSS defines barrage item style");
assert(css.includes("@keyframes ciallo-barrage-left-to-right"), "CSS defines left-to-right animation");
assert(
  /0%\s*{[\s\S]*translateX\(-/.test(css) &&
    /100%\s*{[\s\S]*translateX\(1[01]0vw\)/.test(css),
  "animation travels from off-screen left to off-screen right"
);
assert(css.includes("pointer-events: none"), "barrage overlay does not block page interaction");

process.exit(failed ? 1 : 0);
