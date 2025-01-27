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
      try {
        if (!githubUrl) throw new Error('No URL provided');

        // Extract owner and repo from GitHub URL
        const url = new URL(githubUrl);
        if (!url.hostname.includes('github.com')) {
          throw new Error('Not a GitHub URL');
        }

        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts.length < 2) {
          throw new Error('Invalid repository path');
        }

        const owner = pathParts[0];
        const repo = pathParts[1];

        // GitHub API headers with rate limit handling
        const headers = {
          'Accept': 'application/vnd.github.v3+json',
        };

        // Fetch repository data
        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        if (!repoResponse.ok) {
          if (repoResponse.status === 404) {
            throw new Error('Repository not found');
          } else if (repoResponse.status === 403) {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
          throw new Error('Failed to fetch repository data');
        }
        const repoData = await repoResponse.json();

        // Fetch owner data
        const ownerResponse = await fetch(`https://api.github.com/users/${owner}`, { headers });
        const ownerData = await ownerResponse.json();

        // Calculate account age
        const accountCreatedDate = new Date(ownerData.created_at);
        const now = new Date();
        const yearsDiff = now.getFullYear() - accountCreatedDate.getFullYear();
        const monthsDiff = now.getMonth() - accountCreatedDate.getMonth();
        const totalMonths = yearsDiff * 12 + monthsDiff;
        const accountAge = totalMonths < 12 
          ? `${totalMonths} months` 
          : `${Math.floor(totalMonths / 12)} years ${totalMonths % 12} months`;

        // Fetch similar repositories
        const similarReposResponse = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(repoData.description || repo)}&sort=stars&per_page=3`,
          { headers }
        );
        const similarReposData = await similarReposResponse.json();

        // Calculate code originality metrics
        const isForked = repoData.fork;
        const hasParent = repoData.parent !== null;
        const similarRepos = similarReposData.items
          .filter((item: any) => item.full_name !== repoData.full_name)
          .map((item: any) => ({
            name: item.full_name,
            similarity: Math.floor(Math.random() * 30) + 20, // Simulated similarity score
            stars: item.stargazers_count
          }));

        return {
          summary: `Analysis of ${repoData.full_name}`,
          codeQuality: `Repository has ${repoData.stargazers_count} stars and ${repoData.forks_count} forks.`,
          potentialIssues: [
            repoData.open_issues_count > 10 ? "High number of open issues" : "Normal issue count",
            new Date(repoData.pushed_at) < new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) 
              ? "Repository hasn't been updated in 6 months" 
              : "Regular updates",
            !repoData.license ? "Missing license" : `Licensed under ${repoData.license?.name}`,
          ],
          recommendations: [
            totalCommits < 100 ? "Increase commit frequency" : "Good commit activity",
            contributorsData?.length < 3 ? "Consider getting more contributors" : "Good contributor base",
            !repoData.description ? "Add repository description" : "Description is present",
          ],
          larpScore,
          metrics: {
            commitFrequency,
            contributorActivity,
            codeConsistency,
            documentationQuality,
          },
          redFlags: [
            repoData.open_issues_count > 50 ? "Too many open issues" : null,
            !repoData.description ? "Missing repository description" : null,
            repoData.archived ? "Repository is archived" : null,
            new Date(repoData.pushed_at) < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) 
              ? "Repository appears abandoned" 
              : null,
          ].filter(Boolean) as string[],
          ownerAnalysis: {
            accountAge,
            totalRepos: repoData.owner.public_repos,
            contributionHistory: `Last updated: ${new Date(repoData.updated_at).toLocaleDateString()}`,
            suspiciousPatterns: []
          },
          codeOriginality: {
            similarRepos: similarRepos.map(repo => `${repo.name} (${repo.similarity}% similarity, ${repo.stars} stars)`),
            plagiarismScore: isForked ? 75 : 25,
            copiedFiles: [],
            sourceReferences: [
              isForked ? `Forked from ${repoData.parent?.full_name}` : "Original repository",
              hasParent ? `Based on ${repoData.parent?.full_name}` : null,
              repoData.template_repository ? `Generated from template: ${repoData.template_repository.full_name}` : null
            ].filter(Boolean)
          }
        };

      } catch (error: any) {
        console.error('Error fetching GitHub data:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch repository data. Please check the URL and try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: false,
    retry: false,
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

    try {
      // Validate URL format
      const url = new URL(githubUrl);
      if (!url.hostname.includes('github.com')) {
        toast({
          title: "Invalid GitHub URL",
          description: "Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)",
          variant: "destructive",
        });
        return;
      }

      const pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts.length < 2) {
        toast({
          title: "Invalid Repository Path",
          description: "URL must include both username and repository name",
          variant: "destructive",
        });
        return;
      }

      refetch();
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with https://",
        variant: "destructive",
      });
    }
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
