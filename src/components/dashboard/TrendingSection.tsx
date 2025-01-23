import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const mockTokens = [
  {
    name: "BONK",
    price: "$0.00001234",
    volume: "$2.1M",
    change: "+15.2%",
    isPositive: true
  },
  {
    name: "WEN",
    price: "$0.00000789",
    volume: "$1.8M",
    change: "-8.4%",
    isPositive: false
  },
  {
    name: "SAMO",
    price: "$0.00890",
    volume: "$950K",
    change: "+4.7%",
    isPositive: true
  },
  {
    name: "PYTH",
    price: "$0.4567",
    volume: "$3.2M",
    change: "+22.1%",
    isPositive: true
  },
  {
    name: "ORCA",
    price: "$1.234",
    volume: "$1.5M",
    change: "-3.2%",
    isPositive: false
  },
  {
    name: "RAY",
    price: "$0.789",
    volume: "$2.8M",
    change: "+12.5%",
    isPositive: true
  },
  {
    name: "COPE",
    price: "$0.0234",
    volume: "$750K",
    change: "-5.8%",
    isPositive: false
  }
];

export const TrendingSection = () => {
  return (
    <Card className="bg-black/40 border-white/10 p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-neon-pink to-neon-violet rounded-xl flex items-center justify-center shadow-lg shadow-neon-pink/20">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold neon-glow">Trending Pairs</h2>
      </div>

      <div className="grid gap-4">
        {mockTokens.map((token, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-pink to-neon-violet flex items-center justify-center">
                <span className="text-xs font-bold">{token.name.substring(0, 1)}</span>
              </div>
              <div>
                <h3 className="font-semibold">{token.name}</h3>
                <p className="text-sm text-gray-400">{token.price}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">{token.volume}</p>
              <p className={`text-sm ${token.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {token.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};