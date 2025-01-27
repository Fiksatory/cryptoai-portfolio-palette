import AiDashboard from "@/components/AiDashboard";
import { useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  useEffect(() => {
    toast("Coming Soon!", {
      description: "Token gated access and supply amounts will be announced shortly after migration.",
      duration: 5000,
      position: "top-center",
      className: "bg-black/90 border-2 border-neon-violet/50 shadow-lg shadow-neon-pink/20 transform scale-110",
      descriptionClassName: "text-gray-100 font-medium",
      style: {
        minWidth: '400px',
      },
    });
  }, []);

  return (
    <div className="container py-6 min-h-screen">
      <AiDashboard />
    </div>
  );
};

export default Index;