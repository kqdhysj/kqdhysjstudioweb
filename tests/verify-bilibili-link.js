const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const bilibiliUrl = "https://space.bilibili.com/1030580339?spm_id_from=333.1007.0.0";
const bilibiliUrlHtml = bilibiliUrl.replace("&", "&amp;");
let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    failed = true;
  } else {
    console.log(`PASS ${message}`);
  }
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

for (const file of fs.readdirSync(root).filter((name) => name.endsWith(".html"))) {
  assert(!read(file).includes("b23.tv"), `${file} does not use Bilibili short links`);
}

assert(!read(path.join("js", "main.js")).includes("b23.tv"), "main.js does not use Bilibili short links");

const contact = read("contact.html");
const notice = read("notice.html");

assert(contact.includes(`href="${bilibiliUrlHtml}"`), "contact page links to the official Bilibili space");
assert(notice.includes(`href="${bilibiliUrlHtml}"`), "notice page links to the official Bilibili space");
assert(notice.includes(bilibiliUrlHtml), "notice text displays the official Bilibili space link");

process.exit(failed ? 1 : 0);
