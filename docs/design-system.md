# 视觉规范（Design System）

> 项目：出来去哪玩（WQWN）· 最后更新：2026-11-24
>
> 实现文件：`css/style.css`（全局）与 `css/gz-redesign.css`（GUZANG Edition 局部覆盖）。
> 后续新增页面、组件、地图改版，默认沿用本规范；若需改变整体风格，先与用户确认。

## 1. 设计定位

**城市漫游手册 / Editorial City Guide**：像一本可交互的城市杂志，而不是通用 App 卡片页。

关键词：暖纸、墨色、朱砂橙、宋体大标题、等宽元信息、编号制、1px 细线、大图留白、编辑感。安静、克制、有纸张质感；信息密度可以高，但视觉层级必须清楚。

自 2026-11-23 起，「去哪 / 发布 / 搭子 / 搭子详情 / 我的」五个页面在基础系统之上叠加 **歸藏 GUZANG Edition**：更暖的纸色、稍深的墨色与朱砂，更严格的字阶与留白，全部规则限定在 `.gz-page` 作用域内，首页、详情、路线页继续使用基础系统。

## 2. 色彩 Token

### 2.1 全局「城市漫游手册」（`css/style.css`）

| Token | 值 | 用途 |
|---|---|---|
| `--paper` | `#f1efea` | 页面主底色（暖纸） |
| `--paper-2` | `#e9e5dc` | 次级纸色、图片占位、浅底块 |
| `--paper-3` | `#e0dbcf` | 更深一档纸色 |
| `--ink` | `#111110` | 主墨色：正文、标题、黑底模块、边框 |
| `--ink-2` | `#2b2a26` | 次级正文 |
| `--muted` | `#6f6b62` | 次要说明、meta |
| `--muted-2` | `#979186` | 更弱的元信息、占位 |
| `--line` | `#d7d1c4` | 常规细线、卡片描边 |
| `--line-soft` | `#e3ded3` | 更浅分割线 |
| `--accent` | `#e85d2a` | 朱砂橙：强调、active、按钮 hover、圆形发布按钮 |
| `--accent-ink` | `#b9431a` | 深朱砂：小节编号、链接强调 |
| `--accent-soft` | `#f6ddd2` | 浅朱砂底 |
| `--green` | `#2e6b4f` | 成功/积极状态 |
| `--danger` | `#b42318` | 错误状态 |

### 2.2 GUZANG Edition（`css/gz-redesign.css`）

作用域 `.gz-page`（抽签层为 `.gz-draw`），只覆盖局部变量，不改全局 `:root`：

| Token | 值 | 用途 |
|---|---|---|
| `--gz-paper` | `#f2efe7` | GUZANG 页面底色 |
| `--gz-paper-2` | `#eae5d8` | 次级纸色 |
| `--gz-paper-3` | `#ddd6c6` | 深纸色 |
| `--gz-ink` | `#12110f` | 主墨色 |
| `--gz-ink-2` | `#2c2a25` | 次级正文 |
| `--gz-muted` | `#726b5f` | 次要说明 |
| `--gz-muted-2` | `#9a9283` | 弱元信息 |
| `--gz-line` | `#d2caba` | 细线 |
| `--gz-line-soft` | `#e3ddcf` | 浅分割线 |
| `--gz-accent` | `#c2461f` | GUZANG 朱砂（比全局更沉稳） |
| `--gz-accent-ink` | `#a83a17` | 深朱砂 |
| `--gz-accent-soft` | `#efd8cb` | 浅朱砂底 |
| `--gz-green` | `#3d6b4f` | 成功/积极状态 |

使用原则：页面主体永远是暖纸 + 墨色；朱砂只做点睛，不大面积铺色；黑底区块用于「大家都在夸」、档案 Hero、护照封面等强调段，文字反白为纸色；不用高饱和渐变、荧光色、彩色阴影。

## 3. 字体与字阶

