# 出来去哪玩（WQWN）

> 面向「约朋友出门却不知道去哪」的纯前端城市探索原型：发现城市里好玩的地点、看别人的真实评价、找搭子一起出门。

**当前状态（2026-11-24）**：5 个用户 / 296 个地点（36 座城市）/ 830 条评论（395 条带图）/ 4 个搭子 / 13 条打卡 / 9 条避雷 / 10 条实况 / 338 张在用本地图片。项目为零构建、无需安装依赖、无后端的静态站点，业务数据保存在浏览器 `localStorage`（key：`wqwn.v3`）。

设计上采用「城市漫游手册 / Editorial City Guide」编辑设计（暖纸底、宋体标题、等宽元信息、细线分割、大图留白）；「去哪 / 发布 / 搭子 / 搭子详情 / 我的」五个页面使用 **歸藏 GUZANG Edition** 视觉（`css/gz-redesign.css`，作用域 `.gz-page`）。

## 1. 快速开始

```bash
# 方式一：本地静态服务器（推荐）
python -m http.server 8080
# 浏览器打开 http://127.0.0.1:8080/

# 方式二：npx
npx serve .

# 方式三：直接双击 index.html（file:// 可用，浏览器定位能力受限）
```

运行说明：

- 外部脚本只有两个来源：高德 JS API 2.0（首页地图，动态按需加载，Key 从本地 `js/map-config.js` 读取；可复制 `js/map-config.example.js` 后填写）和 Leaflet 1.9.4（CDN，作为地图降级依赖）。未配置 Key 或高德加载失败、超时 5 秒时，会自动降级到 Leaflet + OpenStreetMap；再失败降级为内置 SVG 示意图，标记仍可点击。
- 全部地点图片、评论图片均为本地素材（`assets/photos/`、`city-photos/`、`review-photos/`），没有外链图片；断网时除地图底图外页面可完整显示。
- 首次打开自动写入种子数据。可在「我的 → 切换演示身份」切换 5 个种子用户，用「重置演示数据」恢复初始状态。

## 2. 当前规模

| 项目 | 数量 |
|---|---|
| 用户 | 5（u1–u5） |
| 地点 | 296 个，覆盖 36 座城市 |
| 评论 | 830 条，其中 395 条带图（400 个图片引用） |
| 搭子 | 4 个（open / full 状态齐全，含待审批申请） |
| 打卡记录 | 13 条 |
| 避雷记录 | 9 条 |
| 实况 | 10 条 |
| 在用本地图片 | 338 张（268 张地点/图集图片 + 70 张评论配图） |

城市顺序（`js/location.js` 的 `CITY_ORDER`）：广州、佛山、深圳、杭州、成都、上海、北京、长沙、重庆、西安、南京、武汉、厦门、青岛、苏州、天津、昆明、大理、丽江、桂林、三亚、石家庄、太原、呼和浩特、沈阳、长春、哈尔滨、郑州、合肥、南昌、贵阳、拉萨、兰州、西宁、银川、乌鲁木齐。

## 3. 目录结构

