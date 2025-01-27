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