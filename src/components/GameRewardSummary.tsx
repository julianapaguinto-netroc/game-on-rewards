import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Coins, Zap, X } from "lucide-react";
import { UserReward } from "@/context/GameContext";

interface GameRewardSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  reward: UserReward | null;
  pointsWon?: number;
}

const GameRewardSummary = ({ isOpen, onClose, reward, pointsWon }: GameRewardSummaryProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="game-card-elevated max-w-sm w-full animate-bounce-soft">
        <div className="text-center">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Celebration Icon */}
          <div className="text-6xl mb-4 animate-celebration">🎉</div>
          
          <h2 className="text-xl font-bold mb-2">Game Complete!</h2>
          
          {pointsWon && pointsWon > 0 && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Coins className="w-5 h-5 text-game-gold" />
              <span className="text-lg font-semibold text-game-gold">
                +{pointsWon.toLocaleString()} Points
              </span>
            </div>
          )}

          {reward && (
            <div className="space-y-4">
              <div className="p-4 bg-game-success/10 rounded-xl border border-game-success/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-game-success" />
                  <span className="font-semibold text-game-success">Reward Earned!</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Product:</span>
                    <span className="font-medium">{reward.title}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Company:</span>
                    <span className="font-medium">{reward.company}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Reward:</span>
                    <span className="font-semibold text-game-gold">{reward.value}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!reward && (!pointsWon || pointsWon === 0) && (
            <div className="p-4 bg-muted rounded-xl mb-4">
              <p className="text-foreground-muted">Better luck next time!</p>
              <p className="text-sm text-foreground-subtle mt-1">
                Keep playing to earn more rewards
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Continue
            </Button>
            
            <Button 
              className="flex-1 btn-game-primary"
              onClick={onClose}
            >
              <Zap className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameRewardSummary;