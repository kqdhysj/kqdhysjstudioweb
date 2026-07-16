const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const expectedLanguages = ["zh-Hans", "zh-Hant", "en", "ja", "ko", "lzh"];
const expectedLanguageKeys = {
  "zh-Hans": "language.zhHans",
  "zh-Hant": "language.zhHant",
  en: "language.en",
  ja: "language.ja",
  ko: "language.ko",
  lzh: "language.lzh",
};
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

function extractObject(source, marker, label) {
  const start = source.indexOf(marker);
  assert(start >= 0, `main.js defines ${label}`);
  if (start < 0) return null;

  let cursor = source.indexOf("{", start);
  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;

  for (; cursor < source.length; cursor += 1) {
    const char = source[cursor];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) inString = false;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return Function(`return (${source.slice(source.indexOf("{", start), cursor + 1)});`)();
      }
    }
  }

  assert(false, `${label} object has a complete boundary`);
  return null;
}

const js = read(path.join("js", "main.js"));
const translations = extractObject(js, "const translations = ", "translations");
const extraTranslationOverrides = js.includes("const extraTranslationOverrides = ")
  ? extractObject(js, "const extraTranslationOverrides = ", "extraTranslationOverrides")
  : {};

if (translations && extraTranslationOverrides) {
  for (const [language, overrides] of Object.entries(extraTranslationOverrides)) {
    const baseLanguage = language === "lzh" ? "zh-Hant" : "en";
    translations[language] = { ...translations[baseLanguage], ...overrides };
  }
}

if (translations) {
  for (const language of expectedLanguages) {
    assert(Boolean(translations[language]), `translations include ${language}`);
    assert(js.includes(`${language}:`) || js.includes(`"${language}":`), `languageMeta includes ${language}`);
  }

  const baseKeys = Object.keys(translations["zh-Hans"] || {}).sort();
  for (const language of expectedLanguages) {
    const keys = Object.keys(translations[language] || {}).sort();
    assert(keys.length === baseKeys.length, `${language} has ${baseKeys.length} translation keys`);
    const missingKeys = baseKeys.filter((key) => !Object.hasOwn(translations[language] || {}, key));
    assert(missingKeys.length === 0, `${language} is missing no keys`);
    if (missingKeys.length) {
      console.error(`Missing in ${language}: ${missingKeys.join(", ")}`);
    }
  }

  for (const [language, key] of Object.entries(expectedLanguageKeys)) {
    assert(Boolean(translations[language]?.[key]), `${language} has its language label`);
  }
}

for (const file of fs.readdirSync(root).filter((name) => name.endsWith(".html"))) {
  const html = read(file);
  const buttons = html.match(/<button[^>]+data-language="[^"]+"/g) || [];
  assert(buttons.length === expectedLanguages.length, `${file} has six language buttons`);
  for (const language of expectedLanguages) {
    assert(html.includes(`data-language="${language}"`), `${file} includes ${language} language button`);
    assert(html.includes(`data-i18n="${expectedLanguageKeys[language]}"`), `${file} uses ${language} language label`);
  }
}

for (const language of expectedLanguages) {
  assert(
    fs.existsSync(path.join(root, "assets", "images", `button-feedback-${language}.svg`)),
    `feedback image button exists for ${language}`
  );
  assert(
    fs.existsSync(path.join(root, "assets", "images", `button-sitemap-${language}.svg`)),
    `sitemap image button exists for ${language}`
  );
}

const contact = read("contact.html");
const preferredLanguageSelect = contact.match(/<select name="preferred_language"[\s\S]*?<\/select>/)?.[0] || "";
assert(preferredLanguageSelect.length > 0, "contact form has preferred language select");
for (const language of expectedLanguages) {
  assert(
    preferredLanguageSelect.includes(`data-i18n="${expectedLanguageKeys[language]}"`),
    `preferred language select includes ${language}`
  );
}

process.exit(failed ? 1 : 0);
