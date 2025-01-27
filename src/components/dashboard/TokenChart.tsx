import { Card } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface TokenChartProps {
  tokenData: any;
}

export const TokenChart = ({ tokenData }: TokenChartProps) => {
  // Simulated price data (replace with real data when available)
  const data = [
    { time: "00:00", price: 1.2 },
    { time: "04:00", price: 1.4 },
    { time: "08:00", price: 1.3 },
    { time: "12:00", price: 1.5 },
    { time: "16:00", price: 1.6 },
    { time: "20:00", price: 1.8 },
    { time: "24:00", price: 1.7 },
  ];

  return (
    <Card className="bg-black/40 border-white/10 p-4 h-[300px]">
      <h3 className="text-sm font-medium mb-4">Price Chart (24h)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#ff00ff" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};