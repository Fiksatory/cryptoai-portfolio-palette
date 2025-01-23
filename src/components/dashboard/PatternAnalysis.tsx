import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getNewPairs } from "@/services/dexscreener";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
        .slice(0, 30); // Increased to show more tokens
      
      return tokens;
    },
    refetchInterval: 30000
  });

  const chartHeight = 300;

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
      <Card className="bg-black/40 border-white/10 p-4 relative">
        <h3 className="text-sm font-medium mb-4">Market Distribution</h3>
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading...</div>
        ) : (
          <div className="relative w-full h-[300px] overflow-hidden">
            {trendingTokens?.map((token, index) => {
              const randomX = Math.random() * 90 + 5; // 5-95% of width
              const randomY = Math.random() * 90 + 5; // 5-95% of height
              const size = (token.marketSize / 1000) * 60 + 40; // 40-100px based on market size

              return (
                <div
                  key={token.symbol}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out"
                  style={{
                    left: `${randomX}%`,
                    top: `${randomY}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                >
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-medium relative group"
                    style={{
                      backgroundColor: token.color,
                      opacity: 0.8,
                    }}
                  >
                    <span className="z-10">{token.symbol}</span>
                    <div className="absolute opacity-0 group-hover:opacity-100 bg-black/90 p-2 rounded border border-white/10 text-xs whitespace-nowrap z-20 left-1/2 -translate-x-1/2 -top-12 transition-opacity">
                      <p className="font-bold">{token.symbol}</p>
                      <p>Price: ${token.priceUsd.toFixed(4)}</p>
                      <p>Volume: ${token.volume.toLocaleString()}</p>
                      <p className={token.priceChange > 0 ? 'text-green-500' : 'text-red-500'}>
                        Change: {token.priceChange}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
