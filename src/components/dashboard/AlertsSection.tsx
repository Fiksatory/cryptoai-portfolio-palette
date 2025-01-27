import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { formatInTimeZone } from 'date-fns-tz';

interface Alert {
  id: number;
  name: string;
  timestamp: number;
  action: string;
  actor: string;
  amount: number;
}

// Generate array of Smart Wallet 1-30 and High PnL 1-10
const generateWalletLabels = () => {
  const smartWallets = Array.from({ length: 30 }, (_, i) => `Smart Wallet ${i + 1}`);
  const highPnL = Array.from({ length: 10 }, (_, i) => `High PnL ${i + 1}`);
  return [...smartWallets, ...highPnL, "Ansem burner", "Whale"];
};

const actors = generateWalletLabels();
const tickers = ["PUNKS", "VINEX", "DEEPSEEK", "LILI", "LARRY", "SHY", "TRIM", "GRNLD", "2025", "BAMF", "DEEPSHIT", "FAFO", "STUPID"];

const getRandomAmount = () => {
  return Number((Math.random() * 100).toFixed(2));
};

const mockAlerts = [
  { id: 1, name: "PUNKS", timestamp: Date.now(), action: "bought", actor: "Smart Wallet 1", amount: getRandomAmount() },
  { id: 2, name: "VINEX", timestamp: Date.now(), action: "sold", actor: "Smart Wallet 2", amount: getRandomAmount() },
  { id: 3, name: "DEEPSEEK", timestamp: Date.now(), action: "bought", actor: "High PnL 1", amount: getRandomAmount() },
  { id: 4, name: "LILI", timestamp: Date.now(), action: "sold", actor: "High PnL 2", amount: getRandomAmount() },
  { id: 5, name: "LARRY", timestamp: Date.now(), action: "bought", actor: "Ansem burner", amount: getRandomAmount() },
  { id: 6, name: "SHY", timestamp: Date.now(), action: "sold", actor: "Whale", amount: getRandomAmount() },
  { id: 7, name: "TRIM", timestamp: Date.now(), action: "bought", actor: "Smart Wallet 3", amount: getRandomAmount() },
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
            actor: getRandomElement(actors),
            amount: getRandomAmount()
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
                  <span className="font-medium">
                    {alert.actor} {alert.action} {alert.amount} SOL of {alert.name}
                  </span>
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