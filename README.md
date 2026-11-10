# 耳朵的地图 · A Map for Your Ears

**[▶ 在线阅读 earmap.liangdeer.com](https://earmap.liangdeer.com)**

[![在线阅读](https://img.shields.io/badge/在线阅读-earmap.liangdeer.com-1a1a1a)](https://earmap.liangdeer.com)
![14 章](https://img.shields.io/badge/章节-14-b5452f)
![330+ 示例](https://img.shields.io/badge/可听示例-330%2B-2f6f8f)
![零依赖](https://img.shields.io/badge/依赖-0-4a7a3a)
[![内容 CC BY-NC-SA 4.0](https://img.shields.io/badge/内容-CC%20BY--NC--SA%204.0-lightgrey)](LICENSE-CONTENT.md)
[![代码 MIT](https://img.shields.io/badge/代码-MIT-lightgrey)](LICENSE)

[![耳朵的地图 · 目录页](docs/cover.jpg)](https://earmap.liangdeer.com)

一本可以**边读边听**的音乐入门书。不用识谱，不用会乐器。

全书按一张双唱片编排，共 14 章：每一章讲一种音乐从哪里来、为什么听起来是这样，配有可以在浏览器里直接播放的示例、代码绘制的图解，以及一份推荐歌单。

所有声音示例都由浏览器用 Web Audio **当场合成**，旋律和编配为原创（少数使用公有领域的传统歌曲，均已注明）。推荐曲目只提供 YouTube、网易云音乐、QQ 音乐的收听链接，**本书不包含任何录音**。

| 14 章 | 约 11 小时阅读 | 330+ 个可听示例 | 140 幅图解 | 166 首推荐曲目 |
|:-:|:-:|:-:|:-:|:-:|

每一章都有自己的视觉风格，像一张唱片里风格各异的单曲：

[![巴洛克、朋克、嘻哈三章的开头](docs/chapters.jpg)](https://earmap.liangdeer.com)

> **In English:** *A Map for Your Ears* is a free, Chinese-language web book that teaches you to *hear* music — 14 chapters from the blues to today's pop, each with 20–40 sound demos synthesized live in your browser with the Web Audio API, hand-coded diagrams, and a curated listening list. No recordings, no frameworks, no build step: just static HTML. [Read it online →](https://earmap.liangdeer.com)

## 目录

| | 章节 | 文件夹 |
|---|---|---|
| 00 | Intro · 怎么听 | `intro/` |
| **SIDE A · 根源** | | |
| A1 | 布鲁斯 | `a1-blues/` |
| A2 | 民歌与乡村 | `a2-folk/` |
| A3 | 巴洛克 | `a3-baroque/` |
| A4 | 爵士 | `a4-jazz/` |
| **SIDE B · 摇滚家族** | | |
| B1 | 摇滚 | `b1-rock/` |
| B2 | 硬摇滚 | `b2-hardrock/` |
| B3 | 朋克 | `b3-punk/` |
| B4 | 金属 | `b4-metal/` |
| **SIDE C · 律动** | | |
| C1 | 灵魂乐与放克 | `c1-soul/` |
| C2 | 嘻哈 | `c2-hiphop/` |
| C3 | 电子舞曲 | `c3-edm/` |
| **SIDE D · 今天** | | |
| D1 | 另类 | `d1-alt/` |
| D2 | 当代流行 | `d2-pop/` |

## 怎么阅读

这是一组纯静态网页，不需要安装任何东西：

- **直接打开**：用浏览器打开根目录的 `index.html`（目录页），从那里进入各章。
- **本地服务器**（可选）：在仓库根目录运行 `python3 -m http.server`，然后访问 <http://localhost:8000>。
- **部署**：整个仓库可以直接放到 GitHub Pages、Cloudflare Pages 等任何静态托管上。

建议戴耳机：很多示例有低音，手机扬声器放不出来。

字体来自 Google Fonts，采用不阻塞页面的方式加载：访问不到时页面会直接用系统字体显示，不影响阅读。

部署到正式网址后，把 `meta.py` 里的 `SITE_URL` 改成网站地址并重新运行一次，分享卡片里的图片和链接才会是完整网址（微信、推特等平台需要完整网址才能显示分享图）。

## 仓库结构

每一章是一个独立的文件夹：

- `index.html`：生成好的完整页面，可以直接打开
- `body.html` / `src.html`：页面的 HTML 源文件
- `skin.css`：这一章的版式皮肤
- `*.js`：这一章的声音示例、图解和推荐曲目
- `build.py`：把上面几部分合成 `index.html`
- `img/`：章首插画和第三方照片

根目录下：

- `index.html`：目录页（由 `toc/` 生成）
- `build.py`：按顺序重建全部 14 章和目录页
- `nav.py`：统一全书的顶部曲目栏和上一章 / 下一章链接
- `cover-preview.css`：各章章首试听按钮的样式
- `meta.py`：给全书页面写入分享预览信息（简介、分享图、网站图标），并让 Google 字体不阻塞页面显示
- `favicon.svg`、`apple-touch-icon.png`：网站图标

修改源文件后重建：

```bash
python3 build.py   # 重建全部章节和目录页
python3 nav.py     # 重新生成全书导航
python3 meta.py    # 重新写入分享预览信息
```

各章共用 `a1-blues/` 里的音频引擎，所以 `build.py` 会先构建 A1。

## 给 AI 助手

用 AI 编程助手修改这个仓库时，请先让它阅读 [AGENTS.md](AGENTS.md)，里面是项目的规则和已确认的决定。

## 授权

- **原创内容**（文字、图解、合成示例、插画）：[CC BY-NC-SA 4.0](LICENSE-CONTENT.md)
- **代码**（页面里的 JavaScript、Python 构建脚本）：[MIT](LICENSE)
- **第三方照片**：来自维基共享资源（Wikimedia Commons），作者与授权见各章末尾的 Credits
- **推荐曲目**：只提供链接；录音与作品的权利归原权利人所有

## 来源与说明

- 章首插画与目录封面由 AI 生成，不描绘真实人物。
- 历史与人物叙述依据公开资料整理；涉及传说或有争议的说法，正文中已标明。
- 发现事实错误或授权问题，欢迎提 Issue。
