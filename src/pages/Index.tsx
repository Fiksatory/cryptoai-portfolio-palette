import AiDashboard from "@/components/AiDashboard";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center flex items-center justify-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-violet rounded-xl flex items-center justify-center shadow-lg shadow-neon-pink/20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-orbitron font-bold neon-glow">
          Laby AI
        </h1>
      </div>

      <div className="space-y-8">
        <div className="flex-1">
          <AiDashboard />
        </div>
      </div>
    </div>
  );
};

export default Index;