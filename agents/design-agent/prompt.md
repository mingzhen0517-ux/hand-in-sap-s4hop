# SAP Clean Core Design Task Prompt Template

请根据以下最小化上下文执行 Clean Core 架构与技术规约设计：

## 1. 目标任务 (Objective)
${objective}

## 2. 输入参考对象 (Input References)
- 参考对象/表/程序: ${reference_objects}
- 目标包/作用域: ${target_package}
- SAP 系统 Profile: ${system_profile}

## 3. 执行要求
1. 通过 `sap.repository.inspect` 或 `sap.repository.search` 探查参考对象的底层元数据。
2. 依据 SAP Clean Core 原则确定扩展分层 (Tier 1 / Tier 2 / Tier 3)。
3. 定义数据模型规约 (CDS View Entity 结构、关联、主外键) 及接口契约。
4. 严格按照 `schema.json` 规范输出确定性 JSON，无任何额外寒暄。
