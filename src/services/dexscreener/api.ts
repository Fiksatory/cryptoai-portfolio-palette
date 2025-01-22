import type { DexScreenerToken, DexScreenerPair } from './types';

const DEX_SCREENER_API = 'https://api.dexscreener.com/latest/dex';

export const searchTokens = async (query: string): Promise<DexScreenerToken> => {
  const response = await fetch(`${DEX_SCREENER_API}/search/?q=${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch token data');
  }
  return response.json();
};

export const getNewPairs = async (): Promise<DexScreenerPair[]> => {
  const response = await fetch(`${DEX_SCREENER_API}/pairs/new`);
  if (!response.ok) {
    throw new Error('Failed to fetch new pairs');
  }
  const data = await response.json();
  return data.pairs || [];
};