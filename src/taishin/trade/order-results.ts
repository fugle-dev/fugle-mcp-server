import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { z } from "zod";
import { QueryType } from "taishin-sdk";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊查詢委託單相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerOrderResultTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'order-results', '查詢委託單結果');
  
  // 取得委託單結果工具
  server.tool(
    "get_order_results",
    description,
    {
      queryType: z
        .enum(["All", "Reservation", "RegularSession", "Cancelable", "Failed"])
        .describe(
          "盤別：All 全部、Reservation 預約單、RegularSession 盤中、Cancelable 可取消委託、Failed 失敗單"
        )
        .default("All")
        .optional(),
    },
    createToolHandler(
      currentDir,
      'order-results',
      async ({ queryType }) => {
        // 處理 enum 轉換
        let queryTypeValue: QueryType;

        // 如果未提供 queryType，預設為 All
        if (!queryType) {
          queryTypeValue = QueryType.All;
        } else {
          switch (queryType) {
            case "All":
              queryTypeValue = QueryType.All;
              break;
            case "Reservation":
              queryTypeValue = QueryType.Reservation;
              break;
            case "RegularSession":
              queryTypeValue = QueryType.RegularSession;
              break;
            case "Cancelable":
              queryTypeValue = QueryType.Cancelable;
              break;
            case "Failed":
              queryTypeValue = QueryType.Failed;
              break;
            default:
              throw new Error(`不支援的查詢類型: ${queryType}`);
          }
        }

        // 呼叫 SDK 獲取委託單結果
        return await sdk.stock.getOrderResults(account, queryTypeValue);
      },
      {
        errorMessage: "查詢委託單結果時發生錯誤"
      }
    )
  );
}
