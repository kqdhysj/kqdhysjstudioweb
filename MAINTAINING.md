# kqdhysj工作室网站维护说明

本文档用于后续维护、预览、验证和发布 `kqdhysj工作室` 静态网站。

## 目录定位

- 源码目录：`C:\Users\kqdhysj\Desktop\kqdhysj-studio-portal`
- 输出镜像：`C:\Users\kqdhysj\Documents\Codex\2026-07-14\new-chat-2\outputs\kqdhysj-studio-portal`
- GitHub 仓库：`https://github.com/kqdhysj/kqdhysjstudioweb`
- GitHub Pages：`https://kqdhysj.github.io/kqdhysjstudioweb/`

日常修改以桌面源码目录为准。输出镜像只用于预览、交付或同步，不要把输出镜像当作主编辑目录。

## 常用命令

在源码目录执行：

```powershell
npm run verify
npm run serve
npm run sync:outputs
```

- `npm run verify`：运行 JavaScript 语法检查和 `tests/verify-*.js` 回归测试。
- `npm run serve`：启动本地预览，默认地址为 `http://127.0.0.1:8016/`。
- `npm run sync:outputs`：把源码目录同步到输出镜像。脚本带目录保护，只允许同步到 `outputs/kqdhysj-studio-portal`。

## 修改内容位置

- 页面结构：根目录下的 `*.html`
- 视觉样式：`css/styles-final.css`
- 交互、搜索、天气、多语言、无障碍、表单逻辑：`js/main.js`
- 图片资源：`assets/images/`
- 公文 PDF：`pdfs/`
- 维护脚本：`scripts/`
- 回归测试：`tests/`

## 联系方式维护

网站不在 HTML 或 JS 中直接写完整邮箱，避免被简单爬虫直接抓取。

如需更换联系邮箱，在 `js/main.js` 中修改 `protectedEmailParts`：

```js
const protectedEmailParts = {
  primary: ["用户名", "邮箱域名", "后缀"],
  feedback: ["用户名", "邮箱域名", "后缀"],
};
```

不要把完整邮箱写进页面文本、属性、注释或 README。修改后运行：

```powershell
npm run verify
```

其中 `tests/verify-email-obfuscation.js` 会检查 HTML 和主 JS 中是否出现完整邮箱字符串。

## 咨询表单

咨询表单位于 `contact.html`，提交逻辑在 `js/main.js`，当前使用 Web3Forms。

- Web3Forms access key 写在 `contact.html` 的隐藏字段中。
- 联系方式只允许邮箱格式或中国大陆 11 位手机号格式。
- 表单包含简单反爬字段 `botcheck`。
- 不要在维护测试中真实提交表单数据，除非明确需要测试第三方服务。

修改表单后运行：

```powershell
npm run verify
```

重点关注：

- `tests/verify-consultation-form.js`
- `tests/verify-contact-validation.js`

## 多语言维护

多语言文本集中在 `js/main.js` 的 `translations` 对象中，包含：

- `zh-Hans`：简体中文
- `zh-Hant`：繁体中文
- `en`：英文

新增页面文字时，尽量同时补齐三种语言。页面中使用 `data-i18n`、`data-i18n-aria`、`data-i18n-placeholder` 等属性绑定翻译键。

## 作品页维护

作品列表在 `works.html`，当前仅展示《星河流转时 / Where Stars Drift》。

作品详情页在 `where-stars-drift.html`，相关翻译和搜索索引在 `js/main.js`：

- `siteSearchIndex`
- `workDetail.*`
- `works.card1.*`

作品 logo 位于 `assets/images/where-stars-drift-logo.png`。Steam 购买区域目前为占位，不会跳转外部商店。

## 天气与时间

天气、IP 定位时间和城市搜索逻辑在 `js/main.js`。天气服务当前基于公开 API，属于第三方网络能力。上线后如果天气不显示，先检查浏览器控制台和 API 可访问性，再检查本地代码。

## 无障碍与长者模式

无障碍工具栏、鼠标指向朗读、长者模式、高对比度和字号设置集中在 `js/main.js` 与 `css/styles-final.css`。修改相关区域后需要人工试用：

- 点击无障碍入口
- 开启辅助阅读
- 鼠标移动到文字、按钮、链接
- 切换关怀版、简体、繁体、English

## 发布流程

1. 修改源码目录中的文件。
2. 运行 `npm run verify`。
3. 运行 `npm run sync:outputs`。
4. 检查 Git 差异：

```powershell
git status --short
git diff --stat
```

5. 提交并推送：

```powershell
git add .
git commit -m "Update site maintenance tooling"
git push origin main
```

6. 等待 GitHub Pages 自动部署，打开 GitHub Pages 地址检查首页、作品页、联系页和搜索框。

## 常见问题

### 修改了 HTML 但页面没变化

优先确认你修改的是源码目录，不是输出镜像或浏览器缓存中的旧文件。保存后可以运行 `npm run serve`，用本地地址检查。如果需要同步到输出目录，再运行 `npm run sync:outputs`。

### 修改 JS 后怕影响搜索或无障碍

运行 `npm run verify`。如果通过，再人工打开本地预览检查搜索框、语言切换、无障碍工具栏和联系表单。

### GitHub Pages 没更新

确认已经 `git push origin main`，并在 GitHub 仓库 Pages 部署记录中查看是否完成。GitHub Pages 有时需要等待几十秒到数分钟。
