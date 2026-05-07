import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { z } from "zod";
import { PriceType } from "taishin-sdk";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊修改委託單相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerModifyOrderTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'modify-price', '修改委託價格');
  
  // 修改委託價格工具
  server.tool(
    "modify_price",
    description,
    {
      orderNo: z.string().optional().describe("委託書號，例如：f0002"),
      preOrderNo: z.string().optional().describe("委託書號，例如：f0002"),
      isPreOrder: z.boolean().default(false).describe("是否為預約單"),
      price: z
        .string()
        .describe(
          "修改後的委託價格，例如：14.5（市價、漲停、跌停等特殊價格類型時可為空）"
        ),
      priceType: z
        .enum(["Limit", "Market", "LimitUp", "LimitDown", "Reference"])
        .describe(
          "價格類型：Limit 限價、Market 市價、LimitUp 漲停、LimitDown 跌停、Reference 平盤價"
        ),
    },
    createToolHandler(
      currentDir,
      'modify-price',
      async ({ orderNo, preOrderNo, isPreOrder, price, priceType }) => {
        if (process.env.ENABLE_ORDER !== "true") {
          throw new Error(
            "修改委託價格功能已停用！(啟用此功能請在環境變數中設定 ENABLE_ORDER 為 true )"
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

        // 檢查委託單狀態
        if (!targetOrder.canCancel) {
          throw new Error(`修改委託價格失敗：委託單不可修改`);
        }

        // 修改委託價格
        return await sdk.stock.modifyPrice(
          account,
          targetOrder,
          price || "",
          priceType as PriceType
        );
      },
      {
        errorMessage: "修改委託價格時發生錯誤"
      }
    )
  );
}
