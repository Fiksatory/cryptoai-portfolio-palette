import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GitBranch, Loader2, RefreshCw } from "lucide-react";

interface UrlInputProps {
  githubUrl: string;
  setGithubUrl: (url: string) => void;
  handleAnalyze: () => void;
  handleRefresh: () => void;
  isLoading: boolean;
}

const UrlInput = ({ githubUrl, setGithubUrl, handleAnalyze, handleRefresh, isLoading }: UrlInputProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">GitHub Repository Analyzer</h2>
        <p className="text-muted-foreground">
          Enter a GitHub repository URL for deep analysis of authenticity and code quality
        </p>
        
        <div className="flex gap-4">
          <Input
            placeholder="https://github.com/username/repository"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleAnalyze}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GitBranch className="mr-2 h-4 w-4" />
            )}
            Analyze
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UrlInput;