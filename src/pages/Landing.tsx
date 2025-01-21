import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-solana-dark to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-solana-primary rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-solana-secondary rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-solana-tertiary rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-4xl">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-solana-primary via-solana-secondary to-solana-tertiary bg-clip-text text-transparent animate-fade-in">
            Laby AI
          </h1>
          
          <p className="text-xl text-solana-light/90 animate-fade-in animation-delay-200">
            Your AI-powered trading companion for Solana tokens. Get real-time insights, pattern analysis, and market context.
          </p>

          <div className="flex flex-col items-center space-y-4 animate-fade-in animation-delay-400">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-solana-primary to-solana-secondary hover:opacity-90 transition-all duration-200 rounded-lg text-white font-semibold shadow-lg hover:shadow-solana-primary/20"
            >
              Enter Dashboard
            </button>
            
            <p className="text-sm text-solana-light/60">
              No wallet connection required for demo
            </p>
          </div>

          {/* Video Demo Section */}
          <div className="mt-16 relative rounded-xl overflow-hidden border border-solana-primary/20 shadow-xl animate-fade-in animation-delay-600">
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
                <div className="w-16 h-16 rounded-full bg-solana-primary/20 flex items-center justify-center mx-auto backdrop-blur-md">
                  <Play className="w-8 h-8 text-solana-primary" />
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
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-solana-primary/20 hover:border-solana-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-solana-primary/10 group">
    <h3 className="text-xl font-semibold text-solana-primary mb-3 group-hover:text-solana-secondary transition-colors">{title}</h3>
    <p className="text-solana-light/70 group-hover:text-solana-light/90 transition-colors">{description}</p>
  </div>
);

export default Landing;