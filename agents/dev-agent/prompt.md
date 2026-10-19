# SAP Clean Core Dev Task Prompt Template

请根据以下最小化输入执行现代 ABAP Cloud 编码并完成编译验证：

## 1. 目标任务 (Objective)
${objective}

## 2. 设计规范与契约引用 (Design References)
${design_reference}

## 3. 分配的文件写入路径 (Assigned Write Scope)
${assigned_file_paths}

## 4. 依赖签名与包 (Dependencies)
- Target Package: ${target_package}
- Dependencies: ${signature_specs}

## 5. 执行要求
1. 仅在分配的路径中编写代码，严禁跨出 `src/**`。
2. 遵守现代 ABAP OO 规范，禁止使用过时语法。
3. 调用 `sap.source.diagnose` 验证语法（最多尝试修复 3 次）。
4. 严格按照 `schema.json` 输出确定性结果。
