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

const initialTokens = [
  {
    name: "BONK",
    price: 0.00001234,
    volume: "$2.1M",
    change: 15.2,
    isPositive: true,
    image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png"
  },
  {
    name: "WEN",
    price: 0.00000789,
    volume: "$1.8M",
    change: -8.4,
    isPositive: false,
    image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk/logo.png"
  },
  {
    name: "SAMO",
    price: 0.00890,
    volume: "$950K",
    change: 4.7,
    isPositive: true,
    image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU/logo.png"
  },
  {
    name: "PYTH",
    price: 0.4567,
    volume: "$3.2M",
    change: 22.1,
    isPositive: true,
    image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HZ1JovNiVvGrGNiiYvEozEVgZ88xyCRuYzF6L5KwRYF4/logo.svg"
  },
  {
    name: "ORCA",
    price: 1.234,
    volume: "$1.5M",
    change: -3.2,
    isPositive: false,
    image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png"
  },
  {
    name: "RAY",
    price: 0.789,
    volume: "$2.8M",
    change: 12.5,
    isPositive: true,
    image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png"
  },
  {
    name: "COPE",
    price: 0.0234,
    volume: "$750K",
    change: -5.8,
    isPositive: false,
    image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh/logo.png"
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
            <TableHead>Token</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead className="text-right">24h Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token, index) => (
            <TableRow 
              key={index}
              className="hover:bg-white/5 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <img 
                    src={token.image} 
                    alt={token.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/32/6366f1/ffffff?text=${token.name.charAt(0)}`;
                    }}
                  />
                  <span className="font-semibold">{token.name}</span>
                </div>
              </TableCell>
              <TableCell className={`font-mono ${token.isPositive ? 'text-green-400' : 'text-red-400'} transition-colors duration-300`}>
                ${formatPrice(token.price)}
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
    </Card>
  );
};