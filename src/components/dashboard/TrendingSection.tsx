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
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const initialTokens = [
  {
    rank: 1,
    name: "BONK",
    price: 0.00001234,
    volume: "$2.1M",
    change: 15.2,
    isPositive: true,
    image: "/lovable-uploads/19bfce04-0354-4554-b5b7-12106ecb7f86.png"
  },
  {
    rank: 2,
    name: "WEN",
    price: 0.00000789,
    volume: "$1.8M",
    change: -8.4,
    isPositive: false,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/2833.png"
  },
  {
    rank: 3,
    name: "SAMO",
    price: 0.00890,
    volume: "$950K",
    change: 4.7,
    isPositive: true,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/9721.png"
  },
  {
    rank: 4,
    name: "PYTH",
    price: 0.4567,
    volume: "$3.2M",
    change: 22.1,
    isPositive: true,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/16362.png"
  },
  {
    rank: 5,
    name: "ORCA",
    price: 1.234,
    volume: "$1.5M",
    change: -3.2,
    isPositive: false,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/11165.png"
  },
  {
    rank: 6,
    name: "RAY",
    price: 0.789,
    volume: "$2.8M",
    change: 12.5,
    isPositive: true,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/8526.png"
  },
  {
    rank: 7,
    name: "COPE",
    price: 0.0234,
    volume: "$750K",
    change: -5.8,
    isPositive: false,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/8543.png"
  }
];

export const TrendingSection = () => {
  const [tokens, setTokens] = useState(initialTokens);

  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(currentTokens => 
        currentTokens.map(token => {
          const priceChange = (Math.random() - 0.5) * 0.001;
          const newPrice = token.price * (1 + priceChange);
          const newChange = token.change + (priceChange * 100);
          return {
            ...token,
            price: newPrice,
            change: newChange,
            isPositive: newChange > 0
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price < 0.001) return price.toExponential(2);
    return price.toFixed(3);
  };

  return (
    <Card className="bg-black/40 border-white/10 p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-neon-pink to-neon-violet rounded-xl flex items-center justify-center shadow-lg shadow-neon-pink/20">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold neon-glow">Trending Pairs</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead className="text-right">24h Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token) => (
            <TableRow 
              key={token.rank}
              className={cn(
                "hover:bg-white/5 transition-colors",
                token.rank <= 3 && "border-animation"
              )}
            >
              <TableCell>
                <span className={cn(
                  "font-semibold",
                  token.rank <= 3 ? "text-white" : "text-gray-400"
                )}>
                  #{token.rank}
                </span>
              </TableCell>
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
                  <span className="font-semibold">{token.name}</span>
                </div>
              </TableCell>
              <TableCell className={cn(
                "font-mono",
                token.isPositive ? 'text-green-400' : 'text-red-400'
              )}>
                ${formatPrice(token.price)}
              </TableCell>
              <TableCell>
                {token.volume}
              </TableCell>
              <TableCell className="text-right">
                <span className={`${
                  token.isPositive ? 'text-green-400' : 'text-red-400'
                } transition-colors duration-300`}>
                  {token.change.toFixed(2)}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
