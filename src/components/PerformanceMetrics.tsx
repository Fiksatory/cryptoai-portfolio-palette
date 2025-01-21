import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

const metrics = [
  {
    label: "Total SOL Value",
    value: "245.89 SOL",
    change: "+22.5%",
    isPositive: true,
    icon: Activity
  },
  {
    label: "BONK/SOL",
    value: "0.000001234",
    change: "+15.3%",
    isPositive: true,
    icon: TrendingUp
  },
  {
    label: "MYRO/SOL",
    value: "0.000002345",
    change: "-5.2%",
    isPositive: false,
    icon: TrendingDown
  }
];

export const PerformanceMetrics = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.label} className="portfolio-card animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
              <h3 className="text-2xl font-bold mt-2 text-foreground">{metric.value}</h3>
              <p className={`text-sm mt-1 font-medium ${metric.isPositive ? "text-green-500" : "text-red-500"}`}>
                {metric.change}
              </p>
            </div>
            <metric.icon className="h-8 w-8 text-solana-primary" />
          </div>
        </Card>
      ))}
    </div>
  );
};