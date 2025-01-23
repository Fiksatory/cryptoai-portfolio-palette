import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, GitBranch, Percent, AlertCircle, Shield, GitCommit, Users, Copy, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

interface AnalysisResult {
  summary: string;
  codeQuality: string;
  potentialIssues: string[];
  recommendations: string[];
  larpScore: number;
  metrics: {
    commitFrequency: number;
    contributorActivity: number;
    codeConsistency: number;
    documentationQuality: number;
  };
  redFlags: string[];
  ownerAnalysis: {
    accountAge: string;
    totalRepos: number;
    contributionHistory: string;
    suspiciousPatterns: string[];
  };
  codeOriginality: {
    similarRepos: string[];
    plagiarismScore: number;
    copiedFiles: string[];
    sourceReferences: string[];
  };
}

const GithubChecker = () => {
  const [githubUrl, setGithubUrl] = useState("");
  const { toast } = useToast();

  const { data: analysis, isLoading, refetch } = useQuery({
    queryKey: ['github-analysis', githubUrl],
    queryFn: async (): Promise<AnalysisResult> => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response with stricter analysis including owner and originality checks
      const mockScore = 35; // Even lower default score for stricter analysis
      return {
        summary: "Repository shows significant red flags and potential code copying.",
        codeQuality: "Multiple issues detected including possible plagiarism and suspicious patterns.",
        potentialIssues: [
          "High code similarity with existing repositories",
          "Suspicious commit patterns and timing",
          "Inconsistent coding styles across files",
          "Auto-generated or AI-generated documentation",
          "Unusual dependency patterns",
          "Missing or superficial tests"
        ],
        recommendations: [
          "Conduct thorough code originality check",
          "Review owner's contribution history",
          "Analyze commit message patterns",
          "Verify documentation authenticity",
          "Check for code attribution"
        ],
        larpScore: mockScore,
        metrics: {
          commitFrequency: 30,
          contributorActivity: 25,
          codeConsistency: 40,
          documentationQuality: 35
        },
        redFlags: [
          "Multiple code segments copied from other repositories",
          "Owner account shows suspicious patterns",
          "Inconsistent commit history",
          "Generic documentation likely AI-generated",
          "Unusual repository creation patterns"
        ],
        ownerAnalysis: {
          accountAge: "2 months",
          totalRepos: 3,
          contributionHistory: "Sporadic activity with unusual patterns",
          suspiciousPatterns: [
            "Recently created account",
            "Multiple repositories with similar code",
            "No meaningful contributions to other projects",
            "Unusual activity timing"
          ]
        },
        codeOriginality: {
          similarRepos: [
            "original-repo/source-1",
            "another-source/project-2"
          ],
          plagiarismScore: 75, // percentage of potentially copied code
          copiedFiles: [
            "src/main.js",
            "lib/utils.js",
            "components/core.js"
          ],
          sourceReferences: [
            "Found matching code in repository A (85% similarity)",
            "Multiple functions copied from repository B",
            "Documentation copied from project C"
          ]
        }
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
            <h3 className="text-xl font-semibold mb-4">Repository Owner Analysis</h3>
            <div className="space-y-4 bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Account Age: {analysis.ownerAnalysis.accountAge}</span>
              </div>
              <div>
                <span>Total Repositories: {analysis.ownerAnalysis.totalRepos}</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Suspicious Patterns:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.ownerAnalysis.suspiciousPatterns.map((pattern, index) => (
                    <li key={index} className="text-red-400">{pattern}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Code Originality Analysis</h3>
            <div className="space-y-4 bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Copy className="h-5 w-5" />
                <span className="text-red-400">Plagiarism Score: {analysis.codeOriginality.plagiarismScore}%</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Similar Repositories:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.codeOriginality.similarRepos.map((repo, index) => (
                    <li key={index}>{repo}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Copied Files:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.codeOriginality.copiedFiles.map((file, index) => (
                    <li key={index} className="text-red-400">{file}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Source References:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.codeOriginality.sourceReferences.map((ref, index) => (
                    <li key={index}>{ref}</li>
                  ))}
                </ul>
              </div>
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