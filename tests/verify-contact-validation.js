const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const contact = fs.readFileSync(path.join(root, "contact.html"), "utf8");
const js = fs.readFileSync(path.join(root, "js", "main.js"), "utf8");

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    failed = true;
  } else {
    console.log(`PASS ${message}`);
  }
}

for (const needle of [
  'name="visitor_contact"',
  'inputmode="email"',
  'data-i18n-placeholder="consult.contactPlaceholder"',
  'aria-describedby="visitor-contact-help"',
  'id="visitor-contact-help"',
  'data-i18n="consult.contactHelp"',
]) {
  assert(contact.includes(needle), `contact.html contains ${needle}`);
}

for (const needle of [
  "function isValidConsultationContact",
  "function validateConsultationContact",
  "consult.contactInvalid",
  "真实可用",
  "真實可用",
  "can receive replies",
  "visitor_contact",
  "setCustomValidity",
]) {
  assert(js.includes(needle), `main.js contains ${needle}`);
}

function extractValidator(source) {
  const start = source.indexOf("function isValidConsultationContact");
  assert(start >= 0, "validator function exists");
  if (start < 0) return null;

  const end = source.indexOf("\nfunction validateConsultationContact", start);
  assert(end > start, "validator function has expected boundary");
  if (end <= start) return null;

  return `${source.slice(start, end)}\nmodule.exports = { isValidConsultationContact };`;
}

const validatorSource = extractValidator(js);
if (validatorSource) {
  const module = { exports: {} };
  new Function("module", validatorSource)(module);
  const { isValidConsultationContact } = module.exports;

  for (const sample of [
    "13800138000",
    "person@example.com",
    "studio.contact+test@example.co",
  ]) {
    assert(isValidConsultationContact(sample), `accepts ${sample}`);
  }

  for (const sample of [
    "",
    "12345678901",
    "1380013800",
    "138001380000",
    "abc",
    "person@example",
    "person@例子.com",
  ]) {
    assert(!isValidConsultationContact(sample), `rejects ${sample || "(empty)"}`);
  }
}

process.exit(failed ? 1 : 0);
