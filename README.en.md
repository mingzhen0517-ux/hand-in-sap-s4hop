# hand-in-sap-s4hop

> **Languages / 语言 / 言語 / 언어**: [English](README.en.md) | [简体中文](README.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

Project-local MCP (Model Context Protocol) integration environment for SAP S/4HANA (ABAP ADT). Seamlessly connects AI coding assistants (such as Codex, Claude, etc.) to the underlying SAP system via the standardized MCP protocol, eliminating the high friction, heavy ritual, and context fragmentation of traditional SAP GUI (SE38/SE80) and Eclipse ADT.

Built around the core experience of **"Vibe Coding (Flow-state Coding)"**, this project deeply integrates **SAP Best Practice** and **Clean Core Modern Architecture Principles**. By establishing a direct ADT link via standardized MCP, it forms an ultra-fast closed loop: **"Intent Perception ➔ Automatic Table/Code Reading ➔ Dynamic Generation ➔ Real-time Remote Compiler Diagnostics ➔ Controlled Deployment & Verification"**.

To meet enterprise-grade requirements for compliance, high cohesion, and seamless upgradability in SAP development, this project natively embeds **Three Declarative SAP Clean Core Sub-Agents (Design, Dev, Test)**. Constructed with the industry-leading pattern of **"Declarative Config + Guideline Document + Supporting Scripts"**, it forms an end-to-end collaboration pipeline from architectural planning and cloud-ready coding to quality assurance:
- 🏛️ **Design Agent**: Investigates system metadata via read-only inspection, strictly follows Clean Core extensibility tiers (Tier 1 ABAP Cloud / Tier 2 Custom Adapter Layer / Tier 3 Side-by-Side on BTP), plans CDS View Entity Virtual Data Models (VDM) and service contracts, and produces standardized design documents—preventing invasive core modifications. Write scope is strictly restricted to `docs/design/**`.
- 💻 **Dev Agent**: Uses modern Object-Oriented ABAP and CDS Entity modeling, firmly discards deprecated procedural syntax, engages MCP tools for real-time kernel syntax diagnostics (`sap.source.diagnose`) and instant remediation, and enforces a 3-retry limit with circuit-breaking. Write scope is strictly restricted to `src/**`.
- 🧪 **Test Agent**: Performs system-wide Where-Used impact analysis, Clean Core API compliance reviews, and automatically crafts modern ABAP Unit test classes with Test Double decoupling to ensure zero defects and smooth upgrades. Write scope is strictly restricted to `tests/**` and `docs/qa/**`.

> **🔒 Strict Engineering Guardrails**: All three sub-agents are equipped with complete `config.json`, `system.md` (defining boundaries and forbidden zones), `prompt.md` (streamlined input slices), and `schema.json` & `contract.md` (zero-filler deterministic JSON contracts). Disjoint Write Sets are physically enforced via `npm run agents:validate`, completely preventing write conflicts and context contamination.

---

## Table of Contents

- [Environment & Connection Verification Conclusions](#environment--connection-verification-conclusions)
- [Core Capabilities](#core-capabilities)
- [SAP Clean Core & Best Practice Multi-Agent Architecture](#sap-clean-core--best-practice-multi-agent-architecture)
  - [Why Adhere to Clean Core in SAP?](#why-adhere-to-clean-core-in-sap)
  - [Three Sub-Agent Matrix & Division of Responsibilities](#three-sub-agent-matrix--division-of-responsibilities)
  - [End-to-End Collaborative Closed-Loop Pipeline](#end-to-end-collaborative-closed-loop-pipeline)
- [AI-Driven Vibe Coding: Rapid Development & Deployment-Verification Loop](#ai-driven-vibe-coding-rapid-development--deployment-verification-loop)
  - [What is Vibe Coding for SAP ABAP?](#what-is-vibe-coding-for-sap-abap)
  - [Integrated Closed-Loop Workflow (Read -> Edit -> Diagnose -> Deploy -> Verify)](#integrated-closed-loop-workflow-read---edit---diagnose---deploy---verify)
  - [Real-World Vibe Coding Dialogue Walkthrough](#real-world-vibe-coding-dialogue-walkthrough)
- [Practical Use Cases & Workflows](#practical-use-cases--workflows)
  - [Case 1: Custom Report / Program Inspection & Code Review](#case-1-custom-report--program-inspection--code-review)
  - [Case 2: Object Impact Analysis (Where-Used Reference Tracing)](#case-2-object-impact-analysis-where-used-reference-tracing)
  - [Case 3: Real-Time ABAP Syntax Diagnostics & Quick Fix](#case-3-real-time-abap-syntax-diagnostics--quick-fix)
  - [Case 4: On-Demand Data Dictionary (DDIC) Discovery & Inspection](#case-4-on-demand-data-dictionary-ddic-discovery--inspection)
  - [Case 5: Development Assistance & Code Auto-Completion](#case-5-development-assistance--code-auto-completion)
  - [Case 6: AI-Assisted Rapid Business Report Construction (ALV / CDS View)](#case-6-ai-assisted-rapid-business-report-construction-alv--cds-view)
  - [Case 7: Compliance Review & Audit Trail Data Query](#case-7-compliance-review--audit-trail-data-query)
  - [Case 8: Cross-Table Dynamic Data Extraction & Lightweight Integration Analysis](#case-8-cross-table-dynamic-data-extraction--lightweight-integration-analysis)
  - [Case 9: High-Frequency Scheduled Job Orchestration & Automated Health Checks](#case-9-high-frequency-scheduled-job-orchestration--automated-health-checks)
- [MCP Architecture & Tool Surface](#mcp-architecture--tool-surface)
  - [Adaptive Preset](#adaptive-preset)
  - [On-Demand Capabilities](#on-demand-capabilities)
- [Quick Start](#quick-start)
  - [1. Dependency Installation](#1-dependency-installation)
  - [2. Connection Diagnostics & Health Check](#2-connection-diagnostics--health-check)
  - [3. Protocol & Functional Smoke Testing](#3-protocol--functional-smoke-testing)
  - [4. Code Integrity Verification](#4-code-integrity-verification)
  - [5. Start MCP Service](#5-start-mcp-service)
- [Client Integration Configuration (Codex)](#client-integration-configuration-codex)
- [Security & Access Control](#security--access-control)
- [Troubleshooting & FAQ](#troubleshooting--faq)

---

## Environment & Connection Verification Conclusions

### 1. SAP S/4HANA System Details
- **SAP Release**: `758` (SAP S/4HANA on SAP NetWeaver 7.58)
- **System ID**: `S4H` (Client `100`, Logical System `S4HCLNT100`)
- **Environment**: `development`
- **Default Language**: `EN`
- **Timezone**: `UTC+8`

### 2. SAP WebGUI Login Verification
- **Verified Login URL (HTTPS)**:
  ```text
  https://<sap-host>:44300/sap/bc/gui/sap/its/webgui?sap-client=100&sap-language=EN
  ```
- **Login Status**: Successfully verified with live connection.
- **Regarding HTTP Port 50099**:
  If attempting logon via HTTP port `50099`, the SAP system intercepts with errors:
  - `ICF_SYSTEM_LOGIN002`: Logon through HTTP is not possible; logon ticket is active for HTTPS only
  - `ICF_SYSTEM_LOGIN006`: No switch to HTTPS occurred, so it is not secure to send a password
  
  This confirms ICF authentication and credential transmission are strictly restricted to HTTPS.

### 3. HTTPS Certificate Notice
The SAP server currently uses a self-signed certificate or does not match a public domain name, causing browsers to display an "untrusted certificate" warning. The project runner script safely bypasses certificate validation within its child process scope, without affecting the global machine environment.

---

## SAP Clean Core & Best Practice Multi-Agent Architecture

### Why Adhere to Clean Core in SAP?
In traditional SAP ECC or early S/4HANA custom development, teams frequently placed breakpoints in standard code, inserted implicit enhancements, and directly accessed raw database tables or unreleased internal function modules. This led to hundreds of syntax conflicts and business logic breaks during upgrades, accumulating severe "technical debt".

**SAP Clean Core Best Practices** require:
1. **Zero Modification Core**: Standard SAP code remains untouched.
2. **Modern Multi-Tier Extensibility**:
   - **Tier 1 (ABAP Cloud On-Stack)**: In-app extensions built strictly with Released APIs and Released CDS Views.
   - **Tier 2 (Custom Isolation Layer)**: Wrapping unavoidable unreleased system calls in dedicated custom adapter classes with registered refactoring backlogs.
   - **Tier 3 (Side-by-Side on SAP BTP)**: Offloading heavy integrations, UI extensions, and event-driven logic to cloud microservices.
3. **Modern Data & Business Modeling**: Full adoption of CDS View Entities, Virtual Data Models (VDM), and RAP (RESTful Application Programming Model).

---

### Three Sub-Agent Matrix & Division of Responsibilities

Defined in the `agents/` directory and `AGENTS.md`, three specialized Clean Core Sub-Agents collaborate seamlessly:

| Sub-Agent | Definition & Guideline | Core Focus & Responsibilities | Core MCP Tools |
| :--- | :--- | :--- | :--- |
| **Design Agent** | [`agents/design-agent/AGENT.md`](agents/design-agent/AGENT.md) | **Architecture Design & Governance**: Evaluates requirement feasibility, assigns Clean Core extensibility tier (Tier 1/2/3), plans CDS View Entity layers (Basic/Composite/Consumption) and service contracts, preventing invasive designs. | `sap.repository.search`<br>`sap.repository.inspect`<br>`sap.source.read`<br>`sap.system.inspect` |
| **Dev Agent** | [`agents/dev-agent/AGENT.md`](agents/dev-agent/AGENT.md) | **Modern ABAP Cloud Coding Expert**: Develops clean code adhering to modern ABAP Cloud guidelines (no FORM/TABLES legacy syntax), pushes complex queries down to CDS entities, implements business classes and RAP behaviors, and uses live compiler feedback for instant troubleshooting. | `sap.source.diagnose`<br>`sap.source.read`<br>`sap.semantic.complete`<br>`sap.semantic.definition` |
| **Test Agent** | [`agents/test-agent/AGENT.md`](agents/test-agent/AGENT.md) | **QA & Impact Analysis Specialist**: Executes system-wide Where-Used dependency and blast radius tracing, audits Clean Core API release compliance, and writes high-coverage modern ABAP Unit tests with Test Double isolation. | `sap.repository.where_used`<br>`sap.source.diagnose`<br>`sap.source.search`<br>`sap.system.inspect` |

---

### End-to-End Collaborative Closed-Loop Pipeline

The three agents coordinate to form a complete Clean Core development and verification cycle:

```text
                 ┌─────────────────────────────────────────────────────────────┐
                 │                 Business Requirement / Change Request       │
                 └──────────────────────────────┬──────────────────────────────┘
                                                │
                                                ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────┐
  │ 🏛️ Design Agent                                                                         │
  │ • Calls sap.repository.inspect / search to discover underlying tables & standard CDS    │
  │ • Defines extensibility tier (Tier 1 Cloud-ready / Tier 2 Isolation Adapter)            │
  │ • Produces "SAP Clean Core Technical Architecture" (CDS hierarchy & RAP contracts)     │
  └─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                                │
                                                ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────┐
  │ 💻 Dev Agent                                                                            │
  │ • Implements modern OO ABAP classes and CDS View Entities per design spec               │
  │ • Rejects SELECT *, strictly uses @ host variables, inline declarations, expressions    │
  │ • Triggers sap.source.diagnose for real-time compiler checks until 0 Warnings / 0 Errors│
  └─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                                │
                                                ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────┐
  │ 🧪 Test Agent                                                                           │
  │ • Invokes sap.repository.where_used to scan all impacted programs and objects           │
  │ • Writes modern ABAP Unit suites (isolating DB and interfaces with Test Doubles)        │
  │ • Audits Clean Core released APIs & code quality, produces "QA & Compliance Report"     │
  └─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                                │
                                                ▼
                 ┌─────────────────────────────────────────────────────────────┐
                 │            100% Clean Core Compliant Cloud-Ready Delivery   │
                 └─────────────────────────────────────────────────────────────┘
```

---

## Core Capabilities

By calling the project MCP tools directly inside AI conversational workflows, developers can bypass manual SAP GUI and Eclipse ADT interactions to accomplish the full ABAP lifecycle:

1. **System Profiling & Connectivity Sensing**: Instantly read SAP kernel release, system type, client role, timezone, and active ADT endpoints.
2. **Multi-Dimensional Object Search**: Precise or wildcard search across `PROG` (programs), `CLAS` (classes), `INTF` (interfaces), `TABL` (tables), `VIEW` (views), `DDLS` (CDS views), `DEVC` (packages), etc.
3. **Source Code Reading & AST Navigation**: Lossless retrieval of active source code (with line range pagination), class method implementations, and include hierarchies.
4. **Real-Time Static Syntax Diagnostics**: Invoke the SAP kernel syntax checker (equivalent to SE38/ADT Syntax Check) to pinpoint error lines, columns, and message text.
5. **Impact Analysis & Dependency Tracing**: Run native Where-Used List queries to track all callers of any field, structure, method, or function across the entire system.
6. **Rapid Business Report Scaffolding**: Combine live schema metadata with AI to generate high-quality CDS Views or ALV IDA reports validated with online syntax diagnostics.
7. **Audit & Compliance Tracing**: Securely inspect system change logs, transport requests, modification metadata (User/Change Timestamp), and critical configuration tables.
8. **Cross-Table Dynamic Data Extraction & Relationship Mapping**: Parse relationships and foreign key integrity across tables to generate normalized data models for downstream analytics.
9. **Automated Ops & Scheduled Job Orchestration**: Integrate with scheduling automations (such as Codex Automations) for continuous health checks on interfaces, batch jobs, and system stability.
10. **On-Demand Capability Expansion**: Discover and invoke 50+ advanced SAP ADT capabilities (e.g., DDIC metadata reading, quick fixes, code formatting, unit test execution).

---

## AI-Driven Vibe Coding: Rapid Development & Deployment-Verification Loop

### What is Vibe Coding for SAP ABAP?
Traditional SAP ABAP development comes with high ceremonial friction: developers constantly jump between SAP GUI (SE38/SE80) or Eclipse ADT, requirement documents, and browser tabs, manually searching tables, crafting OpenSQL, pressing Syntax Check (Ctrl+F2), activating (Ctrl+F3), and executing tests.

With the local MCP bridge provided by this project, developers can achieve true **Vibe Coding** (flow-state, natural language coding) inside AI coding assistants like Codex:
- **Pure Natural Language Dialogue**: "Update the output formatting in `Z07DRAUS` to PDF and check syntax."
- **Zero Context Switching**: The AI autonomously searches table structures, reads existing code, writes target logic, deploys patches, and runs remote compiler syntax diagnostics.
- **Minutes from Intent to Working Software**: Tasks that previously required hours of table lookups and trial-and-error are completed in a single session.

---

### Integrated Closed-Loop Workflow (Read -> Edit -> Diagnose -> Deploy -> Verify)

```text
[ User specifies requirement in natural language ]
         │
         ▼
[ 1. Intent Analysis & Environment Sensing ] ──> Invoke sap.system.inspect
         │
         ▼
[ 2. Table Lookup & Context Retrieval ]     ──> Invoke sap.ddic.read / sap.source.read
         │
         ▼
[ 3. Real-Time Code Generation / Patching ]  ──> AI generates ABAP 7.58 modern logic
         │
         ▼
[ 4. Remote Syntax Compilation Diagnostics ] ──> Invoke sap.source.diagnose
         │
     ┌───┴────────────────┐
   Warnings/Errors     Clean (0 Errors)
     │                    │
     ▼                    ▼
[ 5. Auto-Remediation ] [ 6. Controlled Deployment & Activation ] ──> Write tool ($TMP whitelist)
                          │
                          ▼
                       [ 7. Deliver Validated Solution ]         ──> Delivered to user
```

---

### Real-World Vibe Coding Dialogue Walkthrough

#### Scenario: Add data filtering logic to a report and verify syntax online

**User Prompt**:
> "Read report `ZA4WEEKINC` from the test package. In the data selection section, add a filter for company code `BUKRS = 1000`, and verify whether it passes SAP syntax diagnostics."

**AI Autonomous Execution Trace**:
1. **Read Source Code**:
   Calls `sap.source.read(systemId: "S4H100", objectName: "ZA4WEEKINC", objectType: "PROG")` to understand the data flow.
2. **Analyze & Generate Patch**:
   Locates the `SELECT` statement, appends `WHERE bukrs = 1000`, ensuring variables and field types match.
3. **Remote Syntax Diagnostics**:
   Calls `sap.source.diagnose` with the patched code. If warnings appear, the AI refines code within milliseconds until the compiler returns status `succeeded` with `warnings: []`.
4. **Deliver Verified Solution**:
   Outputs the unified diff along with verification proof from the SAP compiler—all within 30 seconds.

---

## Practical Use Cases & Workflows

### Case 1: Custom Report / Program Inspection & Code Review
**Scenario**: Production or QA encounters unexpected behavior in a custom report. Read and analyze the logic without opening SAP GUI.

- **AI Tool Flow**:
  1. Search custom programs via `sap.repository.search`:
     ```json
     {
       "systemId": "S4H100",
       "pattern": "Z*",
       "objectTypes": ["PROG"],
       "limit": 5
     }
     ```
  2. Read key logic sections with `sap.source.read`:
     ```json
     {
       "systemId": "S4H100",
       "objectName": "ZA4WEEKINC",
       "objectType": "PROG",
       "startLine": 1,
       "lineCount": 50
     }
     ```
- **Value**: AI reviews source code directly in conversation, outlines data flows, and highlights edge-case vulnerabilities.

---

### Case 2: Object Impact Analysis (Where-Used Reference Tracing)
**Scenario**: Planning field modifications or method signature refactoring on a global structure or function. Evaluate downstream blast radius.

- **AI Tool Flow**:
  Invoke `sap.repository.where_used`:
  ```json
  {
    "systemId": "S4H100",
    "objectName": "ZMY_DATA_STRUCT",
    "objectType": "TABL",
    "limit": 20
  }
  ```
- **Value**: Instantly returns all dependent Reports, Class Methods, and Function Modules. AI summarizes the impact footprint and recommends regression test scopes.

---

### Case 3: Real-Time ABAP Syntax Diagnostics & Quick Fix
**Scenario**: Ensure modified ABAP code compiles cleanly in the target SAP system, identifying deprecated syntax or type mismatches.

- **AI Tool Flow**:
  Invoke `sap.source.diagnose`:
  ```json
  {
    "systemId": "S4H100",
    "fileUri": "adt://s4h100/sap/bc/adt/programs/programs/za4weekinc"
  }
  ```
- **Value**: Directly receives compiler line numbers, columns, and message codes. AI generates accurate remedial patches based on context.

---

### Case 4: On-Demand Data Dictionary (DDIC) Discovery & Inspection
**Scenario**: Inspect field names, types, primary keys, and foreign keys of standard tables (`MARA`, `VBAK`) or custom tables.

- **AI Tool Flow**:
  1. Table discovery via `sap.capability.search`:
     ```json
     { "query": "table" }
     ```
     Matches `sap.ddic.read`.
  2. Describe parameter schema:
     ```json
     { "name": "sap.ddic.read" }
     ```
  3. Invoke read capability:
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
- **Value**: Real-time schema inspection enables AI to write 100% type-safe OpenSQL/ABAP SQL without column hallucinations.

---

### Case 5: Development Assistance & Code Auto-Completion
**Scenario**: Need exact parameter names and types when calling standard classes or BAPIs.

- **AI Tool Flow**:
  Call `sap.semantic.complete` or `sap.semantic.definition` with line/column numbers and file URI.
- **Value**: Accurately auto-completes `IMPORTING`, `EXPORTING`, and `CHANGING` signatures, avoiding typos and recompilations.

---

### Case 6: AI-Assisted Rapid Business Report Construction (ALV / CDS View)
**Scenario**: Fast delivery requested for a sales order fulfillment report without tedious manual GUI navigations.

- **AI Tool Flow**:
  1. **Metadata Fetch**: AI calls `sap.ddic.read` to retrieve schemas for `VBAK`, `VBAP`, and `VBUK`.
  2. **Model Generation**: AI creates a modern CDS View Entity with associations and UI annotations:
     ```abap
     @AbapCatalog.sqlViewName: Z_VBAK_REP
     define view Z_I_SalesPerformance as select from vbak
       association [1..*] to vbap as _Item on vbak.vbeln = _Item.vbeln { ... }
     ```
  3. **Live Validation**: Calls `sap.source.diagnose` to verify syntax immediately.
- **Value**: Reduces hours of field matching and syntax debugging to under a minute.

---

### Case 7: Compliance Review & Audit Trail Data Query
**Scenario**: Audit teams require inspection of custom code modification history and sensitive configuration changes.

- **AI Tool Flow**:
  1. **Metadata Audit**: Call `sap.repository.inspect` for `createdBy`, `changedBy`, timestamp, and transport request.
  2. **Code Search**: Call `sap.source.search` across `Z*` source code to audit authorization patterns:
     ```json
     {
       "systemId": "S4H100",
       "searchTerm": "AUTHORITY-CHECK",
       "objectName": "Z*"
     }
     ```
  3. **Audit Report**: AI drafts a security checklist and coverage report.
- **Value**: Eliminates black-box risks with automated governance.

---

### Case 8: Cross-Table Dynamic Data Extraction & Lightweight Integration Analysis
**Scenario**: Downstream ETL/data pipelines require clear table relationships and schema definitions (e.g. `MARA`, `MARC`, `MARD`).

- **AI Tool Flow**:
  1. Call `sap.ddic.read` to parse primary/foreign key relationships.
  2. Validate mappings against sample structures in controlled read mode.
  3. Generate downstream consumption scripts (Python Pandas, Spark, OData consumers).
- **Value**: Guarantees schema consistency between SAP and external data warehouses.

---

### Case 9: High-Frequency Scheduled Job Orchestration & Automated Health Checks
**Scenario**: Periodically probe critical interfaces, batch jobs, and ADT connectivity.

- **AI Tool Flow**:
  1. Automations periodically invoke `sap.system.inspect` for latency/heartbeat checks.
  2. Run `sap.source.diagnose` across critical package roots to verify no compilation regressions were introduced.
  3. Emit alerts upon detecting errors or warnings.
- **Value**: Automates routine manual monitoring into 24/7 background guardrails.

---

## MCP Architecture & Tool Surface

Based on `@coaspe/sap-abap-mcp@1.6.0`, configured in `--preset adaptive` mode.

### Adaptive Preset
Exposes 17 core high-frequency tools covering system inspection, repository search, AST inspection, and syntax diagnostics:

| Category | MCP Tool Name | Description |
| :--- | :--- | :--- |
| **System Inspection** | `sap.system.list` | List configured SAP system IDs and local credential availability |
| | `sap.system.inspect` | Inspect SAP client, release, timezone, and component metadata |
| | `sap.system.capabilities` | Read implemented, authorized, and observed capabilities |
| **Repository & Objects** | `sap.repository.search` | Search ABAP repository objects by name pattern and object type |
| | `sap.repository.resolve` | Resolve an ABAP object to a canonical ADT Resource URI |
| | `sap.repository.inspect` | Read object metadata, ADT structure, and child nodes |
| | `sap.repository.where_used` | Find where-used references for an ABAP object |
| **Source & Syntax** | `sap.source.read` | Read a bounded active ABAP/CDS source range |
| | `sap.source.diagnose` | Run live SAP syntax diagnostics (Syntax Check) |
| | `sap.source.search` | Search literal text or regular expressions in ABAP source |
| **Semantics & Completion** | `sap.semantic.complete` | Read ABAP completion proposals and element details |
| | `sap.semantic.definition` | Resolve definition and implementation locations |
| **Dynamic Capabilities** | `sap.capability.search` | Search the complete catalog of 50+ SAP capabilities |
| | `sap.capability.describe` | Inspect exact input schema and schema hash for a capability |
| | `sap.capability.invoke_read` | Execute read-only dynamic capability |
| | `sap.capability.invoke_write` | Execute controlled write capability |
| | `sap.capability.invoke_destructive` | Execute destructive capability (subject to permissions) |

### On-Demand Capabilities
Infrequent tools (e.g. DDIC schema reader `sap.ddic.read`, transport request analyzers) are dynamically loaded via `sap.capability.search` ➔ `sap.capability.describe` ➔ `sap.capability.invoke_*`, preventing prompt context bloat.

---

## Quick Start

### 1. Dependency Installation
```bash
npm install
```

### 2. Connection Diagnostics & Health Check
Verify local configuration and check if the ADT discovery endpoint (`/sap/bc/adt/discovery`) is reachable:
```bash
npm run mcp:doctor
```
> A successful check outputs `ok: true`, Release (`758`), and Client (`100`).

### 3. Protocol & Functional Smoke Testing
Run end-to-end tests covering MCP handshake, tool registration, system info inspection, and object search:
```bash
npm run mcp:smoke
```

### 4. Code Integrity Verification
Run script syntax checks and smoke tests in a single command:
```bash
npm run check
```

### 5. Start MCP Service
Launch the MCP server in Stdio mode (for external tools or debugging):
```bash
npm run mcp:start
```

---

## Client Integration Configuration (Codex)

Configured in `.codex/config.toml` to automatically mount the `sap_abap` toolset when opening a Codex task:

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

A template configuration is provided at `config/codex-mcp.toml.example`.

---

## Security & Access Control

1. **Credential Safety**
   - Real passwords reside exclusively in `SAP_CONNECTION.local.md`, which is git-ignored.
   - An example template is provided in `SAP_CONNECTION.example.md`.
   - Runtime configuration in `.sap-abap-mcp/` is also git-ignored.
2. **Write Scope Isolation**
   - By default, writes are only permitted into local test package `$TMP`.
   - Extend writable packages via `Writable packages` (comma-separated) in `SAP_CONNECTION.local.md`.
3. **Data Query Restrictions**
   - Arbitrary SAP SQL queries are disabled by default (`Allow data queries: false`).
4. **Dependency Locking**
   - Fixed versions `@coaspe/sap-abap-mcp@1.6.0` and `@modelcontextprotocol/sdk@1.30.0` prevent breaking changes.

---

## Troubleshooting & FAQ

### Q1: TLS/SSL Warning when running `mcp:doctor`?
Message:
```text
Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to 0 makes TLS connections and HTTPS requests insecure...
```
**Explanation**: The SAP instance uses a self-signed certificate. The runner script safely sets this variable within its child process to establish the HTTPS connection with ADT. If a trusted CA certificate is installed later, strict validation can be re-enabled.

### Q2: Why is HTTP Port 50099 rejected?
The SAP instance enforces secure logon policies: logon tickets are restricted to HTTPS (`44300`). The HTTP port explicitly rejects password authentication.

### Q3: Codex does not reflect updated configurations?
Codex loads `.codex/config.toml` upon task initialization. Start a new task or reopen the session to apply changes.
