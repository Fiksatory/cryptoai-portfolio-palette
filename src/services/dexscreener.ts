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
      sentiment: "neutral"
    };
  }

  const solanaPairs = data.pairs.filter(pair => pair.chainId === "solana");
  if (solanaPairs.length === 0) {
    return {
      message: "No Solana trading pairs found for this token.",
      sentiment: "neutral"
    };
  }

  const mainPair = solanaPairs[0];
  const priceChange24h = mainPair.priceChange?.h24 || 0;
  const volume24h = mainPair.volume?.h24 || 0;
  const liquidity = mainPair.liquidity?.usd || 0;
  const buySellRatio = mainPair.txns?.h24 ? 
    mainPair.txns.h24.buys / (mainPair.txns.h24.sells || 1) : 0;

  let sentiment = "neutral";
  let analysis = [];

  // Price analysis
  if (priceChange24h > 5) {
    sentiment = "bullish";
    analysis.push("Strong price increase in the last 24h");
  } else if (priceChange24h < -5) {
    sentiment = "bearish";
    analysis.push("Significant price decrease in the last 24h");
  }

  // Volume analysis
  if (volume24h > 100000) {
    analysis.push("High trading volume indicates strong market activity");
  } else if (volume24h < 10000) {
    analysis.push("Low trading volume suggests limited market activity");
  }

  // Liquidity analysis
  if (liquidity > 500000) {
    analysis.push("Good liquidity levels");
  } else if (liquidity < 50000) {
    analysis.push("Low liquidity - trading might be difficult");
  }

  // Buy/Sell ratio analysis
  if (buySellRatio > 1.5) {
    analysis.push("More buyers than sellers in the last 24h");
    if (sentiment !== "bearish") sentiment = "bullish";
  } else if (buySellRatio < 0.67) {
    analysis.push("More sellers than buyers in the last 24h");
    if (sentiment !== "bullish") sentiment = "bearish";
  }

  return {
    message: analysis.join(". "),
    sentiment,
    metrics: {
      priceChange24h,
      volume24h,
      liquidity,
      buySellRatio
    }
  };
};