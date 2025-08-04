import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Coins, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const Catalogue = () => {
  const { gameState } = useGame();

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Header */}
      <div className="mobile-section">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
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

        <div className="text-center mb-6">
          <Gift className="w-12 h-12 text-brand-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Reward Catalogue</h1>
          <p className="text-foreground-muted">Choose from amazing rewards</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mobile-section">
        <div className="space-y-4">
          {gameState.products.map((product) => (
            <Card key={product.id} className="game-card">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-background-secondary rounded-lg flex items-center justify-center">
                  <Gift className="w-8 h-8 text-brand-primary" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-foreground-muted text-sm">{product.brand}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-game-gold" />
                      <span className="font-semibold text-game-gold">
                        {product.cost.toLocaleString()} pts
                      </span>
                    </div>
                    
                    <Link to={`/product/${product.id}`}>
                      <Button 
                        size="sm" 
                        className="btn-game-primary"
                        disabled={gameState.points < product.cost}
                      >
                        {gameState.points >= product.cost ? "Redeem" : "Not enough points"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Need More Points */}
      <div className="mobile-section">
        <div className="game-card text-center">
          <h3 className="font-semibold mb-2">Need More Points?</h3>
          <p className="text-foreground-muted text-sm mb-4">
            Complete more challenges to earn points!
          </p>
          <Link to="/">
            <Button variant="outline" className="w-full">
              Back to Challenges
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;