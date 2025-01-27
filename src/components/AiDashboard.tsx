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
import { Button } from "./ui/button";
import { FileText, Lock } from "lucide-react";

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
    const commonCardClasses = "glass-card backdrop-blur-xl border-white/10 p-6 relative min-h-[600px] pointer-events-none select-none";
    const tokenGatedBadge = (
      <div className="absolute top-4 right-4 flex items-center gap-2 text-sm font-medium text-white/70 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        <Lock className="w-4 h-4" />
        Token Gated Access
      </div>
    );

    const gatedContent = (content: React.ReactNode) => (
      <div className="relative">
        {content}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center">
          <Button 
            className="pointer-events-auto bg-gradient-to-r from-neon-pink to-neon-violet hover:opacity-90"
            onClick={() => toast({
              title: "Token Required",
              description: "You need to hold tokens to access this feature",
              variant: "destructive",
            })}
          >
            <Lock className="mr-2 h-4 w-4" />
            Unlock Access
          </Button>
        </div>
      </div>
    );

    switch (activeSection) {
      case "trending":
        return (
          <Card className={commonCardClasses}>
            {tokenGatedBadge}
            {gatedContent(<TrendingSection />)}
          </Card>
        );
      case "portfolio":
        return (
          <div className={`${commonCardClasses} rounded-lg`}>
            {tokenGatedBadge}
            {gatedContent(<PortfolioTracker />)}
          </div>
        );
      case "patterns":
        return (
          <Card className={commonCardClasses}>
            {tokenGatedBadge}
            {gatedContent(<PatternAnalysis />)}
          </Card>
        );
      case "alerts":
        return (
          <Card className={commonCardClasses}>
            {tokenGatedBadge}
            {gatedContent(<AlertsSection />)}
          </Card>
        );
      case "github checker":
        return (
          <div className={`${commonCardClasses} rounded-lg`}>
            {tokenGatedBadge}
            {gatedContent(<GithubChecker />)}
          </div>
        );
      case "ai intel":
        return (
          <div className="space-y-6">
            <Card className={`${commonCardClasses} rounded-lg`}>
              {tokenGatedBadge}
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
                      <div className="flex justify-center mt-6">
                        <Button 
                          onClick={handleDetailedIntel}
                          className="bg-gradient-to-r from-neon-pink to-neon-violet hover:opacity-90"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Detailed AI Intel
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </Card>
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