import { useQuery } from "@tanstack/react-query";

interface GmgnResponse {
  price: number;
  volume24h: number;
  marketCap: number;
  change24h: number;
}

const MOCK_GMGN_DATA: GmgnResponse = {
  price: 0.0042,
  volume24h: 150000,
  marketCap: 4200000,
  change24h: 5.2
};

const fetchGmgnData = async (): Promise<GmgnResponse> => {
  try {
    console.log('Fetching GMGN data...');
    const response = await fetch('https://gmgn.ai/?chain=sol&ref=SeZYWE3ct', {
      mode: 'no-cors',
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin
      }
    });
    
    // When using no-cors, we can't access the response
    // So we'll use mock data until the CORS issue is resolved
    console.log('Using mock GMGN data due to CORS restrictions');
    return MOCK_GMGN_DATA;
  } catch (error) {
    console.log('Error fetching GMGN data, returning mock data:', error);
    return MOCK_GMGN_DATA;
  }
};

export const useGmgnData = () => {
  return useQuery({
    queryKey: ['gmgn'],
    queryFn: fetchGmgnData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};