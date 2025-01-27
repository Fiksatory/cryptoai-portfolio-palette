import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNavigate } from 'react-router-dom';
import { Play, Twitter } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';

const Landing = () => {
  const navigate = useNavigate();
  const { connected } = useWallet();

  const handleDashboardAccess = () => {
    navigate('/dashboard');
  };

  const handleXClick = () => {
    window.open('https://twitter.com/LabyAI', '_blank');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-neon-pink rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-neon-violet rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-neon-purple rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Wallet Button and Twitter Button */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={handleXClick}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-pink to-neon-violet hover:opacity-90 transition-all duration-200 rounded-md"
        >
          <Twitter className="w-5 h-5" />
          <span className="hidden sm:inline">Twitter</span>
        </button>
        <WalletMultiButton className="!bg-gradient-to-r from-neon-pink to-neon-violet hover:opacity-90 transition-all duration-200" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-4xl">
          <h1 className="text-7xl font-black font-orbitron tracking-wider neon-glow animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-neon-pink via-neon-violet to-neon-purple">
            Laby AI
          </h1>
          
          <p className="text-xl text-gray-300/90 animate-fade-in animation-delay-200">
            Your AI-powered trading companion for Solana tokens. Get real-time insights, pattern analysis, and market context.
          </p>

          <div className="flex flex-col items-center space-y-4 animate-fade-in animation-delay-400">
            <button
              onClick={handleDashboardAccess}
              className="px-8 py-4 bg-gradient-to-r from-neon-pink to-neon-violet hover:opacity-90 transition-all duration-200 rounded-lg text-white font-semibold shadow-lg hover:shadow-neon-pink/20"
            >
              Enter Dashboard
            </button>
            
            <p className="text-sm text-gray-400/60">
              {connected ? 'Wallet connected - Ready to enter' : 'Connect wallet to unlock all features'}
            </p>
          </div>

          {/* Video Demo Section */}
          <div className="mt-16 relative rounded-xl overflow-hidden glass-card animate-fade-in animation-delay-600">
            <video 
              className="w-full aspect-video object-cover rounded-xl"
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src="/demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-black/30">
              <div className="text-center space-y-4 transform transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-neon-pink/20 flex items-center justify-center mx-auto backdrop-blur-md">
                  <Play className="w-8 h-8 text-neon-pink" />
                </div>
                <p className="text-lg font-medium text-white">Watch Demo</p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in animation-delay-800">
            <FeatureCard
              title="AI Contract Analysis"
              description="Get instant insights on any Solana token contract. Our AI analyzes tokenomics, liquidity patterns, and potential risks in real-time."
            />
            <FeatureCard
              title="Pattern Recognition"
              description="Advanced pattern detection system identifies market trends, breakouts, and volume surges across trending Solana pairs."
            />
            <FeatureCard
              title="Market Context"
              description="Comprehensive market metrics including volume analysis, manipulation detection, and real-time social sentiment tracking."
            />
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center bg-background/80 backdrop-blur-sm border-t border-neon-violet/20">
        <p className="text-sm text-gray-400/60">
          © {new Date().getFullYear()} Laby AI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="glass-card p-6 rounded-xl hover:border-neon-pink/40 transition-all duration-300 hover:shadow-lg hover:shadow-neon-pink/10 group">
    <h3 className="text-xl font-semibold text-neon-pink mb-3 group-hover:text-neon-violet transition-colors">{title}</h3>
    <p className="text-gray-300/70 group-hover:text-gray-300/90 transition-colors">{description}</p>
  </div>
);

export default Landing;
