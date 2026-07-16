const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    failed = true;
  } else {
    console.log(`PASS ${message}`);
  }
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const packagePath = path.join(root, "package.json");
assert(fs.existsSync(packagePath), "package.json exists");

if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(readText("package.json"));
  for (const scriptName of ["check:js", "test", "verify", "sync:outputs", "serve"]) {
    assert(Boolean(pkg.scripts?.[scriptName]), `package.json includes ${scriptName} script`);
  }
}

for (const relativePath of [
  "MAINTAINING.md",
  "scripts/run-checks.js",
  "scripts/sync-outputs.js",
  "scripts/serve.js",
  "tests/verify-ciallo-barrage.js",
  "tests/verify-consultation-form.js",
  "tests/verify-contact-validation.js",
  "tests/verify-email-obfuscation.js",
  "tests/verify-where-stars-drift.js",
]) {
  assert(fs.existsSync(path.join(root, relativePath)), `${relativePath} exists`);
}

if (fs.existsSync(path.join(root, "MAINTAINING.md"))) {
  const maintaining = readText("MAINTAINING.md");
  for (const needle of [
    "npm run verify",
    "npm run serve",
    "npm run sync:outputs",
    "git push",
    "GitHub Pages",
    "Web3Forms",
    "联系方式",
    "多语言",
  ]) {
    assert(maintaining.includes(needle), `MAINTAINING.md mentions ${needle}`);
  }
}

const readme = readText("README.md");
assert(readme.includes("MAINTAINING.md"), "README links maintenance guide");
assert(readme.includes("npm run verify"), "README documents verification command");
assert(readme.includes("npm run serve"), "README documents local preview command");

process.exit(failed ? 1 : 0);
