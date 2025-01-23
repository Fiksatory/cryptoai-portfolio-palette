import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: number;
  name: string;
  price: string;
  change: string;
  timestamp: number;
  action: string;
  actor: string;
}

const actors = ["Cupsey", "Wojak", "Pepe", "Diamond", "Paper", "Whale", "Degen"];
const tickers = ["SOLAPE", "BONK", "SAMO", "WIF", "MYRO", "COPE", "DUST", "MEME", "PYTH", "RAY"];

// Mock data for token alerts with actions
const mockAlerts = [
  { id: 1, name: "SOLAPE", price: "$0.00023", change: "+15.5%", timestamp: Date.now(), action: "bought", actor: "Cupsey" },
  { id: 2, name: "BONK", price: "$0.00012", change: "+8.2%", timestamp: Date.now(), action: "sold", actor: "Wojak" },
  { id: 3, name: "SAMO", price: "$0.0065", change: "+12.1%", timestamp: Date.now(), action: "bought", actor: "Pepe" },
  { id: 4, name: "WIF", price: "$0.0089", change: "-5.3%", timestamp: Date.now(), action: "sold", actor: "Diamond" },
  { id: 5, name: "MYRO", price: "$0.00034", change: "+22.7%", timestamp: Date.now(), action: "bought", actor: "Whale" },
  { id: 6, name: "COPE", price: "$0.0045", change: "-3.8%", timestamp: Date.now(), action: "sold", actor: "Paper" },
  { id: 7, name: "DUST", price: "$0.00078", change: "+9.4%", timestamp: Date.now(), action: "bought", actor: "Degen" },
];

export const AlertsSection = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [notificationCount, setNotificationCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomElement = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  useEffect(() => {
    const scheduleNextAlert = () => {
      // Random time between 3 and 10 seconds
      const randomTime = Math.floor(Math.random() * (10000 - 3000) + 3000);
      
      timeoutRef.current = setTimeout(() => {
        // Rotate alerts by moving the first item to the end
        setAlerts(prevAlerts => {
          const newAlerts = [...prevAlerts];
          const firstAlert = newAlerts.shift();
          if (firstAlert) {
            // Create a new alert with random actor, action, and ticker
            const modifiedAlert = {
              ...firstAlert,
              id: Date.now(),
              name: getRandomElement(tickers),
              price: `$${(Math.random() * 0.001).toFixed(8)}`,
              change: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 25).toFixed(1)}%`,
              timestamp: Date.now(),
              action: Math.random() > 0.5 ? "bought" : "sold",
              actor: getRandomElement(actors)
            };
            newAlerts.push(modifiedAlert);
            return newAlerts;
          }
          return prevAlerts;
        });
        
        // Increment notification count by 1 for each new alert
        setNotificationCount(prev => prev + 1);
        
        // Schedule the next alert
        scheduleNextAlert();
      }, randomTime);
    };

    // Start the alert cycle
    scheduleNextAlert();

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-neon-pink to-neon-violet bg-clip-text text-transparent text-3xl font-bold">
        Alerts Dashboard
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 glass-card">
          <h3 className="text-lg font-semibold mb-2">Price Alerts</h3>
          <p className="text-gray-400">Configure price movement notifications</p>
        </Card>
        <Card className="p-4 glass-card">
          <h3 className="text-lg font-semibold mb-2">Volume Alerts</h3>
          <p className="text-gray-400">Set up volume threshold alerts</p>
        </Card>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          Live Token Alerts
          {notificationCount > 0 && (
            <span className="bg-neon-pink px-2 py-0.5 rounded-full text-xs font-medium text-white animate-pulse">
              {notificationCount}
            </span>
          )}
        </h3>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 bg-black/20 rounded-lg transition-all duration-300 hover:bg-black/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-neon-pink" />
                  <span className="font-medium">{alert.actor} {alert.action} {alert.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">{alert.price}</span>
                  <span className={cn(
                    "font-medium",
                    alert.change.startsWith("+") ? "text-green-400" : "text-red-400"
                  )}>
                    {alert.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};