| Token | 字体栈 | 用途 |
|---|---|---|
| `--serif` / `--gz-serif` | `'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', Georgia, serif` | 品牌名、页面标题、小节标题、卡片标题、数字大字 |
| `--sans` / `--gz-sans` | `'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif` | 正文、说明、表单 |
| `--mono` / `--gz-mono` | `'JetBrains Mono', 'Cascadia Mono', 'Cascadia Code', 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace` | 英文 kicker、编号、日期、meta、按钮、标签 |

典型字阶：

- 品牌 `brand-name`：24px / serif / 600。
- 页面大标题、Hero 标题：24–34px / serif / 600。
- 小节标题 `section-title`：21px / serif / 600。
- 正文：13–15px / sans / 1.8–1.95 行高。
- `section-no`、`section-label`、`section-en`、`section-meta`：7–8px / mono / 大写字母、0.1–0.16em 字距。
- 按钮与 chip：9–10px / mono / 大写或小字距。

原则：中文标题用宋体，正文用无衬线，所有英文标签/编号/日期用等宽；不要把中文标题做成粗黑无衬线。

## 4. 布局与外壳

- 移动优先，主画布 `--shell: 430px`，页面左右内边距 `--pad: 20px`（GUZANG 页面为 `--gz-pad: 22px`），底部 tabbar 高度 `--tabbar-h: 64px`。
- 桌面端（≥720px）保留 430px 手机画布居中，外层是暖灰点阵桌面底 + 细边框 + 柔和投影，不做全屏响应式重排。
- 顶部 `masthead` 为 sticky：品牌 / 日期 / `CITY GUIDE · 城市漫游手册` / `LOCATION · 城市`，底部 1px 墨线。
- 固定底部 tabbar：5 列等宽（首页 / 去哪 / 发布 / 搭子 / 我的），中间「发布」为朱砂圆形悬浮按钮；当前 tab 顶部有 2px 朱砂短线。
- 内容区用 `section-head`（顶部 1px 墨线 + 编号 + 宋体标题 + 英文小字 + 右侧 meta）组织，形成「杂志目录」感。
- GUZANG 页面统一有 `WQWN · CITY GUIDE — ISSUE 026` 页脚（`.gz-page::after`），所有规则限定在 `.gz-page` 内。

## 5. 核心组件规则

### 按钮

- `.btn`：方角（`border-radius: 0`）、1px 墨线、透明底、mono 大写 9–10px、13px 22px 内边距。
- `.btn-primary`：墨黑底 + 纸色字；hover 变朱砂橙。
- `.btn-ghost`：纸线描边；hover 墨线，不填色。
- 不使用胶囊按钮、渐变按钮、彩色实心底。

### Chip / 筛选

- `.chip`：999px 胶囊、1px 纸线、mono 9px；`.is-active` 墨黑底 + 纸色字。
- 横向 chip 行可滚动但隐藏滚动条。
- GUZANG 页面的 chip 为方形、细线、字号更小，与服务范围一致。

### 卡片与列表

- 大图封面 + 编号 + 宋体标题 + 引用评价 + mono meta。
- 图片默认带轻微暖调：`filter: saturate(0.78) contrast(1.04) sepia(0.08)`。
- 详情页 Hero 全宽、底部渐变遮罩；头部信息反白。
- 个人中心 Hero 黑底、方形大头像、宋体姓名、mono 城市；统计为四列大数字。

### 表单

- `.field` 纵向排列；`.field-label` mono 8–9px 大写小字距。
- 输入框 1px 纸线、透明/纸色底、聚焦墨线；错误文案用 `--danger` 小字。

### 地图

- 地图区域是首页的重要「版面」，不是独立工具：需要与暖纸/墨线风格协调；标记、图例、城市下拉、外跳链接均应使用同一套 mono/serif 语言。
- 地图底图可以因供应商变化，但地图外围的标题、图例、按钮、卡片必须维持编辑设计风格。

### 灯箱 / 浮层

