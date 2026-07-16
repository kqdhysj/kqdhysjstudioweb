const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const convenience = fs.readFileSync(path.join(root, "convenience.html"), "utf8");
const main = fs.readFileSync(path.join(root, "js", "main.js"), "utf8");

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    failed = true;
  } else {
    console.log(`PASS ${message}`);
  }
}

assert(convenience.includes('href="https://www.renpy.org/"'), "convenience page links to Ren'Py official site");
assert(convenience.includes('data-i18n="portal.renpy.category"'), "Ren'Py card category is translatable");
assert(convenience.includes('data-i18n="portal.renpy.title"'), "Ren'Py card title is translatable");
assert(convenience.includes('data-i18n="portal.renpy.desc"'), "Ren'Py card description is translatable");

for (const key of [
  "portal.renpy.category",
  "portal.renpy.title",
  "portal.renpy.desc",
]) {
  assert(main.includes(`"${key}"`), `translation key ${key} exists`);
}

assert(main.includes('href: "convenience.html#renpy"'), "site search indexes Ren'Py portal card");
assert(main.includes("Ren'Py"), "Ren'Py appears in searchable content");
assert(main.includes("视觉小说与文字游戏开发引擎"), "Ren'Py has a short Simplified Chinese introduction");
assert(main.includes("Visual novel engine"), "Ren'Py has a short English introduction");

process.exit(failed ? 1 : 0);
