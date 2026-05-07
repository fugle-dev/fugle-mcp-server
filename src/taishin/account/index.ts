import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";

// 匯出所有帳戶管理相關工具
import { registerBankBalanceTools } from "./bank-balance";
import { registerInventoriesTools } from "./inventories";
import { registerRealizedProfitAndLossesTools } from "./realized-profit-and-loses";
import { registerSkbankBalanceTools } from "./skbank-balance";
import { registerAccountStatementTools } from "./statement";
import { registerTodayTradeSummaryTools } from "./today-trade-summary";
import { registerTodaySettlementTools } from "./today-settlement";
import { registerTotalPnlTools } from "./total-pnl";

// 確保匯出
export {
  registerBankBalanceTools,
  registerInventoriesTools,
  registerRealizedProfitAndLossesTools,
  registerSkbankBalanceTools,
  registerAccountStatementTools,
  registerTodayTradeSummaryTools,
  registerTodaySettlementTools,
  registerTotalPnlTools,
};

// 定義一個函數來註冊所有帳戶管理工具
export const registerAllAccountTools = async (
  server: McpServer,
  sdk: TaishinSDK,
  account: Account
) => {
  await registerBankBalanceTools(server, sdk, account);
  await registerInventoriesTools(server, sdk, account);
  await registerRealizedProfitAndLossesTools(server, sdk, account);
  await registerSkbankBalanceTools(server, sdk, account);
  await registerAccountStatementTools(server, sdk, account);
  await registerTodayTradeSummaryTools(server, sdk, account);
  await registerTodaySettlementTools(server, sdk, account);
  await registerTotalPnlTools(server, sdk, account);
};
