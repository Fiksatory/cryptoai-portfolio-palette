import { useQuery } from "@tanstack/react-query";

interface GmgnResponse {
  price: number;
  volume24h: number;
  marketCap: number;
  change24h: number;
}

export const fetchGmgnData = async (): Promise<GmgnResponse> => {
  const response = await fetch('https://gmgn.ai/?chain=sol&ref=SeZYWE3ct');
  if (!response.ok) {
    throw new Error('Failed to fetch GMGN data');
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