```
index.html                    应用外壳（header / #view-root / #tabbar / #toast-layer）+ 固定脚本顺序
css/style.css                 「城市漫游手册」全局样式与基础组件（CSS 变量 token 在顶部 :root）
css/gz-redesign.css           GUZANG Edition 视觉层，仅作用于 .gz-page / .gz-draw 等明确作用域
js/ui.js                      W.UI      通用工具、DOM 构建、toast/confirm、日期与距离格式化、图标、图库、灯箱
js/review-photos.js           W.ReviewPhotos 评论配图库（按分类轮换，自动避开地点封面/图集）
js/store.js                   W.Store   唯一数据源：localStorage 读写 + 全部领域操作（41 个公开成员）
js/seed.js                    W.Seed    主种子数据（用户 / 地点 / 评论 / 搭子 / 打卡）
js/seed-play-a/b/c.js         W.SeedPlayA/B/C 分城市娱乐与补充种子
js/seed-cities.js             13 城扩展种子（重庆 / 西安 / 南京 / 武汉 / 厦门 / 青岛 / 苏州 / 天津 / 昆明 / 大理 / 丽江 / 桂林 / 三亚）
js/seed-provinces.js          15 座省会/首府城市种子（石家庄 / 太原 / 呼和浩特 / 沈阳 / 长春 / 哈尔滨 / 郑州 / 合肥 / 南昌 / 贵阳 / 拉萨 / 兰州 / 西宁 / 银川 / 乌鲁木齐）
js/location.js                W.Location 城市中心、定位会话、最近城市与距离排序
js/route.js                   W.Route   路线串点：主题选点、距离排序、时间轴、高德整条路线 URI
js/map-config.example.js      地图配置示例（复制为 js/map-config.js 后填入本地高德 Key；真实配置不提交）
js/map.js                     W.MapView 地图适配层（高德 JS API 2.0 → Leaflet → SVG 三级降级）
js/views/home.js              W.Views.home       首页：城市切换 + 附近推荐 + 地图聚合 + 筛选 + 口碑 + 路线入口
js/views/whereto.js           W.Views.whereto    今天去哪：心情筛选 + 盲盒抽签 + 今日结果卡 + 串路线入口
js/views/routes.js            W.Views.routes     路线串点：城市/走法选择 + 路线示意图 + 时间轴 + 我的路线
js/views/publish.js           W.Views.publish    发布：实时投稿卡预览 + 四段表单 + 九宫格选图 + 本地照片
js/views/detail.js            W.Views.detail     详情：沉浸头图 + 统计 + 避雷 + 护照打卡 + 信息 + 实况 + 评论
js/views/buddies.js           W.Views.buddies    搭子广场：日期公告板 + 发起搭子 + MATCHMAKER 匹配问卷
js/views/buddyDetail.js       W.Views.buddyDetail 搭子详情：关联地点封面 + 申请 + 审批
js/views/profile.js           W.Views.profile    个人中心：照片档案 Hero + 统计 + 七分区（含护照 / 收藏）
js/app.js                     W.Router  hash 路由 + tabbar 事件委托 + 启动
scripts/store-smoke.mjs       数据层冒烟脚本（node scripts/store-smoke.mjs，19 项断言）
assets/photos/                主图库（105 个文件，当前种子使用 86 个；授权见 CREDITS.md）
city-photos/                  扩展城市实景图（182 张，s201–s382；授权见 CREDITS.md）
review-photos/                评论配图（70 张，按 13 类组织；授权见 CREDITS.md）
docs/                         项目文档（当前文档 + 归档，见 docs/README.md）
.codeartsdoer/plans/          执行计划与阶段台账（wanna-play 为当前主计划；location-* / publish-* 为阶段 12–15 历史计划）
```

## 4. 页面与路由

| 路由 | 页面 | 主要内容 |
|---|---|---|
| `#/home` | 首页 | 城市切换（全部城市 + 36 城）、附近推荐与定位、城市地图、搜索、三组筛选（题材 / 娱乐设施 / 距离）、「大家都在夸」口碑横滑、地点卡列表、路线入口 |
| `#/whereto` | 今天去哪 | 7 种心情筛选、7 类娱乐设施筛选、盲盒抽签（全屏落签仪式）、今日结果卡、再摇一次、去详情、把这一签串成路线 |
| `#/routes` | 路线串点 | 5 种走法（半日经典 / 一日漫游 / 出片路线 / 夜游小环线 / 玩点新鲜）、出发城市选择、路线统计、经纬度投影示意图、时间轴、保存/查看/删除我的路线；支持 `#/routes?start=<spotId>` 带入起点 |
| `#/publish` | 发布 | 标题、分类、城市、价格、地址、经纬度（可定位自动填写）、九宫格选图（内置 6 张 + 本地添加最多 9 张）、描述、标签；实时投稿卡预览 |
| `#/spot/:id` | 地点详情 | 沉浸式图片头图与横滑图集、评论/浏览/点赞/收藏四项统计、避雷提示、城市护照打卡、地址与信息、关于、实况速报、星级评论（可配图） |
| `#/buddies` | 搭子广场 | 进行中搭子列表（日期公告板卡片）、按类型筛选、搜索、发起搭子表单、MATCHMAKER 三问匹配问卷 |
| `#/buddy/:id` | 搭子详情 | 关联地点封面、搭子信息、成员列表、申请表单、发起人审批（同意/拒绝） |
| `#/profile` | 我的 | 个人档案 Hero、发布/发起/加入/收藏四项统计、七个分区（发布 / 护照 / 发起 / 加入 / 申请 / 收藏 / 点赞）、切换演示身份、重置演示数据 |

