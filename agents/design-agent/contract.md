# SAP Clean Core Design Agent Output Contract

主代理调用 `design-agent` 时的返回必须满足本协议。

## 1. 格式要求
- 必须返回标准 JSON，根节点字段必须与 `schema.json` 一致。
- 严禁前置或后置对话废话（如 "很高兴为您设计方案..."、"以上是我的输出..."）。

## 2. 字段语义
- `status`:
  - `COMPLETED`: 设计方案完整且通过元数据探查。
  - `BLOCKED`: 探查目标表不存在或重试 3 次仍未得到足够元数据，需要人工介入。
- `clean_core_tier`: 明确标注为 `Tier1_ABAP_Cloud`、`Tier2_Custom_Adapter`、`Tier3_BTP_SideBySide` 或 `Hybrid`。
- `artifacts_created`: 必须仅包含 `docs/design/` 下的 Markdown 或规约路径。
- `data_model.entities`: 列出所有规划的 CDS 实体名称及其基础数据源。

## 3. 示例回复 Payload
```json
{
  "agent_id": "design-agent",
  "status": "COMPLETED",
  "clean_core_tier": "Tier1_ABAP_Cloud",
  "tier_justification": "需求完全可以通过标准已释放 CDS 视图 I_JournalEntry 与自定义 CDS View Entity 实现，无任何未释放调用。",
  "data_model": {
    "entities": [
      {
        "name": "Z_I_FinancialDocSummary",
        "type": "CDS_VIEW_ENTITY",
        "base_sources": ["I_JournalEntry"],
        "description": "凭证汇总聚合视图实体"
      }
    ]
  },
  "interfaces": [
    {
      "name": "Z_UI_FINANCIALDOC_O4",
      "kind": "ODATA_V4",
      "contract_summary": "提供用于 Fiori Elements 分析型应用的只读数据服务"
    }
  ],
  "artifacts_created": [
    "docs/design/FIN_DOC_SUMMARY_DESIGN.md"
  ],
  "retry_count": 0,
  "notes": "建议直接使用 define view entity 替代废弃的 define view."
}
```
