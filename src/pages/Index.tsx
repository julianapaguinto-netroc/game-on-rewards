import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, Trophy, Gift, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import CompanyCommanders from "@/components/CompanyCommanders";

const Index = () => {
  const { gameState } = useGame();

  const gameIcons = {
    "spin-wheel": "🎯",
    "scratch-card": "🎫",
    quiz: "🧠",
    "slot-machine": "🎰",
  };

  const latestReward = gameState.userRewards?.length
    ? gameState.userRewards[gameState.userRewards.length - 1]
    : null;

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Header with Points */}
      <div className="mobile-section">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#a42138] to-[#cc4b5e] p-5 rounded-b-3xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl text-white font-bold">Welcome Back!</h1>
            <Button variant="ghost" size="icon" className="text-white">
              <Coins className="w-5 h-5" />
            </Button>
          </div>
          <Card className="border border-[#a42138] rounded-xl p-4 text-white shadow-md">
            <div className="text-sm text-gray-600">Your Points</div>
            <div className="text-2xl font-bold flex items-center gap-2 mt-1">
              <Coins className="text-game-gold w-5 h-5" />
              <span className="text-xl text-game-gold font-bold">
                {gameState.points.toLocaleString()}
              </span>
            </div>
          </Card>
        </div>

        {/* Show latest reward */}
        {latestReward && (
          <Card className="game-card bg-[#fef3c7] border border-yellow-400 mb-4">
            <div className="text-sm">
              🎉 You earned a reward:{" "}
              <strong>
                {latestReward.title} from {latestReward.company}
              </strong>
              <br />
              <span className="text-xs text-muted-foreground">
                Received on{" "}
                {new Date(latestReward.dateReceived).toLocaleDateString()}
              </span>
            </div>
          </Card>
        )}
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
                <div className="text-4xl">{gameIcons[challenge.type]}</div>

                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{challenge.name}</h3>
                  <p className="text-sm text-foreground-muted mb-2">
                    {challenge.description}
                  </p>

                  {challenge.isCompleted ? (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-game-success rounded-full"></div>
                        <span className="text-sm text-game-success font-medium">
                          Completed
                        </span>
                      </div>

                      {/* Show latest reward for this challenge type */}
                      {gameState.userRewards
                        .filter((reward) => reward.source === challenge.type) // assuming you store `source` in reward
                        .slice(-1) // get latest one
                        .map((reward) => (
                          <div
                            key={reward.id}
                            className="text-xs text-muted-foreground"
                          >
                            🎁 <strong>{reward.title}</strong> from{" "}
                            {reward.company}
                          </div>
                        ))}
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

      {/* Rewards List */}
      {/* {gameState.userRewards && gameState.userRewards.length > 0 && (
        <div className="mobile-section">
          <h2 className="text-lg font-semibold mb-2">Your Rewards</h2>
          <div className="space-y-2">
            {gameState.userRewards.map((reward) => (
              <Card
                key={reward.id}
                className="game-card border border-primary pl-4"
              >
                <div className="text-sm">
                  🏆 <strong>{reward.title}</strong> ({reward.type})
                  <br />
                  <span className="text-xs text-muted-foreground">
                    From {reward.company} on{" "}
                    {new Date(reward.dateReceived).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )} */}

      {/* Progress Section */}
      <div className="mobile-section">
        <Card className="game-card">
          <h3 className="font-semibold mb-4">Your Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-muted">
                Games Completed
              </span>
              <span className="font-semibold">
                {gameState.completedChallenges.length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-muted">
                Total Points Earned
              </span>
              <span className="font-semibold text-game-gold">
                {gameState.points.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
