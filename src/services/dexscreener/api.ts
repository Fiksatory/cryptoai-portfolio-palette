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
      pairCreatedAt: new Date().toISOString(), // Add missing field
      baseToken: {
        address: "",
        name: "Mock Token",
        symbol: "MOCK"
      },
      quoteToken: {
        symbol: "SOL"
      },
      priceNative: "0.000145", // Add missing field
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
      chainId: "solana",
      dexId: "raydium",
      symbol: 'BONK',
      baseToken: {
        name: "Bonk",
        symbol: "BONK"
      },
      priceUsd: "0.000012",
      price: 0.000012,
      priceChange: {
        h24: 5.2
      },
      priceChange24h: 5.2,
      volume: {
        h24: 1500000
      },
      volume24h: 1500000,
      txns24h: 1200,
      pairCreatedAt: new Date().toISOString()
    },
    {
      chainId: "solana",
      dexId: "raydium",
      symbol: 'WIF',
      baseToken: {
        name: "Wif",
        symbol: "WIF"
      },
      priceUsd: "0.000145",
      price: 0.000145,
      priceChange: {
        h24: -2.1
      },
      priceChange24h: -2.1,
      volume: {
        h24: 890000
      },
      volume24h: 890000,
      txns24h: 950,
      pairCreatedAt: new Date().toISOString()
    },
    {
      chainId: "solana",
      dexId: "raydium",
      symbol: 'MYRO',
      baseToken: {
        name: "Myro",
        symbol: "MYRO"
      },
      priceUsd: "0.000078",
      price: 0.000078,
      priceChange: {
        h24: 12.4
      },
      priceChange24h: 12.4,
      volume: {
        h24: 2100000
      },
      volume24h: 2100000,
      txns24h: 1500,
      pairCreatedAt: new Date().toISOString()
    }
  ];
};