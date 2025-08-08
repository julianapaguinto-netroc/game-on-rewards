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
import MyRewards from "./pages/MyRewards";
import Commanders from "./pages/Commanders";
import CommanderDetail from "./pages/CommanderDetail";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
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
            <Route path="/" element={<Layout><Catalogue /></Layout>} />
            <Route path="/index" element={<Layout><Index /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/challenge/:id" element={<Layout><ChallengeDetail /></Layout>} />
            <Route path="/my-rewards" element={<Layout><MyRewards /></Layout>} />
            <Route path="/commanders" element={<Layout><Commanders /></Layout>} />
            <Route path="/commander/:id" element={<Layout><CommanderDetail /></Layout>} />
            <Route path="/game/spin-wheel" element={<SpinWheel />} />
            <Route path="/game/scratch-card" element={<ScratchCard />} />
            <Route path="/game/quiz" element={<Quiz />} />
            <Route path="/game/slot-machine" element={<SlotMachine />} />
            <Route path="/redemption-success/:productId" element={<Layout><RedemptionSuccess /></Layout>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;