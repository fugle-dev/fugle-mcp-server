# SDK 工廠模式使用文檔

本文檔說明如何使用 SDK 工廠模式在 Taishin SDK 和 Fubon Neo SDK 之間切換，同時保持完整的類型安全。

## 關鍵概念

### 1. StockClient

這是一個聯合類型，包含了 TaishinStockClient 和 FubonStockClient 的聚合。它允許我們用一個類型來表示不同的 SDK 客戶端，同時保留原始 SDK 的所有類型信息。

### 2. StockClientFactory

工廠類，負責創建具有正確類型的股票客戶端實例。它會直接返回原始客戶端，但保留完整的原始類型信息，不再需要使用交叉類型。

### 3. SdkProvider

單例類，提供全局訪問點，負責管理 SDK 類型和創建客戶端實例。提供了簡單的 API 來切換和判斷 SDK 類型。

## 使用示例

### 1. 通過環境變數選擇 SDK

```bash
# 使用 Taishin SDK
SDK_TYPE=taishin node dist/index.js

# 使用 Fubon SDK
SDK_TYPE=fubon node dist/index.js
```

### 2. 在代碼中使用 SDK Provider

```typescript
import { SdkProvider } from "../shared/factory";

// 獲取 SDK Provider 實例
const sdkProvider = SdkProvider.getInstance();

// 創建具有原始 SDK 類型的客戶端
const typedStock = sdkProvider.createStockClient(originalStock);

// 使用原始 SDK 的方法和類型
const result = await typedStock.snapshot.quotes({
  market: "TSE",
  type: "COMMONSTOCK"
});

// result 會有原始 SDK 定義的返回類型
// 例如，如果是 Taishin SDK，那麼 result 的類型將是 TaishinStockClient 的返回類型
// 如果是 Fubon SDK，那麼 result 的類型將是 FubonStockClient 的返回類型
```

### 3. 動態切換 SDK 類型

```typescript
const sdkProvider = SdkProvider.getInstance();

// 查詢當前 SDK 類型
const currentType = sdkProvider.getSdkType();

// 動態切換 SDK 類型
sdkProvider.setSdkType('fubon');
```

### 4. 類型判斷

```typescript
if (sdkProvider.isTaishinClient(stock)) {
  // TypeScript 知道這裡 stock 是 TaishinStockClient 類型
  // 可以使用 Taishin 特有的屬性和方法
} else if (sdkProvider.isFubonClient(stock)) {
  // TypeScript 知道這裡 stock 是 FubonStockClient 類型
  // 可以使用 Fubon 特有的屬性和方法
}
```

## 關於類型安全的說明

此實現選擇直接使用原始 SDK 的類型，而不是定義中間介面層或使用泛型。這是因為：

1. 原始 SDK 的類型定義已經足夠精確
2. 使用原始類型可以獲得最佳的類型推導和錯誤檢查
3. 避免了因維護自定義介面而增加的複雜性
4. 更容易適應 SDK 的版本更新

## 優點

1. **完整的類型安全** - 使用原始 SDK 的完整類型信息，不再使用 `any` 或泛型
2. **靈活切換** - 可以通過環境變數或代碼動態切換 SDK
3. **簡潔的實現** - 不需要維護複雜的介面層或類型映射
4. **擴展性** - 易於添加新的 SDK 支持

## 後續優化

1. **適配器層** - 如果兩個 SDK 的返回格式不完全相同，可以考慮添加適配器層，統一返回格式
2. **共享類型** - 如果需要在應用程序中定義共享類型，可以基於原始 SDK 的類型建立更具體的模型
3. **類型防護** - 可以添加更多的類型防護函數，以在運行時區分不同的 SDK 結構
