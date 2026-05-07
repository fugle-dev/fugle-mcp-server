import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊新光銀行餘額查詢工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerSkbankBalanceTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'sk-bank-balance', '查詢新光銀行帳戶餘額資訊');
  // 新光銀行餘額查詢工具
  server.tool(
    "get_skbank_balance",
    description,
    {
      // 這裡不需要額外參數，因為已經傳入帳戶資訊
    },
    createToolHandler(
      currentDir,
      'sk-bank-balance',
      async () => {
        // 透過SDK獲取新光銀行餘額資訊
        const data = await sdk.accounting.skbankBalance(account);
        return data;
      },
      {
        errorMessage: "查詢新光銀行帳戶餘額時發生錯誤"
      }
    )
  );
}
