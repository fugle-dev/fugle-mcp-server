import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { z } from "zod";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊查詢成交相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerFilledQueryTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'get-filled', '查詢今日成交彙總');
  
  // 查詢今日成交彙總工具
  server.tool(
    "get_filled",
    description,
    {
      symbol: z
        .string()
        .describe("股票代號，例如：2330（可選，不填則查詢所有股票）")
        .optional(),
    },
    createToolHandler(
      currentDir,
      'get-filled',
      async ({ symbol }) => {
        // 呼叫 SDK 獲取成交紀錄
        return await sdk.stock.getFilled(account, symbol);
      },
      {
        errorMessage: "查詢成交紀錄時發生錯誤"
      }
    )
  );
}
