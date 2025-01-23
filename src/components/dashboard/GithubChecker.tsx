import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, GitBranch } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AnalysisResult {
  summary: string;
  codeQuality: string;
  potentialIssues: string[];
  recommendations: string[];
}

const GithubChecker = () => {
  const [githubUrl, setGithubUrl] = useState("");
  const { toast } = useToast();

  const { data: analysis, isLoading, refetch } = useQuery({
    queryKey: ['github-analysis', githubUrl],
    queryFn: async (): Promise<AnalysisResult> => {
      // This is a mock response for now
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        summary: "This appears to be a well-structured React application with good component organization.",
        codeQuality: "The code follows modern React practices and uses TypeScript effectively.",
        potentialIssues: [
          "Some components might benefit from further decomposition",
          "Consider adding more comprehensive error handling",
          "Test coverage could be improved"
        ],
        recommendations: [
          "Add unit tests for critical components",
          "Implement proper error boundaries",
          "Consider adding documentation for complex functions"
        ]
      };
    },
    enabled: false,
  });

  const handleAnalyze = async () => {
    if (!githubUrl) {
      toast({
        title: "Error",
        description: "Please enter a GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    if (!githubUrl.includes('github.com')) {
      toast({
        title: "Error",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    refetch();
  };

  return (
    <div className="space-y-6 p-4">
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">GitHub Repository Analyzer</h2>
          <p className="text-muted-foreground">
            Enter a GitHub repository URL to analyze its code quality and structure
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
          </div>
        </div>
      </Card>

      {analysis && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <p className="text-muted-foreground">{analysis.summary}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Code Quality</h3>
            <p className="text-muted-foreground">{analysis.codeQuality}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Potential Issues</h3>
            <ul className="list-disc pl-5 space-y-2">
              {analysis.potentialIssues.map((issue, index) => (
                <li key={index} className="text-muted-foreground">{issue}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Recommendations</h3>
            <ul className="list-disc pl-5 space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-muted-foreground">{rec}</li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GithubChecker;