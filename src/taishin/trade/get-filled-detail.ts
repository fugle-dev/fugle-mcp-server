import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { z } from "zod";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊查詢成交明細相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerFilledDetailTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'get-filled-detail', '查詢今日成交明細');
  
  // 查詢今日成交明細工具
  server.tool(
    "get_filled_detail",
    description,
    {
      symbol: z
        .string()
        .describe("股票代號，例如：2330（可選，不填則查詢所有股票）")
        .optional(),
    },
    createToolHandler(
      currentDir,
      'get-filled-detail',
      async ({ symbol }) => {
        // 呼叫 SDK 獲取成交明細
        return await sdk.stock.getFilledDetail(account, symbol);
      },
      {
        errorMessage: "查詢成交明細時發生錯誤"
      }
    )
  );
}