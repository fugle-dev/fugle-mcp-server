import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊帳戶損益相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerTotalPnlTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'account-total-pnl', '查詢帳戶損益概況資訊');
  // 帳戶損益速查工具
  server.tool(
    "get_account_total_pnl",
    description,
    {
      // 這裡不需要額外參數，因為已經傳入帳戶資訊
    },
    createToolHandler(
      currentDir,
      'account-total-pnl',
      async () => {
        // 透過SDK獲取帳戶損益資訊
        const data = await sdk.accounting.accountTotalPnl(account);
        return data;
      },
      {
        errorMessage: "查詢帳戶損益概況時發生錯誤"
      }
    )
  );
}
