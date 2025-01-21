import { PerformanceMetrics } from "./PerformanceMetrics";
import { PortfolioChart } from "./PortfolioChart";
import { AssetAllocation } from "./AssetAllocation";

const PortfolioTracker = () => {
  return (
    <div className="space-y-6">
      <PerformanceMetrics />
      <div className="grid gap-8 md:grid-cols-2">
        <PortfolioChart />
        <AssetAllocation />
      </div>
    </div>
  );
};

export default PortfolioTracker;