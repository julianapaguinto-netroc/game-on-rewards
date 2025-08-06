import { useState, useRef, useEffect } from "react";
import { useGame, UserReward } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ScratchResult {
  text?: string;
  points?: number;
  isSpecial?: boolean;
  rewardType?: "points" | "discount" | "offer" | "none";
  rewardValue?: string;
}

const scratchResults: ScratchResult[] = [
  { text: "100 Points", points: 100, rewardType: "points", rewardValue: "100" },
  { text: "500 Points", points: 500, rewardType: "points", rewardValue: "500" },
  {
    text: "1000 Points",
    points: 1000,
    rewardType: "points",
    rewardValue: "1000",
  },
  { text: "Scratch Again", points: 0, isSpecial: true },
  { text: "Better luck next time", points: 0, rewardType: "none" },
  { text: "20% Discount", rewardType: "discount", rewardValue: "20%" },
];

const ScratchCard = () => {
  const { addPoints, completeChallenge, resetChallenge, addUserReward } =
    useGame();
  const [isScratched, setIsScratched] = useState(false);
  const [result, setResult] = useState<ScratchResult | null>(null);
  const [scratchProgress, setScratchProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    initializeCard();
  }, []);

  const initializeCard = () => {
    const canvas = canvasRef.current;
    const resultCanvas = resultCanvasRef.current;

    if (!canvas || !resultCanvas) return;

    const ctx = canvas.getContext("2d");
    const resultCtx = resultCanvas.getContext("2d");

    if (!ctx || !resultCtx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 200;
    resultCanvas.width = 300;
    resultCanvas.height = 200;

    // Draw scratch-off surface (silver metallic look)
    const gradient = ctx.createLinearGradient(0, 0, 300, 200);
    gradient.addColorStop(0, "#c0c0c0");
    gradient.addColorStop(0.5, "#e8e8e8");
    gradient.addColorStop(1, "#a8a8a8");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 200);

    // Add scratch instruction text
    ctx.fillStyle = "#666";
    ctx.font = "bold 16px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Scratch here to reveal", 150, 80);
    ctx.fillText("your prize!", 150, 100);
    ctx.fillText("🪙", 150, 130);

    // Draw result (hidden initially)
    const randomResult =
      scratchResults[Math.floor(Math.random() * scratchResults.length)];
    console.log("Selected scratch result:", randomResult);
    setResult(randomResult);

    resultCtx.fillStyle = "#4ade80";
    resultCtx.fillRect(0, 0, 300, 200);

    resultCtx.fillStyle = "#ffffff";
    resultCtx.font = "bold 24px Poppins, sans-serif";
    resultCtx.textAlign = "center";
    resultCtx.fillText(randomResult.text, 150, 100);

    if (randomResult.points && randomResult.points > 0) {
      resultCtx.font = "bold 32px Poppins, sans-serif";
      resultCtx.fillText("🎉", 150, 140);
    } else if (randomResult.rewardType === "discount") {
      resultCtx.font = "bold 32px Poppins, sans-serif";
      resultCtx.fillText("🏷️", 150, 140);
    } else if (randomResult.rewardType === "offer") {
      resultCtx.font = "bold 32px Poppins, sans-serif";
      resultCtx.fillText("🎁", 150, 140);
    } else if (randomResult.isSpecial) {
      resultCtx.font = "bold 32px Poppins, sans-serif";
      resultCtx.fillText("🎯", 150, 140);
    } else {
      resultCtx.font = "bold 32px Poppins, sans-serif";
      resultCtx.fillText("😔", 150, 140);
    }
  };

  const handleScratch = (e: React.TouchEvent | React.MouseEvent) => {
    if (isScratched) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    // Create scratch effect
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();

    // Check scratch progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const progress = transparentPixels / (canvas.width * canvas.height);
    setScratchProgress(progress);

    if (progress > 0.4 && !isScratched) {
      setIsScratched(true);
      handleReveal();
    }
  };

  const handleReveal = () => {
    if (!result) return;

    // Special case
    if (result.isSpecial) {
      toast.success("Spin Again! You get another chance! 🎯");
      resetChallenge("scratch-card");
      return;
    }

    // If there's a reward (points, discount, or product)
    if (result.rewardType && result.rewardValue) {
      const reward: UserReward = {
        id: crypto.randomUUID(),
        type: result.rewardType,
        title:
          result.rewardType === "points"
            ? `${result.rewardValue} Points Reward`
            : result.rewardType === "discount"
            ? `${result.rewardValue} Discount`
            : result.rewardValue,
        description:
          result.rewardType === "points"
            ? `You earned ${result.rewardValue} points from the Scratch Card!`
            : result.rewardType === "discount"
            ? `You earned a ${result.rewardValue} discount from the Scratch Card!`
            : `You won ${result.rewardValue} from the Scratch Card!`,
        company: "Scratch Rewards",
        value: result.rewardValue,
        isActive: true,
        expiryDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days
        dateReceived: new Date().toISOString(),
        source: "scratch-card",
      };

      if (result.rewardType === "points" && result.points) {
        addPoints(result.points);
        toast.success(`You won ${result.points} points! 🎉`);
      } else if (result.rewardType === "discount") {
        toast.success(`You won a ${result.rewardValue} discount! 🏷️`);
      } else if (result.rewardType === "offer") {
        toast.success(`You won: ${result.rewardValue}! 🎁`);
      }

      completeChallenge("scratch-card", reward);
    } else {
      toast.info("Better luck next time! 😔");
      completeChallenge("scratch-card");
    }
  };

  const handleFinish = () => {
    navigate("/");
  };

  const resetCard = () => {
    setIsScratched(false);
    setResult(null);
    setScratchProgress(0);
    initializeCard();
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Header */}
      <div className="mobile-section">
        <div className="flex items-center justify-between mb-6">
          <Link to="/challenge/scratch-card">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <h1 className="text-xl font-semibold">🎫 Scratch Card</h1>
        </div>
      </div>

      {/* Scratch Card */}
      <div className="mobile-section">
        <Card className="game-card-elevated">
          <div className="relative flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">
              Scratch to reveal your prize!
            </h2>

            <div className="relative">
              {/* Result layer (behind) */}
              <canvas
                ref={resultCanvasRef}
                className="absolute top-0 left-0 rounded-lg"
                style={{ width: "300px", height: "200px" }}
              />

              {/* Scratch layer (top) */}
              <canvas
                ref={canvasRef}
                className="relative rounded-lg cursor-pointer touch-none"
                style={{ width: "300px", height: "200px" }}
                onMouseMove={(e) => e.buttons === 1 && handleScratch(e)}
                onTouchMove={handleScratch}
                onMouseDown={handleScratch}
                onTouchStart={handleScratch}
              />
            </div>

            {/* Progress indicator */}
            {scratchProgress > 0 && scratchProgress < 0.4 && (
              <div className="mt-4 w-full max-w-xs">
                <div className="bg-background-secondary rounded-full h-2">
                  <div
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(scratchProgress * 250, 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-foreground-muted text-center mt-2">
                  Keep scratching... {Math.round(scratchProgress * 250)}%
                </p>
              </div>
            )}

            {/* Result actions */}
            {isScratched && result && (
              <div className="mt-6 text-center space-y-4">
                <div className="text-6xl">
                  {result.isSpecial
                    ? "🎯"
                    : result.rewardType === "points"
                    ? "🎉"
                    : result.rewardType === "discount"
                    ? "🏷️"
                    : result.rewardType === "offer"
                    ? "🎁"
                    : "😔"}
                </div>

                <h3 className="text-xl font-bold">
                  {result.isSpecial
                    ? "You get another chance!"
                    : result.rewardType === "points" && result.points
                    ? `You Won ${result.points} Points!`
                    : result.rewardType === "discount"
                    ? `You Won a ${result.rewardValue} Discount!`
                    : result.rewardType === "offer"
                    ? `You Won: ${result.rewardValue}!`
                    : "Better Luck Next Time!"}
                </h3>

                {result.isSpecial ? (
                  <Button onClick={resetCard} className="btn-game-primary">
                    Try Again!
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={handleFinish}
                      className="btn-game-success w-full"
                    >
                      Continue
                    </Button>

                    {(result.rewardType === "discount" ||
                      result.rewardType === "offer") && (
                      <Link to="/my-rewards">
                        <Button variant="outline" className="w-full mt-3">
                          View My Rewards
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Instructions */}
      <div className="mobile-section">
        <Card className="game-card">
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ul className="text-sm text-foreground-muted space-y-1">
            <li>• Use your finger to scratch the silver area</li>
            <li>• Scratch at least 40% to reveal your prize</li>
            <li>• Collect points or get another chance!</li>
            <li>• Each card can only be played once</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default ScratchCard;
