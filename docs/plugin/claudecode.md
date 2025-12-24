# Claude Code 配置教程

Claude Code 是一个强大的 AI 编程助手，让您可以直接在终端中与 AI 协作编程。本教程将指导您完成安装和配置过程。

## 系统要求

- Node.js 版本 ≥ 18.0
- 支持的操作系统：macOS、Linux、Windows (WSL)

## 安装步骤

### 1. 安装 Node.js

> 💡 **提示**：如果您已经安装了 Node.js 18.0 或更高版本，可以跳过此步骤。

#### Ubuntu / Debian 用户

安装 Node.js LTS 版本：

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash -
sudo apt-get install -y nodejs
```

验证安装：

```bash
node --version
```

#### macOS 用户

安装 Xcode 命令行工具：

```bash
sudo xcode-select --install
```

安装 Homebrew（如果尚未安装）：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

通过 Homebrew 安装 Node.js：

```bash
brew install node
```

验证安装：

```bash
node --version
```

### 2. 安装 Claude Code

使用 npm 全局安装 Claude Code：

```bash
npm install -g @anthropic-ai/claude-code
```

验证安装：

```bash
claude --version
```

## 配置说明

### 获取必要的配置信息

您需要准备两个重要的配置项：

| 配置项 | 说明 | 获取方式 |
|--------|------|----------|
| **ANTHROPIC_AUTH_TOKEN** | API 认证令牌 | 注册后在 `API令牌` 页面点击 `添加令牌` 获得（以 `sk-` 开头） |
| **ANTHROPIC_BASE_URL** | API 服务地址 | 使用 `https://api.timebackward.com`（与主站地址相同） |

> 📝 **创建令牌时的建议设置**：
> - 名称：随意命名
> - 额度：设为无限额度
> - 分组：选择 Claude code 专属或者官转克劳德 3 及以上
> - 其他选项：保持默认设置

## 使用方法

### Linux / macOS 用户

进入项目目录：

```bash
cd your-project-folder
```

设置环境变量（请替换 `sk-...` 为您的实际令牌）：

```bash
export ANTHROPIC_AUTH_TOKEN=sk-...
export ANTHROPIC_BASE_URL=https://api.timebackward.com
export API_TIMEOUT_MS=300000
```

启动 Claude Code：

```bash
claude
```

### Windows PowerShell 用户

进入项目目录：

```powershell
cd your-project-folder
```

设置环境变量（请替换 `sk-...` 为您的实际令牌）：

```powershell
$env:ANTHROPIC_BASE_URL = "https://api.timebackward.com"
$env:ANTHROPIC_AUTH_TOKEN = "sk-..."
$env:API_TIMEOUT_MS = "300000"
```

启动 Claude Code：

```powershell
claude
```

### Windows CMD 用户

进入项目目录：

```cmd
cd your-project-folder
```

设置环境变量（请替换 `sk-...` 为您的实际令牌）：

```cmd
set ANTHROPIC_BASE_URL=https://api.timebackward.com
set ANTHROPIC_AUTH_TOKEN=sk-...
set API_TIMEOUT_MS=300000
```

启动 Claude Code：

```cmd
claude
```

## 更简单的配置方式

推荐使用 [cc-switch](https://github.com/farion1231/cc-switch) 工具，只需填写以下三个配置项：

- **服务商名称**：随便填写
- **API Key**：您的以 `sk-` 开头的 fast-code 密钥
- **请求地址**：`https://api.timebackward.com`

配置完成后点击**启用**即可。

## Claude Code 常用技巧

### 基本命令

- 直接输入问题或需求，Claude 会帮你编写代码
- 使用 `/help` 查看所有可用命令
- 使用 `/exit` 退出 Claude Code

### 最佳实践

1. **清晰描述需求**：详细说明您想要实现的功能
2. **提供上下文**：告诉 Claude 当前项目的技术栈和结构
3. **分步骤进行**：对于复杂任务，可以分解成多个小步骤

## 相关链接

- [Claude Code 官方文档](https://docs.anthropic.com)
- [Node.js 官方网站](https://nodejs.org)
- [cc-switch 工具](https://github.com/farion1231/cc-switch)

---

💡 **提示**：如遇到其他问题，请查看官方文档或联系技术支持。
