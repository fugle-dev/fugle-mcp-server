import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";
import { z } from "zod";

/**
 * 註冊已實現損益查詢工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerRealizedProfitAndLossesTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'realized-pnl-detail', '查詢已實現損益詳細資訊');
  // 已實現損益查詢工具
  server.tool(
    "get_account_realized_profit_and_losses",
    description,
    {
      start_date: z
        .string()
        .describe("查詢起始日期，格式為YYYYMMDD，例如：20240101"),
      end_date: z
        .string()
        .describe("查詢結束日期，格式為YYYYMMDD，例如：20240131"),
    },
    createToolHandler(
      currentDir,
      'realized-pnl-detail',
      async ({ start_date, end_date }) => {
        // 檢查日期格式是否正確
        if (!/^\d{8}$/.test(start_date) || !/^\d{8}$/.test(end_date)) {
          throw new Error("日期格式錯誤！請使用YYYYMMDD格式，例如：20240101");
        }

        // 檢查結束日期是否早於起始日期
        if (parseInt(end_date) < parseInt(start_date)) {
          throw new Error("查詢結束日期不能早於起始日期！");
        }

        // 透過SDK獲取已實現損益資訊
        const data = await sdk.accounting.realizedProfitAndLoses(
          account,
          start_date,
          end_date
        );
        return data;
      },
      {
        errorMessage: "查詢已實現損益時發生錯誤"
      }
    )
  );
}
