const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const chinesePattern = /[\u3400-\u9fff]/;
const ignoredTextPatterns = [
  /^\d{4}年\d{2}月\d{2}日\s+星期[一二三四五六日]$/,
  /^天气加载中$/,
];
const ignoredTextTags = new Set(["script", "style", "title", "template"]);
const bindableAttributes = {
  alt: "data-i18n-alt",
  "aria-label": "data-i18n-aria",
  placeholder: "data-i18n-placeholder",
  title: "data-i18n-title",
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

function parseAttributes(source) {
  const attributes = {};
  const attributePattern = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;

  while ((match = attributePattern.exec(source))) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match;
    attributes[name.toLowerCase()] = doubleQuoted ?? singleQuoted ?? unquoted ?? "";
  }

  return attributes;
}

function isIgnoredText(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return ignoredTextPatterns.some((pattern) => pattern.test(normalized));
}

function getLineNumber(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function scanHtml(file, html) {
  const issues = [];
  const stack = [];
  const tokenPattern = /<!--[\s\S]*?-->|<![^>]*>|<\/?[^>]+>/g;
  let cursor = 0;
  let match;

  function currentTextIsBound() {
    return stack.some((entry) => entry.hasTextBinding);
  }

  function currentTagIsIgnored() {
    const current = stack[stack.length - 1];
    return current && ignoredTextTags.has(current.tagName);
  }

  function inspectText(start, end) {
    const text = html.slice(start, end);
    if (!chinesePattern.test(text) || currentTagIsIgnored() || currentTextIsBound() || isIgnoredText(text)) {
      return;
    }

    issues.push({
      line: getLineNumber(html, start),
      message: `Chinese text lacks data-i18n binding: ${text.replace(/\s+/g, " ").trim()}`,
    });
  }

  while ((match = tokenPattern.exec(html))) {
    inspectText(cursor, match.index);
    const tag = match[0];
    cursor = tokenPattern.lastIndex;

    if (tag.startsWith("<!--") || tag.startsWith("<!")) {
      continue;
    }

    const closingMatch = tag.match(/^<\/\s*([a-z0-9-]+)/i);
    if (closingMatch) {
      const tagName = closingMatch[1].toLowerCase();
      for (let index = stack.length - 1; index >= 0; index -= 1) {
        const entry = stack.pop();
        if (entry.tagName === tagName) break;
      }
      continue;
    }

    const openingMatch = tag.match(/^<\s*([a-z0-9-]+)\b([\s\S]*?)\/?\s*>$/i);
    if (!openingMatch) {
      continue;
    }

    const [, rawTagName, rawAttributes] = openingMatch;
    const tagName = rawTagName.toLowerCase();
    const attributes = parseAttributes(rawAttributes);

    for (const [attributeName, binderName] of Object.entries(bindableAttributes)) {
      const value = attributes[attributeName];
      if (value && chinesePattern.test(value) && !Object.hasOwn(attributes, binderName)) {
        issues.push({
          line: getLineNumber(html, match.index),
          message: `${attributeName}="${value}" lacks ${binderName}`,
        });
      }
    }

    const isVoid = /\/\s*>$/.test(tag) || new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]).has(tagName);
    if (!isVoid) {
      stack.push({
        tagName,
        hasTextBinding: Object.hasOwn(attributes, "data-i18n"),
      });
    }
  }

  inspectText(cursor, html.length);

  assert(issues.length === 0, `${file} has no untranslated Chinese HTML text or attributes`);
  for (const issue of issues) {
    console.error(`${file}:${issue.line} ${issue.message}`);
  }
}

for (const file of fs.readdirSync(root).filter((name) => name.endsWith(".html")).sort()) {
  scanHtml(file, fs.readFileSync(path.join(root, file), "utf8"));
}

process.exit(failed ? 1 : 0);
