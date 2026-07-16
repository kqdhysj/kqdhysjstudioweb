const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const contact = fs.readFileSync(path.join(root, "contact.html"), "utf8");
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

for (const needle of [
  'id="consultation-form"',
  'action="https://api.web3forms.com/submit"',
  'name="access_key"',
  'value="6325dd2b-6704-4b1e-9733-106d1f5d011c"',
  'name="consultation_type"',
  'name="visitor_name"',
  'name="visitor_contact"',
  'name="consultation_title"',
  'name="message"',
  'name="botcheck"',
  'id="consultation-form-status"',
  'data-i18n="consult.replyDeadline"',
  'data-i18n="consult.submit"',
]) {
  assert(contact.includes(needle), `contact.html contains ${needle}`);
}

for (const forbidden of [
  'name="need_reply"',
  "是否需要回复",
  "需要回复",
  "仅提交信息，不需要回复",
]) {
  assert(!contact.includes(forbidden), `contact.html does not contain ${forbidden}`);
}

for (const needle of [
  "consultationForm",
  "setupConsultationForm",
  "handleConsultationSubmit",
  "fetch(consultationForm.action",
  '"consult.submit"',
  '"consult.success"',
  '"consult.error"',
  '"consult.replyDeadline"',
  "180天内给予回复",
]) {
  assert(js.includes(needle), `main.js contains ${needle}`);
}

for (const forbidden of [
  "consult.replyYes",
  "consult.replyNo",
  "need_reply",
]) {
  assert(!js.includes(forbidden), `main.js does not contain ${forbidden}`);
}

for (const needle of [
  ".consultation-form",
  ".consultation-form__grid",
  ".form-field",
  ".form-status",
]) {
  assert(css.includes(needle), `styles-final.css contains ${needle}`);
}

process.exit(failed ? 1 : 0);
