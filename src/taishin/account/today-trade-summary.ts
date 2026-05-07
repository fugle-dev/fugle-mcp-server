import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";
import { z } from "zod";

/**
 * 註冊今日買賣日報與即時庫存查詢工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerTodayTradeSummaryTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'today-trade-summary', '查詢今日買賣日報與即時庫存資訊');
  // 今日買賣日報與即時庫存查詢工具
  server.tool(
    "get_account_today_trade_summary",
    description,
    {
      symbol: z.string().optional().describe("選擇性參數：可指定股票代號"),
    },
    createToolHandler(
      currentDir,
      'today-trade-summary',
      async ({ symbol }) => {
        // 透過SDK獲取今日買賣日報與即時庫存資訊
        const data = await sdk.accounting.todayTradeSummary(account, symbol);
        return data;
      },
      {
        errorMessage: "查詢今日買賣日報與即時庫存時發生錯誤"
      }
    )
  );
}
