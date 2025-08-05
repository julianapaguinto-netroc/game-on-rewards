import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Zap, Trophy, Coins } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const ChallengeDetail = () => {
  const { gameState } = useGame();
  const { id } = useParams<{ id: string }>();
  
  const challenge = gameState.availableChallenges.find(c => c.id === id);
  
  if (!challenge) {
    return (
      <div className="mobile-container bg-background min-h-screen">
        <div className="text-center mt-20">
          <h1 className="text-xl font-semibold">Challenge not found</h1>
          <Link to="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const challengeIcons = {
    'spin-wheel': '🎯',
    'scratch-card': '🎫',
    'quiz': '🧠',
    'slot-machine': '🎰',
  };

  const gameRoutes = {
    'spin-wheel': '/game/spin-wheel',
    'scratch-card': '/game/scratch-card',
    'quiz': '/game/quiz',
    'slot-machine': '/game/slot-machine',
  };

  // Quiz specific questions for calculating total points
  const quizQuestions = [
    { points: 200 },
    { points: 300 },
    { points: 250 },
  ];

  const possibleRewards = challenge.type === 'quiz' ? [
    { reward: `Perfect Score: ${quizQuestions.reduce((sum, q) => sum + q.points, 0)} Points`, icon: "🏆", type: "points" },
    { reward: "Partial Points Based on Correct Answers", icon: "💎", type: "points" },
    { reward: "0 Points if No Correct Answers", icon: "😔", type: "nothing" },
  ] : [
    { reward: "100 Points", icon: "💎", type: "points" },
    { reward: "500 Points", icon: "💰", type: "points" },
    { reward: "1000 Points", icon: "🏆", type: "points" },
    { reward: "Spin Again", icon: "🔄", type: "bonus" },
    { reward: "Better luck next time", icon: "😔", type: "nothing" },
  ];

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
      </div>

      {/* Challenge Details */}
      <div className="mobile-section">
        <Card className="game-card-elevated text-center">
          <div className="text-6xl mb-4">
            {challengeIcons[challenge.type]}
          </div>
          
          <h1 className="text-2xl font-bold mb-2">{challenge.name}</h1>
          <p className="text-foreground-muted mb-6">{challenge.description}</p>

          {challenge.isCompleted ? (
            <div className="flex items-center justify-center gap-2 p-4 bg-game-success/10 rounded-xl mb-6">
              <Trophy className="w-5 h-5 text-game-success" />
              <span className="font-semibold text-game-success">Challenge Completed!</span>
            </div>
          ) : (
            <Link to={gameRoutes[challenge.type]}>
              <Button className="btn-game-primary w-full text-lg py-4">
                <Zap className="w-5 h-5 mr-2" />
                Play Challenge
              </Button>
            </Link>
          )}
        </Card>
      </div>

      {/* Possible Outcomes */}
      <div className="mobile-section">
        <h2 className="text-lg font-semibold mb-4">Possible Outcomes</h2>
        <div className="space-y-3">
          {possibleRewards.map((reward, index) => (
            <Card key={index} className="game-card">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{reward.icon}</div>
                <div className="flex-1">
                  <span className="font-medium">{reward.reward}</span>
                </div>
                {reward.type === "points" && (
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-game-gold" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="mobile-section">
        <Card className="game-card">
          <h3 className="font-semibold mb-2">Rules</h3>
          <ul className="text-sm text-foreground-muted space-y-1">
            <li>• Each challenge can only be played once</li>
            <li>• Points are added to your account immediately</li>
            <li>• "Spin Again" gives you another chance</li>
            <li>• Have fun and good luck! 🍀</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default ChallengeDetail;