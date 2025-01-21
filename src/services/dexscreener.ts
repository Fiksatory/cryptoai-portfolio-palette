const DEX_SCREENER_API = 'https://api.dexscreener.com/latest/dex';

// Market context data (simulated - in a real app, this would come from an API)
const SOLANA_MEME_MARKET = {
  totalMarketCap: 2500000000, // $2.5B
  dominanceRanking: {
    BONK: 35,
    WIF: 25,
    MYRO: 15,
    POPCAT: 5
  },
  averageVolumeMcapRatio: 0.15, // 15%
  averageHealthScore: 75
};

export interface DexScreenerToken {
  pairs: {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
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
  }[];
}

export const searchTokens = async (query: string): Promise<DexScreenerToken> => {
  const response = await fetch(`${DEX_SCREENER_API}/search/?q=${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch token data');
  }
  return response.json();
};

export const analyzePairData = (data: DexScreenerToken) => {
  if (!data.pairs || data.pairs.length === 0) {
    return {
      summary: "No trading pairs found for this token.",
      sentiment: "neutral",
      marketStatus: "Unknown",
      riskLevel: "Unknown",
      marketContext: "Unable to analyze token in the context of Solana meme market.",
      metrics: {
        marketCap: 0,
        volume24h: 0,
        buySellRatio: 0,
        healthScore: 0
      }
    };
  }

  const solanaPairs = data.pairs.filter(pair => pair.chainId === "solana");
  if (solanaPairs.length === 0) {
    return {
      summary: "No Solana trading pairs found for this token.",
      sentiment: "neutral",
      marketStatus: "Not on Solana",
      riskLevel: "Unknown",
      marketContext: "Token not found on Solana network.",
      metrics: {
        marketCap: 0,
        volume24h: 0,
        buySellRatio: 0,
        healthScore: 0
      }
    };
  }

  const mainPair = solanaPairs[0];
  const marketCap = mainPair.fdv || 0;
  const volume24h = mainPair.volume?.h24 || 0;
  const buySellRatio = mainPair.txns?.h24 ? 
    mainPair.txns.h24.buys / (mainPair.txns.h24.sells || 1) : 0;

  // Market Context Analysis
  const marketShare = (marketCap / SOLANA_MEME_MARKET.totalMarketCap) * 100;
  const volumeMcapRatio = volume24h / marketCap;
  const relativeLiquidity = volumeMcapRatio / SOLANA_MEME_MARKET.averageVolumeMcapRatio;

  // Market Status & Risk Assessment
  let marketStatus = "";
  let riskLevel = "";
  let summary = [];

  if (marketCap > 100000000) {
    marketStatus = "Major Memecoin";
    riskLevel = "Moderate";
    summary.push("Established memecoin with significant market presence");
  } else if (marketCap > 10000000) {
    marketStatus = "Growing Memecoin";
    riskLevel = "High";
    summary.push("Mid-sized memecoin with growth potential");
  } else {
    marketStatus = "Emerging Memecoin";
    riskLevel = "Very High";
    summary.push("Early-stage memecoin with high volatility risk");
  }

  if (volumeMcapRatio > SOLANA_MEME_MARKET.averageVolumeMcapRatio * 1.5) {
    summary.push("Above-average trading activity indicates strong market interest");
  } else if (volumeMcapRatio < SOLANA_MEME_MARKET.averageVolumeMcapRatio * 0.5) {
    summary.push("Below-average trading activity suggests limited market interest");
  }

  // Market Health Score (0-100)
  const healthScore = calculateHealthScore(volumeMcapRatio, relativeLiquidity, buySellRatio, marketShare);

  // Market Context Message
  const marketContext = `Solana Meme Market Overview:\n` +
    `• Total Meme Market Cap: $${(SOLANA_MEME_MARKET.totalMarketCap / 1e9).toFixed(2)}B\n` +
    `• Market Share: ${marketShare.toFixed(2)}%\n` +
    `• Volume/MCap vs Market Avg: ${(relativeLiquidity * 100).toFixed(2)}%`;

  return {
    summary: summary.join(". "),
    marketStatus,
    riskLevel,
    marketContext,
    metrics: {
      marketCap,
      volume24h,
      buySellRatio,
      healthScore
    }
  };
};

const calculateHealthScore = (
  volumeMcapRatio: number,
  relativeLiquidity: number,
  buySellRatio: number,
  marketShare: number
): number => {
  let score = 50;

  // Volume/MCap ratio score (max 25 points)
  if (relativeLiquidity > 1.5) score += 25;
  else if (relativeLiquidity > 1) score += 15;
  else if (relativeLiquidity > 0.5) score += 5;

  // Market share score (max 25 points)
  if (marketShare > 10) score += 25;
  else if (marketShare > 1) score += 15;
  else if (marketShare > 0.1) score += 5;

  // Buy/Sell ratio score (max 25 points)
  if (buySellRatio >= 0.8 && buySellRatio <= 1.2) score += 25;
  else if (buySellRatio > 1.5 || buySellRatio < 0.67) score -= 10;

  return Math.min(Math.max(score, 0), 100);
};