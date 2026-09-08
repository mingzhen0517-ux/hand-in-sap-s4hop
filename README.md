# hand-in-sap-s4hop

## SAP S/4HANA WebGUI

### 登录结论

SAP WebGUI 已确认可以正常登录。正确入口为 HTTPS 端口 `44300`：

```text
https://47.97.212.35:44300/sap/bc/gui/sap/its/webgui?sap-client=100&sap-language=EN
```

使用 HTTP 端口 `50099` 打开登录页时，系统会拒绝提交密码，并显示：

- `ICF_SYSTEM_LOGIN002`：Logon through HTTP is not possible; logon ticket is active for HTTPS only
- `ICF_SYSTEM_LOGIN006`：No switch to HTTPS occurred, so it is not secure to send a password

这说明 WebGUI 服务本身可以访问，但 SAP 已配置为仅允许通过 HTTPS 登录，并非账号或密码错误。

### 已验证信息

- SAP System：`S4H`
- Client：`100`
- 用户：`IBMHMZ`
- WebGUI：登录成功

浏览器可能仍将页面标记为“不安全”，通常是因为 HTTPS 证书为自签名证书，或证书中的主机名与访问使用的 IP 地址不一致。

账号密码及其他连接地址保存在本地文件 `SAP_CONNECTION.local.md` 中。该文件已加入 `.gitignore`，请勿提交到版本库。
