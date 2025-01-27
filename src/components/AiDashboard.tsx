import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { analyzePairData, searchTokens } from "@/services/dexscreener";
import PortfolioTracker from "./PortfolioTracker";
import { ContractAnalysis } from "./dashboard/ContractAnalysis";
import { AdvancedMetrics } from "./dashboard/AdvancedMetrics";
import { TokenChart } from "./dashboard/TokenChart";
import { PatternAnalysis } from "./dashboard/PatternAnalysis";
import { TrendingSection } from "./dashboard/TrendingSection";
import { AlertsSection } from "./dashboard/AlertsSection";
import GithubChecker from "./dashboard/GithubChecker";
import { Navigation } from "./dashboard/Navigation";
import { Lock } from "lucide-react";

const AiDashboard = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [activeSection, setActiveSection] = useState("trending");
  const [showAnalysis, setShowAnalysis] = useState(false);
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
    setShowAnalysis(false);
    setTimeout(() => {
      setShowAnalysis(true);
    }, 5000);
    setContractAddress(contractAddress);
  };

  const handleDetailedIntel = () => {
    toast({
      title: "Detailed AI Intel",
      description: "Generating detailed analysis report...",
    });
  };

  const renderContent = () => {
    const commonCardClasses = "glass-card border-white/10 p-6 relative min-h-[600px] pointer-events-none select-none";
    const tokenGatedBadge = (
      <div className="flex items-center gap-3 text-sm font-medium text-white/90 bg-black/80 px-6 py-3 rounded-full border border-neon-violet/20 shadow-xl">
        <Lock className="w-4 h-4 text-neon-violet" />
        <span className="bg-gradient-to-r from-neon-pink to-neon-violet bg-clip-text text-transparent">Token Gated Access</span>
      </div>
    );

    const gatedContent = (content: React.ReactNode) => (
      <div className="relative">
        {content}
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          {tokenGatedBadge}
        </div>
      </div>
    );

    switch (activeSection) {
      case "trending":
        return (
          <Card className={`${commonCardClasses}`}>
            {gatedContent(<TrendingSection />)}
          </Card>
        );
      case "portfolio":
        return (
          <div className={`${commonCardClasses} rounded-lg`}>
            {gatedContent(<PortfolioTracker />)}
          </div>
        );
      case "patterns":
        return (
          <Card className={`${commonCardClasses}`}>
            {gatedContent(<PatternAnalysis />)}
          </Card>
        );
      case "alerts":
        return (
          <Card className={`${commonCardClasses}`}>
            {gatedContent(<AlertsSection />)}
          </Card>
        );
      case "github checker":
        return (
          <div className={`${commonCardClasses} rounded-lg`}>
            {gatedContent(<GithubChecker />)}
          </div>
        );
      case "ai intel":
        return (
          <div className="space-y-6">
            <Card className={`${commonCardClasses} rounded-lg`}>
              {gatedContent(
                <>
                  <ContractAnalysis 
                    contractAddress={contractAddress}
                    setContractAddress={setContractAddress}
                    handleAnalyze={handleAnalyze}
                    isLoading={isLoading}
                  />
                  {showAnalysis && tokenData?.name && (
                    <>
                      <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-pink to-neon-violet bg-clip-text text-transparent">
                          {tokenData.name}
                        </h2>
                        <p className="text-gray-400">({tokenData.symbol})</p>
                      </div>
                      <TokenChart tokenData={tokenData} />
                      <AdvancedMetrics tokenData={tokenData} />
                    </>
                  )}
                </>
              )}
            </Card>
          </div>
        );
      default:
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/5 via-neon-violet/5 to-neon-purple/5 rounded-3xl blur-3xl -z-10" />
        <div className="relative border-animation rounded-xl overflow-hidden">
          <div className="grid grid-cols-[240px_1fr] gap-6 p-4 glass-card rounded-xl relative overflow-hidden backdrop-filter backdrop-blur-xl">
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