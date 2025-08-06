import { useState } from "react";
import { companiesData } from "@/data/companies";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Commanders = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = companiesData.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.subCompanies.some(sub => 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
          
          <h1 className="text-xl font-bold">Company Commanders</h1>
          <div></div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Companies List */}
      <div className="mobile-section">
        <div className="space-y-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="game-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{company.logo}</div>
                <h2 className="text-xl font-bold">{company.name}</h2>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground-muted">Sub-Companies</h3>
                <div className="grid gap-3">
                  {company.subCompanies.map((subCompany) => (
                    <Link
                      key={subCompany.id}
                      to={`/commander/${subCompany.id}`}
                    >
                      <Card className="game-card border-l-4 border-l-primary hover:border-l-game-gold transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{subCompany.logo}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{subCompany.name}</h4>
                            <p className="text-sm text-foreground-muted">
                              {subCompany.description}
                            </p>
                            <p className="text-xs text-foreground-subtle mt-1">
                              {subCompany.products.length} products available
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {filteredCompanies.length === 0 && (
          <Card className="game-card text-center py-8">
            <Search className="w-12 h-12 mx-auto mb-4 text-foreground-muted" />
            <p className="text-foreground-muted">No companies found</p>
            <p className="text-sm text-foreground-subtle mt-2">
              Try adjusting your search terms
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Commanders;