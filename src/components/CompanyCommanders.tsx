import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { companiesData } from "@/data/companies";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const CompanyCommanders = () => {
  return (
    <div className="mobile-section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Company Commanders</h2>
        <Link to="/commanders">
          <Button variant="ghost" size="sm" className="text-primary">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        {companiesData.slice(0, 2).map((company) => (
          <Card key={company.id} className="game-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">{company.logo}</div>
              <h3 className="font-semibold text-lg">{company.name}</h3>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-foreground-muted font-medium">Sub-Companies:</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {company.subCompanies.map((subCompany) => (
                  <Link
                    key={subCompany.id}
                    to={`/commander/${subCompany.id}`}
                    className="flex-shrink-0"
                  >
                    <Card className="game-card border-l-4 border-l-primary hover:border-l-game-gold transition-colors min-w-[160px]">
                      <div className="flex items-center gap-2 p-3">
                        <div className="text-lg">{subCompany.logo}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{subCompany.name}</h4>
                          <p className="text-xs text-foreground-muted">
                            {subCompany.products.length} products
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
            
            <Link to="/commanders">
              <Button variant="outline" size="sm" className="w-full">
                View All {company.name} Companies
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompanyCommanders;