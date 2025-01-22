import type { DexScreenerPair, TokenAnalysis } from './types';

export const analyzePairData = (data: { pairs: DexScreenerPair[] }): TokenAnalysis => {
  if (!data?.pairs?.length) {
    return {
      summary: "No data available",
      metrics: {
        marketCap: 0,
        volume24h: 0,
        buySellRatio: 0,
        healthScore: 0
      },
      marketStatus: "Unknown",
      riskLevel: "High",
      socialLinks: {}
    };
  }

  const pair = data.pairs[0];
  const volume24h = pair.volume?.h24 || 0;
  const marketCap = pair.fdv || 0;
  const buySellRatio = pair.txns?.h24?.buys / (pair.txns?.h24?.sells || 1);
  
  // Calculate health score based on various metrics
  const healthScore = Math.min(100, Math.round(
    (marketCap > 1000000 ? 30 : 10) +
    (volume24h > 100000 ? 30 : 10) +
    (buySellRatio > 1 ? 20 : 5) +
    (pair.liquidity?.usd > 50000 ? 20 : 5)
  ));

  return {
    summary: `${pair.baseToken.symbol} shows ${healthScore > 50 ? 'positive' : 'concerning'} market metrics`,
    metrics: {
      marketCap,
      volume24h,
      buySellRatio,
      healthScore
    },
    marketStatus: healthScore > 70 ? "Healthy" : healthScore > 40 ? "Neutral" : "Risky",
    riskLevel: healthScore > 70 ? "Low" : healthScore > 40 ? "Medium" : "High",
    socialLinks: pair.links || {}
  };
};