未知路由回退到首页；详情或搭子不存在时显示可返回首页的空态。

## 5. 功能说明

### 5.1 首页与地图

- 城市下拉包含「全部城市 / ALL」和 36 座城市；切换城市后地图与列表联动，列表按当前城市与距离过滤，地图保留全国数据以便缩小查看全国省份标记。
- 支持浏览器定位：允许后按真实位置计算距离并匹配最近收录城市；拒绝或失败时提示「定位不可用，已使用默认位置」，以默认城市（广州）为中心。
- 筛选分三行互斥：题材（全部 / 美食 / 玩乐 / 自然风景 / 拍照打卡 / 夜生活 / 其他）、娱乐设施（KTV / 剧本杀 / 密室逃脱 / 桌游 / 电玩城 / 影院 / Livehouse）、距离（500m / 1km / 3km / 5km / 不限）。搜索支持回车提交与清除，组合空结果提供「清除筛选」。
- 地图三级降级：高德 JS API 2.0（含 WGS-84 → GCJ-02 转换）→ Leaflet 1.9.4 + OSM → 内置 SVG 示意图；聚合标记可点击展开地点列表，单标记直达详情。
- 「大家都在夸」显示当前城市 6 条高赞评论，支持鼠标滚轮横滑与拖拽，点击进入对应详情。
- 首页下方「CITY ROUTES · 路线串点」横幅展示当前城市、走法与已保存路线数，一键进入 `#/routes`。

### 5.2 今天去哪

- 进入页面自动抽一签，约 0.6–0.9 秒「墨纸落签」仪式后出现随机地点卡（编号、分类、标题、城市·价格、最高赞评价）；`prefers-reduced-motion` 下直接出结果。
- 心情筛选 7 项（都可以 / 吃点好的 / 玩点新鲜的 / 看看风景 / 拍点照片 / 夜游一下 / 随便逛逛）；「想玩什么」7 项娱乐设施筛选；再摇一次不会与上一次重复，只剩一个地点时提示「签筒里只剩这一张了。」
- 结果卡操作：去详情、再摇一次、把这一签串成一条路线（进入路线页并以该地点为第一站）。

### 5.3 路线串点

- 5 种走法：半日经典（4 站 / 13:30）、一日漫游（6 站 / 10:00）、出片路线（4 站 / 14:00）、夜游小环线（4 站 / 18:30）、玩点新鲜（4 站 / 14:00）。
- 按主题过滤后按评分/热度加权、分类轮转选点，再用最近邻排序；输出每站到达/离开时间、路段距离、总时长、总里程、门票预算和高德整条路线 URI。
- 支持保存为「我的路线」、查看已保存顺序、删除；路线数据保存在 `wqwn.v3` 的 `routes` 字段，旧数据自动补齐。

### 5.4 发布