- 灯箱黑底（接近纯黑）、图片居中、底部 mono 说明、右上角细线「×」；不显示彩色边框。
- Toast 用墨黑底 + 纸色字，克制出现，不堆叠。
- 抽签层 `.gz-draw` 为暗墨底 + 米色细线 + 宋体大字，只保留一条朱砂进度线，不弹跳、不白闪。

### 空态 / 错误

- 空态排版：编号 + 宋体标题 + 简短说明 + 可选主按钮；不要用大面积插画或彩色图标。

## 6. 动效与交互

- 过渡以 0.16–0.22s ease 为主；hover 只改变颜色/边框/底色。
- 不使用弹跳、旋转、缩放超过 1.02 的夸张动效；`prefers-reduced-motion` 下抽签直接出结果、转场降级。
- 点击态明确但克制；所有可点击元素有 `:focus-visible` 朱砂外框。
- 横向滚动条隐藏；触控滚动使用 `-webkit-overflow-scrolling: touch`。

## 7. 页面级风格要点

| 页面 | 风格 |
|---|---|
| 首页 | 大图 Hero + 城市下拉 + 地图舞台 + 筛选 chip + 黑底「大家都在夸」横滑 + 编号地点卡（基础系统） |
| 今天去哪 | GUZANG：广州塔照片 Hero + 印章式「盲盒抽签」按钮；心情/玩什么编辑式索引 + 方形 chip；4:3「今日签」纸卡；ISSUE 017 页脚 |
| 路线串点 | 北京路照片 Hero + ROUTE 水印 + 统一标题、走法卡、路线示意图与时间轴（基础系统） |
| 发布 | GUZANG：武康路照片 Hero + 两行大字标题；LIVE PREVIEW 纸卡；01–04 编号章节 + 下划线输入 + 3 列方图网格 |
| 搭子 | GUZANG：太古里照片 Hero；MATCHMAKER 黑底大字入口；左日期块 + 右公告板行 |
| 搭子详情 | GUZANG：关联地点封面 + BUDDY FILE 印章；档案式信息表 + 三列成员墙 + 下划线申请表单 |
| 我的 | GUZANG：西湖日落档案 Hero + ARCHIVE 水印；四栏大数字；七段黑色章节卡；护照封面与徽章墙 |
| 地点详情 | 沉浸式 Hero + 四项数字条 + WARNING 面板 + 护照打卡卡 + 地址/信息/关于 + 实况 + 评论（基础系统） |

## 8. 文案与图标

- 中文文案保持短句、具体、有画面感；英文只做 kicker/标签，不做整段英文。
- 图标使用内联 SVG，线宽细、无填充彩色；emoji 仅用于内容语义（头像、分类、心情）而非装饰。
- 编号统一 `01 / 02 / 03`；英文标签统一大写，如 `CITY GUIDE`、`WARNING`、`LIVE`、`PASSPORT`、`WQWN`。

## 9. 实现约定

- 全局 token 只在 `css/style.css` 顶部 `:root` 定义；GUZANG 局部 token 只在 `.gz-page` 定义，不改全局值。
- 新页面/新组件优先复用：`.section-head`、`.section-no`、`.section-title`、`.section-en`、`.section-meta`、`.btn`、`.chip`、`.field`。
- 新样式优先追加到文件末尾；GUZANG 样式限定在 `.gz-page` / `.gz-draw` 作用域，避免污染首页/详情/路线页。
- 不改变 `index.html` 的脚本顺序与 `W.UI` / `W.Store` / `W.Views` 契约。
- 新增页面、地图或图片改造前先读本文件；风格变更需用户明确确认。

## 10. 不要做

- 不要把整体改成通用 SaaS / Tailwind 风格。
- 不要大面积使用圆角、玻璃拟态、彩色渐变、重阴影。
- 不要用高饱和红/蓝/紫替代朱砂橙。
- 不要把宋体标题改成粗黑无衬线。
- 不要让新增模块（地图、娱乐设施、灯箱）脱离暖纸/墨线/mono 的版面语言。
