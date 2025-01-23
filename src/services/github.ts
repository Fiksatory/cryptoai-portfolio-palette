import { AnalysisResult } from "@/components/dashboard/github/types";
import { GithubRepo } from "./types";

export const analyzeGithubRepo = async (url: string): Promise<AnalysisResult> => {
  // Extract owner and repo from GitHub URL
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error("Invalid GitHub URL");
  
  const [, owner, repo] = match;
  
  // Fetch repository data
  const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!repoResponse.ok) {
    throw new Error("Repository not found or API rate limit exceeded");
  }
  const repoData: GithubRepo = await repoResponse.json();
  
  // Fetch owner's repositories for pattern analysis
  const ownerReposResponse = await fetch(`https://api.github.com/users/${owner}/repos?per_page=100`);
  const ownerRepos: GithubRepo[] = await ownerReposResponse.json();
  
  // Fetch languages used in the repository
  const languagesResponse = await fetch(repoData.languages_url);
  const languages: Record<string, number> = await languagesResponse.json();
  
  // Fetch commit history
  const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`);
  const commits = await commitsResponse.json();
  
  // Fetch contributors
  const contributorsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`);
  const contributors = await contributorsResponse.json();

  // Fetch repository contents
  const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
  const contents = await contentsResponse.json();

  // Calculate metrics
  const totalBytes = Object.values(languages).reduce((a: number, b: number) => a + b, 0);
  const languagePercentages = Object.entries(languages).reduce((acc, [lang, bytes]) => {
    acc[lang] = ((bytes as number) / totalBytes) * 100;
    return acc;
  }, {} as Record<string, number>);

  // Calculate comprehensive health score
  const healthScore = Math.min(100, Math.round(
    (repoData.stargazers_count * 2) +
    (repoData.watchers_count * 3) +
    (repoData.forks_count * 4) +
    (commits.length > 50 ? 20 : commits.length / 2.5) +
    (contributors.length * 5) +
    (Object.keys(languages).length * 5) +
    (repoData.description ? 10 : 0) +
    (contents.filter((c: any) => c.name.toLowerCase().includes('readme')).length > 0 ? 15 : 0) +
    (contents.filter((c: any) => c.name.toLowerCase().includes('test')).length > 0 ? 10 : 0)
  ));

  // Calculate LARP score (inverse of health score with additional factors)
  const larpScore = Math.max(0, Math.min(100, 100 - (healthScore * 0.8) + 
    (commits.length < 10 ? 30 : 0) +
    (contributors.length === 1 ? 20 : 0) +
    (repoData.created_at === repoData.updated_at ? 25 : 0)
  ));

  return {
    summary: `Comprehensive analysis of ${repoData.full_name} reveals a ${healthScore > 70 ? 'healthy' : 'concerning'} repository with ${commits.length} commits from ${contributors.length} contributors. ${
      repoData.description || 'No description provided.'
    }`,
    codeQuality: `Primary language is ${repoData.language || 'not specified'}, utilizing ${Object.keys(languages).length} different languages. The codebase shows ${
      commits.length > 50 ? 'active' : 'limited'
    } development with ${commits.length} commits and ${contributors.length} contributors. ${
      contents.filter((c: any) => c.name.toLowerCase().includes('test')).length > 0 
        ? 'Tests are present, indicating quality control.' 
        : 'No tests found, which might indicate quality concerns.'
    }`,
    potentialIssues: [
      repoData.open_issues_count > 20 ? `High number of open issues (${repoData.open_issues_count})` : null,
      commits.length < 10 ? "Very few commits indicate potential copy-paste project" : null,
      contributors.length === 1 && repoData.size > 1000 ? "Large codebase with single contributor" : null,
      !contents.some((c: any) => c.name.toLowerCase().includes('readme')) ? "Missing README documentation" : null,
      !contents.some((c: any) => c.name.toLowerCase().includes('test')) ? "No test files found" : null,
      Object.keys(languages).length === 1 && repoData.size > 1000 ? "Large monolithic codebase" : null,
      repoData.created_at === repoData.updated_at ? "No updates since creation" : null
    ].filter((issue): issue is string => issue !== null),
    larpScore,
    metrics: {
      commitFrequency: Math.min(100, (commits.length / 100) * 100),
      contributorActivity: Math.min(100, (contributors.length / 10) * 100),
      codeConsistency: Math.min(100, 100 - (Object.keys(languages).length > 5 ? (Object.keys(languages).length - 5) * 10 : 0)),
      documentationQuality: Math.min(100, (
        (contents.some((c: any) => c.name.toLowerCase().includes('readme')) ? 50 : 0) +
        (contents.some((c: any) => c.name.toLowerCase().includes('docs')) ? 30 : 0) +
        (repoData.description ? 20 : 0)
      ))
    },
    redFlags: [
      repoData.size < 20 && repoData.stargazers_count === 0 ? "Suspiciously small codebase" : null,
      repoData.created_at === repoData.updated_at && repoData.size > 500 ? "Large codebase with no updates" : null,
      commits.length < 5 && repoData.size > 1000 ? "Large codebase with very few commits" : null,
      contributors.length === 1 && commits.length < 5 && repoData.size > 500 ? "Large single-commit repository" : null
    ].filter((flag): flag is string => flag !== null),
    ownerAnalysis: {
      accountAge: new Date(repoData.owner.created_at).toLocaleDateString(),
      totalRepos: ownerRepos.length,
      contributionHistory: `Owner has ${ownerRepos.length} public repositories with an average of ${
        Math.round(ownerRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0) / ownerRepos.length)
      } stars per repository`,
      suspiciousPatterns: [
        ownerRepos.length === 1 && repoData.size > 1000 ? "Single large repository for new account" : null,
        ownerRepos.some(r => r.size === repoData.size && r.language === repoData.language && r.full_name !== repoData.full_name) ? 
          "Multiple repositories with identical size and language" : null,
        ownerRepos.filter(r => new Date(r.created_at).toDateString() === new Date(repoData.created_at).toDateString()).length > 3 ?
          "Multiple repositories created on the same day" : null
      ].filter((pattern): pattern is string => pattern !== null)
    }
  };
};