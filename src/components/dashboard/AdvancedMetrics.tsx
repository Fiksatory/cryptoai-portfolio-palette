import { Card } from "@/components/ui/card";
import { Brain, Users, Twitter, Trophy, Wallet2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AdvancedMetricsProps {
  tokenData: any;
}

export const AdvancedMetrics = ({ tokenData }: AdvancedMetricsProps) => {
  // Simulated metrics data (replace with real data when available)
  const metrics = {
    smartWallets: 1234,
    kols: 45,
    twitterMentions: 5678,
    aiScore: 85
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-black/40 border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet2 className="w-4 h-4 text-neon-violet" />
            <h3 className="text-sm font-medium">Smart Wallets</h3>
          </div>
          <span className="text-xl font-bold text-neon-pink">
            {metrics.smartWallets.toLocaleString()}
          </span>
        </div>
      </Card>

      <Card className="bg-black/40 border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-neon-violet" />
            <h3 className="text-sm font-medium">KOLs</h3>
          </div>
          <span className="text-xl font-bold text-neon-pink">
            {metrics.kols}
          </span>
        </div>
      </Card>

      <Card className="bg-black/40 border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Twitter className="w-4 h-4 text-neon-violet" />
            <h3 className="text-sm font-medium">Twitter Mentions</h3>
          </div>
          <span className="text-xl font-bold text-neon-pink">
            {metrics.twitterMentions.toLocaleString()}
          </span>
        </div>
      </Card>

      <Card className="bg-black/40 border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-neon-violet" />
            <h3 className="text-sm font-medium">AI Score</h3>
          </div>
          <span className="text-xl font-bold text-neon-pink">
            {metrics.aiScore}/100
          </span>
        </div>
        <Progress value={metrics.aiScore} className="h-2 bg-black/20" />
      </Card>
    </div>
  );
};