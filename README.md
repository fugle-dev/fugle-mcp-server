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

### 台新證券：完成事前準備
使用台新證券前，請先完成 [事前準備](https://ml-fugle-api.tssco.com.tw/FugleSDK/docs/trading/prepare/) 頁面的全部步驟：
1. 線上開戶
2. 以憑證 e 管家申請並匯出憑證
3. 簽署「API 使用風險暨聲明書」（簽署後隔一天生效）
4. 用 SDK 執行一次 API 認證（`register_api_auth`）

⚠️ 第 4 步要在啟動 MCP Server 前完成。尚未認證時 MCP Server 無法啟動，也就用不到 `register_api_auth` 工具。

## 申請憑證

### 台新證券請使用 [憑證 e 管家](https://www.tssco.com.tw/CAinfo) 來申請憑證

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

## 啟動失敗排查

MCP 用戶端只顯示 `Connection closed` 時，錯誤訊息會寫在 MCP Server 的 log。以 macOS 上的 Claude Code 為例，log 位於 `~/Library/Caches/claude-cli-nodejs/<專案路徑>/mcp-logs-<server 名稱>/`。

台新證券常見錯誤：

| 錯誤碼 | 原因 | 處理方式 |
|---|---|---|
| `OA0025` | 查不到「API 使用風險暨聲明書」的簽署紀錄 | 完成線上簽署，隔一天後再啟動 |
| `A00007` | 尚未完成 API 認證 | 用 SDK 執行一次 `register_api_auth`（見 [事前準備](https://ml-fugle-api.tssco.com.tw/FugleSDK/docs/trading/prepare/)），再重新啟動 MCP Server |

其他錯誤碼請見 [錯誤處理](https://ml-fugle-api.tssco.com.tw/FugleSDK/docs/trading/library/error/)。
