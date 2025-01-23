import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
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

export const TrendingSection = () => {
  const { toast } = useToast();
  const { data: trendingTokens, isLoading } = useQuery({
    queryKey: ['trendingPairs'],
    queryFn: getNewPairs,
    refetchInterval: 30000,
    meta: {
      onError: () => {
        toast({
          title: "Error fetching pairs",
          description: "Failed to fetch trending pairs. Using mock data.",
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
    <Card className="bg-black/40 border-white/10 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-pink to-neon-violet rounded-xl flex items-center justify-center shadow-lg shadow-neon-pink/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold neon-glow">Trending Pairs</h2>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="bg-neon-violet/20">
                Auto-updates every 30s
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Data refreshes automatically</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-400 animate-pulse">
          Loading trending pairs...
        </div>
      ) : !trendingTokens || trendingTokens.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No trending pairs found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead>Token</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>24h Change</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Transactions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trendingTokens.map((token, index) => (
                <TableRow key={index} className="border-white/10">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{token.symbol}</span>
                      {parseFloat(token.priceChange24h) > 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${formatPrice(token.price.toString())}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        parseFloat(token.priceChange24h) > 0
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }
                    >
                      {parseFloat(token.priceChange24h).toFixed(2)}%
                    </Badge>
                  </TableCell>
                  <TableCell>{formatVolume(token.volume24h)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {token.txns24h}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};