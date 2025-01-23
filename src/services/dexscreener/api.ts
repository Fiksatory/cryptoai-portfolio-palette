const DEX_SCREENER_API = 'https://api.dexscreener.com/latest/dex';
const BIRDEYE_API = 'https://public-api.birdeye.so/defi';
const BIRDEYE_API_KEY = '61e77a7d405041a28bef84c95ea343e6';

export const searchTokens = async (query: string) => {
  const response = await fetch(`${DEX_SCREENER_API}/search?q=${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch token data');
  }
  return response.json();
};

export const getNewPairs = async () => {
  const response = await fetch(`${BIRDEYE_API}/token_trending`, {
    headers: {
      'X-API-KEY': BIRDEYE_API_KEY
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch trending pairs');
  }
  const data = await response.json();
  return data.data || [];
};