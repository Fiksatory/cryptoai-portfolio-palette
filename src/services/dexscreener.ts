const DEX_SCREENER_API = 'https://api.dexscreener.com/latest/dex';

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

export const getTokenData = async (tokenAddress: string): Promise<DexScreenerToken> => {
  const response = await fetch(`${DEX_SCREENER_API}/tokens/${tokenAddress}`);
  if (!response.ok) {
    throw new Error('Failed to fetch token data');
  }
  return response.json();
};

export const analyzePairData = (data: DexScreenerToken) => {
  if (!data.pairs || data.pairs.length === 0) {
    return {
      message: "No trading pairs found for this token.",
      sentiment: "neutral",
      metrics: {
        priceChange24h: 0,
        volume24h: 0,
        liquidity: 0,
        buySellRatio: 0,
        totalTransactions: 0,
        healthScore: 0,
        marketCap: 0
      }
    };
  }

  const solanaPairs = data.pairs.filter(pair => pair.chainId === "solana");
  if (solanaPairs.length === 0) {
    return {
      message: "No Solana trading pairs found for this token.",
      sentiment: "neutral",
      metrics: {
        priceChange24h: 0,
        volume24h: 0,
        liquidity: 0,
        buySellRatio: 0,
        totalTransactions: 0,
        healthScore: 0,
        marketCap: 0
      }
    };
  }

  const mainPair = solanaPairs[0];
  const priceChange24h = mainPair.priceChange?.h24 || 0;
  const volume24h = mainPair.volume?.h24 || 0;
  const liquidity = mainPair.liquidity?.usd || 0;
  const marketCap = mainPair.fdv || 0;
  const buySellRatio = mainPair.txns?.h24 ? 
    mainPair.txns.h24.buys / (mainPair.txns.h24.sells || 1) : 0;
  const totalTxs = mainPair.txns?.h24 ? 
    mainPair.txns.h24.buys + mainPair.txns.h24.sells : 0;

  let sentiment = "neutral";
  let analysis = [];
  let marketStatus = [];
  let riskLevel = "medium";

  // Price Movement Analysis
  if (priceChange24h > 20) {
    analysis.push("Token is experiencing significant bullish momentum with over 20% gains");
    sentiment = "very bullish";
  } else if (priceChange24h > 5) {
    analysis.push("Token shows positive price action with moderate gains");
    sentiment = "bullish";
  } else if (priceChange24h < -20) {
    analysis.push("Token is in a strong downtrend with significant losses");
    sentiment = "very bearish";
  } else if (priceChange24h < -5) {
    analysis.push("Token is experiencing downward pressure");
    sentiment = "bearish";
  } else {
    analysis.push("Price movement is relatively stable");
  }

  // Market Cap Analysis
  if (marketCap > 100000000) {
    analysis.push("Large market cap indicates established market presence");
    marketStatus.push("Large-cap token");
    riskLevel = "low";
  } else if (marketCap > 10000000) {
    analysis.push("Mid-sized market cap suggests growing adoption");
    marketStatus.push("Mid-cap token");
  } else if (marketCap > 1000000) {
    analysis.push("Small market cap indicates potential for growth but higher risk");
    marketStatus.push("Small-cap token");
    riskLevel = "high";
  } else {
    analysis.push("Micro market cap suggests very early stage or high-risk token");
    marketStatus.push("Micro-cap token");
    riskLevel = "very high";
  }

  // Volume Analysis
  if (volume24h > 1000000) {
    analysis.push("Extremely high trading volume indicates strong market interest");
    marketStatus.push("High market activity");
  } else if (volume24h > 100000) {
    analysis.push("Good trading volume suggests active market participation");
    marketStatus.push("Moderate market activity");
  } else if (volume24h < 10000) {
    analysis.push("Low trading volume indicates limited market activity");
    marketStatus.push("Low market activity");
    riskLevel = "high";
  }

  // Liquidity Analysis
  if (liquidity > 1000000) {
    analysis.push("Strong liquidity pool reduces trading impact");
    marketStatus.push("Deep liquidity");
    riskLevel = "low";
  } else if (liquidity > 100000) {
    analysis.push("Adequate liquidity for moderate trades");
    marketStatus.push("Moderate liquidity");
  } else {
    analysis.push("Limited liquidity may cause high price impact on trades");
    marketStatus.push("Shallow liquidity");
    riskLevel = "high";
  }

  // Trading Pattern Analysis
  if (totalTxs > 1000) {
    analysis.push("High transaction count indicates active trading community");
  }
  
  if (buySellRatio > 2) {
    analysis.push("Strong buying pressure with buy orders significantly outpacing sells");
    if (sentiment !== "very bearish") sentiment = "very bullish";
  } else if (buySellRatio > 1.5) {
    analysis.push("More buyers than sellers in the market");
    if (sentiment !== "bearish") sentiment = "bullish";
  } else if (buySellRatio < 0.5) {
    analysis.push("Heavy selling pressure with sell orders dominating");
    if (sentiment !== "very bullish") sentiment = "very bearish";
  } else if (buySellRatio < 0.67) {
    analysis.push("More sellers than buyers in the market");
    if (sentiment !== "bullish") sentiment = "bearish";
  }

  // Market Health Score (0-100)
  const healthScore = calculateHealthScore(volume24h, liquidity, buySellRatio, totalTxs, marketCap);

  return {
    message: analysis.join(". ") + ".\n\nMarket Status: " + marketStatus.join(", ") + ".\nRisk Level: " + riskLevel + "\nMarket Health Score: " + healthScore + "/100",
    sentiment,
    metrics: {
      priceChange24h,
      volume24h,
      liquidity,
      buySellRatio,
      healthScore,
      totalTransactions: totalTxs,
      marketCap
    }
  };
};

// Helper function to calculate market health score
const calculateHealthScore = (
  volume24h: number,
  liquidity: number,
  buySellRatio: number,
  totalTxs: number,
  marketCap: number
): number => {
  let score = 50; // Base score

  // Volume score (max 25 points)
  if (volume24h > 1000000) score += 25;
  else if (volume24h > 100000) score += 15;
  else if (volume24h > 10000) score += 5;

  // Liquidity score (max 25 points)
  if (liquidity > 1000000) score += 25;
  else if (liquidity > 100000) score += 15;
  else if (liquidity > 10000) score += 5;

  // Market Cap score (max 25 points)
  if (marketCap > 100000000) score += 25;
  else if (marketCap > 10000000) score += 15;
  else if (marketCap > 1000000) score += 5;

  // Buy/Sell ratio score (max 25 points)
  if (buySellRatio > 1.5 || buySellRatio < 0.67) score -= 10; // Extreme ratios might indicate manipulation
  else if (buySellRatio >= 0.8 && buySellRatio <= 1.2) score += 25; // Balanced trading

  // Transaction count score (max 25 points)
  if (totalTxs > 1000) score += 25;
  else if (totalTxs > 100) score += 15;
  else if (totalTxs > 10) score += 5;

  // Ensure score stays within 0-100 range
  return Math.min(Math.max(score, 0), 100);
};
