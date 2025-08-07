import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Settings, Zap } from "lucide-react";
import { UserRole, FilterOptions } from "@/lib/types";
import { SearchFilters } from "@shared/schema";
import { GlobalHeaderFilter } from "@/components/global-header-filter";

const quickFilters = [
  "Luxury Residential",
  "High ROI Projects", 
  "Waterfront Properties",
  "Off-Plan Projects",
  "Ready to Move"
];

export default function SearchFilter() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [globalFilters, setGlobalFilters] = useState<{ country?: string; sector?: string }>({});

  useEffect(() => {
    const role = localStorage.getItem("selectedRole") as UserRole;
    if (role) {
      setSelectedRole(role);
    }
    
    // Load global filters from localStorage
    const savedCountry = localStorage.getItem("globalCountryFilter");
    const savedSector = localStorage.getItem("globalSectorFilter");
    
    if (savedCountry || savedSector) {
      setGlobalFilters({
        country: savedCountry || undefined,
        sector: savedSector || undefined,
      });
    }
  }, []);

  const { data: filterOptions, isLoading: isLoadingOptions } = useQuery<FilterOptions>({
    queryKey: ["/api/filter-options"],
  });

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "All" || value === "" ? undefined : value
    }));
  };

  const handleSearch = () => {
    // Combine global filters with local filters
    const combinedFilters = {
      ...filters,
      ...globalFilters,
    };
    
    // Store combined search filters in localStorage
    localStorage.setItem("searchFilters", JSON.stringify(combinedFilters));
    
    // Navigate to role-specific dashboard
    const currentRole = localStorage.getItem("selectedRole");
    const roleBasedDashboard = currentRole ? `/${currentRole}-dashboard` : "/dashboard";
    setLocation(roleBasedDashboard);
  };

  const handleGlobalFilterChange = (newGlobalFilters: { country?: string; sector?: string }) => {
    setGlobalFilters(newGlobalFilters);
  };

  const handleQuickFilter = (filter: string) => {
    let quickFilterParams: Partial<SearchFilters> = {};
    
    switch (filter) {
      case "Luxury Residential":
        quickFilterParams = { projectType: "Residential", isLuxury: true };
        break;
      case "High ROI Projects":
        quickFilterParams = { minInvestment: 50 };
        break;
      case "Waterfront Properties":
        quickFilterParams = { isWaterfront: true };
        break;
      case "Off-Plan Projects":
        quickFilterParams = { status: "Planning" };
        break;
      case "Ready to Move":
        quickFilterParams = { status: "Completed" };
        break;
    }
    
    setFilters(prev => ({ ...prev, ...quickFilterParams }));
  };

  if (isLoadingOptions) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading filter options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Global Header Filter */}
      <GlobalHeaderFilter 
        onFilterChange={handleGlobalFilterChange}
        initialFilters={globalFilters}
      />
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Project Discovery</h1>
              <p className="text-slate-600 mt-1">Find projects that match your specific criteria</p>
            </div>
            {selectedRole && (
              <div className="text-sm text-slate-500">
                Role: <span className="capitalize font-medium">{selectedRole}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Search Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              Advanced Search Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <Label>Project Type</Label>
                <Select onValueChange={(value) => handleFilterChange("projectType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    {filterOptions?.projectTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>City</Label>
                <Select onValueChange={(value) => handleFilterChange("city", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Cities</SelectItem>
                    {filterOptions?.cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>District</Label>
                <Select onValueChange={(value) => handleFilterChange("district", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Districts</SelectItem>
                    {filterOptions?.districts.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Project Status</Label>
                <Select onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    {filterOptions?.statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              <div>
                <Label>Investment Range (USD Millions)</Label>
                <div className="flex space-x-2 mt-1">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    onChange={(e) => handleFilterChange("minInvestment", Number(e.target.value))}
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    onChange={(e) => handleFilterChange("maxInvestment", Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <Label>Project Size (sq ft)</Label>
                <Select onValueChange={(value) => handleFilterChange("projectSize", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Size">Any Size</SelectItem>
                    <SelectItem value="under_50k">{"< 50,000"}</SelectItem>
                    <SelectItem value="50k_200k">50,000 - 200,000</SelectItem>
                    <SelectItem value="200k_500k">200,000 - 500,000</SelectItem>
                    <SelectItem value="500k_plus">500,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Completion Timeline</Label>
                <Select onValueChange={(value) => handleFilterChange("completionTimeline", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Timeline">Any Timeline</SelectItem>
                    <SelectItem value="Within 1 Year">Within 1 Year</SelectItem>
                    <SelectItem value="1-2 Years">1-2 Years</SelectItem>
                    <SelectItem value="2-5 Years">2-5 Years</SelectItem>
                    <SelectItem value="5+ Years">5+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-8 flex justify-center">
              <Button size="lg" onClick={handleSearch}>
                <Search className="mr-2" size={20} />
                Find Projects
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Filters */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-md flex items-center">
              <Zap className="w-4 h-4 mr-2 text-orange-500" />
              Quick Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  onClick={() => handleQuickFilter(filter)}
                >
                  {filter}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
