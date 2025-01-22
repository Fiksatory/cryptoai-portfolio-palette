export interface DexScreenerToken {
  pairs: DexScreenerPair[];
}

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  pairCreatedAt: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    h24: number;
  };
  priceChange: {
    h24: number;
  };
  liquidity?: {
    usd: number;
  };
  fdv?: number;
  links?: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
}

export interface TokenAnalysis {
  summary: string;
  metrics: {
    marketCap: number;
    volume24h: number;
    buySellRatio: number;
    healthScore: number;
  };
  marketStatus: string;
  riskLevel: string;
  socialLinks: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
}

export interface TokenProfile {
  address: string;
  name: string;
  symbol: string;
  chainId: string;
  createdAt: string;
  description?: string;
  links?: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
}

export interface TrendingToken {
  name: string;
  symbol: string;
  priceUsd: string;
  priceChange: {
    h24: number;
  };
  volume: {
    h24: number;
  };
  pairCreatedAt: Date;
  chainId: string;
  dexId: string;
}