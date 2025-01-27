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
    image: "/lovable-uploads/de338610-cb95-4a86-a3fb-37cc49c425c9.png",
    topHoldersPercentage: 9.0
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
    image: "/lovable-uploads/0997be61-5dc4-4e58-95e0-1dc5e3cc8f0c.png",
    topHoldersPercentage: 13.0
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
    image: "/lovable-uploads/fdb1d969-bbd7-4ce5-8abc-8935eaa2d3f5.png",
    topHoldersPercentage: 13.0
  },
  {
    rank: 4,
    name: "SHY",
    symbol: "SOL",
    displayName: "Shy",
    supply: "30000",
    smartWallets: 312,
    volume: "$81.2M",
    change: 22.1,
    isPositive: true,
    image: "/lovable-uploads/b7438d84-60c3-45bf-8fdb-9f931671a5cc.png",
    topHoldersPercentage: 21.0
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
    image: "/lovable-uploads/ef748809-870d-465e-bb95-f6618b1a3799.png",
    topHoldersPercentage: 14.0
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
    image: "/lovable-uploads/2ab2f324-a87a-48e1-86c6-c3fafd04f772.png",
    topHoldersPercentage: 14.0
  },
  {
    rank: 7,
    name: "Vine",
    symbol: "SOL",
    displayName: "Vine",
    supply: "6000",
    smartWallets: 67,
    volume: "$9.1M",
    change: -5.8,
    isPositive: false,
    image: "/lovable-uploads/a72c20a4-b5a2-4c38-829d-38eb1de09f58.png",
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
