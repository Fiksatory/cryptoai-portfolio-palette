export const analyzePairData = (data: any) => {
  if (!data || !data.pairs || data.pairs.length === 0) {
    return null;
  }

  const pair = data.pairs[0];
  
  return {
    name: pair.baseToken.name,
    symbol: pair.baseToken.symbol,
    price: pair.priceUsd,
    priceChange: {
      h1: pair.priceChange.h1,
      h24: pair.priceChange.h24,
      d7: pair.priceChange.d7,
    },
    volume: {
      h24: pair.volume.h24,
      d7: pair.volume.d7,
    },
    liquidity: pair.liquidity.usd,
    marketCap: pair.fdv,
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