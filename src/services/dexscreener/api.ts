const DEX_SCREENER_API = 'https://api.dexscreener.com/latest/dex';
const TOKEN_PROFILES_API = 'https://api.dexscreener.com/token-profiles/latest/v1';

export const searchTokens = async (query: string) => {
  const response = await fetch(`${DEX_SCREENER_API}/search/?q=${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch token data');
  }
  return response.json();
};

export const getNewPairs = async () => {
  // Using the /pairs endpoint with a limit parameter
  const response = await fetch(`${DEX_SCREENER_API}/pairs?limit=50`);
  if (!response.ok) {
    throw new Error('Failed to fetch trending pairs');
  }
  const data = await response.json();
  return data.pairs || [];
};

export const getLatestTokenProfiles = async () => {
  const response = await fetch(TOKEN_PROFILES_API, {
    method: 'GET',
    headers: {},
  });
  if (!response.ok) {
    throw new Error('Failed to fetch token profiles');
  }
  const data = await response.json();
  return data.profiles || [];
};