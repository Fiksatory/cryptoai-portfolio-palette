import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export const TrendingSection = () => {
  return (
    <Card className="bg-black/40 border-white/10 p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-neon-pink to-neon-violet rounded-xl flex items-center justify-center shadow-lg shadow-neon-pink/20">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold neon-glow">Trending Pairs</h2>
      </div>

      <div className="text-center py-8 text-gray-400">
        Coming soon...
      </div>
    </Card>
  );
};