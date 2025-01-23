import { GitCommit, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AnalysisResult } from "./types";

interface MetricsDisplayProps {
  metrics: AnalysisResult["metrics"];
}

const MetricsDisplay = ({ metrics }: MetricsDisplayProps) => {
  const getMetricColor = (value: number) => {
    if (value >= 80) return "text-green-500";
    if (value >= 60) return "text-yellow-500";
    if (value >= 40) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <GitCommit className={getMetricColor(metrics.commitFrequency)} />
          <span>Commit Patterns: {metrics.commitFrequency}%</span>
        </div>
        <Progress value={metrics.commitFrequency} className="h-1" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className={getMetricColor(metrics.contributorActivity)} />
          <span>Contributor Activity: {metrics.contributorActivity}%</span>
        </div>
        <Progress value={metrics.contributorActivity} className="h-1" />
      </div>
    </div>
  );
};

export default MetricsDisplay;