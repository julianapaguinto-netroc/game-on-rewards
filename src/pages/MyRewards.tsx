import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gift, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const MyRewards = () => {
  const { gameState } = useGame();

  const activeRewards = gameState.userRewards.filter(reward => reward.isActive);
  const expiredRewards = gameState.userRewards.filter(reward => !reward.isActive);

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const timeDiff = expiry.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 7 && daysDiff > 0;
  };

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Header */}
      <div className="mobile-section">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <h1 className="text-xl font-bold">My Rewards</h1>
          <div></div>
        </div>
      </div>

      {/* Active Rewards */}
      <div className="mobile-section">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-game-gold" />
          Active Rewards ({activeRewards.length})
        </h2>
        
        {activeRewards.length === 0 ? (
          <Card className="game-card text-center py-8">
            <Gift className="w-12 h-12 mx-auto mb-4 text-foreground-muted" />
            <p className="text-foreground-muted">No active rewards yet</p>
            <p className="text-sm text-foreground-subtle mt-2">
              Complete games to earn rewards!
            </p>
            <Link to="/">
              <Button className="mt-4 btn-game-primary">
                Play Games
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeRewards.map((reward) => (
              <Card key={reward.id} className="game-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold">{reward.title}</h3>
                    <p className="text-sm text-foreground-muted">{reward.company}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant={isExpiringSoon(reward.expiryDate) ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {isExpiringSoon(reward.expiryDate) ? "Expiring Soon" : "Active"}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm mb-3">{reward.description}</p>
                
                <div className="flex items-center justify-between text-xs text-foreground-muted">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Expires: {new Date(reward.expiryDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Received: {new Date(reward.dateReceived).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-game-gold">{reward.value}</span>
                    <Button 
                      size="sm" 
                      className="btn-game-primary"
                      disabled={isExpired(reward.expiryDate)}
                    >
                      Redeem Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Expired Rewards */}
      {expiredRewards.length > 0 && (
        <div className="mobile-section">
          <h2 className="text-lg font-semibold mb-4 text-foreground-muted">
            Expired Rewards ({expiredRewards.length})
          </h2>
          
          <div className="space-y-3">
            {expiredRewards.map((reward) => (
              <Card key={reward.id} className="game-card opacity-60">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground-muted">{reward.title}</h3>
                    <p className="text-sm text-foreground-subtle">{reward.company}</p>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    Expired
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs text-foreground-subtle">
                  <span>Value: {reward.value}</span>
                  <span>Expired: {new Date(reward.expiryDate).toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRewards;