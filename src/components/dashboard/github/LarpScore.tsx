import { Shield, Percent } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LarpScoreProps {
  score: number;
}

const LarpScore = ({ score }: LarpScoreProps) => {
  const getLarpColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">LARP Detection Score</h3>
        <div className="flex items-center gap-2">
          <Shield className={getLarpColor(score)} />
          <span className={`text-2xl font-bold ${getLarpColor(score)}`}>
            {score}%
          </span>
          <Percent className={`h-4 w-4 ${getLarpColor(score)}`} />
        </div>
      </div>
      <Progress value={score} className="h-2" />
      <p className="text-sm text-muted-foreground">
        {score >= 85 ? "This repository appears to be genuine and well-maintained." :
         score >= 70 ? "This repository shows some concerning patterns but may be legitimate." :
         score >= 50 ? "This repository requires thorough investigation before use." :
         "This repository shows strong indicators of being potentially fake or low quality."}
      </p>
    </div>
  );
};

export default LarpScore;