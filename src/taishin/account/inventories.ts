import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊帳戶庫存與未實現損益查詢工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerInventoriesTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'inventories', '查詢帳戶庫存與未實現損益資訊');
  // 帳戶庫存與未實現損益查詢工具
  server.tool(
    "get_account_inventories",
    description,
    {
      // 這裡不需要額外參數，因為已經傳入帳戶資訊
    },
    createToolHandler(
      currentDir,
      'inventories',
      async () => await sdk.accounting.inventories(account),
      {
        errorMessage: "查詢帳戶庫存與未實現損益時發生錯誤"
      }
    )
  );
}
