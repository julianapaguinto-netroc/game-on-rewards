import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const Catalogue = () => {
  const { gameState } = useGame();

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Header */}
      <div className="mobile-section">
        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center gap-2">
            <Coins className="text-game-gold w-5 h-5" />
            <span className="font-semibold">{gameState.points.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <Gift className="w-12 h-12 text-brand-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold">My Reward Catalogue</h1>
          <p className="text-foreground-muted">Choose from amazing rewards</p>
        </div>
      </div>

      {/* Product List (stacked style like your screenshot) */}
      <div className="mobile-section space-y-3">
        {gameState.products.map((product) => (
          <Card key={product.id} className="game-card px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Left: Icon or image */}
              <div className="w-12 h-12 bg-background-secondary rounded-md flex items-center justify-center">
                <Gift className="w-6 h-6 text-brand-primary" />
              </div>

              {/* Middle: Title and info */}
              <div className="flex-1">
                <h3 className="text-base font-medium">{product.name}</h3>
                <p className="text-sm text-foreground-muted">{product.brand}</p>

                <div className="flex items-center gap-1 mt-1 text-sm text-game-gold font-semibold">
                  <Coins className="w-4 h-4" />
                  {product.cost.toLocaleString()} pts
                </div>
              </div>

              {/* Right: Button */}
              <Link to={`/product/${product.id}`}>
                <Button
                  size="sm"
                  className="btn-game-primary"
                  disabled={gameState.points < product.cost}
                >
                  {gameState.points >= product.cost ? "Redeem" : "Insufficient"}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Need More Points */}
      <div className="mobile-section mt-6">
        <div className="game-card text-center">
          <h3 className="font-semibold mb-2">Need More Points?</h3>
          <p className="text-foreground-muted text-sm mb-4">
            Complete more challenges to earn points!
          </p>
          <Link to="/index">
            <Button variant="outline" className="w-full">
              Go to Challenges
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
