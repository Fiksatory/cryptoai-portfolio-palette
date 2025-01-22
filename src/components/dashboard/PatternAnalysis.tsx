import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchTokens } from "@/services/dexscreener";

interface TrendingToken {
  name: string;
  symbol: string;
  priceUsd: string;
  priceChange: {
    h24: number;
  };
  volume: {
    h24: number;
  };
}

export const PatternAnalysis = () => {
  const { data: trendingTokens, isLoading } = useQuery({
    queryKey: ['trendingTokens'],
    queryFn: async () => {
      // For now, we'll fetch some known tokens as an example
      const tokens = ['BONK', 'WIF', 'MYRO'];
      const results = await Promise.all(
        tokens.map(async (token) => {
          const data = await searchTokens(token);
          const pair = data.pairs?.find(p => p.chainId === "solana");
          if (!pair) return null;
          return {
            name: pair.baseToken.name,
            symbol: pair.baseToken.symbol,
            priceUsd: pair.priceUsd,
            priceChange: pair.priceChange,
            volume: pair.volume
          };
        })
      );
      return results.filter((token): token is TrendingToken => token !== null);
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
          <TrendingUp className="w-4 h-4" />
          Trending Tokens
        </h3>
        
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading trending tokens...</div>
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
                No trending tokens found
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};