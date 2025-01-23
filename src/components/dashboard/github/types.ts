export interface AnalysisResult {
  summary: string;
  codeQuality: string;
  potentialIssues: string[];
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
  };
}