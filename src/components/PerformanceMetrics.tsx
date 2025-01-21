import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

const metrics = [
  {
    label: "Total Value",
    value: "$45,230.89",
    change: "+12.5%",
    isPositive: true,
    icon: Activity
  },
  {
    label: "24h Change",
    value: "$1,230.45",
    change: "+2.3%",
    isPositive: true,
    icon: TrendingUp
  },
  {
    label: "7d Change",
    value: "-$450.12",
    change: "-1.2%",
    isPositive: false,
    icon: TrendingDown
  }
];

export const PerformanceMetrics = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
              <h3 className="text-2xl font-bold mt-2">{metric.value}</h3>
              <p className={`text-sm mt-1 ${metric.isPositive ? "text-green-500" : "text-red-500"}`}>
                {metric.change}
              </p>
            </div>
            <metric.icon className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      ))}
    </div>
  );
};