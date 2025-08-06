import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { companiesData } from "@/data/companies";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Coins, Gift } from "lucide-react";

const CommanderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { gameState } = useGame();

  // Find the sub-company
  const subCompany = companiesData
    .flatMap(company => company.subCompanies)
    .find(sub => sub.id === id);

  // Find parent company
  const parentCompany = companiesData.find(company =>
    company.subCompanies.some(sub => sub.id === id)
  );

  if (!subCompany || !parentCompany) {
    return (
      <div className="mobile-container bg-background min-h-screen">
        <div className="text-center mt-20">
          <h1 className="text-xl font-semibold">Company not found</h1>
          <Link to="/commanders">
            <Button className="mt-4">Back to Companies</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Header */}
      <div className="mobile-section">
        <div className="flex items-center justify-between mb-6">
          <Link to="/commanders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Coins className="text-game-gold w-5 h-5" />
            <span className="font-semibold">{gameState.points.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Company Header */}
      <div className="mobile-section">
        <Card className="game-card-elevated text-center">
          <div className="text-6xl mb-4">{subCompany.logo}</div>
          <h1 className="text-2xl font-bold mb-2">{subCompany.name}</h1>
          <p className="text-foreground-muted mb-2">
            Part of {parentCompany.name} {parentCompany.logo}
          </p>
          <p className="text-sm text-foreground-subtle">
            {subCompany.products.length} products available
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mobile-section">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card className="game-card">
              <h3 className="font-semibold mb-4">About {subCompany.name}</h3>
              <p className="text-foreground-muted mb-4">{subCompany.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-muted">Total Products</span>
                  <span className="font-semibold">{subCompany.products.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-muted">Min Points Required</span>
                  <span className="font-semibold text-game-gold">
                    {Math.min(...subCompany.products.map(p => p.pointsRequired))} pts
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-muted">Max Points Required</span>
                  <span className="font-semibold text-game-gold">
                    {Math.max(...subCompany.products.map(p => p.pointsRequired))} pts
                  </span>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="mt-6">
            <div className="space-y-4">
              {subCompany.products.map((product) => (
                <Card key={product.id} className="game-card">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{product.image}</div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-foreground-muted mb-3">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-game-gold" />
                          <span className="font-semibold text-game-gold">
                            {product.pointsRequired.toLocaleString()} pts
                          </span>
                        </div>
                        
                        <Button
                          size="sm"
                          variant={gameState.points >= product.pointsRequired ? "default" : "outline"}
                          disabled={gameState.points < product.pointsRequired}
                          className={gameState.points >= product.pointsRequired ? "btn-game-primary" : ""}
                        >
                          <Gift className="w-4 h-4 mr-1" />
                          {gameState.points >= product.pointsRequired ? "Redeem" : "Need More"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommanderDetail;