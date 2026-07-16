# kqdhysj Studio Web

kqdhysj工作室信息门户静态网站，面向 GitHub Pages 发布。

## 发布目录

仓库根目录即网站根目录，GitHub Pages 选择 `main` 分支的 `/ (root)` 发布。

## 主要入口

- `index.html`
- `works.html`
- `where-stars-drift.html`
- `contact.html`
- `sitemap.html`

## 常用命令

```powershell
npm run verify
npm run serve
npm run sync:outputs
```

- `npm run verify`：运行 JS 语法检查和回归测试。
- `npm run serve`：本地预览，默认 `http://127.0.0.1:8016/`。
- `npm run sync:outputs`：同步到 Codex 输出镜像目录。

完整维护说明见 [MAINTAINING.md](MAINTAINING.md)。
