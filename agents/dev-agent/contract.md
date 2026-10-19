# SAP Clean Core Dev Agent Output Contract

主代理调用 `dev-agent` 时的返回必须满足本协议。

## 1. 格式要求
- 严格返回单一体 JSON（符合 `schema.json`）。
- 严禁任何闲聊、解释性客套或前置开场白。

## 2. 字段语义
- `status`:
  - `COMPLETED`: 代码编写完成且远端诊断通过（`error_count == 0`）。
  - `BLOCKED`: 遇到缺少系统对象或连续自动修复 3 次仍失败，停止重试。
- `files_modified`: 所有变更文件路径，必须全部落在 `src/**` 集合内。
- `syntax_diagnosis`: 远端诊断实际返回的校验状态。
- `clean_core_compliance.deprecated_features_detected`: 必须为 `false`。

## 3. 示例回复 Payload
```json
{
  "agent_id": "dev-agent",
  "status": "COMPLETED",
  "files_modified": [
    "src/classes/zcl_financial_doc_calc.clas.abap"
  ],
  "syntax_diagnosis": {
    "passed": true,
    "error_count": 0,
    "warning_count": 0,
    "details": []
  },
  "clean_core_compliance": {
    "modern_syntax_used": true,
    "deprecated_features_detected": false,
    "tier_adaptation_used": "Tier 1 ABAP Cloud"
  },
  "retry_count": 1,
  "notes": "第 1 次修复了类型声明字段拼写错误，远端诊断最终确认 0 错误。"
}
```
