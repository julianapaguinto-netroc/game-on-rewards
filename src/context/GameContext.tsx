import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameState {
  points: number;
  completedChallenges: string[];
  availableChallenges: Challenge[];
  products: Product[];
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'spin-wheel' | 'scratch-card' | 'quiz' | 'slot-machine';
  isCompleted: boolean;
  maxPlays: number;
  currentPlays: number;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  cost: number;
  image: string;
  category: string;
}

interface GameContextType {
  gameState: GameState;
  addPoints: (points: number) => void;
  completeChallenge: (challengeId: string) => void;
  redeemProduct: (productId: string) => boolean;
  resetChallenge: (challengeId: string) => void;
}

const defaultChallenges: Challenge[] = [
  {
    id: 'spin-wheel',
    name: 'Spin the Wheel',
    description: 'Spin the wheel and win exciting rewards!',
    type: 'spin-wheel',
    isCompleted: false,
    maxPlays: 1,
    currentPlays: 0,
  },
  {
    id: 'scratch-card',
    name: 'Scratch Card',
    description: 'Scratch to reveal your prize!',
    type: 'scratch-card',
    isCompleted: false,
    maxPlays: 1,
    currentPlays: 0,
  },
  {
    id: 'quiz',
    name: 'Quiz Challenge',
    description: 'Test your knowledge and earn points!',
    type: 'quiz',
    isCompleted: false,
    maxPlays: 1,
    currentPlays: 0,
  },
  {
    id: 'slot-machine',
    name: 'Slot Machine',
    description: 'Pull the lever and match the symbols!',
    type: 'slot-machine',
    isCompleted: false,
    maxPlays: 1,
    currentPlays: 0,
  },
];

const defaultProducts: Product[] = [
  {
    id: '1',
    name: '20% Off Coffee',
    brand: 'Coffee Shop',
    description: 'Get 20% off your next coffee purchase at any participating coffee shop.',
    cost: 500,
    image: '/placeholder.svg',
    category: 'Food & Drink',
  },
  {
    id: '2',
    name: 'Free Movie Ticket',
    brand: 'Cinema Plus',
    description: 'Enjoy a free movie ticket for any regular screening.',
    cost: 1000,
    image: '/placeholder.svg',
    category: 'Entertainment',
  },
  {
    id: '3',
    name: '$10 Gift Card',
    brand: 'Shopping Mall',
    description: '$10 gift card valid at any store in the shopping mall.',
    cost: 1500,
    image: '/placeholder.svg',
    category: 'Shopping',
  },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    points: 250, // Starting points for demo
    completedChallenges: [],
    availableChallenges: defaultChallenges,
    products: defaultProducts,
  });

  const addPoints = (points: number) => {
    setGameState(prev => ({
      ...prev,
      points: prev.points + points,
    }));
  };

  const completeChallenge = (challengeId: string) => {
    setGameState(prev => ({
      ...prev,
      availableChallenges: prev.availableChallenges.map(challenge =>
        challenge.id === challengeId
          ? { ...challenge, isCompleted: true, currentPlays: challenge.currentPlays + 1 }
          : challenge
      ),
    }));
  };

  const resetChallenge = (challengeId: string) => {
    setGameState(prev => ({
      ...prev,
      availableChallenges: prev.availableChallenges.map(challenge =>
        challenge.id === challengeId
          ? { ...challenge, isCompleted: false, currentPlays: 0 }
          : challenge
      ),
    }));
  };

  const redeemProduct = (productId: string): boolean => {
    const product = gameState.products.find(p => p.id === productId);
    if (!product || gameState.points < product.cost) {
      return false;
    }

    setGameState(prev => ({
      ...prev,
      points: prev.points - product.cost,
    }));

    return true;
  };

  return (
    <GameContext.Provider value={{
      gameState,
      addPoints,
      completeChallenge,
      redeemProduct,
      resetChallenge,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export type { Challenge, Product };