- 四段编号表单：基本信息（名称 / 分类 / 城市 / 价格）、位置（定位按钮可自动填写地址与坐标）、图片、描述与标签。
- 校验规则：名称 2–40 字、分类必选、地址必填、经纬度合法、价格不小于 0；提交按钮置 disabled 防重复。
- 图片：内置 6 张图库 + 本地照片添加，最多 9 张；本地照片经 Canvas 压缩（JPEG 0.82，最长边 1280px）后即时预览，可移除。
- 顶部「LIVE PREVIEW · 你的投稿卡」实时联动标题、分类、城市、价格与首图。

### 5.5 地点详情

- 头图 408px 沉浸式展示，多图可横滑并带指示点；右上收藏/点赞悬浮按钮；四项统计为评论 / 浏览量 / 点赞 / 收藏。
- 模块顺序：避雷提示（WARNING）→ 城市护照打卡 → 地址行 → INFORMATION 信息表 → ABOUT → 实况速报（LIVE）→ 真实评价评论区。
- 避雷：6 个固定标签（排队太久 / 名不副实 / 环境嘈杂 / 性价比低 / 交通不便 / 临时关闭），每用户每地点最多 1 条，备注 ≤60 字，可修改、可取消。
- 实况：1–140 字 + 最多 3 张评论图库照片，倒序展示 8 条，本人可删除。
- 评论：星级 1–5、文字 1–200 字、最多 3 张配图；作者可删除；配图来自独立评论图库，不与地点封面/图集重复。
- 所有封面、头图、评论配图、实况配图可点开黑底灯箱：滚轮缩放 1×–4×、拖动查看、双击/复位、×/黑底/Esc 关闭。

### 5.6 搭子

- 搭子广场：4 个种子搭子，日期公告板卡片展示类型、状态（可加入 / 已满员 / 已结束）、时间、地点、关联地点和成员容量；支持类型筛选与关键词搜索。
- 发起搭子：标题、类型、城市、集合时间（需晚于当前）、集合地点、人数上限 2–20、关联地点、备注。
- 申请与审批：留言 + 联系方式；重复申请 / 已是成员 / 已满员分别拦截；发起人可同意或拒绝，满员自动置为 `full`。
- MATCHMAKER：三问（搭子类型 / 城市 / 搭子人格：计划控 / 随性派 / 气氛组 / 安静陪伴）→ 按同城、类型、空位、时间与关键词加权，展示匹配分数、理由和结果卡；可直接进入详情或「发布同款搭子」预填表单。

### 5.7 我的

- 照片档案 Hero（背景图随当前用户所在城市选取当地地点封面）、ARCHIVE 水印、MEMBER FILE 页脚。
- 四项统计：发布地点 / 发起搭子 / 加入搭子 / 收藏地点。
- 七个分区：发布 POSTS、护照 PASSPORT、发起 HOSTED、加入 JOINED、申请 APPLIES、收藏 SAVED、点赞 LIKED；空分区有占位与去处按钮。
- 护照：打卡统计（打卡地点 / 到访城市 / 连续天数 / 获得徽章）、城市印章、6 枚徽章（初见 / 漫游者 / 收藏家 / 三城记 / 夜行者 / 老饕）进度。
- 演示设置：切换 5 个种子身份；重置演示数据（二次确认）。

### 5.8 需求覆盖（R1–R13）

