import { Card } from "@/components/ui/card";
import { AlertTriangle, Brain, Home, LineChart, Radio, Settings, Sparkles } from "lucide-react";
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

const AiDashboard = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [activeSection, setActiveSection] = useState("ai");
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

  const renderContent = () => {
    switch (activeSection) {
      case "portfolio":
        return <PortfolioTracker />;
      case "ai":
        return (
          <div className="space-y-6">
            <ContractAnalysis 
              contractAddress={contractAddress}
              setContractAddress={setContractAddress}
              handleAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
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
    <div className="space-y-6">
      <div className="grid grid-cols-[240px_1fr] gap-6 p-4 bg-black/90 text-white rounded-xl">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 bg-solana-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Laby</h2>
          </div>

          <nav className="space-y-2">
            {[
              { icon: AlertTriangle, label: "Alerts", active: false },
              { icon: LineChart, label: "Patterns", active: false },
              { icon: Brain, label: "AI Intel", active: activeSection === "ai" },
              { icon: Radio, label: "Signals", active: false },
              { icon: LineChart, label: "Portfolio", active: activeSection === "portfolio" },
              { icon: Settings, label: "Settings", active: false },
              { icon: Home, label: "Home", active: false },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveSection(item.label.toLowerCase())}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  item.active ? "bg-solana-primary/20 text-solana-primary" : "hover:bg-white/5"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AiDashboard;