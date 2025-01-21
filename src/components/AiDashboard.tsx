import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Brain, Home, LineChart, Radio, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { analyzePairData, searchTokens } from "@/services/dexscreener";
import { useToast } from "./ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import PortfolioTracker from "./PortfolioTracker";

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
            <Card className="bg-black/40 border-white/10 p-4">
              <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Contract Analysis
              </h3>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter contract address..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="bg-black/20 border-white/10"
                />
                <Button 
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="bg-solana-primary hover:bg-solana-primary/90"
                >
                  Analyze
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-black/40 border-white/10 p-4">
                <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  AI Market Pulse
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Market State:</span>
                    <Badge variant="secondary">
                      {tokenData?.marketStatus || "WAITING FOR ANALYSIS"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">AI Confidence:</span>
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${tokenData?.metrics?.healthScore || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-black/40 border-white/10 p-4">
                <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
                  <Radio className="w-4 h-4" />
                  Manipulation Radar
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Risk Level:</span>
                    <Badge className="bg-indigo-500/20 text-indigo-300">
                      {tokenData?.riskLevel || "UNKNOWN"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {tokenData?.metrics?.buySellRatio > 1.2 && (
                      <Badge className="bg-blue-500/20 text-blue-300">High Buy Pressure</Badge>
                    )}
                    {tokenData?.metrics?.buySellRatio < 0.8 && (
                      <Badge className="bg-red-500/20 text-red-300">High Sell Pressure</Badge>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-black/40 border-white/10 p-4">
                <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
                  <LineChart className="w-4 h-4" />
                  Market Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">24h Volume:</span>
                    <span className="text-green-400">
                      ${tokenData?.metrics?.volume24h?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {tokenData?.metrics?.marketCap > 0 && (
                      <Badge className="bg-orange-500">
                        MCap: ${tokenData.metrics.marketCap.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="bg-black/40 border-white/10 p-4">
                <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
                  <Brain className="w-4 h-4" />
                  Market Context
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Context:</span>
                    <span>{tokenData?.marketContext || "Waiting for analysis..."}</span>
                  </div>
                  {tokenData && (
                    <div className="flex gap-2">
                      <Badge className="bg-indigo-500/20 text-indigo-300">
                        {tokenData.summary}
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <Card className="bg-black/40 border-white/10 p-4">
              {isLoading ? (
                <div className="text-center text-gray-400">Analyzing contract...</div>
              ) : !tokenData ? (
                <div className="text-center text-gray-400">
                  Enter a contract address to see AI insights
                </div>
              ) : (
                <div className="space-y-3">
                  {tokenData.socialLinks && Object.entries(tokenData.socialLinks).map(([platform, url]) => (
                    <div key={platform} className="flex items-center gap-4">
                      <Badge className="bg-purple-500 capitalize">{platform}</Badge>
                      <a 
                        href={url as string} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:underline"
                      >
                        {url as string}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </Card>
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