const DEX_SCREENER_API = 'https://api.dexscreener.com/latest/dex';
const BIRDEYE_API = 'https://public-api.birdeye.so/defi';
const BIRDEYE_API_KEY = 'c9c53395f0a44c0ba443bd1b1f4a5f39';

export const searchTokens = async (query: string) => {
  // Return mock data instead of making API call
  return {
    pairs: [{
      chainId: "solana",
      dexId: "raydium",
      url: "",
      pairAddress: "",
      baseToken: {
        address: "",
        name: "Mock Token",
        symbol: "MOCK"
      },
      quoteToken: {
        symbol: "SOL"
      },
      priceUsd: "0.000145",
      priceChange: {
        h24: 5.2
      },
      volume: {
        h24: 1500000
      },
      txns: {
        h24: {
          buys: 1200,
          sells: 800
        }
      }
    }]
  };
};

export const getNewPairs = async () => {
  console.log('Using mock data instead of API call');
  return getMockTrendingPairs();
};

const getMockTrendingPairs = () => {
  return [
    {
      symbol: 'BONK',
      price: 0.000012,
      priceChange24h: 5.2,
      volume24h: 1500000,
      txns24h: 1200
    },
    {
      symbol: 'WIF',
      price: 0.000145,
      priceChange24h: -2.1,
      volume24h: 890000,
      txns24h: 950
    },
    {
      symbol: 'MYRO',
      price: 0.000078,
      priceChange24h: 12.4,
      volume24h: 2100000,
      txns24h: 1500
    }
  ];
};