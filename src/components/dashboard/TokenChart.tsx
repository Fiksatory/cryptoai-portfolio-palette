import { Card } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface TokenChartProps {
  tokenData: any;
}

export const TokenChart = ({ tokenData }: TokenChartProps) => {
  // Simulated volatile bearish price data
  const data = [
    { time: "00:00", price: 1.8 },
    { time: "04:00", price: 1.9 },  // Temporary spike up
    { time: "08:00", price: 1.4 },  // Sharp drop
    { time: "12:00", price: 1.6 },  // Recovery
    { time: "16:00", price: 1.2 },  // Another drop
    { time: "20:00", price: 1.3 },  // Small recovery
    { time: "24:00", price: 0.9 },  // Final drop
  ];

  return (
    <Card className="bg-black/40 border-white/10 p-4 h-[300px]">
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