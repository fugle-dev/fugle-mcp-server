import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { z } from "zod";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊修改委託單數量相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerModifyVolumeTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'modify-volume', '修改委託單數量');
  
  // 修改委託單數量工具
  server.tool(
    "modify_volume",
    description,
    {
      orderNo: z.string().optional().describe("委託書號，例如：f0002"),
      preOrderNo: z.string().optional().describe("委託書號，例如：f0002"),
      isPreOrder: z.boolean().default(false).describe("是否為預約單"),
      volume: z.number().describe("欲刪減的股數（設為0表示刪單）"),
    },
    createToolHandler(
      currentDir,
      'modify-volume',
      async ({ orderNo, preOrderNo, volume, isPreOrder }) => {
        if (process.env.ENABLE_ORDER !== "true") {
          throw new Error(
            "修改委託單數量功能已停用！(啟用此功能請在環境變數中設定 ENABLE_ORDER 為 true )"
          );
        }
        // 先獲取委託單資訊
        const orderResults = await sdk.stock.getOrderResults(account);
        const targetOrder = orderResults.find((order) => {
          if (isPreOrder) {
            return order.preOrderNo === preOrderNo;
          }
          return order.orderNo === orderNo;
        });

        if (!targetOrder) {
          throw new Error(
            isPreOrder
              ? `修改委託單數量失敗：找不到預約委託書號 ${preOrderNo} 的委託單`
              : `修改委託單數量失敗：找不到委託書號 ${orderNo} 的委託單`
          );
        }

        if (isPreOrder) {
          targetOrder.orderDate = targetOrder?.workDate;
        }

        // 檢查委託單狀態
        if (!targetOrder.canCancel) {
          throw new Error(`修改委託單數量失敗：委託單不可修改`);
        }
        // 修改委託數量
        return await sdk.stock.modifyVolume(account, targetOrder, volume);
      },
      {
        errorMessage: "修改委託單數量時發生錯誤"
      }
    )
  );
}
