import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { z } from "zod";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊查詢歷史成交明細相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerFilledHistoryDetailTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'get-filled-history-detail', '查詢歷史成交明細');
  
  // 查詢歷史成交明細工具
  server.tool(
    "filled_history_detail",
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
      'get-filled-history-detail',
      async ({ startDate, endDate }) => {
        // 呼叫 SDK 獲取歷史成交明細資訊
        return await sdk.stock.filledDetailHistory(account, startDate, endDate);
      },
      {
        errorMessage: "查詢歷史成交明細時發生錯誤"
      }
    )
  );
}

/**
 * 格式化日期字串
 * @param dateStr 日期字串，格式為 YYYYMMDD
 * @returns 格式化後的日期字串 YYYY/MM/DD
 */
function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) {
    return dateStr;
  }
  
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  
  return `${year}/${month}/${day}`;
}
