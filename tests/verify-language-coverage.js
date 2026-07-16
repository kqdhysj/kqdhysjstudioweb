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
    const baseLanguage = language === "lzh" ? "zh-Hans" : "en";
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
    "portal.renpy.title",
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

  const traditionalResidue = [
    "\u8cc7", "\u8a0a", "\u806f", "\u7d61", "\u90f5", "\u66f8", "\u96fb", "\u9580", "\u6236", "\u9801",
    "\u93c8", "\u767c", "\u70ba", "\u8207", "\u81fa", "\u7dda", "\u7db2", "\u8a2a", "\u8b80",
    "\u986f", "\u9805", "\u8a73", "\u958b", "\u72c0", "\u614b", "\u8a9e", "\u9077", "\u5fa9", "\u95dc",
    "\u9375", "\u865f", "\u9ad4", "\u5716", "\u5ee3", "\u89bd"
  ];
  const lzhTraditionalHits = Object.entries(translations.lzh || {}).filter(([, value]) => (
    typeof value === "string" && traditionalResidue.some((char) => value.includes(char))
  ));
  assert(lzhTraditionalHits.length === 0, "lzh text contains no common Traditional Chinese residue");
  if (lzhTraditionalHits.length) {
    console.error(lzhTraditionalHits.map(([key, value]) => `${key}: ${value}`).join("\n"));
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
