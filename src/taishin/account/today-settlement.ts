import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊今日交割款查詢工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerTodaySettlementTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'query-today-settlement', '查詢今日交割款資訊');
  // 今日交割款查詢工具
  server.tool(
    "get_today_settlement",
    description,
    {
      // 這裡不需要額外參數，因為已經傳入帳戶資訊
    },
    createToolHandler(
      currentDir,
      'query-today-settlement',
      async () => {
        // 透過SDK獲取今日交割款資訊
        const data = await sdk.accounting.todaySettlement(account);
        return data;
      },
      {
        errorMessage: "查詢今日交割款時發生錯誤"
      }
    )
  );
}
