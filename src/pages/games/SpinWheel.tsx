import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface WheelSegment {
  id: number;
  text: string;
  points: number;
  color: string;
  isSpecial?: boolean;
}

const wheelSegments: WheelSegment[] = [
  { id: 1, text: "100 pts", points: 100, color: "#e74c3c" },
  { id: 2, text: "Spin Again", points: 0, color: "#3498db", isSpecial: true },
  { id: 3, text: "500 pts", points: 500, color: "#f39c12" },
  { id: 4, text: "Better luck", points: 0, color: "#95a5a6" },
  { id: 5, text: "1000 pts", points: 1000, color: "#2ecc71" },
  { id: 6, text: "250 pts", points: 250, color: "#9b59b6" },
];

const SpinWheel = () => {
  const { addPoints, completeChallenge, resetChallenge } = useGame();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [rotation, setRotation] = useState(0);
  const navigate = useNavigate();

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const randomIndex = Math.floor(Math.random() * wheelSegments.length);
    const landedSegment = wheelSegments[randomIndex];
    const segmentAngle = 360 / wheelSegments.length;

    const totalSpins = 6;
    const targetAngle =
      360 * totalSpins +
      (360 - (randomIndex * segmentAngle + segmentAngle / 2));

    let start = performance.now();
    const duration = 4000;

    const animate = (timestamp: number) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      const currentRotation = rotation + targetAngle * easedProgress;
      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setRotation(rotation + targetAngle);
        setResult(landedSegment);

        toast.success(`🎯 ${landedSegment.text}`, {
          description:
            landedSegment.points > 0
              ? `You earned ${landedSegment.points} points!`
              : undefined,
        });

        if (landedSegment.points > 0) {
          addPoints(landedSegment.points);
        } else if (landedSegment.isSpecial) {
          resetChallenge("spin-wheel");
        }

        if (!landedSegment.isSpecial) {
          completeChallenge("spin-wheel");
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const handleFinish = () => {
    navigate("/");
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      <div className="mobile-section">
        <div className="flex items-center justify-between mb-6">
          <Link to="/challenge/spin-wheel">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">🎯 Spin the Wheel</h1>
        </div>
      </div>

      <div className="mobile-section">
        <Card className="game-card-elevated">
          <div className="relative flex flex-col items-center">
            {/* Pointer */}
            <div className="absolute top-0 z-10 transform -translate-y-1 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[30px] border-l-transparent border-r-transparent border-t-white drop-shadow-xl"></div>
              <div className="w-2 h-6 bg-white rounded-b-full drop-shadow-lg -mt-1"></div>
            </div>

            {/* Wheel */}
            <div className="relative w-80 h-80 mx-auto mb-8">
              <svg
                className={`w-full h-full ${
                  isSpinning ? "drop-shadow-2xl" : "drop-shadow-lg"
                }`}
                style={{
                  transform: `rotate(${rotation - 90}deg)`,
                  transformOrigin: "center center",
                  transition: isSpinning ? "none" : "transform 0.5s ease-out",
                }}
                viewBox="0 0 200 200"
              >
                {wheelSegments.map((segment, index) => {
                  const angle = (360 / wheelSegments.length) * index;
                  const nextAngle = angle + 360 / wheelSegments.length;
                  const segmentAngle = 360 / wheelSegments.length;

                  const x1 = 100 + 90 * Math.cos((angle * Math.PI) / 180);
                  const y1 = 100 + 90 * Math.sin((angle * Math.PI) / 180);
                  const x2 = 100 + 90 * Math.cos((nextAngle * Math.PI) / 180);
                  const y2 = 100 + 90 * Math.sin((nextAngle * Math.PI) / 180);

                  const textAngle = angle + segmentAngle / 2;
                  const textX =
                    100 + 60 * Math.cos((textAngle * Math.PI) / 180);
                  const textY =
                    100 + 60 * Math.sin((textAngle * Math.PI) / 180);

                  return (
                    <g key={segment.id}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 90 90 0 0 1 ${x2} ${y2} Z`}
                        fill={segment.color}
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                        className="font-game"
                        transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                      >
                        {segment.text}
                      </text>
                    </g>
                  );
                })}
                <circle
                  cx="100"
                  cy="100"
                  r="15"
                  fill="#2c3e50"
                  stroke="#fff"
                  strokeWidth="3"
                />
              </svg>
            </div>

            {/* Spin Button */}
            {!result ? (
              <Button
                onClick={spinWheel}
                disabled={isSpinning}
                className="btn-game-primary text-xl py-6 px-8"
              >
                {isSpinning ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Spinning...
                  </div>
                ) : (
                  <>
                    <Zap className="w-6 h-6 mr-2" />
                    Spin the Wheel!
                  </>
                )}
              </Button>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-6xl">
                  {result.isSpecial ? "🎯" : result.points > 0 ? "🎉" : "😔"}
                </div>
                <h2 className="text-2xl font-bold">
                  {result.isSpecial
                    ? "Spin Again!"
                    : result.points > 0
                    ? `You Won ${result.points} Points!`
                    : "Better Luck Next Time!"}
                </h2>
                {result.isSpecial ? (
                  <Button
                    onClick={() => {
                      setResult(null);
                      setIsSpinning(false);
                    }}
                    className="btn-game-primary"
                  >
                    Spin Again!
                  </Button>
                ) : (
                  <Button onClick={handleFinish} className="btn-game-success">
                    Continue
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="mobile-section">
        <Card className="game-card">
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ul className="text-sm text-foreground-muted space-y-1">
            <li>• Tap "Spin the Wheel" to start</li>
            <li>• Wait for the wheel to stop spinning</li>
            <li>• Collect your points based on where it lands</li>
            <li>• "Spin Again" gives you another chance!</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default SpinWheel;
