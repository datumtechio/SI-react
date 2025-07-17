import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, ChartLine, HardHat, Lightbulb, DraftingCompass, Truck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole, roleColors } from "@/lib/types";

const roles = [
  {
    id: "investor" as UserRole,
    title: "Investor",
    description: "Investment opportunities & market trends",
    icon: ChartLine,
    features: ["ROI Analysis", "Market Comparisons", "Investment Reports"],
    color: "investor",
  },
  {
    id: "contractor" as UserRole,
    title: "Contractor",
    description: "Active projects & bidding opportunities",
    icon: HardHat,
    features: ["Project Pipeline", "Tender Alerts", "Construction Timeline"],
    color: "contractor",
  },
  {
    id: "consultant" as UserRole,
    title: "Consultant",
    description: "Market insights & advisory data",
    icon: Lightbulb,
    features: ["Market Analysis", "Feasibility Studies", "Trend Reports"],
    color: "consultant",
  },
  {
    id: "developer" as UserRole,
    title: "Developer",
    description: "Development sites & market gaps",
    icon: DraftingCompass,
    features: ["Site Analysis", "Zoning Data", "Competition Mapping"],
    color: "developer",
  },
  {
    id: "supplier" as UserRole,
    title: "Supplier",
    description: "Materials & equipment for projects",
    icon: Truck,
    features: ["Supply Opportunities", "Material Demand", "Project Schedules"],
    color: "supplier",
  },
];

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    if (selectedRole) {
      // Store role in localStorage for persistence
      localStorage.setItem("selectedRole", selectedRole);
      setLocation("/search");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
              <Building className="text-primary" size={48} />
              Sector Intelligence
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Professional project discovery and market intelligence platform for real estate and development professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-12">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              
              return (
                <Card
                  key={role.id}
                  className={cn(
                    "role-card border-2 border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer",
                    isSelected && "border-primary bg-blue-50 selected"
                  )}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardContent className="p-8 text-center h-full flex flex-col">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${roleColors[role.id]}10` }}
                    >
                      <Icon 
                        size={24} 
                        style={{ color: roleColors[role.id] }}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{role.title}</h3>
                    <div className="h-12 flex items-center justify-center mb-4">
                      <p className="text-slate-600 text-sm">{role.description}</p>
                    </div>
                    <ul className="text-xs text-slate-500 space-y-1 mt-auto">
                      {role.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedRole}
              className={cn(
                "px-8 py-3 text-lg",
                !selectedRole && "opacity-50 cursor-not-allowed"
              )}
            >
              <ArrowRight className="mr-2" size={20} />
              {selectedRole ? "Continue to Search" : "Select Your Role to Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
