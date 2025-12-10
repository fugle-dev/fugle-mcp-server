import { SdkType } from "../../config";
import type { RestStockClient as MasterlinkStockClient } from "masterlink-sdk/marketdata/rest/stock/client";
import type { RestStockClient as FubonStockClient } from "masterlink-sdk/marketdata/rest/stock/client";

// 聯合類型，表示可能的股票客戶端類型
export type StockClient = MasterlinkStockClient | FubonStockClient;

/**
 * 通用股票客戶端類型定義
 * 不使用泛型參數，而是簡化為基本方法結構
 */
export type GenericStockClient = {
  snapshot: {
    quotes: (params: { 
      market: "TSE" | "OTC" | "ESB" | "TIB" | "PSB"; 
      type?: "COMMONSTOCK" | "ALL" | "ALLBUT0999";
    }) => Promise<any>;
    movers: (params: { 
      market: "TSE" | "OTC" | "ESB" | "TIB" | "PSB"; 
      direction: "up" | "down";
      change: "percent" | "value";
      gt?: number;
      type?: "COMMONSTOCK" | "ALL" | "ALLBUT0999";
      gte?: number;
      lt?: number;
      lte?: number;
      eq?: number;
    }) => Promise<any>;
    actives: (params: { 
      market: "TSE" | "OTC" | "ESB" | "TIB" | "PSB"; 
      trade: "volume" | "value";
      type?: "COMMONSTOCK" | "ALL" | "ALLBUT0999";
    }) => Promise<any>;
  };
  intraday: {
    quote: (params: { symbol: string; type?: "oddlot" }) => Promise<any>;
    ticker: (params: { symbol: string; type?: "oddlot" }) => Promise<any>;
    candles: (params: { 
      symbol: string; 
      type?: "oddlot";
      timeframe?: "1" | "5" | "10" | "15" | "30" | "60"; 
      resolution?: string;
    }) => Promise<any>;
    trades: (params: { 
      symbol: string; 
      type?: "oddlot";
      limit?: number;
      offset?: number;
    }) => Promise<any>;
    tickers: (params: { 
      type: string; 
      market?: string;
      industry?: string;
      isNormal?: boolean;
      isAttention?: boolean;
      isDisposition?: boolean;
      isHalted?: boolean;
    }) => Promise<any>;
    volumes: (params: { symbol: string; type?: "oddlot" }) => Promise<any>;
  };
  historical: {
    candles: (params: { 
      symbol: string; 
      from?: string; 
      to?: string;
      timeframe?: "1" | "5" | "10" | "15" | "30" | "60" | "D" | "W" | "M";
      fields?: string;
      sort?: "asc" | "desc";
    }) => Promise<any>;
    stats: (params: { symbol: string; type?: "price" }) => Promise<any>;
  };
};

/**
 * 股票客戶端工廠類別
 * 根據配置類型返回對應的股票客戶端實例
 */
export class StockClientFactory {
  /**
   * 創建 SDK 實例
   * @param sdkType SDK 類型
   * @param client 客戶端實例
   * @returns 類型化的客戶端實例
   */
  static createClient<T extends StockClient>(sdkType: SdkType, client: T): T {
    // 這裡直接返回原始客戶端，保留完整的原始類型
    // 由於 GenericStockClient 已經使用 any 作為返回類型，所以不需要交集
    return client;
  }

  /**
   * 根據 SDK 類型判斷客戶端是否為 Masterlink
   * @param sdkType SDK 類型
   * @param client 客戶端實例
   * @returns 是否為 Masterlink 客戶端
   */
  static isMasterlinkClient(sdkType: SdkType, client: StockClient): client is MasterlinkStockClient {
    return sdkType === 'masterlink';
  }

  /**
   * 根據 SDK 類型判斷客戶端是否為 Fubon
   * @param sdkType SDK 類型
   * @param client 客戶端實例
   * @returns 是否為 Fubon 客戶端
   */
  static isFubonClient(sdkType: SdkType, client: StockClient): client is FubonStockClient {
    return sdkType === 'fubon';
  }
}
