import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, Trophy, Gift, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { gameState } = useGame();

  const challengeIcons = {
    'spin-wheel': '🎯',
    'scratch-card': '🎫',
    'quiz': '🧠',
    'slot-machine': '🎰',
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Header with Points */}
      <div className="mobile-section">
        <div className="game-card-elevated text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="text-game-gold w-8 h-8" />
            <h1 className="text-3xl font-bold text-foreground">
              {gameState.points.toLocaleString()}
            </h1>
          </div>
          <p className="text-foreground-muted">Available Points</p>
          
          <Link to="/catalogue">
            <Button className="btn-game-primary w-full mt-4">
              <Gift className="w-5 h-5 mr-2" />
              Redeem Rewards
            </Button>
          </Link>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="mobile-section">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-brand-primary w-6 h-6" />
          <h2 className="text-xl font-semibold">Challenges to Earn Points</h2>
        </div>

        <div className="space-y-4">
          {gameState.availableChallenges.map((challenge) => (
            <Card key={challenge.id} className="game-card">
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {challengeIcons[challenge.type]}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{challenge.name}</h3>
                  <p className="text-foreground-muted text-sm mb-2">
                    {challenge.description}
                  </p>
                  
                  {challenge.isCompleted ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-game-success rounded-full"></div>
                      <span className="text-game-success text-sm font-medium">
                        Completed
                      </span>
                    </div>
                  ) : (
                    <Link to={`/challenge/${challenge.id}`}>
                      <Button size="sm" className="btn-game-primary">
                        <Zap className="w-4 h-4 mr-1" />
                        Play
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Fun Stats Section */}
      <div className="mobile-section">
        <div className="game-card text-center">
          <h3 className="font-semibold text-lg mb-3">Your Progress</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-brand-primary">
                {gameState.completedChallenges.length}
              </div>
              <div className="text-sm text-foreground-muted">
                Challenges Completed
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-game-gold">
                {gameState.points}
              </div>
              <div className="text-sm text-foreground-muted">
                Total Points Earned
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;