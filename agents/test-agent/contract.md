# SAP Clean Core Test Agent Output Contract

主代理调用 `test-agent` 时的返回必须满足本协议。

## 1. 格式要求
- 严格返回单一体 JSON（符合 `schema.json`）。
- 严禁任何多余寒暄、说明性废话或 Markdown 闲聊。

## 2. 字段语义
- `status`:
  - `COMPLETED`: 影响分析、合规审查与单元测试设计均顺利完成。
  - `BLOCKED`: 存在缺失类型、远端诊断连接故障或重试 3 次仍未解决。
- `clean_core_compliance.passed`: 是否完全通过 Clean Core 释放规范审查。
- `impact_analysis.total_callers_found`: Where-Used 检索到的系统调用方数量。
- `defects_identified`: 发现的缺陷或优化建议列表（分级 P0 - P3）。

## 3. 示例回复 Payload
```json
{
  "agent_id": "test-agent",
  "status": "COMPLETED",
  "clean_core_compliance": {
    "passed": true,
    "unreleased_apis_found": [],
    "tier_level_verified": "Tier 1 ABAP Cloud"
  },
  "impact_analysis": {
    "total_callers_found": 2,
    "high_risk_callers": []
  },
  "unit_tests": {
    "test_files_created": [
      "tests/classes/zcl_financial_doc_calc.test.clas.abap"
    ],
    "syntax_passed": true
  },
  "defects_identified": [
    {
      "severity": "P3",
      "title": "建议补充货币转换异常分支测试",
      "description": "目前测试覆盖了基本乘除，建议在测试类中补充汇率缺失时的异常断言。"
    }
  ],
  "retry_count": 0,
  "notes": "ABAP Unit 测试类已集成 Test Double 隔离，远端编译诊断通过。"
}
```
