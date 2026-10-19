# SAP Clean Core Test Task Prompt Template

请根据以下最小化上下文执行质量测试与合规审查：

## 1. 目标任务 (Objective)
${objective}

## 2. 待测对象与源码路径 (Target Objects & Paths)
- Target Objects: ${target_objects}
- Source File Paths: ${source_file_paths}
- Contract References: ${contract_reference}

## 3. 分配的文件写入路径 (Assigned Write Scope)
- 仅限 `tests/**` 与 `docs/qa/**`

## 4. 执行要求
1. 通过 `sap.repository.where_used` 评估下游调用影响。
2. 审查是否符合 Clean Core API 释放规范。
3. 编写隔离解耦的 ABAP Unit 测试用例并调用 `sap.source.diagnose` 校验（上限重试 3 次）。
4. 严格按照 `schema.json` 输出确定性结果。
