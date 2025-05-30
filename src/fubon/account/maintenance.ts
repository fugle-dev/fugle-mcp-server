import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import maintenanceReference from "./references/maintenance.json";
import { FubonSDK } from "fubon-neo";
import { Account } from "fubon-neo/trade";

/**
 * 註冊維持率查詢工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk FubonSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerMaintenanceTool(
  server: McpServer,
  sdk: FubonSDK,
  account: Account
) {
  // 維持率查詢工具
  server.tool(
    "get_maintenance",
    "查詢維持率資訊",
    {
      // 這裡不需要額外參數，因為已經傳入帳戶資訊
    },
    async () => {
      try {
        // 透過SDK獲取維持率資訊
        const data = await sdk.accounting.maintenance(account);

        const response = `API Response\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\nField Description\n\`\`\`json\n${JSON.stringify(maintenanceReference, null, 2)}\n\`\`\``;

        return {
          content: [{ type: "text", text: response }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `維持率查詢時發生錯誤: ${error || "未知錯誤"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}