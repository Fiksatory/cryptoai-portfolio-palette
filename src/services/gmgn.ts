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
    const response = await fetch('https://gmgn.ai/?chain=sol&ref=SeZYWE3ct', {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.log('GMGN API error, returning mock data');
      return MOCK_GMGN_DATA;
    }
    
    return response.json();
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