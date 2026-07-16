const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const exposedWeb3FormsKey = ["6325dd2b", "6704", "4b1e", "9733", "106d1f5d011c"].join("-");
let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    failed = true;
  } else {
    console.log(`PASS ${message}`);
  }
}

function assertNoPlainEmail(relativePath) {
  const content = fs.readFileSync(path.join(root, relativePath), "utf8");
  const matches = [...new Set(content.match(emailPattern) || [])];
  assert(matches.length === 0, `${relativePath} contains no plain email string`);
  if (matches.length > 0) {
    console.error(`Found: ${matches.join(", ")}`);
  }
}

function assertNoExposedWeb3FormsKey(relativePath) {
  const content = fs.readFileSync(path.join(root, relativePath), "utf8");
  assert(!content.includes(exposedWeb3FormsKey), `${relativePath} does not expose Web3Forms key`);
}

for (const file of fs.readdirSync(root).filter((name) => name.endsWith(".html"))) {
  assertNoPlainEmail(file);
  assertNoExposedWeb3FormsKey(file);
}

assertNoPlainEmail(path.join("js", "main.js"));
assertNoExposedWeb3FormsKey(path.join("js", "main.js"));

const js = fs.readFileSync(path.join(root, "js", "main.js"), "utf8");
assert(js.includes("protectedEmailParts"), "main.js stores email parts separately");
assert(js.includes("buildProtectedEmail"), "main.js assembles email only on interaction");
assert(js.includes("String.fromCharCode(64)"), "main.js avoids hardcoded @ in protected emails");
assert(js.includes("[\"kqdhysj114514\", \"163\", \"com\"]"), "primary email is split into parts");
assert(js.includes("[\"kqdhysjwebfk\", \"yeah\", \"net\"]"), "feedback email is split into parts");

process.exit(failed ? 1 : 0);
