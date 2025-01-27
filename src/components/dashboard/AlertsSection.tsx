import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInTimeZone } from 'date-fns-tz';

interface Alert {
  id: number;
  name: string;
  timestamp: number;
  action: string;
  actor: string;
}

const actors = ["Cupsey", "Wojak", "Pepe", "Diamond", "Paper", "Whale", "Degen"];
const tickers = ["SOLAPE", "BONK", "SAMO", "WIF", "MYRO", "COPE", "DUST", "MEME", "PYTH", "RAY"];

const mockAlerts = [
  { id: 1, name: "SOLAPE", timestamp: Date.now(), action: "bought", actor: "Cupsey" },
  { id: 2, name: "BONK", timestamp: Date.now(), action: "sold", actor: "Wojak" },
  { id: 3, name: "SAMO", timestamp: Date.now(), action: "bought", actor: "Pepe" },
  { id: 4, name: "WIF", timestamp: Date.now(), action: "sold", actor: "Diamond" },
  { id: 5, name: "MYRO", timestamp: Date.now(), action: "bought", actor: "Whale" },
  { id: 6, name: "COPE", timestamp: Date.now(), action: "sold", actor: "Paper" },
  { id: 7, name: "DUST", timestamp: Date.now(), action: "bought", actor: "Degen" },
];

export const AlertsSection = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [notificationCount, setNotificationCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomElement = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const updateNavCounter = (count: number) => {
    const navCounter = document.getElementById('nav-notification-count');
    if (navCounter) {
      navCounter.textContent = String(count);
    }
  };

  const generateNewAlert = () => {
    const randomTime = Math.floor(Math.random() * (10000 - 3000) + 3000);
    
    timeoutRef.current = setTimeout(() => {
      setAlerts(prevAlerts => {
        const newAlerts = [...prevAlerts];
        const firstAlert = newAlerts.shift();
        if (firstAlert) {
          const modifiedAlert = {
            ...firstAlert,
            id: Date.now(),
            name: getRandomElement(tickers),
            timestamp: Date.now(),
            action: Math.random() > 0.5 ? "bought" : "sold",
            actor: getRandomElement(actors)
          };
          newAlerts.push(modifiedAlert);
          return newAlerts;
        }
        return prevAlerts;
      });
      
      setNotificationCount(prev => {
        const newCount = prev + 1;
        updateNavCounter(newCount);
        return newCount;
      });
      
      generateNewAlert();
    }, randomTime);
  };

  useEffect(() => {
    generateNewAlert();
    setNotificationCount(1);
    updateNavCounter(1);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const formatTimestamp = (timestamp: number) => {
    return formatInTimeZone(timestamp, 'America/New_York', 'h:mm:ss a');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="bg-gradient-to-r from-neon-pink to-neon-violet bg-clip-text text-transparent text-3xl font-bold">
          Alerts Dashboard
        </div>
        {notificationCount > 0 && (
          <span className="bg-neon-pink px-2 py-0.5 rounded-full text-xs font-medium text-white animate-pulse">
            {notificationCount}
          </span>
        )}
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
        <h3 className="text-lg font-semibold mb-4">Live Token Alerts</h3>
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
                <div>
                  <span className="text-gray-400">
                    {formatTimestamp(alert.timestamp)}
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