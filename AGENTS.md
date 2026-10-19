# AGENTS.md — SAP S/4HANA Clean Core 声明式协同工作规范

本文档为在当前仓库中工作的 AI 主代理 (Main Agent) 及各专职 Sub-Agent 提供全局指导原则、协作契约与运行约束。

---

## 1. 核心战略：SAP Clean Core & Best Practice

在本项目中的所有开发、设计与测试工作，均必须严格遵守 **SAP Clean Core** 核心原则：
- **核心零修改 (Zero Modification)**：不得对 SAP 标准对象实施侵入式改动，杜绝全局隐式增强 (Implicit Enhancement)。
- **现代化分层扩展 (Clean Extensibility)**：
  - **Tier 1 (Core C1 / ABAP Cloud)**：针对低延迟、与内核紧耦合的高频运算，必须使用 Released APIs 与 CDS View Entities。
  - **Tier 2 (Custom Adapter Layer)**：针对必须调用未释放经典 API 的场景，必须通过单独的 Adapter/Wrapper 类严密封装隔离，并登记技术债务。
  - **Tier 3 (Side-by-Side on BTP)**：外部交互、重前端与大规模异步集成下沉至 BTP。
- **现代 ABAP 编程模式**：全面采用 OO ABAP、CDS 实体建模与 RAP 架构，严禁过时的过程式宏、FORM/ENDFORM 与全局字典混乱引用。

---

## 2. 团队 Sub-Agent 规范结构与声明式配置

每个 Sub-Agent 均按照 **声明式配置 (`config.json`) + 指令文档 (`system.md` / `AGENT.md`) + 任务模板 (`prompt.md`) + 契约规范 (`schema.json` / `contract.md`)** 构建：

| Sub-Agent | 目录 | 角色职责 | 写权限边界 (Disjoint Write Set) | 核心 MCP 工具 |
| :--- | :--- | :--- | :--- | :--- |
| **设计 Agent (design-agent)** | `agents/design-agent/` | Clean Core 架构规划、Tier 1/2/3 扩展分层、CDS 实体分层与服务契约制定。 | 严格限制为 `docs/design/**`（严禁修改代码与配置） | `sap.repository.search`<br>`sap.repository.inspect`<br>`sap.source.read`<br>`sap.system.inspect` |
| **开发 Agent (dev-agent)** | `agents/dev-agent/` | 现代 ABAP Cloud 编码、CDS 实体编写、联动 SAP 远端编译器实时语法诊断排错。 | 严格限制为 `src/**`（严禁修改设计或测试文件） | `sap.source.diagnose`<br>`sap.source.read`<br>`sap.semantic.complete`<br>`sap.semantic.definition` |
| **测试 Agent (test-agent)** | `agents/test-agent/` | 全系统 Where-Used 影响分析、Clean Core API 合规审查、自动化 ABAP Unit 编写。 | 严格限制为 `tests/**` 与 `docs/qa/**` | `sap.repository.where_used`<br>`sap.source.diagnose`<br>`sap.source.search`<br>`sap.system.inspect` |

---

## 3. 运行五大纪律与硬性约束 (Hard Rules)

### ① 严格边界与防踏空 (Scope & Boundaries)
- **写作用域互斥隔离 (Disjoint Write Sets)**：
  - `design-agent` 只写 `docs/design/**`
  - `dev-agent` 只写 `src/**`
  - `test-agent` 只写 `tests/**` 与 `docs/qa/**`
- **绝对禁止越权破坏**：严禁执行 `git reset --hard`、`git push`、`git commit` 或 `rm -rf` 等未授权命令。

### ② 上下文继承与精简 (Context Minimization)
- 主代理派发任务时，**严禁将整个对话历史全量传递给 Sub-Agent**。
- 仅传递最小必要切片：目标任务 (`objective`)、指定读写路径 (`assigned_paths`)、依赖规约 (`signature_specs`)。

### ③ 确定性输出契约 (Deterministic Output Contract)
- 子代理的最终回复必须是**纯 JSON**（满足各自目录下的 `schema.json`），或者被 ````json ... ```` 包裹的单一体。
- **严禁任何闲聊、开场白、废话与客套话**，确保主代理可机器解析。

### ④ 停止条件与超时重试控制 (Exit Conditions)
- **自动修复上限**：`dev-agent` 在遇到语法编译报错时，最多自动尝试循环修复 **3 次**。
- **及时熔断报告 Blocked**：若重试 3 次仍失败或缺少外部依赖，子代理必须立即放弃循环，返回 `status: "BLOCKED"` 并详细列出 `blocked_reason`，主代理接管排查。

### ⑤ 并行与写冲突隔离 (Disjoint Parallelism)
- 主代理若同时并发调度多个 Sub-Agent，必须保证各 Sub-Agent 分配的文件路径完全不重叠。
- 最终的跨文件聚合、集成验证由主代理集中收敛处理。

---

## 4. 辅助验证工具
运行项目本地内置脚本，随时校验各 Sub-Agent 配置与写作用域互斥性：
```bash
npm run agents:validate
```
