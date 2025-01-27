import { Copy } from "lucide-react";
import { AnalysisResult } from "./types";

interface CodeOriginalityProps {
  codeOriginality: AnalysisResult["codeOriginality"];
}

const CodeOriginality = ({ codeOriginality }: CodeOriginalityProps) => {
  // Mock data for copied files
  const mockCopiedFiles = [
    { name: "Link 1", url: "https://github.com/example/repo1/file1" },
    { name: "Link 2", url: "https://github.com/example/repo2/file2" },
    { name: "Link 3", url: "https://github.com/example/repo3/file3" },
  ];

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
            {mockCopiedFiles.map((file, index) => (
              <li key={index}>
                <a 
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(`Viewing copied file: ${file.name}`);
                  }}
                  className="text-red-400 hover:underline cursor-pointer"
                >
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Source References:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {[
              { name: "Link 1", url: "https://github.com/example/repo1" },
              { name: "Link 2", url: "https://github.com/example/repo2" },
              { name: "Link 3", url: "https://github.com/example/repo3" },
            ].map((link, index) => (
              <li key={index}>
                <a 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CodeOriginality;