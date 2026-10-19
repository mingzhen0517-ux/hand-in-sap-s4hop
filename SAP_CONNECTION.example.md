# SAP S/4HANA 连接信息模板

复制本文件为 `SAP_CONNECTION.local.md`，填写真实连接信息。目标 SAP 系统必须启用 ADT 服务。

## WebGUI 与 ADT 连接

- URL：`https://sap.example.com:44300/sap/bc/gui/sap/its/webgui?sap-client=100&sap-language=EN`
- System：`S4H`
- Client：`100`
- User：`ABAP_DEVELOPER`
- Password：`replace-me`
- Language：`EN`
- Environment：`development`
- Writable packages：`$TMP`
- Allow data queries：`false`
- TLS certificate verification：`true`
- 状态：`not-verified`

`Writable packages` 支持英文逗号分隔的包白名单。只有开发或质量系统才应配置写入；
生产系统应把 `Environment` 改为 `production`。证书校验只应在隔离的测试实例中关闭。
