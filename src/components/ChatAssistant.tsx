import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchTokens, analyzePairData } from "@/services/dexscreener";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Message {
  type: 'user' | 'assistant';
  content: string;
}

export const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content: "Hi! I'm Laby AI. I can help you analyze Solana tokens. Try asking about a token like 'BONK' or 'MYRO'!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await searchTokens(userMessage);
      const analysis = analyzePairData(data);
      
      const response = `Analysis for ${userMessage}:\n\n${analysis.message}\n\nKey Metrics:\n` +
        `• Price Change (24h): ${analysis.metrics.priceChange24h.toFixed(2)}%\n` +
        `• Market Cap: $${analysis.metrics.marketCap.toLocaleString()}\n` +
        `• Volume (24h): $${analysis.metrics.volume24h.toLocaleString()}\n` +
        `• Liquidity: $${analysis.metrics.liquidity.toLocaleString()}\n` +
        `• Buy/Sell Ratio: ${analysis.metrics.buySellRatio.toFixed(2)}\n` +
        `• Total Transactions: ${analysis.metrics.totalTransactions.toLocaleString()}\n` +
        `• Market Health Score: ${analysis.metrics.healthScore}/100\n\n` +
        `Overall Sentiment: ${analysis.sentiment.toUpperCase()}`;
      
      setMessages(prev => [...prev, { type: 'assistant', content: response }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch token data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-2rem)] w-96 bg-card/80 backdrop-blur-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Laby AI Assistant</h2>
        <p className="text-sm text-muted-foreground">Your personal token analyst</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-muted text-foreground mr-4'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a token..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
