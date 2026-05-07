import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { z } from "zod";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊 API 認證相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerApiAuthTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'register-api-auth', 'API 認證註冊');
  
  // API 認證註冊工具
  server.tool(
    "register_api_auth",
    description,
    {},
    createToolHandler(
      currentDir,
      'register-api-auth',
      async () => {
        // 執行 API 認證註冊
        return await sdk.registerApiAuth(account);
      },
      {
        errorMessage: "API 認證註冊時發生錯誤"
      }
    )
  );
}