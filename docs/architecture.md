# 技术架构

> 项目：出来去哪玩（WQWN）· 适用版本：2026-11-24（296 地点 / 36 城）
>
> 本文以现有代码为准整理；历史方案文档见 [archive/](archive/README.md)。

## 1. 总体形态

- **纯前端静态站点**：原生 HTML + CSS + JavaScript（ES5/ES2020 语法），不使用 ES module、不使用构建工具、不安装 npm 依赖、没有后端。
- **全局命名空间**：所有模块挂在 `window.W` 下，通过普通 `<script>` 按固定顺序加载。
- **唯一数据源**：`W.Store` 管理 `localStorage` 中的 `wqwn.v3`，视图不直接读写 localStorage。
- **运行方式**：`python -m http.server 8080` / `npx serve .` / 直接双击 `index.html`。
- **外部依赖**：高德 JS API 2.0（首页地图，动态加载，Key 从本地 `js/map-config.js` 读取；该文件被 `.gitignore` 忽略，示例见 `js/map-config.example.js`）；Leaflet 1.9.4（CDN，地图第二级降级）。字体使用本机字体栈，不引外部字体。

## 2. 目录与模块职责

| 文件 | 命名空间 | 职责 |
|---|---|---|
| `index.html` | — | 应用外壳：`#app-header` / `#view-root` / `#tabbar` / `#toast-layer`；固定脚本加载顺序与缓存版本串 |
| `css/style.css` | — | 全局设计系统：`:root` token、外壳、通用组件、所有基础页面样式 |
| `css/gz-redesign.css` | — | GUZANG Edition：仅作用于 `.gz-page` / `.gz-draw` 等作用域，不影响全局 token |
| `js/ui.js` | `W.UI` | DOM 构建器 `el()`、转义 `esc()`、toast/confirm、金额/时间/距离格式化、分类与搭子类型表、导航 URI、图标、图库 `pics`、灯箱 |
| `js/review-photos.js` | `W.ReviewPhotos` | 13 类评论配图池；`forSpot(spot, limit, offset)` 按分类与地点 id 稳定轮换，自动排除该地点封面/图集 |
| `js/store.js` | `W.Store` | 唯一数据源：状态归一化、种子合并、localStorage 持久化、全部领域操作（41 个公开成员）、订阅通知 |
| `js/seed.js` | `W.Seed` | 主种子：5 用户、杭州/成都/上海/广州等基础地点与评论、4 个搭子、13 条打卡 |
| `js/seed-play-a.js` | `W.SeedPlayA` | 杭州/成都/上海娱乐设施种子 |
| `js/seed-play-b.js` | `W.SeedPlayB` | 广州/深圳娱乐设施种子 |
| `js/seed-play-c.js` | `W.SeedPlayC` | 佛山/北京/长沙娱乐设施种子 |
| `js/seed-cities.js` | `W.SeedCities` | 13 座扩展城市种子（重庆、西安、南京、武汉、厦门、青岛、苏州、天津、昆明、大理、丽江、桂林、三亚） |
| `js/seed-provinces.js` | `W.SeedProvinces` | 15 座省会/首府城市种子（90 个地点、270 条评论） |
| `js/location.js` | `W.Location` | 36 城中心点 `CITY_CENTERS`、城市顺序 `CITY_ORDER`、最近城市匹配、距离排序、内存定位会话 |
| `js/route.js` | `W.Route` | 5 种路线配方、主题选点、最近邻排序、时间轴计算、高德整条路线 URI（纯计算，不写存储） |
| `js/map-config.example.js` | — | 地图密钥配置示例；复制为 `js/map-config.js` 后填写本地 Key，真实文件不提交 |
| `js/map.js` | `W.MapView` | 地图适配层：高德 JS API 2.0 → Leaflet → SVG 三级降级；`create()` 句柄支持 `setMarkers / setUserLocation / clearUserLocation / focus / resize / destroy / isFallback / getProvider`；`reverseGeocode()`、`wgs84ToGcj02()` |
| `js/views/home.js` | `W.Views.home` | 首页视图 |
| `js/views/whereto.js` | `W.Views.whereto` | 今天去哪视图；额外提供 `destroy()` 用于抽签层清理 |
| `js/views/routes.js` | `W.Views.routes` | 路线串点视图 |
| `js/views/publish.js` | `W.Views.publish` | 发布视图 |
| `js/views/detail.js` | `W.Views.detail` | 地点详情视图 |
| `js/views/buddies.js` | `W.Views.buddies` | 搭子广场视图 |
| `js/views/buddyDetail.js` | `W.Views.buddyDetail` | 搭子详情视图 |
| `js/views/profile.js` | `W.Views.profile` | 个人中心视图 |
| `js/app.js` | `W.Router` / `W.App` | hash 路由、视图挂载与异常兜底、tab 高亮、启动、顶栏城市同步 |

