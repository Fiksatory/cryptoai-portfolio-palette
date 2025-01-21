import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export const PortfolioChart = () => {
  const { publicKey } = useWallet();
  const [data, setData] = useState([
    { date: "Now", value: 0 },
  ]);

  useEffect(() => {
    // In a real application, you would fetch historical data for the wallet
    // For now, we'll just show the current balance point
    if (publicKey) {
      setData([
        { date: "Now", value: 0 }, // You would populate this with real historical data
      ]);
    }
  }, [publicKey]);

  return (
    <Card className="p-6 h-[400px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Portfolio Value (SOL)</h3>
        <p className="text-sm text-muted-foreground">
          {publicKey ? publicKey.toString() : "Connect wallet to view portfolio"}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)"
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};