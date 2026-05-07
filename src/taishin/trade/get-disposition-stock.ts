import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { z } from "zod";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊查詢處置股票相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerDispositionStockTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'get-disposition-stock', '查詢處置股票');
  
  // 查詢處置股票工具
  server.tool(
    "query_disposition_stock",
    description,
    {
      symbol: z
        .string()
        .describe("股票代號，例如：2330（可選，不填則查詢所有處置股票）"),
    },
    createToolHandler(
      currentDir,
      'get-disposition-stock',
      async ({ symbol }) => {
        // 呼叫 SDK 獲取處置股票資訊
        return await sdk.stock.queryDispositionStock(account, symbol);
      },
      {
        errorMessage: "查詢處置股票時發生錯誤"
      }
    )
  );
}
