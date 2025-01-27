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
    d7?: number;
  };
  priceChange: {
    h1?: number;
    h24: number;
    d7?: number;
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
  name: string;
  symbol: string;
  price: string;
  priceChange: {
    h1?: number;
    h24: number;
    d7?: number;
  };
  volume: {
    h24: number;
    d7?: number;
  };
  liquidity?: number;
  marketCap: number;
  metrics: {
    marketCap: number;
    volume24h: number;
    buySellRatio: number;
    healthScore: number;
  };
  summary: string;
  marketStatus: string;
  riskLevel: string;
  socialLinks: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  pairCreatedAt: string;
  dexId: string;
  network: string;
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