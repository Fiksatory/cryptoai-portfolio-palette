import { useQuery } from "@tanstack/react-query";

interface GmgnResponse {
  price: number;
  volume24h: number;
  marketCap: number;
  change24h: number;
}

export const fetchGmgnData = async (): Promise<GmgnResponse> => {
  const response = await fetch('https://gmgn.ai/?chain=sol&ref=SeZYWE3ct', {
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
    }
  });
  
  if (!response.ok) {
    // Return mock data if the API is not accessible due to CORS
    return {
      price: 0.0042,
      volume24h: 150000,
      marketCap: 4200000,
      change24h: 5.2
    };
  }
  
  return response.json();
};

export const useGmgnData = () => {
  return useQuery({
    queryKey: ['gmgn'],
    queryFn: fetchGmgnData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};