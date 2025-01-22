import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getNewPairs } from "@/services/dexscreener";
import type { TrendingToken } from "@/services/dexscreener";

export const TrendingPairs = () => {
  const { data: trendingTokens, isLoading } = useQuery({
    queryKey: ['newPairs'],
    queryFn: async () => {
      const pairs = await getNewPairs();
      
      // Filter for Solana pairs and sort by creation time
      const tokens = pairs
        .filter(pair => pair.chainId === "solana")
        .map(pair => ({
          name: pair.baseToken.name,
          symbol: pair.baseToken.symbol,
          priceUsd: pair.priceUsd,
          priceChange: pair.priceChange,
          volume: pair.volume,
          pairCreatedAt: new Date(pair.pairCreatedAt),
          chainId: pair.chainId,
          dexId: pair.dexId
        }))
        .sort((a, b) => b.pairCreatedAt.getTime() - a.pairCreatedAt.getTime())
        .slice(0, 10); // Get only the 10 most recent pairs
      
      return tokens;
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
          <TrendingUp className="w-4 h-4" />
          Latest Pairs
        </h3>
        
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading new pairs...</div>
        ) : (
          <div className="space-y-4">
            {trendingTokens?.map((token, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{token.symbol}</span>
                    {token.priceChange.h24 > 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {Math.round((Date.now() - token.pairCreatedAt.getTime()) / (1000 * 60))}m ago
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">${parseFloat(token.priceUsd).toFixed(6)}</p>
                </div>
                <div className="space-y-2">
                  <Badge 
                    className={
                      token.priceChange.h24 > 0
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }
                  >
                    {token.priceChange.h24.toFixed(2)}%
                  </Badge>
                  <p className="text-xs text-gray-400 text-right">
                    Vol: ${(token.volume.h24 / 1000000).toFixed(2)}M
                  </p>
                </div>
              </div>
            ))}
            
            {(!trendingTokens || trendingTokens.length === 0) && (
              <div className="text-sm text-gray-400">
                No new pairs found
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};