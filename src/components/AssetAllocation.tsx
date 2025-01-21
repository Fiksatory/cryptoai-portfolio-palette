import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export const AssetAllocation = () => {
  const { publicKey } = useWallet();
  const [data, setData] = useState([
    { name: "SOL", value: 100 }
  ]);

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--muted))",
    "hsl(var(--accent))",
    "hsl(var(--secondary))"
  ];

  useEffect(() => {
    const fetchTokens = async () => {
      if (publicKey) {
        // In a real application, you would fetch token balances here
        // For now, we'll just show SOL
        setData([
          { name: "SOL", value: 100 }
        ]);
      }
    };

    fetchTokens();
  }, [publicKey]);

  return (
    <Card className="p-6 h-[400px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Token Allocation</h3>
        <p className="text-sm text-muted-foreground">
          {publicKey ? "Current distribution" : "Connect wallet to view allocation"}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};