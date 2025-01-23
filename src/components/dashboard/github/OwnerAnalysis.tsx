import { User } from "lucide-react";
import { AnalysisResult } from "./types";

interface OwnerAnalysisProps {
  ownerAnalysis: AnalysisResult["ownerAnalysis"];
}

const OwnerAnalysis = ({ ownerAnalysis }: OwnerAnalysisProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Repository Owner Analysis</h3>
      <div className="space-y-4 bg-secondary/10 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span>Account Age: {ownerAnalysis.accountAge}</span>
        </div>
        <div>
          <span>Total Repositories: {ownerAnalysis.totalRepos}</span>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Suspicious Patterns:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {ownerAnalysis.suspiciousPatterns.map((pattern, index) => (
              <li key={index} className="text-red-400">{pattern}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OwnerAnalysis;