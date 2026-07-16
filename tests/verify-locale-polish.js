const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
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

function mergeLanguagePacks() {
  const translations = extractObject(js, "const translations = ", "translations");
  const extraTranslationOverrides = extractObject(js, "const extraTranslationOverrides = ", "extraTranslationOverrides");
  const translationCompletionOverrides = extractObject(js, "const translationCompletionOverrides = ", "translationCompletionOverrides");
  if (!translations || !extraTranslationOverrides || !translationCompletionOverrides) {
    process.exit(1);
  }

  for (const [language, overrides] of Object.entries(translationCompletionOverrides)) {
    extraTranslationOverrides[language] = {
      ...(extraTranslationOverrides[language] || {}),
      ...overrides,
    };
  }

  for (const [language, overrides] of Object.entries(extraTranslationOverrides)) {
    const baseLanguage = language === "lzh" ? "zh-Hans" : "en";
    translations[language] = { ...translations[baseLanguage], ...overrides };
  }

  return translations;
}

function entriesContaining(languagePack, pattern) {
  return Object.entries(languagePack).filter(([, value]) => typeof value === "string" && pattern.test(value));
}

const translations = mergeLanguagePacks();

assert(translations["zh-Hant"]["language.zhHans"] === "簡體", "Traditional Chinese labels Simplified Chinese in Traditional script");
assert(entriesContaining(translations["zh-Hant"], /简体|信息门户|邮箱|页面|链接|点击/).length === 0, "Traditional Chinese contains no obvious Simplified Chinese UI residue");

const englishEntryHits = entriesContaining(translations.en, /\bentry\b/i);
assert(englishEntryHits.length === 0, "English UI avoids literal 'entry' wording for links");
if (englishEntryHits.length) {
  console.error(englishEntryHits.map(([key, value]) => `${key}: ${value}`).join("\n"));
}

const japaneseChineseStyleHits = entriesContaining(translations.ja, /入口|平台|簡体中文/);
assert(japaneseChineseStyleHits.length === 0, "Japanese UI avoids Chinese-style portal wording");
if (japaneseChineseStyleHits.length) {
  console.error(japaneseChineseStyleHits.map(([key, value]) => `${key}: ${value}`).join("\n"));
}

const koreanChineseStyleHits = entriesContaining(translations.ko, /[（）]|입구/);
assert(koreanChineseStyleHits.length === 0, "Korean UI avoids Chinese punctuation and literal entrance wording");
if (koreanChineseStyleHits.length) {
  console.error(koreanChineseStyleHits.map(([key, value]) => `${key}: ${value}`).join("\n"));
}

const traditionalResidue = [
  "資訊", "聯絡", "郵書", "電郵", "門戶", "頁", "鏈", "發", "為", "與", "臺", "線", "網", "訪", "讀",
  "顯", "項", "詳", "開", "狀", "態", "語", "遷", "復", "關", "鍵", "號", "體", "圖", "廣", "覽",
];
const lzhTraditionalHits = Object.entries(translations.lzh).filter(([, value]) => (
  typeof value === "string" && traditionalResidue.some((char) => value.includes(char))
));
assert(lzhTraditionalHits.length === 0, "Classical Chinese UI uses Simplified Chinese script consistently");
if (lzhTraditionalHits.length) {
  console.error(lzhTraditionalHits.map(([key, value]) => `${key}: ${value}`).join("\n"));
}

assert(js.includes('lzh: { htmlLang: "lzh-Hans", intlLang: "zh-CN", speechLang: "zh-CN" }'), "Classical Chinese metadata uses Simplified Chinese locale hints");

process.exit(failed ? 1 : 0);
