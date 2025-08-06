import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, Trophy, Gift, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import CompanyCommanders from "@/components/CompanyCommanders";

const Index = () => {
  const { gameState } = useGame();

const gameIcons = {
  'spin-wheel': '🎯',
  'scratch-card': '🎫',
  'quiz': '🧠',
  'slot-machine': '🎰',
};

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Header with Points */}
      <div className="mobile-section">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome Back!</h1>
            <p className="text-foreground-muted">Ready for some games?</p>
          </div>
          
          <Link to="/catalogue">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="text-game-gold w-5 h-5" />
                <span className="text-xl font-bold">{gameState.points.toLocaleString()}</span>
              </div>
              <Button variant="outline" size="sm">
                <Gift className="w-3 h-3 mr-1" />
                Rewards
              </Button>
            </div>
          </Link>
        </div>
      </div>

      {/* Company Commanders Section */}
      <CompanyCommanders />

      {/* Available Games */}
      <div className="mobile-section">
        <h2 className="text-lg font-semibold mb-4">Available Games</h2>
        <div className="space-y-4">
          {gameState.availableChallenges.map((challenge) => (
            <Card key={challenge.id} className="game-card">
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {gameIcons[challenge.type]}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{challenge.name}</h3>
                  <p className="text-sm text-foreground-muted mb-2">{challenge.description}</p>
                  
                  {challenge.isCompleted ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-game-success rounded-full"></div>
                      <span className="text-sm text-game-success font-medium">
                        Completed
                      </span>
                    </div>
                  ) : (
                    <Link to={`/challenge/${challenge.id}`}>
                      <Button className="btn-game-primary w-full">
                        <Zap className="w-4 h-4 mr-2" />
                        Play Game
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mobile-section">
        <Card className="game-card">
          <h3 className="font-semibold mb-4">Your Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-muted">Games Completed</span>
              <span className="font-semibold">{gameState.completedChallenges.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-muted">Total Points Earned</span>
              <span className="font-semibold text-game-gold">{gameState.points.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;