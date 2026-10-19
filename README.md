# hand-in-sap-s4hop

SAP S/4HANA (ABAP ADT) 项目本地 MCP (Model Context Protocol) 集成环境。通过标准化 MCP 协议为 AI 编码助手（如 Codex、Claude 等）提供对 SAP 系统的只读检查、代码检索、源码分析、语法诊断与开发能力。

---

## 目录

- [环境与连接验证结论](#环境与连接验证结论)
- [MCP 架构与能力](#mcp-架构与能力)
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
  https://47.97.212.35:44300/sap/bc/gui/sap/its/webgui?sap-client=100&sap-language=EN
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

## MCP 架构与能力

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
