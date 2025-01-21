import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { PortfolioChart } from "@/components/PortfolioChart";
import { AssetAllocation } from "@/components/AssetAllocation";
import { ChatAssistant } from "@/components/ChatAssistant";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-solana-primary to-solana-secondary bg-clip-text text-transparent">
              Solana Memecoin Tracker
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your Solana memecoin portfolio in real-time
            </p>
          </div>
          
          <div className="space-y-8">
            <PerformanceMetrics />
            
            <div className="grid gap-8 md:grid-cols-2">
              <PortfolioChart />
              <AssetAllocation />
            </div>
          </div>
        </div>

        <ChatAssistant />
      </div>
    </div>
  );
};

export default Index;