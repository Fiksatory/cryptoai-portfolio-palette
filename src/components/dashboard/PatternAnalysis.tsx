import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getNewPairs } from "@/services/dexscreener";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';

export const PatternAnalysis = () => {
  const { data: trendingTokens, isLoading } = useQuery({
    queryKey: ['patternAnalysis'],
    queryFn: async () => {
      const pairs = await getNewPairs();
      
      const tokens = pairs
        .map(pair => ({
          name: pair.baseToken?.name || pair.symbol,
          symbol: pair.baseToken?.symbol || pair.symbol,
          priceUsd: parseFloat(pair.priceUsd || pair.price.toString()),
          priceChange: parseFloat((pair.priceChange?.h24 || pair.priceChange24h).toFixed(2)),
          volume: parseFloat((pair.volume?.h24 || pair.volume24h).toFixed(2)),
          pairCreatedAt: new Date(),
          chainId: pair.chainId,
          dexId: pair.dexId,
          marketSize: Math.random() * 1000, // This would ideally be calculated from real data
          color: parseFloat((pair.priceChange?.h24 || pair.priceChange24h).toFixed(2)) > 0 ? '#22c55e' : '#ef4444'
        }))
        .sort((a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange))
        .slice(0, 15); // Increased to show more tokens
      
      return tokens;
    },
    refetchInterval: 30000
  });

  const chartHeight = 300; // Increased height for better visualization

  // ... keep existing code (Price Trends, Volume Distribution, and Price Change Analysis sections)

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Price Trends */}
      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="text-sm font-medium mb-4">Price Trends</h3>
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={trendingTokens}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="symbol" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Line type="monotone" dataKey="priceUsd" stroke="#D946EF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Volume Distribution */}
      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="text-sm font-medium mb-4">Volume Distribution</h3>
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={trendingTokens}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="symbol" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Bar dataKey="volume" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Price Change Area */}
      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="text-sm font-medium mb-4">Price Change Analysis</h3>
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart data={trendingTokens}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="symbol" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Area type="monotone" dataKey="priceChange" fill="#F97316" stroke="#F97316" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Market Distribution Bubble Map */}
      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="text-sm font-medium mb-4">Market Distribution</h3>
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="priceUsd" 
                name="Price" 
                stroke="#666"
                domain={['auto', 'auto']}
              />
              <YAxis 
                type="number" 
                dataKey="volume" 
                name="Volume" 
                stroke="#666"
                domain={['auto', 'auto']}
              />
              <ZAxis 
                type="number" 
                dataKey="marketSize" 
                range={[400, 2000]} 
                name="Market Size" 
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-black/90 p-2 rounded border border-white/10">
                        <p className="font-bold">{data.symbol}</p>
                        <p className="text-sm">Price: ${data.priceUsd.toFixed(4)}</p>
                        <p className="text-sm">Volume: ${data.volume.toLocaleString()}</p>
                        <p className={`text-sm ${data.priceChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          Change: {data.priceChange}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                data={trendingTokens}
                fill="#0EA5E9"
                fillOpacity={0.8}
                shape={(props: any) => {
                  const { cx, cy, fill, r } = props;
                  const data = props.payload;
                  return (
                    <g>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill={data.color}
                        fillOpacity={0.8}
                        stroke={data.color}
                        strokeWidth={1}
                      />
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={12}
                        dy=".3em"
                      >
                        {data.symbol}
                      </text>
                    </g>
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};
