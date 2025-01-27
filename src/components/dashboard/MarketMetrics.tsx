import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, LineChart, Wallet2, Activity } from "lucide-react";

interface MarketMetricsProps {
  tokenData: any;
}

export const MarketMetrics = ({ tokenData }: MarketMetricsProps) => {
  if (!tokenData) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  };

  const metrics = [
    {
      label: "Price",
      value: `$${Number(tokenData.price).toFixed(8)}`,
      change: tokenData.priceChange.h24,
      icon: DollarSign
    },
    {
      label: "24h Volume",
      value: `$${formatNumber(tokenData.volume.h24)}`,
      change: ((tokenData.volume.h24 - tokenData.volume.d7/7) / (tokenData.volume.d7/7) * 100).toFixed(2),
      icon: LineChart
    },
    {
      label: "Market Cap",
      value: `$${formatNumber(tokenData.marketCap)}`,
      change: tokenData.priceChange.h24,
      icon: Activity
    },
    {
      label: "Liquidity",
      value: `$${formatNumber(tokenData.liquidity)}`,
      change: "0",
      icon: Wallet2
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const isPositive = Number(metric.change) >= 0;

        return (
          <Card key={index} className="bg-black/40 border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-4 h-4 text-gray-400" />
              <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                {Math.abs(Number(metric.change))}%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">{metric.label}</p>
              <p className="text-lg font-semibold">{metric.value}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};