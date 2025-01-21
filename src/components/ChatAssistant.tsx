import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { searchTokens, analyzePairData } from "@/services/dexscreener";
import { MessageList } from "./chat/MessageList";
import { ChatInput } from "./chat/ChatInput";
import { Message } from "./chat/types";

export const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content: "Hi! I'm Laby AI. I analyze Solana memecoins and provide market insights. Try asking about tokens like 'BONK', 'MYRO', or 'WIF'! You can also ask me for help or type 'clear' to reset our chat."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatSocialLinks = (links: any) => {
    if (!links || Object.keys(links).length === 0) return "";
    
    const formattedLinks = [];
    if (links.website) formattedLinks.push(`Website: ${links.website}`);
    if (links.twitter) formattedLinks.push(`Twitter: ${links.twitter}`);
    if (links.telegram) formattedLinks.push(`Telegram: ${links.telegram}`);
    if (links.discord) formattedLinks.push(`Discord: ${links.discord}`);
    
    return formattedLinks.length > 0 ? "\n\nSocial Links:\n" + formattedLinks.join("\n") : "";
  };

  const handleCommand = (command: string): boolean => {
    const lowerCommand = command.toLowerCase().trim();
    
    if (lowerCommand === 'clear') {
      setMessages([{
        type: 'assistant',
        content: "Chat history cleared. How can I help you analyze Solana memecoins?"
      }]);
      return true;
    }
    
    if (lowerCommand === 'help') {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: "Here's how I can help:\n• Analyze any Solana memecoin (e.g., 'Tell me about BONK')\n• Show market metrics and social links\n• Type 'clear' to reset our chat\n• Ask for specific metrics like market cap or volume"
      }]);
      return true;
    }
    
    return false;
  };

  const isContractAddress = (text: string): boolean => {
    // Check if the text matches Solana address format (base58 string, typically 32-44 characters)
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(text.trim());
  };

  const isTokenAnalysisRequest = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    // First check if it's a contract address
    if (isContractAddress(text)) return true;
    // Then check for token-related keywords
    const tokenKeywords = ['price', 'token', 'coin', 'market', 'analyze', 'check', 'how is', 'what about'];
    return tokenKeywords.some(keyword => lowerText.includes(keyword)) || text.toUpperCase() === text;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInput('');

    // Check for commands first
    if (handleCommand(userMessage)) return;

    // Auto-analyze if it's a contract address, otherwise check if it's a token analysis request
    if (isContractAddress(userMessage) || isTokenAnalysisRequest(userMessage)) {
      setIsLoading(true);

      try {
        const data = await searchTokens(userMessage);
        const analysis = analyzePairData(data);
        
        const response = `Analysis for ${isContractAddress(userMessage) ? 'Contract' : userMessage}:\n` +
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
    } else {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: "I'm specialized in analyzing Solana memecoins. Please ask me about specific tokens, paste a contract address, or type 'help' to see what I can do!"
      }]);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-2rem)] w-96 bg-card/80 backdrop-blur-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Laby AI Assistant</h2>
        <p className="text-sm text-muted-foreground">Solana Memecoin Market Analyst</p>
      </div>
      
      <MessageList messages={messages} />
      
      <ChatInput 
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};