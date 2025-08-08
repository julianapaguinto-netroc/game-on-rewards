import { useState } from "react";
import { useGame, UserReward } from "@/context/GameContext";
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
  rewardType?: "points" | "discount" | "offer" | "none";
  rewardValue?: string;
}

const wheelSegments: WheelSegment[] = [
  {
    id: 1,
    text: "100 pts",
    points: 100,
    color: "#e74c3c",
    rewardType: "points",
  },
  {
    id: 2,
    text: "Spin Again",
    points: 0,
    color: "#3498db",
    isSpecial: true,
    rewardType: "none",
  },
  {
    id: 3,
    text: "500 pts",
    points: 500,
    color: "#f39c12",
    rewardType: "points",
  },
  {
    id: 4,
    text: "Better Luck Next Time",
    points: 0,
    color: "#95a5a6",
    rewardType: "none",
  },
  {
    id: 5,
    text: "1000 pts",
    points: 1000,
    color: "#2ecc71",
    rewardType: "points",
  },
  {
    id: 6,
    text: "250 pts",
    points: 250,
    color: "#9b59b6",
    rewardType: "points",
  },
  {
    id: 7,
    text: "20% Off Market A&B",
    points: 0,
    color: "#b65959",
    rewardType: "discount",
    rewardValue: "20%",
  },
  {
    id: 8,
    text: "50% Off Lazada",
    points: 0,
    color: "#59abb6ff",
    rewardType: "discount",
    rewardValue: "50%",
  },
];

// Helper functions for text handling
const calculateFontSize = (text: string, lineCount: number): number => {
  const baseSize = 9;
  const minSize = 4;
  const maxSize = 11;
  
  // More aggressive sizing based on text length and line count
  if (lineCount > 1) {
    return Math.max(minSize, baseSize - 3);
  }
  
  if (text.length <= 6) return maxSize;
  if (text.length <= 10) return baseSize;
  if (text.length <= 15) return baseSize - 2;
  if (text.length <= 20) return baseSize - 3;
  return minSize;
};

const breakTextIntoLines = (text: string): string[] => {
  // More aggressive line breaking for wheel segments
  const maxCharsPerLine = 8;
  
  if (text.length <= maxCharsPerLine) return [text];
  
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Word is too long, break it
        lines.push(word.substring(0, maxCharsPerLine));
        currentLine = word.substring(maxCharsPerLine);
      }
    }
  }
  
  if (currentLine) lines.push(currentLine);
  
  return lines;
};

const getTextRadius = (textLines: string[]): number => {
  if (textLines.length === 1) return 65;
  if (textLines.length === 2) return 58;
  return 50; // 3+ lines
};

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
    const totalSpins = 7;

    // Calculate the target angle to align the selected segment with the arrow
    // The arrow points up (top), so we need to rotate so the selected segment is at the top
    const targetSegmentAngle = randomIndex * segmentAngle + segmentAngle / 2;
    const targetAngle = 360 * totalSpins + (360 - targetSegmentAngle);
    
    // Store the starting rotation for this spin
    const startRotation = rotation;

    let start = performance.now();
    const duration = 4000;

    const animate = (timestamp: number) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      const currentRotation = startRotation + targetAngle * easedProgress;
      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const finalRotation = startRotation + targetAngle;
        setRotation(finalRotation);
        setResult(landedSegment);

        let description = "";
        if (landedSegment.rewardType === "points") {
          description = `You earned ${landedSegment.points} points!`;
          addPoints(landedSegment.points);
        } else if (landedSegment.rewardType === "discount") {
          description = `You won a ${landedSegment.rewardValue} discount!`;
        } else if (landedSegment.isSpecial) {
          resetChallenge("spin-wheel");
        }

        toast.success(`🎯 ${landedSegment.text}`, { description });

        if (!landedSegment.isSpecial) {
          if (
            landedSegment.rewardType === "discount" &&
            landedSegment.rewardValue
          ) {
            const reward: UserReward = {
              id: crypto.randomUUID(),
              type: "discount" as const,
              title: `${landedSegment.rewardValue} Discount`,
              description: `You earned a ${landedSegment.rewardValue} discount from the Spin Wheel!`,
              company: "Spin Rewards",
              value: landedSegment.rewardValue,
              isActive: true,
              expiryDate: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(), // 7 days
              dateReceived: new Date().toISOString(),
              source: "spin-wheel",
            };
            completeChallenge("spin-wheel", reward);
          } else if (
            landedSegment.rewardType === "points" &&
            landedSegment.points > 0
          ) {
            const reward: UserReward = {
              id: crypto.randomUUID(),
              type: "points" as const,
              title: `${landedSegment.points} Points`,
              description: `You earned ${landedSegment.points} points from the Spin Wheel!`,
              company: "Spin Rewards",
              value: `${landedSegment.points}`,
              isActive: true,
              expiryDate: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(), // 7 days
              dateReceived: new Date().toISOString(),
              source: "spin-wheel",
            };
            completeChallenge("spin-wheel", reward);
          } else {
            completeChallenge("spin-wheel");
          }
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
                  const textLines = breakTextIntoLines(segment.text);
                  const textRadius = getTextRadius(textLines);
                  const fontSize = calculateFontSize(segment.text, textLines.length);
                  
                  const textX = 100 + textRadius * Math.cos((textAngle * Math.PI) / 180);
                  const textY = 100 + textRadius * Math.sin((textAngle * Math.PI) / 180);

                  return (
                    <g key={`${index}-${segment.id}`}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 90 90 0 0 1 ${x2} ${y2} Z`}
                        fill={segment.color}
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      <g transform={`rotate(${textAngle}, ${textX}, ${textY})`}>
                        {textLines.map((line, lineIndex) => (
                          <text
                            key={lineIndex}
                            x={textX}
                            y={textY + (lineIndex - (textLines.length - 1) / 2) * (fontSize + 2)}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            fontSize={fontSize}
                            fontWeight="bold"
                            style={{
                              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                              paintOrder: "stroke fill",
                              stroke: "rgba(0,0,0,0.5)",
                              strokeWidth: "0.5px"
                            }}
                          >
                            {line}
                          </text>
                        ))}
                      </g>
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

            {/* Spin Button or Result */}
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

                <h2 className="text-2xl font-bold">
                  {result.isSpecial
                    ? "Spin Again!"
                    : result.rewardType === "points"
                    ? `You Won ${result.points} Points!`
                    : result.rewardType === "discount"
                    ? `You Won a ${result.rewardValue} Discount!`
                    : result.rewardType === "offer"
                    ? `You Won: ${result.rewardValue}`
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

      <div className="mobile-section">
        <Card className="game-card">
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ul className="text-sm text-foreground-muted space-y-1">
            <li>• Tap "Spin the Wheel" to start</li>
            <li>• Wait for the wheel to stop spinning</li>
            <li>• Collect your points or discounts</li>
            <li>• "Spin Again" gives you another chance!</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default SpinWheel;
