const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const contact = fs.readFileSync(path.join(root, "contact.html"), "utf8");
const js = fs.readFileSync(path.join(root, "js", "main.js"), "utf8");
const css = fs.readFileSync(path.join(root, "css", "styles-final.css"), "utf8");
const web3FormsAccessKey = ["6325dd2b", "6704", "4b1e", "9733", "106d1f5d011c"].join("-");

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
  'data-web3forms-access-key',
  'name="consultation_type"',
  'name="visitor_name"',
  'name="visitor_contact"',
  'name="consultation_title"',
  'name="message"',
  'name="botcheck"',
  'id="consultation-form-status"',
  'data-i18n="consult.replyDeadline"',
  "可提交项目咨询、作品相关问题和其他事项。",
  'data-i18n="consult.submit"',
]) {
  assert(contact.includes(needle), `contact.html contains ${needle}`);
}

assert(
  !contact.includes(web3FormsAccessKey),
  "contact.html does not expose the Web3Forms access key"
);

for (const forbidden of [
  'name="need_reply"',
  "是否需要回复",
  "需要回复",
  "仅提交信息，不需要回复",
  "可提交项目咨询、合作沟通、作品相关问题、网站反馈和无障碍访问问题。",
]) {
  assert(!contact.includes(forbidden), `contact.html does not contain ${forbidden}`);
}

const consultationTypeSelect =
  contact.match(/<select name="consultation_type"[\s\S]*?<\/select>/)?.[0] || "";
assert(consultationTypeSelect.length > 0, "consultation type select exists");
assert(
  (consultationTypeSelect.match(/<option\b/g) || []).length === 4,
  "consultation type select contains placeholder plus three options"
);

for (const requiredKey of [
  "consult.typeProject",
  "consult.typeWorks",
  "consult.typeOther",
]) {
  assert(
    consultationTypeSelect.includes(`data-i18n="${requiredKey}"`),
    `consultation type keeps ${requiredKey}`
  );
}

for (const removedKey of [
  "consult.typeCooperation",
  "consult.typeWebsite",
  "consult.typeAccessibility",
]) {
  assert(
    !consultationTypeSelect.includes(`data-i18n="${removedKey}"`),
    `consultation type removes ${removedKey}`
  );
  assert(!js.includes(`"${removedKey}"`), `main.js removes ${removedKey}`);
}

for (const needle of [
  "consultationForm",
  "web3FormsAccessKeyParts",
  "buildWeb3FormsAccessKey",
  "setupConsultationAccessKey",
  "setupConsultationForm",
  "handleConsultationSubmit",
  "fetch(consultationForm.action",
  '"consult.submit"',
  '"consult.success"',
  '"consult.error"',
  '"consult.replyDeadline"',
  "可提交项目咨询、作品相关问题和其他事项。",
  "Submit project inquiries, work-related questions, or other matters.",
  "180天内给予回复",
]) {
  assert(js.includes(needle), `main.js contains ${needle}`);
}

assert(
  !js.includes(web3FormsAccessKey),
  "main.js does not store the Web3Forms access key as one literal"
);

for (const forbidden of [
  "consult.replyYes",
  "consult.replyNo",
  "need_reply",
  "可提交项目咨询、合作沟通、作品相关问题、网站反馈和无障碍访问问题。",
  "Submit project inquiries, collaboration messages, work-related questions, website feedback, or accessibility issues.",
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
