import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Brain } from "lucide-react";

interface MarketContextProps {
  tokenData: any;
}

export const MarketContext = ({ tokenData }: MarketContextProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
          <LineChart className="w-4 h-4" />
          Market Activity
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">24h Volume:</span>
            <span className="text-green-400">
              ${tokenData?.metrics?.volume24h?.toLocaleString() || "0"}
            </span>
          </div>
          <div className="flex gap-2">
            {tokenData?.metrics?.marketCap > 0 && (
              <Badge className="bg-orange-500">
                MCap: ${tokenData.metrics.marketCap.toLocaleString()}
              </Badge>
            )}
          </div>
        </div>
      </Card>

      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
          <Brain className="w-4 h-4" />
          Market Context
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Context:</span>
            <span>{tokenData?.marketContext || "Waiting for analysis..."}</span>
          </div>
          {tokenData && (
            <div className="flex gap-2">
              <Badge className="bg-indigo-500/20 text-indigo-300">
                {tokenData.summary}
              </Badge>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};