| 编号 | 需求 | 状态 | 实现位置 |
|---|---|---|---|
| R1 | 地点分享发布（四段表单、九宫格选图、逐字段校验） | ✅ | `js/views/publish.js` |
| R2 | 地图聚合展示（高德 → Leaflet → SVG、城市切换、标记联动） | ✅ | `js/map.js`、`js/views/home.js` |
| R3 | 地点详情 + 评论点赞 + 收藏 + 浏览量 | ✅ | `js/views/detail.js`、`js/store.js` |
| R4 | 附近筛选（分类 / 距离 / 关键词 / 定位降级） | ✅ | `js/views/home.js`、`js/location.js` |
| R5 | 一键导航（高德 URI，`callnative=1`） | ✅ | `js/ui.js` |
| R6 | 搭子发布（类型、集合时间地点、人数 2–20、关联地点） | ✅ | `js/views/buddies.js` |
| R7 | 搭子申请与发起人审批（重复/已加入/满员拦截） | ✅ | `js/views/buddyDetail.js`、`js/store.js` |
| R8 | 个人中心（资料、统计、七分区、切换身份、重置数据） | ✅ | `js/views/profile.js` |
| R9 | 今天去哪（第五标签·盲盒抽签、心情/设施筛选） | ✅ | `js/views/whereto.js` |
| R10 | 城市探索护照 / 打卡挑战（幂等打卡、印章、6 枚徽章） | ✅ | `js/store.js`、`js/views/detail.js`、`js/views/profile.js` |
| R11 | 路线串点（5 种走法、时间轴、保存/查看/删除） | ✅ | `js/route.js`、`js/views/routes.js` |
| R12 | 搭子匹配问卷（三问、分数与理由、发布同款预填） | ✅ | `js/views/buddies.js` |
| R13 | 避雷 / 实况评论（6 标签、实况 1–140 字 + 最多 3 图） | ✅ | `js/views/detail.js`、`js/store.js` |

## 6. 数据与本地存储

- 存储 key：`wqwn.v3`，整个应用状态是一个 JSON 对象。旧数据在 `W.Store.init()` 时自动补齐字段（`photos / views / favorites / live / warns / checkins / routes`），并按种子 ID 增量补齐新增城市地点，不覆盖用户内容。
- 种子数据由 `W.Seed.build()` 生成；扩展种子在 `seed-play-*.js`、`seed-cities.js`、`seed-provinces.js` 中定义，由 `seed.js` 合并。

核心数据模型：

| 模型 | 关键字段 |
|---|---|
| `User` | `id`、`name`、`avatar`、`bio`、`city` |
| `Spot` | `id`、`title`、`category`、`city`、`address`、`lat`、`lng`、`price`、`cover`、`images[]`、`description`、`tags[]`、`creatorId`、`createdAt`、`views`、`favorites[]`、`likes[]`、`comments[]`、`warns[]`、`live[]` |
| `Comment` | `id`、`userId`、`userName`、`rating`（1–5）、`content`（1–200 字）、`createdAt`、`photos[]`（0–3 张） |
| `Buddy` | `id`、`title`、`type`（meal/play/travel/sport/other）、`city`、`meetAt`、`meetPlace`、`spotId`、`maxPeople`（2–20）、`memberIds[]`、`note`、`creatorId`、`createdAt`、`status`（open/full/done）、`applies[]` |
| `Apply` | `id`、`userId`、`userName`、`message`、`contact`、`createdAt`、`status`（pending/approved/rejected） |
| `Checkin` | `id`、`userId`、`spotId`、`createdAt` |
| `Route` | `id`、`userId`、`title`、`city`、`theme`、`durationKey`、`spotIds[]`（至少 2 个）、`note`、`createdAt` |

## 7. 技术架构

- **形态**：原生 HTML + CSS + JavaScript（ES5/ES2020 语法，普通 `<script>`，不使用 ES module），全局命名空间 `window.W`；无构建链、无 npm 依赖安装、无后端。
- **分层**：`index.html` 应用外壳与脚本加载顺序 → `W.UI` 通用层 → `W.Store` 数据层 → `W.Seed*` 种子层 → `W.Location` / `W.Route` / `W.MapView` 能力层 → `W.Views.*` 视图层 → `W.Router` 路由层。
- **路由**：8 条 hash 路由（见上表）；`W.Router.go()` 不依赖 hashchange，直接按目标路径渲染，兼容阻止 hash 赋值的 WebView。
- **地图**：`W.MapView.create()` 统一接口，内部按 高德 → Leaflet → SVG 降级；`W.MapView.reverseGeocode()` 用于发布页定位回填。
- **设计系统**：`css/style.css` 定义全局 token 与基础组件；`css/gz-redesign.css` 通过 `.gz-page` 局部覆盖实现 GUZANG Edition，不改变全局 token。详见 [docs/design-system.md](docs/design-system.md)。
- 更完整的模块职责、调用关系与数据流见 [docs/architecture.md](docs/architecture.md)。

