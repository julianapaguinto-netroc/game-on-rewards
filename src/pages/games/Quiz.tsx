import { useState } from "react";
import { useGame, UserReward } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Jupiter", "Saturn", "Mars"],
    correctAnswer: 1,
    points: 200,
  },
  {
    id: 2,
    question: "Which element has the chemical symbol 'Au'?",
    options: ["Silver", "Gold", "Aluminum", "Argon"],
    correctAnswer: 1,
    points: 300,
  },
  {
    id: 3,
    question: "In which year did the first iPhone release?",
    options: ["2006", "2007", "2008", "2009"],
    correctAnswer: 1,
    points: 250,
  },
];

const Quiz = () => {
  const { addPoints, completeChallenge } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const navigate = useNavigate();

  const currentQ = questions[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const isCorrect = answerIndex === currentQ.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
      setTotalPoints(totalPoints + currentQ.points);
      toast.success(`Correct! +${currentQ.points} points! 🎉`);
    } else {
      toast.error("Wrong answer! 😔");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizComplete(true);
    // Only add points that were earned from correct answers
    if (totalPoints > 0) {
      addPoints(totalPoints);

      const reward: UserReward = {
        id: crypto.randomUUID(),
        type: "points",
        title: `${totalPoints} Points from Quiz`,
        description: `You earned ${totalPoints} points by completing the quiz!`,
        company: "Quiz Challenge",
        value: totalPoints.toString(),
        isActive: true,
        expiryDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // expires in 7 days
        dateReceived: new Date().toISOString(),
        source: "quiz",
      };

      completeChallenge("quiz", reward);
    }

    if (score === questions.length) {
      toast.success(`Perfect score! +${totalPoints} points! 🏆`);
    } else if (score >= questions.length / 2) {
      toast.success(`Great job! +${totalPoints} points! 👏`);
    } else if (totalPoints > 0) {
      toast.success(`Good effort! +${totalPoints} points! 📚`);
    } else {
      toast.info("Better luck next time! Keep learning! 📚");
    }
  };

  const handleFinish = () => {
    navigate("/");
  };

  if (isQuizComplete) {
    return (
      <div className="mobile-container bg-background min-h-screen">
        <div className="mobile-section">
          <Card className="game-card-elevated text-center">
            <div className="text-6xl mb-4">
              {score === questions.length
                ? "🏆"
                : score >= questions.length / 2
                ? "🎉"
                : "📚"}
            </div>

            <h1 className="text-2xl font-bold mb-2">Quiz Complete!</h1>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background-secondary rounded-xl">
                  <div className="text-2xl font-bold text-brand-primary">
                    {score}
                  </div>
                  <div className="text-sm text-foreground-muted">Correct</div>
                </div>
                <div className="p-4 bg-background-secondary rounded-xl">
                  <div className="text-2xl font-bold text-game-gold">
                    {totalPoints}
                  </div>
                  <div className="text-sm text-foreground-muted">Points</div>
                </div>
              </div>

              <p className="text-foreground-muted">
                You answered {score} out of {questions.length} questions
                correctly!
              </p>

              <Button
                onClick={handleFinish}
                className="btn-game-success w-full"
              >
                Continue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Header */}
      <div className="mobile-section">
        <div className="flex items-center justify-between mb-6">
          <Link to="/challenge/quiz">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <h1 className="text-xl font-semibold">🧠 Quiz Challenge</h1>
        </div>

        {/* Show possible points */}
        <div className="text-center mb-4">
          <p className="text-sm text-foreground-muted">
            Perfect Score:{" "}
            <span className="font-semibold text-brand-primary">
              {questions.reduce((sum, q) => sum + q.points, 0)} points
            </span>
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mobile-section">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-foreground-muted">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-semibold text-game-gold">
            +{currentQ.points} pts
          </span>
        </div>

        <div className="w-full bg-background-secondary rounded-full h-2 mb-6">
          <div
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mobile-section">
        <Card className="game-card-elevated">
          <h2 className="text-lg font-semibold mb-6 text-center">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              let buttonClass =
                "w-full p-4 text-left border-2 rounded-xl transition-all duration-200";

              if (!isAnswered) {
                buttonClass +=
                  " border-border hover:border-brand-primary hover:bg-background-secondary";
              } else {
                if (index === currentQ.correctAnswer) {
                  buttonClass +=
                    " border-game-success bg-game-success/10 text-game-success";
                } else if (
                  index === selectedAnswer &&
                  index !== currentQ.correctAnswer
                ) {
                  buttonClass +=
                    " border-game-danger bg-game-danger/10 text-game-danger";
                } else {
                  buttonClass +=
                    " border-border bg-background-secondary/50 text-foreground-muted";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {isAnswered && (
                      <>
                        {index === currentQ.correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-game-success" />
                        )}
                        {index === selectedAnswer &&
                          index !== currentQ.correctAnswer && (
                            <XCircle className="w-5 h-5 text-game-danger" />
                          )}
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-6 text-center">
              <Button onClick={handleNextQuestion} className="btn-game-primary">
                {currentQuestion < questions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Current Score */}
      <div className="mobile-section">
        <Card className="game-card">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-foreground-muted">
                Current Score
              </span>
              <div className="font-semibold">
                {score}/{currentQuestion + (isAnswered ? 1 : 0)}
              </div>
            </div>
            <div>
              <span className="text-sm text-foreground-muted">
                Points Earned
              </span>
              <div className="font-semibold text-game-gold">{totalPoints}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
