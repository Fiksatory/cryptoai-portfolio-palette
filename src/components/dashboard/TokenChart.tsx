import { Card } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface TokenChartProps {
  tokenData: any;
}

export const TokenChart = ({ tokenData }: TokenChartProps) => {
  // Simulated price data following the pattern from the image
  const data = [
    { time: "00:00", price: 1.0 },
    { time: "02:00", price: 1.2 },
    { time: "04:00", price: 1.5 },
    { time: "06:00", price: 2.1 },  // Peak
    { time: "08:00", price: 1.8 },  // Sharp drop
    { time: "10:00", price: 1.9 },  // Recovery
    { time: "12:00", price: 1.6 },  // Continued decline
    { time: "14:00", price: 1.5 },
    { time: "16:00", price: 1.4 },
    { time: "18:00", price: 1.3 },
    { time: "20:00", price: 1.2 },
    { time: "22:00", price: 1.1 },
    { time: "24:00", price: 1.0 },
  ];

  return (
    <Card className="bg-black/40 border-white/10 p-4 h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="time" 
            stroke="#666" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#666" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 0.1', 'dataMax + 0.1']}
          />
          <Tooltip 
            contentStyle={{ 
              background: 'rgba(0,0,0,0.8)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#999' }}
            itemStyle={{ color: '#ff00ff' }}
          />
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