#!/usr/bin/env node

import fs from "fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TaishinMcp } from "./taishin";

import { version } from "../package.json";
import { FubonMcp } from "./fubon";
import { FugleApiProvider } from "./shared/fundamental/providers";
import { registerAllFundamentalTools } from "./shared/fundamental";
import { config } from "./config";
import { SdkProvider } from "./shared/factory";

// 檢查環境變量
const { NATIONAL_ID, NOTIONAL_ID, ACCOUNT_PASS, CERT_PASS } = process.env;

// 處理身分證號，優先使用 NATIONAL_ID
const nationalId = NATIONAL_ID || NOTIONAL_ID;

// 如果用戶使用的是 NOTIONAL_ID，顯示棄用警告
if (!NATIONAL_ID && NOTIONAL_ID) {
  console.warn(
    "\x1b[33m%s\x1b[0m",
    `Warning: NOTIONAL_ID is deprecated and will be removed in version 0.1.0.`
  );
  console.warn("\x1b[33m%s\x1b[0m", `Please use NATIONAL_ID instead.`);
}

if (!nationalId || !ACCOUNT_PASS || !CERT_PASS) {
  console.error("Required environment variables are missing.");
  console.error(
    "Please provide either NATIONAL_ID or NOTIONAL_ID (deprecated), ACCOUNT_PASS, and CERT_PASS"
  );
  process.exit(1); // Exit with error code
}

const defaultCertPath = "/app/cert.p12";
const certPath = process.env.CERT_PATH || defaultCertPath;

if (!fs.existsSync(certPath)) {
  console.error(`Error: Certificate file not found at ${certPath}`);
  process.exit(1); // Exit with error code
}

class FugleMcpServer {
  private server: McpServer;
  private fugleProvider: FugleApiProvider;
  private sdkProvider: SdkProvider;

  constructor() {
    this.server = new McpServer({
      name: "fugle-mcp-server",
      version: version,
    });

    this.fugleProvider = FugleApiProvider.getInstance();
    this.sdkProvider = SdkProvider.getInstance();
    
    // 根據設定選擇要使用的 SDK
    const sdkType = this.sdkProvider.getSdkType();
    
    if (sdkType === 'taishin') {
      new TaishinMcp(this.server, certPath);
    } else if (sdkType === 'fubon') {
      new FubonMcp(this.server, certPath);
    } else {
      process.exit(1);
    }
    registerAllFundamentalTools(this.server, this.fugleProvider);
  }

  async runServer() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

function main() {
  const fugleMcpServer = new FugleMcpServer();
  fugleMcpServer.runServer().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
  });
}

main();
