# hand-in-sap-s4hop

SAP S/4HANA (ABAP ADT) 项目本地 MCP (Model Context Protocol) 集成环境。通过标准化 MCP 协议为 AI 编码助手（如 Codex、Claude 等）提供对 SAP 系统的只读检查、代码检索、源码分析、语法诊断与受控开发能力。

---

## 目录

- [环境与连接验证结论](#环境与连接验证结论)
- [可实现的核心功能](#可实现的核心功能)
- [AI 驱动的 Vibe Coding：极速开发与部署验证一体化](#ai-驱动的-vibe-coding极速开发与部署验证一体化)
  - [什么是 SAP ABAP 的 Vibe Coding？](#什么是-sap-abap-的-vibe-coding)
  - [一体化闭环工作流 (Read -> Edit -> Diagnose -> Deploy -> Verify)](#一体化闭环工作流-read---edit---diagnose---deploy---verify)
  - [典型 Vibe Coding 对话实战体验](#典型-vibe-coding-对话实战体验)
- [典型实用案例与工作流](#典型实用案例与工作流)
  - [案例 1：自定义报表/程序排查与源码审阅](#案例-1自定义报表程序排查与源码审阅)
  - [案例 2：对象影响分析 (Where-Used 被引用追踪)](#案例-2对象影响分析-where-used-被引用追踪)
  - [案例 3：ABAP 实时语法诊断与快速修复](#案例-3abap-实时语法诊断与快速修复)
  - [案例 4：动态发现并读取数据字典 (DDIC)](#案例-4动态发现并读取数据字典-ddic)
  - [案例 5：开发辅助与代码补全 (Auto-Complete)](#案例-5开发辅助与代码补全-auto-complete)
  - [案例 6：AI 辅助快速构建业务报表 (ALV / CDS View)](#案例-6ai-辅助快速构建业务报表-alv--cds-view)
  - [案例 7：合规审查与审计追踪数据查询](#案例-7合规审查与审计追踪数据查询)
  - [案例 8：跨表动态数据抽取与轻量集成分析](#案例-8跨表动态数据抽取与轻量集成分析)
  - [案例 9：高频周期性作业编排与自动化巡检](#案例-9高频周期性作业编排与自动化巡检)
- [MCP 架构与工具面](#mcp-架构与工具面)
  - [自适应工具面 (Adaptive Preset)](#自适应工具面-adaptive-preset)
  - [动态能力发现 (On-Demand Capabilities)](#动态能力发现-on-demand-capabilities)
- [快速开始](#快速开始)
  - [1. 依赖安装](#1-依赖安装)
  - [2. 连接诊断与健康检查](#2-连接诊断与健康检查)
  - [3. 协议与功能冒烟测试](#3-协议与功能冒烟测试)
  - [4. 代码完整性检查](#4-代码完整性检查)
  - [5. 启动 MCP 服务](#5-启动-mcp-服务)
- [客户端集成配置 (Codex)](#客户端集成配置-codex)
- [安全与访问控制](#安全与访问控制)
- [故障排查 (FAQ)](#故障排查-faq)

---

## 环境与连接验证结论

### 1. SAP S/4HANA 系统信息
- **SAP Release**：`758` (SAP S/4HANA on SAP NetWeaver 7.58)
- **System ID**：`S4H` (Client `100`, Logical System `S4HCLNT100`)
- **环境**：`development`
- **默认语言**：`EN`
- **时区**：`UTC+8`

### 2. SAP WebGUI 登录验证
- **正确登录入口 (HTTPS)**：
  ```text
  https://<sap-host>:44300/sap/bc/gui/sap/its/webgui?sap-client=100&sap-language=EN
  ```
- **登录状态**：已实测验证成功登录。
- **关于 HTTP 50099 端口**：
  若通过 HTTP 端口 `50099` 尝试登录，SAP 系统会拦截并报错：
  - `ICF_SYSTEM_LOGIN002`: Logon through HTTP is not possible; logon ticket is active for HTTPS only
  - `ICF_SYSTEM_LOGIN006`: No switch to HTTPS occurred, so it is not secure to send a password
  
  这表明 ICF 服务仅允许通过 HTTPS 进行身份认证与传输。

### 3. HTTPS 证书说明
目前服务器使用自签名证书或未绑定指定公网 IP 域名，浏览器访问会提示“证书不受信任”。本项目启动脚本在子进程中配置了证书安全规避（仅限当前进程有效），不影响系统其它全局环境。

---

## 可实现的核心功能

通过在 AI 对话中调用本项目的 MCP 工具，可直接免去手工登录 SAP GUI 或 Eclipse ADT 的繁琐步骤，完成以下 ABAP 全生命周期任务：

1. **系统画像与连通感知**：即时读取 SAP 内核版本、系统类型、客户端角色、时区及可用 ADT 集合。
2. **多维度对象检索**：支持对 `PROG`（程序）、`CLAS`（类）、`INTF`（接口）、`TABL`（透明表）、`VIEW`（视图）、`DDLS`（CDS 视图）、`DEVC`（包）等进行通配符精准/模糊搜索。
3. **源码直读与 AST 结构导航**：无损获取激活态源码（支持行范围分页），读取类方法实现与 Include 文件树。
4. **实时静态语法诊断**：调用 SAP 内核语法检查器（相当于 SE38/ADT 的 Check 语法），准确定位错误行、列及 Message 文本。
5. **影响分析与依赖追踪**：执行原生 Where-Used List 查询，找出某字段、结构、方法或函数在全系统所有的调用点。
6. **业务报表极速生成**：结合实时表结构元数据直接生成高质量的 CDS View 或 ALV IDA 报表代码并进行在线语法诊断校验。
7. **审计与合规追溯**：安全检查系统变更日志、传输请求、修改标记（User/Change Timestamp）及关键配置表状态。
8. **跨表动态数据抽取与关联**：解析多张关联表键值与数据字典外键关系，输出标准化数据模型或用于数据湖/离线看板。
9. **自动化运维与高频作业编排**：配合定时自动化工具（Codex Automations / 调度脚本）对接口状态、批量任务与系统健康度进行持续巡检。
10. **动态能力扩展**：按需检索并调用 SAP ADT 的 50+ 项高级功能（如 DDIC 元数据读取、快速修复、格式化、单元测试运行等）。

---

## AI 驱动的 Vibe Coding：极速开发与部署验证一体化

### 什么是 SAP ABAP 的 Vibe Coding？
传统 SAP ABAP 开发通常伴随割裂且繁重的仪式感：开发人员需要在 SAP GUI (SE38/SE80) 或 Eclipse ADT 与需求文档、浏览器之间频繁切换，手动查找底层表结构、拼接 OpenSQL、手动点击语法检查 (Ctrl+F2)、再手动激活 (Ctrl+F3) 与执行测试。

借助本项目搭建的本地 MCP 桥梁，开发者可以在 AI 编码助手（如 Codex）中实现真正的 **Vibe Coding**（心流化自然语言编程）：
- **全自然语言对话**：“帮我把 `Z07DRAUS` 中的输出格式改成 PDF 并校验语法”
- **零上下文切换**：AI 自主搜索表结构、读取现有源码、编写新逻辑、上传/热修代码，并直接在 SAP 远端编译器中执行语法诊断与结果验证。
- **分钟级从需求到可用**：原本需要反复调试与查表的任务，在单轮会话中直接完成“修改-部署-验证”全流程闭环。

---

### 一体化闭环工作流 (Read -> Edit -> Diagnose -> Deploy -> Verify)

```text
[ 用户自然语言提出需求 ]
         │
         ▼
[ 1. 意图解析与环境感知 ] ──> 调用 sap.system.inspect 确认环境
         │
         ▼
[ 2. 查表与上下文抓取 ]  ──> 调用 sap.ddic.read / sap.source.read 精准读取
         │
         ▼
[ 3. 实时生成/修补代码 ] ──> AI 生成目标逻辑（符合 ABAP 7.58 现代语法）
         │
         ▼
[ 4. 远端语法编译诊断 ]  ──> 调用 sap.source.diagnose 模拟 ADT 语法检查
         │
     ┌───┴────────────────┐
   有警告/错误          语法完全正确
     │                    │
     ▼                    ▼
[ 5. 自动修复纠偏 ]    [ 6. 部署写入与激活 ] ──> 调用受控写入工具（白名单 $TMP）
                          │
                          ▼
                       [ 7. 效果验收与汇报 ] ──> 交付给用户直接使用
```

---

### 典型 Vibe Coding 对话实战体验

#### 场景：给指定程序快速增加数据过滤逻辑并在线验证

**用户输入**：
> “把测试包里的报表 `ZA4WEEKINC` 读一下，在取数的地方加上公司代码 `BUKRS = '1000'` 的过滤条件，看看改完能不能通过 SAP 的语法检查。”

**AI 自主完成的后台操作链路**：
1. **自动读取源码**：
   调用 `sap.source.read(systemId: "S4H100", objectName: "ZA4WEEKINC", objectType: "PROG")`，瞬间理解已有数据流。
2. **分析修改点并生成补丁**：
   定位到 `SELECT` 语句，补充 `WHERE bukrs = '1000'` 条件，确保变量与字段匹配。
3. **远端语法诊断与验证**：
   调用 `sap.source.diagnose` 传入修改后的内容，如果系统提示缺少索引或类型不匹配，AI 会自主在毫秒内调整修补，直至编译器返回 `warnings: []`、状态 `succeeded`。
4. **交付最终方案**：
   AI 输出修改后的源码差异及 SAP 编译器验证通过的凭证，全程耗时不到 30 秒。

---

## 典型实用案例与工作流

### 案例 1：自定义报表/程序排查与源码审阅
**需求场景**：生产或测试环境中发现客制化报表逻辑异常，需要快速阅读特定程序的实现逻辑，无需打开 SAP GUI。

- **AI 工具调用流程**：
  1. 调用 `sap.repository.search` 搜索相关的客制化程序：
     ```json
     {
       "systemId": "S4H100",
       "pattern": "Z*",
       "objectTypes": ["PROG"],
       "limit": 5
     }
     ```
  2. 命中 `ZA4WEEKINC` 等程序后，调用 `sap.source.read` 读取关键逻辑段落：
     ```json
     {
       "systemId": "S4H100",
       "objectName": "ZA4WEEKINC",
       "objectType": "PROG",
       "startLine": 1,
       "lineCount": 50
     }
     ```
- **实际应用价值**：AI 助手可在对话中直接阅读源码并为开发人员分析业务逻辑、梳理数据流、指出逻辑漏洞。

---

### 案例 2：对象影响分析 (Where-Used 被引用追踪)
**需求场景**：拟对某个全局结构、函数或方法进行字段变更/签名重构，需要评估修改波及的上下游模块。

- **AI 工具调用流程**：
  调用 `sap.repository.where_used`：
  ```json
  {
    "systemId": "S4H100",
    "objectName": "ZMY_DATA_STRUCT",
    "objectType": "TABL",
    "limit": 20
  }
  ```
- **实际应用价值**：秒级返回依赖该对象的所有 Reports、Class Methods 和 Function Modules，AI 可以自动汇总出影响范围清单和回归测试建议。

---

### 案例 3：ABAP 实时语法诊断与快速修复
**需求场景**：编写或修改 ABAP 代码后，确保代码在 SAP 系统内能够通过编译，发现潜在类型不匹配或废弃语法。

- **AI 工具调用流程**：
  调用 `sap.source.diagnose`：
  ```json
  {
    "systemId": "S4H100",
    "fileUri": "adt://s4h100/sap/bc/adt/programs/programs/za4weekinc"
  }
  ```
- **实际应用价值**：直接获取 SAP 编译器返回的精确警告/错误行号与错误代码，AI 自动结合上下文给出修复补丁。

---

### 案例 4：动态发现并读取数据字典 (DDIC)
**需求场景**：需要了解某张标准表（如 `MARA`、`VBAK`）或自定义表的字段类型、主键、关联外键，用于编写接口或报表。

- **AI 工具调用流程**：
  1. 自适应工具面中没有直接暴露表结构工具，AI 自动调用 `sap.capability.search`：
     ```json
     { "query": "table" }
     ```
     返回匹配能力：`sap.ddic.read`。
  2. 获取工具参数架构：
     ```json
     { "name": "sap.ddic.read" }
     ```
  3. 执行只读调用获取表结构定义：
     ```json
     {
       "name": "sap.ddic.read",
       "schemaHash": "<hash>",
       "arguments": {
         "systemId": "S4H100",
         "objectName": "VBAK",
         "objectType": "TABL"
       }
     }
     ```
- **实际应用价值**：即时获取底表与字段元数据，指导 AI 写出字段名完全吻合、类型安全无误的 OpenSQL / ABAP SQL。

---

### 案例 5：开发辅助与代码补全 (Auto-Complete)
**需求场景**：编写调用 SAP 标准类或 BAPI 的代码时，需要了解类方法的具体形参名称与类型。

- **AI 工具调用流程**：
  调用 `sap.semantic.complete` 或 `sap.semantic.definition` 传入光标行号与文件 URI。
- **实际应用价值**：无缝补全入参（IMPORTING / EXPORTING / CHANGING 参数），显著减少因参数拼写错误导致的返工。

---

### 案例 6：AI 辅助快速构建业务报表 (ALV / CDS View)
**需求场景**：业务部门提出紧急统计报表需求（例如“销售订单交货履约状态分析”），传统开发需翻查表结构、编写报表并多轮语法调试，耗时较长。

- **AI 工具与 MCP 协同流**：
  1. **元数据提取**：AI 调用 `sap.capability.search` 激活 `sap.ddic.read`，批量获取销售主表 `VBAK`、行项目表 `VBAP` 与交货状态表 `VBUK` 的精确字段名与主外键关系。
  2. **模型生成**：AI 依据实时数据字典自动生成高质量 CDS 实体视图代码（带有 UI 聚合注解与关联定义）：
     ```abap
     @AbapCatalog.sqlViewName: 'Z_VBAK_REP'
     define view Z_I_SalesPerformance as select from vbak
       association [1..*] to vbap as _Item on vbak.vbeln = _Item.vbeln { ... }
     ```
  3. **实时静态验证**：调用 `sap.source.diagnose` 校验生成代码的语法合法性。
- **实际应用价值**：将传统数小时的翻表、找字段与对齐类型工作压缩至 1 分钟内，实现所想即所得的报表原型与生产代码开发。

---

### 案例 7：合规审查与审计追踪数据查询
**需求场景**：审计部门需抽查关键客制化业务逻辑变更记录、敏感配置更新轨迹或传输请求中的发布范围。

- **AI 工具与 MCP 协同流**：
  1. **对象变更审计**：调用 `sap.repository.inspect` 查验对象的创建者 (`createdBy`)、修改者 (`changedBy`)、最新修改时间戳与当前分配的开发包/传输请求号。
  2. **关键代码逻辑追溯**：调用 `sap.source.search` 在所有 Z* 源码库中批量检索敏感模式（例如未授权绕过、硬编码密码或特权账号检查）：
     ```json
     {
       "systemId": "S4H100",
       "searchTerm": "AUTHORITY-CHECK",
       "objectName": "Z*"
     }
     ```
  3. **合规报告生成**：AI 根据提取的日志与代码上下文，自动出具合规审计清单与权限校验覆盖率分析报告。
- **实际应用价值**：消除黑盒风险，实现客制化代码与系统配置的自动化审计查验。

---

### 案例 8：跨表动态数据抽取与轻量集成分析
**需求场景**：外部系统或数据看板需要从 SAP 抽取指定业务维度（如物料主数据 `MARA`、工厂数据 `MARC` 及库存余额 `MARD`）的宽表结构定义与取数方案。

- **AI 工具与 MCP 协同流**：
  1. 调用 `sap.ddic.read` 自动化解析多表之间的关联关系与外键完整性依赖。
  2. 针对受控只读环境（在已开启数据查询权限时），通过动态提取方案读取示例样本集并验证数据映射。
  3. 自动生成下游 ETL 脚本（如 Python Pandas / Spark / OData 消费者代码）与字段对齐字典。
- **实际应用价值**：快速构建 SAP 与外部系统集成时的数据契约，杜绝因对 SAP 底层字段缩写理解偏差导致的清洗错误。

---

### 案例 9：高频周期性作业编排与自动化巡检
**需求场景**：针对核心生产接口（如 IDoc 处理、批处理作业、ADT 连通性、关键 Include 文件完整性），需要定期自动探测并在发生异常时主动告警。

- **AI 工具与 MCP 协同流**：
  1. 结合 Codex / 定时任务调度器（如配置 Heartbeat 监控），定期执行只读检查：
     - 调用 `sap.system.inspect` 校验系统响应延迟与时区心跳。
     - 调用 `sap.source.diagnose` 针对关键程序包进行健康巡检，确保未被引入编译级语法错误。
  2. 当系统返回警告（Warnings）或服务响应异常时，触发告警通知或生成诊断摘要推送给运维人员。
- **实际应用价值**：将繁琐的日常手工巡检转换为全自动守候式守护，提升 SAP 系统运维效率与稳定性。

---

## MCP 架构与工具面

本项目基于 `@coaspe/sap-abap-mcp@1.6.0` 封装，采用 `--preset adaptive` 模式。

### 自适应工具面 (Adaptive Preset)
默认暴露 17 个高频核心工具，覆盖系统巡检、代码检索、结构解析与源码诊断：

| 分类 | MCP 工具名称 | 功能描述 |
| :--- | :--- | :--- |
| **系统巡检** | `sap.system.list` | 列出已配置的 SAP 系统 ID 及凭据状态 |
| | `sap.system.inspect` | 查询系统版本、客户端、时区与组件元数据 |
| | `sap.system.capabilities` | 读取系统已支持、已授权与可观测的功能集合 |
| **仓库与对象** | `sap.repository.search` | 按名称通配符与类型检索 ABAP 仓库对象 |
| | `sap.repository.resolve` | 将对象解析为规范的 ADT 资源 URI |
| | `sap.repository.inspect` | 查看对象元数据、ADT 树形结构与子节点 |
| | `sap.repository.where_used` | 查询 ABAP 对象的被引用关系 (Where-Used) |
| **源码与语法** | `sap.source.read` | 分页读取指定范围的 ABAP/CDS 激活源码 |
| | `sap.source.diagnose` | 执行实时语法检查与诊断 (Syntax Check) |
| | `sap.source.search` | 在 ABAP 源码中检索文本或正则表达式 |
| **语义与补全** | `sap.semantic.complete` | 获取 ABAP 代码补全建议与元素详情 |
| | `sap.semantic.definition` | 跳转并解析定义与实现位置 (Go to Definition) |
| **动态能力调度** | `sap.capability.search` | 检索未在默认列表中的全量 SAP 扩展能力库 |
| | `sap.capability.describe` | 获取扩展能力的完整输入模式与哈希校验码 |
| | `sap.capability.invoke_read` | 执行只读类扩展能力调用 |
| | `sap.capability.invoke_write` | 执行受控写操作能力调用 |
| | `sap.capability.invoke_destructive` | 执行破坏性操作能力调用（受权限拦截） |

### 动态能力发现 (On-Demand Capabilities)
对于非常用功能（如 DDIC 数据字典读取 `sap.ddic.read`、传输请求分析等），可通过 `sap.capability.search` -> `sap.capability.describe` -> `sap.capability.invoke_*` 按需发现并调用，避免单次会话向大模型注入过多工具定义导致上下文膨胀。

---

## 快速开始

### 1. 依赖安装
```bash
npm install
```

### 2. 连接诊断与健康检查
验证本地连接配置是否健全，测试 ADT HTTPS 发现端点 (`/sap/bc/adt/discovery`) 是否畅通：
```bash
npm run mcp:doctor
```
> 输出包含 `ok: true` 以及系统 Release (758)、Client (100) 即表示连接正常。

### 3. 协议与功能冒烟测试
执行端到端测试，包括 MCP 协议握手、工具面暴露校验、系统信息查询及对象搜索：
```bash
npm run mcp:smoke
```

### 4. 代码完整性检查
一键执行脚本语法检查与冒烟测试：
```bash
npm run check
```

### 5. 启动 MCP 服务
直接以 Stdio 模式启动 MCP Server（供外部调试或集成）：
```bash
npm run mcp:start
```

---

## 客户端集成配置 (Codex)

本项目已在 `.codex/config.toml` 中配置了项目级 MCP 实例，新开 Codex 任务会自动挂载 `sap_abap` 工具面：

```toml
[mcp_servers.sap_abap]
command = "/opt/homebrew/bin/node"
args = [
  "/Users/mz/Documents/ChatGPT/hand-in-sap-s4hop/scripts/sap-mcp-runner.mjs",
  "serve",
  "--profile",
  "S4H100",
  "--preset",
  "adaptive",
  "--audit-log",
  "stderr",
]
cwd = "/Users/mz/Documents/ChatGPT/hand-in-sap-s4hop"
startup_timeout_sec = 120
tool_timeout_sec = 180
```

配置模版文件存放在 `config/codex-mcp.toml.example`，可根据部署机器路径适配。

---

## 安全与访问控制

1. **凭据安全**
   - 真实密码仅保存在本地文件 `SAP_CONNECTION.local.md` 中，该文件已加入 `.gitignore`，严禁提交到版本库。
   - 提供了脱敏模版 `SAP_CONNECTION.example.md`。
   - 运行时配置自动生成到 `.sap-abap-mcp/` 目录下（同样被 Git 忽略）。
2. **写权限隔离**
   - 默认仅允许向本地测试包 `$TMP` 写入对象。
   - 如需扩展包权限，可在 `SAP_CONNECTION.local.md` 中修改 `Writable packages`（以逗号分隔）。
3. **数据查询安全**
   - 任意 SAP SQL 查询功能默认处于禁用状态 (`Allow data queries: false`)。
4. **依赖锁定**
   - 固定使用 `@coaspe/sap-abap-mcp@1.6.0` 与 `@modelcontextprotocol/sdk@1.30.0`，规避版本漂移导致协议契约断裂。

---

## 故障排查 (FAQ)

### Q1: 运行 `mcp:doctor` 出现 TLS/SSL 警告？
提示信息：
```text
Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure...
```
**说明**：当前 SAP 实例使用自签名证书，启动脚本特意设置了环境变量以允许与 ADT 服务建立安全 HTTPS 通道。这属于受控规避，只影响当前脚本子进程。若后续配置了 CA 信任证书，可在配置中将证书校验切换回严格模式。

### Q2: 为什么不能用 HTTP 50099 端口？
SAP 实例启用了安全传输策略，登录票据 (Logon Ticket) 限制仅允许在 HTTPS (`44300`) 下颁发，HTTP 端口会明确拒绝密码校验。

### Q3: 修改配置后 Codex 未生效？
Codex 任务在启动时加载一次 `.codex/config.toml`。如果修改了配置或脚本，请新建任务或重新打开会话以加载最新工具面。
