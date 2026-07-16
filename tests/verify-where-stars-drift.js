const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const works = fs.readFileSync(path.join(root, "works.html"), "utf8");
const detail = fs.readFileSync(path.join(root, "where-stars-drift.html"), "utf8");
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

for (const relativePath of [
  "where-stars-drift.html",
  path.join("assets", "images", "where-stars-drift-logo.png"),
]) {
  assert(fs.existsSync(path.join(root, relativePath)), `${relativePath} exists`);
}

assert(works.includes('href="where-stars-drift.html"'), "works page links to detail page");
assert(detail.includes("Where Stars Drift"), "detail page contains official English title");
assert(detail.includes('class="work-detail-logo"'), "detail page places logo beside title");
assert(detail.includes("assets/images/where-stars-drift-logo.png"), "detail page references work logo asset");
assert(detail.includes('data-i18n="workDetail.steam.title"'), "detail page has Steam placeholder panel");

for (const needle of [
  ".work-detail-layout",
  ".work-detail-logo",
  ".steam-placeholder",
]) {
  assert(css.includes(needle), `styles-final.css contains ${needle}`);
}

for (const needle of [
  "siteSearchIndex",
  'href: "where-stars-drift.html"',
  'href: "where-stars-drift.html#steam-title"',
  '"workDetail.steam.title"',
  "sectionPageMap",
  "setupSteamPlaceholderButton",
  "aria-disabled",
  "steamPlaceholderNote.textContent",
]) {
  assert(js.includes(needle), `main.js contains ${needle}`);
}

for (const key of [
  "workDetail.title",
  "workDetail.englishTitle",
  "workDetail.intro.p1",
  "workDetail.intro.p2",
  "workDetail.feature1",
  "workDetail.steam.title",
  "workDetail.steam.price",
  "workDetail.steam.button",
  "works.card1.link",
]) {
  assert(js.includes(`"${key}"`), `translation key ${key} exists`);
}

process.exit(failed ? 1 : 0);
