import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FubonSDK } from "fubon-neo";
import { RestStockClient } from "fubon-neo/marketdata/rest/stock/client";
import { Account } from "fubon-neo/trade";
import { registerAccountManagementTools } from "./account";
import { registerTradeTools } from "./trade";
import { registerSmartConditionTools } from "./smart-condition";
import { SdkProvider } from "../shared/factory";
import { registerAllMarketDataTools } from "../shared/marketdata";

export class FubonMcp {
  server: McpServer;
  sdk: FubonSDK;
  stock: RestStockClient;
  private accounts: Account[];
  targetAccount: Account;

  constructor(server: McpServer, certPath: string) {
    const { NATIONAL_ID, ACCOUNT, ACCOUNT_PASS, CERT_PASS, FUBON_URL } = process.env;
    this.server = server;
    this.sdk = FUBON_URL ? new FubonSDK("30", "2", FUBON_URL) : new FubonSDK();

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
    // 特別說明: typedStock 會同時具有 FubonStockClient 和 GenericStockClient 的類型
    // 這確保了它有所需的所有方法，且返回類型正確
    const typedStock = sdkProvider.createStockClient(originalStock);
    this.stock = typedStock;

    registerAccountManagementTools(this.server, this.sdk, this.targetAccount);
    registerTradeTools(this.server, this.sdk, this.targetAccount);
    registerSmartConditionTools(this.server, this.sdk, this.targetAccount);
    // 註冊市場數據工具
    registerAllMarketDataTools(this.server, typedStock);
  }
}