import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getNewPairs } from "@/services/dexscreener";
import type { TrendingToken } from "@/services/dexscreener";

export const PatternAnalysis = () => {
  const { data: trendingTokens, isLoading } = useQuery({
    queryKey: ['patternAnalysis'],
    queryFn: async () => {
      const pairs = await getNewPairs();
      
      // Map the data to our TrendingToken format
      const tokens = pairs
        .map(pair => ({
          name: pair.baseToken?.name || pair.symbol,
          symbol: pair.baseToken?.symbol || pair.symbol,
          priceUsd: pair.priceUsd || pair.price.toString(),
          priceChange: {
            h24: pair.priceChange?.h24 || pair.priceChange24h
          },
          volume: {
            h24: pair.volume?.h24 || pair.volume24h
          },
          pairCreatedAt: new Date(),
          chainId: pair.chainId,
          dexId: pair.dexId
        }))
        .sort((a, b) => Math.abs(b.priceChange.h24) - Math.abs(a.priceChange.h24))
        .slice(0, 10);
      
      return tokens;
    },
    refetchInterval: 30000
  });

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
          <TrendingUp className="w-4 h-4" />
          Most Volatile Pairs
        </h3>
        
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading pattern analysis...</div>
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
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                    >
                      Rank #{index + 1}
                    </Badge>
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
                No patterns detected
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};