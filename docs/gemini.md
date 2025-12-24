# Gemini 视觉能力

使用 Google Gemini 模型分析图像或生成内容。

<div class="api-endpoint">
  <span class="badge post">POST</span>
  <span class="url">/v1beta/models/gemini-pro-vision:generateContent</span>
</div>

### 功能描述

Gemini Pro Vision 是一个多模态模型，能够理解图像、视频和文本。

#### 限制
- 图片最大 4MB
- 支持 PNG, JPEG, WEBP, HEIC, HEIF

### 代码示例 (Python)

```python
import google.generativeai as genai
import PIL.Image

img = PIL.Image.open('cookie.png')
model = genai.GenerativeModel('gemini-pro-vision')

response = model.generate_content(["Tell me about this cookie", img])
print(response.text)
```