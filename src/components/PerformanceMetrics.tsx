import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export const PerformanceMetrics = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [metrics, setMetrics] = useState([
    {
      label: "Total SOL Value",
      value: "0 SOL",
      change: "0%",
      isPositive: true,
      icon: Activity
    },
    {
      label: "BONK/SOL",
      value: "0",
      change: "0%",
      isPositive: true,
      icon: TrendingUp
    },
    {
      label: "MYRO/SOL",
      value: "0",
      change: "0%",
      isPositive: false,
      icon: TrendingDown
    }
  ]);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (publicKey) {
        try {
          const connection = new Connection("https://api.mainnet-beta.solana.com");
          const balance = await connection.getBalance(publicKey);
          const solBalance = balance / LAMPORTS_PER_SOL;

          setBalance(solBalance);
          setMetrics(prev => [
            {
              ...prev[0],
              value: `${solBalance.toFixed(4)} SOL`,
              change: "+0%", // You would calculate this based on historical data
              isPositive: true
            },
            ...prev.slice(1)
          ]);
        } catch (error) {
          console.error("Error fetching wallet data:", error);
        }
      }
    };

    fetchWalletData();
  }, [publicKey]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.label} className="portfolio-card animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
              <h3 className="text-2xl font-bold mt-2 text-foreground">{metric.value}</h3>
              <p className={`text-sm mt-1 font-medium ${metric.isPositive ? "text-green-500" : "text-red-500"}`}>
                {metric.change}
              </p>
            </div>
            <metric.icon className="h-8 w-8 text-solana-primary" />
          </div>
        </Card>
      ))}
    </div>
  );
};