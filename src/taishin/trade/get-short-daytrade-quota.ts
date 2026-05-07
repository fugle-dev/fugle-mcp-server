import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { z } from "zod";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊查詢現沖券餘額相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerShortDaytradeQuotaTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'get-short-daytrade-quota', '查詢股票現沖券餘額');
  
  // 查詢現沖券餘額工具
  server.tool(
    "get_short_daytrade_quota",
    description,
    {
      symbol: z
        .string()
        .describe("股票代號，例如：2330"),
    },
    createToolHandler(
      currentDir,
      'get-short-daytrade-quota',
      async ({ symbol }) => {
        // 呼叫 SDK 獲取現沖券餘額資訊
        return await sdk.stock.shortDaytradeQuota(account, symbol);
      },
      {
        errorMessage: "查詢現沖券餘額時發生錯誤"
      }
    )
  );
}