import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊分戶帳銀行餘額查詢工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerBankBalanceTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'balance', '查詢分戶帳銀行餘額資訊');
  
  // 分戶帳銀行餘額查詢工具
  server.tool(
    "get_bank_balance",
    description,
    {
      // 這裡不需要額外參數，因為已經傳入帳戶資訊
    },
    createToolHandler(
      currentDir,
      'balance',
      async () => {
        // 透過SDK獲取分戶帳銀行餘額資訊
        return await sdk.accounting.bankBalance(account);
      },
      {
        errorMessage: "查詢分戶帳銀行餘額時發生錯誤"
      }
    )
  );
}
