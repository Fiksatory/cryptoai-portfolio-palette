import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { PortfolioChart } from "@/components/PortfolioChart";
import { AssetAllocation } from "@/components/AssetAllocation";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Solana Memecoin Tracker</h1>
        <p className="text-muted-foreground">Track your Solana memecoin portfolio in real-time</p>
      </div>
      
      <div className="space-y-8">
        <PerformanceMetrics />
        
        <div className="grid gap-8 md:grid-cols-2">
          <PortfolioChart />
          <AssetAllocation />
        </div>
      </div>
    </div>
  );
};

export default Index;