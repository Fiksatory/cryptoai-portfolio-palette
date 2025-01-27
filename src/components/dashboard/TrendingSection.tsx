import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const initialTokens = [
  {
    rank: 1,
    name: "Punks",
    symbol: "SOL",
    displayName: "CryptoPunks",
    supply: "30000",
    smartWallets: 156,
    volume: "$25.0M",
    change: 15.2,
    isPositive: true,
    image: "/lovable-uploads/484a9036-911a-4505-8e73-5ce2955a0676.png",
    topHoldersPercentage: 45.2
  },
  {
    rank: 2,
    name: "FAFO",
    symbol: "SOL",
    displayName: "FAFO",
    supply: "80",
    smartWallets: 89,
    volume: "$429.6M",
    change: -8.4,
    isPositive: false,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/2833.png",
    topHoldersPercentage: 62.8
  },
  {
    rank: 3,
    name: "Seek",
    symbol: "SOL",
    displayName: "DeepSeek",
    supply: "",
    smartWallets: 234,
    volume: "$144.1M",
    change: 4.7,
    isPositive: true,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/9721.png",
    topHoldersPercentage: 38.5
  },
  {
    rank: 4,
    name: "GRNLD",
    symbol: "SOL",
    displayName: "Hi Greenland",
    supply: "30000",
    smartWallets: 312,
    volume: "$34.3M",
    change: 22.1,
    isPositive: true,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/16362.png",
    topHoldersPercentage: 51.3
  },
  {
    rank: 5,
    name: "VineX",
    symbol: "SOL",
    displayName: "VineX Coin",
    supply: "26000",
    smartWallets: 178,
    volume: "$24.1M",
    change: -3.2,
    isPositive: false,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/11165.png",
    topHoldersPercentage: 42.7
  },
  {
    rank: 6,
    name: "Stupid",
    symbol: "SOL",
    displayName: "StupidCoin",
    supply: "500",
    smartWallets: 145,
    volume: "$120.4M",
    change: 12.5,
    isPositive: true,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/8526.png",
    topHoldersPercentage: 55.9
  },
  {
    rank: 7,
    name: "DeepSeek",
    symbol: "SOL",
    displayName: "DeepSeek",
    supply: "6000",
    smartWallets: 67,
    volume: "$9.1M",
    change: -5.8,
    isPositive: false,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/8543.png",
    topHoldersPercentage: 71.2
  }
];

export const TrendingSection = () => {
  const [tokens, setTokens] = useState(initialTokens);
  const [selectedPeriod, setSelectedPeriod] = useState("1h");
  const [selectedMode, setSelectedMode] = useState("pump.fun");

  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(currentTokens => 
        currentTokens.map(token => {
          const changeValue = (Math.random() - 0.5) * 2;
          const newChange = token.change + changeValue;
          const newSmartWallets = Math.max(0, token.smartWallets + Math.floor(Math.random() * 3) - 1);
          return {
            ...token,
            smartWallets: newSmartWallets,
            change: newChange,
            isPositive: newChange > 0
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-black/40 border-white/10 p-6 animate-fade-in relative w-full">
      <div className="relative z-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-pink to-neon-violet rounded-xl flex items-center justify-center shadow-lg shadow-neon-pink/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold neon-glow">Trending Pairs</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <ToggleGroup 
              type="single" 
              value={selectedMode}
              onValueChange={(value) => {
                if (value) setSelectedMode(value);
              }}
              className="bg-black/20 rounded-lg p-1"
            >
              <ToggleGroupItem value="pump.fun" className="text-xs px-3 py-1">Pump.fun</ToggleGroupItem>
              <ToggleGroupItem value="raydium" className="text-xs px-3 py-1">Raydium</ToggleGroupItem>
            </ToggleGroup>

            <ToggleGroup 
              type="single" 
              value={selectedPeriod}
              onValueChange={(value) => {
                if (value) setSelectedPeriod(value);
              }}
              className="bg-black/20 rounded-lg p-1"
            >
              <ToggleGroupItem value="30m" className="text-xs px-2 py-1">30m</ToggleGroupItem>
              <ToggleGroupItem value="1h" className="text-xs px-2 py-1">1h</ToggleGroupItem>
              <ToggleGroupItem value="4h" className="text-xs px-2 py-1">4h</ToggleGroupItem>
              <ToggleGroupItem value="8h" className="text-xs px-2 py-1">8h</ToggleGroupItem>
              <ToggleGroupItem value="12h" className="text-xs px-2 py-1">12h</ToggleGroupItem>
              <ToggleGroupItem value="24h" className="text-xs px-2 py-1">24h</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Token</TableHead>
              <TableHead>Smart Wallets</TableHead>
              <TableHead>Top 10 Holders %</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead className="text-right">{selectedPeriod} Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow 
                key={token.rank}
                className="hover:bg-white/5 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img 
                      src={token.image} 
                      alt={token.name}
                      className="w-8 h-8 rounded-full object-cover bg-white/10"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="%236366f1"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="16">${token.name.charAt(0)}</text></svg>`;
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{token.name}</span>
                      <span className="text-xs text-gray-400">
                        {token.displayName}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono">
                  {token.smartWallets}
                </TableCell>
                <TableCell className="font-mono">
                  {token.topHoldersPercentage}%
                </TableCell>
                <TableCell>{token.volume}</TableCell>
                <TableCell className="text-right">
                  <span 
                    className={`${
                      token.isPositive ? 'text-green-400' : 'text-red-400'
                    } transition-colors duration-300`}
                  >
                    {token.change.toFixed(2)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default TrendingSection;