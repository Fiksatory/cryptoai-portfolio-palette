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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response with stricter analysis including owner and originality checks
      const mockScore = 35;
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
          plagiarismScore: 75,
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

    // Updated regex to allow dots in repository names
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