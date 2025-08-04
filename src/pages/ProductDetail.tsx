import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Coins, Gift } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProductDetail = () => {
  const { gameState, redeemProduct } = useGame();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const product = gameState.products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="mobile-container bg-background min-h-screen">
        <div className="text-center mt-20">
          <h1 className="text-xl font-semibold">Product not found</h1>
          <Link to="/catalogue">
            <Button className="mt-4">Back to Catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleRedeem = () => {
    const success = redeemProduct(product.id);
    if (success) {
      toast.success("Product redeemed successfully!");
      navigate(`/redemption-success/${product.id}`);
    } else {
      toast.error("Not enough points to redeem this product");
    }
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Header */}
      <div className="mobile-section">
        <div className="flex items-center justify-between mb-6">
          <Link to="/catalogue">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Coins className="text-game-gold w-5 h-5" />
            <span className="font-semibold">{gameState.points.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mobile-section">
        <Card className="game-card-elevated">
          <div className="text-center mb-6">
            <div className="w-32 h-32 bg-background-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Gift className="w-16 h-16 text-brand-primary" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-foreground-muted">{product.brand}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-foreground-muted">{product.description}</p>
            </div>

            <div className="flex items-center justify-center gap-2 p-4 bg-background-secondary rounded-xl">
              <Coins className="w-6 h-6 text-game-gold" />
              <span className="text-2xl font-bold text-game-gold">
                {product.cost.toLocaleString()} Points
              </span>
            </div>

            <Button
              onClick={handleRedeem}
              disabled={gameState.points < product.cost}
              className="btn-game-primary w-full text-lg py-4"
            >
              {gameState.points >= product.cost 
                ? "Redeem Now" 
                : `Need ${(product.cost - gameState.points).toLocaleString()} more points`
              }
            </Button>
          </div>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="mobile-section">
        <Card className="game-card">
          <h3 className="font-semibold mb-2">How to use your voucher</h3>
          <ul className="text-sm text-foreground-muted space-y-1">
            <li>• Present the voucher code at checkout</li>
            <li>• Valid for 30 days from redemption</li>
            <li>• Cannot be combined with other offers</li>
            <li>• One voucher per transaction</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;