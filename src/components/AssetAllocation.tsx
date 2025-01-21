import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Card } from "@/components/ui/card";

const data = [
  { name: "Bitcoin", value: 45 },
  { name: "Ethereum", value: 30 },
  { name: "Other", value: 25 }
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))", "hsl(var(--accent))"];

export const AssetAllocation = () => {
  return (
    <Card className="p-6 h-[400px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Asset Allocation</h3>
        <p className="text-sm text-muted-foreground">Current distribution</p>
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