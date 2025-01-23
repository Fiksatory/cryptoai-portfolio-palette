import { Card } from "@/components/ui/card";
import { AlertTriangle, Brain, Home, LineChart, Radio, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
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
import GithubChecker from "./dashboard/GithubChecker";

// Mock data for token alerts - expanded to 7 items
const mockAlerts = [
  { id: 1, name: "SOLAPE", price: "$0.00023", change: "+15.5%" },
  { id: 2, name: "BONK", price: "$0.00012", change: "+8.2%" },
  { id: 3, name: "SAMO", price: "$0.0065", change: "+12.1%" },
  { id: 4, name: "WIF", price: "$0.0089", change: "-5.3%" },
  { id: 5, name: "MYRO", price: "$0.00034", change: "+22.7%" },
  { id: 6, name: "COPE", price: "$0.0045", change: "-3.8%" },
  { id: 7, name: "DUST", price: "$0.00078", change: "+9.4%" },
];

const AiDashboard = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [activeSection, setActiveSection] = useState("trending");
  const [alerts, setAlerts] = useState(mockAlerts);
  const { toast } = useToast();

  useEffect(() => {
    const scheduleNextAlert = () => {
      // Random time between 3 and 60 seconds
      const randomTime = Math.floor(Math.random() * (60000 - 3000) + 3000);
      
      return setTimeout(() => {
        // Rotate alerts by moving the first item to the end
        setAlerts(prevAlerts => {
          const newAlerts = [...prevAlerts];
          const firstAlert = newAlerts.shift();
          if (firstAlert) {
            // Modify the alert slightly before adding it back
            const modifiedAlert = {
              ...firstAlert,
              price: `$${(Math.random() * 0.001).toFixed(8)}`,
              change: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 25).toFixed(1)}%`
            };
            newAlerts.push(modifiedAlert);
          }
          return newAlerts;
        });
        
        // Schedule the next alert
        timeoutRef.current = scheduleNextAlert();
      }, randomTime);
    };

    // Store timeout reference for cleanup
    const timeoutRef = { current: null };
    timeoutRef.current = scheduleNextAlert();

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-neon-pink to-neon-violet bg-clip-text text-transparent text-3xl font-bold">
                  Alerts Dashboard
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 glass-card">
                    <h3 className="text-lg font-semibold mb-2">Price Alerts</h3>
                    <p className="text-gray-400">Configure price movement notifications</p>
                  </Card>
                  <Card className="p-4 glass-card">
                    <h3 className="text-lg font-semibold mb-2">Volume Alerts</h3>
                    <p className="text-gray-400">Set up volume threshold alerts</p>
                  </Card>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Live Token Alerts</h3>
                  <div className="space-y-2">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-4 bg-black/20 rounded-lg transition-all duration-300 hover:bg-black/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-neon-pink" />
                            <span className="font-medium">{alert.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-400">{alert.price}</span>
                            <span className={cn(
                              "font-medium",
                              alert.change.startsWith("+") ? "text-green-400" : "text-red-400"
                            )}>
                              {alert.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                    icon: AlertTriangle, 
                    label: "Alerts", 
                    active: activeSection === "alerts",
                    extra: (
                      <div className="absolute right-2 bg-[#9333EA] px-2 py-0.5 rounded-full text-xs font-medium text-white">
                        Soon
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
