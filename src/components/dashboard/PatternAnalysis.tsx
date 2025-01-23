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
          marketSize: Math.random() * 1000 // This would ideally be calculated from real data
        }))
        .sort((a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange))
        .slice(0, 10);
      
      return tokens;
    },
    refetchInterval: 30000
  });

  const chartHeight = 200;

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

      {/* Market Distribution Bubble Chart */}
      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="text-sm font-medium mb-4">Market Distribution</h3>
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="priceUsd" name="Price" stroke="#666" />
              <YAxis dataKey="volume" name="Volume" stroke="#666" />
              <ZAxis dataKey="marketSize" range={[100, 1000]} name="Market Size" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter
                data={trendingTokens}
                fill="#0EA5E9"
                fillOpacity={0.8}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};