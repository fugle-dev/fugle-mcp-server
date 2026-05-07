import { version } from "../package.json";

// SDK 類型選擇
export type SdkType = 'taishin' | 'fubon';

export const config = {
  // 設定要使用的 SDK
  sdk: {
    type: (process.env.SDK_TYPE || 'taishin') as SdkType,
  },
  fugle: {
    apiUrl: process.env.FUGLE_API_URL || 'https://www.fugle.tw/api/v2',
  },
  // MCP server specific configuration
  mcp: {
    name: 'fugle-mcp-server',
    version,
    description: 'Fugle API MCP server for Taiwan stock market information and trades'
  }
};

export default config;