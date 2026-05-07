import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { z } from "zod";
import { loadToolMetadata, createToolHandler } from "../../shared/utils/index.js";

/**
 * 註冊查詢資券配額相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} sdk TaishinSDK 實例
 * @param {Object} account 帳戶實例
 */
export function registerMarginQuotaTools(
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) {
  const currentDir = __dirname;
  const { description } = loadToolMetadata(currentDir, 'get-margin-quota', '查詢股票資券配額');
  
  // 查詢資券配額工具
  server.tool(
    "get_margin_quota",
    description,
    {
      symbol: z
        .string()
        .describe("股票代號，例如：2330"),
      queryType: z
        .enum(["1", "2", "all"])
        .describe("查詢類別：1-融資、2-融券、all-全部")
        .default("all"),
    },
    createToolHandler(
      currentDir,
      'get-margin-quota',
      async ({ symbol, queryType }) => {
        let resultData: any[] = [];
        
        // 根據查詢類別獲取資料
        if (queryType === "all") {
          // 如果是全部，則分別查詢融資和融券
          const marginData = await sdk.stock.marginQuota(account, symbol, "1");
          const shortData = await sdk.stock.marginQuota(account, symbol, "2");
          
          if (marginData) resultData.push(marginData);
          if (shortData) resultData.push(shortData);
        } else {
          // 否則只查詢指定類別
          const data = await sdk.stock.marginQuota(account, symbol, queryType);
          if (data) resultData.push(data);
        }

        return resultData;
      },
      {
        errorMessage: "查詢資券配額時發生錯誤"
      }
    )
  );
}