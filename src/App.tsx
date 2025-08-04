import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import ChallengeDetail from "./pages/ChallengeDetail";
import SpinWheel from "./pages/games/SpinWheel";
import ScratchCard from "./pages/games/ScratchCard";
import Quiz from "./pages/games/Quiz";
import SlotMachine from "./pages/games/SlotMachine";
import RedemptionSuccess from "./pages/RedemptionSuccess";
import { GameProvider } from "./context/GameContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/challenge/:id" element={<ChallengeDetail />} />
            <Route path="/game/spin-wheel" element={<SpinWheel />} />
            <Route path="/game/scratch-card" element={<ScratchCard />} />
            <Route path="/game/quiz" element={<Quiz />} />
            <Route path="/game/slot-machine" element={<SlotMachine />} />
            <Route path="/redemption-success/:productId" element={<RedemptionSuccess />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;