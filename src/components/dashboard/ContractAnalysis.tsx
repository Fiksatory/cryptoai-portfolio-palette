import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

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
  const [localLoading, setLocalLoading] = useState(false);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    setContractAddress(pastedText);
    setLocalLoading(true);
    setTimeout(() => {
      setLocalLoading(false);
      handleAnalyze();
    }, 5000);
  };

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
          onPaste={handlePaste}
          className="bg-black/20 border-white/10"
        />
        <Button 
          onClick={handleAnalyze}
          disabled={isLoading || localLoading}
          className="bg-gradient-to-r from-neon-pink to-neon-violet hover:opacity-90 transition-opacity relative min-w-[120px]"
        >
          {(isLoading || localLoading) ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            "Analyze"
          )}
        </Button>
      </div>
    </Card>
  );
};