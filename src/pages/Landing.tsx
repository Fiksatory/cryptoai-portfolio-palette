import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-solana-dark to-black flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-3xl">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-solana-primary to-solana-secondary bg-clip-text text-transparent">
          Solana Memecoin Tracker
        </h1>
        
        <p className="text-xl text-solana-light/80">
          Track your favorite Solana memecoins in real-time.
        </p>

        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-solana-primary hover:bg-solana-secondary transition-colors duration-200 rounded-lg text-white font-semibold"
          >
            Enter Dashboard
          </button>
          
          <p className="text-sm text-solana-light/60">
            No wallet connection required for demo
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Real-time Tracking"
            description="Monitor your memecoin portfolio with live price updates and performance metrics"
          />
          <FeatureCard
            title="Portfolio Analytics"
            description="Visualize your investments with detailed charts and asset allocation insights"
          />
          <FeatureCard
            title="AI Assistant"
            description="Get real-time insights and analysis for any Solana token"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="p-6 rounded-xl bg-solana-dark/50 backdrop-blur-sm border border-solana-primary/20 hover:border-solana-primary/40 transition-colors">
    <h3 className="text-xl font-semibold text-solana-primary mb-2">{title}</h3>
    <p className="text-solana-light/70">{description}</p>
  </div>
);

export default Landing;