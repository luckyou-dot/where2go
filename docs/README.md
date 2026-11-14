# 文档索引

> 项目：出来去哪玩（WQWN）· 最后整理：2026-11-24
>
> 本目录区分「当前文档」与「归档文档」。当前文档随代码维护；归档文档只反映其成文时的历史状态，不再作为实现依据。

## 1. 当前文档

| 文档 | 内容 | 维护状态 |
|---|---|---|
| [../README.md](../README.md) | 项目主文档：定位、快速开始、当前规模、目录、路由、功能、数据、限制 | 当前 |
| [architecture.md](architecture.md) | 技术架构：模块职责、脚本加载顺序、路由与数据流、地图/图片管线、本地存储迁移 | 当前 |
| [design-system.md](design-system.md) | 视觉规范：城市漫游手册设计系统与 GUZANG Edition 局部覆盖 | 当前 |
| [testing.md](testing.md) | 测试与验收指南：环境、快速冒烟、全量走查清单、历史 QA 索引 | 当前 |
| [changelog.md](changelog.md) | 阶段变更记录：0–34 阶段索引与关键交付 | 当前（记录历史） |

辅助资料：

- `docs/screens/`：页面截图留档（`_overview.jpg` 为多视图拼图，其余为单页截图；部分截图早于当前版本，仅作视觉参考）。
- `.codeartsdoer/plans/wanna-play/`：主计划目录，含 `design.md`（需求与架构）、`task.md`（任务拆分）、`PROGRESS.md`（阶段台账 0–22 与 34）。其内容属于执行过程记录，若与代码冲突以代码和当前文档为准。

## 2. 归档文档

历史团队文档与过期测试报告统一放在 [archive/](archive/README.md)，包括：

- 第五标签「今天去哪」的产品方案、架构方案、QA 计划与执行报告（2026-11-13）
- R13 避雷/实况 + R10 护照打卡的产品验收规格与 QA 报告（2026-11-13）
- 阶段 11 娱乐设施 / 灯箱 / 图片 / 地图 QA 报告（2026-11-14）
- 前端风格基线 v1（2026-11-14，已被 design-system.md 取代）
- 全量测试与修复报告（2026-11-23，覆盖 206 地点版本）

归档原则：不改写原文；如需引用历史结论，请同时注明其对应版本与日期。

## 3. 建议阅读顺序

1. 新同学/新对话接手：`README.md` → `docs/architecture.md` → `docs/design-system.md`
2. 要改代码：`docs/architecture.md` 的「模块职责」与「扩展点」→ 对应 `js/` 文件 → `docs/testing.md`
3. 要查历史决策：`docs/changelog.md` → `docs/archive/` → `.codeartsdoer/plans/wanna-play/PROGRESS.md`
