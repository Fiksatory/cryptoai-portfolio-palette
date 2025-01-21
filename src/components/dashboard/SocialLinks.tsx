import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SocialLinksProps {
  tokenData: any;
  isLoading: boolean;
}

export const SocialLinks = ({ tokenData, isLoading }: SocialLinksProps) => {
  return (
    <Card className="bg-black/40 border-white/10 p-4">
      {isLoading ? (
        <div className="text-center text-gray-400">Analyzing contract...</div>
      ) : !tokenData ? (
        <div className="text-center text-gray-400">
          Enter a contract address to see AI insights
        </div>
      ) : (
        <div className="space-y-3">
          {tokenData.socialLinks && Object.entries(tokenData.socialLinks).map(([platform, url]) => (
            <div key={platform} className="flex items-center gap-4">
              <Badge className="bg-purple-500 capitalize">{platform}</Badge>
              <a 
                href={url as string} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline"
              >
                {url as string}
              </a>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};