const DEX_SCREENER_API = 'https://api.dexscreener.com/latest/dex';
const BIRDEYE_API = 'https://public-api.birdeye.so/defi';
const BIRDEYE_API_KEY = 'c9c53395f0a44c0ba443bd1b1f4a5f39'; // Updated API key

export const searchTokens = async (query: string) => {
  const response = await fetch(`${DEX_SCREENER_API}/search?q=${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch token data');
  }
  return response.json();
};

export const getNewPairs = async () => {
  try {
    console.log('Fetching trending pairs from Birdeye...');
    const response = await fetch(`${BIRDEYE_API}/token_trending`, {
      headers: {
        'X-API-KEY': BIRDEYE_API_KEY,
        'Accept': 'application/json',
        'Origin': window.location.origin
      }
    });
    
    if (!response.ok) {
      console.log('Birdeye API error, returning mock data');
      return getMockTrendingPairs();
    }
    
    const data = await response.json();
    return data.data || getMockTrendingPairs();
  } catch (error) {
    console.log('Error fetching trending pairs, returning mock data:', error);
    return getMockTrendingPairs();
  }
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