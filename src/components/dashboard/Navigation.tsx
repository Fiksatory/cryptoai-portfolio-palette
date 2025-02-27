import { Brain, Home, LineChart, Radio, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  const navigate = useNavigate();

  const navItems = [
    { icon: TrendingUp, label: "Trending", active: activeSection === "trending" },
    { 
      icon: LineChart, 
      label: "Alerts", 
      active: activeSection === "alerts",
      extra: (
        <div className="flex gap-2 absolute right-2">
          <div 
            id="nav-notification-count" 
            className="bg-neon-pink px-2 py-0.5 rounded-full text-xs font-medium text-white animate-pulse"
          >
            0
          </div>
          <div className="bg-[#9333EA] px-2 py-0.5 rounded-full text-xs font-medium text-white">
            Soon
          </div>
        </div>
      )
    },
    { 
      icon: LineChart, 
      label: "Patterns", 
      active: activeSection === "patterns",
      extra: (
        <div className="absolute right-2 bg-[#9333EA] px-2 py-0.5 rounded-full text-xs font-medium text-white">
          Soon
        </div>
      )
    },
    { icon: Brain, label: "AI Intel", active: activeSection === "ai intel" },
    { icon: Radio, label: "Github Checker", active: activeSection === "github checker" },
    { icon: LineChart, label: "Portfolio", active: activeSection === "portfolio" },
    { 
      icon: Home, 
      label: "Home", 
      active: false,
      onClick: () => navigate('/landing')
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 bg-gradient-to-br from-neon-pink to-neon-violet rounded-xl flex items-center justify-center shadow-lg shadow-neon-pink/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold neon-glow">Laby</h2>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.onClick ? item.onClick() : setActiveSection(item.label.toLowerCase())}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 neon-border relative",
              item.active 
                ? "bg-gradient-to-r from-neon-pink/20 to-neon-violet/20 text-white shadow-lg shadow-neon-pink/10" 
                : "hover:bg-white/5"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              item.active ? "text-neon-pink" : "text-gray-400"
            )} />
            <span>{item.label}</span>
            {item.extra}
          </button>
        ))}
      </nav>
    </div>
  );
};