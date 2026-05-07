# Fugle MCP Server ( 目前僅支援證券功能 )
<!-- ![Docker Pulls](https://img.shields.io/docker/pulls/kevinypfan/fugle-mcp-server)
![Docker Image Size](https://img.shields.io/docker/image-size/kevinypfan/fugle-mcp-server)
![NPM Version](https://img.shields.io/npm/v/fugle-mcp-server)
![NPM Downloads](https://img.shields.io/npm/dm/fugle-mcp-server) -->
<!-- ![License](https://img.shields.io/npm/l/fugle-mcp-server) -->
富果 MCP (Model Context Protocol) 伺服器，用於與富果交易系統進行互動。此伺服器支援股票行情查詢和交易功能。
## 功能特點
- 支援股票即時行情查詢
- 支援歷史數據查詢
- 支援交易功能（可選）
- 支援 Docker 和 NPM 兩種部署方式
- 完全兼容 MCP 協議


## 前置作業

### 安裝 NPM
到 Node.js 官方 [下載](https://nodejs.org/en/download) 對應的作業系統平台

## 申請憑證

### 台新證券請使用 [線上憑證申請](https://ml-fugle-api.tssco.com.tw/FugleSDK/docs/key/) 或下載 [憑證 e 管家](https://www.masterlink.com.tw/certificate-eoperation) 來申請憑證
⚠️ 使用線上申請憑證之用戶，憑證密碼預設為您的身分證字號

### 富邦證券請下載 [TCEM 憑證管理工具](https://www.fbs.com.tw/Certificate/Management/) 來申請憑證
⚠️ 此工具僅支援 windows 平台，若您使用 Mac or Linux 請先至 Windows 申請完後，再將檔案移轉到 Mac or Lixux 系統上

## 安裝

### 使用 NPM
```bash
npx @fugle/mcp-server
```
### 使用 Docker
```bash
docker pull fugle/mcp-server
```
## 使用方法
### 環境變數
伺服器需要以下環境變數：
- `SDK_TYPE`: MCP Server 使用 SDK 類型（可選：「台新(taishin)」或「富邦(fubon)」，預設為「台新(taishin)」）
- `NATIONAL_ID`: 身分證字號
- `ACCOUNT_PASS`: 帳戶密碼
- `CERT_PASS`: 憑證密碼
- `CERT_PATH`: 憑證檔案路徑
- `ENABLE_ORDER`: 是否開啟下單功能（可選，預設為 false）
- `ACCOUNT`: 如有多帳戶，可以使用此參數指定登入帳戶（可選，預設為第一個帳戶）
- `FUBON_URL`: 富邦 SDK 連線 URL（可選，僅適用於 fubon，用於連線測試伺服器）

ℹ️ 台新帳號範例 ： 592a12345678 ( 包含分公司代碼 )  
ℹ️ 富邦帳號範例 ： 1234456 ( 不需包含分公司代碼 )

### Docker 配置

在您的 `.mcp-config.json` 中添加：
```json
{
  "mcpServers": {
    "@fugle/mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "--platform=linux/amd64",
        "-i",
        "--rm",
        "-e",
        "SDK_TYPE",
        "-e",
        "NATIONAL_ID",
        "-e",
        "ACCOUNT_PASS",
        "-e",
        "CERT_PASS",
        "-e",
        "ENABLE_ORDER",
        "-e",
        "ACCOUNT",
        "-e",
        "FUBON_URL",
        "--mount", "type=bind,src=</path/to/cert.p12>,dst=/app/cert.p12",
        "fugle/mcp-server"
      ],
      "env": {
        "SDK_TYPE": "taishin|fubon",
        "NATIONAL_ID": "您的身分證字號",
        "ACCOUNT_PASS": "您的帳戶密碼",
        "CERT_PASS": "您的憑證密碼",
        "ENABLE_ORDER": "false",
        "ACCOUNT": "指定使用帳戶號碼"
      }
    }
  }
}
```
### NPM 配置
在您的 `.mcp-config.json` 中添加：
```json
{
  "mcpServers": {
    "@fugle/mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@fugle/mcp-server"
      ],
      "env": {
        "SDK_TYPE": "taishin|fubon",
        "NATIONAL_ID": "您的身分證字號",
        "ACCOUNT_PASS": "您的帳戶密碼",
        "CERT_PASS": "您的憑證密碼",
        "CERT_PATH": "/path/to/your/cert.p12",
        "ENABLE_ORDER": "false",
        "ACCOUNT": "指定使用帳戶號碼"
      }
    }
  }
}
```
