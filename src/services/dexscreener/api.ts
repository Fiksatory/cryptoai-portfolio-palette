export const searchTokens = async (contractAddress: string) => {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/search/?q=${contractAddress}`);
    if (!response.ok) {
      throw new Error('Failed to fetch token data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
};

export const getNewPairs = async () => {
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/raydium');
    if (!response.ok) {
      throw new Error('Failed to fetch new pairs');
    }
    const data = await response.json();
    return data.pairs || [];
  } catch (error) {
    console.error('Error fetching new pairs:', error);
    throw error;
  }
};