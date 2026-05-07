import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { z } from "zod";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊查詢警示股票相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerAttentionStockTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'get-attention-stock', '查詢警示股票');
  
  // 查詢警示股票工具
  server.tool(
    "get_attention_stock",
    description,
    {
      symbol: z
        .string()
        .describe("股票代號，例如：2330（可選，不填則查詢所有警示股票）")
        .optional(),
    },
    createToolHandler(
      currentDir,
      'get-attention-stock',
      async ({ symbol }) => {
        // 呼叫 SDK 獲取警示股票資訊
        return await sdk.stock.queryAttentionStock(account, symbol);
      },
      {
        errorMessage: "查詢警示股票時發生錯誤"
      }
    )
  );
}