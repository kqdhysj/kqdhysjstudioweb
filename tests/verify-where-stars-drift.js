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
assert(detail.includes('data-i18n-alt="workDetail.logoAlt"'), "work logo alt text is translatable");
assert(detail.includes('data-i18n="workDetail.steam.title"'), "detail page has Steam placeholder panel");

const metaTable = detail.match(/<dl class="work-meta-table">[\s\S]*?<\/dl>/)?.[0] || "";
assert(metaTable.length > 0, "detail page contains work metadata table");

const metaCells = metaTable.match(/<(?:dt|dd)\b[^>]*>/g) || [];
assert(metaCells.length === 14, "metadata table contains seven label/value rows");
for (const tag of metaCells) {
  assert(tag.includes("data-i18n="), `metadata cell is translatable: ${tag}`);
}

const steamGrid = detail.match(/<dl class="steam-status-grid">[\s\S]*?<\/dl>/)?.[0] || "";
assert(steamGrid.length > 0, "detail page contains Steam status grid");

const steamCells = steamGrid.match(/<(?:dt|dd)\b[^>]*>/g) || [];
assert(steamCells.length === 8, "Steam status grid contains four label/value rows");
for (const tag of steamCells) {
  assert(tag.includes("data-i18n="), `Steam status cell is translatable: ${tag}`);
}

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
  "workDetail.logoAlt",
  "workDetail.intro.p1",
  "workDetail.intro.p2",
  "workDetail.feature1",
  "workDetail.steam.title",
  "workDetail.steam.desc",
  "workDetail.steam.statusLabel",
  "workDetail.steam.statusValue",
  "workDetail.steam.priceLabel",
  "workDetail.steam.price",
  "workDetail.steam.platformLabel",
  "workDetail.steam.platformValue",
  "workDetail.steam.dateLabel",
  "workDetail.steam.dateValue",
  "workDetail.steam.button",
  "workDetail.steam.note",
  "works.card1.link",
  "workDetail.meta.typeLabel",
  "workDetail.meta.typeValue",
  "workDetail.meta.statusLabel",
  "workDetail.meta.statusValue",
  "workDetail.meta.platformLabel",
  "workDetail.meta.platformValue",
  "workDetail.meta.releaseLabel",
  "workDetail.meta.releaseValue",
  "workDetail.meta.developerLabel",
  "workDetail.meta.developerValue",
  "workDetail.meta.engineLabel",
  "workDetail.meta.engineValue",
  "workDetail.meta.languageLabel",
  "workDetail.meta.languageValue",
]) {
  assert(js.includes(`"${key}"`), `translation key ${key} exists`);
  assert(
    detail.includes(`data-i18n="${key}"`) ||
      !(key.startsWith("workDetail.meta.") || key.startsWith("workDetail.steam.")),
    `detail page uses ${key}`
  );
}

process.exit(failed ? 1 : 0);
