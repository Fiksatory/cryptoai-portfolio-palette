import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Brain, Home, LineChart, Radio, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const AiDashboard = () => {
  return (
    <div className="grid grid-cols-[240px_1fr] gap-6 p-4 bg-black/90 text-white rounded-xl">
      {/* Sidebar */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 bg-solana-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">CAOES</h2>
        </div>

        <nav className="space-y-2">
          {[
            { icon: AlertTriangle, label: "Alerts", active: false },
            { icon: LineChart, label: "Patterns", active: false },
            { icon: Brain, label: "AI Intel", active: true },
            { icon: Radio, label: "Signals", active: false },
            { icon: Settings, label: "Settings", active: false },
            { icon: Home, label: "Home", active: false },
          ].map((item) => (
            <button
              key={item.label}
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

      {/* Main Content */}
      <div className="space-y-6">
        {/* Market Pulse & Manipulation Radar */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-black/40 border-white/10 p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI Market Pulse
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Market State:</span>
                <Badge variant="secondary">ACCUMULATION</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">AI Confidence:</span>
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[92%]" />
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
                <span className="text-sm text-gray-400">Active Patterns:</span>
                <Badge className="bg-indigo-500/20 text-indigo-300">Multi-Wallet (12)</Badge>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-blue-500/20 text-blue-300">Social Pump (8)</Badge>
                <Badge className="bg-red-500/20 text-red-300">Flash Crash (5)</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Stealth Movement & Whale Psychology */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-black/40 border-white/10 p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
              <LineChart className="w-4 h-4" />
              Stealth Movement
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Last Hour:</span>
                <span className="text-green-400">500K + 12 wallets</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-orange-500">Unusual LP move</Badge>
                <Badge className="bg-red-500">Hidden limits</Badge>
              </div>
            </div>
          </Card>

          <Card className="bg-black/40 border-white/10 p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
              <Brain className="w-4 h-4" />
              Whale Psychology
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Behavior Model:</span>
                <span>Accumulation Phase</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-indigo-500/20 text-indigo-300">Distribution Soon</Badge>
                <Badge className="bg-red-500">Risk: Aggressive</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Most Active Tokens & Market Prediction */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-black/40 border-white/10 p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Most Active Tokens
            </h3>
            <div className="space-y-2">
              <Badge className="bg-indigo-500/20 text-indigo-300">LOW: $AVB</Badge>
              <Badge className="bg-yellow-500/20 text-yellow-300">MED: $ARC</Badge>
              <Badge className="bg-yellow-500/20 text-yellow-300">MED: $ALCH</Badge>
            </div>
          </Card>

          <Card className="bg-black/40 border-white/10 p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
              <LineChart className="w-4 h-4" />
              AI Market Prediction
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Next 6h Forecast:</span>
                <Badge className="bg-purple-500/20 text-purple-300">Major Movements (2)</Badge>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-yellow-500/20 text-yellow-300">Volatility Event (1)</Badge>
                <Badge className="bg-blue-500/20 text-blue-300">Pattern Matches (3)</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-time AI Insights */}
        <Card className="bg-black/40 border-white/10 p-4">
          <h3 className="text-sm font-medium mb-4">Real-time AI Insights:</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge className="bg-purple-500">$BULLY</Badge>
              <span className="text-sm">Coordinated wallet chain forming - 12 new addresses, each loaded with 45K USDC</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-500">$ZEREBRO</Badge>
              <span className="text-sm">Large-scale accumulation detected - 250K USDC split into 8 wallets in last 15min by top holder</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500">$ALCH</Badge>
              <span className="text-sm">400K USDC hidden limit orders placed, 85% probability of +40% move in 2-4h</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AiDashboard;