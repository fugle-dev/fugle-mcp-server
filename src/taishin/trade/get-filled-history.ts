import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { z } from "zod";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊查詢歷史成交相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerFilledHistoryTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'get-filled-history', '查詢歷史成交');
  
  // 查詢歷史成交工具
  server.tool(
    "filled_history",
    description,
    {
      startDate: z
        .string()
        .describe("查詢開始日期 (YYYYMMDD 格式)"),
      endDate: z
        .string()
        .describe("查詢結束日期 (YYYYMMDD 格式)"),
    },
    createToolHandler(
      currentDir,
      'get-filled-history',
      async ({ startDate, endDate }) => {
        // 呼叫 SDK 獲取歷史成交資訊
        return await sdk.stock.filledHistory(account, startDate, endDate);
      },
      {
        errorMessage: "查詢歷史成交時發生錯誤"
      }
    )
  );
}