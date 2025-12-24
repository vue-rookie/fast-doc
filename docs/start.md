# 快速开始

本指南将帮助你在 **5 分钟内完成一次 AI 中转站调用**。

无需关心底层使用的是哪家模型，只需按照统一接口调用即可。

---

## 第一步：获取 API Key
在控制台创建一个 API Key，用于调用中转站接口。
访问 [fast-code](https://api.timebackward.com/console/token) 站点页面进行以下操作：

  - 点击 **控制台 → API令牌** 页面
  - 点击 **添加令牌**
  - 令牌分组请选择：**根据自己需要选择对应的分组**（务必选择此分组，否则无法使用）
  - 令牌名称随意
  - 额度建议：设置为 **无限额度**
  - 其他选项保持默认

![image.png](https://api.apifox.com/api/v1/projects/5443236/resources/575119/image-preview)
> 出于安全考虑，请不要将 API Key 暴露在前端代码仓库中。

---

## 第二步：确认 API 地址

中转站默认提供 OpenAI 兼容风格接口：

```txt
Base URL: https://api.timebackward.com/v1
```


## 第三步：使用 curl 调用
### Chat Completions 示例
```bash
curl https://api.timebackward.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "写一段 50 字的产品介绍" }
    ]
  }'

```
如果请求成功，你将获得与官方 OpenAI 接口结构一致的响应。


### JavaScript / Node.js 示例

```javascript   
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: "https://your-domain.com/v1"
});

const completion = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "写一段 50 字的产品介绍" }
  ]
});

console.log(completion.choices[0].message.content);

```
> 推荐通过环境变量注入apiKey，避免硬编码

## 模型切换（无需改代码）  
- 只需修改 model 参数即可切换底层模型：
```json
{
  "model": "claude-3-5-sonnet",
  "messages": [...]
}

```
fast-code中转站会在内部完成协议适配与调用转发。


## 流式输出（Streaming）  
- 中转站支持 OpenAI 风格的流式输
```bash
curl https://your-domain.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "stream": true,
    "messages": [
      { "role": "user", "content": "写一段 50 字的产品介绍" }
    ]
  }'


```