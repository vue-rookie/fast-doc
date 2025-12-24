# 创建对话 (Chat Completions)

调用大模型进行对话交互。

<div class="api-endpoint">
  <span class="badge post">POST</span>
  <span class="url">https://api.timebackward.com/v1/chat/completions</span>
</div>

### 请求参数 (Body)

| 参数名 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| **model** | string | 是 | 模型 ID，例如 `gpt-4` 或 `claude-3-opus` |
| **messages** | array | 是 | 对话历史列表 |
| **temperature** | number | 否 | 随机性 (0-2), 默认 1.0 |
| **stream** | boolean | 否 | 是否开启流式传输 |

### 请求示例

```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Hello!"
    }
  ],
  "stream": true
}
```

### 响应结构

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello there! How can I help you today?"
    },
    "finish_reason": "stop"
  }]
}
```