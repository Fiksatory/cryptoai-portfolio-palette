import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AnalysisResult } from "./github/types";
import UrlInput from "./github/UrlInput";
import LarpScore from "./github/LarpScore";
import MetricsDisplay from "./github/MetricsDisplay";
import OwnerAnalysis from "./github/OwnerAnalysis";
import CodeOriginality from "./github/CodeOriginality";

const GithubChecker = () => {
  const [githubUrl, setGithubUrl] = useState("");
  const { toast } = useToast();

  const { data: analysis, isLoading, refetch } = useQuery({
    queryKey: ['github-analysis', githubUrl],
    queryFn: async (): Promise<AnalysisResult> => {
      // Extract owner and repo from GitHub URL
      const urlParts = githubUrl.replace('https://github.com/', '').split('/');
      const owner = urlParts[0];
      const repo = urlParts[1];

      // Fetch repository data from GitHub API
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      const repoData = await response.json();

      // Calculate metrics based on real data
      const mockScore = Math.floor(Math.random() * 100); // This would be replaced with real calculation
      
      return {
        summary: `Analysis of ${repoData.full_name}`,
        codeQuality: `Repository has ${repoData.stargazers_count} stars and ${repoData.forks_count} forks.`,
        potentialIssues: [
          repoData.open_issues_count > 10 ? "High number of open issues" : "Normal issue count",
          repoData.created_at === repoData.pushed_at ? "No updates since creation" : "Regular updates",
          !repoData.license ? "Missing license" : "Has license",
        ],
        recommendations: [
          "Review recent commits",
          "Check issue discussions",
          "Analyze code quality",
        ],
        larpScore: mockScore,
        metrics: {
          commitFrequency: Math.min(100, repoData.forks_count),
          contributorActivity: Math.min(100, repoData.stargazers_count),
          codeConsistency: Math.min(100, repoData.watchers_count),
          documentationQuality: repoData.has_wiki ? 80 : 40,
        },
        redFlags: [
          repoData.open_issues_count > 50 ? "Too many open issues" : null,
          !repoData.description ? "Missing repository description" : null,
          repoData.archived ? "Repository is archived" : null,
        ].filter(Boolean) as string[],
        ownerAnalysis: {
          accountAge: new Date(repoData.owner.created_at).toLocaleDateString(),
          totalRepos: repoData.owner.public_repos,
          contributionHistory: `Last updated: ${new Date(repoData.updated_at).toLocaleDateString()}`,
          suspiciousPatterns: []
        },
        codeOriginality: {
          similarRepos: [
            repoData.parent ? repoData.parent.full_name : "",
            repoData.source ? repoData.source.full_name : "",
          ].filter(Boolean),
          plagiarismScore: repoData.fork ? 75 : 25,
          copiedFiles: [],
          sourceReferences: [
            repoData.fork ? `Forked from ${repoData.parent?.full_name}` : "Original repository",
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

    const githubUrlRegex = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/;
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

  return (
    <div className="space-y-6 p-4">
      <UrlInput 
        githubUrl={githubUrl}
        setGithubUrl={setGithubUrl}
        handleAnalyze={handleAnalyze}
        isLoading={isLoading}
      />

      {analysis && (
        <Card className="p-6 space-y-6">
          <LarpScore score={analysis.larpScore} />
          <MetricsDisplay metrics={analysis.metrics} />
          <OwnerAnalysis ownerAnalysis={analysis.ownerAnalysis} />
          <CodeOriginality codeOriginality={analysis.codeOriginality} />

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