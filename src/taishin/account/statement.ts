import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";
import { z } from "zod";

/**
 * 註冊帳戶對帳單查詢工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerAccountStatementTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'account-statement', '查詢帳戶對帳單資訊');
  // 帳戶對帳單查詢工具
  server.tool(
    "get_account_statement",
    description,
    {
      start_date: z
        .string()
        .describe("查詢起始日期，格式為YYYYMMDD，例如：20240101"),
      end_date: z
        .string()
        .describe("查詢結束日期，格式為YYYYMMDD，例如：20240131"),
      symbol: z
        .string()
        .optional()
        .describe("選擇性參數：可指定股票代號篩選特定股票的交易記錄"),
    },
    createToolHandler(
      currentDir,
      'account-statement',
      async ({ start_date, end_date, symbol }) => {
        // 檢查日期格式是否正確
        if (!/^\d{8}$/.test(start_date) || !/^\d{8}$/.test(end_date)) {
          throw new Error("日期格式錯誤！請使用YYYYMMDD格式，例如：20240101");
        }

        // 檢查結束日期是否早於起始日期
        if (parseInt(end_date) < parseInt(start_date)) {
          throw new Error("查詢結束日期不能早於起始日期！");
        }

        // 透過SDK獲取帳戶對帳單資訊
        const data = await sdk.accounting.accountStatment(
          account,
          start_date,
          end_date,
          symbol
        );
        return data;
      },
      {
        errorMessage: "查詢帳戶對帳單時發生錯誤"
      }
    )
  );
}
