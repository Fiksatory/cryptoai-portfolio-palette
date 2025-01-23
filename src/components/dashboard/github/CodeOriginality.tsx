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
            {codeOriginality.similarRepos.map((repo, index) => (
              <li key={index}>
                <a 
                  href={`https://github.com/${repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {repo}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Copied Files:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {codeOriginality.copiedFiles.map((file, index) => (
              <li key={index} className="text-red-400">{file}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Source References:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {codeOriginality.sourceReferences.map((ref, index) => {
              // Extract repository name and similarity from the reference text
              const match = ref.match(/(\w+\/[\w-]+) \((\d+)% similarity\)/);
              if (match) {
                const [, repo, similarity] = match;
                return (
                  <li key={index}>
                    Code overlap with{" "}
                    <a 
                      href={`https://github.com/${repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {repo}
                    </a>{" "}
                    ({similarity}% similarity)
                  </li>
                );
              }
              return <li key={index}>{ref}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CodeOriginality;