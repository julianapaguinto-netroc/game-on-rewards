import React, { createContext, useContext, useState, ReactNode } from "react";

// Context for managing game state
export interface GameState {
  points: number;
  availableChallenges: Challenge[];
  completedChallenges: Challenge[];
  products: Product[];
  userRewards: UserReward[];
  lastReceivedReward?: UserReward;
}

export interface UserReward {
  id: string;
  type: "discount" | "points" | "offer" | "none";
  title: string;
  description: string;
  company: string;
  value: string;
  isActive: boolean;
  expiryDate: string;
  dateReceived: string;
  source?: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: "spin-wheel" | "scratch-card" | "quiz" | "slot-machine";
  isCompleted: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  cost: number;
  image: string;
  category: string;
}

export interface GameContextType {
  gameState: GameState;
  addPoints: (amount: number) => void;
  completeChallenge: (challengeId: string, reward?: UserReward) => void;
  redeemProduct: (productId: string) => void;
  resetChallenge: (challengeId: string) => void;
  addUserReward: (reward: UserReward) => void;
  clearLastReceivedReward: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Default challenge data
const defaultChallenges: Challenge[] = [
  {
    id: "spin-wheel",
    name: "Spin the Wheel",
    description: "Spin the wheel and win exciting rewards!",
    type: "spin-wheel",
    isCompleted: false,
  },
  {
    id: "scratch-card",
    name: "Scratch Card",
    description: "Scratch to reveal your prize!",
    type: "scratch-card",
    isCompleted: false,
  },
  {
    id: "quiz",
    name: "Quiz Challenge",
    description: "Test your knowledge and earn points!",
    type: "quiz",
    isCompleted: false,
  },
  {
    id: "slot-machine",
    name: "Slot Machine",
    description: "Pull the lever and match the symbols!",
    type: "slot-machine",
    isCompleted: false,
  },
];

// Default product data
const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Premium Shampoo",
    brand: "Beauty Co",
    description: "Luxurious shampoo for healthy hair",
    cost: 500,
    image: "/placeholder.svg",
    category: "Beauty",
  },
  {
    id: "2",
    name: "Smartphone Case",
    brand: "Tech Plus",
    description: "Protective case for your smartphone",
    cost: 750,
    image: "/placeholder.svg",
    category: "Electronics",
  },
  {
    id: "3",
    name: "$25 Gift Voucher",
    brand: "Shopping Mall",
    description: "$25 gift voucher for any store",
    cost: 1000,
    image: "/placeholder.svg",
    category: "Shopping",
  },
  {
    id: "4",
    name: "Coffee Subscription",
    brand: "Bean & Brew",
    description: "One month premium coffee subscription",
    cost: 1200,
    image: "/placeholder.svg",
    category: "Food & Drink",
  },
  {
    id: "5",
    name: "Fitness Tracker",
    brand: "FitLife",
    description: "Track your daily activities and health",
    cost: 2000,
    image: "/placeholder.svg",
    category: "Health & Fitness",
  },
];

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>({
    points: 250,
    availableChallenges: defaultChallenges,
    completedChallenges: [],
    products: defaultProducts,
    userRewards: [],
  });

  const addPoints = (amount: number) => {
    setGameState((prev) => ({
      ...prev,
      points: prev.points + amount,
    }));
  };

  const completeChallenge = (challengeId: string, reward?: UserReward) => {
    setGameState((prev) => {
      const challenge = prev.availableChallenges.find(
        (c) => c.id === challengeId
      );
      if (!challenge || challenge.isCompleted) return prev;

      const updatedChallenge = { ...challenge, isCompleted: true };
      return {
        ...prev,
        availableChallenges: prev.availableChallenges.map((c) =>
          c.id === challengeId ? updatedChallenge : c
        ),
        completedChallenges: [...prev.completedChallenges, updatedChallenge],
        userRewards: reward ? [...prev.userRewards, reward] : prev.userRewards,
        lastReceivedReward: reward || prev.lastReceivedReward,
      };
    });
  };

  const clearLastReceivedReward = () => {
    setGameState((prev) => ({
      ...prev,
      lastReceivedReward: undefined,
    }));
  };

  const redeemProduct = (productId: string): boolean => {
    let redeemed = false;

    setGameState((prev) => {
      const product = prev.products.find((p) => p.id === productId);
      if (!product || prev.points < product.cost) return prev;

      redeemed = true;
      return {
        ...prev,
        points: prev.points - product.cost,
      };
    });

    return redeemed;
  };

  const resetChallenge = (challengeId: string) => {
    setGameState((prev) => {
      const challenge = prev.completedChallenges.find(
        (c) => c.id === challengeId
      );
      if (!challenge) return prev;

      const resetChallenge = { ...challenge, isCompleted: false };
      return {
        ...prev,
        availableChallenges: prev.availableChallenges.map((c) =>
          c.id === challengeId ? resetChallenge : c
        ),
        completedChallenges: prev.completedChallenges.filter(
          (c) => c.id !== challengeId
        ),
      };
    });
  };

  const addUserReward = (reward: UserReward) => {
    setGameState((prev) => ({
      ...prev,
      userRewards: [...prev.userRewards, reward],
    }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        addPoints,
        completeChallenge,
        redeemProduct,
        resetChallenge,
        addUserReward,
        clearLastReceivedReward,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

// Types are already exported above
