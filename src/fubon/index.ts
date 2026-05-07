import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FubonSDK } from "fubon-neo";
import { Account } from "fubon-neo/trade";
import { registerAccountManagementTools } from "./account";
import { registerTradeTools } from "./trade";
import { registerSmartConditionTools } from "./smart-condition";
import { SdkProvider, StockClient } from "../shared/factory";
import { registerAllMarketDataTools } from "../shared/marketdata";

export class FubonMcp {
  server: McpServer;
  sdk: FubonSDK;
  stock: StockClient;
  private accounts: Account[];
  targetAccount: Account;

  constructor(server: McpServer, certPath: string) {
    const { NATIONAL_ID, ACCOUNT, ACCOUNT_PASS, CERT_PASS, FUBON_URL } = process.env;
    this.server = server;
    this.sdk = FUBON_URL ? new FubonSDK(30, 2, FUBON_URL) : new FubonSDK();

    const accountRes = this.sdk.login(
      NATIONAL_ID as string,
      ACCOUNT_PASS as string,
      certPath,
      CERT_PASS as string
    );

    this.accounts = accountRes.data || [];

    let account;

    if (ACCOUNT) {
      account = this.accounts.find((account) => {
        return account.account === ACCOUNT;
      });
    } else {
      account = this.accounts[0];
    }

    if (!account) {
      console.error("No account found");
      process.exit(1);
    }

    this.targetAccount = account;

    this.sdk.initRealtime();
    if (!this.sdk.marketdata) {
      console.error("Failed to initialize marketdata");
      process.exit(1);
    }
    
    // 使用 SDK Provider 創建具有正確類型的 stock 客戶端
    const sdkProvider = SdkProvider.getInstance();
    const originalStock = this.sdk.marketdata.restClient.stock;

    // 用工廠方法創建具有正確類型的客戶端
    // 注意: fubon-neo 與 taishin-sdk 同樣使用 @fugle/marketdata，但 marketdata 屬性的可選性不同
    // 但實際 API 相容，使用 type assertion 處理
    const typedStock = sdkProvider.createStockClient(originalStock as unknown as StockClient);
    this.stock = typedStock;

    registerAccountManagementTools(this.server, this.sdk, this.targetAccount);
    registerTradeTools(this.server, this.sdk, this.targetAccount);
    registerSmartConditionTools(this.server, this.sdk, this.targetAccount);
    // 註冊市場數據工具
    registerAllMarketDataTools(this.server, typedStock);
  }
}