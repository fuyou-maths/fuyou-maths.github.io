# 蜉蝣 · 个人主页

线上地址：<https://fuyou-maths.github.io/>

一个纯 HTML / CSS / JS 的单页个人主页，无后端、无框架、无构建步骤，托管在 GitHub Pages。

## 目录结构

| 文件 / 目录 | 说明 |
|---|---|
| `index.html` | 主页：关于 / 研究 / 项目 / 随笔 / 行迹 / 我思 / 联系 |
| `essays.html` | 随笔列表页（12 篇公众号文章）+ 公众号二维码 |
| `style.css` | 全部样式，深 / 浅双主题（`data-theme` 属性切换） |
| `main.js` | 交互：主题、移动端菜单、滚动显现、萤火粒子、轮播等 |
| `favicon.svg` | 站点图标 |
| `images/` | 文章封面（`articles/`）、书法、山水画、公众号二维码 |
| `_素材/` | 本地素材收集区，**已在 `.gitignore` 排除，不上线** |

## 本地预览

直接双击 `index.html`，或起一个本地服务：

```bash
cd fuyou-homepage
python3 -m http.server 8000
```

访问 <http://localhost:8000>。

## 部署 / 更新

仓库推送到 GitHub 的 `fuyou-maths.github.io` 仓库即自动发布（Settings → Pages → main 分支）。

日常更新流程：

1. 改动文件后，若涉及 `style.css` 或 `main.js`，把 `index.html` 和 `essays.html` 里引用的 `?v=N` 版本号 **同步 +1**，避免访客浏览器吃到旧缓存；
2. commit 并 push，一两分钟后线上生效。

## 内容维护备忘

- **新文章**：封面图放 `images/articles/`（按序号命名），然后在 `index.html` 随笔轮播和 `essays.html` 文章列表各加一张卡片，链接指向公众号原文。
- **暂缓上线（已注释，随时启用）**：
  - 读书 · 书单板块（`index.html` 随笔区，有书目后取消注释填入）；
  - 微信号（`index.html` 联系区，确定公开后取消注释填入）。
- **研究板块**：目前是「整理中」空状态，成果就绪后逐条填入。

## 绑定自定义域名（可选）

1. 域名解析加 `CNAME` 记录指向 `fuyou-maths.github.io`；
2. 仓库 Settings → Pages → Custom domain 填写并保存。

> GitHub Pages 服务器在境外，自定义域名无需 ICP 备案；若日后迁到国内云托管则需要备案。
