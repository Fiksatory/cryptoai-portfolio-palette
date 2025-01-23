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
        const urlParts = githubUrl.replace('https://github.com/', '').split('/');
        if (urlParts.length !== 2) throw new Error('Invalid GitHub URL format');

        const owner = urlParts[0];
        const repo = urlParts[1];

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

        // Fetch contributor data with error handling
        const contributorsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`, { headers });
        let contributorsData = [];
        if (contributorsResponse.ok) {
          contributorsData = await contributorsResponse.json();
        }

        // Fetch commit activity with error handling
        const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`, { headers });
        let commitsData = [];
        if (commitsResponse.ok) {
          commitsData = await commitsResponse.json();
        }

        // Calculate metrics with fallbacks
        const totalCommits = Array.isArray(commitsData) 
          ? commitsData.reduce((acc: number, week: any) => acc + (week?.total || 0), 0) 
          : 0;
        const commitFrequency = Math.min(100, (totalCommits / 52) * 10);
        const contributorActivity = Math.min(100, (contributorsData?.length || 0) * 10);
        const codeConsistency = Math.min(100, repoData.watchers_count || 0);
        const documentationQuality = repoData.has_wiki ? 80 : 40;

        const larpScore = Math.floor(
          (commitFrequency + contributorActivity + codeConsistency + documentationQuality) / 4
        );

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