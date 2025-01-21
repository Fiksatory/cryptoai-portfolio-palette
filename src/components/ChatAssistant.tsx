import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchTokens, analyzePairData } from "@/services/dexscreener";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Globe, Twitter, MessageCircle, MessagesSquare } from "lucide-react";

interface Message {
  type: 'user' | 'assistant';
  content: string;
}

export const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content: "Hi! I'm Laby AI. I analyze Solana memecoins and provide market insights. Try asking about tokens like 'BONK', 'MYRO', or 'WIF'!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatSocialLinks = (links: any) => {
    if (!links || Object.keys(links).length === 0) return "";
    
    const formattedLinks = [];
    if (links.website) formattedLinks.push(`🌐 Website: ${links.website}`);
    if (links.twitter) formattedLinks.push(`🐦 Twitter: ${links.twitter}`);
    if (links.telegram) formattedLinks.push(`📱 Telegram: ${links.telegram}`);
    if (links.discord) formattedLinks.push(`💬 Discord: ${links.discord}`);
    
    return formattedLinks.length > 0 ? "\n\nSocial Links:\n" + formattedLinks.join("\n") : "";
  };

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
      
      const response = `${analysis.marketContext}\n\nAnalysis for ${userMessage}:\n` +
        `${analysis.summary}\n\nKey Metrics:\n` +
        `• Market Cap: $${analysis.metrics.marketCap.toLocaleString()}\n` +
        `• 24h Volume/MCap: ${((analysis.metrics.volume24h / analysis.metrics.marketCap) * 100).toFixed(2)}%\n` +
        `• Buy Pressure: ${analysis.metrics.buySellRatio > 1.2 ? "High" : analysis.metrics.buySellRatio < 0.8 ? "Low" : "Neutral"}\n` +
        `• Market Health: ${analysis.metrics.healthScore}/100\n\n` +
        `Market Status: ${analysis.marketStatus}\n` +
        `Risk Level: ${analysis.riskLevel}` +
        formatSocialLinks(analysis.socialLinks);
      
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

  const renderMessage = (message: Message) => {
    const content = message.content.split('\n').map((line, i) => {
      if (line.startsWith('🌐 Website:') || 
          line.startsWith('🐦 Twitter:') || 
          line.startsWith('📱 Telegram:') || 
          line.startsWith('💬 Discord:')) {
        const url = line.split(': ')[1];
        return (
          <a 
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline block"
          >
            {line}
          </a>
        );
      }
      return <div key={i}>{line}</div>;
    });

    return (
      <div className={`max-w-[80%] rounded-lg p-3 ${
        message.type === 'user'
          ? 'bg-primary text-primary-foreground ml-4'
          : 'bg-muted text-foreground mr-4'
      }`}>
        {content}
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-2rem)] w-96 bg-card/80 backdrop-blur-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Laby AI Assistant</h2>
        <p className="text-sm text-muted-foreground">Solana Memecoin Market Analyst</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {renderMessage(message)}
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a memecoin..."
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