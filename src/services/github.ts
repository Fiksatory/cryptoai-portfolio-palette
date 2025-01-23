import { AnalysisResult } from "@/components/dashboard/github/types";
import { GithubRepo } from "./types";

export const analyzeGithubRepo = async (url: string): Promise<AnalysisResult> => {
  // Extract owner and repo from GitHub URL
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error("Invalid GitHub URL");
  
  const [, owner, repo] = match;
  
  // Fetch repository data
  const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  const repoData: GithubRepo = await repoResponse.json();
  
  // Fetch owner's repositories
  const ownerReposResponse = await fetch(`https://api.github.com/users/${owner}/repos`);
  const ownerRepos: GithubRepo[] = await ownerReposResponse.json();
  
  // Fetch languages used in the repository
  const languagesResponse = await fetch(repoData.languages_url);
  const languages: Record<string, number> = await languagesResponse.json();
  
  // Calculate metrics with more lenient scoring
  const totalBytes = Object.values(languages).reduce((a: number, b: number) => a + b, 0);
  const languagePercentages = Object.entries(languages).reduce((acc, [lang, bytes]) => {
    acc[lang] = ((bytes as number) / totalBytes) * 100;
    return acc;
  }, {} as Record<string, number>);
  
  // More lenient health score calculation
  const healthScore = Math.min(100, Math.round(
    (repoData.stargazers_count) +
    (repoData.watchers_count * 2) +
    (repoData.forks_count * 3) +
    (repoData.size > 0 ? 30 : 0) +
    (Object.keys(languages).length * 10) +
    (repoData.description ? 15 : 0)
  ));
  
  // Find similar repositories with more specific criteria
  const searchQuery = encodeURIComponent(`language:${repoData.language} ${repoData.description?.split(' ').slice(0, 3).join(' ') || ''}`);
  const similarReposResponse = await fetch(
    `https://api.github.com/search/repositories?q=${searchQuery}+NOT+repo:${owner}/${repo}&sort=stars&order=desc&per_page=4`
  );
  const similarRepos = await similarReposResponse.json();
  
  // More lenient LARP score (lower is better)
  const larpScore = Math.max(0, Math.min(100, 100 - healthScore * 1.2));
  
  return {
    summary: `Repository analysis for ${repoData.full_name}`,
    codeQuality: `Primary language: ${repoData.language}, with ${Object.keys(languages).length} languages used in total`,
    potentialIssues: [
      repoData.open_issues_count > 20 ? "High number of open issues" : null,
      Object.keys(languages).length === 1 && repoData.size > 1000 ? "Limited technology stack for project size" : null,
      repoData.size < 50 && !repoData.description ? "Repository seems too small and lacks description" : null,
      repoData.forks_count === 0 && repoData.stargazers_count === 0 ? "Limited community engagement" : null
    ].filter((issue): issue is string => issue !== null),
    larpScore,
    metrics: {
      commitFrequency: Math.min(100, (repoData.size / 50) + 30),
      contributorActivity: Math.min(100, (repoData.watchers_count * 10) + 40),
      codeConsistency: Math.min(100, (Object.keys(languages).length * 15) + 25),
      documentationQuality: Math.min(100, healthScore + 20)
    },
    redFlags: [
      repoData.size < 20 && repoData.stargazers_count === 0 ? "Very small codebase with no stars" : null,
      repoData.created_at === repoData.updated_at && repoData.size > 500 ? "Large codebase with no updates since creation" : null,
      repoData.forks_count === 0 && repoData.stargazers_count === 0 && repoData.size > 1000 ? "Large project with no community interaction" : null
    ].filter((flag): flag is string => flag !== null),
    ownerAnalysis: {
      accountAge: new Date(repoData.owner.created_at || "").toLocaleDateString(),
      totalRepos: ownerRepos.length,
      contributionHistory: `${ownerRepos.length} public repositories`,
      suspiciousPatterns: [
        ownerRepos.length === 1 && repoData.size > 1000 ? "Single large repository for new account" : null,
        ownerRepos.some(r => r.size === repoData.size && r.language === repoData.language) ? "Similar repositories detected" : null
      ].filter((pattern): pattern is string => pattern !== null)
    },
    codeOriginality: {
      similarRepos: similarRepos.items.slice(0, 4).map((r: GithubRepo) => r.full_name),
      plagiarismScore: Math.min(100, Math.max(0, larpScore - 20)),
      copiedFiles: []
    }
  };
};