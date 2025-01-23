import { AnalysisResult } from "./types";

interface CodeOriginalityProps {
  codeOriginality: AnalysisResult;
}

const CodeOriginality = ({ codeOriginality }: CodeOriginalityProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Code Analysis</h3>
      <div className="space-y-4 bg-secondary/10 p-4 rounded-lg">
        <div>
          <p className="text-muted-foreground">{codeOriginality.codeQuality}</p>
        </div>
      </div>
    </div>
  );
};

export default CodeOriginality;