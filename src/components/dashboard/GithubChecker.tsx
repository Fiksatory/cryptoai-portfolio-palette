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
      
      // Mock response with more reasonable plagiarism detection
      const mockScore = 65;
      return {
        summary: "Repository shows some concerning patterns that warrant review.",
        codeQuality: "Some specific implementations appear to be derived from other projects.",
        potentialIssues: [
          "Custom implementation similarities with existing repositories",
          "Specific business logic overlap",
          "Unique feature implementations matching other projects",
          "Similar non-standard patterns"
        ],
        recommendations: [
          "Review specific custom implementations",
          "Verify unique feature implementations",
          "Check business logic originality",
          "Document code attribution where appropriate"
        ],
        larpScore: mockScore,
        metrics: {
          commitFrequency: 60,
          contributorActivity: 55,
          codeConsistency: 70,
          documentationQuality: 65
        },
        redFlags: [
          "Specific implementation details matching other projects",
          "Unique utility functions copied without attribution",
          "Custom hooks with identical implementation",
          "Project-specific configurations copied directly"
        ],
        ownerAnalysis: {
          accountAge: "8 months",
          totalRepos: 12,
          contributionHistory: "Regular activity with some gaps",
          suspiciousPatterns: [
            "Similar custom implementations across repositories",
            "Identical project-specific configurations",
            "Copied unique feature implementations"
          ]
        },
        codeOriginality: {
          similarRepos: [
            "trpc/trpc",
            "prisma/prisma",
            "remix-run/remix",
            "supabase/supabase"
          ],
          plagiarismScore: 35,
          copiedFiles: [
            "src/features/auth/customHooks.ts",
            "lib/database/queries.ts",
            "components/custom/DataGrid.tsx"
          ],
          sourceReferences: [
            "Custom authentication flow similar to trpc/trpc (45% similarity)",
            "Database query patterns matching prisma/prisma (38% similarity)",
            "Unique routing implementation from remix-run/remix (32% similarity)",
            "Custom data fetching logic from supabase/supabase (28% similarity)"
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