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

  const objectStart = source.indexOf("{", start);
  assert(objectStart >= 0, `${label} object starts with {`);
  if (objectStart < 0) return null;

  let cursor = objectStart;
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
        return Function(`return (${source.slice(objectStart, cursor + 1)});`)();
      }
    }
  }

  assert(false, `${label} object has a complete boundary`);
  return null;
}

const js = read(path.join("js", "main.js"));
const translations = extractObject(js, "const translations = ", "translations");
const extraTranslationOverrides = extractObject(js, "const extraTranslationOverrides = ", "extraTranslationOverrides");
const translationCompletionOverrides = extractObject(js, "const translationCompletionOverrides = ", "translationCompletionOverrides");

assert(translations !== null, "translations parsed successfully");
assert(extraTranslationOverrides !== null, "extraTranslationOverrides parsed successfully");
assert(translationCompletionOverrides !== null, "translationCompletionOverrides parsed successfully");
if (!translations || !extraTranslationOverrides || !translationCompletionOverrides) {
  process.exit(1);
}

if (extraTranslationOverrides && translationCompletionOverrides) {
  for (const [language, overrides] of Object.entries(translationCompletionOverrides)) {
    extraTranslationOverrides[language] = {
      ...(extraTranslationOverrides[language] || {}),
      ...overrides,
    };
  }
}

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

  for (const language of ["ja", "ko", "lzh"]) {
    const missingExplicitKeys = baseKeys.filter((key) => !Object.hasOwn(extraTranslationOverrides[language] || {}, key));
    assert(missingExplicitKeys.length === 0, `${language} has explicit translations for all keys`);
    if (missingExplicitKeys.length) {
      console.error(`Missing explicit translations in ${language}: ${missingExplicitKeys.join(", ")}`);
    }
  }

  const allowedUntranslatedKeys = new Set([
    "language.en",
    "language.ja",
    "language.ko",
    "portal.touchgal.title",
    "portal.gequbao.title",
    "portal.photopea.title",
    "portal.claude.title",
    "workDetail.englishTitle",
    "workDetail.meta.platformValue",
    "workDetail.meta.engineValue",
    "workDetail.steam.platformValue",
  ]);
  for (const language of ["ja", "ko"]) {
    const sameAsEnglish = baseKeys.filter((key) => (
      translations[language]?.[key] === translations.en?.[key] && !allowedUntranslatedKeys.has(key)
    ));
    assert(sameAsEnglish.length === 0, `${language} has no accidental English fallback text`);
    if (sameAsEnglish.length) {
      console.error(`Same as English in ${language}: ${sameAsEnglish.join(", ")}`);
    }
  }

  const simplifiedResidue = [
    "\u7b80", "\u4f53", "\u65e0", "\u788d", "\u6c14", "\u95e8", "\u4e3a", "\u4e0e", "\u89c2", "\u680f",
    "\u53d1", "\u52a1", "\u663e", "\u573a", "\u65f6", "\u6761", "\u8054", "\u7edc", "\u90ae",
    "\u8d44", "\u8baf", "\u8bbf", "\u95ee", "\u8bfb", "\u8f93", "\u5173", "\u952e",
    "\u7ed3", "\u9879", "\u8be6", "\u4e70", "\u4ef7", "\u5f00", "\u72b6", "\u6001", "\u8bed", "\u8fc1",
    "\u590d", "\u95ed", "\u542f", "\u5c42", "\u5355", "\u7ebf", "\u987a", "\u8f6c", "\u9f84", "\u540e",
    "\u5185", "\u6d4b", "\u9690", "\u79c1", "\u9519", "\u8bef", "\u9009", "\u62e9", "\u5f53", "\u9ed8",
    "\u5e2e", "\u4f20", "\u56fe", "\u6b22", "\u8fc7", "\u9875", "\u79f0", "\u5b9e", "\u53f7"
  ];
  const lzhSimplifiedHits = Object.entries(translations.lzh || {}).filter(([, value]) => (
    typeof value === "string" && simplifiedResidue.some((char) => value.includes(char))
  ));
  assert(lzhSimplifiedHits.length === 0, "lzh text contains no common Simplified Chinese residue");
  if (lzhSimplifiedHits.length) {
    console.error(lzhSimplifiedHits.map(([key, value]) => `${key}: ${value}`).join("\n"));
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
