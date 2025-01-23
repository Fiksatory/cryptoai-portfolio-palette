import { Card } from "@/components/ui/card";
import { Brain, Home, LineChart, Radio, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
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
    <div className="absolute inset-0 bg-background/50 backdrop-blur-xl z-10 flex flex-col items-center justify-center space-y-4">
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
            <div className="filter blur-sm">
              <TrendingSection />
            </div>
            <TokenGatedContent />
          </Card>
        );
      case "portfolio":
        return <PortfolioTracker />;
      case "patterns":
        return (
          <Card className={commonCardClasses}>
            <div className="filter blur-sm">
              <PatternAnalysis />
            </div>
            <TokenGatedContent />
          </Card>
        );
      case "alerts":
        return (
          <Card className={commonCardClasses}>
            <div className="filter blur-sm">
              <AlertsSection />
            </div>
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
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-pink to-neon-violet rounded-xl flex items-center justify-center shadow-lg shadow-neon-pink/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold neon-glow">Laby</h2>
              </div>

              <nav className="space-y-2">
                {[
                  { icon: TrendingUp, label: "Trending", active: activeSection === "trending" },
                  { 
                    icon: LineChart, 
                    label: "Alerts", 
                    active: activeSection === "alerts",
                    extra: (
                      <div className="flex gap-2 absolute right-2">
                        <div className="bg-neon-pink px-2 py-0.5 rounded-full text-xs font-medium text-white animate-pulse">
                          0
                        </div>
                        <div className="bg-[#9333EA] px-2 py-0.5 rounded-full text-xs font-medium text-white">
                          Soon
                        </div>
                      </div>
                    )
                  },
                  { 
                    icon: LineChart, 
                    label: "Patterns", 
                    active: activeSection === "patterns",
                    extra: (
                      <div className="absolute right-2 bg-[#9333EA] px-2 py-0.5 rounded-full text-xs font-medium text-white">
                        Soon
                      </div>
                    )
                  },
                  { icon: Brain, label: "AI Intel", active: activeSection === "ai intel" },
                  { icon: Radio, label: "Github Checker", active: activeSection === "github checker" },
                  { icon: LineChart, label: "Portfolio", active: activeSection === "portfolio" },
                  { icon: Home, label: "Home", active: false },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveSection(item.label.toLowerCase())}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 neon-border relative",
                      item.active 
                        ? "bg-gradient-to-r from-neon-pink/20 to-neon-violet/20 text-white shadow-lg shadow-neon-pink/10" 
                        : "hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5",
                      item.active ? "text-neon-pink" : "text-gray-400"
                    )} />
                    <span>{item.label}</span>
                    {item.extra}
                  </button>
                ))}
              </nav>
            </div>

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