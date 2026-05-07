import { config, SdkType } from "../../config";
import { StockClientFactory, StockClient, GenericStockClient } from "./stock-client.factory";

/**
 * SDK 提供者類別
 * 負責根據配置為應用程序提供正確的 SDK 實例
 */
export class SdkProvider {
  private static instance: SdkProvider;
  private sdkType: SdkType;
  
  private constructor() {
    this.sdkType = config.sdk.type;
  }

  /**
   * 獲取單例實例
   * @returns SdkProvider 實例
   */
  static getInstance(): SdkProvider {
    if (!SdkProvider.instance) {
      SdkProvider.instance = new SdkProvider();
    }
    return SdkProvider.instance;
  }

  /**
   * 獲取當前配置的 SDK 類型
   * @returns SDK 類型
   */
  getSdkType(): SdkType {
    return this.sdkType;
  }
  
  /**
   * 設置 SDK 類型（用於測試或運行時切換）
   * @param type SDK 類型
   */
  setSdkType(type: SdkType): void {
    this.sdkType = type;
  }

  /**
   * 根據當前 SDK 類型創建股票客戶端
   * @param client 原始客戶端實例
   * @returns 類型化的客戶端實例
   */
  createStockClient<T extends StockClient>(client: T): T {
    return StockClientFactory.createClient(this.sdkType, client);
  }

  /**
   * 檢查客戶端是否為 Taishin
   * @param client 股票客戶端
   * @returns 是否為 Taishin 客戶端
   */
  isTaishinClient(client: StockClient): boolean {
    return StockClientFactory.isTaishinClient(this.sdkType, client);
  }

  /**
   * 檢查客戶端是否為 Fubon
   * @param client 股票客戶端
   * @returns 是否為 Fubon 客戶端
   */
  isFubonClient(client: StockClient): boolean {
    return StockClientFactory.isFubonClient(this.sdkType, client);
  }
}
