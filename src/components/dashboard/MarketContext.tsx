import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

interface MarketContextProps {
  tokenData: any;
}

export const MarketContext = ({ tokenData }: MarketContextProps) => {
  if (!tokenData) return null;

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-black/40 border-white/10 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-4 h-4" />
        <h3 className="text-sm font-medium">Market Context</h3>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-400">Network</p>
          <p className="font-medium">{tokenData.network}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">DEX</p>
          <p className="font-medium">{tokenData.dexId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Pair Created</p>
          <p className="font-medium">{formatDate(tokenData.pairCreatedAt)}</p>
        </div>
      </div>
    </Card>
  );
};