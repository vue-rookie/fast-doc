# 鉴权 (Authorization)

所有 API 请求都需要在 HTTP Header 中包含 `Authorization` 字段。

### 获取 API Key

1. 登录 [开发者控制台](https://console.example.com)。
2. 进入 "设置" -> "API Keys"。
3. 点击 "创建新密钥"。

### 使用方式

将您的 API Key 放入 HTTP Header 中：

```http
Authorization: Bearer sk-8921...1234
Content-Type: application/json
```

> ⚠️ **安全警告**：请勿将 API Key 泄露在客户端代码（如浏览器前端 JS）中，否则可能导致额度被盗用。