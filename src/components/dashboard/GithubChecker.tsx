import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, GitBranch, Percent, AlertCircle, Shield, GitCommit, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

interface AnalysisResult {
  summary: string;
  codeQuality: string;
  potentialIssues: string[];
  recommendations: string[];
  larpScore: number;
  metrics: {
    commitFrequency: number; // 0-100
    contributorActivity: number; // 0-100
    codeConsistency: number; // 0-100
    documentationQuality: number; // 0-100
  };
  redFlags: string[];
}

const GithubChecker = () => {
  const [githubUrl, setGithubUrl] = useState("");
  const { toast } = useToast();

  const { data: analysis, isLoading, refetch } = useQuery({
    queryKey: ['github-analysis', githubUrl],
    queryFn: async (): Promise<AnalysisResult> => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response with more detailed analysis
      const mockScore = 45; // Lower default score for stricter analysis
      return {
        summary: "Repository shows mixed signals with some concerning patterns.",
        codeQuality: "Code structure raises several red flags including inconsistent coding patterns and unusual commit history.",
        potentialIssues: [
          "Irregular commit patterns detected",
          "Suspicious contributor activity patterns",
          "Code complexity metrics are outside normal ranges",
          "Documentation appears auto-generated or AI-generated",
          "Dependencies versions are inconsistent",
          "Test coverage is suspiciously low"
        ],
        recommendations: [
          "Verify commit history authenticity",
          "Review contributor profiles and activity patterns",
          "Analyze code similarity with known templates",
          "Check for plagiarized code segments",
          "Verify documentation originality"
        ],
        larpScore: mockScore,
        metrics: {
          commitFrequency: 35,
          contributorActivity: 40,
          codeConsistency: 50,
          documentationQuality: 30
        },
        redFlags: [
          "Unusual commit timing patterns",
          "Inconsistent coding styles across files",
          "Generic or AI-generated comments",
          "Suspicious contributor profiles",
          "Code complexity doesn't match project scope"
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

    const githubUrlRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
    if (!githubUrlRegex.test(githubUrl)) {
      toast({
        title: "Invalid GitHub URL",
        description: "Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)",
        variant: "destructive",
      });
      return;
    }

    refetch();
  };

  const getLarpColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return "text-green-500";
    if (value >= 60) return "text-yellow-500";
    if (value >= 40) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6 p-4">
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
          </div>
        </div>
      </Card>

      {analysis && (
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">LARP Detection Score</h3>
              <div className="flex items-center gap-2">
                <Shield className={getLarpColor(analysis.larpScore)} />
                <span className={`text-2xl font-bold ${getLarpColor(analysis.larpScore)}`}>
                  {analysis.larpScore}%
                </span>
                <Percent className={`h-4 w-4 ${getLarpColor(analysis.larpScore)}`} />
              </div>
            </div>
            <Progress value={analysis.larpScore} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {analysis.larpScore >= 85 ? "This repository appears to be genuine and well-maintained." :
               analysis.larpScore >= 70 ? "This repository shows some concerning patterns but may be legitimate." :
               analysis.larpScore >= 50 ? "This repository requires thorough investigation before use." :
               "This repository shows strong indicators of being potentially fake or low quality."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GitCommit className={getMetricColor(analysis.metrics.commitFrequency)} />
                <span>Commit Patterns: {analysis.metrics.commitFrequency}%</span>
              </div>
              <Progress value={analysis.metrics.commitFrequency} className="h-1" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className={getMetricColor(analysis.metrics.contributorActivity)} />
                <span>Contributor Activity: {analysis.metrics.contributorActivity}%</span>
              </div>
              <Progress value={analysis.metrics.contributorActivity} className="h-1" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Red Flags</h3>
            <ul className="list-disc pl-5 space-y-2 text-red-400">
              {analysis.redFlags.map((flag, index) => (
                <li key={index}>{flag}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Detailed Analysis</h3>
            <p className="text-muted-foreground">{analysis.summary}</p>
            <p className="text-muted-foreground mt-2">{analysis.codeQuality}</p>
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