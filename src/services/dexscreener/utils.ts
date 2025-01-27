export const analyzePairData = (data: any) => {
  if (!data || !data.pairs || data.pairs.length === 0) {
    return null;
  }

  const pair = data.pairs[0];
  const volume24h = parseFloat(pair.volume?.h24 || '0');
  const marketCap = parseFloat(pair.fdv || '0');
  const buySellRatio = (pair.txns?.h24?.buys || 0) / (pair.txns?.h24?.sells || 1);
  
  return {
    name: pair.baseToken.name,
    symbol: pair.baseToken.symbol,
    price: pair.priceUsd,
    priceChange: {
      h1: pair.priceChange?.h1,
      h24: pair.priceChange?.h24,
      d7: pair.priceChange?.d7,
    },
    volume: {
      h24: volume24h,
      d7: pair.volume?.d7,
    },
    liquidity: pair.liquidity?.usd,
    marketCap: marketCap,
    metrics: {
      marketCap: marketCap,
      volume24h: volume24h,
      buySellRatio: buySellRatio,
      healthScore: calculateHealthScore(marketCap, volume24h, buySellRatio)
    },
    summary: generateSummary(pair),
    marketStatus: determineMarketStatus(pair),
    riskLevel: calculateRiskLevel(marketCap, volume24h, buySellRatio),
    socialLinks: {
      website: pair.baseToken.address,
      twitter: `https://twitter.com/search?q=${pair.baseToken.symbol}`,
      telegram: `https://t.me/s/${pair.baseToken.symbol}`,
    },
    pairCreatedAt: pair.pairCreatedAt,
    dexId: pair.dexId,
    network: pair.chainId,
  };
};

function calculateHealthScore(marketCap: number, volume24h: number, buySellRatio: number): number {
  let score = 50; // Base score

  // Market cap contribution (max 20 points)
  if (marketCap > 1000000) score += 20;
  else if (marketCap > 500000) score += 10;
  else if (marketCap > 100000) score += 5;

  // Volume contribution (max 20 points)
  const volumeRatio = volume24h / marketCap;
  if (volumeRatio > 0.2) score += 20;
  else if (volumeRatio > 0.1) score += 10;
  else if (volumeRatio > 0.05) score += 5;

  // Buy/Sell ratio contribution (max 10 points)
  if (buySellRatio > 1.5) score += 10;
  else if (buySellRatio > 1.2) score += 5;
  else if (buySellRatio < 0.8) score -= 5;
  else if (buySellRatio < 0.5) score -= 10;

  return Math.min(Math.max(score, 0), 100);
}

function determineMarketStatus(pair: any): string {
  const priceChange24h = parseFloat(pair.priceChange?.h24 || '0');
  const volume24h = parseFloat(pair.volume?.h24 || '0');
  
  if (priceChange24h > 10 && volume24h > 100000) return 'Bullish';
  if (priceChange24h < -10 && volume24h > 100000) return 'Bearish';
  if (volume24h < 10000) return 'Low Activity';
  return 'Neutral';
}

function calculateRiskLevel(marketCap: number, volume24h: number, buySellRatio: number): string {
  let riskScore = 0;
  
  // Market cap risk
  if (marketCap < 100000) riskScore += 3;
  else if (marketCap < 500000) riskScore += 2;
  else if (marketCap < 1000000) riskScore += 1;
  
  // Volume risk
  const volumeRatio = volume24h / marketCap;
  if (volumeRatio < 0.05) riskScore += 2;
  else if (volumeRatio > 0.5) riskScore += 1;
  
  // Buy/Sell ratio risk
  if (buySellRatio < 0.5 || buySellRatio > 2) riskScore += 2;
  
  if (riskScore >= 6) return 'High';
  if (riskScore >= 3) return 'Medium';
  return 'Low';
}

function generateSummary(pair: any): string {
  const priceChange24h = parseFloat(pair.priceChange?.h24 || '0');
  const volume24h = parseFloat(pair.volume?.h24 || '0');
  const marketCap = parseFloat(pair.fdv || '0');
  
  let summary = `${pair.baseToken.symbol} is `;
  
  if (priceChange24h > 0) {
    summary += `up ${priceChange24h.toFixed(2)}% in the last 24 hours `;
  } else {
    summary += `down ${Math.abs(priceChange24h).toFixed(2)}% in the last 24 hours `;
  }
  
  summary += `with a market cap of $${(marketCap / 1000000).toFixed(2)}M `;
  summary += `and 24h volume of $${(volume24h / 1000).toFixed(2)}K.`;
  
  return summary;
}