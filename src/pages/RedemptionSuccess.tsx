import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Copy, Share, Home } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const RedemptionSuccess = () => {
  const { gameState } = useGame();
  const { productId } = useParams<{ productId: string }>();
  
  const product = gameState.products.find(p => p.id === productId);
  
  // Generate a random voucher code
  const voucherCode = `RWD${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  const copyVoucherCode = () => {
    navigator.clipboard.writeText(voucherCode);
    toast.success("Voucher code copied to clipboard!");
  };

  const shareVoucher = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I got a reward!',
        text: `I just redeemed ${product?.name} using the Reward Games app!`,
      });
    } else {
      toast.info("Sharing not supported on this device");
    }
  };

  if (!product) {
    return (
      <div className="mobile-container bg-background min-h-screen">
        <div className="text-center mt-20">
          <h1 className="text-xl font-semibold">Product not found</h1>
          <Link to="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Success Animation */}
      <div className="mobile-section text-center">
        <div className="animate-celebration mb-6">
          <CheckCircle className="w-20 h-20 text-game-success mx-auto mb-4" />
        </div>
        
        <h1 className="text-3xl font-bold text-game-success mb-2">
          Congratulations! 🎉
        </h1>
        <p className="text-foreground-muted">
          You have successfully redeemed your reward!
        </p>
      </div>

      {/* Product Details */}
      <div className="mobile-section">
        <Card className="game-card-elevated text-center">
          <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
          
          <div className="p-6 bg-gradient-gold rounded-2xl mb-6 text-center">
            <h3 className="font-semibold mb-4">Your Voucher Code</h3>
            <div className="text-3xl font-bold font-mono bg-white/20 rounded-lg p-4 mb-4">
              {voucherCode}
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button
                onClick={copyVoucherCode}
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              
              <Button
                onClick={shareVoucher}
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Steps to Use */}
      <div className="mobile-section">
        <Card className="game-card">
          <h3 className="font-semibold mb-4">How to use your voucher:</h3>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Visit the store</p>
                <p className="text-sm text-foreground-muted">Go to any participating {product.brand} location</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Show your code</p>
                <p className="text-sm text-foreground-muted">Present the voucher code at checkout</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Enjoy your reward!</p>
                <p className="text-sm text-foreground-muted">Valid for 30 days from today</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="mobile-section space-y-3">
        <Link to="/">
          <Button className="btn-game-primary w-full">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <Link to="/catalogue">
          <Button variant="outline" className="w-full">
            Redeem More Rewards
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RedemptionSuccess;