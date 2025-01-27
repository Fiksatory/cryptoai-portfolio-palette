import { Copy } from "lucide-react";
import { AnalysisResult } from "./types";

interface CodeOriginalityProps {
  codeOriginality: AnalysisResult["codeOriginality"];
}

const CodeOriginality = ({ codeOriginality }: CodeOriginalityProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Code Originality Analysis</h3>
      <div className="space-y-4 bg-secondary/10 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Copy className="h-5 w-5" />
          <span className="text-red-400">Plagiarism Score: {codeOriginality.plagiarismScore}%</span>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Similar Repositories:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {codeOriginality.similarRepos.map((repo, index) => {
              // Extract repository name from the similarity string
              const repoMatch = repo.match(/^([^(]+)/);
              const repoName = repoMatch ? repoMatch[1].trim() : repo;
              
              return (
                <li key={index}>
                  <a 
                    href={`https://github.com/${repoName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {repo}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Copied Files:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {codeOriginality.copiedFiles.map((file, index) => (
              <li key={index}>
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(`Viewing copied file: ${file}`);
                  }}
                  className="text-red-400 hover:underline cursor-pointer"
                >
                  {file}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Source References:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {codeOriginality.sourceReferences.map((ref, index) => {
              // Extract repository name if it's a fork reference
              const forkMatch = ref.match(/Forked from ([\w-]+\/[\w-]+)/);
              const baseMatch = ref.match(/Based on ([\w-]+\/[\w-]+)/);
              const templateMatch = ref.match(/Generated from template: ([\w-]+\/[\w-]+)/);
              
              let repoName = null;
              if (forkMatch) repoName = forkMatch[1];
              else if (baseMatch) repoName = baseMatch[1];
              else if (templateMatch) repoName = templateMatch[1];

              return (
                <li key={index}>
                  {repoName ? (
                    <span>
                      {ref.split(repoName)[0]}
                      <a 
                        href={`https://github.com/${repoName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {repoName}
                      </a>
                      {ref.split(repoName)[1]}
                    </span>
                  ) : (
                    ref
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CodeOriginality;