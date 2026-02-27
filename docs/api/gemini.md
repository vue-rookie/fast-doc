# Gemini API (中转站) 调用指南

本文档演示了如何使用原生 `fetch` API（Node.js 18+ 或现代浏览器原生支持）通过你的中转站 (`https://api.timebackward.com`) 调用 Gemini 系列模型。无需安装任何第三方依赖库。

中转站同时支持 **OpenAI 兼容格式** 和 **Google Gemini 官方原生格式**，你可以根据你的代码库或客户端需求自由选择。

## 方式一：OpenAI 兼容格式调用 (推荐)

大部分应用和客户端默认使用 OpenAI 的数据结构，使用兼容格式可以无缝接入各类通用工具。接口路径固定为 `/v1/chat/completions`。

### 1. 基础调用代码 (非流式)

将下面的代码保存为 `index.js`，运行前请将 `<token>` 替换为你实际的中转站 API 密钥。

```javascript
var myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Bearer <token>"); // 替换为你的 API Key
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
   "messages": [
      {
         "role": "system",
         "content": "你是一只小猪.你会在回复开始的时候 加一个'哼哼'"
      },
      {
         "role": "user",
         "content": "你是谁?"
      }
   ],
   "model": "gemini-2.5-pro",
   "temperature": 0.1,
   "top_p": 1,
   "stream": false
});

var requestOptions = {
   method: 'POST',
   headers: myHeaders,
   body: raw,
   redirect: 'follow'
};

fetch("https://api.timebackward.com/v1/chat/completions", requestOptions)
   .then(response => response.json()) // 推荐解析为 JSON
   .then(result => {
       console.log("AI 响应结果：");
       // 打印具体的回复内容
       console.log(result.choices[0].message.content);
   })
   .catch(error => console.log('error', error));
```

### 2. 流式输出 (Stream) 示例

如果开启流式输出 (`"stream": true`)，接口会以 Server-Sent Events (SSE) 的格式持续返回数据流。以下是在 Node.js 环境下解析流式数据的原生方法：

```javascript
// 注意：此示例使用了顶层 await，推荐在 ES Module (.mjs) 或异步函数中运行
const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer <token>");
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
   "model": "gemini-2.5-pro",
   "messages": [{ "role": "user", "content": "请用一段话介绍一下你自己。" }],
   "stream": true
});

try {
   const response = await fetch("https://api.timebackward.com/v1/chat/completions", {
      method: 'POST',
      headers: myHeaders,
      body: raw
   });

   const decoder = new TextDecoder("utf-8");
   // 遍历读取数据流 (需 Node.js 18+)
   for await (const chunk of response.body) {
      const text = decoder.decode(chunk);
      const lines = text.split('\n');
      
      for (const line of lines) {
         if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
               // 截取 "data: " 之后的内容并解析 JSON
               const data = JSON.parse(line.slice(6));
               if (data.choices[0].delta.content) {
                  // 逐字打印到控制台
                  process.stdout.write(data.choices[0].delta.content);
               }
            } catch (e) {
               // 忽略不完整的 JSON 解析错误
            }
         }
      }
   }
   console.log(); // 结束换行
} catch (error) {
   console.log('error', error);
}
```

## 方式二：Google 官方原生格式调用

如果你使用的客户端或代码库强依赖 Google Gemini 的官方 SDK 或官方数据结构，可以使用此官方原生方式。

原生格式的请求路径通常**包含模型名称**，例如 `/v1beta/models/gemini-2.5-pro:generateContent`。API Key 通常通过 URL 参数 `?key=` 或请求头 `x-goog-api-key` 传递，且系统提示词和消息体的结构完全不同。

```javascript
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
// 原生格式可以通过 Header 传递 Key，也可以放在 URL 的 ?key= 参数中
myHeaders.append("x-goog-api-key", "<token>"); 

var raw = JSON.stringify({
  "systemInstruction": {
    "parts": [
      { "text": "你是一只小猪.你会在回复开始的时候 加一个'哼哼'" }
    ]
  },
  "contents": [
    {
      "role": "user",
      "parts": [
        { "text": "你是谁?" }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.1,
    "topP": 1
  }
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

const model = "gemini-2.5-pro";
// 注意：请求路径是 /v1beta/models/{模型名}:generateContent
const url = `https://api.timebackward.com/v1beta/models/${model}:generateContent`;

fetch(url, requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log("AI 响应结果：");
    // 原生格式的响应体结构
    console.log(result.candidates[0].content.parts[0].text); 
  })
  .catch(error => console.log('error', error));
```

## 常见问题处理

- **401 Unauthorized**: 你的 API 密钥无效或未正确配置，请检查 `<token>`。
- **404 Not Found**: 请检查请求路径是否正确。
- **fetch is not defined**: 你的 Node.js 版本可能低于 18，请升级 Node.js 或使用 `node-fetch` 等库。