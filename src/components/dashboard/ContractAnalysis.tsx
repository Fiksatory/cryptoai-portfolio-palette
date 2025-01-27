import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ContractAnalysisProps {
  contractAddress: string;
  setContractAddress: (address: string) => void;
  handleAnalyze: () => void;
  isLoading: boolean;
}

export const ContractAnalysis = ({
  contractAddress,
  setContractAddress,
  handleAnalyze,
  isLoading
}: ContractAnalysisProps) => {
  return (
    <Card className="bg-black/40 border-white/10 p-4">
      <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
        <Sparkles className="w-4 h-4" />
        Contract Analysis
      </h3>
      <div className="flex gap-4">
        <Input
          placeholder="Enter Solana contract address..."
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="bg-black/20 border-white/10"
        />
        <Button 
          onClick={handleAnalyze}
          disabled={isLoading}
          className="bg-solana-primary hover:bg-solana-primary/90"
        >
          {isLoading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
    </Card>
  );
};