import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Radio } from "lucide-react";
import { useGmgnData } from "@/services/gmgn";

interface MarketMetricsProps {
  tokenData: any;
}

export const MarketMetrics = ({ tokenData }: MarketMetricsProps) => {
  const { data: gmgnData, isLoading } = useGmgnData();

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          AI Market Pulse
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Market State:</span>
            <Badge variant="secondary">
              {tokenData?.marketStatus || "WAITING FOR ANALYSIS"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">AI Confidence:</span>
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500" 
                style={{ width: `${tokenData?.metrics?.healthScore || 0}%` }}
              />
            </div>
          </div>
          {gmgnData && (
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-400">GMGN Price:</span>
              <Badge className="bg-neon-pink/20 text-neon-pink">
                ${gmgnData.price.toFixed(4)}
              </Badge>
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
          <Radio className="w-4 h-4" />
          Manipulation Radar
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Risk Level:</span>
            <Badge className="bg-indigo-500/20 text-indigo-300">
              {tokenData?.riskLevel || "UNKNOWN"}
            </Badge>
          </div>
          <div className="flex gap-2">
            {tokenData?.metrics?.buySellRatio > 1.2 && (
              <Badge className="bg-blue-500/20 text-blue-300">High Buy Pressure</Badge>
            )}
            {tokenData?.metrics?.buySellRatio < 0.8 && (
              <Badge className="bg-red-500/20 text-red-300">High Sell Pressure</Badge>
            )}
          </div>
          {gmgnData && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">24h Volume:</span>
                <Badge className="bg-violet-500/20 text-violet-300">
                  ${gmgnData.volume24h.toLocaleString()}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">24h Change:</span>
                <Badge 
                  className={gmgnData.change24h >= 0 ? 
                    "bg-green-500/20 text-green-300" : 
                    "bg-red-500/20 text-red-300"
                  }
                >
                  {gmgnData.change24h.toFixed(2)}%
                </Badge>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};