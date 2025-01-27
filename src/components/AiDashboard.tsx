import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { analyzePairData, searchTokens } from "@/services/dexscreener";
import PortfolioTracker from "./PortfolioTracker";
import { ContractAnalysis } from "./dashboard/ContractAnalysis";
import { MarketMetrics } from "./dashboard/MarketMetrics";
import { MarketContext } from "./dashboard/MarketContext";
import { SocialLinks } from "./dashboard/SocialLinks";
import { PatternAnalysis } from "./dashboard/PatternAnalysis";
import { TrendingSection } from "./dashboard/TrendingSection";
import { AlertsSection } from "./dashboard/AlertsSection";
import GithubChecker from "./dashboard/GithubChecker";
import { Navigation } from "./dashboard/Navigation";

const AiDashboard = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [activeSection, setActiveSection] = useState("trending");
  const { toast } = useToast();

  const { data: tokenData, isLoading } = useQuery({
    queryKey: ['tokenAnalysis', contractAddress],
    queryFn: async () => {
      if (!contractAddress) return null;
      const data = await searchTokens(contractAddress);
      return analyzePairData(data);
    },
    enabled: !!contractAddress,
    meta: {
      onError: () => {
        toast({
          title: "Error analyzing token",
          description: "Please check the contract address and try again",
          variant: "destructive",
        });
      }
    }
  });

  const handleAnalyze = () => {
    if (!contractAddress) {
      toast({
        title: "Please enter a contract address",
        description: "Enter a valid Solana contract address to analyze",
        variant: "destructive",
      });
      return;
    }
    setContractAddress(contractAddress);
  };

  const TokenGatedContent = () => (
    <div className="absolute inset-0 bg-background/50 z-10 flex flex-col items-center justify-center space-y-4">
      <div className="bg-gradient-to-r from-neon-pink to-neon-violet bg-clip-text text-transparent text-3xl font-bold">
        Token Gated Feature
      </div>
      <p className="text-lg text-gray-400">Connect your wallet to unlock this feature</p>
    </div>
  );

  const renderContent = () => {
    const commonCardClasses = "bg-black/40 border-white/10 p-6 relative min-h-[600px]";

    switch (activeSection) {
      case "trending":
        return (
          <Card className={commonCardClasses}>
            <TrendingSection />
            <TokenGatedContent />
          </Card>
        );
      case "portfolio":
        return <PortfolioTracker />;
      case "patterns":
        return (
          <Card className={commonCardClasses}>
            <PatternAnalysis />
            <TokenGatedContent />
          </Card>
        );
      case "alerts":
        return (
          <Card className={commonCardClasses}>
            <AlertsSection />
            <TokenGatedContent />
          </Card>
        );
      case "github checker":
        return <GithubChecker />;
      case "ai intel":
        return (
          <div className="space-y-6">
            <ContractAnalysis 
              contractAddress={contractAddress}
              setContractAddress={setContractAddress}
              handleAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
            {tokenData?.name && (
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-pink to-neon-violet bg-clip-text text-transparent">
                  {tokenData.name}
                </h2>
                <p className="text-gray-400">({tokenData.symbol})</p>
              </div>
            )}
            <MarketMetrics tokenData={tokenData} />
            <MarketContext tokenData={tokenData} />
            <SocialLinks tokenData={tokenData} isLoading={isLoading} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/5 via-neon-violet/5 to-neon-purple/5 rounded-3xl blur-3xl -z-10" />
        <div className="relative border-animation rounded-xl overflow-hidden">
          <div className="grid grid-cols-[240px_1fr] gap-6 p-4 glass-card rounded-xl relative overflow-hidden">
            <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className="space-y-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiDashboard;