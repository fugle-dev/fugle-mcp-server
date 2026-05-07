import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";

// 導入所有交易相關工具
import { registerAttentionStockTools } from "./get-attention-stock";
import { registerDispositionStockTools } from "./get-disposition-stock";
import { registerFilledQueryTools } from "./get-filled";
import { registerFilledDetailTools } from "./get-filled-detail";
import { registerFilledHistoryTools } from "./get-filled-history";
import { registerFilledHistoryDetailTools } from "./get-filled-history-detail";
import { registerMarginQuotaTools } from "./get-margin-quota";
import { registerOrderHistoryTools } from "./get-order-history";
import { registerShortDaytradeQuotaTools } from "./get-short-daytrade-quota";
import { registerModifyOrderTools } from "./modify-price";
import { registerModifyVolumeTools } from "./modify-volume";
import { registerOrderResultTools } from "./order-results";
import { registerPlaceOrderTools } from "./place-order";
import { registerApiAuthTools } from "./register-api-auth";

// 確保匯出
export {
  registerAttentionStockTools,
  registerDispositionStockTools,
  registerFilledQueryTools,
  registerFilledDetailTools,
  registerFilledHistoryTools,
  registerFilledHistoryDetailTools,
  registerMarginQuotaTools,
  registerOrderHistoryTools,
  registerShortDaytradeQuotaTools,
  registerModifyOrderTools,
  registerModifyVolumeTools,
  registerOrderResultTools,
  registerPlaceOrderTools,
  registerApiAuthTools,
};

// 定義一個函數來註冊所有交易工具
export const registerAllTradeTools = (
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) => {
  registerAttentionStockTools(server, sdk, account);
  registerDispositionStockTools(server, sdk, account);
  registerFilledQueryTools(server, sdk, account);
  registerFilledDetailTools(server, sdk, account);
  registerFilledHistoryTools(server, sdk, account);
  registerFilledHistoryDetailTools(server, sdk, account);
  registerMarginQuotaTools(server, sdk, account);
  registerOrderHistoryTools(server, sdk, account);
  registerShortDaytradeQuotaTools(server, sdk, account);
  registerModifyOrderTools(server, sdk, account);
  registerModifyVolumeTools(server, sdk, account);
  registerOrderResultTools(server, sdk, account);
  registerPlaceOrderTools(server, sdk, account);
  registerApiAuthTools(server, sdk, account);
};
