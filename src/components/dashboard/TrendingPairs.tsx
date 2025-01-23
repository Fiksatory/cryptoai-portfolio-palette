import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getNewPairs } from "@/services/dexscreener";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

export const TrendingPairs = () => {
  const { toast } = useToast();
  const { data: trendingTokens, isLoading: isLoadingPairs } = useQuery({
    queryKey: ['trendingPairs'],
    queryFn: async () => {
      const pairs = await getNewPairs();
      console.log('Raw pairs data:', pairs); // Debug log

      // Map Birdeye data to our format
      const tokens = pairs
        .map(pair => ({
          name: pair.symbol,
          symbol: pair.symbol,
          priceUsd: pair.price.toString(),
          priceChange: {
            h24: pair.priceChange24h || 0
          },
          volume: {
            h24: pair.volume24h || 0
          },
          pairCreatedAt: new Date(), // Birdeye doesn't provide creation time
          chainId: "solana",
          dexId: "raydium", // Default to Raydium as it's the main Solana DEX
          txns: {
            h24: {
              buys: pair.txns24h || 0,
              sells: pair.txns24h || 0
            }
          }
        }))
        .slice(0, 10);
      
      console.log('Processed tokens:', tokens);
      return tokens;
    },
    refetchInterval: 30000,
    meta: {
      onError: () => {
        toast({
          title: "Error fetching pairs",
          description: "Failed to fetch trending pairs. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    }
    return `$${(volume / 1000).toFixed(1)}K`;
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice < 0.0001) {
      return numPrice.toExponential(4);
    }
    return numPrice.toFixed(6);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            Trending Pairs
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Auto-refreshes every 30 seconds</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {isLoadingPairs ? (
          <div className="text-sm text-gray-400 animate-pulse">Fetching latest pairs...</div>
        ) : !trendingTokens || trendingTokens.length === 0 ? (
          <div className="text-sm text-gray-400">No trending pairs found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TOKEN</TableHead>
                <TableHead>PRICE</TableHead>
                <TableHead>AGE</TableHead>
                <TableHead>BUYS</TableHead>
                <TableHead>SELLS</TableHead>
                <TableHead>VOLUME</TableHead>
                <TableHead>24H</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trendingTokens.map((token, index) => {
                const timeDiff = Math.round((Date.now() - token.pairCreatedAt.getTime()) / (1000 * 60));
                const timeDisplay = timeDiff < 60 
                  ? `${timeDiff}m ago`
                  : `${Math.round(timeDiff / 60)}h ${timeDiff % 60}m`;

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{token.symbol}</span>
                        {token.priceChange.h24 > 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>${formatPrice(token.priceUsd)}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {timeDisplay}
                    </TableCell>
                    <TableCell>{token.txns?.h24?.buys || 0}</TableCell>
                    <TableCell>{token.txns?.h24?.sells || 0}</TableCell>
                    <TableCell>{formatVolume(token.volume.h24)}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          token.priceChange.h24 > 0
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }
                      >
                        {token.priceChange.h24.toFixed(2)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};