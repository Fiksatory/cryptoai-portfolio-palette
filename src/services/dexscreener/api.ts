import type { DexScreenerToken, DexScreenerPair, TokenProfile } from './types';

const DEX_SCREENER_API = 'https://api.dexscreener.com/latest/dex';
const TOKEN_PROFILES_API = 'https://api.dexscreener.com/token-profiles/latest/v1';

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

export const getLatestTokenProfiles = async (): Promise<TokenProfile[]> => {
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