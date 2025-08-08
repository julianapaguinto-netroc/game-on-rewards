import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { companiesData } from "@/data/companies";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronRightCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const CompanyCommanders = () => {
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scroll = (id: string, direction: "left" | "right") => {
    const container = scrollRefs.current[id];
    if (container) {
      container.scrollBy({
        left: direction === "right" ? 200 : -200,
        behavior: "smooth",
      });
    }
  };

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
            {/* Company Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">{company.logo}</div>
              <h3 className="font-semibold text-lg">{company.name}</h3>
            </div>

            {/* Sub-Companies Section */}
            <div className="space-y-2 mb-4">
              <p className="text-sm text-foreground-muted font-medium">
                Sub-Companies:
              </p>
              <div className="relative">
                {/* Left Chevron */}
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background shadow-md p-1 rounded-full"
                  onClick={() => scroll(String(company.id), "left")}
                >
                  <ChevronLeft />
                </button>

                {/* Scrollable row of subcompanies */}
                <div
                  ref={(el) => (scrollRefs.current[company.id] = el)}
                  className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-6 py-2"
                >
                  {company.subCompanies.map((subCompany) => (
                    <Link
                      key={subCompany.id}
                      to={`/commander/${subCompany.id}`}
                      className="flex flex-col items-center text-center w-20 flex-shrink-0"
                    >
                      {/* Circle Logo */}
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl overflow-hidden mb-1">
                        {subCompany.logo}
                      </div>

                      {/* Store Name */}
                      <p className="text-xs font-medium max-w-[4.5rem] truncate">
                        {subCompany.name}
                      </p>
                    </Link>
                  ))}
                </div>

                {/* Right Chevron */}
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background shadow-md p-1 rounded-full"
                  onClick={() => scroll(String(company.id), "right")}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>

            {/* Footer Button */}
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
