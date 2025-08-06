import { useState } from "react";
import { useGame, UserReward } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const symbols = ["🍒", "🍊", "🍋", "🍇", "🔔", "💎", "⭐", "🎰"];

interface SlotResult {
  symbols: string[];
  isWin: boolean;
  points: number;
}

const SlotMachine = () => {
  const { addPoints, completeChallenge, addUserReward } = useGame();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSymbols, setCurrentSymbols] = useState(["🎰", "🎰", "🎰"]);
  const [result, setResult] = useState<SlotResult | null>(null);
  const navigate = useNavigate();

  const getRandomSymbol = () => {
    return symbols[Math.floor(Math.random() * symbols.length)];
  };

  const checkWin = (reels: string[]): SlotResult => {
    const [reel1, reel2, reel3] = reels;

    // Check for three of a kind (jackpot)
    if (reel1 === reel2 && reel2 === reel3) {
      return {
        symbols: reels,
        isWin: true,
        points: 1000, // Jackpot!
      };
    }

    // Check for two of a kind
    if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
      return {
        symbols: reels,
        isWin: true,
        points: 200,
      };
    }

    // Check for special combinations
    if (reels.includes("💎") && reels.includes("⭐")) {
      return {
        symbols: reels,
        isWin: true,
        points: 500,
      };
    }

    // No win
    return {
      symbols: reels,
      isWin: false,
      points: 0,
    };
  };

  const pullLever = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Animate the spinning
    let spinCount = 0;
    const maxSpins = 20;

    const spinInterval = setInterval(() => {
      setCurrentSymbols([
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol(),
      ]);

      spinCount++;

      if (spinCount >= maxSpins) {
        clearInterval(spinInterval);

        // Final result
        const finalSymbols = [
          getRandomSymbol(),
          getRandomSymbol(),
          getRandomSymbol(),
        ];

        setCurrentSymbols(finalSymbols);
        const gameResult = checkWin(finalSymbols);
        setResult(gameResult);
        setIsSpinning(false);

        if (gameResult.isWin) {
          addPoints(gameResult.points);

          const reward: UserReward = {
            id: crypto.randomUUID(),
            type: "points",
            title: `${gameResult.points} Points from Slot Machine`,
            description: `You earned ${gameResult.points} points from the Slot Machine!`,
            company: "Slot Machine",
            value: gameResult.points.toString(),
            isActive: true,
            expiryDate: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            dateReceived: new Date().toISOString(),
            source: "slot-machine",
          };

          addUserReward(reward);
          completeChallenge("slot-machine", reward);

          if (gameResult.points === 1000) {
            toast.success("🎰 JACKPOT! 1000 points! 🎉");
          } else {
            toast.success(`You won ${gameResult.points} points! 🎉`);
          }
        } else {
          toast.info("No match this time! Better luck next time! 😔");
        }

        completeChallenge("slot-machine");
      }
    }, 100);
  };

  const handleFinish = () => {
    navigate("/");
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Header */}
      <div className="mobile-section">
        <div className="flex items-center justify-between mb-6">
          <Link to="/challenge/slot-machine">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <h1 className="text-xl font-semibold">🎰 Slot Machine</h1>
        </div>
      </div>

      {/* Slot Machine */}
      <div className="mobile-section">
        <Card className="game-card-elevated">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-6">
              Pull the lever to win!
            </h2>

            {/* Slot Machine Display */}
            <div className="bg-gradient-to-b from-brand-primary-dark to-brand-primary rounded-2xl p-6 mb-6">
              <div className="bg-black rounded-xl p-4 mb-4">
                <div className="flex justify-center items-center gap-2">
                  {currentSymbols.map((symbol, index) => (
                    <div key={index} className="relative">
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl border-4 border-game-gold shadow-lg">
                        <span className={isSpinning ? "animate-pulse" : ""}>
                          {symbol}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lever */}
              <div className="flex justify-center">
                {!result ? (
                  <Button
                    onClick={pullLever}
                    disabled={isSpinning}
                    className="btn-game-gold text-xl py-6 px-8"
                  >
                    {isSpinning ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        Spinning...
                      </div>
                    ) : (
                      <>
                        <Zap className="w-6 h-6 mr-2" />
                        Pull Lever!
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-6xl">
                      {result.isWin
                        ? result.points === 1000
                          ? "🏆"
                          : "🎉"
                        : "😔"}
                    </div>

                    <h3 className="text-2xl font-bold text-white">
                      {result.isWin
                        ? result.points === 1000
                          ? "JACKPOT!"
                          : `You Won ${result.points} Points!`
                        : "No Match!"}
                    </h3>

                    {result.isWin && (
                      <p className="text-game-gold font-semibold">
                        {result.points === 1000
                          ? "Three of a kind - Maximum payout!"
                          : currentSymbols.filter(
                              (s, i, arr) => arr.indexOf(s) !== i
                            ).length > 0
                          ? "Two of a kind - Nice win!"
                          : "Special combination!"}
                      </p>
                    )}

                    <Button onClick={handleFinish} className="btn-game-success">
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Payout Table */}
      <div className="mobile-section">
        <Card className="game-card">
          <h3 className="font-semibold mb-4">Payout Table</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-background-secondary rounded">
              <span>🎰 🎰 🎰 (Three of a kind)</span>
              <span className="font-bold text-game-gold">1000 pts</span>
            </div>

            <div className="flex justify-between items-center p-2">
              <span>💎 + ⭐ (Special combo)</span>
              <span className="font-bold text-game-gold">500 pts</span>
            </div>

            <div className="flex justify-between items-center p-2 bg-background-secondary rounded">
              <span>🍒 🍒 (Two of a kind)</span>
              <span className="font-bold text-game-gold">200 pts</span>
            </div>

            <div className="flex justify-between items-center p-2">
              <span>No match</span>
              <span className="text-foreground-muted">0 pts</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Instructions */}
      <div className="mobile-section">
        <Card className="game-card">
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ul className="text-sm text-foreground-muted space-y-1">
            <li>• Tap "Pull Lever" to spin the reels</li>
            <li>• Match symbols to win points</li>
            <li>• Three of a kind = Jackpot (1000 pts)</li>
            <li>• Each machine can only be played once</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default SlotMachine;
