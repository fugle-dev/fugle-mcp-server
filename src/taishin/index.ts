import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Account, TaishinSDK } from "taishin-sdk";
import { registerAllAccountTools } from "./account";
import { registerAllTradeTools } from "./trade";
import { SdkProvider } from "../shared/factory";
import { registerAllMarketDataTools } from "../shared/marketdata";

type RestStockClient = NonNullable<TaishinSDK['marketdata']>['restClient']['stock'];

export class TaishinMcp {
  server: McpServer;
  sdk: TaishinSDK;
  stock: RestStockClient;
  private accounts: Account[];
  targetAccount: Account;

  constructor(server: McpServer, certPath: string) {
    const { NATIONAL_ID, ACCOUNT, ACCOUNT_PASS, CERT_PASS } = process.env;
    this.server = server;
    this.sdk = new TaishinSDK(null);

    // 由於前面已經檢查過 nationalId 是否存在，這裡可以斷言它一定是字符串
    this.accounts = this.sdk.login(
      NATIONAL_ID as string,
      ACCOUNT_PASS as string,
      certPath,
      CERT_PASS as string
    );

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

    this.sdk.initRealtime(this.targetAccount);
    if (!this.sdk.marketdata) {
      console.error("Failed to initialize marketdata");
      process.exit(1);
    }

    // 使用 SDK Provider 創建具有正確類型的 stock 客戶端
    const sdkProvider = SdkProvider.getInstance();
    const originalStock = this.sdk.marketdata.restClient.stock;

    // 用工廠方法創建具有正確類型的客戶端
    const typedStock = sdkProvider.createStockClient(originalStock);
    this.stock = typedStock;

    registerAllMarketDataTools(this.server, typedStock);
    registerAllTradeTools(this.server, this.sdk, this.targetAccount);
    registerAllAccountTools(this.server, this.sdk, this.targetAccount);
  }
}
