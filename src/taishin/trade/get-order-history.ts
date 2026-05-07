import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { z } from "zod";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊查詢歷史委託相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerOrderHistoryTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'get-order-history', '查詢歷史委託記錄');
  
  // 查詢歷史委託工具
  server.tool(
    "get_order_history",
    description,
    {
      startDate: z
        .string()
        .describe("查詢開始日期，格式：YYYYMMDD，例如：20240301"),
      endDate: z
        .string()
        .describe("查詢結束日期，格式：YYYYMMDD，例如：20240320"),
      symbol: z
        .string()
        .describe("股票代號，例如：2330（可選，不填則查詢所有股票）")
        .optional(),
    },
    createToolHandler(
      currentDir,
      'get-order-history',
      async ({ startDate, endDate, symbol }) => {
        // 呼叫 SDK 獲取歷史委託記錄
        return await sdk.stock.orderHistory(account, startDate, endDate);
      },
      {
        errorMessage: "查詢歷史委託時發生錯誤"
      }
    )
  );
}