## 3. 脚本加载顺序

`index.html` 中的顺序不能随意调整（后者依赖前者的全局对象）：

```
leaflet.js (CDN)
→ ui.js
→ review-photos.js
→ store.js
→ seed-play-a.js
→ seed-play-b.js
→ seed-play-c.js
→ seed-cities.js
→ seed-provinces.js
→ seed.js
→ location.js
→ route.js
→ map-config.js（本地可选，未提交）
→ map.js
→ views/home.js
→ views/routes.js
→ views/whereto.js
→ views/publish.js
→ views/detail.js
→ views/buddies.js
→ views/buddyDetail.js
→ views/profile.js
→ app.js
```

要点：

- `ui.js` 必须最先加载，`seed.js` 会读取 `W.UI.pics` 作为图片库。
- `seed.js` 依赖 `W.SeedPlayA/B/C`、`W.SeedCities`、`W.SeedProvinces` 已挂载后合并。
- 所有视图必须在 `app.js` 之前加载；`app.js` 在 DOM ready 后调用 `W.Store.init()` 和 `W.Router.start()`。
- `index.html` 各脚本的 `?v=` 是缓存版本串，按文件独立维护，不表示统一发布版本号。

## 4. 路由

`js/app.js` 的 `ROUTES` 表定义 8 条路由：

| 模式 | key | tab 高亮 | 参数 |
|---|---|---|---|
| `/home` | `home` | home | — |
| `/routes`、`/routes?start=<spotId>` | `routes` | home | `startSpotId` |
| `/whereto` | `whereto` | whereto | — |
| `/publish` | `publish` | publish | — |
| `/spot/:id` | `detail` | home | `id` |
| `/buddies` | `buddies` | buddies | — |
| `/buddy/:id` | `buddyDetail` | buddies | `id` |
| `/profile` | `profile` | profile | — |

- 空 hash / `#/` 回退 `/home`；未知路由重定向 `/home`。
- `W.Router.go(hash)` 先尝试修改 `location.hash`，同时直接按目标路径渲染，保证在阻止 hash 赋值的 WebView 中也能切换。
- 视图切换时若旧视图实现了 `destroy()` 则调用（目前 `whereto` 用于清理抽签层）。
- 渲染异常会被 `renderError()` 捕获为「页面加载失败 + 返回首页」占位，不白屏。

## 5. 数据流

```
视图 render(root, params)
  → 读取：W.Store.listSpots() / getSpot() / listBuddies() / listMyRoutes() 等
  → 交互：W.Store.addComment() / toggleLike() / saveRoute() / checkinSpot() ...
      → 修改内存 state → localStorage.setItem('wqwn.v3', JSON.stringify(state)) → notify()
  → 视图重新渲染或局部更新
```

- `W.Store.subscribe(fn)` 提供订阅；当前应用以视图局部刷新为主。
- `W.Store` 的 41 个公开成员分为：初始化与用户、地点读写、点赞/浏览/收藏、评论、实况、避雷、护照打卡、路线、搭子与申请、个人列表、订阅与重置。
- 所有写操作都有数据层校验（例如评论 1–200 字、搭子人数 2–20、路线至少 2 个有效地点、删除评论/实况/路线校验作者）。

## 6. 本地存储与旧数据兼容

