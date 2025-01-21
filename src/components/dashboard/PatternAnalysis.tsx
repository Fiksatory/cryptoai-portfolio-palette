import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchTokens } from "@/services/dexscreener";

interface Pattern {
  name: string;
  description: string;
  confidence: number;
  type: "bullish" | "bearish" | "neutral";
}

const identifyPatterns = (priceData: any): Pattern[] => {
  const patterns: Pattern[] = [];
  
  // Basic pattern identification logic
  if (priceData?.priceChange?.h24 > 5) {
    patterns.push({
      name: "Breakout",
      description: "Strong upward price movement detected",
      confidence: 75,
      type: "bullish"
    });
  }
  
  if (priceData?.volume?.h24 > 1000000) {
    patterns.push({
      name: "Volume Surge",
      description: "Significant increase in trading volume",
      confidence: 85,
      type: "neutral"
    });
  }

  return patterns;
};

export const PatternAnalysis = () => {
  const { data: trendingPairs, isLoading } = useQuery({
    queryKey: ['trendingPairs'],
    queryFn: async () => {
      // For demo, we'll analyze BONK token
      const data = await searchTokens("BONK");
      return data.pairs?.filter(pair => pair.chainId === "solana") || [];
    }
  });

  const patterns = trendingPairs?.[0] ? identifyPatterns(trendingPairs[0]) : [];

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
          <TrendingUp className="w-4 h-4" />
          Market Patterns
        </h3>
        
        {isLoading ? (
          <div className="text-sm text-gray-400">Analyzing patterns...</div>
        ) : (
          <div className="space-y-4">
            {patterns.map((pattern, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{pattern.name}</span>
                    {pattern.type === "bullish" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : pattern.type === "bearish" ? (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    ) : null}
                  </div>
                  <p className="text-xs text-gray-400">{pattern.description}</p>
                </div>
                <Badge 
                  className={
                    pattern.type === "bullish" 
                      ? "bg-green-500/20 text-green-300"
                      : pattern.type === "bearish"
                      ? "bg-red-500/20 text-red-300"
                      : "bg-blue-500/20 text-blue-300"
                  }
                >
                  {pattern.confidence}% confidence
                </Badge>
              </div>
            ))}
            
            {patterns.length === 0 && (
              <div className="text-sm text-gray-400">
                No significant patterns detected
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};