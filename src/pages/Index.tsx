import AiDashboard from "@/components/AiDashboard";
import { useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  useEffect(() => {
    toast("Coming Soon!", {
      description: "Token gated access and supply amounts will be announced shortly after migration.",
      duration: 5000,
      className: "bg-black border border-neon-violet/20",
      descriptionClassName: "text-gray-300",
    });
  }, []);

  return (
    <div className="container py-6 min-h-screen">
      <AiDashboard />
    </div>
  );
};

export default Index;