- key：`wqwn.v3`；状态结构：`{ version, currentUserId, users[], spots[], buddies[], checkins[], routes[] }`。
- `W.Store.init()` 对已存在数据依次执行：
  1. `normalize()` 补齐顶层数组字段；
  2. 若 `users` 为空则回退到种子用户并修正 `currentUserId`（避免详情页读取 `me.id` 崩溃）；
  3. `syncSeedExpansion()` 按种子地点 id 增量补齐缺失地点，并同步封面/图集变更，不覆盖用户新增地点与评论；
  4. `ensureCommentPhotos()` 把旧版重复的评论配图迁移到独立评论图库；
  5. `ensureViews()`、`ensureFavorites()`、`ensureSpotExtras()`（live/warns 等）、`ensureCheckins()`、`ensureRoutes()` 补齐字段。
- 首次初始化与「重置演示数据」都会 `W.Seed.build()` 并清理评论配图、初始化 routes。
- localStorage 不可用时 `persist()` 会 toast 提示「本地存储不可用，数据仅在本次会话有效」，不阻断页面。

## 7. 地图管线

1. `W.MapView.create(container, { center, zoom, city, fitView, onSelect, onClusterSelect, userLocation })`。
2. 优先动态加载高德 JS API 2.0：脚本 `https://webapi.amap.com/maps?v=2.0&key=...&plugin=AMap.Scale`，5 秒超时。
3. 高德不可用则使用全局 `L`（Leaflet 1.9.4）＋ OSM 瓦片。
4. 两者都不可用则 `drawSvg()` 用真实经纬度投影绘制纸张色示意图；标记按 id 做确定性微偏移 + 局部碰撞松弛，避免整齐网格化。
5. 高德分支会把 WGS-84 坐标转换为 GCJ-02；Leaflet/OSM 与 SVG 使用原始 WGS-84。
6. `setMarkers()` 只接收含 `lat/lng` 的地点；聚合标记点击会回调 `onClusterSelect` 打开地点列表。

## 8. 图片管线

- 地点封面/图集：`assets/photos/`（86 个在用文件）与 `city-photos/`（182 张，文件名对应地点 id `s201`–`s382`）。
- 评论配图：`review-photos/` 13 个分类共 70 张；`W.ReviewPhotos.forSpot()` 根据地点 id 哈希稳定选择，排除与该地点封面/图集重复的图片。
- 内置发布图库：`W.UI.pics` 6 张。
- 本地上传：`FileReader` 读取后经 Canvas 压缩为 JPEG（质量 0.82，最长边 1280px），以 data URL 存入 `state.images` 与 localStorage；最多 9 张。
- 灯箱：`W.UI.openLightbox(src, alt)` 支持缩放 1×–4×、拖动、复位、Esc/遮罩/× 关闭；所有图片均可用。

## 9. 安全与健壮性

- 所有用户文本经 `W.UI.esc()` 转义后再进入 HTML；图标使用内联 SVG 节点，不把用户文本当 HTML 解析。
- `W.MapView` 的绘制异常被局部捕获，地图失败不影响首页列表渲染。
- 路由渲染异常由 `W.Router.render()` 兜底显示错误页。
- 数据层错误码（如 `INVALID_BUDDY`、`INVALID_ROUTE`、`INVALID_USER`）由视图转为中文提示。

## 10. 扩展点

- **新增城市**：在 `js/location.js` 的 `CITY_CENTERS` 与 `CITY_ORDER` 加城市；在 `js/views/home.js` 的 `CITY_EN`、`js/views/detail.js` 的 `CITY_CENTERS`、`js/map.js` 的 `CITY_LABELS` 补英文名/中心/地图标签；种子放入 `seed-*.js` 并由 `seed.js` 合并；`syncSeedExpansion()` 自动兼容旧数据。
- **新增分类**：在 `js/ui.js` 的 `CATEGORIES` 增加 key/name/group；首页筛选与发布页选项直接使用该表，详情页分类名经 `W.UI.categoryName()` 显示。去哪页有独立的心情/设施表（`js/views/whereto.js` 的 `MOODS` / `PLAY_TYPES`），新增娱乐分类时需同步这两张表。
- **新增页面**：在 `js/views/` 新建 `W.Views.<key>`，并在 `js/app.js` 的 `ROUTES` 注册路由；`index.html` 按顺序引入脚本。
- **地图供应商替换**：只改 `js/map.js` 内部实现，保持 `W.MapView.create()` 返回的句柄接口不变。
