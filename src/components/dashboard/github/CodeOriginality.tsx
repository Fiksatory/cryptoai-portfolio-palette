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
              <li key={index}>{repo}</li>
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
            {codeOriginality.sourceReferences.map((ref, index) => (
              <li key={index}>{ref}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CodeOriginality;