## 8. 测试与验收

当前基线（2026-11-24 文档整理时复跑）：

- 21 个业务 JavaScript 文件全部通过语法检查（等价 `node --check`，0 失败；不含本地 `js/map-config.js` 与配置示例）。
- 浏览器实际打开 8 条路由，页面均正常渲染；首页读取到 296 个地点、36 个城市选项（含「全部城市」共 37 项）。
- 历史 QA 记录：[全量测试与修复报告（2026-11-23）](docs/archive/qa/full-test-report-2026-11-23.md)（覆盖 206 地点版本）；阶段 9/11 的专项报告见归档目录。

自测入口：`python -m http.server 8080` 后打开 `http://127.0.0.1:8080/`。完整走查清单见 [docs/testing.md](docs/testing.md)。

## 9. 已知限制

| 项目 | 说明 |
|---|---|
| 后端 / 多端同步 / 鉴权 | 无后端设计，仅浏览器本地存储；本地上传图片同样存入 localStorage，受浏览器配额限制 |
| 地图 | 默认高德 JS API 2.0；Key 与 securityJsCode 放在本地 `js/map-config.js`（已被 `.gitignore` 忽略），安全域名需配置为访问域名（本地为 `127.0.0.1`）。未配置或失败时回退 Leaflet + OSM / SVG |
| 坐标精度 | 种子坐标按 WGS-84 近似记录；高德分支渲染前转 GCJ-02，Leaflet/OSM 使用 WGS-84，不同底图间可能有米级差异 |
| 浏览量 | 每次进入详情 +1，重复刷新会累加，无去重窗口 |
| 收藏 / 点赞 | 单用户本地态，换浏览器或清 localStorage 会回到种子状态 |
| 桌面端 | ≥720px 为居中 430px 手机画布，不是独立响应式布局 |
| 评论图片 | `review-photos/` 来自百度图片搜索结果，仅用于非商业原型演示，正式上线前需替换或取得授权 |
| 自动化测试 | 仓库未内置自动化测试脚本，当前验证以语法检查、浏览器走查和历史 QA 报告为准 |

## 10. 文档索引

| 文档 | 说明 |
|---|---|
| [docs/README.md](docs/README.md) | 文档总索引：当前文档、归档文档与阅读顺序 |
| [docs/architecture.md](docs/architecture.md) | 当前技术架构、模块职责、路由、数据流与本地存储迁移 |
| [docs/design-system.md](docs/design-system.md) | 视觉规范：城市漫游手册 token + GUZANG Edition 覆盖 |
| [docs/testing.md](docs/testing.md) | 测试与验收指南（快速冒烟 + 全量走查清单） |
| [docs/changelog.md](docs/changelog.md) | 阶段变更记录（0–34） |
| [docs/archive/](docs/archive/README.md) | 历史团队文档与过期测试报告（保留查阅，不作为当前依据） |

## 11. 图片与素材

- [assets/photos/CREDITS.md](assets/photos/CREDITS.md)：主图库 105 个文件的来源与授权（当前种子使用 86 个）。
- [city-photos/CREDITS.md](city-photos/CREDITS.md)：扩展城市 182 张实景图的来源与授权。
- [review-photos/CREDITS.md](review-photos/CREDITS.md)：70 张评论配图的检索来源说明。

除地图瓦片和地图 API 外，页面不依赖任何外部图片资源。页面截图留档见 [docs/screens](docs/screens/README.md)（部分为历史版本，仅作视觉参考）。
